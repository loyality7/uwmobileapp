import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMethod } from '../../helpers/index';
import { useNavigation } from '@react-navigation/native';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hubType, setHubType] = useState('');
  const [isHubUser, setIsHubUser] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserProfileAndPosts();
  }, []);

  // Fetch user profile and then posts
  const fetchUserProfileAndPosts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        console.error("No authentication token found.");
        Alert.alert('Error', 'Please login to view your posts');
        return;
      }

      // First get the user profile to determine hubType
      const profileResponse = await getMethod({ 
        url: 'customers/secure/profile', 
        token 
      });

      console.log("Profile Response:", profileResponse);

      // Fix: Correct data access path
      const userProfile = profileResponse?.data?.customer;
      if (!userProfile?.hubUser) {
        setIsHubUser(false);
        setLoading(false);
        return;
      }

      setIsHubUser(true);

      // Determine the hub type (Student, Professional, etc.)
      const userHubType = Object.keys(userProfile.hubUser)[0];
      setHubType(userHubType);

      console.log("User Hub Type:", userHubType);
      console.log("Hub User ID:", userProfile.hubUser[userHubType]);

      // Then fetch posts for this hub type
      const postsResponse = await getMethod({ 
        url: `customers/secure/posts/byme/${userHubType}`, 
        token 
      });

      console.log("Posts Response:", postsResponse);
      
      if (postsResponse?.data) {
        setPosts(postsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // Add navigation handler
  const handleViewPost = (post) => {
    // Add navigation logic here
    console.log("Viewing post:", post._id);
  };

  // Add navigation handler for FAB
  const handleCreatePost = () => {
    navigation.navigate('CreatePost')
  };

  // Add handler for registration
  const handleRegister = () => {
    navigation.navigate('BrainBoxRegistration');
  };

  if (loading) {
    return React.createElement(
      View,
      { style: styles.centerContainer },
      React.createElement(ActivityIndicator, { size: "large", color: "#FFB300" })
    );
  }

  // Modify the return statement to show registration prompt if not hub user
  if (!isHubUser) {
    return React.createElement(
      View,
      { style: styles.centerContainer },
      [
        React.createElement(Text, 
          { style: styles.message },
          "You need to register as a hub user to see your posts"
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: styles.registerButton,
            onPress: handleRegister
          },
          React.createElement(Text, 
            { style: styles.registerButtonText },
            "Register Now"
          )
        )
      ]
    );
  }

  // Add check for empty posts
  if (isHubUser && (!posts || posts.length === 0)) {
    return React.createElement(
      View,
      { style: styles.centerContainer },
      [
        React.createElement(Text, 
          { style: styles.message },
          "You haven't created any posts yet"
        ),
        React.createElement(
          TouchableOpacity,
          {
            style: styles.registerButton,
            onPress: handleCreatePost
          },
          React.createElement(Text, 
            { style: styles.registerButtonText },
            "Create Post"
          )
        )
      ]
    );
  }

  return React.createElement(
    View,
    { style: styles.container },
    [
      // Main ScrollView for content
      React.createElement(
        ScrollView,
        { style: styles.scrollContent },
        [
          React.createElement(
            View,
            { style: styles.header },
            [
              React.createElement(Text, { style: styles.title }, 
                "My Posts"
              ),
              React.createElement(Text, { style: styles.subtitle }, 
                "Explore the creative world"
              )
            ]
          ),
          React.createElement(
            View,
            { style: styles.grid },
            posts.map((post, index) => React.createElement(
              TouchableOpacity,
              { 
                key: post._id || index, 
                style: styles.card,
                onPress: () => handleViewPost(post)
              },
              [
                React.createElement(Image, { 
                  source: { uri: post.image?.[0] || 'default_image_url' },
                  style: styles.image,
                }),
                React.createElement(Text, { style: styles.postTitle }, 
                  post.title || 'Untitled Post'
                ),
                React.createElement(
                  View,
                  { style: styles.priceContainer },
                  [
                    post.discountPrice && React.createElement(Text, 
                      { style: styles.originalPrice }, 
                      `Rs. ${post.price}`
                    ),
                    React.createElement(Text, 
                      { style: styles.price }, 
                      `Rs. ${post.discountPrice || post.price}`
                    )
                  ]
                ),
                React.createElement(
                  TouchableOpacity,
                  { style: styles.viewButton },
                  React.createElement(Text, 
                    { style: styles.viewButtonText }, 
                    "View"
                  )
                )
              ]
            ))
          )
        ]
      ),
      // Floating Action Button
      React.createElement(
        TouchableOpacity,
        {
          style: styles.fab,
          onPress: handleCreatePost
        },
        React.createElement(Text, { style: styles.fabText }, "+")
      )
    ]
  );
};

const additionalStyles = {
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    paddingHorizontal: 20,
  },
  registerButton: {
    backgroundColor: '#FFB300',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
  },
  registerButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  card: {
    width: '48%',
    margin: '1%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  postTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#666',
    marginRight: 8,
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  viewButton: {
    backgroundColor: '#FFB300',
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFB300',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
  },
  ...additionalStyles,
});

export default MyPosts;