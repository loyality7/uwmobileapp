import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ToastAndroid,
  Dimensions,
  SafeAreaView,
  Keyboard,
  TextInput,
} from 'react-native';
import { Text } from '@react-native-material/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { postMethod } from '../../helpers';
import StatusBarManager from '../../components/StatusBarManager';

const { width, height } = Dimensions.get('window');

const EmailIcon = () => (
  <Svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M0 1.62136C0.0573909 1.44397 0.114782 1.2718 0.187825 1.04224C2.33216 3.22831 4.4504 5.38829 6.51126 7.49611C4.45562 9.5987 2.33216 11.7639 0.187825 13.9552C0.114782 13.7308 0.0573909 13.5535 0 13.3761C0 9.45783 0 5.5396 0 1.62136Z" fill="#8D8D95"/>
<Path d="M1.04346 0.139564C1.36693 0.0873908 1.6278 0.00391302 1.89389 0.00391302C7.74254 -0.00130434 13.586 -0.00130434 19.4346 0.00391302C19.7007 0.00391302 19.972 0.0873908 20.2903 0.144782C20.1964 0.249129 20.1494 0.301302 20.1025 0.348259C17.4312 3.00911 14.7547 5.66996 12.0834 8.3256C11.5095 8.8995 10.8312 9.12385 10.0538 8.84211C9.77731 8.74298 9.50601 8.56038 9.2921 8.35168C6.58429 5.67518 3.89213 2.98824 1.19476 0.30652C1.15824 0.269998 1.12693 0.233477 1.04346 0.139564Z" fill="#8D8D95"/>
<Path d="M1.1687 14.8526C3.27651 12.7031 5.39476 10.5431 7.52866 8.36743C7.83648 8.67526 8.113 8.95699 8.39474 9.23351C8.82256 9.66655 9.32343 9.98481 9.92342 10.1205C11.0765 10.3813 12.0782 10.0839 12.9234 9.2596C13.2104 8.97786 13.4921 8.69091 13.7999 8.38308C15.9286 10.5587 18.0468 12.7187 20.1703 14.8839C19.9564 14.9152 19.6694 14.9935 19.3825 14.9935C17.906 15.0039 16.4242 14.9987 14.9477 14.9987C10.6382 14.9987 6.32345 14.9987 2.01391 14.9987C1.68522 14.9987 1.38261 14.9622 1.1687 14.8526Z" fill="#8D8D95"/>
<Path d="M21.125 1.05249C21.2868 1.36553 21.3337 1.65249 21.3337 1.95509C21.3337 3.71856 21.3337 5.48203 21.3337 7.24549C21.3337 9.1707 21.3337 11.0907 21.3337 13.0159C21.3337 13.3237 21.292 13.6211 21.1302 13.9394C18.9963 11.7637 16.8781 9.60374 14.812 7.49592C16.8729 5.39333 18.9911 3.23335 21.125 1.05249Z" fill="#8D8D95"/>
</Svg>

);

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const sendOTP = async () => {
    try {
      let url = 'users/send-otp';
      var payload = {
        emailOrPhoneNumber: email,
        userType: 'Customer',
      };
      let response = await postMethod({ url, payload });
      if (response.success) {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        navigation.navigate('OtpVerification', { userId: response.data._id });
        setEmail('');
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    } catch (e) {
      ToastAndroid.show(e.response?.message || 'An error occurred', ToastAndroid.SHORT);
      setEmail('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarManager />
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
                <Text style={styles.headerText}>Forgot</Text>
                <Text style={styles.headerText}>Password?</Text>
                <Text style={styles.subHeaderText}>We will help you !</Text>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <EmailIcon />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#CCCCCC"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={sendOTP}>
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signUpText}>
                  Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                </Text>
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
    fontSize: 40,
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
    width: '40%',
    marginLeft: '30%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'Arial',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  signUpText: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#000000',
  },
  signUpLink: {
    color: '#00BFFF',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;