import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Text, StatusBar } from 'react-native';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMethod, postMethod } from '../../helpers/index';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderComponent from '../../components/HeaderComponent';
import LinearGradient from 'react-native-linear-gradient';

const SupportTicket = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [tickets, setTickets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('@token');
      if (token) {
        setIsLoggedIn(true);
        fetchOrders(token);
        fetchTickets(token);
      } else {
        setIsLoggedIn(false);
        Alert.alert('Login Required', 'Please log in to access support tickets.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const fetchOrders = async (token) => {
    try {
      const response = await getMethod({
        url: 'customers/secure/myorders',
        token: token
      });

      if (response.success) {
        setOrders(response.data.map(order => ({
          label: `${order.orderNo} - ${order.orderItems[0]?.productName || 'Unknown Product'}`,
          orderId: order._id,
          productId: order.orderItems[0]?.product
        })));
      } else {
        throw new Error(response.error || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'An error occurred while fetching orders. Please try again.');
    }
  };

  const fetchTickets = async (token) => {
    try {
      const response = await getMethod({
        url: 'customers/secure/complaints',
        token: token
      });

      if (response.success) {
        setTickets(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      Alert.alert('Error', 'Failed to load support tickets');
    }
  };

  const handleSubmit = async () => {
    if (!selectedOrder || !message || !subject) {
      Alert.alert('Error', 'Please select an order, enter a subject, and enter a message.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        Alert.alert('Error', 'You are not logged in. Please log in and try again.');
        return;
      }

      // Create the request payload
      const payload = {
        message: message,
        subject: subject
      };

      console.log('Request body:', JSON.stringify(payload));

      const response = await postMethod({
        url: `customers/secure/complaint/raise/${selectedOrder.orderId}/${selectedOrder.productId}`,
        token: token,
        payload: payload  // Changed to 'payload' to match the postMethod implementation
      });

      if (response.success) {
        Alert.alert('Success', 'Support ticket submitted successfully!');
        fetchTickets(token);
        setShowForm(false);
        setMessage('');
        setSubject('');
        setSelectedOrder(null);
      } else {
        Alert.alert('Error', response.message || 'Failed to submit support ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      Alert.alert('Error', 'An error occurred while submitting the ticket. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return '#FFA500'; // Orange
      case 'closed':
        return '#4CAF50'; // Green
      case 'in progress':
        return '#2196F3'; // Blue
      default:
        return '#757575'; // Grey
    }
  };

  if (!isLoggedIn) {
    return (
      <LinearGradient
        colors={['#B6E2F3', '#FFFFFF']}
        locations={[0, 0.4]}
        style={styles.container}
      >
        <StatusBar backgroundColor="#B6E2F3" barStyle="dark-content" translucent={true} />
        <View style={styles.container}>
          <Text style={styles.title}>Support Ticket</Text>
          <View style={styles.loginContainer}>
            <Text style={styles.loginMessage}>Please log in to submit a support ticket</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#B6E2F3', '#FFFFFF']}
      locations={[0, 0.4]}
      style={styles.container}
    >
      <StatusBar backgroundColor="#B6E2F3" barStyle="dark-content" translucent={true} />
      <View style={styles.container}>
        <HeaderComponent 
          title="Support"
          onPress={() => navigation.goBack()}
        />
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.addButtonText}>
            {showForm ? '- Close Form' : '+ New Ticket'}
          </Text>
        </TouchableOpacity>

        {showForm ? (
          <ScrollView>
            <View style={styles.supportContainer}>
              <Text style={styles.sectionTitle}>Create Support Ticket</Text>
              <SelectDropdown
                data={orders}
                onSelect={(selectedItem) => setSelectedOrder(selectedItem)}
                defaultButtonText={'Select Order'}
                buttonTextAfterSelection={(selectedItem) => selectedItem.label}
                rowTextForSelection={(item) => item.label}
                renderDropdownIcon={(isOpened) => (
                  <Icon name={`keyboard-arrow-${isOpened ? 'up' : 'down'}`} size={24} color="#C6C6C8" />
                )}
                buttonStyle={styles.dropdownButton}
                buttonTextStyle={styles.dropdownButtonText}
              />
              <TextInput
                label="Subject"
                mode="outlined"
                value={subject}
                onChangeText={setSubject}
                style={styles.textInput}
                placeholder='Enter ticket subject'
              />
              <TextInput
                label="Message"
                mode="outlined"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                style={styles.textInput}
                placeholder='Describe your issue here'
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Ticket</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <ScrollView>
            <Text style={styles.sectionTitle}>Support Tickets</Text>
            {tickets.map((ticket) => (
              <TouchableOpacity
                key={ticket._id}
                style={styles.ticketCard}
                onPress={() => navigation.navigate('ChatSupport', {
                  complaintId: ticket._id,
                  orderNo: ticket.complaintNo
                })}
              >
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketNumber}>Ticket #{ticket.complaintNo}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.complaintStatus) }]}>
                    <Text style={styles.statusText}>{ticket.complaintStatus}</Text>
                  </View>
                </View>
                <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                <Text style={styles.ticketDate}>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginLeft: 14,
    fontSize: 25,
    fontWeight: '500',
    lineHeight: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  supportContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 14,
    marginVertical: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 14,
  },
  dropdownButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#C6C6C8',
    marginBottom: 16,
  },
  dropdownButtonText: {
    color: '#000',
    textAlign: 'left',
    fontSize: 16,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    width: 200,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    margin: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 14,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
  },
  ticketNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ticketSubject: {
    fontSize: 14,
    marginBottom: 4,
  },
  ticketStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: '#999',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SupportTicket;