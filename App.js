import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image, Button, ActivityIndicator} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';


import { GalleryStack } from './navigation/stack.js';


const Home = () => {
  const navigation = useNavigation();
};

export default function App() {
  return (
    <NavigationContainer>
      <GalleryStack />
      <Home /> 
    </NavigationContainer>
  );
};
