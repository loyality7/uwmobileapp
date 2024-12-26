import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../../../components/CustomText'; // Import the custom text component
import { getMethod } from '../../../helpers/index';
import HeaderComponent from '../../../components/HeaderComponent'; // Add this import
import StatusBarManager from '../../../components/StatusBarManager';
import LinearGradient from 'react-native-linear-gradient';

const BrainBox = () => {
  const navigation = useNavigation();
  const [items, setItems] = React.useState([]);

  // Add useEffect to fetch products
  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getMethod({
        url: 'customers/posts/all/Student'
      });
      
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const categories = [
    { name: 'Visual Arts', image: require('../../../assets/Visual-Arts.png') },
    { name: 'Fine Arts', image: require('../../../assets/Fine-Arts.png') },
    { name: 'Literature', image: require('../../../assets/Literature.png') },
    { name: 'Design', image: require('../../../assets/Design.png') },
    { name: 'Innovation', image: require('../../../assets/Innovation.png') },
  ];
  
  // Add this helper function at the top of the file, after the imports
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <LinearGradient
      colors={['#FAF0B3', '#E9F0F5']}
      locations={[0, 0.4]}
      style={styles.container}
    >
      <StatusBarManager 
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <HeaderComponent />
      <ScrollView style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>BrainBox</Text>
          <Text style={styles.subheader}>Explore the creative world</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.categoryItem} 
              onPress={() => navigation.navigate('BrainBoxProducts', { category: category.name })}
            >
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionMainContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New in {items[0]?.location?.address?.city || 'Your City'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('BrainBoxProduct', { category: 'All' })}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <Image 
                  source={{ uri: item.image[0] }} // Use the first image from the array
                  style={styles.itemImage} 
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{truncateText(item.title, 16)}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={styles.originalPrice}>Rs. {item.price}</Text>
                    <Text style={styles.discountPrice}>Rs. {item.discountPrice}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.viewButton}
                    onPress={() => navigation.navigate('HubDetail', { product: item })}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
                {index === items.length - 1 && (
                  <TouchableOpacity style={styles.addButton}>
                    <Icon name="plus" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingAddButton} onPress={() => navigation.navigate('CreatePost')}>
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    fontFamily:'Gabarito',
    fontWeight:'500',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Gabarito',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    fontFamily: 'Gabarito',
    fontWeight:'500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    fontFamily: 'Gabarito',
  },
  sectionMainContainer: {
    marginTop: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
    borderRadius: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#101313',
    lineHeight:27,
    marginBottom: 15,
    fontFamily: 'Gabarito',
  },
  viewMoreText: {
    color: '#FFA500',
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Gabarito',
    borderRadius: 50,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100, // Add padding to prevent cards from being hidden behind FAB
  },
  itemCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#F5DE5433',
    overflow: 'hidden',
    position: 'relative',
    height: 280, // Increased height to accommodate the button
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  itemDetails: {
    padding: 10,
    height: 130, // Increased height to ensure button is visible
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'Gabarito',
    height: 40,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 10,
    fontFamily: 'Gabarito',
  },
  viewButton: {
    backgroundColor: '#FFA500',
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Gabarito',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    elevation: 5, // for Android shadow
    shadowColor: '#000', // for iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  originalPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    fontFamily: 'Gabarito',
  },
  discountPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Gabarito',
  },
});

export default BrainBox;
