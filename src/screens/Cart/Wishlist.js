import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ToastAndroid,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { useAuth } from '../../screens/AuthModule/AuthContext';
import { deleteMethod, getMethod, postMethod } from '../../helpers';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import StatusBarManager from '../../components/StatusBarManager';
import HeaderComponent from '../../components/HeaderComponent';

const { width, height } = Dimensions.get('window');

const WishlistItem = ({ item, onRemove, onAddToBag }) => (
  <View style={styles.mainItemContainer}>
  <View style={styles.itemContainer}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
    </View>
    <View style={styles.itemDetails}>
      <Text style={styles.itemName} numberOfLines={2} ellipsizeMode="tail">
        {item.productName}
      </Text>
      <View style={styles.priceContainer}>
      <Text style={styles.originalPrice}>Rs. {(item.price * 1.2).toFixed(2)}</Text>
        <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>
      
      </View>
      <View style={styles.mainRatingContainer}>
        <View style={styles.ratingContainer}>
        <Icon name="star" size={16} color="#F8BD00" />
        <Text style={styles.rating}>{item.overallRating.toFixed(1)}</Text>
        </View>
        {item.aaacertified && (
            <View style={styles.ratingImageContainer}>
              <Image source={require('../../assets/UW_Assured_2.png')} style={styles.ratingImage} />
            </View>
          )}

      </View>
    </View>
    
  </View>
  <View style={styles.removeButtonContainer}> 
  <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item)}>
        <Svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M5.375 15.9922C5.52604 15.9922 5.64844 15.9479 5.74219 15.8594C5.83594 15.7708 5.88021 15.6562 5.875 15.5156L5.625 6.90625C5.625 6.76042 5.57812 6.64583 5.48438 6.5625C5.39062 6.47917 5.27083 6.4375 5.125 6.4375C4.96875 6.4375 4.84375 6.48177 4.75 6.57031C4.66146 6.65365 4.61979 6.76823 4.625 6.91406L4.85938 15.5156C4.86979 15.6615 4.91927 15.7786 5.00781 15.8672C5.10156 15.9505 5.22396 15.9922 5.375 15.9922ZM7.75781 15.9922C7.91406 15.9922 8.03906 15.9505 8.13281 15.8672C8.23177 15.7786 8.28125 15.6615 8.28125 15.5156V6.91406C8.28125 6.76823 8.23177 6.65365 8.13281 6.57031C8.03906 6.48177 7.91406 6.4375 7.75781 6.4375C7.60677 6.4375 7.48177 6.48177 7.38281 6.57031C7.28906 6.65365 7.24219 6.76823 7.24219 6.91406V15.5156C7.24219 15.6615 7.28906 15.7786 7.38281 15.8672C7.48177 15.9505 7.60677 15.9922 7.75781 15.9922ZM10.1484 15.9922C10.2995 15.9922 10.4193 15.9505 10.5078 15.8672C10.6016 15.7839 10.651 15.6667 10.6562 15.5156L10.8906 6.91406C10.8958 6.76823 10.8516 6.65365 10.7578 6.57031C10.6693 6.48177 10.5469 6.4375 10.3906 6.4375C10.25 6.4375 10.1328 6.47917 10.0391 6.5625C9.94531 6.64583 9.89583 6.76302 9.89062 6.91406L9.64844 15.5156C9.64323 15.6615 9.6849 15.7786 9.77344 15.8672C9.86719 15.9505 9.99219 15.9922 10.1484 15.9922ZM4.32812 4.53906V2.78906C4.32812 2.22656 4.5 1.78385 4.84375 1.46094C5.19271 1.13281 5.66667 0.96875 6.26562 0.96875H9.23438C9.83333 0.96875 10.3047 1.13281 10.6484 1.46094C10.9974 1.78385 11.1719 2.22656 11.1719 2.78906V4.53906H9.92969V2.86719C9.92969 2.64844 9.85677 2.47135 9.71094 2.33594C9.57031 2.20052 9.38281 2.13281 9.14844 2.13281H6.35156C6.11719 2.13281 5.92708 2.20052 5.78125 2.33594C5.64062 2.47135 5.57031 2.64844 5.57031 2.86719V4.53906H4.32812ZM0.78125 5.16406C0.625 5.16406 0.486979 5.10677 0.367188 4.99219C0.252604 4.8724 0.195312 4.73177 0.195312 4.57031C0.195312 4.41406 0.252604 4.27865 0.367188 4.16406C0.486979 4.04427 0.625 3.98438 0.78125 3.98438H14.7422C14.8984 3.98438 15.0339 4.04167 15.1484 4.15625C15.263 4.27083 15.3203 4.40885 15.3203 4.57031C15.3203 4.73177 15.263 4.8724 15.1484 4.99219C15.0391 5.10677 14.9036 5.16406 14.7422 5.16406H0.78125ZM4.17969 18.3672C3.61719 18.3672 3.16146 18.2005 2.8125 17.8672C2.46875 17.5391 2.28385 17.0938 2.25781 16.5312L1.70312 5H13.8125L13.2656 16.5234C13.2396 17.0859 13.0521 17.5339 12.7031 17.8672C12.3542 18.2005 11.901 18.3672 11.3438 18.3672H4.17969Z" fill="#FF453A"/>
        </Svg>
      </TouchableOpacity>
      <View style={styles.verticalLine} />
      <TouchableOpacity style={styles.addButton} onPress={() => onAddToBag(item)}>
        <Text style={styles.addButtonText}>Move to Cart</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const Wishlist = ({ navigation }) => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const userData = useSelector(state => state.data);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    StatusBar.setBackgroundColor('rgba(45, 189, 238, 0.2)');
    StatusBar.setBarStyle('dark-content');
    StatusBar.setTranslucent(true);
    
    return () => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  const getWishlist = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      if (!storedToken) {
        throw new Error('No token found. Please log in.');
      }

      let url = 'customers/secure/wishlist';
      let response = await getMethod({ url, token: storedToken });

      if (response.success && response.data) {
        setWishlist(response.data);
      } else {
        setWishlist([]);
        setError(response.message || 'Failed to fetch wishlist');
      }
    } catch (e) {
      console.error('Error fetching wishlist:', e);
      setWishlist([]);
      setError(e.message || 'An error occurred while fetching the wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getWishlist();
    }, [])
  );

  const addToCartFromWishlist = async (item) => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        ToastAndroid.show('Please login to continue', ToastAndroid.SHORT);
        return;
      }

      let url = `customers/secure/cart/${item?.productUuid}?quantity=1`;
      var payload = {
        productId: item?.productUuid,
        quantity: 1,
      };
      let response = await postMethod({ url, payload, token });
      console.log(token);
      if (response && response.success) {
        ToastAndroid.show(response.message || 'Item added to cart', ToastAndroid.SHORT);
        
        // Remove the item from the wishlist
        await removeFromWishlist(item);
        
        // Update the wishlist state
        setWishlist(prevWishlist => prevWishlist.filter(wishlistItem => wishlistItem.productUuid !== item.productUuid));
        
        navigation.navigate('Cart');
      } else {
        ToastAndroid.show(response.message || 'Failed to add item to cart', ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error('Error adding to cart:', e);
      ToastAndroid.show(e.message || 'An error occurred', ToastAndroid.SHORT);
    }
  };

  const removeFromWishlist = async item => {
    try {
      let url = `customers/secure/wishlist/${item?.productUuid}?`;
      var payload = {
        productId: item?.productUuid,
      };
      let token = await AsyncStorage.getItem('@token');
      let response = await deleteMethod({ url, payload, token });
      if (response && response.success) {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
        // Update the wishlist state immediately
        setWishlist(prevWishlist => prevWishlist.filter(wishlistItem => wishlistItem.productUuid !== item.productUuid));
      } else {
        ToastAndroid.show(response.message || 'Failed to remove item from wishlist', ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show('An error occurred while removing the item', ToastAndroid.SHORT);
    }
  };
  

  const EmptyWishlist = () => (
    <View style={styles.emptyWishlistContainer}>
      <Image
        source={require('../../assets/empty-wishlist.png')}
        style={styles.emptyWishlistImage}
      />
      <View style={styles.emptyWishlistTitleContainer}>
        <Text style={styles.emptyWishlistTitle}>Your Wishlist is empty!</Text>
      </View>
      <Text style={styles.emptyWishlistSubtitle}>
        looks like you don't have wishes yet.
      </Text>
      <Text style={styles.makeAWish}>Make a wish!</Text>
      
      <TouchableOpacity
        style={styles.shopNowButton}
        onPress={() => navigation.navigate('Product')}
      >
        <Svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M2.2959 15.0801C1.5293 15.0801 0.953125 14.8896 0.567383 14.5088C0.186523 14.1328 -0.00390625 13.5664 -0.00390625 12.8096V5.229C-0.00390625 4.47217 0.186523 3.90576 0.567383 3.52979C0.953125 3.14893 1.5293 2.9585 2.2959 2.9585H10.6968C11.4585 2.9585 12.0322 3.14893 12.418 3.52979C12.8037 3.90576 12.9966 4.47217 12.9966 5.229V12.8096C12.9966 13.5664 12.8135 14.1328 12.4473 14.5088C12.0811 14.8896 11.5708 15.0801 10.9165 15.0801H2.2959ZM2.31055 13.9009H10.8945C11.1484 13.9009 11.3657 13.8032 11.5464 13.6079C11.7271 13.4175 11.8174 13.1318 11.8174 12.751V5.2876C11.8174 4.90674 11.7173 4.62109 11.5171 4.43066C11.3169 4.23535 11.0361 4.1377 10.6748 4.1377H2.31055C1.94434 4.1377 1.66357 4.23535 1.46826 4.43066C1.27295 4.62109 1.17529 4.90674 1.17529 5.2876V12.751C1.17529 13.1318 1.27295 13.4175 1.46826 13.6079C1.66357 13.8032 1.94434 13.9009 2.31055 13.9009ZM3.60693 3.24414C3.60693 2.70215 3.73389 2.21387 3.98779 1.7793C4.2417 1.33984 4.58594 0.990723 5.02051 0.731934C5.45508 0.473145 5.9458 0.34375 6.49268 0.34375C7.03955 0.34375 7.53027 0.473145 7.96484 0.731934C8.4043 0.990723 8.75098 1.33984 9.00488 1.7793C9.25879 2.21387 9.38574 2.70215 9.38574 3.24414L8.20654 3.25146C8.20654 2.8999 8.1333 2.58984 7.98682 2.32129C7.84521 2.05273 7.64502 1.84277 7.38623 1.69141C7.13232 1.53516 6.83447 1.45703 6.49268 1.45703C6.15576 1.45703 5.85791 1.53516 5.59912 1.69141C5.34521 1.84277 5.14502 2.05273 4.99854 2.32129C4.85693 2.58984 4.78613 2.8999 4.78613 3.25146L3.60693 3.24414Z" fill="white"/>
        </Svg>
        <Text style={styles.shopNowButtonText}>Shop now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <View style={styles.statusBarBackground}>
        <StatusBarManager />
      </View>
      <LinearGradient
        colors={['#B6E2F3', '#FFFFFF']}
        locations={[0, 0.4]}
        style={styles.container}
      >
        <View style={styles.container}>
          <HeaderComponent title="" showSearch={true} />
          <View style={{ padding: 15 }}>
            <Text style={styles.wishlistText}>Wishlist</Text>
            {isLoading ? (
              <Text>Loading...</Text>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : wishlist && wishlist.length > 0 ? (
              <FlatList
                data={wishlist}
                renderItem={({ item }) => (
                  <WishlistItem
                    item={item}
                    onRemove={removeFromWishlist}
                    onAddToBag={addToCartFromWishlist}
                  />
                )}
                keyExtractor={(item) => item.productUuid}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <EmptyWishlist />
            )}
          </View>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainItemContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wishlistText: {
    fontFamily: 'Gabarito',
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 10,
  },
  ratingImage:{
    width: 60,
    height: 30,
    borderRadius: 10,
    marginRight: 10,
  },
  ratingImageContainer:{
    width: '25%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainRatingContainer:{
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 15,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
 
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  price: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginRight: 10,
    marginLeft: 10,
    lineHeight: 19.2,
  },
  originalPrice: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    color: '#999999',
    lineHeight: 16.8,
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    color: '#000000',
    marginLeft: 4,
    lineHeight: 15.6,
  },
  removeButton: {
     
    marginLeft: 19,
  },
  removeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-around',
  },
  addButton: {
   
    
  },
  addButtonText: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    color: '#F8BD00',
    fontWeight: '500',
    lineHeight: 16.8,
  }, 
  // emptyWishlistContainer: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   paddingHorizontal: 20,
  //   backgroundColor: '#E6F3FA',
  // },
 
  emptyWishlistImage: {
    width: '100%',
    height: 200,
    marginTop: '38%',
    resizeMode: 'contain',
    marginBottom: 30,
    backgroundColor: 'transparent',
  },
  emptyWishlistTitleContainer: {
    marginTop: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyWishlistTitle: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    fontWeight: '600',
    color: '#EC1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyWishlistSubtitle: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 5,
  },
  makeAWish: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    textAlign: 'center',
    color: '#29BDEE',
    fontWeight: '400',
    marginBottom: 20,
  },
  shopNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    borderRadius: 25,
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '40%',
    alignSelf: 'center',
  },
  shopIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  shopNowButtonText: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.23,
    marginLeft: 10, // Add some space between the SVG and the text
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingTop: 10,
  },
  verticalLine: {
    width: 2,
    height: '100%',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  statusBarBackground: {
    height: StatusBar.currentHeight,
    backgroundColor: 'rgba(45, 189, 238, 0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});

export default Wishlist;
