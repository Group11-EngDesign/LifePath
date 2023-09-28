import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { GPT3_API_KEY } from './env.js';
import { starterPrompt, parseKeywords } from './prompt.js';

export default function App() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GPT3_API_KEY}`
    }
  });

  const processQuery = () => {
    console.log(query);
    axiosInstance.post("http://10.0.0.147:8000/hello/", query) // Change 127.0.0.1 to machine IP 
      .then(response => response.data)
      .then(data => {
        console.log(data);
        setReply(data);
      })
      .catch(err => console.error(err.message));
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/Logo.png')} style={styles.logo} />
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          defaultValue=''
          placeholder="Ex. Find pictures from 2016..."
          placeholderTextColor="gray"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <TouchableOpacity onPress={processQuery} style={styles.searchButton}>
        <Text style={styles.buttonText}>SEARCH</Text>
      </TouchableOpacity>
      <Text>{reply}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#bdc3c7', 
  },
  logo: {
    width: 150,
    height: 180,
    marginBottom: -20,
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
