import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ImageBackground, TextInput, Alert, ToastAndroid, Dimensions, FlatList } from 'react-native';
import { getMethod, postMethod } from '../../helpers/index';
import { useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { useAuth } from '../AuthModule/AuthContext';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';  // Make sure you have axios installed: npm install axios
import HeaderComponent from '../../components/HeaderComponent';

const { width } = Dimensions.get('window');

const EcommercePage = () => {
 
  const navigation = useNavigation();
  const auth = useAuth(); // Get the entire auth context
  
  // Update the destructuring to handle potential undefined values
  const { user = null, setUser } = auth || {};

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [dailyDeals, setDailyDeals] = useState([]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const storedFirstName = await AsyncStorage.getItem('@firstName');
      
      if (token) {
        setIsLoggedIn(true);
        if (storedFirstName && typeof setUser === 'function') {
          const basicUserData = { firstName: storedFirstName };
          setUser(basicUserData);
          setUserInfo(basicUserData);
        }
      } else {
        setIsLoggedIn(false);
        if (typeof setUser === 'function') {
          setUser(null);
        }
      }
      
      // Fetch data regardless of login status
      fetchData(token);
    } catch (error) {
      console.error('Error in checkLoginStatus:', error);
      // Still fetch data even if there's an error checking login
      fetchData(null);
    }
  };

  const fetchData = async (token) => {
    try {
      await Promise.all([
        fetchFeaturedProducts(),
        fetchCategories(),
        fetchDailyDeals(),
        // Only fetch wishlist if token exists
        token ? fetchWishlist(token) : Promise.resolve()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load some data. Please try again.');
    }
  };

  const calculateDiscount = (price, recommendedPrice) => {
    if (!price || !recommendedPrice) return 0;
    const discount = ((recommendedPrice - price) / recommendedPrice) * 100;
    return Math.round(discount);
  };
  const fetchFeaturedProducts = async () => {
    try {
      const response = await getMethod({
        url: 'products/featured',
        headers: {
          'accept': '*/*'
        },
      });
      if (response.success) {
        setFeaturedProducts(response.data);
      } else {
        console.error('Error fetching featured products:', response.error);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getMethod({
        url: 'common/nested/category',
        headers: {
          'accept': '*/*'
        },
      });
      
      console.log('Categories response:', response);
      
      if (response && response.success) {
        if (Array.isArray(response.data)) {
          const topLevelCategories = response.data.filter(category => !category.parent);
          console.log('Filtered categories:', topLevelCategories);
          setCategories(topLevelCategories);
        } else {
          console.error('Categories data is not an array:', response.data);
        }
      } else {
        console.error('Error fetching categories:', response.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getFirstName = async () => {
    try {L
      const storedFirstName = await AsyncStorage.getItem('@firstName');
      if (storedFirstName) {
        console.log('Returning stored firstName:', storedFirstName);
        return storedFirstName;
      }
    } catch (error) {
      console.error('Error getting firstName from storage:', error);
    }
    
    if (user && typeof user === 'object' && user.firstName) {
      console.log('Returning firstName from user object:', user.firstName);
      return user.firstName;
    }
    
    console.log('No firstName found, returning Guest');
    return 'Guest';
  };

  const trimProductName = (name) => {
    return name.length > 12 ? `${name.substring(0, 12)}...` : name;
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Product', {
      categoryId: category._id,
      categoryName: category.name,
      fromScreen: 'Ecommerce'
    });
  };

const addToCart = async (itemId, quantity = 1) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    if (!token) {
      ToastAndroid.show('Please login to add items to cart', ToastAndroid.SHORT);
      return;
    }

    const response = await postMethod({
      url: `customers/secure/cart/${itemId}?quantity=${quantity}`,
      token: token,
      payload: {} // Empty object as body
    });

    console.log('Add to cart response:', response);

    if (response.success) {
      const updatedCart = response.data;
      setCartItems(updatedCart.orderItems || []);
      setCartTotal(updatedCart.total || 0);
      
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.productUuid === itemId 
            ? { ...product, quantity: (product.quantity || 0) + quantity }
            : product
        )
      );

      ToastAndroid.show('Item added to cart successfully', ToastAndroid.SHORT);
      
      // Navigate to the Cart page
      navigation.navigate('Cart');
    } else {
      ToastAndroid.show(response.message || 'Failed to add item to cart', ToastAndroid.SHORT);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    ToastAndroid.show('An error occurred while adding to cart', ToastAndroid.SHORT);
  }
};
  const addToWishlist = async (productUuid) => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please log in to add items to your wishlist.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    try {
      console.log('Adding to wishlist, productUuid:', productUuid);
      
      const token = await AsyncStorage.getItem("@token");

      if (!token) {
        Alert.alert('Error', 'You need to be logged in to add items to your wishlist.');
        return;
      }

      const response = await postMethod({
        url: `customers/secure/wishlist/${productUuid}`,
        token: token,
        data: {}  
      });

      console.log("Add to wishlist response:", response);

      if (response.status === 401) {
        Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
        return;
      }

      if (response.success) {
        setWishlist(prevWishlist => [...prevWishlist, productUuid]);
        Alert.alert('Success', 'Item added to wishlist');
      } else {
        Alert.alert('Error', response.message || 'Failed to add item to wishlist');
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  const HeartIcon = ({ filled }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#FF0000" : "none"} stroke="#FF0000" strokeWidth="2">
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </Svg>
  );

  const fetchWishlist = async (token) => {
    try {
      const response = await getMethod({
        url: 'customers/secure/wishlist',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Fetch wishlist response:', response);

      if (response && response.success) {
        setWishlist(response.data.map(item => item.productUuid));
      } else if (response.status === 401) {
        console.error('Authentication failed for wishlist');
        // Handle unauthorized access (e.g., redirect to login)
      } else {
        console.error('Error fetching wishlist:', response?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const fetchDailyDeals = async () => {
    try {
      const response = await getMethod({
        url: 'products/featured',
        headers: {
          'accept': '*/*'
        },
      });
      
      if (response.success && Array.isArray(response.data)) {
        setDailyDeals(response.data);
      } else {
        console.error('Error fetching daily deals:', response.error);
        // Set empty array if failed to prevent undefined errors
        setDailyDeals([]);
      }
    } catch (error) {
      console.error('Error fetching daily deals:', error);
      setDailyDeals([]);
    }
  };

  // Add this useEffect to log when userInfo changes
  useEffect(() => {
    console.log('userInfo updated:', userInfo);
  }, [userInfo]);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  // Add this new useEffect to set the initial name
  useEffect(() => {
    const updateName = async () => {
      const name = await getFirstName();
      setUserInfo(prev => ({ ...prev, firstName: name }));
    };
    updateName();
  }, [user]); // Depend on user changes

  const handleViewAllCategories = () => {
    navigation.navigate("Category");
  };

  const handleViewAllProducts = () => {
    navigation.navigate("Product");
  };

  return (
    <ImageBackground
      source={require('../../assets/Blue-bg.png')}  
      style={styles.backgroundImage}
    >
      <HeaderComponent />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        nestedScrollEnabled={true}
      >
        <Text style={styles.welcomeHeader}>
          Hello {userInfo?.firstName || 'Guest'} 👋
        </Text>
        <View style={styles.offerBox}>
          <FlatList
            data={[
              { id: 1, image: require('../../assets/50-off.png') },
              { id: 2, image: require('../../assets/25-off.png') }
            ]}
            renderItem={({ item, index }) => (
              <View style={[styles.offerItem, index === 0 && styles.firstOfferItem]}>
                <Image 
                  source={item.image}
                  style={styles.offerImage}
                  resizeMode="cover"
                />
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offerListContent}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={width * 0.75 + 15}
          />
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <TouchableOpacity onPress={handleViewAllCategories}>
              <Text style={styles.viewAllText}>view all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollView}
          >
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TouchableOpacity 
                  key={category._id} 
                  style={styles.categoryItem}
                  onPress={() => handleCategoryPress(category)}
                >
                  <View style={[styles.categoryIconContainer]} >
                    {category.image ? (
                      <Image 
                        source={{ uri: category.image }} 
                        style={styles.categoryIcon}
                        resizeMode="contain"
                        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
                      />
                    ) : (
                      <Text>No Image</Text>
                    )}
                  </View>
                  <Text style={styles.categoryText} numberOfLines={2} ellipsizeMode="tail">
                    {category.name || 'Unnamed Category'}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No categories available</Text>
            )}
          </ScrollView>
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.dealsTitle}>Daily deals</Text>
            <TouchableOpacity onPress={handleViewAllProducts}>
              <Text style={styles.viewAllText}>view all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dailyDeals.map((product, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.dealItem}
                onPress={() => handleProductPress(product)}
              >
                <Image 
                  source={{ uri: product.imageUrl }} 
                  style={styles.dealImage} 
                  resizeMode="contain"
                />
                <TouchableOpacity 
                  style={styles.wishlistButton}
                  onPress={() => addToWishlist(product.productUuid)}
                >
                  <HeartIcon filled={wishlist.includes(product.productUuid)} />
                </TouchableOpacity>
                <Text style={styles.dealName}>{trimProductName(product.productName)}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.originalPrice}>Rs. {product.price}</Text>
                  <Text style={styles.discountedPrice}>Rs. {product.recommendedPrice}</Text>
                </View>

                <View style={styles.ratingContainer}>
                  {product.overallRating ? (
                    <>
                      <Text style={styles.starIcon}>⭐</Text>
                      <Text style={styles.ratingText}>{product.overallRating}</Text>
                    </>
                  ) : null}
                </View>
                {product.aaacertified && (
                  <View style={styles.aaAssuredContainer}>
                   <Text>AA Assured</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.addToCartButton}
                  onPress={() => {
                    if (product && product.productUuid) {
                      addToCart(product.productUuid, 1);
                    } else {
                      console.error('Invalid product data');
                      Alert.alert('Error', 'Unable to add item to cart due to invalid product data');
                    }
                  }}
                >
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 120,
  },
  welcomeHeader: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    fontFamily: 'Gabarito',
    fontWeight: '800',
  },
  offerBox: {
    height: 160,
    marginBottom: 15,
  },
  offerItem: {
    width: width * 0.65,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  firstOfferItem: {
    marginLeft: 15,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  offerListContent: {
    paddingRight: 15,
  },
  sectionContainer: {
    marginBottom: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 30,
    color: 'black',
    marginLeft: 10,
    fontFamily: 'Gabarito',
  },
  dealsTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 30,
    color: 'black',
    marginLeft: 10,
    fontFamily: 'Gabarito',
  },
  viewAllText: {
    color: '#29BDEE',
    fontSize: 16,
    marginRight: 10,
    fontFamily: 'Gabarito',
    fontWeight: '400',
    lineHeight: 24,
    width: 55,
    height: 24,
    fontFamily: 'Gabarito',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
    marginTop: 5,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 30,
    height: 30,
  },
  categoryText: {
    fontSize: 11,
    color: 'black',
    textAlign: 'center',
    height: 30,
    marginTop: 5,
    fontFamily: 'Gabarito',
  },
  dealsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  dealItem: {
    position: 'relative',
    width: 180,
    height: 270,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white',
    overflow: 'hidden',
    padding: 8,
  },
  dealImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  dealName: {
    marginTop: 15,
    fontFamily: 'Gabarito',
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  priceContainer: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPrice: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    lineHeight: 18,
    color: '#000000',
    marginRight: 6,
    fontFamily: 'Gabarito',
  },
  originalPrice: {
    fontFamily: 'Gabarito',
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
    textDecorationLine: 'line-through',
    fontFamily: 'Gabarito',
  },
  ratingContainer: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    fontSize: 12,
    color: '#FFD700',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    color: 'black',
    fontFamily: 'Gabarito',
  },
  aaAssuredContainer: {
    position: 'absolute',
    right: 6,
    top: 4,
    width: 38,
    height: 18,
  },
  addToCartButton: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    width: '90%',
    height: 32,
    backgroundColor: '#29BDEE',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Gabarito',
  },
  wishlistButton: {
    position: 'absolute',
    top: 10,
    left: 3,
    zIndex: 1,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoriesScrollView: {
    paddingLeft: 10,
  },
});

export default EcommercePage;
