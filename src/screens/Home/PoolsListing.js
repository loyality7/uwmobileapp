//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import AppStyles from '../../styles/Styles';

// create a component
const PoolsListing = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.poolsBox}>
        <View style={styles.poolsImg}>
        <Image
              source={require('../../assets/pools/poolImg1.png')}
              style={{resizeMode: 'contain'}}
            />
        </View>
        <View style={styles.poolsContent}>
          <Text style={{fontSize: 18, fontWeight: 'bold',color: 'black'}}>Pool Name</Text>
          <Text style={{fontSize: 12,color: 'black'}}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry
          </Text>
          <Text style={{fontSize: 16, fontWeight: 'bold',color: 'black'}}>
            Price Wroth : 10,000
          </Text>
        </View>
        <View style={styles.poolsButton}>
        <TouchableOpacity style={{...AppStyles.authButton,height:30,width:"100%"}}>
              <Text style={{fontFamily: 'Inter-Bold', color: 'white'}}>
                Enroll
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // height:150,
    // backgroundColor:"red"
  },
  poolsBox: {
    borderColor: 'black',
    borderWidth: 0.5,
    height: 100,
    borderRadius: 15,
    marginTop: 5,
    padding: 5,
    flexDirection: 'row',
  },
  poolsImg: {
    width: '20%',
    height: '100%',
    flexDirection:"row",
    alignItems:"center"
  },
  poolsContent: {
    width: '60%',
    height: '100%',
  },
  poolsButton: {
    width: '20%',
    height: '100%',
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center"
  },
});

//make this component available to the app
export default PoolsListing;
