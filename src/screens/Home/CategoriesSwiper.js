//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';

const Categories = [
  {
    id: 1,
    name: 'Electronics',
    count: 100,
    image: require('../../assets/category/categoryImg1.png'),
  },
  {
    id: 2,
    name: 'Cloths',
    count: 120,
    image: require('../../assets/category/categoryImg2.png'),
  },
];

const Item = ({name, count, image}) => (
  <View style={styles.item}>
    <View style={{width: '60%', height: '100%', paddingVertical: 10}}>
      <Text style={styles.categoryInsideText}>{name}</Text>
      <Text style={{fontSize: 13, color: 'white'}}>{count} Products</Text>
    </View>
    <View style={{width: '40%', height: '100%',justifyContent:"center"}}>
      <Image source={{uri:image}} style={{resizeMode: 'contain',height:50,width:50}} />
    </View>
  </View>
);
// create a component
const CategoriesSwiper = ({categoriesList}) => {
  const renderItem = ({item,index}) => (
    <Item
      name={item.categoryName}
      count={item?.subCategory?.length > 0 ? item?.subCategory?.length : 0}
      image={item?.image}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categoriesList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  item: {
    backgroundColor: '#658BAA',
    borderRadius: 13,
    padding: 10,
    marginVertical: 8,
    marginRight: 10,
    width: 200,
    height: 100,
    flexDirection: 'row',
  },
  categoryInsideText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});

//make this component available to the app
export default CategoriesSwiper;
