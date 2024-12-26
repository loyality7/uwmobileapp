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
import HeaderComponent from '../../components/HeaderComponent';
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

const ProductDetails = ({ route }) => {
  const { product } = route.params;
  const [selectedAttribute, setSelectedAttribute] = useState({});
  const [selectedSize, setSelectedSize] = useState(null);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRAM, setSelectedRAM] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const userData = useSelector(state => state.user ? state.user.data : null);
  const { isLoggedIn, user, checkUserSession } = useAuth();
  const navigation = useNavigation();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Extract attributes from the product
  const attributes = product.formattedAttributes || {};

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
    if (attributeName === 'Colour') {
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

  useEffect(() => {
    checkWishlistStatus();
  }, []);

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
        const isProductInWishlist = response.data.some(item => item.productUuid === product.productUuid);
        setIsInWishlist(isProductInWishlist);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this product: ${product.productName} - ${product.description}`,
        url: product.imageUrl,
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
      let url = `customers/secure/wishlist/${product.productUuid}`;
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
    console.log('handleAddToCart - Current auth state:', {
      isLoggedIn,
      user,
      token: await AsyncStorage.getItem('@token')
    });

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

      let url = `customers/secure/cart/${product.productUuid}?quantity=1`;
      
      let response = await postMethod({ url, token, payload: {} });
      console.log('Add to cart response:', response);

      if (response.success) {
        ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
        navigation.navigate('Cart');
      } else {
        ToastAndroid.show(response.message || 'Failed to add product to cart', ToastAndroid.SHORT);
      }
    } catch (e) {
      console.error('Error in handleAddToCart:', e);
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

  const trimmedProductName = product.productName.length > 20
    ? product.productName.substring(0, 20) + '...' 
    : product.productName;
    const trimDescription = (description, maxLength = 190) => {
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
        <TouchableOpacity style={styles.buyNowButton} onPress={handleAddToCart}>
          <Image source={require('../../assets/buy_now.png')} style={styles.buyNowImage} />
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
    const images = product.images || [product.imageUrl]; // Use multiple images if available
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageCarousel}
      >
        {images.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedImageIndex(index)}>
            <Image source={{ uri: image }} style={styles.productImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <>
      <StatusBarManager />
      <View style={styles.container}>
        <ScrollView>
          <LinearGradient
            colors={['rgba(45, 189, 238, 0.2)', '#C1ECFA']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 0.83}}
            style={styles.gradientContainer}
          >
            <HeaderComponent 
              isShowRightIcon={false} 
              screenType="productDetails"
            />
            <View style={styles.productHeader}>
              <Text style={styles.productName}>{product.productName}</Text>
              <Text style={styles.productDescription}>
                {trimDescription(product.description)}
              </Text>
            </View>
          </LinearGradient>
    
          <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
              {renderImageCarousel()}
            </View>
            {renderActionButtons()}
    
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹ {product.price.toFixed(2)}</Text>
              <Text style={styles.originalPrice}>₹ {product.recommendedPrice.toFixed(2)}</Text>
              <Text style={styles.discount}>{calculateDiscount(product.price, product.recommendedPrice)}% off</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {renderRatingStars(product.overallRating)}
              </View>
              <Text style={styles.ratingText}>
                {product.ratings && product.ratings.length > 0 
                  ? `${product.ratings.length} Ratings`
                  : 'No ratings'}
              </Text>
              <Text style={styles.reviewText}>
                {product.ratings && product.ratings.length > 0 
                  ? `${product.ratings.length} Reviews`
                  : 'No reviews'}
              </Text>
            </View>
      
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Image source={require('../../assets/seller.png')} style={styles.icon} />
                <Text style={styles.infoText}>{product.vendor.userName}</Text
                >
              </View>
              <View style={styles.infoItem}>
              <Image source={require('../../assets/stock.png')} style={styles.icon} />
              <Text style={styles.infoText}>14 days exchange</Text>
              </View>
              <View style={styles.infoItem}>
                <Image source={require('../../assets/stock.png')} style={styles.icon} />
                <Text style={styles.infoText}>{product.stock} in stock</Text>
              </View>
              <View style={styles.infoItem}>
                <Image source={require('../../assets/ticket.png')} style={styles.icon} />
                <Text style={styles.infoText}>Apply UrbanTicket</Text>
              </View>
              <View style={styles.infoItem}>
                <Image source={require('../../assets/AAA.png')} style={styles.icon} />
                <Text style={styles.infoText}>AAA certified</Text>
              </View>
              <View style={styles.infoItem}>
                <Image source={require('../../assets/secure.png')} style={styles.icon} />
                <Text style={styles.infoText}>Secure transaction</Text>
              </View>
            </View>
  
    
            <View style={styles.attributesContainer}>
              {Object.entries(product.formattedAttributes).map(([attributeName, attributeValues]) =>
                renderAttributeSection(attributeName, attributeValues)
              )}
            </View>
    
            <View style={styles.offersContainer}>
              <Text style={styles.sectionTitle}>Offers</Text>
              <View style={styles.offerItem}>
                <Image
                  source={require('../../assets/point.png')}
                  style={styles.offerIcon}
                />
                <Text style={styles.offerText}>
                  Got a <Text style={styles.highlightText}>coupon</Text>? More discounts at checkout.
                </Text>
              </View>
              <View style={styles.offerItem}>
                <Image
                  source={require('../../assets/point.png')}
                  style={styles.offerIcon}
                />
                <Text style={styles.offerText}>
                  10% Instant Discount on SBI Credit Card
                </Text>
              </View>
              <View style={styles.offerItem}>
                <Image
                  source={require('../../assets/point.png')}
                  style={styles.offerIcon}
                />
                <Text style={styles.offerText}>
                  Get Upto ₹250 cashback for RuPay transaction
                </Text>
              </View>
            </View>
    
            <View style={styles.specificationContainer}>
              <Text style={styles.sectionTitle}>Product specifications</Text>
              <Text style={styles.specificationText}>
                {showFullSpecs
                  ? product.description
                  : `${product.description.slice(0, 150)}...`}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}> 
                <Text style={styles.readMoreText}>
                  {showFullSpecs ? 'Read less' : 'Read more'}
                </Text>
              </TouchableOpacity>
            </View>
    
            <View style={styles.reviewContainer}>
              <Text style={styles.sectionTitle}>Rating & Reviews</Text>
              {product.ratings && product.ratings.length > 0 ? (
                product.ratings.map((rating, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{rating.reviewByName}</Text>
                      <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            name={star <= rating.starRating ? "star" : "star-o"}
                            size={16}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewDate}>
                        {new Date(rating.reviewedOn).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.reviewText}>{rating.description}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noReviewsText}>No reviews yet</Text>
              )}
            </View>
          </View>
        </ScrollView>
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
    </>
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
    top: -20,
  },  
  productHeader: {
    padding: 16,
    height: 'max-content',
    marginTop: 20,
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
    // paddingHorizontal: 16,
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
    marginRight: 18,
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
});

export default ProductDetails;
