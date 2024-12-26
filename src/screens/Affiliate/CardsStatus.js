import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import OnlineAffiliateTabNavigation from '../../navigation/OnlineAffiliateTabNavigation';

const CardsStats = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [100, 50, 200, 250, 100, 50, 20]
    }]
  };

  const saleDistribution = [
    { platform: 'Facebook', value: 90, icon: 'facebook' },
    { platform: 'Instagram', value: 340, icon: require('../../assets/instagram-icon.png') },
    { platform: 'Twitter / x', value: 220, icon: require('../../assets/twitter-icon.png') },
    { platform: 'YouTube', value: 295, icon: 'youtube' },
  
  ];
  

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFC5B1', '#E9F0F5']}
        locations={[0, 0.15]}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Cards Stats</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.chartContainer}>
            <BarChart
              data={chartData}
              width={300}
              height={200}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 100) => `rgba(71, 95, 132, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Sale distribution</Text>
          <View style={styles.distributionContainer}>
            {saleDistribution.map((item, index) => (
              <View key={index} style={styles.distributionItem}>
                <View style={styles.platformInfo}>
                  {typeof item.icon === 'string' ? (
                    <Icon name={item.icon} size={24} color={getPlatformColor(item.platform)} style={styles.platformIcon} />
                  ) : (
                    <Image source={item.icon} style={styles.platformIcon} />
                  )}
                  <Text style={styles.platformText}>{item.platform}</Text>
                </View>
                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>{item.value}</Text>
                  <Icon name="chevron-right" size={24} color="#000" />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
      <View style={styles.tabNavigationContainer}>
        <OnlineAffiliateTabNavigation />
      </View>
    </View>
  );
};

const getPlatformColor = (platform) => {
  switch (platform) {
    case 'Facebook': return '#1e88e5';
    case 'YouTube': return '#f44336';
    default: return '#757575';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: '600',
    marginLeft: 20,
    lineHeight: 48,
    fontFamily: "Gabarito",
    color: 'black',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  distributionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distributionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  platformText: {
    fontSize: 16,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  tabNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
  gradientContainer: {
    flex: 1,
  },
});

export default CardsStats;