import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { SvgXml } from 'react-native-svg';

const cardSoldIcon = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#FFA500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1 10H23" stroke="#FFA500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const totalEarningsIcon = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1V23" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const totalCustomersIcon = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="#2196F3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const OnlineAffiliateLanding = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/redbg.png')}
        style={styles.topBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Hello Praha 👋</Text>
            <TouchableOpacity style={styles.monthSelector}>
              <Text style={styles.monthText}>This month</Text>
              <Icon name="chevron-down" size={12} color="#666" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.earningsCard}>
            <ImageBackground
              source={require('../../assets/earningsbg.png')}
              style={styles.earningsBackground}
              resizeMode="cover"
            >
              <Text style={styles.earningsText}>You have earned</Text>
              <Text style={styles.amountText}>₹2,800</Text>
              <Text style={styles.subText}>Total Commissions</Text>
            </ImageBackground>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <ScrollView style={styles.scrollContent}>
        <SafeAreaView>
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.sectionSubtitle}>This shows details of life time sale statistics</Text>
            
            <View style={styles.overviewList}>
              <TouchableOpacity 
                style={styles.overviewItem}
                onPress={() => navigation.navigate('CardsStatus')}
              >
                <SvgXml xml={cardSoldIcon} width={24} height={24} />
                <Text style={styles.overviewItemText}>Cards sold</Text>
                <Text style={styles.overviewItemValue}>850</Text>
                <Icon name="chevron-right" size={16} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.overviewItem}>
                <SvgXml xml={totalEarningsIcon} width={24} height={24} />
                <Text style={styles.overviewItemText}>Total earnings</Text>
                <Text style={styles.overviewItemValue}>₹ 22,600</Text>
                <Icon name="chevron-right" size={16} color="#666" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.overviewItem}>
                <SvgXml xml={totalCustomersIcon} width={24} height={24} />
                <Text style={styles.overviewItemText}>Total customers</Text>
                <Text style={styles.overviewItemValue}>520</Text>
                <Icon name="chevron-right" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pay settlements</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>
                  <Icon name="clock" size={16} color="#EB6A36" /> Request
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>This shows details of life-time sale statistics</Text>
            <View style={styles.settlementDetails}>
              <View style={styles.settlementItem}>
                <Text style={styles.settlementLabel}>Earned</Text>
                <Text style={styles.settlementValue}>₹22,600</Text>
              </View>
              <View style={styles.settlementItem}>
                <Text style={styles.settlementLabel}>Settled</Text>
                <Text style={styles.settlementValue}>₹21,000</Text>
              </View>
              <View style={styles.settlementItem}>
                <Text style={styles.settlementLabel}>Open</Text>
                <Text style={styles.settlementValue}>₹1,600</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F3',
  },
  topBackground: {
    width: '100%',
    height: 300,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: 10, // Reduced padding to extend content
    marginTop: -50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Gabarito',
    fontSize: 24,
    fontWeight: '800',
    color: '#000',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  monthText: {
    fontFamily: 'Gabarito',
    marginRight: 5,
    color: '#666',
  },
  earningsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  earningsBackground: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsText: {
    fontFamily: 'Gabarito',
    color: '#000',
    fontSize: 17,
  },
  amountText: {
    fontFamily: 'Gabarito',
    color: '#000',
    fontSize: 40,
    fontWeight: '700',
    marginVertical: 10,
  },
  subText: {
    fontFamily: 'Gabarito',
    color: '#000',
    fontSize: 15,
  },
  overviewContainer: {
    margin: 10, // Reduced margin to extend content
  },
  sectionTitle: {
    fontFamily: 'Gabarito',
    fontSize: 25,
    fontWeight: '700',
    color: '#00000',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontFamily: 'Gabarito',
    color: '#666',
    marginBottom: 15,
  },
  overviewList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15, // Increased padding for larger overview size
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20, // Increased vertical padding for larger overview size
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  overviewItemText: {
    fontFamily: 'Gabarito',
    flex: 1,
    marginLeft: 20, // Increased left margin for more space
    fontSize: 18, // Increased font size
    color: '#000',
  },
  overviewItemValue: {
    fontFamily: 'Gabarito',
    fontWeight: '600',
    marginRight: 15, // Increased right margin for more space
    color: '#000',
    fontSize: 18, // Increased font size
  },
  sectionContainer: {
    margin: 10, // Reduced margin to extend content
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    fontFamily: 'Gabarito',
    color: '#EB6A36',
    fontSize: 16,
  },
  settlementDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settlementItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
  },
  settlementLabel: {
    fontFamily: 'Gabarito',
    color: '#666',
    marginBottom: 5,
  },
  settlementValue: {
    fontFamily: 'Gabarito',
    color: '#F69979',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default OnlineAffiliateLanding;