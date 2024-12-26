import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const ProfileOption = ({ icon, title }) => (
  <TouchableOpacity style={styles.optionContainer}>
    <Icon name={icon} size={24} color="#000" style={styles.optionIcon} />
    <Text style={styles.optionText}>{title}</Text>
    <Icon name="chevron-right" size={24} color="#000" />
  </TouchableOpacity>
);

const Profile = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#FFC5B1', '#E9F0F5']}
      locations={[0, 0.15]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.optionGroup}>
          <ProfileOption icon="user" title="Profile" />
          <ProfileOption icon="map-pin" title="Saved Address" />
          <ProfileOption icon="credit-card" title="My Wallet" />
          <ProfileOption icon="bell" title="Notifications" />
        </View>
        <View style={styles.optionGroup}>
          <ProfileOption icon="star" title="My Reviews" />
          <ProfileOption icon="help-circle" title="Support Tickets" />
        </View>
        <View style={styles.optionGroup}>
          <ProfileOption icon="file-text" title="Legal Policies" />
          <ProfileOption icon="help-circle" title="FAQs" />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "600",
    marginLeft: 20,
    lineHeight: 48,
    fontFamily: "Gabarito",
    color: 'black',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  optionGroup: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default Profile;