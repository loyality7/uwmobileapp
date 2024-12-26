import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {getMethod} from '../../helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const CustomHeader = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search"
          placeholderTextColor="#999"
        />
        <TouchableOpacity>
          <Icon name="mic" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
// create a component
const SubCategory = ({navigation, route}) => {
  const {id, category} = route.params;
  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [SubCategoryList, setSubCategoryList] = useState([]);

  const getSubCategoryList = async () => {
    try {
      let url = 'subcategories/get_subcategories';
      let response = await getMethod({url});
      if (response.success) {
        // Filter subcategories based on the categoryUuid
        let filtered = response.data.filter(item => item.categoryUuid === id);
        setSubCategoryList(filtered);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getSubCategoryList();
  }, []);

  return (
    <LinearGradient
      colors={['#2DBDEE', '#E9F0F5']}
      locations={[0, 0.4]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <CustomHeader />
        <Text style={styles.categoryTitle}>{category}</Text>
        <View style={styles.subcategoriesContainer}>
          {SubCategoryList.map((item, i) => (
            <TouchableOpacity
              key={item.subcategoryUuid}
              style={styles.categoryView}
              onPress={() =>
                navigation.navigate('Product', {
                  id: item.subcategoryUuid,
                  subcategory: item.subcategoryName,
                })
              }
            >
              {i % 2 === 0 ? (
                <>
                  <View style={styles.textContainer}>
                    <Text style={styles.subcategoryName}>
                      {item.subcategoryName}
                    </Text>
                    <Text style={styles.productCount}>
                      {item.subcategoryTypes?.length || 0} Types
                    </Text>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{uri: item.imageUrl || 'https://via.placeholder.com/50'}}
                      style={styles.image}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{uri: item.imageUrl || 'https://via.placeholder.com/50'}}
                      style={styles.image}
                    />
                  </View>
                  <View style={[styles.textContainer, {alignItems: 'flex-end'}]}>
                    <Text style={styles.subcategoryName}>
                      {item.subcategoryName}
                    </Text>
                    <Text style={styles.productCount}>
                      {item.subcategoryTypes?.length || 0} Types
                    </Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 10,
  },
  categoryTitle: {
    fontSize: 20,
    marginTop: 10,
    paddingHorizontal: 10,
    color: 'black',
  },
  subcategoriesContainer: {
    marginVertical: 10,
  },
  categoryView: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    height: 110,
    marginVertical: 7,
    flexDirection: 'row',
  },
  textContainer: {
    width: '70%',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcategoryName: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCount: {
    fontSize: 16,
    color: 'black',
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  header: {
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
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
});

//make this component available to the app
export default SubCategory;
