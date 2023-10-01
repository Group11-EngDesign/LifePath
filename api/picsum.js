const BASE_URL = `https://picsum.photos/v2`;

export async function getList(page = 1) {
  const response = await fetch(`${BASE_URL}/list?page=${page}`);
  const photos = await response.json();

  // Modify each photo to include metadata
  const photosWithMetadata = photos.map(photo => {
    // Generate the small image URL based on the photo's ID
    const smallImageUrl = formatPhotoUri(photo.id, 200, 200); // Adjust the size as needed

    // Add the small image URL and any other metadata properties you need
    return {
      ...photo,
      metadata: {
        smallImageUrl,
        // Add more metadata properties here if necessary
      },
    };
  });

  return photosWithMetadata;
}

export function formatPhotoUri(id, width, height) {
  return `https://picsum.photos/id/${id}/${Math.floor(width)}/${Math.floor(height)}`;
}
