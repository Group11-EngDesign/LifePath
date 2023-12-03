import io
import os
import pandas as pd
from google.cloud import vision
from google.cloud import storage
from google_vision_ai import VisionAI
from google_vision_ai import prepare_image_local, prepare_image_web, draw_boundary, draw_boundary_normalized

# Instantiates a client
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "essential-oasis-401701-72d556e2236a.json"
client = vision.ImageAnnotatorClient()
storage_client = storage.Client()


# # load image (local source)
# image_path = '.\images\newyork.jpg'
# with io.open(image_path, 'rb') as image_file:
#     content = image_file.read()
# image = vision.Image(content=content)


# # load image (web source)
# image_url = 'https://unsplash.com/photos/a-macbook-with-lines-of-code-on-its-screen-on-a-busy-desk-m_HRfLhgABo'
# image = vision.Image()
# image.source.image_url = image_url


# response = client.label_detection(image=image)
# for label in response.label_annotations:
#     print(label.description)
#     print(label.score)
    

# image_path = r"C:\Users\Hallo\Downloads\christmas-gettyimages-184652817.jpg"
# image = prepare_image_local(image_path)   
# va = VisionAI(client, image)
# label_detections = va.label_detection()

# df = pd.DataFrame(label_detections)
# print(df) 

# Function to upload an image to Google Cloud Storage and tag it with event metadata
def upload_and_tag_image(blob_name, file_path, bucket_name):
    # Upload image to Cloud Storage
    upload_to_bucket(blob_name, file_path, bucket_name)

    # Analyze image labels using Vision API
    image = prepare_image_local(file_path)
    va = VisionAI(client, image)
    label_detections = va.label_detection()

    # Extract relevant event metadata based on labels
    event_metadata = get_event_metadata(label_detections)

    # Add event metadata to Cloud Storage metadata
    add_metadata_to_blob(blob_name, bucket_name, event_metadata)

# Function to add metadata to a Cloud Storage blob
def add_metadata_to_blob(blob_name, bucket_name, metadata):
    try:
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.metadata = metadata
        blob.patch()
    except Exception as e:
        print(e)

# Function to extract event metadata based on Vision API labels
def get_event_metadata(label_detections):
    # Example: Check if any label descriptions contain event keywords
    event_keywords = ['Christmas', 'Thanksgiving', 'New Years', 'Valentines Day', 'Fourth of July', 'Halloween']
    
    for label in label_detections:
        for keyword in event_keywords:
            if keyword in label.description:
                return {'event': keyword}
    
    # Default metadata if no specific labels are found
    return {'event': 'No Event'}

# Modify your upload function to call the new upload_and_tag_image function
def upload_to_bucket(blob_name, file_path, bucket_name):
    try:
        bucket = storage_client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)

        with io.open(file_path, 'rb') as image_file:
            blob.upload_from_file(image_file, content_type="image/jpeg")

        # Call function to tag the image with event metadata
        upload_and_tag_image(blob_name, file_path, bucket_name)
    except Exception as e:
        print(e)


# Example usage
file_path = r"C:\Users\Hallo\Downloads\christmas-gettyimages-184652817.jpg"
upload_and_tag_image('EventTest4', file_path, 'lifepath-data-bucket')