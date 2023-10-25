import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
   
    // Replace this with actual authentication logic.
    if (email === 'Test' && password === 'test') {
      navigation.navigate('Home'); // Navigate to app home screen
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/lplogoo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
  
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold', // Make the text bold
      marginBottom: 20, // Add more spacing from the bottom
    },
    logo: {
      width: 210, // Set the desired width
      height: 100, // Set the desired height
      marginTop: -250, // Add spacing below the logo
    },
    input: {
      width: '80%',
      backgroundColor: '#FFFFFF',
      borderRadius: 3,
      paddingHorizontal: 5,
      paddingVertical: 10,
      marginBottom: 10,
      borderWidth: 2,
      borderColor: '#7bb956',
    },
    loginButton: {
     
    },
    buttonText: {
      color: 'white',
      backgroundColor: '#7bb956',
      fontWeight: 'bold',
      margin: 40,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      borderWidth: 3,
      borderColor: '#7bb956',
      

    },
  });

export default Login;
