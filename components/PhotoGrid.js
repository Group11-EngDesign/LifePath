import React from 'react';
import { Dimensions, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { formatPhotoUri } from '../api/picsum';

export default function PhotoGrid({ photos, numColumns, onEndReached, onPressPhoto }) {
  const { width } = Dimensions.get('window');
  const size = width / numColumns;

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id.toString()} // Ensure it's a string
      numColumns={numColumns}
      onEndReached={onEndReached}
      contentContainerStyle={styles.gridContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onPressPhoto(item)} // Use onPressPhoto prop here
          style={styles.photoContainer}
        >
          <Image
            source={{
              width: size - 20, // Adjust as needed to add more spacing
              height: size - 20, // Adjust as needed to add more spacing
              uri: formatPhotoUri(item.id, size, size),
            }}
            style={styles.photo}
          />
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    alignItems: 'center',
  },
  photoContainer: {
    width: '28%', // Assuming you want 3 columns
    aspectRatio: 1,
    margin: 10, // Adjust this value to add more spacing
    borderRadius: 8, // Make the photo round
    overflow: 'hidden', // Clip the image to the rounded corners
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
