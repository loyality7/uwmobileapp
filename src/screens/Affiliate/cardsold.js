import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import AffiliateTabNavigation from '../../navigation/AffiliateTabNavigation';
import Icon from 'react-native-vector-icons/Feather';

const barcodeXml = `
<svg width="250" height="96" viewBox="0 0 250 96" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="250" height="96" fill="url(#pattern0_237_2925)"/>
<defs>
<pattern id="pattern0_237_2925" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_237_2925" transform="matrix(0.00213205 0 0 0.0055522 -0.1 -0.119783)"/>
</pattern>
<image id="image0_237_2925" width="621" height="212" xlink:href="data:image/png;base64,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"/>
</defs>
</svg>

`;

const flashlightXml = `
<svg width="11" height="24" viewBox="0 0 11 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.490234 2.66211V2.33008C0.490234 1.03125 1.11523 0.40625 2.36523 0.40625H8.18555C9.43555 0.40625 10.0703 1.03125 10.0703 2.33008V2.66211H0.490234ZM4.36719 23.4922C3.13672 23.4922 2.48242 22.8379 2.48242 21.5684V10.2402C2.48242 9.15625 2.23828 8.42383 1.84766 7.81836L1.29102 6.94922C0.8125 6.19727 0.490234 5.55273 0.490234 4.68359V3.79492H10.0703V4.68359C10.0703 5.55273 9.74805 6.19727 9.26953 6.94922L8.71289 7.81836C8.32227 8.42383 8.07812 9.15625 8.07812 10.2402V21.5684C8.07812 22.8379 7.42383 23.4922 6.19336 23.4922H4.36719ZM3.55664 11.168V14.1172C3.55664 15.084 4.30859 15.8359 5.28516 15.8359C6.25195 15.8359 7.00391 15.084 7.00391 14.1172V11.168C7.00391 10.2109 6.25195 9.44922 5.28516 9.44922C4.30859 9.44922 3.55664 10.2109 3.55664 11.168ZM5.28516 15.2305C4.64062 15.2305 4.16211 14.7617 4.16211 14.1172C4.16211 13.5117 4.66016 13.0137 5.28516 13.0137C5.90039 13.0137 6.39844 13.5117 6.39844 14.1172C6.39844 14.7617 5.92969 15.2305 5.28516 15.2305Z" fill="black"/>
</svg>

`;

const CardsSold = () => {
  const navigation = useNavigation();
  
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFC5B1', '#E9F0F5']}
        locations={[0, 0.15]}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cards sold</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.cardContainer}>
            <View style={styles.iconContainer}>
              <Image source={require('../../assets/logo.png')} style={styles.cardIcon} />
            </View>
            <Text style={styles.scanText}>Scan the bard code to activate the card</Text>
            <SvgXml xml={barcodeXml} width="100%" height={100} style={styles.barcode} />
            <TouchableOpacity style={styles.flashButton}>
              <SvgXml xml={flashlightXml} width={24} height={24} style={styles.flashIcon} />
              <Text style={styles.flashText}>Flash</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
      
      <View style={styles.tabNavigationContainer}>
        <AffiliateTabNavigation />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    lineHeight: 48,
    fontFamily: 'Gabarito',
    color: 'black',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  iconContainer: {
    backgroundColor: '#FFC5B1',
    borderRadius: 50,
    padding: 16,
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
  },
  scanText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
  },
  barcode: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  flashButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flashIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  flashText: {
    fontSize: 16,
    color: 'black',
  },
  tabNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
  },
});

export default CardsSold;
