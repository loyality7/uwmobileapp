import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../../../components/CustomText'; // Import the custom text component
import { getMethod } from '../../../helpers';
import StatusBarManager from '../../../components/StatusBarManager';

const AgriSure = () => {
  const navigation = useNavigation();
  const [items, setItems] = React.useState([]);

  // Add useEffect to fetch products
  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getMethod({
        url: 'customers/posts/all/Farmer'
      });
      
      if (response.success && response.data) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Helper function for truncating text
  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const categories = [
    { name: 'Visual Arts', image: require('../../../assets/Visual-Arts.png') },
    { name: 'Fine Arts', image: require('../../../assets/Fine-Arts.png') },
    { name: 'Literature', image: require('../../../assets/Literature.png') },
    { name: 'Design', image: require('../../../assets/Design.png') },
    { name: 'Innovation', image: require('../../../assets/Innovation.png') },
  ];
  
  const CustomHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search"
            placeholderTextColor="#999"
          />
          <TouchableOpacity>
            <Icon name="mic" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/Blue-bg.png')}  
      style={styles.backgroundImage}
    >
      <StatusBarManager barStyle="light-content" backgroundColor="transparent" />
      <CustomHeader />
      <ScrollView style={styles.container}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>AgriSure</Text>
          <Text style={styles.subheader}>Explore the creative world</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryItem}>
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionMainContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New in {items[0]?.location?.address?.city || 'Your City'}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AgriSureProducts', { category: 'All' })}>
              <Text style={styles.viewMoreText}>View more</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.itemsContainer}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <Image 
                  source={{ uri: item.image[0] }}
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
                    onPress={() => navigation.navigate('ProductDetails', { item })}
                  >
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingAddButton}>
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop:50,
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
    // Add any additional styles from BrainBoxProduct.js here
  },
  searchIcon: {
    marginRight: 5,
    // Add any additional styles from BrainBoxProduct.js here
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    // Add any additional styles from BrainBoxProduct.js here
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
  },
  itemCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: 166,
    resizeMode: 'cover',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0, 
  },
  itemDetails: {
    padding: 10,
    backgroundColor: '#c7e8dd', // Updated color
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight:21.6,
    color: '#000000',
    marginBottom: 5,
    fontFamily: 'Gabarito',
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
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AgriSure;
