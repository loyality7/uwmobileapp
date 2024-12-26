import React, { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';
import HeaderComponent from '../../components/HeaderComponent';
import { getMethod, deleteMethod, postMethod } from '../../helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Svg, Path } from 'react-native-svg';


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SPACING = SCREEN_WIDTH * 0.03; // 3% of screen width
const ITEM_WIDTH = SCREEN_WIDTH * 0.94; // 94% of screen width

const Cart = ({ navigation }) => {
  const [cartList, setCartList] = useState([]);
  const [cartData, setCartData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);

  const getCartList = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = "customers/secure/cart";
      let token = await AsyncStorage.getItem("@token")
      let response = await getMethod({ url, token });
      if (response.success) {
        setCartList(response.data.orderItems || []);
        setCartData(response.data);
        // Calculate grand total
        const total = response.data.orderItems.reduce((sum, item) => sum + (item.price * (quantities[item.productUuid] || 1)), 0);
        setGrandTotal(total);
      }
    } catch (e) {
      console.log('Error fetching cart:', e)
      ToastAndroid.show("Failed to fetch cart items", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  }, [quantities]);

  useFocusEffect(
    useCallback(() => {
      getCartList();
    }, [getCartList])
  );

  const removeFromCart = async (item) => {
    setIsLoading(true);
    try {
      let url = `customers/secure/cart/${item?.productUuid}?`;
      let token = await AsyncStorage.getItem("@token")
      let response = await deleteMethod({ url, token });
      if (response && response.success) {
        ToastAndroid.show("Item removed from cart", ToastAndroid.SHORT);
        await getCartList();
      } else {
        ToastAndroid.show("Failed to remove item", ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log('Error removing from cart:', e);
      ToastAndroid.show("Failed to remove item", ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const moveToList = async (item) => {
    setIsLoading(true);
    try {
      let url = `customers/secure/wishlist/${item.productUuid}`;
      let token = await AsyncStorage.getItem("@token");
      let response = await postMethod({ url, token, payload: {} });
      
      if (response && response.success) {
        ToastAndroid.show("Product moved to wishlist", ToastAndroid.SHORT);
        await removeFromCart(item);
      } else {
        ToastAndroid.show("Failed to move product to wishlist", ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log('Error moving product to list:', e);
      if (e.message.includes('Cannot POST')) {
        ToastAndroid.show("Wishlist feature is not available", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Failed to move product", ToastAndroid.SHORT);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities(prev => {
      const updatedQuantities = { ...prev, [itemId]: newQuantity };
      // Recalculate grand total
      const total = cartList.reduce((sum, item) => sum + (item.price * (updatedQuantities[item.productUuid] || 1)), 0);
      setGrandTotal(total);
      return updatedQuantities;
    });
    // TODO: Add API call to update quantity on the server
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyCartContainer}>
      <HeaderComponent />
      <View style={styles.titleContainer}>
        <Text style={styles.cartText}>Cart</Text>
      </View>
      <Image
        source={require('../../assets/empty-cart.png')}
        style={styles.emptyCartImage}
      />
      <View style={styles.emptyCartTitleContainer}>
        <Text style={styles.emptyCartTitle}>Your Cart is empty!</Text>
      </View>
      <Text style={styles.emptyCartSubtext}>Lets purchase something</Text>
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

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressItem}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <Text style={[styles.progressText, styles.activeText]}>Cart</Text>
      </View>
      <View style={styles.progressLine} />
      <View style={styles.progressItem}>
        <View style={styles.progressDot} />
        <Text style={styles.progressText}>Address</Text>
      </View>
      <View style={styles.progressLine} />
      <View style={styles.progressItem}>
        <View style={styles.progressDot} />
        <Text style={styles.progressText}>Payment</Text>
      </View>
    </View>
  );

  const renderCartItem = (item, i) => (
    <View style={styles.cartItemContainer} key={i}>
      <View style={styles.cartItem}>
        <Image source={{ uri: item?.imageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productPrice}>Rs. {item?.price}</Text>
          <View style={styles.arrivingContainer}>
            <Svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M2.71512 1.11701C2.71512 0.979589 2.71512 0.842167 2.71512 0.73223C2.71512 0.484871 2.88179 0.319965 3.13179 0.29248C3.38179 0.29248 3.54845 0.484871 3.54845 0.73223C3.54845 0.869652 3.54845 0.979589 3.54845 1.11701C4.65957 1.11701 5.77068 1.11701 6.88179 1.11701C6.88179 1.00707 6.88179 0.897136 6.88179 0.787199C6.88179 0.512355 7.04845 0.319965 7.29845 0.319965C7.52068 0.29248 7.68734 0.484871 7.68734 0.759714C7.68734 0.869652 7.68734 0.979589 7.68734 1.08953C7.85401 1.08953 8.02068 1.08953 8.21512 1.08953C8.52068 1.08953 8.82623 1.1445 9.10401 1.28192C9.85401 1.6667 10.2707 2.27135 10.3262 3.09588C10.4373 4.88237 10.4373 6.64137 10.354 8.42785C10.3262 8.78514 10.3262 9.14244 10.2429 9.49974C10.0485 10.3792 9.27068 11.0114 8.35401 11.0663C6.7429 11.1763 5.13179 11.2038 3.54845 11.1488C2.96512 11.1213 2.38179 11.1213 1.82623 11.0389C0.909565 10.9289 0.187343 10.1044 0.104009 9.16993C-0.00710189 7.32847 -0.0348796 5.51451 0.0484537 3.67306C0.0762315 3.31576 0.0762315 2.98595 0.159565 2.62865C0.354009 1.77664 1.21512 1.11701 2.13179 1.11701C2.32623 1.11701 2.4929 1.11701 2.71512 1.11701ZM0.881787 4.41513C0.881787 4.44262 0.881787 4.4701 0.881787 4.4701C0.826232 6.03671 0.854009 7.57583 0.96512 9.14244C0.992898 9.7471 1.4929 10.2143 2.10401 10.2693C2.4929 10.2968 2.88179 10.2968 3.27068 10.3243C4.96512 10.4067 6.68734 10.3792 8.38179 10.2693C8.9929 10.2418 9.46512 9.7471 9.52068 9.14244C9.63179 7.57583 9.63179 6.03671 9.60401 4.4701C9.60401 4.44262 9.60401 4.41513 9.57623 4.38765C6.63179 4.41513 3.77068 4.41513 0.881787 4.41513ZM9.52068 3.56312C9.4929 3.28827 9.4929 3.04092 9.43734 2.79356C9.2429 2.10645 8.46512 1.72167 7.71512 1.94154C7.71512 2.05148 7.71512 2.16142 7.71512 2.29884C7.71512 2.57368 7.54845 2.76607 7.29845 2.76607C7.04845 2.76607 6.88179 2.57368 6.88179 2.32632C6.88179 2.21639 6.88179 2.07896 6.88179 1.96903C5.77068 1.96903 4.65957 1.96903 3.54845 1.96903C3.54845 2.10645 3.54845 2.24387 3.54845 2.35381C3.54845 2.60117 3.38179 2.76607 3.13179 2.79356C2.88179 2.79356 2.71512 2.60117 2.71512 2.35381C2.71512 2.21639 2.71512 2.10645 2.71512 1.96903C2.52068 1.96903 2.32623 1.96903 2.15956 1.96903C1.90956 1.96903 1.68734 2.05148 1.4929 2.1889C0.96512 2.5462 0.909565 3.04092 0.937343 3.61809C3.77068 3.56312 6.63179 3.56312 9.52068 3.56312Z" fill="#8D8D95"/>
              <Path d="M3.13158 5.65186C3.46491 5.65186 3.77047 5.9267 3.74269 6.284C3.74269 6.61381 3.46491 6.88865 3.13158 6.88865C2.79825 6.88865 2.49269 6.61381 2.52047 6.25651C2.49269 5.9267 2.77047 5.65186 3.13158 5.65186Z" fill="#8D8D95"/>
              <Path d="M5.82623 6.25651C5.82623 6.58632 5.54845 6.88865 5.21512 6.88865C4.88178 6.88865 4.604 6.61381 4.604 6.284C4.604 5.95418 4.88178 5.65186 5.21512 5.65186C5.54845 5.65186 5.82623 5.9267 5.82623 6.25651Z" fill="#8D8D95"/>
              <Path d="M7.27059 5.65186C7.60392 5.65186 7.90947 5.9267 7.8817 6.284C7.8817 6.61381 7.60392 6.88865 7.27059 6.88865C6.93725 6.88865 6.6317 6.61381 6.65947 6.25651C6.65947 5.89921 6.93725 5.65186 7.27059 5.65186Z" fill="#8D8D95"/>
              <Path d="M3.74268 8.31796C3.74268 8.64777 3.4649 8.9501 3.10379 8.92262C2.77045 8.92262 2.49268 8.64777 2.49268 8.29048C2.49268 7.96067 2.77045 7.65834 3.13156 7.68582C3.4649 7.71331 3.74268 7.98815 3.74268 8.31796Z" fill="#8D8D95"/>
              <Path d="M5.82617 8.31798C5.82617 8.64779 5.54839 8.95012 5.18728 8.95012C4.85395 8.95012 4.57617 8.67527 4.57617 8.34546C4.57617 8.01565 4.85395 7.71332 5.21506 7.71332C5.54839 7.68584 5.82617 7.96068 5.82617 8.31798Z" fill="#8D8D95"/>
              <Path d="M7.90967 8.31796C7.90967 8.64777 7.63189 8.92262 7.29856 8.92262C6.96522 8.92262 6.65967 8.64777 6.65967 8.29048C6.65967 7.96067 6.93745 7.65834 7.29856 7.68582C7.63189 7.71331 7.90967 7.98815 7.90967 8.31796Z" fill="#8D8D95"/>
            </Svg>
            <Text style={styles.arrivingText}>Arriving in</Text>
          </View>
          <Text style={styles.pincodeText}>Enter Pincode above</Text>
        </View>
        <View style={styles.aaacertifiedContainer}>
        <Image source={require('../../assets/UW_Assured_2.png')} style={styles.aaacertifiedImage} />
        </View>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => updateQuantity(item.productUuid, (quantities[item.productUuid] || 1) - 1)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantities[item.productUuid] || 1}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.productUuid, (quantities[item.productUuid] || 1) + 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => removeFromCart(item)} style={styles.deleteButton}>
          <Svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M5.375 15.9922C5.52604 15.9922 5.64844 15.9479 5.74219 15.8594C5.83594 15.7708 5.88021 15.6562 5.875 15.5156L5.625 6.90625C5.625 6.76042 5.57812 6.64583 5.48438 6.5625C5.39062 6.47917 5.27083 6.4375 5.125 6.4375C4.96875 6.4375 4.84375 6.48177 4.75 6.57031C4.66146 6.65365 4.61979 6.76823 4.625 6.91406L4.85938 15.5156C4.86979 15.6615 4.91927 15.7786 5.00781 15.8672C5.10156 15.9505 5.22396 15.9922 5.375 15.9922ZM7.75781 15.9922C7.91406 15.9922 8.03906 15.9505 8.13281 15.8672C8.23177 15.7786 8.28125 15.6615 8.28125 15.5156V6.91406C8.28125 6.76823 8.23177 6.65365 8.13281 6.57031C8.03906 6.48177 7.91406 6.4375 7.75781 6.4375C7.60677 6.4375 7.48177 6.48177 7.38281 6.57031C7.28906 6.65365 7.24219 6.76823 7.24219 6.91406V15.5156C7.24219 15.6615 7.28906 15.7786 7.38281 15.8672C7.48177 15.9505 7.60677 15.9922 7.75781 15.9922ZM10.1484 15.9922C10.2995 15.9922 10.4193 15.9505 10.5078 15.8672C10.6016 15.7839 10.651 15.6667 10.6562 15.5156L10.8906 6.91406C10.8958 6.76823 10.8516 6.65365 10.7578 6.57031C10.6693 6.48177 10.5469 6.4375 10.3906 6.4375C10.25 6.4375 10.1328 6.47917 10.0391 6.5625C9.94531 6.64583 9.89583 6.76302 9.89062 6.91406L9.64844 15.5156C9.64323 15.6615 9.6849 15.7786 9.77344 15.8672C9.86719 15.9505 9.99219 15.9922 10.1484 15.9922ZM4.32812 4.53906V2.78906C4.32812 2.22656 4.5 1.78385 4.84375 1.46094C5.19271 1.13281 5.66667 0.96875 6.26562 0.96875H9.23438C9.83333 0.96875 10.3047 1.13281 10.6484 1.46094C10.9974 1.78385 11.1719 2.22656 11.1719 2.78906V4.53906H9.92969V2.86719C9.92969 2.64844 9.85677 2.47135 9.71094 2.33594C9.57031 2.20052 9.38281 2.13281 9.14844 2.13281H6.35156C6.11719 2.13281 5.92708 2.20052 5.78125 2.33594C5.64062 2.47135 5.57031 2.64844 5.57031 2.86719V4.53906H4.32812ZM0.78125 5.16406C0.625 5.16406 0.486979 5.10677 0.367188 4.99219C0.252604 4.8724 0.195312 4.73177 0.195312 4.57031C0.195312 4.41406 0.252604 4.27865 0.367188 4.16406C0.486979 4.04427 0.625 3.98438 0.78125 3.98438H14.7422C14.8984 3.98438 15.0339 4.04167 15.1484 4.15625C15.263 4.27083 15.3203 4.40885 15.3203 4.57031C15.3203 4.73177 15.263 4.8724 15.1484 4.99219C15.0391 5.10677 14.9036 5.16406 14.7422 5.16406H0.78125ZM4.17969 18.3672C3.61719 18.3672 3.16146 18.2005 2.8125 17.8672C2.46875 17.5391 2.28385 17.0938 2.25781 16.5312L1.70312 5H13.8125L13.2656 16.5234C13.2396 17.0859 13.0521 17.5339 12.7031 17.8672C12.3542 18.2005 11.901 18.3672 11.3438 18.3672H4.17969Z" fill="#FF453A"/>
          </Svg>
        </TouchableOpacity>
        <View style={styles.verticalLine} />
        <TouchableOpacity onPress={() => moveToList(item)}>
          <Text style={styles.moveToWishlistText}>Move to Wishlist</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#B2E3F4', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        {cartList.length > 0 ? (
          <>
            <View style={styles.titleContainer}>
              <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                style={styles.backButton}
              >
                <Icon name="arrow-back" size={24} color="#000000" />
              </TouchableOpacity>
              <Text style={styles.cartText}>My Cart ({cartList.length})</Text>
            </View>
            {renderProgressBar()}

            <View style={styles.deliveryContainer}>
              <Text style={styles.deliveryText}>Deliver to</Text>
              <View style={styles.pincodeContainer}>
                <TextInput 
                  style={styles.pincodeInput}
                  placeholder="Enter Pincode"
                  placeholderTextColor="#979797"
                />
                <TouchableOpacity style={styles.checkButton}>
                  <Text style={styles.checkButtonText}>Check</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
              {cartList.map(renderCartItem)}
            </ScrollView>
          </>
        ) : (
          renderEmptyCart()
        )}
      </LinearGradient>

      {cartList.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>₹{grandTotal.toFixed(2)}</Text>
            <Text style={styles.taxesText}>Inclusive of all taxes</Text>
          </View>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('Address', { cartData: { ...cartData, totalAmount: grandTotal } })}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: SCREEN_HEIGHT * 0.15,
  },
  cartItem: {
    display: 'flex',
    marginTop:10,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    // padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    // alignItems: 'center',
  },
  aaacertifiedContainer:{
    marginRight: 10,
    marginTop: -40,
  },
  productImage: {
    width: SCREEN_WIDTH * 0.18, // 18% of screen width
    height: SCREEN_WIDTH * 0.18,
    borderRadius: 10,
    marginRight: SPACING,
  },
  deleteButton:{
    marginLeft: 60,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: SCREEN_WIDTH * 0.04, // 4% of screen width
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: SPACING / 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    color: '#000000',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 5,
  },
  calenderImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  calenderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calenderText: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '400',
    lineHeight: 14.4,
    fontFamily:'Gabarito',
    marginLeft: 5,
  },
  pincode: {
    fontSize: 10,
    color: '#29BDEE',
    fontWeight: '400',
    lineHeight: 12,
    fontFamily:'Gabarito',
    marginTop: 5,
    marginLeft: 5,
  },
  actionButtons: {
    // alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  moveToListButton: {
    backgroundColor: '#0A84FF',  
    padding: 10,
  
    borderRadius: 20,
    marginBottom: 10,
  },
  moveToListText: {
    color: '#FFFFFF',  
    fontSize: 12,
  },
  removeButton: {
    padding: 5,
  },
  footer: {
    position: 'absolute',
    width: '100%',
    minHeight: SCREEN_HEIGHT * 0.11, // 11% of screen height
    left: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING * 2,
    paddingVertical: SPACING,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  overviewContainer: {
    marginBottom: 15,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  overviewText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 5,
  },
  detailedSummaryLink: {
    color: '#005FAC',
    fontSize: 14,
  },
  checkoutButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  headerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 30,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginLeft: 15,
    paddingHorizontal: 10,
  },
  searchImage: {
    marginLeft: 5,
  },
  searchInput: {
    flex: 1,
    // height: 40,
    fontSize: 16,
    // marginTop: 6,
  },
  // Add new styles for progress bar and pincode input
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4%',
    marginHorizontal: '3%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: '5%',
    paddingVertical: 10,
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: '#FFFFFF',
  },
  activeDot: {
    backgroundColor: '#2DBDEE', // Fill color for active dot
    borderColor: '#2DBDEE',  // Border color for active dot
  },
  progressText: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    lineHeight: 16,
    color: '#999999',
  },
  activeText: {
    color: '#2DBDEE', // Text color for active step
    fontWeight: '500',
  },
  progressLine: {
    width: 24,
    height: 1,
    backgroundColor: '#999999',
    marginHorizontal: 8,
  },
  deliveryContainer: {
    marginTop: '4%',
    marginHorizontal: '5%',
  },
  deliveryText: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    lineHeight: 19.2,
    color: '#000000',
    fontWeight: '400',
    marginBottom: 7,
  },
  pincodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    flexWrap: 'wrap',
    gap: 10,
  },
  pincodeInput: {
    flex: 1,
    minWidth: 120,
    maxWidth: 200,
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
    fontFamily: 'Gabarito',
    fontSize: 16,
    lineHeight: 19.2,
    color: '#000000',
    paddingBottom: 5, // Add some padding at the bottom

  },
  pincodeInputPlaceholder: {
    color: '#979797',
    fontFamily: 'Gabarito',
    fontSize: 16,
    lineHeight: 19.2,
  },
  checkButton: {
    minWidth: 80,
    height: 35,
    backgroundColor: '#2DBDEE',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  checkButtonText: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    lineHeight: 19,
    color: '#FFFFFF',
  },
  
  quantityButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  simpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F0F8FF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 16,
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    fontFamily: 'Gabarito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  totalAmount: {
    fontFamily: 'Gabarito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: SCREEN_WIDTH * 0.06,
    lineHeight: SCREEN_WIDTH * 0.08,
    color: '#2DBDEE',
    marginTop: SPACING / 2,
  },
  taxesText: {
    fontFamily: 'Gabarito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12,
    color: '#999999',
    marginTop: 2,
  },
  continueButton: {
    width: SCREEN_WIDTH * 0.45,
    maxWidth: 170,
    height: SCREEN_HEIGHT * 0.06,
    backgroundColor: '#2DBDEE',
    borderRadius: SCREEN_WIDTH * 0.065,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: 'Gabarito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '8%',
    marginLeft: '5%',
    paddingRight: '5%',
  },
  cartItemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: ITEM_WIDTH,
    alignSelf: 'center',
    marginVertical: SPACING,
    padding: SPACING,
  },
  cartItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 10,
  },
  productImage: {
    width: SCREEN_WIDTH * 0.18, // 18% of screen width
    height: SCREEN_WIDTH * 0.18,
    borderRadius: 10,
    marginRight: SPACING,
  },
  productDetails: {
    flex: 1,
    minWidth: 150,
  },
  productName: {
    fontSize: SCREEN_WIDTH * 0.04, // 4% of screen width
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: SPACING / 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  arrivingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  arrivingText: {
    fontSize: 12,
    color: '#8D8D95',
    marginLeft: 4,
  },
  pincodeText: {
    fontSize: 12,
    color: '#2DBDEE',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: SPACING,
    right: SPACING,
    backgroundColor: '#2DBDEE',
    borderRadius: SCREEN_WIDTH * 0.05,
    padding: SPACING / 2,
  },
  quantityButton: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  deleteButton: {
    marginRight: 16,
  },
  verticalLine: {
    width: 1,
    height: 20,
    backgroundColor: '#EEEEEE',
    marginRight: 16,
  },
  moveToWishlistText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  cartText: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 24,
    marginLeft: 10,
  },
  emptyCartImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.25,
    marginTop: SCREEN_HEIGHT * 0.15,
    resizeMode: 'contain',
    marginBottom: SCREEN_HEIGHT * 0.04,
    backgroundColor: 'transparent',
  },
  emptyCartTitleContainer: {
    marginTop: '10%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartTitle: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    fontWeight: '600',
    color: '#EC1A1A',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyCartSubtext: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  shopNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A84FF',
    borderRadius: SCREEN_WIDTH * 0.06,
    gap: SPACING,
    paddingVertical: SPACING * 1.5,
    paddingHorizontal: SPACING * 2,
    width: SCREEN_WIDTH * 0.4,
    alignSelf: 'center',
  },
  shopNowButtonText: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.23,
    marginLeft: 10,
  },
});

export default Cart;
