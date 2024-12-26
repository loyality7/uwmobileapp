import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AffiliateTabNavigation from '../../navigation/AffiliateTabNavigation';
import Icon from 'react-native-vector-icons/Feather';

const SaleCard = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  const handleGoBack = () => {
    navigation.goBack(); // Change this to go back to the previous screen
  };

  const handleTypeCode = () => {
    setIsModalVisible(true);
  };

  const handleActivate = () => {
    // Implement activation logic here
    console.log('Activating with code:', activationCode);
    setIsModalVisible(false);
    setActivationCode('');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFC5B1', '#E9F0F5']}
        locations={[0, 0.15]}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sale card</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.balanceContainer}>
            <View style={styles.floatingCashContainer}>
              <View>
                <Text style={styles.floatingCashLabel}>Floating cash:</Text>
                <Text style={styles.floatingCashAmount}>₹ 1,500</Text>
              </View>
              <TouchableOpacity style={styles.settleButton}>
                <Image source={require('../../assets/settle-icon.png')} style={styles.settleButtonIcon} />
                <Text style={styles.settleButtonText}>Settle</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.remainingBalanceContainer}>
              <Text style={styles.remainingBalanceLabel}>Remaining balance :</Text>
              <Text style={styles.remainingBalanceAmount}>₹ 300</Text>
            </View>
          </View>
          
          <Text style={styles.sectionTitle}>Payment collection</Text>
          <View style={styles.paymentOptionsContainer}>
            <TouchableOpacity style={styles.paymentOption}>
              <View style={styles.radioButton} />
              <Text style={styles.paymentOptionText}>UPI payment - QR</Text>
              <Image source={require('../../assets/upi_payment.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentOption}>
              <View style={styles.radioButton} />
              <Text style={styles.paymentOptionText}>Cash on hand</Text>
              <Image source={require('../../assets/coh.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Activate card</Text>
          
          <View style={styles.activateCardContainer}>
            <TouchableOpacity style={styles.activateCardButton}>
              <Image source={require('../../assets/barcode.png')} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Scan barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.activateCardButton} onPress={handleTypeCode}>
              <Image source={require('../../assets/typecode.png')} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Type code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
      
      {/* Activation Code Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Activation Code</Text>
            <TextInput
              style={styles.input}
              value={activationCode}
              onChangeText={setActivationCode}
              placeholder="Enter code"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.activateButton} onPress={handleActivate}>
              <Text style={styles.activateButtonText}>Activate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add the AffiliateTabNavigation here */}
      <View style={styles.tabNavigationContainer}>
        <AffiliateTabNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 48,
    fontFamily: 'Gabarito',
    color: 'black',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  balanceContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  floatingCashContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  floatingCashLabel: {
    fontSize: 14,
    color: 'black',
  },
  floatingCashAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  remainingBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingBalanceLabel: {
    fontSize: 14,
    color: 'gray',
  },
  remainingBalanceAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  settleButton: {
    alignItems: 'center',
  },
  settleButtonIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  settleButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  paymentOptionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 16,
    gap: 20,
    marginBottom: 10,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    marginRight: 10,
  },
  paymentOptionText: {
    flex: 1,
    color: 'black',
  },
  icon: {
    width: 24,
    height: 24,
  },
  activateCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activateCardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5B7A2',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 5,
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  tabNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    width: '100%',
    marginBottom: 15,
    color: 'black',
  },
  activateButton: {
    backgroundColor: '#F5B7A2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  activateButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default SaleCard;