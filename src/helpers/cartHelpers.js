import AsyncStorage from '@react-native-async-storage/async-storage';
import { postMethod } from './index'; // Adjust the import based on your project structure
import { ToastAndroid } from 'react-native';

export const handleAddToCart = async (productUuid, isLoggedIn, navigation) => {
  if (!isLoggedIn) {
    ToastAndroid.show('Please login to continue', ToastAndroid.SHORT);
    navigation.navigate('Login');
    return;
  }

  try {
    let url = `customers/secure/cart/${productUuid}?quantity=1`;
    let token = await AsyncStorage.getItem('@token');
    let response = await postMethod({ url, token, payload: {} });

    if (response.success) {
      ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
      navigation.navigate('Cart');
    } else {
      ToastAndroid.show(response.message, ToastAndroid.SHORT);
    }
  } catch (e) {
    console.log(e);
    ToastAndroid.show('An error occurred', ToastAndroid.SHORT);
  }
};