//import liraries
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet,ScrollView, Image} from 'react-native';
import {Searchbar} from 'react-native-paper';
// import { useSelector } from 'react-redux';
import { getMethod } from '../../helpers';
import CategoriesSwiper from './CategoriesSwiper';
import OfferCarousel from './OfferCarousel';
import PoolsListing from './PoolsListing';

// create a component
const Home = ({navigation}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = query => setSearchQuery(query);
  const [categoriesList,setcategoriesList] = useState([])
  // const UserToken = useSelector(state => state.data.token);

  const getCategoriesList = async()=>{
    try{
        let url = "common/categories";
        let token = "";
        let response = await getMethod({ url,token });
       
        if(response.success){
          setcategoriesList(response.data)
        }
    }catch(e){
        console.log(e)
    }
  }
  useEffect(()=>{
    getCategoriesList()
  },[])
  return (
    <ScrollView style={styles.container}>
       
      <View style={styles.firstBox}>
        <View style={styles.leftBox}>
          <Text style={styles.firstBoxText}>Buy Coupons</Text>
        </View>
        <View style={styles.rightBox}>
          <Text style={styles.firstBoxText}>Winners List</Text>
          <Image
              source={require('../../assets/winner.png')}
              style={{resizeMode: 'contain',marginLeft:3}}
            />
        </View>
      </View>
      <View style={styles.offerBox}>
        <Text style={{color: '#2C80C5', fontSize: 22, fontWeight: 'bold'}}>
          Offers
        </Text>
        <OfferCarousel />
      </View>
      <View style={styles.categoryBox}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: '#2C80C5', fontSize: 22, fontWeight: 'bold'}}>
            Categories
          </Text>
          <Text onPress={()=> navigation.navigate("/category")} style={{color: 'black', fontSize: 14}}>View All</Text>
        </View>
        <CategoriesSwiper categoriesList={categoriesList}/>
      </View>
      <View style={styles.categoryBox}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{color: '#2C80C5', fontSize: 22, fontWeight: 'bold'}}>
            Pools
          </Text>
          <Text style={{color: 'black', fontSize: 14}}>View All</Text>
        </View>
        <PoolsListing/>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  firstBox: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    paddingVertical: 2,
  },
  firstBoxText: {
    color: 'white',
    fontSize: 18,
  },
  offerBox: {
    // backgroundColor:"red",
    height:200
  },
  categoryBox: {
    height:150,
    // backgroundColor:"black",
  },
  leftBox: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005FAC',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
  rightBox: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005FAC',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
  },
});

//make this component available to the app
export default Home;
