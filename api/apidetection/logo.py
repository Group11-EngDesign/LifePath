import os 
from google.cloud import vision
from google_vision_ai import VisionAI
from google_vision_ai import prepare_image_local, prepare_image_web, draw_boundary, draw_boundary_normalized

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "visionai-405216-7f0e65e517c7.json"

# Instantiates a client
client = vision.ImageAnnotatorClient()

image_file_path = './images/stockimage7.jpg'
image = prepare_image_local(image_file_path)
va = VisionAI(client, image)
logos = va.logo_detection()
for logo in logos:
    print(logo.description)
    print(logo.score)
    draw_boundary(image_file_path, logo.bounding_poly, logo.description)