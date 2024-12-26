import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  ToastAndroid,
  Modal,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { postMethod, deleteMethod, getMethod } from '../../helpers';
import { useAuth } from '../../screens/AuthModule/AuthContext';
import { useNavigation } from '@react-navigation/native';
import closeIcon from '../../assets/close.png';
import Svg, { Path } from 'react-native-svg';
import StatusBarManager from '../../components/StatusBarManager';
const { width } = Dimensions.get('window');

// Add this color mapping object at the top of the file
const COLOR_MAP = {
  // Basic colors
  'Black': '#000000',
  'White': '#FFFFFF',
  'Red': '#FF0000',
  'Green': '#008000',
  'Blue': '#0000FF',
  'Yellow': '#FFFF00',
  'Purple': '#800080',
  'Orange': '#FFA500',
  'Pink': '#FFC0CB',
  'Brown': '#A52A2A',
  'Grey': '#808080',
  'Gray': '#808080',
  
  // Common variations
  'Lightblue': '#ADD8E6',
  'Darkblue': '#00008B',
  'Lightgreen': '#90EE90',
  'Darkgreen': '#006400',
  'Navy': '#000080',
  'Maroon': '#800000',
  'Violet': '#EE82EE',
  'Indigo': '#4B0082',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Cyan': '#00FFFF',
  'Magenta': '#FF00FF',
  'Teal': '#008080',
  'Olive': '#808000',
  
  // Man versions with both initial capital letters
  'BlackMan': '#000000',
  'WhiteMan': '#FFFFFF',
  'RedMan': '#FF0000',
  'GreenMan': '#008000',
  'BlueMan': '#0000FF',
  'YellowMan': '#FFFF00',
  'PurpleMan': '#800080',
  'OrangeMan': '#FFA500',
  'PinkMan': '#FFC0CB',
  'BrownMan': '#A52A2A',
  'GreyMan': '#808080',
  'GrayMan': '#808080',
  
  'LightblueMan': '#ADD8E6',
  'DarkblueMan': '#00008B',
  'LightgreenMan': '#90EE90',
  'DarkgreenMan': '#006400',
  'NavyMan': '#000080',
  'MaroonMan': '#800000',
  'VioletMan': '#EE82EE',
  'IndigoMan': '#4B0082',
  'GoldMan': '#FFD700',
  'SilverMan': '#C0C0C0',
  'CyanMan': '#00FFFF',
  'MagentaMan': '#FF00FF',
  'TealMan': '#008080',
  'OliveMan': '#808000',
};

