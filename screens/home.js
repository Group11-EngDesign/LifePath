import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';

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

  const handlePhotoUpload = () => {
    const options = {
      title: 'Select Photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User canceled photo selection');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // You can now send the selected photo to your Django backend for uploading.
        // Use Axios or another method to send the image to your Django API.
        // You may need to include your GPT3_API_KEY in the request headers.
  
        const formData = new FormData();
        formData.append('photo', {
          uri: response.uri,
          type: response.type,
          name: response.fileName,
        });
  
        axiosInstance.post('http://:8000/upload-photo/', formData, {
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
    });
  };
  

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
    axiosInstance.post("http://10.0.0.2:8000/hello/", query)
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
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  subtitle: {
    fontSize: 20,
    color: '#7bb956',
    marginBottom: 40,
    fontFamily: 'Arial',
  },
  searchBarContainer: {
    width: '80%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#7bb956',
  },
  searchBar: {
    fontSize: 16,
    color: '#7bb956',
    padding: 3,
  },
  buttonText: {
    color: 'white',
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
