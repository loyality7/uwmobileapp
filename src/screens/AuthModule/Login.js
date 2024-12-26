import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform, 
  Image, 
  ScrollView,
  Alert,
  Keyboard,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { postMethod } from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../AuthModule/AuthContext';
import StatusBarManager from '../../components/StatusBarManager';

const { width, height } = Dimensions.get('window');

const EmailIcon = () => (
  <Svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M0 1.62136C0.0573909 1.44397 0.114782 1.2718 0.187825 1.04224C2.33216 3.22831 4.4504 5.38829 6.51126 7.49611C4.45562 9.5987 2.33216 11.7639 0.187825 13.9552C0.114782 13.7308 0.0573909 13.5535 0 13.3761C0 9.45783 0 5.5396 0 1.62136Z" fill="#8D8D95"/>
<Path d="M1.04346 0.139564C1.36693 0.0873908 1.6278 0.00391302 1.89389 0.00391302C7.74254 -0.00130434 13.586 -0.00130434 19.4346 0.00391302C19.7007 0.00391302 19.972 0.0873908 20.2903 0.144782C20.1964 0.249129 20.1494 0.301302 20.1025 0.348259C17.4312 3.00911 14.7547 5.66996 12.0834 8.3256C11.5095 8.8995 10.8312 9.12385 10.0538 8.84211C9.77731 8.74298 9.50601 8.56038 9.2921 8.35168C6.58429 5.67518 3.89213 2.98824 1.19476 0.30652C1.15824 0.269998 1.12693 0.233477 1.04346 0.139564Z" fill="#8D8D95"/>
<Path d="M1.16846 14.8526C3.27627 12.7031 5.39452 10.5431 7.52841 8.36743C7.83624 8.67526 8.11276 8.95699 8.39449 9.23351C8.82232 9.66655 9.32318 9.98481 9.92318 10.1205C11.0762 10.3813 12.0779 10.0839 12.9232 9.2596C13.2101 8.97786 13.4919 8.69091 13.7997 8.38308C15.9284 10.5587 18.0466 12.7187 20.1701 14.8839C19.9562 14.9152 19.6692 14.9935 19.3822 14.9935C17.9057 15.0039 16.424 14.9987 14.9475 14.9987C10.638 14.9987 6.3232 14.9987 2.01367 14.9987C1.68498 14.9987 1.38237 14.9622 1.16846 14.8526Z" fill="#8D8D95"/>
<Path d="M21.125 1.05249C21.2868 1.36553 21.3337 1.65249 21.3337 1.95509C21.3337 3.71856 21.3337 5.48203 21.3337 7.24549C21.3337 9.1707 21.3337 11.0907 21.3337 13.0159C21.3337 13.3237 21.292 13.6211 21.1302 13.9394C18.9963 11.7637 16.8781 9.60374 14.812 7.49592C16.8729 5.39333 18.9911 3.23335 21.125 1.05249Z" fill="#8D8D95"/>
</Svg>

);

