from typing import Any, Literal, TypedDict, NotRequired
import openai
import sys
from config import credentials


class Message(TypedDict):
    role: Literal["system"] | Literal["user"] | Literal["assistant"]
    content: str
    name: NotRequired[str]


class Usage(TypedDict):
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int


class Choice(TypedDict):
    message: Message
    finish_reason: str
    index: int


class ChatCompletion(TypedDict):
    id: str
    object: str
    created: int
    model: str
    usage: Usage
    choices: list[Choice]


openai.api_key = credentials.GPT3_API_KEY

example_prompt: list[Message] = [
    # context
    {
        "role": "system",
        "content": "You extract relevant keywords in a machine-readable format that can be used to identify photos by their metadata.",
    },
    {
        "role": "system",
        "content": """If a given date is nonspecific, choose the widest range possible.
        For example, if they say '2015', assume that means 'from 2015-01-01 to 2015-12-31.'""",
    },
    {
        "role": "system",
        "content": "Today's date is July 29, 2023.",  # todo: update this and the examples below to use `datetime`
    },
    # few-shot prompting: show gpt what we want with example interactions instead of telling it
    {
        "role": "system",
        "name": "example_user",
        "content": "How many pictures do I have from 2015?",
    },
    {
        "role": "system",
        "name": "example_assistant",
        "content": "from:2015-01-01,to:2015-12-31",
    },
    {
        "role": "system",
        "name": "example_user",
        "content": "Show me photos from my trip to Italy last summer.",
    },
    {
        "role": "system",
        "name": "example_assistant",
        "content": "from:2022-06-01,to:2022-09-01,location:Italy,with:food vacation scenery",
    },
    {
        "role": "system",
        "name": "example_user",
        "content": "Show me pictures from my wedding day where my wife and I are smiling.",
    },
    {
        "role": "system",
        "name": "example_assistant",
        "content": "subject:wedding,with:bride and groom smiling",
    },
    {
        "role": "system",
        "name": "example_user",
        "content": "Find those pictures from when I went skiing in the Alps last month",
    },
    {
        "role": "system",
        "name": "example_assistant",
        "content": "from:2023-06-01,to:2023-06-30,location:switzerland,subject:skiing,with:snow mountain",
    },
    {
        "role": "system",
        "name": "example_user",
        "content": "Show me pictures I took of the Washington Monument two years ago.",
    },
    {
        "role": "system",
        "name": "example_assistant",
        "content": "from:2022-01-01,to:2022-12-31,location:washington D.C.,subject:washington monument",
    },
]

# expected: from:2020-01-01,to:2020-12-31,location:Australia,subject:kangaroo
test_msg: Message = {
    "role": "user",
    "content": "Show me photos from when I saw a kangaroo in Australia three years ago.",
}

# allow supplying test msgs from commandline
if len(sys.argv) > 1:
    test_msg["content"] = sys.argv[1]

# provide our example interactions + the new test msg
response: ChatCompletion = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=example_prompt + [test_msg],
    temperature=0,  # ensures responses are deterministic
)  # type: ignore

print(response, end="\n\n\n")
print(response["choices"][0]["message"]["content"])
