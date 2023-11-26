import os 
from google.cloud import vision
from google_vision_ai import VisionAI
from google_vision_ai import prepare_image_local, prepare_image_web, draw_boundary, draw_boundary_normalized

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "visionai-405216-7f0e65e517c7.json"

# Instantiates a client
client = vision.ImageAnnotatorClient()

image_file_path = r"C:\PythonVenv\google_vision_ai\images\smile.jpeg"
image = prepare_image_local(image_file_path)

response = client.face_detection(image=image)
# faces = response.face_annotations
# for face in faces:
#     for facial_attribute in face.landmarks:
#         print(facial_attribute.type.name)
#         print(facial_attribute.position.x)
#         print(facial_attribute.position.y)
#         print(facial_attribute.position.z)
#     break


va = VisionAI(client, image)
faces = va.face_detection()
for face in faces:
    print(face.detection_confidence)
    print(face.joy_likelihood)
    draw_boundary(image_file_path, face.bounding_poly)
    break
