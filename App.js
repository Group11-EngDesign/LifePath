import React, { useState } from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image, Button } from 'react-native';

export default function App() {
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");

  const processQuery = () => fetch("https://opentdb.com/api.php?amount=1")
    .then(response => response.text())
    .then(data => setReply(data))
    .catch(err => setReply(err.message));

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
