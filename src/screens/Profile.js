import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Alert, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../helpers';
import { useNavigation, CommonActions } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import StatusBarManager from '../components/StatusBarManager';
import HeaderComponent from '../components/HeaderComponent';

const Profile = ({ navigation, route }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const storedFirstName = await AsyncStorage.getItem('@firstName');
      
      if (token) {
        setIsLoggedIn(true);
        if (storedFirstName) {
          // Use stored name if available
          setUserDetails(prev => ({
            ...prev,
            firstName: storedFirstName
          }));
        }
        fetchUserDetails(token);
      } else {
        setIsLoggedIn(false);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await getMethod({
        url: 'customers/secure/profile',
        token: token
      });

      if (response.success) {
        const userData = response.data.user;
        setUserDetails(userData);
        
        // Store firstName in AsyncStorage
        if (userData.firstName) {
          await AsyncStorage.setItem('@firstName', userData.firstName);
        }
      } else {
        console.error('Failed to fetch user details:', response.error);
        Alert.alert('Error', 'Failed to fetch user details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'An error occurred while fetching user details.');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['@token', '@firstName', 'userToken']);
      setIsLoggedIn(false);
      setUserDetails(null);
      
      // Navigate to Login through parent navigator
      navigation.getParent()?.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const login = () => {
    navigation.navigate('Login');
  };

  const navigateTo = (route) => {
    if (isLoggedIn) {
      navigation.navigate(route);
    } else {
      Alert.alert('Login Required', 'Please log in to access this feature.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    }
  };

  const profileItems = [
    { title: 'My Orders', image: require('../assets/Profile/orders.png'), route: 'OrderList' },
    { title: 'Balance', image: require('../assets/Profile/balance.png'), route: '/balance' },
    { title: 'Winnings', image: require('../assets/Profile/winnings.png'), route: '/winnings' },
    { title: 'Magic Coin', image: require('../assets/Profile/magic-coin.png'), route: '/magic-coin' },
    { title: 'Profile', image: require('../assets/Profile/profile.png'), route: 'ProfileEdit' },
    { title: 'Saved Address', image: require('../assets/Profile/address.png'), route: 'AddressList' },
    { title: 'My Wallet', image: require('../assets/Profile/wallet.png'), route: '/wallet' },
    { title: 'Notifications', image: require('../assets/Profile/notifications.png'), route: 'Notification' },
    { title: 'My Reviews', image: require('../assets/Profile/reviews.png'), route: '/reviews' },
    { title: 'Support Tickets', image: require('../assets/Profile/support.png'), route: 'Support' },
    { title: 'Legal Policies', image: require('../assets/Profile/legal.png'), route: '/legal' },
    { title: 'FAQs', image: require('../assets/Profile/faqs.png'), route: '/faqs' },
  ];

  const sections = [
    { title: 'Account', items: profileItems.slice(0, 4) },
    { title: 'Personal Information', items: profileItems.slice(4, 8) },
    { title: 'Other', items: profileItems.slice(8) },
  ];

  return (
    <LinearGradient colors={['#B2E3F4', '#FFFFFF']} style={{ flex: 1 }}>
      <StatusBarManager 
        backgroundColor="#B2E3F4"
        translucent={true}
        barStyle="dark-content"
      />
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <HeaderComponent />
        <Text style={styles.title}>Profile</Text>
        
        {isLoggedIn ? (
          <>
            {userDetails ? (
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userDetails.firstName} {userDetails.lastName}</Text>
                <Text style={styles.userEmail}>{userDetails.email}</Text>
                <Text style={styles.userPhone}>{userDetails.phoneNumber}</Text>
              </View>
            ) : (
              <Text style={styles.loadingText}>Loading user details...</Text>
            )}
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
              {sections.map((section, sectionIndex) => (
                <View key={sectionIndex} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => navigateTo(item.route)}>
                      <View style={styles.listItem}>
                        <Image source={item.image} style={styles.itemImage} />
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Icon name="chevron-right" size={24} color="#C6C6C8" />
                      </View>
                      {index < section.items.length - 1 && <View style={styles.divider} />}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
              {isLoggedIn && (
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              )}
              <View style={styles.logoutVersionContainer}>
                <Text style={styles.versionText}>Version 1.89 </Text>
              </View>
            </ScrollView>
            
          
          </>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.loginMessage}>Please log in to view your profile</Text>
            <TouchableOpacity style={styles.loginButton} onPress={login}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
            <View style={styles.versionContainer}>
              <Text style={styles.versionText}>Version 1.89 </Text>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? -40 : -30,
    backgroundColor: 'transparent',
  },
  title: {
    marginLeft: 18,
    fontSize: 25,
    fontWeight: '700',
    lineHeight: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000', // Changed to black
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemImage: {
    width: 25,
    height: 25,
    marginRight: 16,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#C6C6C8',
  },
  userInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000', // Changed to black
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 3,
    color: '#000000', // Changed to black
  },
  userPhone: {
    fontSize: 16,
    color: '#000000', // Changed to black
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 15,
    margin: 14,
    alignItems: 'center',
    top: 0,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    width: 200,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10
  },
  versionText: {
    fontSize: 16,
    color: '#000000',
    backgroundColor: 'transparent',
  },
  logoutVersionContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
});

export default Profile;