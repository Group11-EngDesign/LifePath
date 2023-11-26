import os
from google.cloud import storage
from datetime import datetime

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'essential-oasis-401701-72d556e2236a.json'

storage_client = storage.Client()

# Create a New Bucket

bucket_name ='lifepath-data-bucket' # Choose a valid an unique bucket name
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

# Download Files

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

bucket_name = 'lifepath-data-bucket'
print(download_file_from_bucket('demo_pic20231120_015517_598885', os.path.join(os.getcwd(), 'file1.jpg'), bucket_name))