import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const OrderItemsList = ({ route, navigation }) => {
    const { orderItems, orderTotal, orderDate, orderStatus, orderId } = route.params;

    // Function to trim text
    const trimText = (text) => {
        return text.length > 16 ? text.substring(0, 16) + '...' : text;
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.orderItem}
            onPress={() => navigation.navigate('OrderDetails', { orderId: orderId })}
        >
            <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.productImage} 
            />
            <View style={styles.orderDetails}>
                <Text style={[styles.productName, { fontWeight: 'bold' }]}>
                    {trimText(item.productName)}
                </Text>
                <Text style={styles.orderDescription}>
                    {trimText(item.description)}
                </Text>
                <View style={styles.orderFooter}>
                    <Text style={styles.price}>Rs. {item.price.toFixed(2)}</Text>
                    <Text style={styles.orderedDate}>
                        {orderStatus === 'delivered' ? 'Delivered on: ' : 'Ordered on: '}
                        {new Date(orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </Text>
                </View>
                <View style={styles.separator} />
                <Text style={styles.invoiceLink}>Invoices, details & more</Text>
            </View>
        </TouchableOpacity>
    );

    const CustomHeader = ({ navigation }) => (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search"
                    placeholderTextColor="#999"
                />
                <TouchableOpacity>
                    <Svg width="14" height="19" viewBox="0 0 14 19" fill="none">
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
            <CustomHeader navigation={navigation} />
            <View style={styles.contentContainer}>
                <Text style={[styles.orderListText, { fontWeight: 'bold' }]}>Order Items</Text>
                <FlatList
                    data={orderItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
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
});

export default OrderItemsList;