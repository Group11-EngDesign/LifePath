from typing import Literal, TypedDict, NotRequired, Any

JSON = dict[str, Any]


class Message(TypedDict):
    role: Literal["system", "user", "assistant", "function"]
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
