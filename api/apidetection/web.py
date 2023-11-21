import os 
from google.cloud import vision
from google_vision_ai import VisionAI
from google_vision_ai import prepare_image_local, prepare_image_web, draw_boundary, draw_boundary_normalized

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "visionai-405216-7f0e65e517c7.json"

# Instantiates a client
client = vision.ImageAnnotatorClient()
image_file_path = './images/goldengatebridge.jpg'
image = prepare_image_local(image_file_path)
va = VisionAI(client, image)

web_detection = va.web_detection()
web_detection.web_entities
web_detection.best_guess_labels
# returns the URLS that contain exact images found
web_detection.full_matching_images

# returns the URLS that contain similar images found
web_detection.visually_similar_images

# returns the websites that contain matching or similar
if web_detection.pages_with_matching_images:
    for web_page in web_detection.pages_with_matching_images:
        print(web_page.url)
        print(web_page.full_matching_images_urls)
        print(web_page.partial_matching_image_urls)
        print()