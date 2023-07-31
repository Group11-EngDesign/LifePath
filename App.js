import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image, Button } from 'react-native';
import axios from 'axios';
import { GPT3_API_KEY } from './env.js';


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
    // console.log(GPT3_API_KEY);
    axiosInstance.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: query
      }]
    })
      .then(response => { console.log(response); return response.data; })
      .then(data => { console.log(data); setReply(data.choices[0].message.content) })
      .catch(err => console.error(err.message));
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/lifepathlogo.png')} style={styles.logo} />
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="gray"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      <Button title='Go' onPress={processQuery} />
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
    padding: 16,
  },
  searchBarContainer: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  searchBar: {
    fontSize: 16,
    color: 'black',
  },
});
