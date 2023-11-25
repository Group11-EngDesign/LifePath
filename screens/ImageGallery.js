import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images from the Django backend gallery endpoint
    axios.get('http://10.0.0.3:8000/gallery/')
      .then(response => {
        setImages(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.fields.image_url }}
            style={styles.image}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    margin: 5,
  },
});

export default ImageGallery;
