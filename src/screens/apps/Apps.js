import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ecommerce from '../Ecommerce/Ecommerce';
import LinearGradient from 'react-native-linear-gradient';
import { getMethod } from '../../helpers';
import { useAuth } from '../AuthModule/AuthContext';
import Header from '../../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { postMethod } from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StatusBarManager from '../../components/StatusBarManager';

const HeaderItem = ({ label, image, count }) => (
  
  <View>
    <View style={styles.headerItem}>
      <View style={styles.headerImageContainer}>
        <Image source={image} style={styles.headerImage} />
        {count && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
    </View>
    <Text style={styles.headerLabel}>{label}</Text>
  </View>
);

const ServiceItem = ({ label, color, image, description, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.serviceItem}>
    <View style={styles.serviceTextContainer}>
      <Text style={styles.serviceLabel}>{label}</Text>
      <Text style={styles.serviceDescription}>{description}</Text>
    </View>
    <Image source={image} style={styles.serviceImage} />
    <View style={[styles.colorStrip, { backgroundColor: color }]} />
  </TouchableOpacity>
);

const CurvedEdgeContainer = ({ children }) => (
  <View style={curvedStyles.container}>
    <View style={curvedStyles.curvedEdge} />
    {children}
  </View>
);

const curvedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  curvedEdge: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  }
});

const ServicesScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (token) {
          const profileResponse = await getMethod({
            url: 'customers/secure/profile',
            token: token
          });

          if (profileResponse.success) {
            await AsyncStorage.setItem('@firstName', profileResponse.data.firstName);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusBarBackground}>
        <StatusBarManager />
      </View>
      <Header navigation={navigation} />
      <ScrollView style={styles.mainContainer} contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['rgba(45, 189, 238, 0.2)', '#E9F0F5']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          style={styles.header}
        >
          <HeaderItem
            label="Urban Card"
            count="$500"
            image={require('../../assets/app_page_images/icons8-train-ticket-15001.png')}
          />
          <HeaderItem
            label="Magic Coin"
            count="3"
            image={require('../../assets/app_page_images/MagicCoin.png')}
          />
          <HeaderItem
            label="Winners"
            image={require('../../assets/app_page_images/icons8-trophy-15001.png')}
          />
          <HeaderItem
            label="Prize Point"
            image={require('../../assets/app_page_images/PrizePoint.png')}
          />
        </LinearGradient>
        
        <Text style={styles.sectionTitle}>Explore our services</Text>
        
        <View style={styles.servicesGrid}>
          <ServiceItem
            label="Ecomm"
            color="#87CEEB"
            image={require('../../assets/app_page_images/Ecomm.png')}
            description="The ultimate online store"
            onPress={() => navigation.navigate('EcomTabNavigation', { screen: 'Shop' })}    
          />
          <ServiceItem
            label="BrainBox"
            color="#FFD700"
            image={require('../../assets/app_page_images/BrainBox.png')}
            description="Explore the creative world"
            onPress={() => {
              navigation.navigate('HubTabNavigation', {
                screen: 'Home',
                params: { 
                  service: 'BrainBox'
                }
              });
            }}
          />
          <ServiceItem
            label="AgriSure"
            color="#90EE90"
            image={require('../../assets/app_page_images/AgriSure.png')}
            description="Where nature meets customers"
            onPress={() => {
              navigation.navigate('HubTabNavigation', {
                screen: 'Home',
                params: { 
                  service: 'AgriSure'
                }
              });
            }}
          />
          <ServiceItem
            label="XBO"
            color="#DDA0DD"
            image={require('../../assets/app_page_images/XBO.png')}
            description="Old is the New"
            onPress={() => {
              navigation.navigate('HubTabNavigation', {
                screen: 'Home',
                params: { 
                  service: 'XBO'
                }
              });
            }}
          />
          <ServiceItem
            label="Influencers"
            color="#FFA07A"
            image={require('../../assets/app_page_images/Influencers.png')}
            description="Join and earn"
            onPress={() => {
              console.log('Navigating to Online Affiliate...');
              navigation.navigate('OnlineAffiliateTabNavigation', {
                screen: 'Home'
              });
            }}
          />
          <ServiceItem
            label="Partners"
            color="#20B2AA"
            image={require('../../assets/app_page_images/Partners.png')}
            description="Partner with us for greatness"
            onPress={() => navigation.navigate('Partners')}
          />
          <ServiceItem
            label="Offline Sellers"
            color="#F08080"
            image={require('../../assets/app_page_images/Partners.png')}
            description="Partner with us for greatness"
            onPress={() => navigation.navigate('AffiliateLanding')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    height: '100vh',
  },
  scrollContent: {
    paddingBottom: 60, // Add padding to account for the tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    // Remove the backgroundColor property
  },
  headerItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 8,
    width: 62,
    height: 62,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerImageContainer: {
    position: 'relative',
    marginBottom: 5,
  },
  headerImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
    color: 'black',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    marginLeft: 15,
    color: 'black',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  serviceItem: {
    width: '48%',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  serviceTextContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  serviceLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#000',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  serviceImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
  },
  colorStrip: {
    position: 'absolute',
    bottom: 0,
    left: -2,
    right: -2,
    height: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    transform: [
      { scaleX: 1.1 },
      { translateY: 15 }
    ],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  countBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
  },
  statusBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(45, 189, 238, 0.2)',
  },
});

export default ServicesScreen;
