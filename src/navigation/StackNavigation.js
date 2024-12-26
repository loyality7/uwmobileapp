import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this import
import TabNavigation from './TabNavigation';
import Login from '../screens/AuthModule/Login';
import Intro from '../screens/AuthModule/Intro';
import Register from '../screens/AuthModule/Register';
import ForgotPassword from '../screens/AuthModule/ForgotPassword';
import OtpVerification from '../screens/AuthModule/OtpVerification';
import ResetPassword from '../screens/AuthModule/ResetPassword';
import Category from '../screens/Category/Category';
import { Text } from 'react-native-paper';
import SubCategory from '../screens/SubCategory/SubCategory';
import Product from '../screens/Product/Product';
import ProductDetails from '../screens/Product/ProductDetails';
import Cart from '../screens/Cart/Cart';
import Wishlist from '../screens/Cart/Wishlist';
import AffiliateForm from '../screens/Affiliate';
import HubSelectionPage from '../screens/Hub';
import HubForm from '../screens/Hub/HubForm';
import ProfileEdit from '../screens/ProfileEdit';
import ChangePassword from '../screens/ChangePassword';
import OrderList from '../screens/Order/OrderList';
import OrderDetails from '../screens/Order/OrderDetails';
import RatingComponent from '../screens/Rating';
import SupportList from '../screens/Support';
import AddSupportList from '../screens/Support/AddSupportList';
import AddressList from '../screens/Address';
import EcommercePage from '../screens/Ecommerce/Ecommerce';
import Notification from '../screens/Notification'; // Add this import
import AffiliateLanding from '../screens/Affiliate/AffiliateLanding'; // Add this import
import AffiliateTabNavigation from './AffiliateTabNavigation'; // Make sure this import is present
import SaleCard from '../screens/Affiliate/SaleCard'; // Add this import
import Ecommerce from '../screens/Ecommerce/Ecommerce'; // Add this import
import CardSold from '../screens/Affiliate/cardsold'; // Update this import to match the actual location of your CardSold component
import OnlineAffiliateTabNavigation from './OnlineAffiliateTabNavigation';
import OnlineAffiliateLanding from '../screens/Affiliate/OnlineAffiliateLanding';
import CardsStatus from '../screens/Affiliate/CardsStatus'; // Add this import
import MyLinks from '../screens/Affiliate/MyLinks'; // Add this import
import BrainBox from '../screens/Hub/BrainBox/BrainBox'; // Make sure this import is correct
import HubTabNavigation from './HubTabNavigation';
import BrainBoxProduct from '../screens/Hub/BrainBox/brainbox_product'; // Add this import
import XBO from '../screens/Hub/XBO/XBO'; // Add this import
import XBOProduct from '../screens/Hub/XBO/xbo_product'; // Add this import
import AgrisureProduct from '../screens/Hub/AgriSure/agrisure_product'; // Add this import
import AppsTabNavigation from './AppsTabNavigation'; // Add this import
import EcomTabNavigation from './EcomTabNavigation'; // Add this import
import Address from '../screens/Cart/Address'; // Add this import
import ProductRating from '../screens/Product/ProductRating'; // Add this import
import CheckoutOverview from '../screens/Cart/OverView'; // Add this import
import RequestCallBack from '../screens/Support/RequestCallBack';
import EmailSupport from '../screens/Support/EmailSupport';
import MyPosts from '../screens/Hub/MyPosts'; // Add this import
import AgriSure from '../screens/Hub/AgriSure/AgriSure';
import ChatSupport from '../screens/Support/chatSupport';
import ReturnProduct from '../screens/Product/ReturnProduct';
// ... existing imports ...
import OrderItemsList from '../screens/Order/OrderItemsList';
import CreatePost from '../screens/Hub/BrainBox/brainBoxPost';
import BrainBoxRegistration from '../screens/Hub/BrainBox/brainBoxRegistration';
import HubDetail from '../screens/Hub/HubDetail'; // Add this import at the top with other imports


