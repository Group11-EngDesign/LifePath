import requests
import urllib3
import keywords
import json
from keywords import JSON

URL = "https://localhost:7095/Values/api/ProcessData"
# ! NOTE: these 2 lines disable SSL verification
# this is ok in dev but unacceptable in production
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
VERIFY_CERT = False


def test_kws(kws: str) -> bytes:
    print(f"prompt done: {kws=!r}")
    parsed_kws: JSON = keywords.parse_keywords(kws)
    print(f"parse done: {parsed_kws=!r}")
    response = requests.post(URL, json=json.dumps(parsed_kws), verify=VERIFY_CERT)
    return response.content


if __name__ == "__main__":
    # uncomment this when you want to test while using gpt
    # just remember it costs money...
    # import main
    # testmsg: str = "Find those pictures from when I went skiing in the Alps last month"
    # kws: str = main.prompt_gpt(testmsg)

    test_suite = [
        "from:2022-01-01;to:2022-12-31;location:washington D.C.;subject:washington monument",
        "from:2023-06-01;to:2023-06-30;location:switzerland;subject:skiing;with:[snow, mountain]",
    ]
    for kws in test_suite:
        result = test_kws(kws)
        print(result.decode())
