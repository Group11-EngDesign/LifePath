import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { starterPrompt, parseKeywords } from '../prompt';
import axios from 'axios';
import { getList } from '../api/picsum'
import { useNavigation, useRoute } from '@react-navigation/native';

import { GPT3_API_KEY } from '../env';

const Home = ({ navigation }) => {
    const [query, setQuery] = useState(""); // Define query state
    const [reply, setReply] = useState(""); // Define reply state
    const [smallImageUrl, setSmallImageUrl] = useState(""); // Define state for small image URL
    const route = useRoute();
    const photos = route.params ? route.params.photos : []; // Get photos data from params

  
    const handleOpenPhotoGallery = () => {
      navigation.navigate('PhotoGallery');
    };
  
    const axiosInstance = axios.create({
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GPT3_API_KEY}`
      }
    });
  
    const processQuery = () => {
      console.log(query);


    // Search for the keyword in photo metadata
    const keyword = query.toLowerCase();
    const photoWithKeyword = photos.find(photo =>
      photo.metadata && photo.metadata.keywords &&
      photo.metadata.keywords.some(k => k.toLowerCase().includes(keyword))
    );

    if (photoWithKeyword) {
      // If a matching photo is found, set its small image URL
      setSmallImageUrl(photoWithKeyword.metadata.smallImageUrl);
    } else {
      // If no matching photo is found, reset the small image URL
      setSmallImageUrl("");
    }


    // Send the query to your API
    axiosInstance.post("http://192.168.0.115:8000/hello/", query)
      .then(response => response.data)
      .then(data => {
        console.log(data);
        setReply(data);
      })
      .catch(err => console.error(err.message));
  };
  
    return (
      <View style={styles.container}>
        <Image source={require('../assets/lifepathlogo.png')} style={styles.logo} />
        <Text>Your Life Memories</Text>
        <Text>Right at Your Fingertips</Text>
  
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchBar}
            defaultValue=''
            placeholder="Ex. Find pictures from 2016..."
            value={query}
            onChangeText={setQuery}
          />
        </View>
  
        <TouchableOpacity onPress={processQuery} style={styles.searchButton}>
          <Text style={styles.buttonText}>SEARCH</Text>
        </TouchableOpacity>
        <Text>{reply}</Text>

  
        <StatusBar style="auto" />
  
        <TouchableOpacity style={styles.searchButton} onPress={handleOpenPhotoGallery}>
          <Text style={styles.buttonText}>GALLERY</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 30,
      backgroundColor: '#FFFFFF', 
    },
    logo: {
      marginBottom: 5,
    },
    searchBarContainer: {
      width: '80%',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: '#7bb956',
    },
    searchBar: {
      fontSize: 16,
      color: '#7bb956',
      padding: 3,
    },
    smallImage: {
      width: 100, // Adjust the dimensions as needed
      height: 100,
      marginBottom: 16,
    },
    buttonText: {
      color: 'white',
    },
    searchButton: {
      backgroundColor: '#7bb956',
      marginTop: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
  });
  
  export default Home;