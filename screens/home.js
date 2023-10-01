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
            placeholder="Search..."
            placeholderTextColor="green"
            value={query}
            onChangeText={setQuery}
          />
        </View>
  
        <TouchableOpacity onPress={processQuery} style={styles.searchButton}>
          <Text style={styles.buttonText}>SEARCH</Text>
        </TouchableOpacity>
        <Text>{reply}</Text>
  
        {/* Display the small image if available */}
        {smallImageUrl ? (
          <Image source={{ uri: smallImageUrl }} style={styles.smallImage} />
        ) : null}
  
        <StatusBar style="auto" />
  
        <Button title="Photo Gallery" onPress={handleOpenPhotoGallery} />
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
      width: '100%',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: 40,
      borderWidth: 1,
      borderColor: 'black',
    },
    searchBar: {
      fontSize: 16,
      color: 'black',
    },
    smallImage: {
      width: 100, // Adjust the dimensions as needed
      height: 100,
      marginBottom: 16,
    },
    searchButton: {
      backgroundColor: 'green',
      padding: 5,
      borderRadius: 8,
      borderWidth: 1, // Add a border to the button
      borderColor: 'black', // Border color for the button
      width: '100%',
      alignItems: 'center', // Center text horizontally
      marginTop: -20,
      marginBottom: 20 , // Add some margin to separate from the search bar
    },
    buttonText: {
      color: 'white',
    },
  });
  
  export default Home;