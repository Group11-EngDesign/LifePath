import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; // Import Expo's ImagePicker
import Constants from 'expo-constants'; // Import Constants to check permissions

import { GPT3_API_KEY } from '../env';
import { useFonts, Caveat_400Regular, Caveat_600SemiBold } from '@expo-google-fonts/caveat';

const MY_IP = "10.0.0.3"; // replace this with ur IP to communicate w backend

const Home = ({ navigation }) => {
  const [query, setQuery] = useState(""); // Define query state
  const [reply, setReply] = useState(""); // Define reply state
  const [smallImageUrl, setSmallImageUrl] = useState(""); // Define state for small image URL
  const route = useRoute();
  const photos = route.params ? route.params.photos : []; // Get photos data from params

  // Load fonts
  let [fontsLoaded] = useFonts({
    CaveatRegular: Caveat_400Regular,
    CaveatSemiBold: Caveat_600SemiBold,
  });

  const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GPT3_API_KEY}`
    }
  });

  // Check and request camera roll permissions (Expo-specific)
  useEffect(() => {
    (async () => {
      if (Constants.platform.ios || Constants.platform.android) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const handlePhotoUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the selected image using result.uri
      const formData = new FormData();
      formData.append('photo', {
        uri: result.assets[0].uri, // Use result.uri
        type: 'image/jpeg', // You may specify the appropriate type
        name: 'photo.jpg', // Provide a name
      });
      console.log(result);

      axiosInstance.post(`http://${MY_IP}:8000/upload/`, formData, {
        headers: {
          'Authorization': `Bearer ${GPT3_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      })
        .then(response => {
          console.log(response.data);
          // Handle success or display a success message to the user
        })
        .catch(err => {
          console.error(err.message);
          // Handle errors or display an error message to the user
        });
    }
  };

  const handleOpenPhotoGallery = () => {
    navigation.navigate('PhotoGallery');
  };

  const handleOpenDatabaseGallery = () => {
    navigation.navigate('ImageGallery');
  };

  const processQuery = () => {
    console.log(query);

    const keyword = query.toLowerCase();
    const photoWithKeyword = photos.find(photo =>
      photo.metadata && photo.metadata.keywords &&
      photo.metadata.keywords.some(k => k.toLowerCase().includes(keyword))
    );

    if (photoWithKeyword) {
      setSmallImageUrl(photoWithKeyword.metadata.smallImageUrl);
    } else {
      setSmallImageUrl("");
    }

    axiosInstance.post(`http://${MY_IP}:8000/hello/`, query)
      .then(response => response.data)
      .then(data => {
        console.log(data);
        setReply(data);
      })
      .catch(err => console.error(err.message));
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logolp.png')} style={styles.logo} />
      <Text style={styles.title}>Your Life Memories</Text>
      <Text style={styles.subtitle}>Right at Your Fingertips</Text>

      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          defaultValue=''
          placeholder="Ex. Find pictures from 2016..."
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <StatusBar style="auto" />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={processQuery} style={styles.searchButton}>
          <Text style={styles.buttonText}>SEARCH</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchButton} onPress={handleOpenPhotoGallery}>
          <Text style={styles.buttonText}>GALLERY</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.searchButton} onPress={handlePhotoUpload}>
          <Text style={styles.buttonText}>UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={styles.searchButton}
        onPress={handleOpenDatabaseGallery}>
        <Text style={styles.buttonText}>DATABASE GALLERY</Text>
      </TouchableOpacity>
      </View>

      <Text>{reply}</Text>
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
    width: 200, // Set the desired width
    height: 150, // Set the desired height
    marginTop: 1, // Add spacing below the logo
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
    fontFamily: 'CaveatSemiBold',
  },
  subtitle: {
    fontSize: 18,
    color: '#7bb956',
    marginBottom: 40,
    fontFamily: 'CaveatRegular',
  },
  searchBarContainer: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#7bb956',
  },
  searchBar: {
    fontSize: 16,
    color: '#7bb956',
    marginBottom: 50,
    padding: 3,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'CaveatSemiBold',
  },
  searchButton: {
    backgroundColor: '#7bb956',
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default Home;
