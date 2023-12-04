import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

import { MY_IP } from '../env';

const ImageGallery = () => {
  const [images, setImages] = useState([]);

  React.useEffect(() => {
    axios.get(`http://${MY_IP}:8000/gallery/`)
      .then(response => {
        console.log(response.data);
        setImages(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />
            ) : (
              <Text>Invalid Image Data</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    margin: 5,
  },
});

export default ImageGallery;
