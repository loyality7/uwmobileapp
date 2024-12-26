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
          <Text style={styles.brandText}>XBO</Text>
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

const XBOProduct = ({ route }) => {
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

  // Add new useEffect for categories
  useEffect(() => {
    fetchCategories();
  }, []); 

  // Update useEffect for products
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]); 

  const fetchCategories = async () => {
    try {
      const response = await getMethod({
        url: `customers/posts/categories/Student`
      });

      if (response && response.data && Array.isArray(response.data)) {
        const extractCategories = (categories) => {
          let result = [];
          categories.forEach(cat => {
            if (cat && cat._id && cat.title) { 
              result.push({
                id: cat._id,
                title: cat.title,
                level: cat.level || 1
              });
              if (cat.children && Array.isArray(cat.children) && cat.children.length > 0) {
                result = result.concat(extractCategories(cat.children));
              }
            }
          });
          return result;
        };

        const allCategories = extractCategories(response.data);
        setCategories([{ id: null, title: 'All Categories' }, ...allCategories]);
      } else {
        console.warn('Invalid categories data format:', response);
        setCategories([{ id: null, title: 'All Categories' }]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([{ id: null, title: 'All Categories' }]);
    }
  };

  // Update fetchProducts function
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      let url = 'customers/posts/all/Student';

      if (selectedCategory && selectedCategory !== 'All Categories') {
        const selectedCat = categories.find(cat => cat.title === selectedCategory);
        if (selectedCat?.id) {
          url = `customers/posts/all/Student/${selectedCat.id}`;
        }
      }

      const response = await getMethod({ 
        url,
        token: storedToken 
      });

      if (response?.success && Array.isArray(response.data)) {
        setProductList(response.data);
        setFilteredProducts(response.data);
        
        // Extract unique cities from products
        const uniqueCities = [...new Set(
          response.data
            .map(product => product.location?.address?.city)
            .filter(Boolean)
        )];
        
        setCities(uniqueCities);
        // Set default city if not already set
        if (uniqueCities.length > 0 && !selectedCity) {
          setSelectedCity(uniqueCities[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleCategorySelect function
  const handleCategorySelect = (category) => {
    setSelectedCategory(category.title);
    filterProducts(searchQuery, category.title);
  };

  const onChangeSearch = query => {
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const filterProducts = (query, category) => {
    let filtered = productList;
    
    // Filter by search query
    if (query) {
      filtered = filtered.filter(item => 
        item?.title?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by category
    if (category && category !== 'All Categories') {
      filtered = filtered.filter(item => 
        item.category?.title === category
      );
    }

    // Add city filter
    if (selectedCity) {
      filtered = filtered.filter(item => 
        item.location?.address?.city === selectedCity
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

        <Text style={styles.filterSubtitle}>Minimum Rating:</Text>
        
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
    if (!item || !item.title) return null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetails', { item })}
        style={[
          styles.productItem,
          index % 2 === 0 && filteredProducts.length - 1 === index && styles.lastOddItem
        ]}
      >
        <Image 
          source={{ uri: item.image?.[0] || '' }} 
          style={styles.productImage} 
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.title || 'Untitled Product'}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.originalPrice}>
              Rs. {item.price || '0'}
            </Text>
            <Text style={styles.discountPrice}>
              Rs. {item.discountPrice || item.price || '0'}
            </Text>
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
      colors={['#7969ff', '#E9F0F5']} // Changed from green to light purple
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
    marginBottom: 8,
    maxHeight: 60,
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
    backgroundColor: '#6366f1', // Changed from #3ec87f
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
    paddingTop: 0,    // Remove extra top padding
  },
  productItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#edebfe', // Changed from #3ec87f33
    overflow: 'hidden',
    height: 280,        // Fixed height
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
    backgroundColor: '#edebfe', // Changed from #a8e6c5
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
    backgroundColor: '#6366f1', // Changed from #3ec87f
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
    backgroundColor: '#6366f1',
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
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
    color: '#6366f1', // Changed from #3ec87f
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
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
});

export default XBOProduct;
