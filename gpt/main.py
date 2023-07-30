from typing import Tuple
import openai
import config.credentials
import gpt_types as t

openai.api_key = config.credentials.GPT3_API_KEY


# helper functions for building the prompt
def context(msg: str) -> t.Message:
    return {"role": "system", "content": msg}


def sample_interaction(user: str, gpt: str) -> Tuple[t.Message, t.Message]:
    return (
        {"role": "system", "name": "example_user", "content": user},
        {"role": "system", "name": "example_assistant", "content": gpt},
    )


# few-shot prompting: show gpt what we want with example interactions instead of telling it
starter_prompt: list[t.Message] = [
    # context
    context(
        "You extract relevant keywords in a machine-readable format that can be used to identify photos by their metadata."
    ),
    context(
        """If a given date is nonspecific, choose the widest range possible.
        For example, if they say '2015', assume that means 'from 2015-01-01 to 2015-12-31.'"""
    ),
    context("Today's date is July 29, 2023."),
    *sample_interaction(
        "How many pictures do I have from 2015?",
        "from:2015-01-01;to:2015-12-31",
    ),
    *sample_interaction(
        "Show me photos from my trip to Italy last summer.",
        "from:2022-06-01;to:2022-09-01;location:italy;with:[food, vacation, scenery]",
    ),
    *sample_interaction(
        "Show me pictures from my wedding day where my wife and I are smiling.",
        "subject:wedding;with:[bride smiling, groom smiling]",
    ),
    *sample_interaction(
        "Find those pictures from when I went skiing in the Alps last month",
        "from:2023-06-01;to:2023-06-30;location:switzerland;subject:skiing;with:[snow, mountain]",
    ),
    *sample_interaction(
        "Show me pictures I took of the Washington Monument two years ago.",
        "from:2022-01-01;to:2022-12-31;location:washington D.C.;subject:washington monument",
    ),
]


def prompt_gpt(msg: str) -> str:
    # provide our example interactions + the new test msg
    response: t.ChatCompletion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=starter_prompt + [{"role": "user", "content": msg}],
        temperature=0,  # ensures responses are deterministic
    )  # type: ignore
    return response["choices"][0]["message"]["content"]


if __name__ == "__main__":
    import sys

    # expected: from:2020-01-01,to:2020-12-31,location:Australia,subject:kangaroo
    test_msg = "Show me photos from when I saw a kangaroo in Australia three years ago."

    if len(sys.argv) > 1:  # allow supplying test msgs from commandline
        test_msg = sys.argv[1]

    response = prompt_gpt(test_msg)

    print(response, end="\n\n\n")
