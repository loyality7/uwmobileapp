import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal'; // Add this import

const ReturnProduct = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [returnReason, setReturnReason] = useState('');
  const [comments, setComments] = useState('');
  const [fixOption, setFixOption] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const renderStep1 = () => (
    <View style={styles.returnReasonMainContainer}>

      <View style={styles.returnReasonContainer}>
        <Text style={styles.question}>Why do you want to return this?</Text>
   
      <RadioButton.Group onValueChange={value => setReturnReason(value)} value={returnReason}>
        {[
          'Purchased by mistake',
          'Product damaged, package is fine',
          'Product and package are damaged',
          'Missing parts or accessories',
          'Too late in delivery',
          'Received defective product',
          'Received wrong product',
          'Quality is not up to the mark'
        ].map((option) => (
          <View key={option} style={styles.radioItem}>
            <RadioButton value={option} />
            <Text style={styles.radioItemText}>{option}</Text>
          </View>
        ))}
      </RadioButton.Group>
      </View>
      <View style={styles.returnBeforeContainer}>
        <View style={styles.returnBeforeRow}>
          <Text style={styles.returnBeforeLabel}>Return before</Text>
          <Text style={styles.returnBeforeDate}>27-Sep-2024</Text>
        </View>
        <Text style={styles.daysLeftText}>You have 7 days left to return this item</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <View style={styles.step2Container}>
        <Text style={styles.question}>Why do you want to return this?</Text>
        <View style={styles.reasonRow}>
          <Text style={styles.selectedReason}>{returnReason}</Text>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.editText}>edit</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.commentInput}
          placeholder="Add your comments here if any"
          placeholderTextColor="#999"
          value={comments}
          onChangeText={setComments}
          multiline
        />
      </View>

      <View style={styles.returnBeforeContainer}>
        <View style={styles.returnBeforeRow}>
          <Text style={styles.returnBeforeLabel}>Return before</Text>
          <Text style={styles.returnBeforeDate}>27-Sep-2024</Text>
        </View>
        <Text style={styles.daysLeftText}>You have 7 days left to return this item</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.step3Container}>
      <Text style={styles.question}>How can we fix your problem?</Text>
      
      <View style={styles.optionsContainer}>
        <RadioButton.Group onValueChange={value => setFixOption(value)} value={fixOption}>
          <View style={styles.radioItem}>
            <RadioButton value="Replace my product" />
            <Text style={styles.radioItemText}>Replace my product</Text>
          </View>

          <View style={styles.radioItemWithDesc}>
            <View style={styles.radioRow}>
              <RadioButton value="Credit to 'UrbanWallah e-Wallet'" />
              <Text style={styles.radioItemText}>Credit to 'UrbanWallah e-Wallet'</Text>
            </View>
            <Text style={styles.descriptionText}>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM11.7 6L7.3 10.4C7.1 10.6 6.8 10.7 6.6 10.7C6.3 10.7 6.1 10.6 5.9 10.4L4.3 8.8C3.9 8.4 3.9 7.8 4.3 7.4C4.7 7 5.3 7 5.7 7.4L6.6 8.3L10.3 4.6C10.7 4.2 11.3 4.2 11.7 4.6C12.1 5 12.1 5.6 11.7 6Z" fill="#2DBDEE"/>
              </Svg>
              {' '}Instant refund, many benefits
            </Text>
          </View>

          <View style={styles.radioItemWithDesc}>
            <View style={styles.radioRow}>
              <RadioButton value="Refund to my bank account" />
              <Text style={styles.radioItemText}>Refund to my bank account</Text>
            </View>
            <Text style={styles.descriptionText}>
              <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <Path d="M14 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V2C16 0.9 15.1 0 14 0ZM12 9H4C3.4 9 3 8.6 3 8C3 7.4 3.4 7 4 7H12C12.6 7 13 7.4 13 8C13 8.6 12.6 9 12 9Z" fill="#2DBDEE"/>
              </Svg>
              {' '}Settled in 3-5 business days*
            </Text>
          </View>
        </RadioButton.Group>
      </View>

      <View style={styles.consentContainer}>
        <Text style={styles.consentText}>
          By clicking submit, I provide my consent to agree UrbanWallah's{' '}
          <Text style={styles.linkText} onPress={() => navigation.navigate('TermsAndConditions')}>product return and refund policy</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={() => setStep(4)}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.step4Container}>
      <Text style={styles.question}>How will you ship your item?</Text>
      
      <View style={styles.pickupContainer}>
        <View style={styles.pickupOptionRow}>
          <View style={styles.radioRow}>
            <RadioButton value="Request pickup" status="checked" />
            <Text style={styles.radioItemText}>Request pickup</Text>
          </View>
          <Text style={styles.priceText}>Rs 0</Text>
        </View>

        <Text style={styles.pickupDescription}>
          Keep your item tidy and ready. Our delivery partner will come to your door step for pickup
        </Text>

        <View style={styles.pickupDetailsSection}>
          <Text style={styles.sectionTitle}>Estimated pickup window</Text>
          <Text style={styles.pickupDate}>01-Oct-2024</Text>
          <Text style={styles.pickupTime}>07:00 - 09:00 PM</Text>
        </View>

        <View style={styles.addressSection}>
          <View style={styles.addressHeader}>
            <Text style={styles.sectionTitle}>Pickup address:</Text>
            <TouchableOpacity>
              <Text style={styles.changeLink} onPress={() => navigation.navigate('Address')}>change</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>No 54 AKS Nagar, Raakipalayam,</Text>
          <Text style={styles.addressText}>Coimbatore, 641031</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.confirmButton} 
        onPress={() => setShowSuccessModal(true)}
      >
        <Text style={styles.confirmButtonText}>Confirm Pickup</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccessModal = () => {
    let content = {
      icon: null,
      title: '',
      message: '',
      buttonText: ''
    };

    if (fixOption === 'Replace my product') {
      content = {
        icon: (
          <Svg width="150" height="150" viewBox="0 0 150 150" fill="none">
            <Path d="M75 0C33.6 0 0 33.6 0 75s33.6 75 75 75 75-33.6 75-75S116.4 0 75 0zm37.5 56.25L71.25 97.5c-1.875 1.875-4.375 2.812-6.562 2.812s-4.688-.937-6.563-2.812l-15.938-15.938c-3.75-3.75-3.75-9.374 0-13.124 3.75-3.75 9.376-3.75 13.126 0l9.374 9.374 34.688-34.687c3.75-3.75 9.375-3.75 13.125 0 3.75 3.75 3.75 9.375 0 13.125z" fill="#2DBDEE"/>
          </Svg>
        ),
        title: 'Your replace request is successful',
        message: 'We will let you know when we receive the product. From then, you will get your amount credited to your bank account in 3-5 business days',
        buttonText: 'Continue shopping'
      };
    } else if (fixOption === "Credit to 'UrbanWallah e-Wallet'") {
      content = {
        icon: (
          <Svg width="150" height="150" viewBox="0 0 150 150" fill="none">
            <Path d="M131.25 18.75H18.75C8.4375 18.75 0 27.1875 0 37.5v75c0 10.3125 8.4375 18.75 18.75 18.75h112.5c10.3125 0 18.75-8.4375 18.75-18.75v-75c0-10.3125-8.4375-18.75-18.75-18.75zM112.5 75H37.5c-5.625 0-9.375-3.75-9.375-9.375S31.875 56.25 37.5 56.25h75c5.625 0 9.375 3.75 9.375 9.375S118.125 75 112.5 75z" fill="#2DBDEE"/>
          </Svg>
        ),
        title: 'Your refund request is successful',
        message: 'We will let you know when we receive the product. From then, you will get your amount credited to your bank account in 3-5 business days',
        buttonText: 'Continue shopping'
      };
    } else {
      content = {
        icon: (
          <Svg width="150" height="150" viewBox="0 0 150 150" fill="none">
            <Path d="M75 0C33.6 0 0 33.6 0 75s33.6 75 75 75 75-33.6 75-75S116.4 0 75 0zm25 106.25H50c-5.625 0-9.375-3.75-9.375-9.375s3.75-9.375 9.375-9.375h50c5.625 0 9.375 3.75 9.375 9.375s-3.75 9.375-9.375 9.375zm0-31.25H50c-5.625 0-9.375-3.75-9.375-9.375S44.375 56.25 50 56.25h50c5.625 0 9.375 3.75 9.375 9.375s-3.75 9.375-9.375 9.375z" fill="#2DBDEE"/>
          </Svg>
        ),
        title: 'Your pickup request is successful',
        message: 'Keep your item tidy and ready. Our delivery partner will come to your door step for pickup. Please click here to read UrbanWallah\'s return best Practices. We have emailed a copy too to you.',
        buttonText: 'Done'
      };
    }

    return (

      <LinearGradient 
        colors={['#B2E2F4', '#E9F0F5']} 
        locations={[0, 0.5]}
        style={styles.gradientContainer}
      >
      <Modal 
        isVisible={showSuccessModal}
        style={styles.modal}
        backdropOpacity={0}
        animationIn="slideInRight"
        animationOut="slideOutRight"
      >
        <View style={styles.modalContent}>
          <View style={styles.successHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backButton}>
                <Svg width="23" height="19" viewBox="0 0 23 19" fill="none">
                  <Path d="M0.988281 9.53906C0.988281 9.24609 1.11719 8.97656 1.35156 8.75391L9.10938 1.00781C9.36719 0.75 9.61328 0.65625 9.89453 0.65625C10.4688 0.65625 10.9258 1.07812 10.9258 1.66406C10.9258 1.94531 10.8203 2.21484 10.6328 2.40234L8.00781 5.07422L4.07031 8.67188L6.89453 8.49609H21.7188C22.3281 8.49609 22.75 8.92969 22.75 9.53906C22.75 10.1484 22.3281 10.582 21.7188 10.582H6.89453L4.05859 10.4062L8.00781 14.0039L10.6328 16.6758C10.8203 16.8516 10.9258 17.1328 10.9258 17.4141C10.9258 18 10.4688 18.4219 9.89453 18.4219C9.61328 18.4219 9.36719 18.3164 9.13281 18.0938L1.35156 10.3242C1.11719 10.1016 0.988281 9.83203 0.988281 9.53906Z" fill="black"/>
                </Svg>
              </Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product return</Text>
          </View>

          <View style={styles.brandHeader}>
            <Image 
              source={require('../../assets/App_icon_1.png')} 
              style={styles.brandLogo} 
            />
            <View>
              <Text style={styles.brandName}>UrbanWallah Care</Text>
              <Text style={styles.brandTagline}>The trustable ecommerce platform</Text>
            </View>
          </View>

          <View style={styles.successImageContainer}>
            {content.icon}
            <Text style={styles.successTitle}>{content.title}</Text>
            <Text style={styles.successMessage}>{content.message}</Text>
          </View>

          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => {
              setShowSuccessModal(false);
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.doneButtonText}>{content.buttonText}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </LinearGradient>
    );
  };

  return (
    <LinearGradient 
      colors={['#B2E2F4', '#E9F0F5']} 
      locations={[0, 0.5]}
      style={styles.gradientContainer}
    >
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setStep(step - 1)}>
              <Text style={styles.backButton}>
                <Svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <Path d="M0.988281 9.53906C0.988281 9.24609 1.11719 8.97656 1.35156 8.75391L9.10938 1.00781C9.36719 0.75 9.61328 0.65625 9.89453 0.65625C10.4688 0.65625 10.9258 1.07812 10.9258 1.66406C10.9258 1.94531 10.8203 2.21484 10.6328 2.40234L8.00781 5.07422L4.07031 8.67188L6.89453 8.49609H21.7188C22.3281 8.49609 22.75 8.92969 22.75 9.53906C22.75 10.1484 22.3281 10.582 21.7188 10.582H6.89453L4.05859 10.4062L8.00781 14.0039L10.6328 16.6758C10.8203 16.8516 10.9258 17.1328 10.9258 17.4141C10.9258 18 10.4688 18.4219 9.89453 18.4219C9.61328 18.4219 9.36719 18.3164 9.13281 18.0938L1.35156 10.3242C1.11719 10.1016 0.988281 9.83203 0.988281 9.53906Z" fill="black"/>
                </Svg>
              </Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Product return</Text>
          </View>
          <View style={styles.productInfo}>
            <Image source={require('../../assets/logo.png')} style={styles.productImage} />
            <View>
              <Text style={styles.productName}>White T Shirt</Text>
              <Text style={styles.productDescription}>Lorem ipsum is simply</Text>
              <Text style={styles.productQuantity}>Qty: 1</Text>
            </View>
          </View>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </ScrollView>
      </View>
      {showSuccessModal && renderSuccessModal()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  productInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  returnReasonContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  returnBeforeContainer: {
    backgroundColor: '#F5F8FA',
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
  },
  button: {
    backgroundColor: '#2DBDEE',
    padding: 12,
    width: '40%',
    marginLeft: '30%',
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    marginRight: 10,
    color: 'black',
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
    lineHeight: 24,
    fontWeight: 'bold',
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  productName: {
    fontWeight: 'bold',
    color: 'black',
  },
  productDescription: {
    color: 'black',
  },
  productQuantity: {
    marginTop: 5,
    color: '#666666',
    backgroundColor: '#F5F5F5',
    padding: 6,
    width: '40%',
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    fontSize: 12,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingRight: 10,
  },
  radioItemText: {
    color: 'black',
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 8,
    fontFamily:'Gabarito',
    fontWeight: '400',
  },
  returnBeforeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  returnBeforeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  returnBeforeDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  daysLeftText: {
    color: '#666666',
    fontSize: 14,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedReason: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  editText: {
    color: '#2DBDEE',
    fontSize: 14,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    color: 'black',
  },
  pickupInfo: {
    marginTop: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
  },
  changeText: {
    color: '#00a0e0',
    marginTop: 5,
  },
  micButton: {
    padding: 10,
  },
  step2Container: {
    backgroundColor: '#F5F8FA',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
  },
  reasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedReason: {
    fontSize: 15,
    color: 'black',
  },
  commentInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
    color: 'black',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  step3Container: {
    flex: 1,
    width: '100%',
    // padding: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  radioItemWithDesc: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioItemText: {
    color: 'black',
    fontSize: 15,
    marginLeft: 8,
  },
  descriptionText: {
    color: '#666666',
    fontSize: 13,
    marginLeft: 35,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    width: '100%',
    height: '100%',
    marginRight: 4,
  },
  consentContainer: {
    marginVertical: 20,
  },
  consentText: {
    textAlign: 'center',
    display: 'flex',
    width: '70%',
    marginLeft: '15%',
    justifyContent: 'center',
    color: '#666666',
    fontSize: 13,
    lineHeight: 18,
  },
  linkText: {
    color: '#2DBDEE',
  },
  submitButton: {
    backgroundColor: '#2DBDEE',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  step4Container: {
    flex: 1,
    // padding: 20,
  },
  pickupContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  pickupOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioItemText: {
    fontSize: 15,
    color: 'black',
    marginLeft: 8,
  },
  priceText: {
    fontSize: 15,
    color: 'black',
  },
  pickupDescription: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 35,
    marginBottom: 20,
    lineHeight: 20,
  },
  pickupDetailsSection: {
    marginBottom: 20,
    marginHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 4,
  },
  pickupDate: {
    color: '#666666',
    fontSize: 14,
    marginBottom: 2,
  },
  pickupTime: {
    color: '#666666',
    fontSize: 14,
  },
  addressSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 15,
    marginHorizontal: 30,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  changeLink: {
    color: '#2DBDEE',
    fontSize: 14,
  },
  addressText: {
    color: '#666666',
    fontSize: 14,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: '#2DBDEE',
    padding: 12,
    borderRadius: 25,
    width: '40%',
    marginLeft: '30%',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F5F8FA',
    flex: 1,
    width: '100%',
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  brandHeader: {
    backgroundColor: 'white',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 90,
    padding: 15,
    marginTop: 1,
    borderRadius: 8,
  },
  brandLogo: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  brandTagline: {
    fontSize: 12,
    color: '#666666',
  },
  successImageContainer: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  successImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: '#2DBDEE',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReturnProduct;
