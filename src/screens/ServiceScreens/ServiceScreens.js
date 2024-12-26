import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const createServiceScreen = (serviceName) => {
  return () => (
    <View style={styles.container}>
      <Text style={styles.title}>{serviceName} Home</Text>
      <Text style={styles.description}>Welcome to the {serviceName} service!</Text>
    </View>
  );
};

export const EcommScreen = createServiceScreen('Ecommerce');
export const BrainBoxScreen = createServiceScreen('BrainBox');
export const AgriSureScreen = createServiceScreen('AgriSure');
export const XBOScreen = createServiceScreen('XBO');
export const InfluencersScreen = createServiceScreen('Influencers');
export const PartnersScreen = createServiceScreen('Partners');
export const OfflineSellersScreen = createServiceScreen('Offline Sellers');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});