import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Text, ActivityIndicator } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { postMethod } from '../../helpers';

const { width, height } = Dimensions.get('window');

const PasswordIcon = () => (
  <Svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M18.9 7.6h-1.26V5.7c0-3.15-2.55-5.7-5.7-5.7S6.24 2.55 6.24 5.7v1.9H4.98C3.78 7.6 2.82 8.56 2.82 9.76v7.6c0 1.2 0.96 2.16 2.16 2.16h13.92c1.2 0 2.16-0.96 2.16-2.16v-7.6c0-1.2-0.96-2.16-2.16-2.16zm-7.6 7.6c-1.2 0-2.16-0.96-2.16-2.16s0.96-2.16 2.16-2.16 2.16 0.96 2.16 2.16-0.96 2.16-2.16 2.16zm3.36-7.6H8.12V5.7c0-1.74 1.41-3.15 3.15-3.15s3.15 1.41 3.15 3.15v1.9z" fill="#8D8D95"/>
  </Svg>
);

const ResetPassword = ({ route, navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { userId } = route.params; // Get the userId passed from OTP verification

  const savePassword = async () => {
    setIsLoading(true);
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      if (!userId) {
        throw new Error('User ID not found');
      }

      let url = "users/reset-password";
      var payload = {
        id: userId,
        password: password,
      };
      console.log('Resetting password with payload:', payload); // Log the payload
      let response = await postMethod({ url, payload });
      if (response.success) {
        Alert.alert('Success', response.message);
        navigation.navigate("Login");
      } else {
        setError(response.message || 'An error occurred');
      }
    } catch (e) {
      console.error('Error in savePassword:', e);
      setError(e.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.topCircle} />
          <View style={styles.bottomCircle} />

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>New</Text>
                <Text style={styles.headerText}>Password</Text>
                <Text style={styles.subHeaderText}>Save new Password !</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <PasswordIcon />
                <TextInput
                  style={styles.input}
                  placeholder="New Password"
                  placeholderTextColor="#CCCCCC"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <PasswordIcon />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="#CCCCCC"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity 
                style={[styles.button, isLoading && styles.disabledButton]} 
                onPress={savePassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    minHeight: height,
  },
  content: {
    flex: 1,
    marginTop: 120,
    // justifyContent: 'center',
  },
  topCircle: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    right: -width * 0.3,
    top: width * 0.3,
    backgroundColor: 'rgba(255, 139, 54, 0.3)',
    borderRadius: width * 0.2,
  },
  bottomCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    left: -width * 0.3,
    bottom: -width * 0.3,
    backgroundColor: 'rgba(154, 175, 250, 0.67)',
    borderRadius: width * 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#00BFFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontFamily: 'Arial',
    fontWeight: '600',
    fontSize: 36,
    color: '#00BFFF',
  },
  subHeaderText: {
    fontFamily: 'Arial',
    fontWeight: '400',
    fontSize: 16,
    color: '#000000',
    marginTop: 5,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginLeft: 20,
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#00BFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
    width: '40%',
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Arial',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default ResetPassword;