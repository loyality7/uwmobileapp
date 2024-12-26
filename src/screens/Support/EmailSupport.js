import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from 'react-redux';

const CustomHeader = () => {
    const navigation = useNavigation();
    return (
      <View style={styles.headerSearch}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Image source={require('../../assets/search.png')} style={styles.searchIcon} />
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

const EmailSupport = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth?.user);
  console.log(user);
  const [subject, setSubject] = useState('');
  const [issue, setIssue] = useState('');

  const name = user?.name || 'NA';
  const email = user?.email || 'NA';

  const handleSendMail = () => {
    console.log('Sending mail:', { name, email, subject, issue });
    navigation.goBack();
  };

  return (
    <LinearGradient colors={['#2DBDEE', '#FFFFFF']} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <CustomHeader />

        <Text style={styles.title}>Support</Text>
        <View style={styles.card}>
                <View style={styles.cardContent}>
                    <Image
                        source={require('../../assets/App_icon_1.png')} 
                        style={styles.logo}
                    />
                    <View style={styles.cardTextContainer}>
                        <Text style={styles.cardTitle}>UrbanWallah Care 
                            <Svg width="15" height="15" marginTop="4" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <Path d="M7.28516 14.126C6.3099 14.126 5.39616 13.9414 4.54395 13.5723C3.69173 13.2077 2.94206 12.7018 2.29492 12.0547C1.64779 11.4076 1.13965 10.6579 0.770508 9.80566C0.405924 8.95345 0.223633 8.03971 0.223633 7.06445C0.223633 6.08919 0.405924 5.17546 0.770508 4.32324C1.13965 3.46647 1.64779 2.7168 2.29492 2.07422C2.94206 1.42708 3.69173 0.921224 4.54395 0.556641C5.39616 0.1875 6.3099 0.00292969 7.28516 0.00292969C8.26042 0.00292969 9.17415 0.1875 10.0264 0.556641C10.8831 0.921224 11.6351 1.42708 12.2822 2.07422C12.9294 2.7168 13.4352 3.46647 13.7998 4.32324C14.1689 5.17546 14.3535 6.08919 14.3535 7.06445C14.3535 8.03971 14.1689 8.95345 13.7998 9.80566C13.4352 10.6579 12.9294 11.4076 12.2822 12.0547C11.6351 12.7018 10.8831 13.2077 10.0264 13.5723C9.17415 13.9414 8.26042 14.126 7.28516 14.126ZM6.52637 10.4346C6.65397 10.4346 6.77018 10.4049 6.875 10.3457C6.98438 10.2865 7.08008 10.1976 7.16211 10.0791L10.3613 5.08887C10.4069 5.01595 10.4479 4.93848 10.4844 4.85645C10.5208 4.76986 10.5391 4.68783 10.5391 4.61035C10.5391 4.43262 10.4707 4.28906 10.334 4.17969C10.2018 4.07031 10.0514 4.01562 9.88281 4.01562C9.65951 4.01562 9.47493 4.13411 9.3291 4.37109L6.49902 8.89648L5.18652 7.22852C5.09538 7.11458 5.00651 7.03483 4.91992 6.98926C4.83333 6.94368 4.73535 6.9209 4.62598 6.9209C4.4528 6.9209 4.30469 6.9847 4.18164 7.1123C4.06315 7.23535 4.00391 7.38346 4.00391 7.55664C4.00391 7.64323 4.01986 7.72754 4.05176 7.80957C4.08366 7.8916 4.12923 7.97135 4.18848 8.04883L5.86328 10.0859C5.96354 10.209 6.06608 10.2979 6.1709 10.3525C6.27572 10.4072 6.39421 10.4346 6.52637 10.4346Z" fill="#706EFD"/>
                            </Svg>
                        </Text>
                        <Text style={styles.cardSubtitle}>The trustable ecommerce platform</Text>
                    </View>
                </View>
                <View style={styles.verifiedBadge}>
                  
                </View>
            </View>
          <Text style={styles.EmailTitle}>Email us</Text>
        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name : {name}</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email : {email}</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Required"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Describe your issue</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={issue}
              onChangeText={setIssue}
              placeholder="Required"
              multiline
              numberOfLines={4}
            />
          </View>
          
        </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMail}>
            <Text style={styles.sendButtonText}>Send mail</Text>
          </TouchableOpacity>
          
          <Text style={styles.note}>
            You will receive a response within 12 hours from our UrbanWallah Care team
          </Text>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  EmailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#0099ff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },

  headerSearch: {
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
    fontFamily: 'Gabarito',
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: 'Gabarito',
  },
  searchIcon: {
    marginRight: 5,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 18,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
},
cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
},
logo: {
    width: 69,
    height: 69,
    borderRadius: 20,
    marginRight: 15,
    marginLeft: 15,
},
cardTextContainer: {
    flexDirection: 'column',
},
cardTitle: {
    fontSize: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: '#333',
},
cardSubtitle: {
    fontSize: 12,
    color: '#909090',
    fontFamily: 'Gabarito',
    fontWeight: '500',
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 18,
    color:'black',
    fontFamily: 'Gabarito',
    marginBottom: 20,
},
});

export default EmailSupport;
