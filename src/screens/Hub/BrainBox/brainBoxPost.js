import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import { getMethod , postMethod} from '../../../helpers/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';

const { width } = Dimensions.get('window');

// Add this function to get coordinates for Indian cities
const getIndianCityCoordinates = (city) => {
  const cityCoordinates = {
    'bengaluru': { lat: '12.9716', lng: '77.5946' },
    'bangalore': { lat: '12.9716', lng: '77.5946' },
    'mumbai': { lat: '19.0760', lng: '72.8777' },
    'delhi': { lat: '28.6139', lng: '77.2090' },
    'chennai': { lat: '13.0827', lng: '80.2707' },
    'hyderabad': { lat: '17.3850', lng: '78.4867' },
    'kolkata': { lat: '22.5726', lng: '88.3639' },
    // Add more cities as needed
  };

  const normalizedCity = city.toLowerCase().trim();
  return cityCoordinates[normalizedCity] || { lat: '12.9716', lng: '77.5946' }; // Default to Bangalore if city not found
};

const BrainBoxPost = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    subCategory1: '',
    postTitle: '',
    postDescription: '',
    price: '',
    // Specifications fields
    variant: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    color: '',
    // Contact details
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    location: '',
  });
  const [files, setFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories1, setSubCategories1] = useState([]);
  const [subCategories2, setSubCategories2] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [specifications, setSpecifications] = useState([
    { id: 1, variable: '', value: '' }
  ]);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("@token");
        if (!token) {
          console.error("No authentication token found.");
          return;
        }

        // Get profile using getMethod helper
        const profileResponse = await getMethod({
          url: 'customers/secure/profile',
          token: token
        });

        console.log("Profile Response:", profileResponse);

        if (profileResponse?.data?.customer?.hubUser?.Student) {
          const studentId = profileResponse.data.customer.hubUser.Student;
          console.log("Found Student ID:", studentId);

          // Set user info
          const userInfoData = {
            hubType: "Student",
            studentId: studentId,
            hubUser: profileResponse.data.customer.userName,
            email: profileResponse.data.customer.email,
            phoneNumber: profileResponse.data.customer.phoneNumber
          };

          setUserInfo(userInfoData);

          // Fetch categories using getMethod
          const categoriesResponse = await getMethod({
            url: `customers/posts/categories/Student`,
            token: token
          });

          console.log("Categories Response:", categoriesResponse);

          if (categoriesResponse?.data) {
            setCategories(categoriesResponse.data);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserInfo:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserInfo();
  }, []);

  // Category change handlers
  const handleCategoryChange = (categoryId) => {
    console.log("Selected category:", categoryId);
    setFormData(prev => ({ ...prev, category: categoryId, subCategory1: '', subCategory2: '' }));
    
    const selectedCategory = categories.find(cat => cat._id === categoryId);
    console.log("Selected category data:", selectedCategory);
    
    if (selectedCategory && selectedCategory.children) {
      setSubCategories1(selectedCategory.children);
      console.log("Set subcategories1:", selectedCategory.children);
    } else {
      setSubCategories1([]);
    }
    setSubCategories2([]);
  };

  const handleSubCategory1Change = (subCategoryId) => {
    setFormData({ ...formData, subCategory1: subCategoryId, subCategory2: '' });
    const selectedCategory = categories.find(cat => cat._id === formData.category);
    const selectedSubCategory = selectedCategory?.children.find(subCat => subCat._id === subCategoryId);
    setSubCategories2(selectedSubCategory ? selectedSubCategory.children : []);
  };

  const handleSubCategory2Change = (subCategoryId) => {
    setFormData({ ...formData, subCategory2: subCategoryId });
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 1,
        multiple: true
      });

      if (!result.didCancel && result.assets) {
        const newFiles = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || 'image.jpg'
        }));
        
        console.log("Selected images:", newFiles);
        setFiles(newFiles);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const renderBasicDetails = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepIndicator}>1 of 4</Text>
        <Text style={styles.stepTitle}>Basic details</Text>
      </View>

      <View style={styles.categorySection}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading categories...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.labelText}>Category</Text>
            <Picker
              selectedValue={formData.category}
              onValueChange={handleCategoryChange}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((category) => (
                <Picker.Item 
                  key={category._id} 
                  label={category.title} 
                  value={category._id}
                />
              ))}
            </Picker>

            {formData.category && (
              <>
                <Text style={styles.labelText}>Sub Category 1</Text>
                <Picker
                  selectedValue={formData.subCategory1}
                  onValueChange={handleSubCategory1Change}
                  style={styles.picker}
                  enabled={!!formData.category}
                >
                  <Picker.Item label="Select Sub Category 1" value="" />
                  {subCategories1.map((subCategory) => (
                    <Picker.Item 
                      key={subCategory._id} 
                      label={subCategory.title} 
                      value={subCategory._id}
                    />
                  ))}
                </Picker>
              </>
            )}

            {formData.subCategory1 && (
              <>
                <Text style={styles.labelText}>Sub Category 2</Text>
                <Picker
                  selectedValue={formData.subCategory2}
                  onValueChange={handleSubCategory2Change}
                  style={styles.picker}
                  enabled={!!formData.subCategory1}
                >
                  <Picker.Item label="Select Sub Category 2" value="" />
                  {subCategories2.map((subCategory) => (
                    <Picker.Item 
                      key={subCategory._id} 
                      label={subCategory.title} 
                      value={subCategory._id}
                    />
                  ))}
                </Picker>
              </>
            )}
          </>
        )}
      </View>

      <TextInput
        style={styles.postTitleInput}
        placeholder="Post Title"
        placeholderTextColor="#666"
        value={formData.postTitle}
        onChangeText={(text) => setFormData({...formData, postTitle: text})}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Post Description"
        placeholderTextColor="#666"
        multiline
        numberOfLines={4}
        value={formData.postDescription}
        onChangeText={(text) => setFormData({...formData, postDescription: text})}
      />

      <TextInput
        style={styles.priceInput}
        placeholder="Price"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.price}
        onChangeText={(text) => setFormData({...formData, price: text})}
      />
      <TextInput
        style={styles.discountPriceInput}
        placeholder="Discount Price"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={formData.discountPrice}
        onChangeText={(text) => setFormData({...formData, discountPrice: text})}
      />
    </View>
  );

  const renderImageUpload = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepIndicator}>2 of 4</Text>
        <Text style={styles.stepTitle}>Images & Videos</Text>
      </View>

      <Text style={styles.uploadCount}>Photos/Videos ({files.length}/9)</Text>

      <View style={styles.imageGridContainer}>
        {/* Upload Button */}
        {files.length < 9 && (
          <TouchableOpacity 
            style={styles.gridUploadButton} 
            onPress={handleImagePick}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
        )}

        {/* Image/Video Grid */}
        {files.map((file, index) => (
          <View key={index} style={styles.gridItemContainer}>
            <Image
              source={{ uri: file.uri }}
              style={styles.gridImage}
            />
            <TouchableOpacity 
              style={styles.removeGridItemButton}
              onPress={() => {
                const newFiles = files.filter((_, i) => i !== index);
                setFiles(newFiles);
              }}
            >
              <Text style={styles.removeGridItemText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  const renderContactDetails = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepIndicator}>3 of 4</Text>
        <Text style={styles.stepTitle}>Contact Details</Text>
      </View>

      <TouchableOpacity 
        style={styles.fillProfileButton}
        onPress={() => {
          
          if (userInfo) {
            setFormData(prev => ({
              ...prev,
              contactName: userInfo.hubUser || '',
              contactEmail: userInfo.email || '',
              contactPhone: userInfo.phoneNumber || ''
            }));
          }
        }}
      >
        <View style={styles.fillProfileIcon}>
          <Text style={styles.fillProfileIconText}>✓</Text>
        </View>
         <Text style={styles.fillProfileText}>Fill from profile</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.contactInput}
        placeholder="Contact name"
        placeholderTextColor="#999"
        value={formData.contactName}
        onChangeText={(text) => setFormData({...formData, contactName: text})}
      />

      <TextInput
        style={styles.contactInput}
        placeholder="Contact email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={formData.contactEmail}
        onChangeText={(text) => setFormData({...formData, contactEmail: text})}
      />

      <TextInput
        style={styles.contactInput}
        placeholder="Contact phone number"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        value={formData.contactPhone}
        onChangeText={(text) => setFormData({...formData, contactPhone: text})}
      />

      <TouchableOpacity 
        style={styles.locationButton}
        onPress={() => {
          // Add location detection logic here
          // You'll need to implement geolocation
        }}
      >
        <Text style={styles.locationButtonText}>
        <Svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path  d="M14.3 7.4847H13.3733C13.2522 6.22441 12.6964 5.04553 11.8011 4.15027C10.9058 3.25501 9.72696 2.69915 8.46667 2.57803V1.65137C8.46667 1.51876 8.41399 1.39158 8.32023 1.29781C8.22646 1.20405 8.09928 1.15137 7.96667 1.15137C7.83406 1.15137 7.70689 1.20405 7.61312 1.29781C7.51935 1.39158 7.46667 1.51876 7.46667 1.65137V2.57803C6.2119 2.7052 5.04014 3.26388 4.15139 4.15872C3.26263 5.05355 2.71195 6.22909 2.59334 7.4847H1.66667C1.60101 7.4847 1.53599 7.49763 1.47533 7.52276C1.41467 7.54789 1.35955 7.58472 1.31312 7.63115C1.26669 7.67758 1.22986 7.7327 1.20473 7.79336C1.1796 7.85402 1.16667 7.91904 1.16667 7.9847C1.16667 8.05036 1.1796 8.11538 1.20473 8.17604C1.22986 8.2367 1.26669 8.29182 1.31312 8.33825C1.35955 8.38468 1.41467 8.42151 1.47533 8.44664C1.53599 8.47177 1.60101 8.4847 1.66667 8.4847H2.59334C2.71445 9.74499 3.27031 10.9239 4.16557 11.8191C5.06084 12.7144 6.23972 13.2703 7.50001 13.3914V14.318C7.50001 14.4506 7.55268 14.5778 7.64645 14.6716C7.74022 14.7654 7.8674 14.818 8.00001 14.818C8.13261 14.818 8.25979 14.7654 8.35356 14.6716C8.44733 14.5778 8.50001 14.4506 8.50001 14.318V13.3914C9.75983 13.269 10.938 12.7128 11.833 11.8177C12.7281 10.9227 13.2843 9.74453 13.4067 8.4847H14.3333C14.399 8.4847 14.464 8.47177 14.5247 8.44664C14.5853 8.42151 14.6405 8.38468 14.6869 8.33825C14.7333 8.29182 14.7702 8.2367 14.7953 8.17604C14.8204 8.11538 14.8333 8.05036 14.8333 7.9847C14.8333 7.91904 14.8204 7.85402 14.7953 7.79336C14.7702 7.7327 14.7333 7.67758 14.6869 7.63115C14.6405 7.58472 14.5853 7.54789 14.5247 7.52276C14.464 7.49763 14.399 7.4847 14.3333 7.4847H14.3ZM7.96667 12.4114C7.09116 12.4114 6.23531 12.1517 5.50735 11.6653C4.77939 11.1789 4.21201 10.4876 3.87697 9.67871C3.54192 8.86984 3.45426 7.97979 3.62506 7.1211C3.79587 6.26241 4.21747 5.47365 4.83655 4.85457C5.45563 4.23549 6.24438 3.81389 7.10307 3.64309C7.96176 3.47229 8.85182 3.55995 9.66068 3.89499C10.4696 4.23004 11.1609 4.79741 11.6473 5.52538C12.1337 6.25334 12.3933 7.10919 12.3933 7.9847C12.3933 9.15934 11.9272 10.286 11.0972 11.1172C10.2672 11.9484 9.14131 12.4163 7.96667 12.418V12.4114Z" fill="black"/>
          <Path d="M10.9867 7.99127C10.9867 8.59018 10.809 9.17561 10.4761 9.67349C10.1432 10.1714 9.67015 10.5593 9.11671 10.7882C8.56327 11.0171 7.95437 11.0766 7.36707 10.9593C6.77978 10.842 6.24049 10.553 5.81747 10.1291C5.39445 9.70513 5.10671 9.1652 4.99068 8.57765C4.87465 7.9901 4.93554 7.38133 5.16564 6.82839C5.39575 6.27546 5.78472 5.80322 6.28333 5.47145C6.78194 5.13968 7.36777 4.96329 7.96667 4.96461C8.36382 4.96461 8.75708 5.04294 9.12392 5.19513C9.49075 5.34731 9.82397 5.57036 10.1045 5.8515C10.385 6.13264 10.6073 6.46635 10.7587 6.83352C10.9101 7.2007 10.9875 7.59412 10.9867 7.99127Z" fill="black"/>
        </Svg>

           Auto detect my location</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.contactInput}
        placeholder="State"
        placeholderTextColor="#999"
        value={formData.state}
        onChangeText={(text) => setFormData({...formData, state: text})}
      />

      <TextInput
        style={styles.contactInput}
        placeholder="City"
        placeholderTextColor="#999"
        value={formData.city}
        onChangeText={(text) => setFormData({...formData, city: text})}
      />

      <TextInput
        style={styles.contactInput}
        placeholder="Locality"
        placeholderTextColor="#999"
        value={formData.location}
        onChangeText={(text) => setFormData({...formData, location: text})}
      />
    </View>
  );

  const addSpecification = () => {
    const newSpec = {
      id: specifications.length + 1,
      key: '',
      value: ''
    };
    setSpecifications([...specifications, newSpec]);
  };

  const removeSpecification = (id) => {
    setSpecifications(specifications.filter(spec => spec.id !== id));
  };

  const renderSpecifications = () => (
    <View style={styles.formContainer}>
      <View style={styles.stepContainer}>
        <Text style={styles.stepIndicator}>4 of 4</Text>
        <Text style={styles.stepTitle}>Specifications</Text>
      </View>
      
      <View style={styles.specList}>
        {specifications.map((spec, index) => (
          <View key={spec.id} style={styles.specRow}>
            <TextInput
              style={styles.specVariableInput}
              placeholder="Variable"
              placeholderTextColor="#666"
              value={spec.variable}
              onChangeText={(text) => {
                const updatedSpecs = [...specifications];
                updatedSpecs[index].variable = text;
                setSpecifications(updatedSpecs);
              }}
            />
            <TextInput
              style={styles.specValueInput}
              placeholder="Value"
              placeholderTextColor="#666"
              value={spec.value}
              onChangeText={(text) => {
                const updatedSpecs = [...specifications];
                updatedSpecs[index].value = text;
                setSpecifications(updatedSpecs);
              }}
            />
            <View style={styles.specButtons}>
              <TouchableOpacity 
                style={styles.specAddButton}
                onPress={addSpecification}
              >
                <Text style={styles.specButtonText}>+</Text>
              </TouchableOpacity>
              {specifications.length > 1 && (
                <TouchableOpacity 
                  style={styles.specRemoveButton}
                  onPress={() => removeSpecification(spec.id)}
                >
                  <Text style={styles.specButtonText}>−</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const handleSubmit = async () => {
    try {
      // Validate required fields first
      if (!formData.category) {
        setError("Please select a category");
        return;
      }
      if (!formData.subCategory1) {
        setError("Please select a sub category");
        return;
      }
      if (!formData.subCategory2) {
        setError("Please select a sub sub category");
        return;
      }
      if (!formData.postTitle?.trim()) {
        setError("Please enter a title");
        return;
      }
      if (!formData.postDescription?.trim()) {
        setError("Please enter a description");
        return;
      }
      if (!files || files.length === 0) {
        setError("Please upload at least one image");
        return;
      }

      const token = await AsyncStorage.getItem("@token");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const coordinates = getIndianCityCoordinates(formData.city);
      
      // Format specifications
      const formattedSpecs = {};
      specifications.forEach(spec => {
        if (spec.variable && spec.value) {
          formattedSpecs[spec.variable] = spec.value;
        }
      });

      // Create request payload
      const requestPayload = {
        category: formData.category,
        subcategory: formData.subCategory1,
        subsubcategory: formData.subCategory2,
        title: formData.postTitle.trim(),
        description: formData.postDescription.trim(),
        image: files.map(file => file.uri),
        specifications: formattedSpecs,
        price: formData.price,
        discountedPrice: formData.discountPrice || "",
        otherInfo: "",
        hubType: "Student",
        lat: coordinates.lat,
        lng: coordinates.lng,
        areaName: formData.location?.trim(),
        city: formData.city?.trim(),
        state: formData.state?.trim(),
        country: "India",
        formatted_address: `${formData.location}, ${formData.city}, ${formData.state}`.trim(),
        contact: {
          name: formData.contactName || userInfo?.hubUser,
          phone: formData.contactPhone || userInfo?.phoneNumber,
          email: formData.contactEmail || userInfo?.email
        }
      };

      // Use postMethod helper
      const response = await postMethod({
        url: 'customers/secure/posts/new',
        token: token,
        payload: requestPayload
      });

      console.log("Submit response:", response);

      if (response.success) {
        Alert.alert(
          "Success",
          "Post created successfully!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        const errorMessage = response.fields
          ?.map(field => `${field.field}: ${field.message}`)
          .join('\n');
        Alert.alert("Error", errorMessage || response.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "Error",
        "Failed to submit form. Please try again."
      );
    }
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={() => currentStep > 1 && setCurrentStep(currentStep - 1)}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => {
          if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
          } else {
            handleSubmit(); // Submit on last step
          }
        }}>
        <Text style={styles.nextButtonText}>
          {currentStep === 4 ? 'Submit' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Add this debug function
  const checkToken = async () => {
    const token = await AsyncStorage.getItem("@token");
    console.log("Stored token:", token);
  };

  // Call it in useEffect
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>
          <Svg width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path d="M0.988281 9.53906C0.988281 9.24609 1.11719 8.97656 1.35156 8.75391L9.10938 1.00781C9.36719 0.75 9.61328 0.65625 9.89453 0.65625C10.4688 0.65625 10.9258 1.07812 10.9258 1.66406C10.9258 1.94531 10.8203 2.21484 10.6328 2.40234L8.00781 5.07422L4.07031 8.67188L6.89453 8.49609H21.7188C22.3281 8.49609 22.75 8.92969 22.75 9.53906C22.75 10.1484 22.3281 10.582 21.7188 10.582H6.89453L4.05859 10.4062L8.00781 14.0039L10.6328 16.6758C10.8203 16.8516 10.9258 17.1328 10.9258 17.4141C10.9258 18 10.4688 18.4219 9.89453 18.4219C9.61328 18.4219 9.36719 18.3164 9.13281 18.0938L1.35156 10.3242C1.11719 10.1016 0.988281 9.83203 0.988281 9.53906Z" fill="black"/>
          </Svg>
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Post</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {currentStep === 1 && renderBasicDetails()}
        {currentStep === 2 && renderImageUpload()}
        {currentStep === 3 && renderContactDetails()}
        {currentStep === 4 && renderSpecifications()}
      </ScrollView>

      {renderFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  stepIndicator: {
    fontSize: 20,
    color: '#00000080',
    height: 80,
    width: 80,
    marginBottom: 8,
    borderWidth: 8,
    borderColor: '#C6C4C4',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 50,
    padding: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 24,
    lineHeight: 24,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#666',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#0000004D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  postTitleInput: {
    borderBottomWidth: 1,
    borderColor: '#0000004D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  priceInput: {
    borderBottomWidth: 1,
    borderColor: '#0000004D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  discountPriceInput: {
    borderBottomWidth: 1,
    borderColor: '#0000004D',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  specInput: {
    width: (width - 44) / 2,  
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#F8BD00',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#F8BD00',
    fontSize: 16,
  },
  nextButton: {
    flex: 1,
    padding: 16,
    borderRadius: 26,
    backgroundColor: '#F8BD00',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  picker: {
    // borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    // backgroundColor: '#fff',
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 10,
    color: 'red',
  },
  debugText: {
    marginVertical: 10,
    color: '#666',
    fontSize: 12,
  },
  imageUploadContainer: {
    marginVertical: 16,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  uploadSubText: {
    fontSize: 12,
    color: '#999',
  },
  imagePreviewScroll: {
    marginTop: 16,
  },
  imagePreviewContainer: {
    marginRight: 8,
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContainer: {
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  
  stepTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000000',
    lineHeight: 24,
  },
  uploadCount: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: '#000',
  },

  imageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  gridUploadButton: {
    width: (width - 48) / 3,  
    height: (width - 48) / 3,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  plusIcon: {
    fontSize: 32,
    color: '#666',
  },

  gridItemContainer: {
    width: (width - 48) / 3,
    height: (width - 48) / 3,
    position: 'relative',
  },

  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  removeGridItemButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ff4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  removeGridItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  fillProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    left:235,
    gap: 8,
  },
  fillProfileIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillProfileIconText: {
    color: '#FFF',
    fontSize: 12,
    
    fontWeight: 'bold',
  },
  fillProfileText: {
    color: '#666',
    fontSize: 14,
   
  },
  contactInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 12,
    width: '90%',
    marginLeft: '5%',
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
  locationButton: {
    backgroundColor: '#F8BD0080',
    padding: 16,
    borderRadius: 8,
    width: '70%',
    marginLeft: '15%',
    alignItems: 'center',
    marginVertical: 16,
  },
  locationButtonText: {
    color: '#000',
    fontFamily: 'Gabarito',
    alignItems:'center',
    display: 'flex',
     
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 19.2,
  },
  specList: {
    paddingHorizontal: 16,
  },
  specRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  specVariableInput: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  specValueInput: {
    flex: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingVertical: 8,
    fontSize: 16,
    color: '#000',
  },
  specButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  specAddButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD60A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specRemoveButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD60A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    lineHeight: 24,
  },
  categorySection: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    marginLeft: 4,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
});

export default BrainBoxPost;