import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { getMethod } from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import HeaderComponent from '../../components/HeaderComponent';

const Category = () => {
  const navigation = useNavigation();
  const [categoriesList, setCategoriesList] = useState([]);
  const [error, setError] = useState(null);

  const getCategoriesList = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("Token:", token);
      let url = "common/nested/category";   
      let response = await getMethod({ url, token });
      console.log("API Response:", response);
      if (response && response.success) {
        setCategoriesList(response.data);
      } else {
        setError(response.message || "An error occurred while fetching categories");
        console.log("API Error:", response.message);
      }
    } catch (e) {
      setError("An unexpected error occurred");
      console.error('Error fetching categories:', e);
    }
  };

  useEffect(() => {
    getCategoriesList();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <HeaderComponent />
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.categoryItem} 
      onPress={() => navigation.navigate("Product", { 
        categoryId: item._id,
        categoryName: item.name,
        fromScreen: 'Category'
      })}
    >
      <Image source={{ uri: item?.image }} style={styles.categoryImage} />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/Blue-bg.png')}  
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <HeaderComponent />
        <Text style={styles.title}>Categories</Text>
        <FlatList
          data={categoriesList}
          renderItem={renderItem}
          keyExtractor={(item) => item.categoryUuid}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: 'black',
    marginLeft: 10,
  },
  grid: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Category;
