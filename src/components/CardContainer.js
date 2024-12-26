import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const CardContainer = ({ data = [], navigation, screenType, handleAddToCartFromWishlist, handleRemoveFromWishlist }) => {

    const navigateToProductDetails = (item) => {
        navigation.navigate('/productDetails', {
            id: item.productUuid,
            product: item,
        })
    }

    return (
        <View style={styles.cardContainer}>
            {data?.map((item, i) => {
                return (
                    <TouchableOpacity
                        key={i}
                        style={styles.categoryViewWish}
                        onPress={() => screenType === 'product' ? navigateToProductDetails(item) : () => { }}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ fontSize: 12, marginBottom: 5, color: '#252525', fontWeight: 600 }}>
                                {item?.productName?.slice(0, 14) + '...'}
                            </Text>
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginVertical: 10
                                }}>
                                {item?.imageUrl
                                    ? <Image
                                        source={{ uri: item?.imageUrl }}
                                        style={{ resizeMode: 'contain', width: 110, height: 80 }}
                                    />
                                    : <Image
                                        source={require('../assets/mac.png')}
                                        style={{ resizeMode: 'contain', width: 110, height: 80 }}
                                    />
                                }
                            </View>
                            <Text style={{ fontSize: 10, color: '#A2A3B2', textAlign: 'justify', height: '5rem' }}>
                                {item?.description ? item?.description?.replace(/\s+/g, ' ')?.slice(0, 50) + '...' : null}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                                <Image source={require('../assets/rating_star.png')} style={{ width: 12, height: 12 }} />
                                <Text style={{ marginLeft: 3, fontSize: 12, color: '#3F4343' }}>{item?.overallRating}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 13 }}>
                                <Text style={{ color: '#343A40', fontSize: 12, fontWeight: 600 }}>
                                    {item?.price && item?.price > 0 ? `Rs. ${item?.price}` : null}
                                </Text>
                            </View>
                        </View>
                        {screenType === 'wishlist' ?
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={() => handleAddToCartFromWishlist(item)}
                                    style={{
                                        backgroundColor: "#005FAC",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 20,
                                        paddingVertical: 6,
                                        paddingHorizontal: 30,
                                    }}>
                                    <Text style={{ fontSize: 9, color: "#FFFFFF" }}>
                                        Add To Cart
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleRemoveFromWishlist(item)}
                                    style={{
                                        backgroundColor: "#005FAC",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: 20,
                                        paddingVertical: 6,
                                        paddingHorizontal: 18,
                                    }}>
                                    <Image
                                        source={require('../assets/bin.png')}
                                        style={{ resizeMode: 'contain', width: 13, height: 15 }}
                                    />
                                </TouchableOpacity>
                            </View> : null}
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    categoryViewWish: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 8,
        marginVertical: 5,
        flexDirection: 'column',
        width: '48%'
    },
    cardContainer: {
        flex: 1,
        marginVertical: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default CardContainer;