const LockIcon = () => (
  <Svg width="22" height="15" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M1.82414 6.35918C1.82414 6.27811 1.82414 6.19704 1.82414 6.13623C1.84441 5.32551 1.80387 4.53504 1.86468 3.72432C2.02682 1.94071 3.48613 0.400328 5.24947 0.0760367C7.56005 -0.349596 9.70848 1.04891 10.2152 3.33922C10.276 3.60271 10.3165 3.86619 10.3165 4.12968C10.3165 4.77826 10.2963 5.42685 10.2963 6.07543C10.2963 6.17677 10.2557 6.25784 10.2355 6.35918C10.7624 6.35918 11.2083 6.52133 11.5934 6.88616C11.9583 7.23072 12.1407 7.65635 12.1407 8.16306C12.1407 10.5142 12.1407 12.8653 12.1407 15.2164C12.1407 16.1893 11.3299 17 10.3571 17C7.49924 17 4.64142 17 1.7836 17C0.810729 17 0 16.1893 0 15.2164C0 12.8653 0 10.5142 0 8.16306C0 7.23072 0.729656 6.48079 1.66199 6.37945C1.7228 6.37945 1.76334 6.35918 1.82414 6.35918ZM3.01996 6.37945C3.16184 6.37945 3.22265 6.37945 3.28345 6.37945C4.31713 6.37945 5.35081 6.37945 6.40476 6.37945C7.09388 6.37945 7.80327 6.37945 8.49238 6.37945C8.83694 6.37945 9.1207 6.1565 9.1207 5.83221C9.1207 5.16336 9.16124 4.49451 9.08016 3.84593C8.91802 2.40688 7.68166 1.29213 6.24261 1.23133C4.74276 1.17052 3.36452 2.16366 3.14157 3.60271C2.9997 4.49451 3.04023 5.42685 3.01996 6.37945ZM6.08047 12.5815C6.74932 12.5815 7.29656 12.0343 7.29656 11.3654C7.29656 10.6966 6.74932 10.1493 6.08047 10.1493C5.41161 10.1493 4.86437 10.6966 4.86437 11.3452C4.86437 12.0343 5.41161 12.5815 6.08047 12.5815Z" fill="#8D8D95"/>
  </Svg>



);

const EyeIcon = () => (
  <Svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M0 6.81364C0.247052 6.45812 0.463975 6.07851 0.735129 5.7471C2.21141 3.95145 3.94077 2.45107 6.03167 1.39055C7.45975 0.667476 8.96014 0.209527 10.5569 0.0588855C13.6541 -0.236371 16.4621 0.589142 19.029 2.30043C20.6981 3.41517 22.084 4.81312 23.2952 6.39787C23.5964 6.78953 23.5964 7.21133 23.2952 7.60299C21.8972 9.43479 20.2642 11.0075 18.2698 12.1765C16.6187 13.1466 14.8532 13.7612 12.9371 13.942C10.1532 14.2071 7.58026 13.5563 5.18808 12.1403C3.21167 10.9713 1.59077 9.39864 0.210898 7.57889C0.120513 7.45838 0.0662821 7.31376 0 7.1812C0 7.06069 0 6.93415 0 6.81364ZM11.5994 2.0594C8.91796 2.10761 6.77283 4.39133 6.81501 7.14505C6.85719 9.83851 9.14693 11.9897 11.9127 11.9354C14.5881 11.8872 16.7453 9.59146 16.6971 6.84979C16.6549 4.15632 14.3651 2.00517 11.5994 2.0594Z" fill="#8D8D95"/>
    <Path d="M11.768 4.33716C13.2141 4.33716 14.4193 5.51819 14.4253 6.94626C14.4313 8.44665 13.2322 9.6578 11.7439 9.6578C10.2977 9.6578 9.09863 8.4587 9.09863 7.01254C9.09863 5.54229 10.3038 4.33716 11.768 4.33716Z" fill="#8D8D95"/>
  </Svg>
);

const ClosedEyeIcon = () => (
  <Svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path d="M23.2952 6.39787C22.084 4.81312 20.6981 3.41517 19.029 2.30043C16.4621 0.589142 13.6541 -0.236371 10.5569 0.0588855C8.96014 0.209527 7.45975 0.667476 6.03167 1.39055C3.94077 2.45107 2.21141 3.95145 0.735129 5.7471C0.463975 6.07851 0.247052 6.45812 0 6.81364L0.210898 7.57889C1.59077 9.39864 3.21167 10.9713 5.18808 12.1403C7.58026 13.5563 10.1532 14.2071 12.9371 13.942C14.8532 13.7612 16.6187 13.1466 18.2698 12.1765C20.2642 11.0075 21.8972 9.43479 23.2952 7.60299C23.5964 7.21133 23.5964 6.78953 23.2952 6.39787ZM11.9127 11.9354C9.14693 11.9897 6.85719 9.83851 6.81501 7.14505C6.77283 4.39133 8.91796 2.10761 11.5994 2.0594C14.3651 2.00517 16.6549 4.15632 16.6971 6.84979C16.7453 9.59146 14.5881 11.8872 11.9127 11.9354Z" fill="#8D8D95"/>
    <Path d="M2 2L22 12" stroke="#8D8D95" strokeWidth="2"/>
  </Svg>
);

