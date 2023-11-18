import io
import os
import pandas as pd
from google.cloud import vision
from google_vision_ai import VisionAI
from google_vision_ai import prepare_image_local, prepare_image_web, draw_boundary, draw_boundary_normalized

# Instantiates a client
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "visionai-405216-7f0e65e517c7.json"
client = vision.ImageAnnotatorClient()


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
    

image_path = '.\images\newyork.jpg'
image = prepare_image_local(image_path)   
va = VisionAI(client, image)
label_detections = va.label_detection()

df = pd.DataFrame(label_detections)
print(df)