import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMethod } from '../../helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const OrderList = ({ navigation }) => {

    const [orderData, setOrderData] = useState([]);
    const [productNames, setProductNames] = useState({});

    useEffect(() => {
        makeOrderListApi();
    }, []);

    useEffect(() => {
        if (orderData.length > 0) {
            fetchProductNames();
        }
    }, [orderData]);

    const makeOrderListApi = async () => {
        try {
            let url = "customers/secure/myorders";
            let token = await AsyncStorage.getItem("@token");
            let response = await getMethod({ url, token });
            if (response.success) {
                setOrderData(response.data);
            } else {
                setOrderData([]);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const fetchProductNames = async () => {
        const names = {};
        for (const order of orderData) {
            if (order.orderItems && order.orderItems.length > 0) {
                const productId = order.orderItems[0]._id;
                try {
                    // Replace this with your actual API call to fetch product details
                    const productDetails = await fetchProductDetails(productId);
                    names[productId] = productDetails.name;
                } catch (error) {
                    console.error('Error fetching product name:', error);
                    names[productId] = 'Unknown Product';
                }
            }
        }
        setProductNames(names);
    };

    // Mock function to fetch product details - replace with actual API call
    const fetchProductDetails = async (productId) => {
        // Simulating API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ name: `Product ${productId.substr(0, 5)}` });
            }, 100);
        });
    };

    const renderOrderListCard = ({ item }) => {
        const imageUrl = item.orderItems && item.orderItems.length > 0 
            ? item.orderItems[0].imageUrl 
            : null;
        const productName = item.orderItems && item.orderItems.length > 0 
            ? item.orderItems[0].productName 
            : 'Unknown Product';
        const description = item.orderItems && item.orderItems.length > 0 
            ? item.orderItems[0].description 
            : '';

        // Function to handle navigation based on number of items
        const handleOrderPress = () => {
            if (item.orderItems.length > 1) {
                navigation.navigate('OrderItemsList', {
                    orderItems: item.orderItems,
                    orderTotal: item.total,
                    orderDate: item.placedAt,
                    orderStatus: item.status,
                    orderId: item._id
                });
            } else {
                navigation.navigate('OrderDetails', { 
                    orderId: item._id 
                });
            }
        };

        // Function to trim text to 16 characters and add ellipsis
        const trimText = (text) => {
            return text.length > 16 ? text.substring(0, 16) + '...' : text;
        };

        return (
            <TouchableOpacity 
                style={styles.orderItem}
                onPress={handleOrderPress}
            >
                <Image source={{ uri: imageUrl }} style={styles.productImage} />
                <View style={styles.orderDetails}>
                    <Text style={[styles.productName, { fontWeight: 'bold' }]}>{trimText(productName)}</Text>
                    <Text style={styles.orderDescription}>{trimText(description)}</Text>
                    <View style={styles.orderFooter}>
                        <Text style={styles.price}>Rs. {item.total.toFixed(2)}</Text>
                        <Text style={styles.orderedDate}>
                            {item.status === 'delivered' ? 'Delivered on: ' : 'Ordered on: '}
                            {new Date(item.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                           
                        </Text>
                    </View>
                    <View style={styles.separator} />
                    <Text style={styles.invoiceLink}>Invoices, details & more </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const CustomHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search"
                    placeholderTextColor="#999"
                />
                <TouchableOpacity>
                    <Svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <Path d="M7 12C8.66 12 10 10.66 10 9V3C10 1.34 8.66 0 7 0C5.34 0 4 1.34 4 3V9C4 10.66 5.34 12 7 12Z" fill="black"/>
                        <Path d="M12 9C12 11.76 9.76 14 7 14C4.24 14 2 11.76 2 9H0C0 12.53 2.61 15.43 6 15.92V19H8V15.92C11.39 15.43 14 12.53 14 9H12Z" fill="black"/>
                    </Svg>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <LinearGradient
            colors={['#B6E2F3', '#FFFFFF']}
            locations={[0, 0.4]}
            style={styles.container}
        >
            <CustomHeader />
            <View style={styles.contentContainer}>
                <Text style={[styles.orderListText, { fontWeight: 'bold' }]}>My Orders</Text>
                <FlatList
                    data={orderData}
                    renderItem={renderOrderListCard}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.orderList}
                />
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 15,
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
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Gabarito',
    },
    searchIcon: {
        marginRight: 5,
    },
    orderListText: {
        fontFamily: 'Gabarito',
        fontSize: 20,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 10,
    },
    orderList: {
        paddingBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingBottom: 8,
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 5,
        marginRight: 12,
    },
    orderDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    productName: {
        fontFamily: 'Gabarito',
        fontWeight: '500',
        fontSize: 14,
        color: '#101313',
        marginBottom: 4,
    },
    orderDescription: {
        fontFamily: 'Gabarito',
        fontSize: 12,
        color: '#909090',
        marginBottom: 4,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
        marginLeft: 10,
    },
    price: {
        fontFamily: 'Gabarito',
        fontWeight: 'bold',
        fontSize: 14,
        color: '#343A40',
    },
    orderedDate: {
        fontFamily: 'Gabarito',
        fontWeight: 'bold',
        fontSize: 13,
        color: '#00B527',
        marginRight: 50,
    },
    invoiceLink: {
        fontFamily: 'Gabarito',
        fontSize: 15,
        color: '#29BDEE',
        marginTop: 4,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
    },
    arrowIcon: {
        position: 'absolute',
        right: 11,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    // ... other styles ...
});

export default OrderList;