const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Fetched token:', token);
        setInitialRoute(token ? 'Home' : 'Login');
      } catch (error) {
        console.error('Failed to fetch token', error);
        setInitialRoute('Login');
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    console.log('Initial route is null, showing loading screen');
    // Optionally, you can return a loading screen here
    return null;
  }

  console.log('Initial route:', initialRoute);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'white',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={AppsTabNavigation} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen
        name="Category"
        component={Category}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Text style={{ fontSize: 22, color: 'black', textAlign: 'center' }}>
              Categories
            </Text>
          ),
          headerStyle: { backgroundColor: '#F0F0F0' },
          headerTintColor: '#000',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="SubCategory"
        component={SubCategory}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Text style={{ fontSize: 22, color: 'black', textAlign: 'center' }}>
              Sub Categories
            </Text>
          ),
          headerStyle: { backgroundColor: '#F0F0F0' },
          headerTintColor: '#000',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="Product"  // Change this from "Products" to "Product"
        component={Product}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: '#F0F0F0' },
          headerTitle: () => null,
          headerBackVisible: false,
          headerTintColor: '#000',
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={{ paddingRight: 5 }}>
              <Image source={require('../assets/cart_blue.png')} style={{ resizeMode: 'contain', marginRight: 10 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: false,
          headerTitle: () => null,
          headerStyle: { backgroundColor: '#F0F0F0' },
          headerTintColor: '#000',
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={{ paddingRight: 5 }}>
              <Image source={require('../assets/cart_blue.png')} style={{ resizeMode: 'contain', marginRight: 10 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <Stack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: '#F0F0F0' },
          headerTitle: () => null,
          headerBackVisible: false,
          headerTintColor: '#000',
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={{ paddingRight: 5 }}>
              <Image source={require('../assets/cart_blue.png')} style={{ resizeMode: 'contain', marginRight: 10 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Affiliate" component={AffiliateForm} />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image source={require('../assets/app_logo_new.png')} style={{ width: 100, resizeMode: 'contain' }} />
          ),
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => <Icon name="keyboard-arrow-left" size={30} color="#005FAC" />,
          headerTintColor: '#fff',
          statusBarHidden: true
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image source={require('../assets/app_logo_new.png')} style={{ width: 100, resizeMode: 'contain' }} />
          ),
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => <Icon name="keyboard-arrow-left" size={30} color="#005FAC" />,
          headerTintColor: '#fff',
          statusBarHidden: true
        }}
      />
      <Stack.Screen
        name="AddressList"
        component={AddressList}
        options={{
          headerShown: false  // Changed from true to false
        }}
      />
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{
          headerShown: false,
          
        }}
      />
      <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false, statusBarHidden: true }} />
      <Stack.Screen
        name="Rating"
        component={RatingComponent}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image source={require('../assets/app_logo_new.png')} style={{ width: 100, resizeMode: 'contain' }} />
          ),
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => <Icon name="keyboard-arrow-left" size={30} color="#000" />,
          headerTintColor: '#fff',
          statusBarHidden: true
        }}
      />
      <Stack.Screen
        name="Support"
        component={SupportList}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image source={require('../assets/app_logo_new.png')} style={{ width: 100, resizeMode: 'contain' }} />
          ),
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => <Icon name="keyboard-arrow-left" size={30} color="#000" />,
          headerTintColor: '#fff',
          statusBarHidden: true
        }}
      />
      <Stack.Screen
        name="AddSupportList"
        component={AddSupportList}
        options={{
          headerShown: false,
          headerTitle: () => (
            <Image source={require('../assets/app_logo_new.png')} style={{ width: 100, resizeMode: 'contain' }} />
          ),
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => <Icon name="keyboard-arrow-left" size={30} color="#000" />,
          headerTintColor: '#fff',
          statusBarHidden: true
        }}
      />
      <Stack.Screen name="Hub" component={HubSelectionPage} />
      <Stack.Screen name="HubStudents" component={HubForm} />
      <Stack.Screen name="HubFarmers" component={HubForm} />
      <Stack.Screen name="HubMarketPlace" component={HubForm} />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: true,
          headerTitle: () => (
            <Image source={require('../assets/app_logo_new.png')} style={{ width: 100, resizeMode: 'contain' }} />
          ),
          headerBackVisible: false,
          headerStyle: { backgroundColor: '#F5F5F5' },
          headerLeft: () => <Icon name="keyboard-arrow-left" size={30} color="#000" />,
          headerTintColor: '#fff',
          statusBarHidden: true
        }}
      />
      {/* Replace the AffiliateLanding screen with AffiliateTabNavigation */}
      <Stack.Screen
        name="AffiliateLanding"
        component={AffiliateTabNavigation}
        options={{
          headerShown: false,
        }}
      />
      {/* Online Affiliate */}
      <Stack.Screen
        name="OnlineAffiliateLanding"
        component={OnlineAffiliateTabNavigation}
        options={{
          headerShown: false,
        }}
      />
      {/* Add SaleCard screen inside the stack */}
      <Stack.Screen
        name="SaleCard"
        component={SaleCard}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="EcomTabNavigation"  // Changed from "Ecommerce"
        component={EcomTabNavigation} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Ecommerce" 
        component={Ecommerce} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CardSold"
        component={CardSold}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CardsStatus"
        component={CardsStatus}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyLinks"
        component={MyLinks}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BrainBox"
        component={HubTabNavigation}
        options={{
          headerShown: false,
        }}
        initialParams={{ service: 'BrainBox' }}
      />
      <Stack.Screen
        name="BrainBoxProduct"
        component={BrainBoxProduct}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="XBO"
        component={HubTabNavigation}
        options={{
          headerShown: false,
        }}
        initialParams={{ service: 'XBO' }}
      />
      <Stack.Screen
        name="XBOProduct"
        component={XBOProduct}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AgriSure"
        component={HubTabNavigation}
        options={{
          headerShown: false,
        }}
        initialParams={{ service: 'AgriSure' }}
      />
      <Stack.Screen
        name="AgrisureProduct"
        component={AgrisureProduct}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AppsTab"
        component={AppsTabNavigation}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Address"
        component={Address}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductRating"
        component={ProductRating}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CheckoutOverview"
        component={CheckoutOverview}
        options={{
          headerShown: false,
        }}
      />
       <Stack.Screen name="RequestCallBack" component={RequestCallBack} />
      <Stack.Screen name="EmailSupport" component={EmailSupport} />
      
      <Stack.Screen
        name="MyPosts"
        component={MyPosts}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen name="ChatSupport" component={ChatSupport} />

      <Stack.Screen name="ReturnProduct" component={ReturnProduct} />

      <Stack.Screen name="OrderItemsList" component={OrderItemsList} />

      <Stack.Screen name="CreatePost" component={CreatePost} />

      <Stack.Screen name="BrainBoxRegistration" component={BrainBoxRegistration} />

      <Stack.Screen
        name="HubDetail"
        component={HubDetail}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="HubTabNavigation"
        component={HubTabNavigation}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
};

export default StackNavigation;