// Add this helper function to get the color value
const getColorValue = (colorName) => {
  // Convert to lowercase and remove spaces
  const normalizedColor = colorName.toLowerCase().replace(/\s+/g, '');
  
  // Check if it's a valid CSS color (hex, rgb, rgba, hsl)
  const isValidColor = /^(#|rgb|rgba|hsl)/.test(normalizedColor);
  if (isValidColor) return normalizedColor;
  
  // Return mapped color or default to gray if not found
  return COLOR_MAP[normalizedColor] || '#808080';
};

const CustomHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={24} color="#888" />
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

// Add this SVG component near the top of the file with other imports
const ContactIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M14.6667 11.28V13.28C14.6675 13.4657 14.6294 13.6495 14.5549 13.8196C14.4804 13.9897 14.3712 14.1424 14.2342 14.2679C14.0972 14.3934 13.9355 14.489 13.7592 14.5485C13.5829 14.608 13.3959 14.6301 13.21 14.6133C11.0932 14.3904 9.06528 13.6894 7.26667 12.5667C5.58654 11.5431 4.15973 10.1163 3.13667 8.43667C2.01 6.63018 1.30903 4.59405 1.09 2.47C1.07325 2.28457 1.09514 2.09803 1.15418 1.92206C1.21321 1.74609 1.30817 1.58467 1.43289 1.44773C1.55762 1.31079 1.70952 1.20149 1.87882 1.12668C2.04812 1.05187 2.23115 1.01322 2.41667 1.01334H4.41667C4.74221 1.01003 5.05793 1.13238 5.30177 1.35878C5.54561 1.58518 5.70245 1.89879 5.74333 2.24C5.82133 2.93824 5.97402 3.62392 6.2 4.28667C6.29422 4.5391 6.30954 4.81384 6.24355 5.07538C6.17757 5.33691 6.03385 5.57331 5.83 5.75667L4.96333 6.62334C5.91322 8.35237 7.31431 9.75346 9.04333 10.7033L9.91 9.83667C10.0934 9.63282 10.3298 9.4891 10.5913 9.42312C10.8528 9.35713 11.1276 9.37245 11.38 9.46667C12.0428 9.69265 12.7284 9.84534 13.4267 9.92334C13.7722 9.96456 14.0892 10.1244 14.3164 10.3727C14.5436 10.621 14.6645 10.9421 14.6667 11.2733V11.28Z"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const HubDetail = ({ route }) => {
  const { product = {} } = route.params || {};
  
  const {
    title = '',
    desc = '',
    price = 0,
    discountPrice = 0,
    image = [],
    specifications = [],
    customer = {},
    createdBy = {},
    contact = {},
    _id = '',
    location = {
      address: {
        areaName: '',
        city: '',
        state: '',
        formatted_address: ''
      }
    },
    category = {
      name: ''
    },
    subcategory = {
      name: ''
    }, 
    subsubcategory = {
      name: ''
    }
  } = product;

  const [selectedAttribute, setSelectedAttribute] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const { isLoggedIn, user, checkUserSession } = useAuth();
  const navigation = useNavigation();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [isHubMember, setIsHubMember] = useState(false);

  const trimmedProductName = title.length > 20
    ? title.substring(0, 20) + '...' 
    : title;

  const renderAttributeOption = (attribute, value) => (
    <TouchableOpacity 
      style={[
        styles.attributeOption, 
        selectedAttribute[attribute] === value.Label && styles.selectedAttributeOption
      ]} 
      key={value.Label}
      onPress={() => setSelectedAttribute({...selectedAttribute, [attribute]: value.Label})}
    >
      <Text style={[
        styles.attributeOptionText,
        selectedAttribute[attribute] === value.Label && styles.selectedAttributeOptionText
      ]}>{value.Label}</Text>
    </TouchableOpacity>
  );
  const renderAttributeSection = (attributeName, attributeValues) => {
    if (attributeName === 'Colors') {
      return (
        <View style={styles.attributeSection} key={attributeName}>
          <Text style={styles.attributeTitle}>{attributeName}</Text>
          <View style={styles.attributeOptions}>
            {attributeValues.map((value) => {
              const colorValue = getColorValue(value.Label);
              const isSelected = selectedAttribute[attributeName] === value.Label;
              return (
                <TouchableOpacity 
                  style={[
                    styles.attributeOption, 
                    { 
                      backgroundColor: colorValue,
                      borderColor: isSelected ? '#000000' : colorValue,
                      borderWidth: isSelected ? 2 : 1
                    }
                  ]} 
                  key={value.Label}
                  onPress={() => setSelectedAttribute({ ...selectedAttribute, [attributeName]: value.Label })}
                />
              );
            })}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.attributeSection} key={attributeName}>
        <Text style={styles.attributeTitle}>{attributeName}</Text>
        <View style={styles.attributeOptions}>
          {attributeValues.map((value) => {
            const isSelected = selectedAttribute[attributeName] === value.Label;
            return (
              <TouchableOpacity 
                style={[
                  styles.attributeOption, 
                  { borderWidth: isSelected ? 2 : 1 }
                ]} 
                key={value.Label}
                onPress={() => setSelectedAttribute({ ...selectedAttribute, [attributeName]: value.Label })}
              >
                <Text style={styles.attributeOptionText}>
                  {value.Label.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  const renderRAMOption = (ram) => (
    <TouchableOpacity 
      style={[
        styles.attributeOption, 
        selectedRAM === ram && styles.selectedAttributeOption
      ]} 
      key={ram}
      onPress={() => setSelectedRAM(ram)}
    >
      <Text style={[
        styles.attributeOptionText,
        selectedRAM === ram && styles.selectedAttributeOptionText
      ]}>{ram}</Text>
    </TouchableOpacity>
  );

  const renderStorageOption = (storage) => (
    <TouchableOpacity 
      style={[
        styles.attributeOption, 
        selectedStorage === storage && styles.selectedAttributeOption
      ]} 
      key={storage}
      onPress={() => setSelectedStorage(storage)}
    >
      <Text style={[
        styles.attributeOptionText,
        selectedStorage === storage && styles.selectedAttributeOptionText
      ]}>{storage}</Text>
    </TouchableOpacity>
  );

  // Extract colors from the product attributes
  const colors = product.attributes && product.attributes[0] && product.attributes[0].Colors
    ? product.attributes[0].Colors.split(',').map(color => color.trim())
    : [];

  const renderColorOption = (color) => (
    <TouchableOpacity 
      style={[styles.colorOption, { backgroundColor: color.toLowerCase() }]} 
      key={color}
    />
  );

  const renderSizeOption = (size) => (
    <TouchableOpacity 
      style={[
        styles.attributeOption, 
        selectedSize === size && styles.selectedAttributeOption
      ]} 
      key={size}
      onPress={() => setSelectedSize(size)}
    >
      <Text style={[
        styles.attributeOptionText,
        selectedSize === size && styles.selectedAttributeOptionText
      ]}>{size}</Text>
    </TouchableOpacity>
  );

  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Update checkHubMembership function
  const checkHubMembership = async () => {
    try {
      // First check if user exists and is a hub member
      if (!user || !user.isHub) {
        setIsHubMember(false);
        return false;
      }

      // Check if user has hubUser object with the correct hub type
      if (user.hubUser && Object.keys(user.hubUser).includes(product.hubType)) {
        setIsHubMember(true);
        return true;
      }

      // If above checks fail, make API call as backup verification
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        setIsHubMember(false);
        return false;
      }

      const response = await getMethod({
        url: `customers/secure/hub?hubType=${product.hubType}`,
        token
      });

      console.log('Hub membership response:', response);
      
      if (response.success) {
        const isUserMember = response.data.length > 0;
        setIsHubMember(isUserMember);
        return isUserMember;
      }

      setIsHubMember(false);
      return false;
    } catch (error) {
      console.error('Error checking hub membership:', error);
      setIsHubMember(false);
      return false;
    }
  };

  // Update canViewContact function to be simpler
  const canViewContact = () => {
    return user && user.isHub && isHubMember;
  };

  // Update useEffect to check membership when component mounts
  useEffect(() => {
    checkWishlistStatus();
    if (user && product.hubType) {
      checkHubMembership();
    }
  }, [user, product.hubType]);

  useEffect(() => {
    console.log('ProductDetails - isLoggedIn:', isLoggedIn);
    console.log('ProductDetails - user:', user);
  }, [isLoggedIn, user]);

  const checkWishlistStatus = async () => {
    try {
      let url = 'customers/secure/wishlist';
      let token = await AsyncStorage.getItem('@token');
      let response = await getMethod({ url, token });
      if (response.success) {
        const isProductInWishlist = response.data.some(item => item._id === _id);
        setIsInWishlist(isProductInWishlist);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this product: ${title} - ${desc}`,
        url: image[0],
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleWishlist = async () => {
    console.log('handleWishlist - isLoggedIn:', isLoggedIn);
    console.log('handleWishlist - user:', user);

    if (!isLoggedIn || !user) {
      ToastAndroid.show('Please login to continue', ToastAndroid.SHORT);
      navigation.navigate('Login');
      return;
    }

    try {
      let url = `customers/secure/wishlist/${_id}`;
      let token = await AsyncStorage.getItem('@token');
      
      if (!token) {
        ToastAndroid.show('Authentication token not found. Please login again.', ToastAndroid.SHORT);
        navigation.navigate('Login');
        return;
      }

      let response;

      if (isInWishlist) {
        response = await deleteMethod({ url, token });
      } else {
        response = await postMethod({ url, token, payload: {} });
      }

      if (response.success) {
        setIsInWishlist(!isInWishlist);
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error('Error in handleWishlist:', e);
      ToastAndroid.show('An error occurred', ToastAndroid.SHORT);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      
      if (!token) {
        console.log('No token found in storage');
        ToastAndroid.show('Please login to continue', ToastAndroid.SHORT);
        navigation.navigate('Login');
        return;
      }

      // Verify user session is valid
      await checkUserSession();

      if (!isLoggedIn || !user) {
        console.log('User session invalid after check');
        ToastAndroid.show('Please login to continue', ToastAndroid.SHORT);
        navigation.navigate('Login');
        return;
      }

      const response = await postMethod({
        url: `customers/secure/cart/${_id}?quantity=1`,
        token,
        payload: {}
      });

      console.log('Add to cart response:', response);

      if (response.success) {
        ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
        navigation.navigate('Cart');
      } else {
        ToastAndroid.show(response.message || 'Failed to add product to cart', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error in handleAddToCart:', error);
      ToastAndroid.show('An error occurred', ToastAndroid.SHORT);
    }
  };

  // Check if overallRating is defined and a number
  const renderRatingStars = (rating) => {
    const validRating = rating || 0; // Default to 0 if undefined
    return [1, 2, 3, 4, 5].map((star) => (
      <Icon 
        key={star} 
        name={star <= Math.floor(validRating) ? "star" : "star-outline"} 
        size={16} 
        color="#FFD700" 
      />
    ));
  };

  const trimmedDescription = (description, maxLength = 190) => {
    if (description.length <= maxLength) return description;
      return description.substr(0, maxLength - 3) + '...';
    };
  
  const renderActionButtons = () => {
    return (
      <View style={styles.actionContainer}>
        <View style={styles.leftIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleWishlist}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path 
                stroke={isInWishlist ? "#FF0000" : "#000000"} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z"
                fill={isInWishlist ? "#FF0000" : "none"}
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path 
                stroke="#000000" 
                strokeLinecap="round" 
                strokeWidth="2" 
                d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
              />
            </Svg>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.buyNowButton} 
          onPress={handleAddToCart}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path 
              stroke="#000000" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
            />
          </Svg>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Add this helper function to determine text color based on background color
  const getContrastColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white depending on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const renderImageCarousel = () => {
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageCarousel}
      >
        {image.map((imageUrl, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedImageIndex(index)}>
            <Image source={{ uri: imageUrl }} style={styles.productImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderSpecifications = () => {
    return (
      <View style={styles.specificationContainer}>
        <Text style={styles.sectionTitle}>Specifications</Text>
        {specifications.map((spec, index) => (
          <View key={index} style={styles.specItem}>
            <Text style={styles.specTitle}>{spec.title}</Text>
            <Text style={styles.specDescription}>{spec.description}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderContactModal = () => {
    return (
      <Modal
        visible={showContact}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowContact(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Details</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowContact(false)}
              >
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.contactDetailsContainer}>
              <View style={styles.contactItem}>
                <MaterialIcon name="person" size={20} color="#666" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Name</Text>
                  <Text style={styles.contactValue}>{contact.name}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <MaterialIcon name="email" size={20} color="#666" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Email</Text>
                  <Text style={styles.contactValue}>{contact.email}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <MaterialIcon name="phone" size={20} color="#666" />
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactLabel}>Phone</Text>
                  <Text style={styles.contactValue}>{contact.phone}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderContactButton = () => {
    if (!user) {
      return (
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => navigation.navigate('Login')}
        >
          <MaterialIcon name="person" size={24} color="#FFF" />
          <Text style={styles.contactButtonText}>Login to View Contact</Text>
        </TouchableOpacity>
      );
    }

    if (!canViewContact()) {
      return (
        <View style={[styles.contactButton, styles.disabledButton]}>
          <MaterialIcon name="lock" size={24} color="#FFF" />
          <Text style={styles.contactButtonText}>
            Only verified {product.hubType} hub members can view contact
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.contactButton}
        onPress={() => setShowContact(true)}
      >
        <MaterialIcon name="phone" size={24} color="#FFF" />
        <Text style={styles.contactButtonText}>View Contact Details</Text>
      </TouchableOpacity>
    );
  };

  const renderInfoContainer = () => {
    return (
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Image source={require('../../assets/seller.png')} style={styles.icon} />
          <Text style={styles.infoText}>{createdBy.firstName} {createdBy.lastName}</Text>
        </View>
        <View style={styles.infoItem}>
          <ContactIcon />
          <Text style={styles.infoText}>Contact seller</Text>
        </View>
      </View>
    );
  };

  const renderLocationInfo = () => {
    return (
      <View style={styles.locationContainer}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.locationText}>{location.address.formatted_address}</Text>
        <View style={styles.locationDetails}>
          <Text style={styles.locationDetail}>Area: {location.address.areaName}</Text>
          <Text style={styles.locationDetail}>City: {location.address.city}</Text>
          <Text style={styles.locationDetail}>State: {location.address.state}</Text>
        </View>
      </View>
    );
  };

  const renderCategories = () => {
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryDetails}>
          <Text style={styles.categoryText}>{category.name}</Text>
          <Text style={styles.subCategoryText}>{subcategory.name}</Text>
          <Text style={styles.subSubCategoryText}>{subsubcategory.name}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBarManager />
      <CustomHeader />
      <ScrollView>
        <LinearGradient
          colors={['rgba(45, 189, 238, 0.2)', '#C1ECFA']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 0.83}}
          style={styles.gradientContainer}
        >
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{title}</Text>
            <Text style={styles.productDescription}>
              {trimmedDescription(desc)}
            </Text>
          </View>
        </LinearGradient>
        
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            {renderImageCarousel()}
          </View>
          {renderActionButtons()}

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹ {price.toFixed(2)}</Text>
            <Text style={styles.originalPrice}>₹ {discountPrice.toFixed(2)}</Text>
            <Text style={styles.discount}>
              {calculateDiscount(discountPrice, price)}% off
            </Text>
          </View>

          {renderInfoContainer()}

          {renderSpecifications()}
          
          {renderLocationInfo()}
          {renderCategories()}
          
          {/* ... rest of the existing UI components ... */}
        </View>
      </ScrollView>
      {renderContactButton()}
      {renderContactModal()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Description</Text>
            <ScrollView>
              <Text style={styles.modalText}>{product.description}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Image source={closeIcon} style={styles.closeButtonImage} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gradientContainer: {
    position: 'absolute',
    width: '100%',
    height: 273,
    left: 0,
    top: 0,
  },  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingTop: 40,
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
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: '#3C3C4399',
  },
  productHeader: {
    padding: 16,
    height: 'max-content',

  },
  productName: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    height: 'max-content',
    marginBottom: 4,
    
  },
  productDescription: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
 
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 250, 
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
   
    backgroundColor: '#FFFFFF',
  },
  productImage: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 16,
  },
  buyNowButton: {
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginLeft: 'auto', // This will push the button to the right
  },
  buyNowText: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontFamily: 'Gabarito',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  originalPrice: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.5)',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  discount: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2DBDEE',
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingText: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginLeft: 8,
  },
  reviewText: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderTopColor: '#E0E0E0',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    fontWeight: '400',
    color: '#000000',
    marginLeft: 8,
  },
  icon: {
    width: 16,
    height: 16,
  },
  optionsContainer: {
    marginBottom: 20,
    position: 'relative',
    marginTop: 20, // Add some top margin to position it correctly
  },
  optionTitle: {
    fontFamily: 'Gabarito',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: '#000000',
    marginBottom: 10,
    marginLeft: 0, // Remove left margin
  },
  colorOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 98, // Align with the provided left position
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  sizeOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeOption: {
    width: 40,
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedSizeOption: {
    backgroundColor: '#000',
  },
  sizeOptionText: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    color: '#000000',
  },
  sizeChartButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
  },
  offerIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  offersContainer: {
    marginBottom: 16,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerText: {
    marginLeft: 12,
    color: '#000',
    fontSize: 14,
    fontFamily: 'Gabarito',
  },
  highlightText: {
    color: '#2DBDEE',
  },
  specificationContainer: {
    marginBottom: 16,
  },
  specificationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'Gabarito',
  },
  readMoreText: {
    color: '#2DBDEE',
    marginTop: 8,
    fontFamily: 'Gabarito',
  },
  reviewContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    fontFamily: 'Gabarito',
    color: '#000000',
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Gabarito',
    color: '#000000',
  },
  ratingStars: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 14,
    color: '#909090',
    fontFamily: 'Gabarito',
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(0, 0, 0, 0.5)',
    fontFamily: 'Gabarito',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    fontFamily: 'Gabarito',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    height: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: 'flex-start',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Gabarito',
    color: '#000000',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Gabarito',
  },
  closeButton: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: 20,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  closeButtonImage: {
    width: 22,
    height: 22,
  },
  attributeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  attributeOption: {
    minWidth: 60,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  selectedAttributeOption: {
    backgroundColor: '#000',
  },
  attributeOptionText: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    color: '#000000',
  },
  selectedAttributeOptionText: {
    color: '#FFFFFF',
  },
  attributeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attributeTitle: {
    fontSize: 16,
    fontWeight: '800', // Changed from '600' to '800'
    marginRight: 12,
    minWidth: 80,
    fontFamily: 'Gabarito',
  },
  attributeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  attributeOption: {
    width: 50,
    height: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  attributeOptionText: {
    fontFamily: 'Gabarito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    color: '#000000',
  },
  outOfStockContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FF0000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  attributesContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  imageCarousel: {
    width: width * 0.8,
    height: width * 0.8,
  },
  specItem: {
    marginBottom: 12,
  },
  specTitle: {
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  specDescription: {
    fontFamily: 'Gabarito',
    fontSize: 14,
    color: '#666666',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2DBDEE',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Gabarito',
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  contactLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Gabarito',
  },
  contactValue: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Gabarito',
  },
  closeButton: {
    backgroundColor: '#2DBDEE',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Gabarito',
    fontWeight: '600',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalCloseButton: {
    padding: 5,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  contactDetailsContainer: {
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  contactTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  locationContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
    fontFamily: 'Gabarito',
  },
  locationDetails: {
    marginTop: 8,
  },
  locationDetail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'Gabarito',
  },
  categoryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryDetails: {
    marginTop: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
    fontFamily: 'Gabarito',
  },
  subCategoryText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontFamily: 'Gabarito',
  },
  subSubCategoryText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Gabarito',
  }
});

export default HubDetail;
