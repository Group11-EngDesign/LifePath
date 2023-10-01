import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getList, formatPhotoUri } from '../api/picsum';
import { actionCreators, initialState, reducer } from '../reducers/photos'
import PhotoGrid from '../components/PhotoGrid'



export default function PhotoGallery() {
  const navigation = useNavigation(); // Access the navigation object
  const [state, dispatch] = useReducer(reducer, initialState);
  const { photos, nextPage, loading, error } = state;

  const fetchPhotos = useCallback(async () => {
    dispatch(actionCreators.loading());

    try {
      const nextPhotos = await getList(nextPage);
      dispatch(actionCreators.success(nextPhotos, nextPage + 1));
    } catch (e) {
      dispatch(actionCreators.failure());
    }
  }, [nextPage]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  // We'll show an error only if the first page fails to load
  if (photos.length === 0) {
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator animating={true} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.container}>
          <Text>{error}</Text>
        </View>
      );
    }
  }



  return (
    <View style={styles.container}>
      <PhotoGrid
        numColumns={3}
        photos={photos}
        onPressPhoto={(photo) => navigation.navigate('PhotoDetails', { photo })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    margin: 5,
  },
});

