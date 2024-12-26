import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
 

const Header = ({ navigation }) => {
  return (
    <View style={styles.container}>
          <Icon name="qr-code-outline" size={24} color="#888" />
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.iconContainer}>
             <Icon name="search-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Search"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="mic-outline" size={24} color="#000000" fontWeight="bold" />
        </TouchableOpacity>
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 189, 238, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  iconContainer: {
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },
});

export default Header;