import os 
from google.cloud import vision
from google_vision_ai import VisionAI
from google_vision_ai import prepare_image_local, prepare_image_web, draw_boundary, draw_boundary_normalized

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "visionai-405216-7f0e65e517c7.json"

# Instantiates a client
client = vision.ImageAnnotatorClient()

image_file_path = './images/philly.jpg'
image = prepare_image_local(image_file_path)

va = VisionAI(client, image)
object_detections = va.object_detection()
for object in object_detections:
    print(object.name)
    print(object.score)
    draw_boundary_normalized(image_file_path, object.bounding_poly, object.name)