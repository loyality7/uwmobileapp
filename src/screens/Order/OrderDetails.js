import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { Svg, Circle, Path, G } from 'react-native-svg';

import { getMethod } from '../../helpers';

const { width } = Dimensions.get('window');

// Utility function to safely access nested properties
const safelyGetValue = (obj, path, defaultValue) => {
    return path.split('.').reduce((acc, key) => 
        (acc && acc[key] !== undefined) ? acc[key] : defaultValue, obj
    );
};

const OrderDetails = ({ navigation }) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const route = useRoute();
    const { orderId } = route.params;
    

    useEffect(() => {
        fetchOrderDetails();
    }, []);

    const fetchOrderDetails = async () => {
        try {
            let url = `customers/secure/myorder/${orderId}`;
            let token = await AsyncStorage.getItem("@token");
            let response = await getMethod({ url, token });
            if (response.success) {
                setOrderDetails(response.data);
            } else {
                console.error("Failed to fetch order details");
                setOrderDetails(null);
            }
        } catch (e) {
            console.error("Error fetching order details:", e);
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    const product = safelyGetValue(orderDetails, 'orderItems.0', {});

    const handleWriteReview = (productId) => {
        navigation.navigate('ProductRating', { productId, orderId });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
            colors={['#B6E2F3', '#e9f0f5']}
            locations={[0, 1]}
                style={styles.gradientHeader}
            >
                <View style={styles.searchContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#000000" />
                    </TouchableOpacity>
                    <View style={styles.searchBar}>
                        <Icon name="search" size={20} color="#757575" style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor="#757575"
                        />
                        <TouchableOpacity>
                        <Icon name="mic" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.title}>Ordered product detail</Text>
            </LinearGradient>
            <ScrollView style={styles.scrollView}>
                <View style={styles.productCard}>
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: safelyGetValue(product, 'imageUrl', '') }} 
                            style={styles.productImage} 
                        />
                    </View>
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>
                            {truncateText(safelyGetValue(product, 'productName', ''), 16)}
                        </Text>
                        <Text style={styles.productDescription}>
                            {truncateText(safelyGetValue(product, 'description', ''), 16)}
                        </Text>
                        <Text style={styles.productPrice}>Rs. {safelyGetValue(product, 'price', 0)}</Text>
                    </View>
                    <TouchableOpacity style={styles.shareButton}>
                        <Icon name="share" size={20} color="#3EC87F" style={styles.shareIcon} />
                    </TouchableOpacity>
                </View>

                <View style={styles.orderInfoCard}>
                    <View style={styles.returnInfoContainer}>
                        <View style={styles.returnIconContainer}>
                            <Svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                                <Path d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z" stroke="#000000" strokeWidth="0.864" strokeLinecap="round" strokeLinejoin="round"/>
                            </Svg>
                        </View>
                        <View style={styles.returnInfoTextContainer}>
                            <View style={styles.returnInfoRow}>
                                <Text style={styles.returnInfoLabel}>Return before</Text>
                                <Text style={styles.returnInfoValue}>
                                    {new Date(safelyGetValue(orderDetails, 'placedAt', '')).toLocaleDateString()}
                                </Text>
                            </View>
                            <Text style={styles.returnInfoSubtext}>7 more days</Text>
                        </View>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.orderTimeline}>
                        <View style={styles.timelineContainer}>
                            <View style={styles.timelineLine} />
                            <Svg width="18" height="19" viewBox="0 0 18 19" style={styles.timelineOval}>
                                <Circle cx="9" cy="9.5" r="8" fill="#00B527" stroke="black" strokeWidth="2"/>
                            </Svg>
                            <Svg width="18" height="19" viewBox="0 0 18 19" style={[styles.timelineOval, styles.timelineOvalBottom]}>
                                <Circle cx="9" cy="9.5" r="8" fill="#00B527" stroke="black" strokeWidth="2"/>
                            </Svg>
                        </View>
                        <View style={styles.timelineInfo}>
                            <View style={styles.orderInfoRow}>
                                <Text style={styles.orderInfoLabel}>Ordered date</Text>
                                <Text style={styles.orderInfoValue}>
                                    {new Date(safelyGetValue(orderDetails, 'placedAt', '')).toLocaleDateString()}
                                </Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.orderInfoRow}>
                                <Text style={styles.orderInfoLabel}>Delivered date</Text>
                                <Text style={styles.orderInfoValue}>N/A</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.seeAllUpdates}>See all updates &gt;</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>How do you feel ?</Text>
                <View style={styles.plainWhiteCard}>
                    <TouchableOpacity style={styles.infoRow} onPress={() => handleWriteReview(product._id)}>
                        <View style={styles.infoRowLeft}>
                            <Svg viewBox="-2.4 -2.4 28.80 28.80" width="24" height="24" fill="none">
                                <Path d="M8 6.00067L21 6.00139M8 12.0007L21 12.0015M8 18.0007L21 18.0015M3.5 6H3.51M3.5 12H3.51M3.5 18H3.51M4 6C4 6.27614 3.77614 6.5 3.5 6.5C3.22386 6.5 3 6.27614 3 6C3 5.72386 3.22386 5.5 3.5 5.5C3.77614 5.5 4 5.72386 4 6ZM4 12C4 12.2761 3.77614 12.5 3.5 12.5C3.22386 12.5 3 12.2761 3 12C3 11.7239 3.22386 11.5 3.5 11.5C3.77614 11.5 4 11.7239 4 12ZM4 18C4 18.2761 3.77614 18.5 3.5 18.5C3.22386 18.5 3 18.2761 3 18C3 17.7239 3.22386 17.5 3.5 17.5C3.77614 17.5 4 17.7239 4 18Z" stroke="#000000" strokeWidth="1.104" strokeLinecap="round" strokeLinejoin="round"/>
                            </Svg>
                            <Text style={styles.infoText}>Write a review</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#000000" />
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity style={styles.infoRow}>
                        <View style={styles.infoRowLeft}>
                            <Svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                                <Path d="M7.2998 5H22L20 12H8.37675M21 16H9L7 3H4M4 8H2M5 11H2M6 14H2M10 20C10 20.5523 9.55228 21 9 21C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19C9.55228 19 10 19.4477 10 20ZM21 20C21 20.5523 20.5523 21 20 21C19.4477 21 19 20.5523 19 20C19 19.4477 19.4477 19 20 19C20.5523 19 21 19.4477 21 20Z" stroke="#000000" strokeWidth="1.032" strokeLinecap="round" strokeLinejoin="round"/>
                            </Svg>
                            <Text style={styles.infoText}>Buy it again</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#000000" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Order info</Text>
                <View style={[styles.plainWhiteCard, styles.moreItemsCard]}>
                    <TouchableOpacity style={styles.infoRow}>
                        <View style={styles.infoRowLeft}>
                            <Icon name="list" size={20} color="#000000" />
                            <Text style={styles.infoText}>More items in this order</Text>
                        </View>
                        <Icon name="chevron-right" size={20} color="#000000" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.plainWhiteCard, styles.deliveryAddressCard]}>
                    <View style={styles.deliveryAddressContainer}>
                        <View style={styles.deliveryAddressHeader}>
                            <Svg width="24" height="24" viewBox="0 0 64 64">
                                <G>
                                    <G>
                                        <Path fill="#ffffff" d="M32,0C18.745,0,8,10.745,8,24c0,5.678,2.502,10.671,5.271,15l17.097,24.156C30.743,63.686,31.352,64,32,64 s1.257-0.314,1.632-0.844L50.729,39C53.375,35.438,56,29.678,56,24C56,10.745,45.255,0,32,0z M48.087,39h-0.01L32,61L15.923,39 h-0.01C13.469,35.469,10,29.799,10,24c0-12.15,9.85-22,22-22s22,9.85,22,22C54,29.799,50.281,35.781,48.087,39z" />
                                        <Path fill="#ffffff" d="M32,14c-5.523,0-10,4.478-10,10s4.477,10,10,10s10-4.478,10-10S37.523,14,32,14z M32,32 c-4.418,0-8-3.582-8-8s3.582-8,8-8s8,3.582,8,8S36.418,32,32,32z" />
                                        <Path fill="#ffffff" d="M32,10c-7.732,0-14,6.268-14,14s6.268,14,14,14s14-6.268,14-14S39.732,10,32,10z M32,36 c-6.627,0-12-5.373-12-12s5.373-12,12-12s12,5.373,12,12S38.627,36,32,36z" />
                                    </G>
                                    <G>
                                        <Path fill="#ff4e33" d="M32,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S38.627,12,32,12z M32,34 c-5.522,0-10-4.477-10-10s4.478-10,10-10s10,4.477,10,10S37.522,34,32,34z" />
                                        <Path fill="#ff4e33" d="M32,2c-12.15,0-22,9.85-22,22c0,5.799,3.469,11.469,5.913,15h0.01L32,61l16.077-22h0.01 C50.281,35.781,54,29.799,54,24C54,11.85,44.15,2,32,2z M32,38c-7.732,0-14-6.268-14-14s6.268-14,14-14s14,6.268,14,14 S39.732,38,32,38z" />
                                    </G>
                                    <Path opacity="0.2" fill="#231F20" d="M32,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S38.627,12,32,12z M32,34 c-5.522,0-10-4.477-10-10s4.478-10,10-10s10,4.477,10,10S37.522,34,32,34z" />
                                </G>
                            </Svg>
                            <Text style={styles.deliveryAddressTitle}>Delivery Address</Text>
                        </View>
                        <Text style={styles.deliveryAddressText}>
                            {safelyGetValue(orderDetails, 'customer.formatted_address_shipping', 'Address not available')}
                        </Text>
                    </View>
                </View>

                {/* Updated Order Summary section */}
                <View style={styles.orderSummaryCard}>
                    <View style={styles.orderSummaryHeader}>
                        <Svg width="24" height="24" viewBox="0 -7.98 48.891 48.891" fill="none">
                            <G transform="translate(-34.49 -234.036)">
                                <Path d="M82.881,234.536H34.99v23.946H82.881V234.536Z" fill="#56ae89" fillRule="evenodd"/>
                                <Path d="M82.881,258.482H34.99v3.991H82.881v-3.991Z" fill="#56ae89" fillRule="evenodd"/>
                                <Path d="M82.881,262.473H34.99v3.991H82.881v-3.991Z" fill="#56ae89" fillRule="evenodd"/>
                                <Path d="M82.881,234.536H34.99v23.946H82.881V234.536Z" fill="#56ae89" fillRule="evenodd"/>
                                <Path d="M42.971,258.482A7.983,7.983,0,0,0,34.99,250.5v7.982Z" fill="#f2f7fd" fillRule="evenodd"/>
                                <Path d="M42.971,234.536a7.983,7.983,0,0,1-7.981,7.982v-7.982Z" fill="#f2f7fd" fillRule="evenodd"/>
                                <Path d="M74.9,258.482a7.982,7.982,0,0,1,7.982-7.982v7.982Z" fill="#f2f7fd" fillRule="evenodd"/>
                                <Path d="M74.9,234.536a7.982,7.982,0,0,0,7.982,7.982v-7.982Z" fill="#f2f7fd" fillRule="evenodd"/>
                                <Path d="M74.9,234.536a7.982,7.982,0,0,0,7.982,7.982v-7.982Zm0,23.946a7.982,7.982,0,0,1,7.982-7.982v7.982ZM42.971,234.536a7.983,7.983,0,0,1-7.981,7.982v-7.982Zm0,23.946A7.983,7.983,0,0,0,34.99,250.5v7.982ZM58.935,250.5v1m0-9.978v1m-2,5.987a2,2,0,1,0,2-2m2-1.995a2,2,0,1,0-2,1.995m23.946-11.973H34.99v23.946H82.881V234.536ZM62.926,266.464H82.881v-3.991H34.99v3.991H54.944m3.492,0h1m23.447-7.982H34.99v3.991H82.881v-3.991Zm0-23.946H34.99v23.946H82.881V234.536Z" fill="none" stroke="#0f0e0b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5"/>
                            </G>
                        </Svg>
                        <Text style={styles.orderSummaryTitle}>Order Summary</Text>
                    </View>
                    <View style={styles.orderSummaryContent}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Item Total</Text>
                            <Text style={styles.summaryValue}>₹{safelyGetValue(orderDetails, 'subTotal', 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery</Text>
                            <Text style={styles.summaryValue}>₹{safelyGetValue(orderDetails, 'charges.0.value', 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tax</Text>
                            <Text style={styles.summaryValue}>₹{safelyGetValue(orderDetails, 'charges.1.value', 0).toFixed(2)}</Text>
                        </View>
                        <View style={[styles.summaryRow, styles.amountPaidRow]}>
                            <Text style={styles.amountPaidLabel}>Amount Paid</Text>
                            <Text style={styles.amountPaidValue}>₹{safelyGetValue(orderDetails, 'total', 0).toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.paymentMethodLabel}>Payment method</Text>
                            <Text style={styles.paymentMethodValue}>{safelyGetValue(orderDetails, 'paymentMode', '')}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Download Invoice</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.supportButton]} onPress={() => navigation.navigate('Support')}>
                        <Icon name="help-circle" size={20} color="#29BDEE" />
                        <Text style={[styles.buttonText, styles.supportButtonText]}>Support</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e9f0f5',
    },
    gradientHeader: {
        paddingTop: 40,
        paddingBottom: 10,
    },
    scrollView: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
    backButton: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 10,
        height: 40,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 15,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginHorizontal: 15,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
        position: 'relative',
        marginBottom: 15, // Add some space below the product card
    },
    imageContainer: {
        width: 105,
        height: 94,
        borderRadius: 10,
        overflow: 'hidden',
        marginRight: 16,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 19,
        color: '#101313',
        marginBottom: 3,
    },
    productDescription: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 17,
        color: '#909090',
        marginBottom: 16,
    },
    productPrice: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 19,
        color: '#343A40',
    },
    shareButton: {
        position: 'absolute',
        width: 82,
        height: 32,
        right: 15,
        top: 15,
        backgroundColor: 'rgba(62, 200, 127, 0.5)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    shareIcon: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    orderInfoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 10, // Reduced from 20 to 10
    },
    returnInfoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    returnIconContainer: {
        marginRight: 15,
        marginTop: 0, // Removed the top margin to align with the text
    },
    returnInfoTextContainer: {
        flex: 1,
    },
    returnInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4, // Add space between the date and "7 more days"
    },
    returnInfoLabel: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        lineHeight: 19,
        color: '#000000',
        fontWeight: 'bold',
    },
    returnInfoValue: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        lineHeight: 19,
        color: '#000000',
        fontWeight: 'bold',
    },
    returnInfoSubtext: {
        fontFamily: 'Gabarito',
        fontSize: 13,
        lineHeight: 16,
        color: '#8D8D95',
        alignSelf: 'flex-end', // Align to the right side
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E5E5',
        marginVertical: 4,
    },
    orderTimeline: {
        flexDirection: 'row',
        marginTop: 10,
    },
    timelineContainer: {
        width: 24, // Increased width to match the cart icon
        alignItems: 'center',
    },
    timelineLine: {
        width: 2,
        height: '100%',
        backgroundColor: '#00B527',
        position: 'absolute',
        left: 11, // Adjusted to center the line
        top: 0,
    },
    timelineOval: {
        position: 'absolute',
        top: 0,
    },
    timelineOvalBottom: {
        top: 'auto',
        bottom: 0,
    },
    timelineInfo: {
        flex: 1,
        marginLeft: 15, // Increased left margin for better alignment
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    orderInfoLabel: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        lineHeight: 19,
        color: '#000000',
        fontWeight: 'bold',
    },
    orderInfoValue: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        lineHeight: 19,
        color: '#000000',
        fontWeight: 'bold',
    },
    seeAllUpdates: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        lineHeight: 19,
        color: '#29BDEE',
        marginTop: 10,
        fontWeight: 'bold',
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        margin: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontFamily: 'Gabarito',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 8,
        marginLeft: 15,
        marginTop: 5, // Reduced from 16 to 10
        marginRight: 15,
    },
    plainWhiteCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 15,
        marginBottom: 10,
    },
    moreItemsCard: {
        marginBottom: 15, // Increased space below "More items in this order"
    },
    deliveryAddressCard: {
        paddingVertical: 12, // Reduced vertical padding
    },
    deliveryAddressContainer: {
        paddingVertical: 0, // Removed vertical padding
        marginBottom: 0, // Removed bottom margin
    },
    deliveryAddressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    deliveryAddressTitle: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 12,
    },
    deliveryAddressText: {
        fontFamily: 'Gabarito',
        fontSize: 14,
        color: '#000000',
        marginLeft: 32,
        lineHeight: 20, // Added line height for better readability
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        color: '#000000',
        marginLeft: 16,
    },
    orderSummaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 15,
        marginBottom: 15,
    },
    orderSummaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    orderSummaryTitle: {
        fontFamily: 'Gabarito',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 12,
    },
    orderSummaryContent: {
        marginTop: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontFamily: 'Gabarito',
        fontSize: 14,
        color: '#8D8D95',
    },
    summaryValue: {
        fontFamily: 'Gabarito',
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
    },
    amountPaidRow: {
        marginTop: 8,
        marginBottom: 4,
    },
    amountPaidLabel: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    amountPaidValue: {
        fontFamily: 'Gabarito',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
    },
    paymentMethodLabel: {
        fontFamily: 'Gabarito',
        fontSize: 14,
        color: '#29BDEE',
    },
    paymentMethodValue: {
        fontFamily: 'Gabarito',
        fontSize: 14,
        color: '#29BDEE',
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginBottom: 20,
        borderRadius: 26,
    },
    button: {
        flex: 1,
        backgroundColor: '#29BDEE',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 8,
    },
    buttonText: {
        fontFamily: 'Gabarito',
        fontSize: 14,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    supportButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 26,
        borderColor: '#29BDEE',
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: 0,
        marginLeft: 8,
    },
    supportButtonText: {
        color: '#29BDEE',
        marginLeft: 8,
    },
});

export default OrderDetails;
