import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { getMethod, postMethod } from '../../helpers'; 
import LinearGradient from 'react-native-linear-gradient';

const ProductRating = () => {
	const route = useRoute();
	const navigation = useNavigation();
	const { orderId, productId } = route.params;
	const [product, setProduct] = useState(null);
	const [rating, setRating] = useState(0);
	const [review, setReview] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [reviewTitle, setReviewTitle] = useState('');

	useEffect(() => {
		fetchOrderDetails();
	}, []);

	const fetchOrderDetails = async () => {
		try {
			setLoading(true);
			setError(null);
			let url = "customers/secure/myorders";
			let token = await AsyncStorage.getItem("@token");
			console.log("Fetching orders with token:", token);
			let response = await getMethod({ url, token });
			
			console.log("API Response:", JSON.stringify(response, null, 2));

			if (response.success) {
				console.log("Number of orders received:", response.data.length);
				console.log("Looking for orderId:", orderId);
				console.log("Looking for productId:", productId);

				// Find the order that contains the product we're looking for
				const orderWithProduct = response.data.find(order => 
					order.orderItems && order.orderItems.some(item => item._id === productId)
				);

				if (orderWithProduct) {
					const productDetails = orderWithProduct.orderItems.find(item => item._id === productId);
					if (productDetails) {
						console.log("Product found:", productDetails);
						setProduct(productDetails);
					} else {
						console.log("Product not found in the order");
						setError('Product not found in the order');
					}
				} else {
					console.log("Order with the product not found");
					setError('Order with the product not found');
				}
			} else {
				console.log("API call was not successful");
				setError('Failed to fetch order details');
			}
		} catch (e) {
			console.error('Error fetching order details:', e);
			setError('An error occurred while fetching order details');
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitReview = async () => {
		try {
			let url = `customers/secure/ratings/${productId}`; // Updated URL
			let token = await AsyncStorage.getItem("@token");
			let data = { description: review, rating: rating.toString() }; // Ensure rating is a string
			let response = await postMethod({ url, token, data });

			if (response.success) {
				Alert.alert('Success', 'Your review has been submitted successfully!');
				navigation.goBack();
			} else {
				Alert.alert('Error', 'Failed to submit review. Please try again later.');
			}
		} catch (e) {
			console.error('Error submitting review:', e);
			Alert.alert('Error', 'An error occurred while submitting the review');
		}
	};

	const renderStars = () => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<TouchableOpacity key={i} onPress={() => setRating(i)}>
					<Icon
						name={i <= rating ? 'star' : 'star-outline'}
						size={44}
						color="#F8BD00"
					/>
				</TouchableOpacity>
			);
		}
		return stars;
	};

	if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;
	if (error) return <View style={styles.container}><Text>{error}</Text></View>;
	if (!product) return null;

	return (
        <LinearGradient
            colors={['#BFEBFA', '#FFFFFF']}
            locations={[0, 0.5, 0.5]}
            style={styles.container}
        >
			<SafeAreaView style={styles.container}>
				<KeyboardAvoidingView 
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.keyboardAvoidingView}
				>
					<View style={styles.header}>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Icon name="arrow-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text style={styles.headerText}>Write a review</Text>
					</View>

					{/* Product Information */}
					<View style={styles.productInfo}>
						<Image
							source={{ uri: product.imageUrl }} // Ensure you have the image URL
							style={styles.productImage}
						/>
						<View style={styles.productTextContainer}>
							<Text style={styles.productName}>
								{product.productName.length > 12
									? product.productName.substring(0, 12) + '...'
									: product.productName}
							</Text>
							<Text style={styles.productDescription}>
								{product.description.length > 12
									? product.description.substring(0, 12) + '...'
									: product.description}
							</Text>
						</View>
						<View style={styles.productPriceContainer}>
							<Text style={styles.productPrice}>Rs. {product.price}</Text>
							<TouchableOpacity style={styles.shareButton}>
								<Icon name="share-social" size={24} color="#000" />
							</TouchableOpacity>
						</View>
					</View>

					{/* Rating Section */}
					<View style={styles.ratingContainer}>
						<Text style={styles.ratingText}>What's your rating?</Text>
							<View style={styles.starsContainer}>{renderStars()}</View>
					</View>

					{/* Add Photos or Videos */}
					<View style={styles.photoVideoContainer}>
						<Text>Add photos or videos</Text>
						<TouchableOpacity style={styles.photoVideoButton}>
							<Icon name="camera" size={24} color="#000" />
						</TouchableOpacity>
					</View>

					{/* Review Input */}
					<View style={styles.reviewContainer}>
						<TextInput
							style={styles.reviewTitleInput}
							placeholder="Review title"
							value={reviewTitle}
							onChangeText={setReviewTitle}
						/>
						<TextInput
							style={styles.reviewInput}
							multiline
							numberOfLines={4}
							placeholder="Review description"
							value={review}
							onChangeText={setReview}
						/>
					</View>

					{/* Submit Button */}
					<View style={styles.buttonContainer}>
						<TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
							<Text style={styles.submitButtonText}>Submit</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</SafeAreaView>
        </LinearGradient>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	keyboardAvoidingView: {
		flex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		backgroundColor: 'transparent',
	},
	headerText: {
		fontSize: 18,
		fontWeight: 'bold',
        backgroundColor: 'transparent',
		marginLeft: 16,
		fontFamily: 'Gabarito',
		color: '#000',
	},
	productName: {
		fontSize: 18,
		fontWeight: 'bold',
        backgroundColor: 'transparent',
		marginLeft: 36,
		fontFamily: 'Gabarito',
		color: '#000',
	},
	productInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		justifyContent: 'space-between',
		backgroundColor: '#FFFFFF',
		borderRadius: 15,
		marginVertical: 10,
	},
	productTextContainer: {
		flex: 1,
		marginLeft: 16,
	},
	productImage: {
		width: 100, // Adjust size as needed
		height: 100,
		borderRadius: 8,
		marginBottom: 8,
	},
	productDescription: {
		fontSize: 14,
		color: '#666',
		marginLeft: 36,
		marginTop: 8,
		fontFamily: 'Gabarito',
	},
	ratingContainer: {
		marginTop: 16,
		marginLeft: 36,
	},
	ratingText: {
		fontSize: 16,
		fontWeight: 'bold',
		marginBottom: 8,
		fontFamily: 'Gabarito',
		color: '#000',
	},
	starsContainer: {
		flexDirection: 'row',
		height: 40,
	},
	reviewContainer: {
		padding: 16,
		flex: 1,
	},
	reviewInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		height: 300,
		color: '#000',
		width: '96%',
		marginLeft: '2%',
		textAlignVertical: 'top',
		fontFamily: 'Gabarito',
	},
	buttonContainer: {
		padding: 16,
		borderRadius: 20,
	},
	submitButton: {
		backgroundColor: '#2DBDEE',
		padding: 18,
		width: '80%',
		marginLeft: '10%',
		borderRadius: 20,
		alignItems: 'center',
	},
	submitButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		fontFamily: 'Gabarito',
	},
	productPrice: {
		fontSize: 16,
		color: '#000',
		marginTop: 4,
	},
	reviewTitleInput: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 8,
		marginBottom: 8,
		color: '#000',
		width: '96%',
		marginLeft: '2%',
		fontFamily: 'Gabarito',
	},
	photoVideoContainer: {
		alignItems: 'center',
		marginVertical: 16,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8,
		padding: 16,
	},
	photoVideoButton: {
		marginTop: 8,
	},
	shareButton: {
		marginLeft: 8,
		backgroundColor: '#E0F7FA', // Add background color for share button
		padding: 8,
		borderRadius: 16,
	},
	productPriceContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default ProductRating;
