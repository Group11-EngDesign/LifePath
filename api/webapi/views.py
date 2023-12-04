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
from .models import Image

# Import necessary modules
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


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

import os
from google.cloud import storage
from datetime import datetime, timedelta

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'essential-oasis-401701-72d556e2236a.json'

storage_client = storage.Client()

# Create a New Bucket

bucket_name ='lifepath-data-bucket'
bucket = storage_client.bucket(bucket_name)
# Create a new bucket with the location specified
#bucket = storage_client.create_bucket(bucket_name, location='US') Commented out after bucket is already created

#Print Bucket Details

#print(vars(bucket))

#Accessing a specific Bucket

#my_bucket = storage_client.get_bucket('lifepath-data-bucket')
#print(my_bucket)

# Upload Files

def upload_to_bucket(blob_name, file_path, bucket_name):
    try:
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.upload_from_file(file_path, content_type="image/jpeg")
    except Exception as e:
        print(e)
        return False

# file_path = r'C:\Users\Hallo\Downloads\Turtle.jpg'
# upload_to_bucket('Turtle Picture', file_path, 'lifepath-data-bucket')

# Download Files function and testing code underneath (Takes file from DB and downloads it to device)

def download_file_from_bucket(blob_name, file_path, bucket_name):
    try:
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)
        with open(file_path, 'wb') as f:
            storage_client.download_blob_to_file(blob, f)
        return True
    except Exception as e:
        print(e)
        return False

'''
bucket_name = 'lifepath-data-bucket'
print(download_file_from_bucket('demo_pic20231120_015517_598885', os.path.join(os.getcwd(), 'file1.jpg'), bucket_name))
'''

# Create your views here.
@api_view(["POST"])
def Upload(name):
    try:
        image = name.data["photo"]
        unique_affix = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        file_name = f"demo_pic{unique_affix}"
        upload_to_bucket(file_name, image, bucket_name )
        return JsonResponse(f"'{file_name}' uploaded to cloud", safe=False)
    except Exception as e:
        print(e)
        return Response(str(e), status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def Gallery(request):
    try:
        # List all objects in the bucket
        blobs = storage_client.list_blobs(bucket)

        # Generate signed URLs
        images = []
        for index, blob in enumerate(blobs):
            url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(minutes=15),  # URL valid for 15 minutes
                method="GET"
            )
            images.append({'id': index, 'image': url})

        # Return the list of image URLs
        return JsonResponse(images, safe=False)
    except Exception as e:
        print(e)
        return Response(str(e), status.HTTP_400_BAD_REQUEST)
