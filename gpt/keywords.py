import dataclasses
import datetime as dt
from typing import Optional, Any

JSON = dict[str, Any]


# representation of what GPT converts a user query to
# these should correspond to stored img metadata from the DB
# this can be used to get an idea for how the DB should be structured
@dataclasses.dataclass
class Keywords:
    from_: dt.datetime
    to: dt.datetime
    location: Optional[str]
    subject: Optional[str]
    with_: list[str]

    @classmethod
    def from_dict(cls, d: dict) -> "Keywords":
        return Keywords(
            # convert %Y-%m-%d date strs to datetime objects
            # min date chosen for POSIX timestamp to be 0
            from_=dt.datetime.fromisoformat(d.get("from", "1970-01-01")),
            to=dt.datetime.fromisoformat(d.get("to", "9999-12-31")),
            location=d.get("location"),
            subject=d.get("subject"),
            with_=d.get("with", []),
        )


# convert str from gpt to JSON object
# assumes each key-value pair in the str is semicolon-delineated
# check `test_str` for an example of how this should be formatted
def parse_keywords(keywords: str) -> JSON:
    parsed_keywords: JSON = {}
    for kv_pair in keywords.split(";"):
        key, val = map(str.strip, kv_pair.split(":", 1))
        if val[0] == "[":  # list? useful for the `with` attribute
            parsed_keywords[key] = [item.strip() for item in val[1:-1].split(",")]
        else:
            parsed_keywords[key] = val
    # match format of .net DateOnly type
    parsed_keywords["from"] = parsed_keywords.get("from", "1970-01-01")
    parsed_keywords["to"] = parsed_keywords.get("to", "9999-12-31")
    return parsed_keywords


def date_to_dict(date: str) -> JSON:
    obj: dt.datetime = dt.datetime.fromisoformat(date)
    return {
        "year": obj.year,
        "month": obj.month,
        "day": obj.day,
        "dayOfWeek": obj.weekday(),
    }


if __name__ == "__main__":
    import sys
    import json

    test_str = "from:2023-06-01;to:2023-06-30;location:switzerland;subject:skiing;with:[snow, mountain]"
    keywords: JSON = parse_keywords(sys.argv[1] if len(sys.argv) > 1 else test_str)
    # parsed_keywords["from"] = date_to_dict(parsed_keywords.get("from", "1970-01-01"))
    # parsed_keywords["to"] = date_to_dict(parsed_keywords.get("to", "9999-12-31"))

    print(json.dumps(keywords))
