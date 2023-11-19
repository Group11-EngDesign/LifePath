// DatabaseGallery.js
import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getList, formatPhotoUri } from '../api/picsum';
import { actionCreators, initialState, reducer } from '../reducers/photos'


const DatabaseGallery = () => {
    const navigation = useNavigation();
  return (
    <View>
      <Text>Database Gallery Screen</Text>
      {/* Add your gallery content here */}
    </View>
  );
};

export default DatabaseGallery;
