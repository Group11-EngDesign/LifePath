import os 
from google.cloud import vision
from google_vision_ai import VisionAI
from google_vision_ai import prepare_image_local, prepare_image_web, draw_boundary, draw_boundary_normalized

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "visionai-405216-7f0e65e517c7.json"

# Instantiates a client
client = vision.ImageAnnotatorClient()

image_file_path = r"C:\PythonVenv\google_vision_ai\images\lib.jpg"
image = prepare_image_local(image_file_path)

va = VisionAI(client, image)
landmarks = va.landmark_detection()
for landmark in landmarks:
    print(landmark.description)
    print(landmark.score)
    draw_boundary(image_file_path, landmark.bounding_poly, landmark.description)
