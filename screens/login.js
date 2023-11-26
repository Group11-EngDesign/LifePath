import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isTwoFactorAuth, setIsTwoFactorAuth] = useState(false);

  const handleLogin = () => {
    if (!isTwoFactorAuth) {
      // Replace this with actual authentication logic.
      if (email === 'Test' && password === 'test') {
        // Simulating successful authentication.
        setIsTwoFactorAuth(true); // Enable 2FA mode
        sendVerificationCode(); // Simulate sending verification code (replacing with actual logic)
      }
    } else {
      // Implement 2FA verification logic:
      if (verifyVerificationCode()) {
        navigation.navigate('Home'); // Navigate to app home screen on successful verification
      }
    }
  };

  // Simulating sending a verification code (replace with actual logic)
  const sendVerificationCode = () => {
    // Replace this with actual code to send a verification code.
    // Google Authenticator

    // For simulation purposes, we're initially setting an empty string.
    setVerificationCode('');
  };

  // Verify the entered verification code
  const verifyVerificationCode = () => {
    // Replace this with actual code to verify the entered code.
    // With Googl Authenticator we would compare the entered code with the one sent to the user to verify if correct or not
    return verificationCode === '123456';
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/lplogoo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={!isTwoFactorAuth}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isTwoFactorAuth}
      />
      {isTwoFactorAuth && (
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          value={verificationCode}
          onChangeText={setVerificationCode}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          {isTwoFactorAuth ? 'Verify' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 210,
    height: 100,
    marginTop: -250,
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
  loginButton: {},
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
