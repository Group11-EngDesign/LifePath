from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.core import serializers
from django.conf import settings
import json
import openai
from credentials import GPT3_API_KEY

openai.api_key = GPT3_API_KEY


# helper functions for building the prompt
def context(msg: str):
    return {"role": "system", "content": msg}


def sample_interaction(user: str, gpt: str):
    return (
        {"role": "system", "name": "example_user", "content": user},
        {"role": "system", "name": "example_assistant", "content": gpt},
    )


# few-shot prompting: show gpt what we want with example interactions instead of telling it
starter_prompt = [
    # context
    context(
        "You extract relevant keywords in a machine-readable format that can be used to identify photos by their metadata."
    ),
    context(
        """If a given date is nonspecific, choose the widest range possible.
        For example, if they say '2015', assume that means 'from 2015-01-01 to 2015-12-31.'"""
    ),
    context("Today's date is October 2, 2023."),
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
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=starter_prompt + [{"role": "user", "content": msg}],
        temperature=0,  # ensures responses are deterministic
    )  # type: ignore
    return response["choices"][0]["message"]["content"]  # type: ignore


def parse_keywords(keywords: str):
    parsed_keywords = {}
    for kv_pair in keywords.split(";"):
        key, val = map(str.strip, kv_pair.split(":", 1))
        if val[0] == "[":  # list? useful for the `with` attribute
            parsed_keywords[key] = [item.strip() for item in val[1:-1].split(",")]
        else:
            parsed_keywords[key] = val
    # if we need to go back to sending data that matches DateOnly more,
    # here is where we should use `date_to_dict`
    parsed_keywords["from"] = parsed_keywords.get("from", "1970-01-01")
    parsed_keywords["to"] = parsed_keywords.get("to", "9999-12-31")
    return parsed_keywords


# Create your views here.
@api_view(["POST"])
def Hello(name):
    try:
        req = json.loads(name.body)
        return JsonResponse(str(parse_keywords(prompt_gpt(req))), safe=False)
    except ValueError as e:
        return Response(e.args[0], status.HTTP_400_BAD_REQUEST)
    
    
from django.shortcuts import render
from django.http import HttpResponse
from your_module import upload_to_bucket  # Import the function from your code


def connect_to_database(request):
    file_path = r'C:\Users\Hallo\Downloads\Turtle.jpg'
    success = upload_to_bucket('Turtle Picture', file_path, 'lifepath-data-bucket')

    if success:
        message = "Connected to the database and uploaded the file successfully."
    else:
        message = "Failed to connect to the database or upload the file."

    return render(request, 'database_connection.html', {'message': message})
