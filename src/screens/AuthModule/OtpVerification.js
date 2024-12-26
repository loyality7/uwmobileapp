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
import { Text } from '@react-native-material/core';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { postMethod } from '../../helpers';
import StatusBarManager from '../../components/StatusBarManager';

const { width, height } = Dimensions.get('window');

const OtpIcon = () => (
  <Svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M5.18507 10.2136C5.18507 10.483 5.16536 10.7327 5.19164 10.9825C5.29022 11.9682 6.05911 12.6583 7.07115 12.6648C8.41835 12.6714 9.75897 12.6648 11.1062 12.6648C12.0262 12.6648 12.9397 12.6648 13.8597 12.6648C15.0229 12.6583 15.7984 11.8828 15.8049 10.7196C15.8049 10.5553 15.8049 10.3976 15.8049 10.2004C15.9167 10.2004 16.0021 10.2004 16.0941 10.2004C17.185 10.2004 18.2759 10.2004 19.3668 10.2004C20.3854 10.2004 20.99 10.7985 20.99 11.8171C20.99 13.6769 20.99 15.5367 20.99 17.403C20.99 18.3953 20.392 18.9999 19.3997 18.9999C13.4654 18.9999 7.53117 18.9999 1.59035 18.9999C0.591453 18.9999 0 18.4019 0 17.403C0 15.5367 0 13.6637 0 11.7974C0 10.8116 0.604596 10.207 1.59692 10.207C2.70097 10.207 3.81159 10.207 4.91563 10.207C4.99449 10.207 5.07335 10.2136 5.18507 10.2136ZM5.26393 15.8718C5.55309 15.8718 5.79624 15.8784 6.03939 15.8718C6.35483 15.8652 6.53884 15.7075 6.53884 15.4512C6.53884 15.1949 6.34826 15.0372 6.03939 15.0306C5.79624 15.0241 5.55966 15.0306 5.2705 15.0306C5.41508 14.7809 5.53337 14.5772 5.64509 14.3735C5.80281 14.0909 5.76338 13.8412 5.53337 13.7163C5.30993 13.5914 5.0865 13.6769 4.92877 13.9463C4.80391 14.1566 4.68562 14.3669 4.54104 14.6035C4.39647 14.3603 4.27818 14.15 4.15331 13.9397C3.99559 13.6769 3.76558 13.5914 3.54215 13.7163C3.32528 13.8412 3.27271 14.0843 3.42386 14.3538C3.54215 14.564 3.66701 14.7743 3.7853 14.9846C3.74587 15.0109 3.7393 15.0241 3.72615 15.0241C3.49614 15.0241 3.26613 15.0241 3.03612 15.0306C2.72726 15.0372 2.53668 15.2015 2.53668 15.4512C2.53668 15.701 2.72726 15.8652 3.03612 15.8718C3.27928 15.8784 3.52243 15.8718 3.75901 15.8718C3.75901 15.9178 3.77216 15.9375 3.76558 15.9507C3.65387 16.1478 3.54215 16.3516 3.43043 16.5487C3.27928 16.8181 3.32528 17.0613 3.54215 17.1927C3.75901 17.3176 3.99559 17.2322 4.15331 16.9693C4.27818 16.759 4.39647 16.5487 4.54104 16.3055C4.68562 16.5487 4.80391 16.759 4.92877 16.9627C5.0865 17.2322 5.32308 17.3176 5.53994 17.1927C5.76338 17.0679 5.80938 16.8181 5.65823 16.5487C5.53337 16.3318 5.40851 16.1281 5.26393 15.8718Z" fill="#8D8D95"/>
    <Path d="M8.01757 4.91698C8.14901 4.91698 8.24758 4.91698 8.34616 4.91698C10.1665 4.91698 11.9869 4.91698 13.8072 4.91698C14.563 4.91698 14.9573 5.31129 14.9573 6.06703C14.9573 7.61138 14.9573 9.14916 14.9573 10.6935C14.9573 11.4361 14.563 11.8304 13.8204 11.8304C11.5991 11.8304 9.37791 11.8304 7.15668 11.8304C6.41408 11.8304 6.01978 11.4361 6.01978 10.6935C6.01978 9.17545 6.01978 7.65738 6.01978 6.13932C6.01978 5.331 6.29579 5.01556 7.09753 4.91041C7.11068 4.91041 7.12382 4.89727 7.16982 4.87098C7.16982 4.53583 7.15668 4.18753 7.17639 3.83923C7.20268 3.38578 7.18954 2.91262 7.29469 2.47231C7.69556 0.875388 9.22677 -0.16294 10.8565 0.0210671C12.4863 0.205075 13.7415 1.55227 13.8072 3.1952C13.8204 3.52378 13.6758 3.72751 13.4129 3.74722C13.1566 3.76036 12.9923 3.57636 12.9661 3.2412C12.8741 2.09115 12.2103 1.2434 11.172 0.941105C9.6605 0.500801 8.103 1.59827 8.03072 3.16891C7.99786 3.73408 8.01757 4.30582 8.01757 4.91698Z" fill="#8D8D95"/>
  </Svg>
);

const OtpVerification = ({ route }) => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState('');
  const { userId } = route.params;

  const verifyOTP = async () => {
    try {
      let url = "users/verify-otp";
      var payload = {
        id: userId,
        otp: otp
      };
      console.log('Verifying OTP with payload:', payload);
      let response = await postMethod({ url, payload });
      console.log('OTP verification response:', response);
      if (response.success) {
        Alert.alert('Success', 'OTP verified successfully.');
// In your OTP verification screen, after successful verification
navigation.navigate("ResetPassword", { userId: userId });
        setOtp("");
      } else {
        Alert.alert('Error', response.message || 'OTP verification failed');
      }
    } catch (e) {
      console.error('OTP verification error:', e);
      Alert.alert('Error', e.response?.message || 'An error occurred during OTP verification');
      setOtp("");
    }
  };

  return (
    <>
      <StatusBarManager />
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
                  <Text style={styles.headerText}>OTP</Text>
                  <Text style={styles.headerText}>Verification</Text>
                  <Text style={styles.subHeaderText}>Enter the OTP sent to your email</Text>
                </View>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <OtpIcon />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter OTP"
                    placeholderTextColor="#CCCCCC"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                </View>

                <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signUpText}>
                  Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
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
    alignItems: 'center',
    marginTop: 20,
    width: '40%',
    marginLeft: 100,
  },
  buttonText: {
    fontFamily: 'Arial',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  resendText: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#000000',
  },
  resendLink: {
    color: '#00BFFF',
    fontWeight: 'bold',
  },
});

export default OtpVerification;