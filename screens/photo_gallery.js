import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getList, formatPhotoUri } from '../api/picsum';
import { actionCreators, initialState, reducer } from '../reducers/photos';
import PhotoGrid from '../components/PhotoGrid';

export default function PhotoGallery() {
  const navigation = useNavigation();
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
    <ScrollView style={styles.container}>
      <PhotoGrid
        numColumns={3}
        photos={photos}
        onPressPhoto={(photo) => navigation.navigate('PhotoDetails', { photo })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
