import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PhotoDetails = ({ route }) => {
    const { photo } = route.params;

    console.log('Photo:', photo); //checking if photo being passed

  return (
    <View style={styles.container}>
      <Image source={{ uri: photo.url }} style={styles.photo} />
    
      <Text>{photo.author}</Text>
      <Text>{photo.width} x {photo.height}</Text>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: 400,
    margin: 5,
  },
});

export default PhotoDetails;
