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
  ScrollView,
  ToastAndroid,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getMethod } from '../../helpers';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { postMethod, putMethod, deleteMethod } from '../../helpers';
import Svg, { Path } from 'react-native-svg';
import StatusBarManager from '../../components/StatusBarManager';
import HeaderComponent from '../../components/HeaderComponent';

const Product = ({ route }) => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Fashions');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isSortVisible, setIsSortVisible] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'default',
    priceRange: [0, Infinity],
    rating: 0,
  });
  const [wishlist, setWishlist] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [cartItems, setCartItems] = useState({});
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Relevance');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minKnobX, setMinKnobX] = useState(0);
  const [maxKnobX, setMaxKnobX] = useState(300);
  const [sliderWidth, setSliderWidth] = useState(300);
  const [categoryIdMap, setCategoryIdMap] = useState({});
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [currentCategoryName, setCurrentCategoryName] = useState(null);

  const sortOptions = [
    'New Arrivals',
    'Relevance',
    'Price - Low to High',
    'Price - High to Low'
  ];

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    const { categoryId, categoryName, fromScreen } = route.params || {};
    
    if (categoryId && categoryName) {
      setCurrentCategoryId(categoryId);
      setCurrentCategoryName(categoryName);
      setSelectedCategory(categoryName);
    }
  }, [route.params]);

  const fetchCategories = async () => {
    try {
      const url = 'common/nested/category';
      const response = await getMethod({ url });

      if (response && response.success && Array.isArray(response.data)) {
        // Create mapping of category names to IDs
        const idMap = {};
        response.data.forEach(cat => {
          idMap[cat.name] = cat._id;
        });
        setCategoryIdMap(idMap);

        // Add 'All Categories' and extract category names
        const categoryNames = ['All Categories', ...response.data.map(cat => cat.name)];
        setCategories(categoryNames);
      } else {
        throw new Error('Invalid category response format');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories(['All Categories']);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = 'products/list_products';
      const response = await getMethod({ url });

      if (response && response.success && Array.isArray(response.data)) {
        const allProducts = response.data;
        
        // Filter products by category if categoryId exists
        if (currentCategoryId) {
          const filteredByCategory = allProducts.filter(product => 
            product.nestedCategory === currentCategoryId
          );
          setProductList(filteredByCategory);
          setFilteredProducts(filteredByCategory);
        } else {
          setProductList(allProducts);
          setFilteredProducts(allProducts);
        }

        const maxProductPrice = Math.max(...allProducts.map(product => product.price));
        setMaxPrice(maxProductPrice);
        setPriceRange([0, maxProductPrice]);

        // Extract unique colors, brands, and genders
        const uniqueColors = [...new Set(allProducts.flatMap(product => product.color))];
        const uniqueBrands = [...new Set(allProducts.map(product => product.brand))];
        const uniqueGenders = [...new Set(allProducts.map(product => product.gender))];

        setSelectedColors(uniqueColors);
        setSelectedBrands(uniqueBrands);
        setSelectedGender(uniqueGenders);
      } else {
        throw new Error(response.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setProductList([]);
      setFilteredProducts([]);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentCategoryId]);

  const onChangeSearch = query => {
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const filterProducts = (query, category) => {
    let filtered = productList;
    
    // Apply search query filter
    if (query) {
      filtered = filtered.filter(item => 
        item.productName.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Apply category filter
    if (category && category !== 'All Categories') {
      const categoryId = categoryIdMap[category];
      filtered = filtered.filter(item => 
        item.nestedCategory === categoryId
      );
    }
    
    setFilteredProducts(filtered);
  };

  const applyFilters = () => {
    console.log('Starting to apply filters');
    console.log('Initial product list length:', productList.length);
    console.log('Price Range:', priceRange);

    try {
      let filtered = [...productList];

      // Apply price filter
      filtered = filtered.filter(item => {
        const itemPrice = parseFloat(item.price);
        return itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
      });
      console.log('After price filter:', filtered.length);

      // Apply category filter if not "All Categories"
      if (selectedCategory && selectedCategory !== 'All Categories') {
        filtered = filtered.filter(item => 
          item.category?.categoryName === selectedCategory
        );
        console.log('After category filter:', filtered.length);
      }

      // Apply color filter
      if (selectedColors && selectedColors.length > 0) {
        filtered = filtered.filter(item => {
          if (!item.color) return false;
          const itemColors = Array.isArray(item.color) ? item.color : [item.color];
          return selectedColors.some(color => itemColors.includes(color));
        });
        console.log('After color filter:', filtered.length);
      }

      // Apply brand filter
      if (selectedBrands && selectedBrands.length > 0) {
        filtered = filtered.filter(item => 
          item.brand && selectedBrands.includes(item.brand)
        );
        console.log('After brand filter:', filtered.length);
      }

      // Apply gender filter
      if (selectedGender) {
        filtered = filtered.filter(item => 
          item.gender === selectedGender
        );
        console.log('After gender filter:', filtered.length);
      }

      console.log('Final filtered products:', filtered.length);
      
      // Update the filtered products
      setFilteredProducts(filtered);
      setIsFilterVisible(false);
      setIsFilterApplied(true);
      setActiveFilter(null);

    } catch (error) {
      console.error('Error in applyFilters:', error);
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory('All Categories');
    setPriceRange([0, 1000]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedGender(null);
    setFilters({
      sortBy: 'default',
      priceRange: [0, Infinity],
      rating: 0,
    });
    setIsFilterApplied(false);
    setFilteredProducts(productList);
  };

  const addToCart = async (productUuid) => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        ToastAndroid.show('Please login to continue', ToastAndroid.SHORT);
        return;
      }

      const url = `customers/secure/cart/${productUuid}?quantity=1`;
      const payload = {
        productId: productUuid,
        quantity: 1,
      };

      const response = await postMethod({ url, token, payload });

      if (response.success) {
        setCartItems(prevItems => ({
          ...prevItems,
          [productUuid]: (prevItems[productUuid] || 0) + 1
        }));
        ToastAndroid.show('Product added to cart', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(response.message || 'Failed to add to cart', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

  const updateCartQuantity = async (productId, newQuantity) => {
    try {
      let url = `customers/secure/cart/${productId}?quantity=${newQuantity}`;
      let token = await AsyncStorage.getItem('@token');
      let response = await putMethod({ url, token, payload: {} });

      if (response.success) {
        setCartItems(prevItems => ({
          ...prevItems,
          [productId]: newQuantity
        }));
        ToastAndroid.show('Cart updated', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(response.message, ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log(e);
      ToastAndroid.show('An error occurred', ToastAndroid.SHORT);
    }
  };

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isFilterVisible}
      onRequestClose={() => {
        setIsFilterVisible(false);
        clearAllFilters();
      }}
    >
      <View style={styles.filterModal}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>Filter</Text>
          
          <TouchableOpacity onPress={() => setIsFilterVisible(false)}>
            <View style={styles.cancelIconContainer}>  
          {isFilterApplied && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
            <Icon name="close" size={24} color="#000" />
            </View>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.filterOptions}>
          <FilterOption title="Price" color='black' onPress={() => setActiveFilter('price')} />
          <FilterOption 
            title="Color" 
            subtitle={selectedColors.join(', ') || 'Select colors'}
            onPress={() => setActiveFilter('color')} 
          />
          <FilterOption 
            title="Brand" 
            subtitle={selectedBrands.join(', ') || 'Select brands'}
            onPress={() => setActiveFilter('brand')} 
          />
          <FilterOption 
            title="Gender" 
            subtitle={selectedGender || 'Select gender'}
            onPress={() => setActiveFilter('gender')} 
          />
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.showProductsButton}
          onPress={() => {
            
            applyFilters();
            setIsFilterVisible(false);
          }}
        >
          <Text style={styles.showProductsButtonText}>Show Products</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const normalizeToPrice = (position) => {
    const percentage = position / sliderWidth;
    return Math.round(percentage * maxPrice);
  };

  const normalizeToPosition = (price) => {
    return (price / maxPrice) * sliderWidth;
  };

  const renderActiveFilterModal = () => {
    switch (activeFilter) {
      case 'price':
        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={!!activeFilter}
            onRequestClose={() => setActiveFilter(null)}
          >
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <TouchableOpacity 
                  onPress={() => setActiveFilter(null)}
                  style={styles.backButton}
                >
                  <Icon name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Price</Text>
                <TouchableOpacity 
                  onPress={() => {
                    setPriceRange([0, maxPrice]);
                    setMinKnobX(0);
                    setMaxKnobX(sliderWidth);
                  }}
                >
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeText}>
                  Price Range: Rs. {priceRange[0]} - Rs. {priceRange[1]}
                </Text>
              </View>

              <View style={styles.sliderContainer}>
                <View 
                  style={styles.slider}
                  onLayout={(event) => {
                    const {width} = event.nativeEvent.layout;
                    setSliderWidth(width);
                  }}
                >
                  <View style={styles.sliderTrack} />
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        left: minKnobX,
                        width: maxKnobX - minKnobX,
                      },
                    ]}
                  />
                  <View
                    style={[styles.sliderKnob, { left: minKnobX }]}
                    {...minPanResponder.panHandlers}
                  >
                    <View style={styles.knobInner} />
                  </View>
                  <View
                    style={[styles.sliderKnob, { left: maxKnobX }]}
                    {...maxPanResponder.panHandlers}
                  >
                    <View style={styles.knobInner} />
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.showProductsButton}
                onPress={() => {
                  applyFilters();
                  setActiveFilter(null);
                }}
              >
                <Text style={styles.showProductsText}>Show Products</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>
        );
      case 'color':
        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={!!activeFilter}
            onRequestClose={() => setActiveFilter(null)}
          >
            <View style={styles.filterModal}>
              <Text style={styles.filterTitle}>Select Colors</Text>
              {['Red', 'Blue', 'Green', 'Yellow'].map(color => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    selectedColors.includes(color) && styles.selectedColorOption
                  ]}
                  onPress={() => {
                    setSelectedColors(prev => 
                      prev.includes(color) 
                        ? prev.filter(c => c !== color)
                        : [...prev, color]
                    );
                  }}
                >
                  <Text>{color}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.applyFilterButton}
                onPress={() => {
                  applyFilters();
                  setActiveFilter(null);
                }}
              >
                <Text style={styles.applyFilterButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        );
      case 'brand':
        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={!!activeFilter}
            onRequestClose={() => setActiveFilter(null)}
          >
            <View style={styles.filterModal}>
              <Text style={styles.filterTitle}>Select Brands</Text>
              {['Adidas', 'Nike', 'Puma', 'Reebok'].map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.brandOption,
                    selectedBrands.includes(brand) && styles.selectedBrandOption
                  ]}
                  onPress={() => {
                    setSelectedBrands(prev => 
                      prev.includes(brand) 
                        ? prev.filter(b => b !== brand)
                        : [...prev, brand]
                    );
                  }}
                >
                  <Text>{brand}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.applyFilterButton}
                onPress={() => {
                  applyFilters();
                  setActiveFilter(null);
                }}
              >
                <Text style={styles.applyFilterButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        );
      case 'gender':
        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={!!activeFilter}
            onRequestClose={() => setActiveFilter(null)}
          >
            <View style={styles.filterModal}>
              <Text style={styles.filterTitle}>Select Gender</Text>
              {['Male', 'Female', 'Others'].map(gender => (
                <TouchableOpacity
                  key={gender}
                  style={[
                    styles.genderOption,
                    selectedGender === gender && styles.selectedGenderOption
                  ]}
                  onPress={() => {
                    setSelectedGender(gender);
                  }}
                >
                  <Text>{gender}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity 
                style={styles.applyFilterButton}
                onPress={() => {
                  applyFilters();
                  setActiveFilter(null);
                }}
              >
                <Text style={styles.applyFilterButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        );
      default:
        return null;
    }
  };

  const FilterOption = ({ title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.filterOption} onPress={onPress}>
      <View>
        <Text style={styles.filterOptionTitle}>{title}</Text>
        {subtitle && <Text style={styles.filterOptionSubtitle}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-right" size={24} color="#000" />
    </TouchableOpacity>
  );

  const handleSortSelection = (option) => {
    setSelectedSort(option);
    let sortedProducts = [...filteredProducts];
    if (option === 'Price - Low to High') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === 'Price - High to Low') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (option === 'New Arrivals') {
      sortedProducts.sort((a, b) => new Date(b.arrivalDate) - new Date(a.arrivalDate));
    }
    setFilteredProducts(sortedProducts);
  };

  const renderSortModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isSortVisible}
      onRequestClose={() => {
        setIsSortVisible(false);
        setSelectedSort('Relevance');
      }}
    >
      <View style={styles.sortModal}>
        <View style={styles.sortHeader}>
          <Text style={styles.sortTitle}>Sort</Text>
          <TouchableOpacity onPress={() => setIsSortVisible(false)}>
            <Icon name="close" size={28} color="#000" />
          </TouchableOpacity>
        </View>
        {sortOptions.map((option) => (
          <TouchableOpacity 
            key={option}
            style={styles.sortOption}
            onPress={() => handleSortSelection(option)}
          >
            <View style={styles.sortOptionContainer}>
            <Text style={styles.sortOptionText}>{option}</Text>
            {selectedSort === option && (
              <Icon name="check" size={24} color="#2DBDEE" />
            )}
             </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          style={styles.sortProductsButton} 
          onPress={() => {
            setIsSortVisible(false);
           
          }}
        >
          <Text style={styles.sortProductsButtonText}>Show Products</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const toggleWishlist = async (productUuid) => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        ToastAndroid.show('Please login to add to wishlist', ToastAndroid.SHORT);
        return;
      }

      const url = `customers/secure/wishlist/${productUuid}`;

      if (wishlist.includes(productUuid)) {
        // Remove from wishlist
        const response = await deleteMethod({ url, token });
        if (response.success) {
          setWishlist(prevWishlist => prevWishlist.filter(id => id !== productUuid));
          ToastAndroid.show('Removed from wishlist', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(response.message || 'Failed to remove from wishlist', ToastAndroid.SHORT);
        }
      } else {
        // Add to wishlist
        const response = await postMethod({ url, token });
        if (response.success) {
          setWishlist(prevWishlist => [...prevWishlist, productUuid]);
          ToastAndroid.show('Added to wishlist', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(response.message || 'Failed to add to wishlist', ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

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

  const renderProductItem = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.productCard}>
        <View style={styles.productImageContainer}>
          <TouchableOpacity
            style={styles.wishlistIcon}
            onPress={() => toggleWishlist(item.productUuid)}
          >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill={wishlist.includes(item.productUuid) ? "#FF0000" : "none"} stroke="#FF0000" strokeWidth="2">
              <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </Svg>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Image 
              source={{ uri: item.imageUrl }} 
              style={styles.productImage}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.productDetails}>
          <Text style={styles.productName}>
            {item.productName?.length > 15 
              ? item.productName.slice(0, 15) + '...' 
              : item.productName}
          </Text>
          <Text style={styles.productDescription}>
            {item.description?.length > 20 
              ? item.description.slice(0, 20) + '...' 
              : item.description}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{item.price}</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            {item.overallRating ? (
                    <>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.overallRating}</Text>
                </>
            ) : null}
          </View>

          <View style={styles.cartActionContainer}>
            {cartItems[item._id] ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => updateCartQuantity(item._id, cartItems[item._id] - 1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{cartItems[item._id]}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton} 
                  onPress={() => updateCartQuantity(item._id, cartItems[item._id] + 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => addToCart(item.productUuid)}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const minPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const newPosition = Math.max(0, Math.min(maxKnobX - 40, gesture.moveX));
      setMinKnobX(newPosition);
      const newPrice = normalizeToPrice(newPosition);
      setPriceRange(prev => [newPrice, prev[1]]);
    },
  });

  const maxPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      const newPosition = Math.max(minKnobX + 40, Math.min(sliderWidth, gesture.moveX));
      setMaxKnobX(newPosition);
      const newPrice = normalizeToPrice(newPosition);
      setPriceRange(prev => [prev[0], newPrice]);
    },
  });

  useEffect(() => {
    if (productList.length > 0) {
      const maxProductPrice = Math.max(...productList.map(product => product.price));
      setMaxPrice(maxProductPrice);
      setPriceRange([0, maxProductPrice]);
      setMinKnobX(0);
      setMaxKnobX(sliderWidth);
    }
  }, [productList]);

  useEffect(() => {
    console.log('FilteredProducts updated:', filteredProducts.length);
    console.log('Selected Category:', selectedCategory);
    console.log('Price Range:', priceRange);
  }, [filteredProducts, selectedCategory, priceRange]);

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
      colors={['#B2E3F4', '#FFFFFF']}
      locations={[0, 0.4]}
      style={styles.container}
    >
      <StatusBarManager />
      <SafeAreaView style={styles.safeArea}>
        <HeaderComponent 
          isShowRightIcon={false} 
          screenType="product"
        />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {currentCategoryName || selectedCategory || 'All Products'}
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.sortButton}
              onPress={() => setIsSortVisible(true)}
            >
              <View style={styles.sortIconContainer}>
                <Text style={styles.sortText}>Sort</Text>
                <Svg width="20" height="20" viewBox="0 0 19 19" fill="none">
                  <Path 
                    d="M6.33337 15.8332V7.9165M6.33337 15.8332L3.95837 13.4582M6.33337 15.8332L8.70837 13.4582M12.6667 3.1665V11.0832M12.6667 3.1665L15.0417 5.5415M12.6667 3.1665L10.2917 5.5415" 
                    stroke="black" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setIsFilterVisible(true)}
            >
              <View style={styles.filterIconContainer}> 
                <Text style={styles.filterText}>Filter</Text>
                <Image 
                  source={require('../../assets/product_filter_icon.png')} 
                  style={styles.filterIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          horizontal
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
        />
        
        {filteredProducts.length > 0 ? (
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item._id}
            numColumns={2}
            contentContainerStyle={styles.productList}
            ListHeaderComponent={null}
            ListFooterComponent={null}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
          />
        ) : (
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No products found</Text>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={clearAllFilters}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {renderFilterModal()}
        {renderSortModal()}
        {renderActiveFilterModal()}
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
    marginTop: -30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  filterText: {
    color:'black',
    marginRight: 5,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color:'black',
    // height:19,
    // width:30,
    fontSize: 16,
    lineHeight: 19.2,
    fontFamily:'Gabarito',
    fontWeight:'400',
    // marginLeft: 4,
    marginRight: 9,
    fontFamily: 'Gabarito',
  },
  sortProductsButton:{
    backgroundColor: '#2196F3',
    padding: 15,
    height: 51,
    width: '70%',
    marginLeft: '15%',
    top: '53%',
    borderRadius: 26,
    alignItems: 'center',
    marginTop: 20,
    fontFamily: 'Gabarito',
    color: 'white',
    alignItems: 'center',
  },
  sortProductsButtonText:{
    color: 'white',
    fontWeight: '400',
    fontSize: 16,
    fontFamily: 'Gabarito',
    alignItems: 'center',
    lineHeight: 19.2,
  },
  cancelIconContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryList: {
    paddingHorizontal: 16,
    marginBottom: 0,
    maxHeight: 40,
    marginTop: 10,
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
    backgroundColor: '#2DBDEE',
  },
  categoryText: {
    color: 'black',
    fontWeight: '500',
    fontFamily: 'Gabarito',
  },
  selectedCategoryText: {
    color: 'white',
  },
  productList: {
    paddingHorizontal: 8,
    paddingTop: 16,
    marginTop: 8,
    flexGrow: 1,
    gap: 8,
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
    fontFamily: 'Gabarito',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  productDetails: {
    padding: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    // height: 19,
    color: '#000000',
    lineHeight: 19.2,
    fontFamily: 'Gabarito',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 14.8,
    fontWeight: '400',
    fontFamily: 'Gabarito',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  oldPrice: {
    fontSize: 14,
    color: '#999999',
    lineHeight: 16.8,
    fontWeight: '400',
    textDecorationLine: 'line-through',
    marginRight: 8,
    fontFamily: 'Gabarito',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
    lineHeight: 19.2,
    fontFamily: 'Gabarito',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    color: 'black',
    fontFamily: 'Gabarito',
  },
  addButton: {
    backgroundColor: '#2DBDEE',
    paddingVertical: 8,
    height: 45,
    borderRadius: 25,
    marginBottom: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: 'Gabarito',
  },
  retryButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    fontFamily: 'Gabarito',
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: 'Gabarito',
  },
  filterModal: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    color:'#000000',
    fontWeight: '500',
    fontFamily: 'Gabarito',
    lineHeight: 21.6,
  },
  clearAllText: {
    color: '#29BDEE',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Gabarito',
    lineHeight: 21.6,
  },
  filterOptions: {
    flex: 1,
    color:'black',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color:'black',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterOptionTitle: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Gabarito',
    color:'#000000',
  },
  filterOptionSubtitle: {
    fontSize: 14,
    color: 'black',
    marginTop: 4,
    fontFamily: 'Gabarito',
  },
  clearAllContainer:{
 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  
  },

  headerSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginTop: 15,
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
    fontFamily: 'Gabarito',
  },
  searchInput: {
    flex: 1,
    
    fontSize: 16,
    fontFamily: 'Gabarito',
  },
  searchIcon: {
    marginRight: 5,
  },
  productCard: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 8,
    flex: 1,
  },
  productImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  wishlistIcon: {
    position: 'absolute',
    top: 10,
    left: 3,
    zIndex: 1,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sortHeader:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top',
    padding: 16,
    backgroundColor: 'transparent',
  },
  sortModal: {
    flex: 1,
    alignItems: 'start',
    fontFamily: 'Gabarito',
    backgroundColor: 'white',
    padding: 20,
  },
  cancelIcon:{
   
    fontFamily: 'Gabarito',
  },
  sortTitle: {
    fontSize: 18,
    fontWeight: '600',
    color:'#000000',
    marginBottom: 20,
    lineHeight: 21.6,
    fontFamily: 'Gabarito',
  },
  sortOptionContainer:{
      height: 54,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
  },
  sortOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontFamily: 'Gabarito',
  },
  sortOptionText: {
    lineHeight: 21.6,
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  showProductsButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    width: '80%',
    marginLeft: '10%',
    backgroundColor: '#2DBDEE',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showProductsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  sortIconContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    marginRight: 15,
    height: 31,
    width: 90,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  filterIconContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 14,
    
    height: 31,
    width: 90,
     
    padding: 5,
  },
  colorOption: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedColorOption: {
    backgroundColor: '#e6e6e6',
  },
  applyFilterButton: {
    backgroundColor: '#2DBDEE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 200,
  },
  applyFilterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  slider: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginHorizontal: 15,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#2DBDEE',
    position: 'absolute',
    borderRadius: 3,
  },
  sliderKnob: {
    position: 'absolute',
    top: -17,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#2DBDEE',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    zIndex: 1000,
  },
  cartActionContainer: {
    marginTop: 8,
     
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2DBDEE',
    borderRadius: 25,
    paddingHorizontal: 8,
  },
  quantityButton: {
    padding: 8,
  },
  quantityButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    width: 80,
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  applyButton: {
    backgroundColor: '#2DBDEE',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Gabarito',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  clearText: {
    fontSize: 14,
    color: '#2DBDEE',
    fontWeight: '500',
  },
  priceRangeContainer: {
    padding: 16,
  },
  priceRangeText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
  },
  sliderContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  slider: {
    height: 40,
    position: 'relative',
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#EEEEEE',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sliderFill: {
    height: 2,
    backgroundColor: '#2DBDEE',
    position: 'absolute',
  },
  sliderKnob: {
    position: 'absolute',
    top: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  knobInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2DBDEE',
  },
  showProductsButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    width: '80%',
    marginLeft: '10%',
    backgroundColor: '#2DBDEE',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showProductsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noProductsText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  resetButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    fontFamily: 'Gabarito',
  },
  resetButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: 'Gabarito',
  },
  filterIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});


export default Product;