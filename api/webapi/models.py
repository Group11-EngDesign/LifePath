from django.db import models
from django.conf import settings

class Image(models.Model):
    image = models.ImageField(upload_to='images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image {self.id} - {self.created_at}"

    def image_url(self):
        # Assuming MEDIA_URL is set in your Django settings
        return f"{settings.MEDIA_URL}{self.image}"
