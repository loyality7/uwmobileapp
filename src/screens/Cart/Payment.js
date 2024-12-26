import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  TextInput,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';


const CustomHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.headerSearch}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search"
          placeholderTextColor="#999"
        />
        <TouchableOpacity>
          <Icon name="mic" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Payment = ({ navigation, route }) => {
  const { cartData, addressData } = route.params;
  const [paymentMethod, setPaymentMethod] = useState(cartData.paymentMethod || 'upi');

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    // Pass the selected payment method back to the Overview page
    navigation.navigate('CheckoutOverview', { cartData: { ...cartData, paymentMethod: value }, addressData });
  };

  const handlePayment = async () => {
    try {
      let url = "customers/secure/cart/placeorder";
      let token = await AsyncStorage.getItem("@token");
      let payload = {
        paymentMethod,
        addressData,
      };
      let response = await postMethod({ url, token, payload });
      if (response.success) {
        setShowConfirmation(true);
        setTimeout(() => {
          setShowConfirmation(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }, 4000);
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show("Error processing payment", ToastAndroid.SHORT);
    }
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <LinearGradient
    colors={['#2DBDEE', '#E9F0F5']}
    locations={[0, 0.4]}
    style={styles.container}
  >
    <ScrollView style={styles.container}>
      <CustomHeader />
      <View style={styles.contentContainer}>
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethodTitle}>Preferred payment method</Text>
          <RadioButton.Group onValueChange={handlePaymentMethodChange} value={paymentMethod}>
            <View style={styles.noBorder}>
              <RadioButton.Android value="upi" color="#6200EE" />
              <Text style={styles.radioButtonLabel}>QR based UPI payment</Text>
              <Image source={require('../../assets/payment/Scanner.png')} style={{width: 24, height: 24, marginLeft: 10}} />
            
            </View>
          </RadioButton.Group>
        </View>

        <Text style={styles.paymentMethodTitle}>More ways to pay</Text>
        <View style={styles.paymentMethodContainer}>
          <RadioButton.Group onValueChange={handlePaymentMethodChange} value={paymentMethod}>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Android value="cod" />
              <Text style={styles.radioButtonLabel}>Cash on Delivery</Text>
              <Image source={require('../../assets/payment/cod.png')}  />
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Android value="netbanking" />
              <Text style={styles.radioButtonLabel}>Net Banking</Text>
              <Image source={require('../../assets/payment/net-banking.png')} />
            </View>
            <View style={styles.radioButtonContainer}>
              <RadioButton.Android value="card" />
              <Text style={styles.radioButtonLabel}>Credit or Debit cards</Text>
              <Image source={require('../../assets/payment/cards.png')} />
            </View>
            <View style={styles.noBorder}>
              <RadioButton.Android value="emi" />
              <Text style={styles.radioButtonLabel}>EMI</Text>
              <Image source={require('../../assets/payment/emi.png')} />
            </View>
          </RadioButton.Group>
        </View>

        <View style={styles.secureTransactionContainer}>
         
          <Image source={require('../../assets/payment/lock-icon.png')} />
          <Text style={styles.secureTransactionText}>All transactions are Secure by default</Text>
        </View>

        <Modal
          transparent={true}
          visible={showConfirmation}
          animationType="fade"
        >
          {/* <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Icon name="check-circle" size={50} color="#4CAF50" />
              <Text style={styles.modalText}>Order Confirmed!</Text>
            </View>
          </View> */}
        </Modal>
      </View>
    </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
     
  },
  contentContainer: {
    padding: 16,
  },
  paymentMethodContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    elevation: 2,  
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  noBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
   
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 0,
  },
  radioButtonLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    lineHeight:20,
    fontWeight:'500',
    color: '#000000',
    fontFamily:'Gabarito',
  },
  icon: {
    color: '#888',
  },
  secureTransactionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: 'transparent',
  },
  secureTransactionText: {
    marginLeft: 4,
    fontSize: 16,
    lineHeight:20,
    fontWeight:'500',
    color: '#000000',
    fontFamily:'Gabarito',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
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
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});

export default Payment;