const Login = ({ navigation }) => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('@token');
      if (token) {
        console.log('Token found in storage:', token);
        await login(token);
        navigation.replace('Home');
      } else {
        console.log('No token found in storage');
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await postMethod({
        url: 'users/login',
        payload: {
          emailOrPhoneNumber: email,
          password: password,
          userType: 'Customer'
        }
      });

      if (response.success) {
        console.log('Login successful, token:', response.data.token);
        await AsyncStorage.setItem('@token', response.data.token);
        await login(response.data.token);
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', response.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An error occurred while trying to log in');
    }
  };

  const getCircleStyle = (position) => {
    const baseStyle = position === 'top' ? styles.topCircle : styles.bottomCircle;
    const focusedStyle = position === 'top' ? styles.topCircleFocused : styles.bottomCircleFocused;
    return focusedInput ? {...baseStyle, ...focusedStyle} : baseStyle;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBarManager />
      <View style={styles.container}>
        <View style={getCircleStyle('top')} />
        <View style={getCircleStyle('bottom')} />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logo} 
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Hello,</Text>
              <Text style={styles.subHeaderText}>Let's log you in !</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.emailIconContainer}>
                <EmailIcon />
              </View>
              <TextInput
                style={styles.emailInput}
                placeholder="Email"
                placeholderTextColor="#CCCCCC"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.passwordIconContainer}>
                <LockIcon />
              </View>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                placeholderTextColor="#CCCCCC"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                {showPassword ? <EyeIcon /> : <ClosedEyeIcon />}
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 90,
    height: 90,
    marginLeft: 20,
    backgroundColor: '#29BDEE',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  headerText: {
    fontFamily: 'Gabarito',
    fontWeight: '700',
    fontSize: 34,
    color: '#29BDEE',
  },
  subHeaderText: {
    fontFamily: 'Gabarito',
    fontWeight: '400',
    fontSize: 20,
    color: '#000000',
  },
  form: {
    marginTop: 20,
    width: '100%',
    marginLeft: 10,
  },
  inputContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  
  emailInput: {
    flex: 1,
    // height: 40,
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  passwordInput: {
    flex: 1,
    // height: 40,
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#00BFFF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 30,
    width: '90%',
    marginLeft: '5%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontFamily: 'Arial',
    fontWeight: '600',
    fontSize: 16,
    color: '#FFFFFF',
  },
  signUpText: {
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#000000',
  },
  signUpLink: {
    color: '#00BFFF',
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#00BFFF',
  },
  skipText: {
    marginTop: 25,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontSize: 14,
    color: '#00BFFF',
  },
  topCircle: {
    position: 'absolute',
    width: width * 0.4,
    height: width * 0.4,
    right: -width * 0.3,
    top: width * 0.3,
    backgroundColor: 'rgba(255, 139, 54, 0.3)',
    borderRadius: width * 0.3,
    zIndex: -1,
  },
  bottomCircle: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    left: -width * 0.3,
    bottom: -width * 0.3,
    backgroundColor: ' rgba(154, 175, 250, 0.67)',
    borderRadius: width * 0.35,
    zIndex: -1,
  },
  topCircleFocused: {
    backgroundColor: 'rgba(255, 139, 54, 0.3)',
  },
  bottomCircleFocused: {
    backgroundColor: 'rgba(41, 189, 238, 0.25)',
  },
  eyeIconContainer: {
    padding: 10,
    marginRight: 5,
  },
});

export default Login;