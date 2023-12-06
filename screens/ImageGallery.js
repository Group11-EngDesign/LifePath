import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { MY_IP } from '../env';

const ImageGallery = ({ route }) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { event } = route.params;

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://${MY_IP}:8000/gallery/`, {
      params: { event: event }
    })
      .then(response => {
        console.log(response.data);
        setImages(response.data);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  }, [event]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default ImageGallery;
