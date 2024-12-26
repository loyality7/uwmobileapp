import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Text, VStack } from '@react-native-material/core';
import AppStyles from '../../styles/Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Intro = ({ navigation }) => {

  useEffect(async () => {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
      navigation.navigate('TabNavigation');
    }
  }, []);
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/loginBg.png')}
        resizeMode="cover"
        style={styles.imgBg}>
        <View
          style={{ ...AppStyles.overlayView, backgroundColor: 'transparent' }}
        />
        <View style={styles.body}>
          <VStack spacing={'3%'}>
            <View style={{ ...AppStyles.center, height: '20%' }}>
              <Text
                variant="h4"
                style={{ ...AppStyles.text, fontFamily: 'Inter-SemiBold' }}>
                Lorem Ipsum is simply dummy text
              </Text>
            </View>
            <View style={{ ...AppStyles.center, height: '59%', justifyContent: 'center', }}>
              <Image
                source={require('../../assets/UrbanWallah-Logo.png')}
                style={styles.img}
              />
            </View>
            <View style={{ height: '16%' }}>
              <VStack spacing={'5%'}>
                <TouchableOpacity
                  style={AppStyles.authButton}
                  onPress={() => navigation.navigate('/login')}>
                  <Text style={{ fontFamily: 'Inter-Bold', color: 'white' }}>
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={AppStyles.authButton}
                  onPress={() => navigation.navigate('/register')}>
                  <Text style={{ fontFamily: 'Inter-Bold', color: 'white' }}>
                    Signup
                  </Text>
                </TouchableOpacity>
              </VStack>
            </View>
            <View style={{ height: '3%' }}>
              <Text onPress={() => navigation.navigate('TabNavigation')} variant="p" style={{ textAlign: "center", color: "white" }}>
                Skip for now
              </Text>
            </View>
          </VStack>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  body: {
    paddingVertical: '15%',
    paddingHorizontal: '6%',
    height: '100%',
    overflow: 'hidden',
  },
  imgBg: {
    height: '100%',
    width: '100%',
  },
  img: {
    height: '100%',
    width: '90%',
    resizeMode: 'contain',
  },
});

export default Intro;
