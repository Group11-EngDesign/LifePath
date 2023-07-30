import requests
import urllib3
import main
import keywords
import json
from keywords import JSON

URL = "https://localhost:7095/Values/api/ProcessData"

if __name__ == "__main__":
    # testmsg: str = "Find those pictures from when I went skiing in the Alps last month"
    # kws: str = main.prompt_gpt(testmsg)
    # kws = "from:2023-06-01;to:2023-06-30;location:Alps;subject:skiing"
    kws = "from:2023-06-01;to:2023-06-30;location:switzerland;subject:skiing;with:[snow, mountain]"
    print(f"prompt done: {kws=!r}")
    parsed_kws: JSON = keywords.parse_keywords(kws)
    print(f"parse done: {parsed_kws=!r}")

    # ! NOTE: these 2 lines disable SSL verification
    # this is ok in dev but unacceptable in production
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    response = requests.post(URL, json=json.dumps(parsed_kws), verify=False)

    result = response.content
    print(result)
