import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';

const RequestCallBack = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8E8E93"
          />
          <Icon name="mic" size={20} color="black" style={styles.micIcon} />
        </View>
      </View>

      <Text style={styles.supportTitle}>Support</Text>

      <View style={styles.card}>
        <Image
          source={require('../../assets/App_icon_1.png')}
          style={styles.logo}
        />
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>UrbanWallah Care 
            <Svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M7.28516 14.126C6.3099 14.126 5.39616 13.9414 4.54395 13.5723C3.69173 13.2077 2.94206 12.7018 2.29492 12.0547C1.64779 11.4076 1.13965 10.6579 0.770508 9.80566C0.405924 8.95345 0.223633 8.03971 0.223633 7.06445C0.223633 6.08919 0.405924 5.17546 0.770508 4.32324C1.13965 3.46647 1.64779 2.7168 2.29492 2.07422C2.94206 1.42708 3.69173 0.921224 4.54395 0.556641C5.39616 0.1875 6.3099 0.00292969 7.28516 0.00292969C8.26042 0.00292969 9.17415 0.1875 10.0264 0.556641C10.8831 0.921224 11.6351 1.42708 12.2822 2.07422C12.9294 2.7168 13.4352 3.46647 13.7998 4.32324C14.1689 5.17546 14.3535 6.08919 14.3535 7.06445C14.3535 8.03971 14.1689 8.95345 13.7998 9.80566C13.4352 10.6579 12.9294 11.4076 12.2822 12.0547C11.6351 12.7018 10.8831 13.2077 10.0264 13.5723C9.17415 13.9414 8.26042 14.126 7.28516 14.126ZM6.52637 10.4346C6.65397 10.4346 6.77018 10.4049 6.875 10.3457C6.98438 10.2865 7.08008 10.1976 7.16211 10.0791L10.3613 5.08887C10.4069 5.01595 10.4479 4.93848 10.4844 4.85645C10.5208 4.76986 10.5391 4.68783 10.5391 4.61035C10.5391 4.43262 10.4707 4.28906 10.334 4.17969C10.2018 4.07031 10.0514 4.01562 9.88281 4.01562C9.65951 4.01562 9.47493 4.13411 9.3291 4.37109L6.49902 8.89648L5.18652 7.22852C5.09538 7.11458 5.00651 7.03483 4.91992 6.98926C4.83333 6.94368 4.73535 6.9209 4.62598 6.9209C4.4528 6.9209 4.30469 6.9847 4.18164 7.1123C4.06315 7.23535 4.00391 7.38346 4.00391 7.55664C4.00391 7.64323 4.01986 7.72754 4.05176 7.80957C4.08366 7.8916 4.12923 7.97135 4.18848 8.04883L5.86328 10.0859C5.96354 10.209 6.06608 10.2979 6.1709 10.3525C6.27572 10.4072 6.39421 10.4346 6.52637 10.4346Z" fill="#706EFD"/>
            </Svg>

          </Text>
          <Text style={styles.cardSubtitle}>The trustable ecommerce platform</Text>
        </View>
       
      </View>

      <Text style={styles.sectionTitle}>Talk to us</Text>

      <View style={styles.talkCard}>
        <TouchableOpacity style={styles.option}>
            <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M12.7832 17.2412C10.2695 17.2412 7.20215 15.668 4.39844 12.8643C1.57715 10.0518 0.0214844 6.97559 0.0214844 4.46191C0.0214844 2.94141 0.43457 1.93066 1.42773 1.05176C1.49805 0.981445 1.57715 0.911133 1.64746 0.849609C2.23633 0.322266 2.80762 0.0673828 3.35254 0.0761719C3.98535 0.0849609 4.57422 0.445312 5.11914 1.22754L6.85938 3.72363C7.29883 4.35645 7.19336 5.10352 6.85059 5.64844L6.05957 6.8877C5.91016 7.125 5.89258 7.29199 6.00684 7.49414C6.29688 7.99512 6.94727 8.79492 7.61523 9.46289C8.27441 10.1396 9.25 10.9219 9.63672 11.168C9.8916 11.3262 10.1201 11.3262 10.3838 11.2031L11.7461 10.5352C12.5898 10.1309 13.1611 10.1572 13.8379 10.6143L16.0439 12.126C16.8262 12.6621 17.1865 13.2773 17.1865 13.9102C17.1865 14.4551 16.9404 15.0264 16.4131 15.6064C16.3428 15.6855 16.2812 15.7559 16.2109 15.835C15.3232 16.8281 14.3125 17.2412 12.7832 17.2412ZM12.792 15.9053C13.7676 15.8877 14.6025 15.5537 15.209 14.8594C15.2529 14.8066 15.2969 14.7539 15.3408 14.7012C15.5693 14.4375 15.6924 14.1475 15.6924 13.9014C15.6924 13.6377 15.5957 13.4092 15.332 13.2422L13.2754 11.8623C12.9941 11.6865 12.7305 11.6426 12.3965 11.792L10.9199 12.4951C10.1025 12.8906 9.62793 12.8027 9.10059 12.416C8.49414 11.9941 7.37793 11.0449 6.70996 10.377C6.0332 9.70898 5.26855 8.7334 4.75879 8.05664C4.37207 7.5293 4.30176 7.05469 4.68848 6.43066L5.56738 5.02441C5.74316 4.7168 5.75195 4.52344 5.60254 4.30371L4.02051 1.93066C3.84473 1.66699 3.625 1.57031 3.36133 1.57031C3.11523 1.57031 2.8252 1.69336 2.56152 1.92188C2.50879 1.96582 2.45605 2.00977 2.40332 2.05371C1.70898 2.66016 1.375 3.48633 1.35742 4.45312C1.31348 6.70312 3.11523 9.67383 5.40918 11.959C7.68555 14.2266 10.5508 15.9492 12.792 15.9053Z" fill="black"/>
            </Svg>

          <Text style={styles.optionText}>Request a call back</Text>
          <Icon name="chevron-right" size={24} color="#000" style={styles.chevronIcon} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <Text style={styles.orText}>or call us at 1800-123-4567</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  backButton: {
    marginRight: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 36,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Gabarito',
    marginTop: 0,
    color: '#000000',
  },
  searchInputPlaceholder: {
    marginTop: 1,
    color: '#8E8E93',
  },
  micIcon: {
    marginLeft: 8,
  },
  supportTitle: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Gabarito',
    color: '#000000',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    padding: 16,
  },
  logo: {
    width: 69,
    height: 69,
    borderRadius: 35,
    backgroundColor: '#87CEEB',
  },
  cardTextContainer: {
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Gabarito',
    color: '#000000',
  },
  cardSubtitle: {
    fontSize: 12,
    fontFamily: 'Gabarito',
    color: '#909090',
    marginTop: 4,
  },
   
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Gabarito',
    color: '#000000',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  talkCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginHorizontal: 16,
    padding: 16,
  },
  option: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
    fontFamily: 'Gabarito',
    color: '#000000',
  },
  chevronIcon: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 36,
    marginVertical: 16,
  },
  orText: {
    fontSize: 16,
    fontFamily: 'Gabarito',
    color: '#000000',
    // textAlign: 'center',
    marginLeft: 36,
  },
});

export default RequestCallBack;
