import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

import { MY_IP } from '../env';

const ImageGallery = ({ route }) => {
  const [images, setImages] = useState([]);
  const { event } = route.params;

  useEffect(() => {
    axios.get(`http://${MY_IP}:8000/gallery/`, {
      params: { event: event }
    })
      .then(response => {
        console.log(response.data);
        setImages(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [event]);

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <Text>Invalid Image Data</Text>
            )}
            <Text style={styles.eventText}>{item.event}</Text>
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
  itemContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  eventText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default ImageGallery;
