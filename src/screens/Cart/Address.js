import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ToastAndroid, TouchableOpacity, Modal, TextInput, Animated, Dimensions, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postMethod, getMethod } from '../../helpers';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';
const CustomCheckbox = ({ title, checked, onPress }) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
    <Icon
      name={checked ? 'check-box' : 'check-box-outline-blank'}
      size={24}
      color="#005FAC"
    />
    <Text style={styles.checkboxText}>{title}</Text>
  </TouchableOpacity>
);

const Address = ({ navigation, route }) => {
  const { cartData } = route.params;
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('billing'); // Changed to 'billing'
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnimation] = useState(new Animated.Value(Dimensions.get('window').height));
  const [newAddress, setNewAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
    isShipping: true,
    isBilling: true,
    isHome: false,
    isWork: false,
    isOther: false,
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      let url = "customers/secure/profile";
      let token = await AsyncStorage.getItem("@token");
      let response = await getMethod({ url, token });
      console.log("API Response:", JSON.stringify(response, null, 2));
      if (response.success) {
        const userAddresses = response.data.customer.addresses;
        const formattedAddresses = userAddresses.map(address => ({
          id: address._id,
          shippingAddressLine1: address.shipping_addressLine1 || 'N/A',
          shippingAddressLine2: address.shipping_addressLine2 || 'N/A',
          shippingDistrict: address.shipping_district || 'N/A',
          shippingState: address.shipping_state || 'N/A',
          shippingPincode: address.shipping_pincode || 'N/A',
          billingAddressLine1: address.billing_addressLine1 || 'N/A',
          billingAddressLine2: address.billing_addressLine2 || 'N/A',
          billingDistrict: address.billing_district || 'N/A',
          billingState: address.billing_state || 'N/A',
          billingPincode: address.billing_pincode || 'N/A',
          isDefault: address.isDefault,
          isShipping: !!address.shipping_addressLine1,
          isBilling: !!address.billing_addressLine1,
          formattedShipping: address.formatted_address_shipping || 'N/A',
          formattedBilling: address.formatted_address_billing || 'N/A',
          addressType: address.addressType || 'Other',
        }));
        console.log("Formatted Addresses:", JSON.stringify(formattedAddresses, null, 2));
        setAddresses(formattedAddresses);
      } else {
        console.error("Error fetching user info:", response.message);
        ToastAndroid.show(response.message || "Error fetching user info", ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error("Exception in fetchUserInfo:", e);
      ToastAndroid.show("Error fetching user info", ToastAndroid.SHORT);
    }
  };

  const renderAddressList = () => {
    const filteredAddresses = addresses.filter(address => 
      activeTab === 'billing' ? (address.isBilling || address.formattedBilling !== 'N/A') : 
                                (address.isShipping || address.formattedShipping !== 'N/A')
    );

    return (
      <ScrollView>
        {filteredAddresses.length > 0 ? (
          filteredAddresses.map(address => (
            <TouchableOpacity 
              key={address.id}
              style={[styles.addressItem, selectedAddress === address.id && styles.selectedAddress]}
              onPress={() => setSelectedAddress(address.id)}
            >
              <View style={styles.addressHeader}>
                <Text style={[
                  styles.addressType,
                  address.addressType.toLowerCase() === 'home' 
                    ? styles.homeAddressType 
                    : styles.otherAddressType
                ]}>
                  {address.addressType}
                </Text>
                {address.isDefault && (
                  <View style={styles.defaultTag}>
                    <Text style={styles.defaultTagText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>
                {activeTab === 'billing' 
                  ? (address.formattedBilling !== 'N/A'
                      ? address.formattedBilling
                      : `${address.billingAddressLine1}, ${address.billingAddressLine2}, ${address.billingDistrict}, ${address.billingState} - ${address.billingPincode}`)
                  : (address.formattedShipping !== 'N/A' 
                      ? address.formattedShipping 
                      : `${address.shippingAddressLine1}, ${address.shippingAddressLine2}, ${address.shippingDistrict}, ${address.shippingState} - ${address.shippingPincode}`)}
              </Text>
              <TouchableOpacity style={styles.editButton}>
                <Icon name='edit' size={20} color='#005FAC' />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noAddressText}>No {activeTab} addresses found</Text>
        )}
      </ScrollView>
    );
  };

  const handleAddNewAddress = async () => {
    try {
      let url = "customers/secure/cart/addAddress";
      let token = await AsyncStorage.getItem("@token");
      
      // Determine the address type
      let addressType = "Other";
      if (newAddress.isHome) addressType = "Home";
      else if (newAddress.isWork) addressType = "Work";

      const payload = {
        shipping_addressLine1: newAddress.addressLine1,
        shipping_addressLine2: newAddress.addressLine2,
        shipping_state: newAddress.state,
        shipping_district: newAddress.district,
        shipping_pincode: newAddress.pincode,
        billing_addressLine1: newAddress.isBilling ? newAddress.addressLine1 : "",
        billing_addressLine2: newAddress.isBilling ? newAddress.addressLine2 : "",
        billing_state: newAddress.isBilling ? newAddress.state : "",
        billing_district: newAddress.isBilling ? newAddress.district : "",
        billing_pincode: newAddress.isBilling ? newAddress.pincode : "",
        addressType: addressType,
      };

      let response = await postMethod({ url, token, payload });
      console.log("Add Address Response:", JSON.stringify(response, null, 2));
      if (response.success) {
        ToastAndroid.show("Address added successfully", ToastAndroid.SHORT);
        setModalVisible(false);
        await fetchUserInfo();  
      } else {
        console.error("Error adding new address:", response.message);
        ToastAndroid.show(response.message || "Error adding new address", ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error("Exception in handleAddNewAddress:", e);
      ToastAndroid.show("Error adding new address", ToastAndroid.SHORT);
    }
  };

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'billing' && styles.activeTab]}
        onPress={() => setActiveTab('billing')}
      >
        <Text style={[styles.tabText, activeTab === 'billing' && styles.activeTabText]}>Billing Address</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'shipping' && styles.activeTab]}
        onPress={() => setActiveTab('shipping')}
      >
        <Text style={[styles.tabText, activeTab === 'shipping' && styles.activeTabText]}>Shipping Address</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProgressBar = () => (
    <View style={[styles.progressContainer, { marginTop: 10 }]}>
      <View style={styles.progressItem}>
        <View style={[styles.progressDot, styles.completedDot]} />
        <Text style={[styles.progressText, styles.completedText]}>Cart</Text>
      </View>
      <View style={[styles.progressLine, styles.completedLine]} />
      <View style={styles.progressItem}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <Text style={[styles.progressText, styles.activeText]}>Address</Text>
      </View>
      <View style={styles.progressLine} />
      <View style={styles.progressItem}>
        <View style={styles.progressDot} />
        <Text style={styles.progressText}>Payment</Text>
      </View>
    </View>
  );
  const renderFooter = () => (
    <View style={styles.footer}>
      <View style={styles.footerContent}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>₹{cartData.totalAmount.toFixed(2)}</Text>
          <Text style={styles.taxesText}>Inclusive of all taxes</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.continueButton, 
            !selectedAddress && styles.disabledButton,
            { marginLeft: 10 }
          ]}
          onPress={() => {
            if (selectedAddress) {
              const selectedAddressData = addresses.find(a => a.id === selectedAddress);
              navigation.navigate('CheckoutOverview', { cartData, addressData: selectedAddressData });
            } else {
              ToastAndroid.show("Please select an address", ToastAndroid.SHORT);
            }
          }}
          disabled={!selectedAddress}
        >
          <Text style={styles.continueButtonText}>Continue to buy ({cartData.orderItems.length} items)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const showModal = () => {
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(modalAnimation, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <LinearGradient colors={['#B2E3F4', '#FFFFFF']} style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name='arrow-back' size={24} color='#000000' />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart Summary</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          {renderProgressBar()}
          {renderTabs()}
          <View style={styles.addressListContainer}>
            <TouchableOpacity style={styles.addNewButton} onPress={showModal}>
              <View style={styles.addNewButtonIcon}>
                <View>
                  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M5.36552e-05 10.9937C0.0188355 4.90839 4.96473 -0.0187284 11.0375 5.35187e-05C17.0853 0.0188354 22.0375 4.98978 22.0062 11.0125C21.9749 17.1479 17.0227 22.0375 10.8748 21.9999C4.89587 21.9749 -0.0187282 16.9977 5.36552e-05 10.9937ZM12.0017 10.0108C12.0017 9.87933 12.0017 9.78542 12.0017 9.69151C12.0017 8.48321 12.0017 7.26864 12.0017 6.06034C12.0017 5.57201 11.7513 5.20264 11.3381 5.05864C10.6807 4.83326 10.0171 5.30281 10.0171 6.01652C10.0108 7.24986 10.0171 8.48321 10.0171 9.71655C10.0171 9.8042 10.0171 9.89811 10.0171 10.0045C9.88559 10.0045 9.79168 10.0045 9.69777 10.0045C8.48947 10.0045 7.27491 10.0045 6.0666 10.0045C5.56575 10.0045 5.19638 10.2612 5.05864 10.6932C4.85204 11.3443 5.31533 11.9892 6.02278 11.9954C7.25612 12.0017 8.48947 11.9954 9.72281 11.9954C9.81046 11.9954 9.90437 11.9954 10.0108 11.9954C10.0108 12.1269 10.0108 12.2208 10.0108 12.3147C10.0108 13.523 10.0108 14.7376 10.0108 15.9459C10.0108 16.4467 10.2675 16.8161 10.6995 16.9538C11.3506 17.1667 11.9954 16.6972 12.0017 15.9897C12.0079 14.7564 12.0017 13.523 12.0079 12.2897C12.0079 12.202 12.0079 12.1081 12.0079 12.0017C12.1394 12.0017 12.2333 12.0017 12.3272 12.0017C13.5355 12.0017 14.7501 12.0017 15.9584 12.0017C16.4467 12.0017 16.8161 11.7513 16.9601 11.3381C17.1855 10.6807 16.7159 10.0171 16.0022 10.0171C14.7751 10.0108 13.5481 10.0171 12.321 10.0171C12.2208 10.0108 12.1269 10.0108 12.0017 10.0108Z" fill="#2DBDEE"/>
                  </Svg>
                </View>
                <View>
                  <Text style={styles.addNewButtonText}>Add New Address</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.addressListContainer}>
              {renderAddressList()}
            </View>
          </View>
        </ScrollView>
        
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={hideModal}
          animationType="none"
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPressOut={hideModal}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: modalAnimation }],
                },
              ]}
            >
              <TouchableOpacity style={styles.modalHandle} />
              <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Address</Text>
                <TouchableOpacity onPress={hideModal}>
                  <Icon name='close' size={20} color='#005FAC' backgroundColor='#F4F4F4' borderRadius={25} padding={5} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Address Line 1"
                value={newAddress.addressLine1}
                onChangeText={(text) => setNewAddress({...newAddress, addressLine1: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Address Line 2"
                value={newAddress.addressLine2}
                onChangeText={(text) => setNewAddress({...newAddress, addressLine2: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="District"
                value={newAddress.district}
                onChangeText={(text) => setNewAddress({...newAddress, district: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={newAddress.state}
                onChangeText={(text) => setNewAddress({...newAddress, state: text})}
              />
              <TextInput
                style={[styles.input, {marginBottom: 20}]}
                placeholder="Pincode"
                value={newAddress.pincode}
                onChangeText={(text) => setNewAddress({...newAddress, pincode: text})}
                keyboardType="numeric"
                maxLength={6}

              />
              <View style={styles.checkboxesContainer}>
                <CustomCheckbox
                  title="Home"
                  checked={newAddress.isHome}
                  onPress={() => setNewAddress({...newAddress, isHome: !newAddress.isHome, isWork: false, isOther: false})}
                />
                <CustomCheckbox
                  title="Work"
                  checked={newAddress.isWork}
                  onPress={() => setNewAddress({...newAddress, isWork: !newAddress.isWork, isHome: false, isOther: false})}
                />
                <CustomCheckbox
                  title="Other"
                  checked={newAddress.isOther}
                  onPress={() => setNewAddress({...newAddress, isOther: !newAddress.isOther, isHome: false, isWork: false})}
                />
              </View>
              <View style={styles.checkboxesContainer}>
                <CustomCheckbox
                  title="Shipping Address"
                  checked={newAddress.isShipping}
                  onPress={() => setNewAddress({...newAddress, isShipping: !newAddress.isShipping})}
                />
                <CustomCheckbox
                  title="Billing Address"
                  checked={newAddress.isBilling}
                  onPress={() => setNewAddress({...newAddress, isBilling: !newAddress.isBilling})}
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAddNewAddress}>
                <Text style={styles.addButtonText}>Save Address</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.cancelButton} onPress={hideModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity> */}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
        {renderFooter()}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    
    flex: 1,
    marginBottom: 0,
  },
  addressListContainer:{
    width: '96%',
    marginLeft: '2%',
  },
  contentContainer: {
    flex: 1,
    // width: '100%',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  addressesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  addressItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },
  selectedAddress: {
    borderColor: '#005FAC',
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressType: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  homeAddressType: {
    backgroundColor: '#E6F3FF',  // Light sky blue
    color: '#0066CC',  // Blue
  },
  otherAddressType: {
    backgroundColor: '#FFF0E6',  // Light orange
    color: '#FF8C00',  // Dark orange
  },
  defaultTag: {
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    marginLeft: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  defaultTagText: {
    fontSize: 12,
    color: '#005FAC',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#909090',
  },
  editButton: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  addNewButton: {     
    alignItems: 'center',
    display: 'flex',
    left: '25%',
    position: 'relative',
    marginBottom: 10,
  },
  addNewButtonText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Gabarito',
    fontWeight: '900',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 20,
    color: '#101313',
    lineHeight: 24,
    fontWeight: 'bold',
    // marginBottom: 20,
  },
  modalHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   marginBottom: 15,
  },
  input: {
    // borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    marginHorizontal: 5,
  },
  checkboxesContainer: {
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
   
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2DBDEE',
    padding: 15,
    borderRadius: 25,
    width: '80%',
    marginLeft: '10%',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 15,
    backgroundColor: 'transparent',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 24,
    color: '#000000',
    marginLeft: 5,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 20,
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  progressDot: {
    width: 14 ,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: '#FFFFFF',
    marginBottom: 4,
  },
  completedDot: {
    borderColor: '#2DBDEE',
    backgroundColor: '#2DBDEE',
  },
  // activeDot: {
  //   borderColor: '#2DBDEE',
  //   backgroundColor: '#2DBDEE',
  // },
  progressText: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    lineHeight: 16,
    color: '#999999',
  },
  completedText: {
    color: '#2DBDEE',
  },
  activeText: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 16,
  },
  progressLine: {
    width: 20,
    height: 1,
    backgroundColor: '#999999',
    marginHorizontal: 6,
  },
  completedLine: {
    backgroundColor: '#4CAF50',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    padding:10,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  activeTab: {
    borderBottomColor: '#005FAC',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#909090',
  },
  activeTabText: {
    color: '#005FAC',
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 0.4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000000',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '500',
    color: '#2DBDEE',
    lineHeight: 28,
  },
  taxesText: {
    fontSize: 8,
    color: '#999999',
    marginTop: 2,
    lineHeight: 10,
  },
  continueButton: {
    flex: 0.6,
    backgroundColor: '#2DBDEE',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  noAddressText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  addNewButtonIcon:{
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default Address;
