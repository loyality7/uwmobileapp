import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../../../helpers';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import StatusBarManager from '../../../components/StatusBarManager';

// Add these components at the top, before CustomHeader
const LocationDropdown = ({ cities, selectedCity, setSelectedCity, isLocationDropdownVisible, setIsLocationDropdownVisible }) => (
  <View>
    <TouchableOpacity 
      style={styles.locationButton}
      onPress={() => setIsLocationDropdownVisible(!isLocationDropdownVisible)}
    >
      <Icon name="location-on" size={20} color="black" />
      <Text style={styles.locationText}>{selectedCity}</Text>
      <Icon name="keyboard-arrow-down" size={20} color="black" />
    </TouchableOpacity>

    {isLocationDropdownVisible && (
      <View style={styles.dropdownContainer}>
        {cities.map((city, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dropdownItem}
            onPress={() => {
              setSelectedCity(city);
              setIsLocationDropdownVisible(false);
            }}
          >
            <Text style={[
              styles.dropdownText,
              selectedCity === city && styles.selectedDropdownText
            ]}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

// Update CustomHeader component
const CustomHeader = ({ cities, selectedCity, setSelectedCity, isLocationDropdownVisible, setIsLocationDropdownVisible }) => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.logoContainer}>
        <View style={styles.brandContainer}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.logo} 
          />
          <Text style={styles.brandText}>AgriSure</Text>
        </View>
        <LocationDropdown 
          cities={cities}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          isLocationDropdownVisible={isLocationDropdownVisible}
          setIsLocationDropdownVisible={setIsLocationDropdownVisible}
        />
      </View>
      <View style={styles.headerSearch}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search" size={28} color="rgba(60, 60, 67, 0.6)" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search"
            placeholderTextColor="rgba(60, 60, 67, 0.6)"
          />
          <TouchableOpacity>
          <Icon name="mic" size={20} color="#999" />  
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const AgrisureProduct = ({ route }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'default',
    priceRange: [0, Infinity],
    rating: 0,
  });
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [isLocationDropdownVisible, setIsLocationDropdownVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (productList.length > 0) {
      const uniqueCities = [...new Set(productList.map(item => 
        item.location?.address?.city
      ).filter(Boolean))];
      
      setCities(uniqueCities);
      setSelectedCity(uniqueCities[0] || '');
    }
  }, [productList]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Remove token check since it's not needed for public posts
      const url = 'customers/posts/all/Farmer';
      const response = await getMethod({ url });

      console.log('Response:', JSON.stringify(response, null, 2));

      if (response && response.success && Array.isArray(response.data)) {
        setProductList(response.data);
        setFilteredProducts(response.data);

        // Update category extraction for posts
        const uniqueCategories = ['All', ...new Set(response.data.map(post => 
          post.category || 'Uncategorized'
        ))];
        setCategories(uniqueCategories);
      } else {
        throw new Error(response.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProductList([]);
      setFilteredProducts([]);
      setCategories(['All']);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeSearch = query => {
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const filterProducts = (query, category) => {
    let filtered = productList;
    if (query) {
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category !== 'All') {
      filtered = filtered.filter(item => 
        item.category.categoryName === category
      );
    }
    setFilteredProducts(filtered);
  };

  const applyFilters = () => {
    let filtered = productList;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category.categoryName === selectedCategory);
    }

    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    filtered = filtered.filter(item => item.overallRating >= filters.rating);

    if (filters.sortBy === 'priceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'priceHighToLow') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'topRated') {
      filtered.sort((a, b) => b.overallRating - a.overallRating);
    }

    setFilteredProducts(filtered);
    setIsFilterVisible(false);
  };

  const renderFilterSidebar = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterVisible}
      onRequestClose={() => setIsFilterVisible(false)}
    >
      <View style={styles.filterSidebar}>
        <Text style={styles.filterTitle}>Filters</Text>
        
        <Text style={styles.filterSubtitle}>Sort By:</Text>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => setFilters({...filters, sortBy: 'priceLowToHigh'})}
        >
          <Text style={{color:'black'}}>Price: Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => setFilters({...filters, sortBy: 'priceHighToLow'})}
        >
          <Text style={{color:'black'}}>Price: High to Low</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => setFilters({...filters, sortBy: 'topRated'})}
        >
          <Text style={{color:'black'}}>Top Rated</Text>
        </TouchableOpacity>

        <Text style={styles.filterSubtitle}>Price Range:</Text>
        {/* Add a price range slider here */}

        <Text style={styles.filterSubtitle}>Minimum Rating:</Text>
        {/* Add a rating selector here */}
        
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem,
      ]}
      onPress={() => {
        setSelectedCategory(item);
        filterProducts(searchQuery, item);
      }}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item && styles.selectedCategoryText
      ]}>
        {item === 'All' ? 'All Categories' : item}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { item })}
      style={[
        styles.productItem,
        index % 2 === 0 && filteredProducts.length - 1 === index && styles.lastOddItem
      ]}
    >
      <Image 
        source={{ uri: item.image[0] }} // Assuming image is an array
        style={styles.productImage} 
      />
      <Text style={styles.productName}>
        {item.title?.length > 16 ? item.title.slice(0, 16) + '...' : item.title}
      </Text>
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
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <StatusBarManager barStyle="light-content" />
      <LinearGradient
        colors={['#a8e6c5', '#E9F0F5']}
        locations={[0, 0.4]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <CustomHeader 
            cities={cities}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            isLocationDropdownVisible={isLocationDropdownVisible}
            setIsLocationDropdownVisible={setIsLocationDropdownVisible}
          />
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{selectedCategory}</Text>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setIsFilterVisible(true)}
            >
              <Text style={styles.filterText}>Filter</Text>
              <Icon name="filter-list" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item._id}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
          {renderFilterSidebar()}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
    fontFamily: 'Gabarito',
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Gabarito',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color:'black',
    marginRight: 5,
    fontFamily: 'Gabarito',
  },
  categoryList: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    height: 40,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: '#FFF',
  },
  selectedCategoryItem: {
    backgroundColor: '#3ec87f',
    },
  categoryText: {
    color: 'black',
    fontWeight: '500',
    fontFamily: 'Gabarito',
  },
  selectedCategoryText: {
    color: 'black',
    fontFamily: 'Gabarito',
  },
  productList: {
    paddingHorizontal: 8,
  },
  productItem: {
    width: '48%',  
    margin: '1%',  
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  lastOddItem: {
    marginRight: '51%', 
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'Gabarito',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    marginLeft: 4,
    color: 'black',
    fontFamily: 'Gabarito',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Gabarito',
  },
  retryButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#a8e6c5',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'Gabarito',
  },
  filterSidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Gabarito',
  },
  filterSubtitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  filterOption: {
    padding: 10,
    borderBottomWidth: 1,
    color:'black',
    borderBottomColor: '#eee',
  },
  applyButton: {
    backgroundColor: '#3ec87f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: {
    color: 'black',
    fontWeight: 'bold',
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
    borderRadius: 10,
    paddingHorizontal: 10,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
    width: 50
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 18,
    fontFamily: 'SF Pro Display',
    fontWeight: '500',
    paddingLeft: 40,
    color: 'rgba(60, 60, 67, 0.6)',
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
    width: '100%',
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Gabarito',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 8,
    fontFamily: 'Gabarito',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    zIndex: 1000,
  },
  locationText: {
    color: 'black',
    marginHorizontal: 4,
    fontSize: 16,
    fontFamily: 'Gabarito',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    minWidth: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Gabarito',
  },
  selectedDropdownText: {
    color: '#3ec87f',
    fontWeight: 'bold',
  },
});

export default AgrisureProduct;
