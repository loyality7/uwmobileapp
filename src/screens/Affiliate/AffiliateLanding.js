import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import StatusBarManager from '../../components/StatusBarManager';


const AffiliateLanding = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBarManager />
      <View style={styles.topBackground}>
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
                <Text style={styles.amountText}>₹24,800</Text>
                <Text style={styles.subText}>Total Commissions</Text>
              </ImageBackground>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.statusContainer}>
          <View style={styles.statusBox}>
            <View style={styles.statusContent}>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusText}>Status : <Text style={styles.onlineText}>Online</Text></Text>
                <Text style={styles.timeText}>Time before away 12:32:09</Text>
              </View>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../assets/online-icon.png')}
                  style={styles.statusIcon}
                />
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.statusContent}>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusText}>Floating cash : <Text style={styles.cashText}>₹ 1,500</Text></Text>
                <Text style={styles.timeText}>Remaining balance : ₹ 300</Text>
              </View>
              <View style={styles.settleContainer}>
                <Image
                  source={require('../../assets/settle-icon.png')}
                  style={styles.settleIcon}
                />
                <Text style={styles.settleText}>Settle</Text>
              </View>
            </View>
          </View>
        </View>
        
        <LinearGradient
          colors={['#FFF4A7', '#E7D351']}
          style={styles.sellButton}
        >
          <TouchableOpacity onPress={() => navigation.navigate('SaleCard')}>
            <Text style={styles.sellButtonText}>Sell card</Text>
          </TouchableOpacity>
        </LinearGradient>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cards details</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>
                <Icon name="plus-circle" size={16} color="#EB6A36" /> Request cards
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>This shows details of current allocated batch</Text>
          <View style={styles.cardDetails}>
            <View style={styles.cardItem}>
              <Image
                source={require('../../assets/app_page_images/icons8-train-ticket-15001.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardItemText}>Total cards allocated</Text>
              <Text style={styles.cardValue}>500</Text>
            </View>
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => navigation.navigate('CardSold')}
            >
              <Image
                source={require('../../assets/app_page_images/icons8-train-ticket-15001.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardItemText}>Cards sold</Text>
              <Text style={styles.cardValue}>380</Text>
            </TouchableOpacity>
            <View style={styles.cardItem}>
              <Image
                source={require('../../assets/app_page_images/icons8-train-ticket-15001.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardItemText}>Cards pending</Text>
              <Text style={styles.cardValue}>120</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pay settlements</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>
                <Icon name="plus-circle" size={16} color="#EB6A36" /> Request cash
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F3',
    fontFamily: 'Gabarito',
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
    padding: 20,
    marginTop: -50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '400',
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
    color: '#000',
    fontSize: 17,
  },
  amountText: {
    color: '#000',
    fontSize: 40,
    fontWeight: '700',
    marginVertical: 10,
  },
  subText: {
    color: '#000',
    fontSize: 15,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  statusTextContainer: {
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#000',
  },
  onlineText: {
    fontWeight: '600',
    color: '#000000',
  },
  timeText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  cashText: {
    fontWeight: '600',
    color: '#000',
  },
  statusIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  settleContainer: {
    alignItems: 'center',
    width: 40,
  },
  settleIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  settleText: {
    color: '#29BDEE',
    fontSize: 12,
    fontWeight: '500',
  },
  sellButton: {
    backgroundColor: '#E7D351',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  sellButtonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  linkText: {
    color: '#EB6A36',
    fontSize: 16,
  },
  sectionSubtitle: {
    color: '#666',
    marginBottom: 10,
  },
  cardDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cardItemText: {
    flex: 1,
    marginLeft: 10,
    fontWeight: '500',
    fontSize: 16,
  },
  cardValue: {
    fontWeight: '500',
  },
  cardIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  settlementDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  settlementItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
  },
  settlementLabel: {
    color: '#666',
    marginBottom: 5,
  },
  settlementValue: {
    color: '#F69979',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AffiliateLanding;