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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../../../helpers';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

// First define LocationDropdown component before CustomHeader
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

// Then update CustomHeader to receive and pass the necessary props
const CustomHeader = ({ cities, selectedCity, setSelectedCity, isLocationDropdownVisible, setIsLocationDropdownVisible }) => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.logoContainer}>
        <View style={styles.brandContainer}>
          <Image 
            source={require('../../../assets/Visual-Arts.png')} 
            style={styles.logo} 
          />
          <Text style={styles.brandText}>BrainBox</Text>
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
            <Icon name="mic" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const BrainBoxProduct = ({ route }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([{ id: null, title: 'All Categories' }]); 
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
  const [hubType, setHubType] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    fetchCategories(hubType);
  }, [hubType]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (productList.length > 0) {
      // Extract unique cities from products
      const uniqueCities = [...new Set(productList.map(item => 
        item.location?.address?.city
      ).filter(Boolean))];
      
      setCities(uniqueCities);
      // Set default city from first product
      setSelectedCity(uniqueCities[0] || '');
    }
  }, [productList]);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        console.error("No authentication token found.");
        Alert.alert('Error', 'Please login to continue');
        return;
      }

      const profileResponse = await getMethod({ 
        url: 'customers/secure/profile', 
        token 
      });

      console.log("Profile Response:", profileResponse);

      const userProfile = profileResponse?.data?.customer;
      if (!userProfile?.hubUser) {
        Alert.alert('Error', 'No hub user found');
        return;
      }

      // Determine the hub type (Student, Professional, etc.)
      const userHubType = Object.keys(userProfile.hubUser)[0];
      setHubType(userHubType);
      
      // After getting hubType, fetch categories
      fetchCategories(userHubType);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to load user profile');
    }
  };

  const fetchCategories = async (currentHubType) => {
    try {
      const response = await getMethod({
        url: `customers/posts/categories/${currentHubType}`
      });

      if (response && response.data && Array.isArray(response.data)) {
        // Store full category objects instead of just titles
        const extractCategories = (categories) => {
          let result = [];
          categories.forEach(cat => {
            result.push({
              id: cat._id,
              title: cat.title,
              level: cat.level || 1
            });
            if (cat.children && cat.children.length > 0) {
              result = result.concat(extractCategories(cat.children));
            }
          });
          return result;
        };

        const allCategories = extractCategories(response.data);
        setCategories([{ id: null, title: 'All Categories' }, ...allCategories]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([{ id: null, title: 'All Categories' }]);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      const url = `customers/posts/all/${hubType}`;

      console.log('Fetching products with URL:', url); 
      const response = await getMethod({ 
        url,
        token: storedToken 
      });

      console.log('API Response:', response);
      
      if (response?.data) {
        const products = response.data.map(item => ({
          _id: item._id,
          title: item.title,
          productName: item.title,
          price: item.price,
          discountPrice: item.discountPrice,
          images: item.image,
          image: item.image,
          description: item.desc,
          category: {
            categoryName: item.category?.title || 'Uncategorized'
          },
          location: item.location
        }));
        
        console.log('Processed products:', products);
        
        setProductList(products);
        setFilteredProducts(products);
      } else {
        console.log('No products found in response');
        setProductList([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
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
          <Text>Price: Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => setFilters({...filters, sortBy: 'priceHighToLow'})}
        >
          <Text>Price: High to Low</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterOption}
          onPress={() => setFilters({...filters, sortBy: 'topRated'})}
        >
          <Text>Top Rated</Text>
        </TouchableOpacity>

        <Text style={styles.filterSubtitle}>Price Range:</Text>

        <Text style={styles.filterSubtitle}>Minimum Rating:</Text>
=        
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const handleCategorySelect = (category) => {
    setSelectedCategory(category.title);
    // Fetch products based on category selection
    if (category.title === 'All Categories') {
      fetchAllProducts();
    } else {
      fetchProductsByCategory(category.id);
    }
  };

  // Add new function to fetch all products
  const fetchAllProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      const url = `customers/posts/all/${hubType}`;

      const response = await getMethod({ 
        url,
        token: storedToken 
      });
      
      if (response?.data) {
        const products = response.data.map(item => ({
          _id: item._id,
          title: item.title,
          productName: item.title,
          price: item.price,
          discountPrice: item.discountPrice,
          images: item.image,
          image: item.image,
          description: item.desc,
          category: {
            categoryName: item.category?.title || 'Uncategorized'
          },
          location: item.location
        }));
        
        setProductList(products);
        setFilteredProducts(products);
      }
    } catch (err) {
      console.error('Error fetching all products:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new function to fetch products by category
  const fetchProductsByCategory = async (categoryId) => {
    setIsLoading(true);
    setError(null);
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      const url = `customers/posts/category/${hubType}/${categoryId}`;

      const response = await getMethod({ 
        url,
        token: storedToken 
      });
      
      if (response?.data) {
        const products = response.data.map(item => ({
          _id: item._id,
          title: item.title,
          productName: item.title,
          price: item.price,
          discountPrice: item.discountPrice,
          images: item.image,
          image: item.image,
          description: item.desc,
          category: {
            categoryName: item.category?.title || 'Uncategorized'
          },
          location: item.location
        }));
        
        setProductList(products);
        setFilteredProducts(products);
      } else {
        setProductList([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  // Update useEffect for products
  useEffect(() => {
    if (hubType) {
      // Initially load all products
      fetchAllProducts();
    }
  }, [hubType]);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.title && styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.title && styles.selectedCategoryText
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item, index }) => {
    if (!item) return null;
    
    console.log('Rendering product item:', item);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('HubDetail', { product: item })}
        style={[
          styles.productItem,
          index % 2 === 0 && filteredProducts.length - 1 === index && styles.lastOddItem
        ]}
      >
        <Image 
          source={{ uri: item.images?.[0] || item.image?.[0] }}
          style={styles.productImage} 
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>
            {item.title || item.productName || 'Untitled'}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>Rs. {item.price || 0}</Text>
            <Text style={styles.discountPrice}>Rs. {item.discountPrice || item.price || 0}</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#FAF0B3', '#E9F0F5']}
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
        <View style={styles.mainContent}>  
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
            keyExtractor={(item, index) => (item.id || index.toString())}
            showsHorizontalScrollIndicator={false}
            style={styles.categoryList}
          />
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              renderItem={renderProductItem}
              keyExtractor={item => item?._id || Math.random().toString()}
              numColumns={2}
              contentContainerStyle={styles.productList}
            />
          ) : (
            <View style={styles.noProductsContainer}>
              <Text style={styles.noProductsText}>
                No products available in this category
              </Text>
            </View>
          )}
        </View>
        {renderFilterSidebar()}
      </SafeAreaView>
    </LinearGradient>
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
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    color:'black',
    marginRight: 5,
  },
  categoryList: {
    paddingHorizontal: 16,
    marginBottom: 8,  // Reduce this margin
    maxHeight: 60,    // Add this to constrain category height
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
    backgroundColor: '#f5de54',
  },
  categoryText: {
    color: 'black',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'black',
  },
  productList: {
    paddingHorizontal: 8,
    paddingTop: 0,    // Add this to remove top padding
  },
  productItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#F5DE5433',
    overflow: 'hidden',
    height: 280,
    margin: '1%',
  },
  lastOddItem: {
    marginRight: '51%', 
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productDetails: {
    padding: 10,
    height: 130,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
    fontFamily: 'Gabarito',
    height: 40,
  },
  productPrice: {
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
  retryButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#FAF0B3',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'black',
    fontWeight: 'bold',
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
    backgroundColor: '#FAF0B3',
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
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    marginTop: 10,
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
  },
  mainContent: {  // Add this new style
    flex: 1,
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
  },
  selectedDropdownText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default BrainBoxProduct;
