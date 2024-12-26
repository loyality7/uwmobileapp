import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import { PermissionsAndroid, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMethod, putMethod, postMethod } from '../../helpers';

const ChatSupport = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  
  const { complaintId, orderNo } = route.params || {};

  const getComplaintData = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await getMethod({
        url: `customers/secure/complaint/${complaintId}`,
        token
      });
      
      if (response.success) {
        // Transform the chat data to match our UI format
        const formattedChats = response.data.chats.map(chat => ({
          id: chat._id,
          text: chat.message,
          sender: chat.messageByAdmin ? 'support' : 'user',
          timestamp: chat.chatOn,
          type: 'text'
        }));
        
        setMessages(formattedChats);
        setComplaintData(response.data);
      }
    } catch (error) {
      console.error('Error fetching complaint data:', error);
    }
  };

  useEffect(() => {
    if (!complaintId) {
      navigation.replace('AddSupportList');
      return;
    }

    getComplaintData();
    const intervalId = setInterval(() => {
      getComplaintData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [complaintId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await AsyncStorage.getItem('@token');
      const response = await putMethod({
        url: `customers/secure/complaint/${complaintId}`,
        token,
        body: {
          message: newMessage
        }
      });
      
      if (response.success) {
        setNewMessage('');
        getComplaintData(); // Refresh messages after sending
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessage = ({ item }) => (
    <View style={[
      item.sender === 'user' ? styles.userMessage : styles.supportMessage,
      { marginBottom: 8 }
    ]}>
      {item.type === 'text' && (
        <>
          <Text style={styles.messageText}>{item.text}</Text>
          {item.timestamp && (
            <Text style={styles.timestampText}>
              {formatTimestamp(item.timestamp)}
            </Text>
          )}
        </>
      )}
      {item.type === 'image' && <Image source={{ uri: item.uri }} style={styles.messageImage} />}
      {item.type === 'document' && (
        <View style={styles.documentContainer}>
          <Icon name="description" size={24} color="#000" />
          <Text style={styles.documentText}>{item.name}</Text>
        </View>
      )}
    </View>
  );

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs access to your camera to take photos.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleAttachment = async (type) => {
    setShowAttachments(false);

    try {
      let result;
      switch (type) {
        case 'gallery':
          result = await launchImageLibrary({ mediaType: 'photo' });
          if (result.assets && result.assets.length > 0) {
            const newMessage = {
              id: String(messages.length + 1),
              uri: result.assets[0].uri,
              sender: 'user',
              type: 'image'
            };
            setMessages([...messages, newMessage]);
          }
          break;
        case 'camera':
          const hasCameraPermission = await requestCameraPermission();
          if (!hasCameraPermission) {
            console.log('Camera permission denied');
            return;
          }
          result = await launchCamera({
            mediaType: 'photo',
            saveToPhotos: true,
          });
          if (result.assets && result.assets.length > 0) {
            const newMessage = {
              id: String(messages.length + 1),
              uri: result.assets[0].uri,
              sender: 'user',
              type: 'image'
            };
            setMessages([...messages, newMessage]);
          } else if (result.errorCode) {
            console.error('Camera error:', result.errorMessage);
          }
          break;
        case 'document':
          result = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
          });
          const newMessage = {
            id: String(messages.length + 1),
            uri: result[0].uri,
            name: result[0].name,
            sender: 'user',
            type: 'document'
          };
          setMessages([...messages, newMessage]);
          break;
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error picking file:', error);
      }
    }
  };

  const createNewComplaint = async (orderId, productId) => {
    try {
      const url = 'customers/secure/complaint/raise';
      const token = await AsyncStorage.getItem("@token");
      const params = {
        orderId,
        productId,
        subject: 'New Support Request',
        message: 'Initial support request'
      };
      
      const response = await postMethod({ url, token, params });
      
      if (response.success) {
        // Navigate to chat with the new complaint ID
        navigation.navigate('ChatSupport', {
          complaintId: response.data._id,
          orderNo: response.data.complaintNo
        });
      } else {
        console.error('Failed to create complaint:', response.message);
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{orderNo || 'Chat Support'}</Text>
      </View>
      
      {complaintData?.order && (
        <View style={styles.orderInfo}>
          {complaintData.order.orderItems?.[0]?.imageUrl ? (
            <Image 
              source={{ uri: complaintData.order.orderItems[0].imageUrl }} 
              style={styles.productImage} 
            />
          ) : (
            <View style={styles.productImagePlaceholder} />
          )}
          <View>
            <Text style={styles.orderNumber}>
              Order No: {complaintData.order.orderNo || 'N/A'}
            </Text>
            <Text style={styles.productName}>
              {complaintData.order.orderItems?.[0]?.productName || 'Product'}
            </Text>
          </View>
          <TouchableOpacity style={styles.openButton}>
            <Text style={styles.openButtonText}>Open</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.attachButton} 
          onPress={() => setShowAttachments(!showAttachments)}
        >
          <Icon name="add" size={24} color="#888" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type here..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        {newMessage.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Icon name="send" size={24} color="#1E90FF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micButton}>
            <Icon name="mic" size={24} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {showAttachments && (
        <View style={styles.attachmentBar}>
          <TouchableOpacity style={styles.attachmentButton} onPress={() => handleAttachment('gallery')}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" 
                stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z" 
                fill="#4CAF50"/>
              <Path d="M21 15L16 10L5 21" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
            <Text style={styles.attachmentText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachmentButton} onPress={() => handleAttachment('camera')}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" 
                stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" 
                stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
            <Text style={styles.attachmentText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachmentButton} onPress={() => handleAttachment('document')}>
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <Path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" 
                stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M14 2V8H20" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M16 13H8" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M16 17H8" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <Path d="M10 9H9H8" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
            <Text style={styles.attachmentText}>Document</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  productImagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  orderNumber: {
    fontWeight: 'bold',
  },
  productName: {
    color: '#888',
  },
  openButton: {
    marginLeft: 'auto',
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
  },
  openButtonText: {
    color: '#fff',
  },
  messageList: {
    flex: 1,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 12,
    margin: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    padding: 12,
    margin: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  attachButton: {
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 10,
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
  },
  micButton: {
    padding: 10,
  },
  attachmentBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachmentButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentText: {
    marginLeft: 10,
    fontSize: 14,
  },
  attachmentIcon: {
    marginBottom: 5,
  },
  attachmentText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  timestampText: {
    fontSize: 11,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export default ChatSupport;
