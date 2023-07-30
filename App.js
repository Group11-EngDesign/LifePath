import React from 'react';
import { View, Text, TextInput, StatusBar, StyleSheet, Image } from 'react-native';



export default function App() {
  return (
    <View style={styles.container}>
      

      <Image source={require('./assets/lifepathlogo.png')} style={styles.logo} />
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="gray"
        />
      </View>

      {/* Add the rest of your content here */}

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
