import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Svg, Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather'; // Add this import

const MyLinks = () => {
  const links = [
    { 
      name: 'Facebook', 
      url: 'https://www.urbanwallah.com/', 
      qrCode: require('../../assets/qr-code_fb.png')
    },
    { 
      name: 'YouTube', 
      url: 'https://www.urbanwallah.com/', 
      qrCode: require('../../assets/qr-code_yt.png')
    },
  ];

  const socialHandles = [
    { name: 'Instagram', icon: require('../../assets/instagram-icon.png') },
    { name: 'Twitter / X', icon: require('../../assets/twitter-icon.png') },
    { name: 'WhatsApp', icon: require('../../assets/whatsapp-icon.png') },
    
  ];

  return (
    <LinearGradient
      colors={['#FFC5B1', '#E9F0F5']}
      locations={[0, 0.15]} // Match the gradient locations from Profile.js
      style={styles.container}
    >
     <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { marginLeft: 20 }]}>My Links</Text> 
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.activeLinksText}>Active Links : {links.length}</Text>
        <TouchableOpacity style={styles.addButton}>
          <AddIcon style={styles.addIcon} />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {links.map((link, index) => (
          <View key={index} style={styles.linkItem}>
            <Image source={link.qrCode} style={styles.qrCode} />
            <View style={styles.linkDetails}>
              <Text style={styles.linkName}>{link.name}</Text>
              <Text style={styles.linkUrl}>{link.url}</Text>
              <View style={styles.linkActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <DownloadQRIcon width={16} height={16} style={styles.actionIcon} />
                  <Text style={styles.actionButtonText}>Download QR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <CopyQRIcon width={16} height={16} style={styles.actionIcon} />
                  <Text style={styles.actionButtonText}>Copy QR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <CopyLinkIcon width={16} height={16} style={styles.actionIcon} />
                  <Text style={styles.actionButtonText}>Copy Link</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteButton}>
              <DeleteIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.socialHandles}>
          <Text style={styles.socialHandlesTitle}>Choose handle</Text>
          {socialHandles.map((handle, index) => (
            <TouchableOpacity key={index} style={styles.socialHandle}>
              <Image source={handle.icon} style={styles.socialIcon} />
              <Text style={styles.socialName}>{handle.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
const AddIcon = (props) => (
  <Svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path d="M10.8359 21.0371C5.26953 21.0371 0.748047 16.5156 0.748047 10.9492C0.748047 5.38281 5.26953 0.861328 10.8359 0.861328C16.4023 0.861328 20.9238 5.38281 20.9238 10.9492C20.9238 16.5156 16.4023 21.0371 10.8359 21.0371ZM10.8359 19.0449C15.3184 19.0449 18.9414 15.4316 18.9414 10.9492C18.9414 6.4668 15.3184 2.84375 10.8359 2.84375C6.35352 2.84375 2.73047 6.4668 2.73047 10.9492C2.73047 15.4316 6.35352 19.0449 10.8359 19.0449ZM6.31445 10.9492C6.31445 10.4023 6.69531 10.0215 7.24219 10.0215H9.91797V7.3457C9.91797 6.79883 10.2891 6.42773 10.8164 6.42773C11.3633 6.42773 11.7441 6.79883 11.7441 7.3457V10.0215H14.4297C14.9668 10.0215 15.3379 10.4023 15.3379 10.9492C15.3379 11.4766 14.9668 11.8477 14.4297 11.8477H11.7441V14.5332C11.7441 15.0703 11.3633 15.4512 10.8164 15.4512C10.2891 15.4512 9.91797 15.0703 9.91797 14.5332V11.8477H7.24219C6.69531 11.8477 6.31445 11.4766 6.31445 10.9492Z" fill="#EB6A36"/>
  </Svg>
);


const DownloadQRIcon = (props) => (
  <Svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path d="M7.49219 0.015625C7.89062 0.015625 8.21875 0.335938 8.21875 0.71875V8.5625L8.15625 9.72656L8.57031 9.22656L9.6875 8.03906C9.8125 7.89844 9.99219 7.82812 10.1719 7.82812C10.5234 7.82812 10.8203 8.08594 10.8203 8.44531C10.8203 8.63281 10.7422 8.77344 10.6094 8.90625L8.03906 11.3828C7.85938 11.5625 7.6875 11.625 7.49219 11.625C7.30469 11.625 7.13281 11.5625 6.95312 11.3828L4.375 8.90625C4.25 8.77344 4.17188 8.63281 4.17188 8.44531C4.17188 8.08594 4.45312 7.82812 4.8125 7.82812C4.99219 7.82812 5.17969 7.89844 5.30469 8.03906L6.42188 9.22656L6.83594 9.72656L6.77344 8.5625V0.71875C6.77344 0.335938 7.10156 0.015625 7.49219 0.015625ZM3 16.9219C1.3125 16.9219 0.4375 16.0547 0.4375 14.3828V6.72656C0.4375 5.05469 1.3125 4.1875 3 4.1875H5.29688V5.71875H3.09375C2.36719 5.71875 1.96875 6.10156 1.96875 6.85938V14.25C1.96875 15.0078 2.36719 15.3906 3.09375 15.3906H11.8984C12.6172 15.3906 13.0234 15.0078 13.0234 14.25V6.85938C13.0234 6.10156 12.6172 5.71875 11.8984 5.71875H9.6875V4.1875H11.9922C13.6797 4.1875 14.5547 5.0625 14.5547 6.72656V14.3828C14.5547 16.0469 13.6797 16.9219 11.9922 16.9219H3Z" fill="#F69776"/>
  </Svg>
);
const CopyQRIcon = (props) => (
  <Svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path d="M0.375 17.7266V6.98438C0.375 5.30469 1.24219 4.42188 2.91406 4.42188H4.23438V2.98438C4.23438 1.29688 5.10938 0.421875 6.77344 0.421875H9.71875C10.6172 0.421875 11.3125 0.648438 11.8984 1.25L15.7969 5.21875C16.4141 5.85156 16.625 6.50781 16.625 7.53125V13.7188C16.625 15.4062 15.7578 16.2812 14.0859 16.2812H12.7578V17.7266C12.7578 19.4062 11.8984 20.2891 10.2266 20.2891H2.91406C1.24219 20.2891 0.375 19.4141 0.375 17.7266ZM11.9766 9.51562C12.6328 10.1797 12.7578 10.6641 12.7578 11.7188V14.75H13.9531C14.7188 14.75 15.0938 14.3516 15.0938 13.625V7.15625H11.6484C10.6875 7.15625 10.1719 6.65625 10.1719 5.6875V1.95312H6.90625C6.14844 1.95312 5.76562 2.35156 5.76562 3.07031V4.42969C6.63281 4.4375 7.14062 4.60156 7.74219 5.21094L11.9766 9.51562ZM11.4531 5.49219C11.4531 5.76562 11.5703 5.875 11.8359 5.875H14.6953L11.4531 2.58594V5.49219ZM1.90625 17.6328C1.90625 18.3594 2.28125 18.7578 3.03906 18.7578H10.0938C10.8516 18.7578 11.2266 18.3594 11.2266 17.6328V11.8984H7.10156C5.99219 11.8984 5.4375 11.3516 5.4375 10.2344V5.95312H3.03906C2.28125 5.95312 1.90625 6.35938 1.90625 7.07812V17.6328ZM7.25 10.5469H11.0156L6.78906 6.25V10.0859C6.78906 10.4062 6.92969 10.5469 7.25 10.5469Z" fill="#F69776"/>
  </Svg>
);

const CopyLinkIcon = (props) => (
  <Svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path d="M11.6094 7.10156C12.2552 7.1849 12.8021 7.33854 13.25 7.5625C13.6979 7.78125 14.0859 8.05469 14.4141 8.38281C15.0234 8.99219 15.4792 9.65365 15.7812 10.3672C16.0833 11.0755 16.2344 11.7995 16.2344 12.5391C16.2344 13.2786 16.0833 14.0026 15.7812 14.7109C15.4792 15.4193 15.026 16.0729 14.4219 16.6719L10.9297 20.1641C10.3307 20.7682 9.67708 21.2214 8.96875 21.5234C8.26042 21.8307 7.53646 21.9844 6.79688 21.9844C6.05729 21.9844 5.33073 21.8333 4.61719 21.5312C3.90885 21.2292 3.25 20.7708 2.64062 20.1562C2.02604 19.5469 1.56771 18.8854 1.26562 18.1719C0.963542 17.4635 0.8125 16.7396 0.8125 16C0.8125 15.2604 0.963542 14.5365 1.26562 13.8281C1.57292 13.1198 2.02865 12.4661 2.63281 11.8672L5.64062 8.86719C5.55729 9.21615 5.53385 9.57812 5.57031 9.95312C5.61198 10.3281 5.70052 10.6719 5.83594 10.9844L3.875 12.9531C3.29167 13.5365 2.90104 14.1797 2.70312 14.8828C2.51042 15.5859 2.51042 16.2891 2.70312 16.9922C2.89583 17.6953 3.28646 18.3411 3.875 18.9297C4.45312 19.5078 5.09375 19.8932 5.79688 20.0859C6.5 20.2786 7.20312 20.276 7.90625 20.0781C8.61458 19.8854 9.26042 19.4974 9.84375 18.9141L13.1719 15.5781C13.7552 15 14.1432 14.3594 14.3359 13.6562C14.5339 12.9531 14.5339 12.25 14.3359 11.5469C14.1432 10.8385 13.7552 10.1953 13.1719 9.61719C12.8333 9.27344 12.4271 9.0026 11.9531 8.80469C11.4792 8.60677 10.9115 8.49219 10.25 8.46094L11.6094 7.10156ZM11.3984 15.4609C10.7526 15.3776 10.2057 15.2266 9.75781 15.0078C9.3099 14.7839 8.92188 14.5104 8.59375 14.1875C7.97917 13.5729 7.52083 12.9115 7.21875 12.2031C6.91667 11.4896 6.76562 10.763 6.76562 10.0234C6.76562 9.28385 6.91667 8.5625 7.21875 7.85938C7.52604 7.15104 7.98177 6.49479 8.58594 5.89062L12.0781 2.39844C12.6771 1.79427 13.3281 1.34115 14.0312 1.03906C14.7396 0.731771 15.4635 0.578125 16.2031 0.578125C16.9427 0.578125 17.6667 0.729167 18.375 1.03125C19.0885 1.33333 19.75 1.79167 20.3594 2.40625C20.9688 3.02083 21.4245 3.68229 21.7266 4.39062C22.0339 5.09896 22.1875 5.82292 22.1875 6.5625C22.1875 7.30208 22.0365 8.02604 21.7344 8.73438C21.4323 9.44271 20.9792 10.0964 20.375 10.6953L17.3594 13.6953C17.4479 13.3464 17.4714 12.987 17.4297 12.6172C17.388 12.2422 17.2995 11.8958 17.1641 11.5781L19.125 9.60938C19.7083 9.02604 20.0964 8.38281 20.2891 7.67969C20.487 6.97656 20.487 6.27344 20.2891 5.57031C20.0964 4.86719 19.7109 4.22135 19.1328 3.63281C18.5495 3.05469 17.9062 2.66927 17.2031 2.47656C16.5 2.28385 15.7969 2.28646 15.0938 2.48438C14.3906 2.67708 13.7474 3.0651 13.1641 3.64844L9.82812 6.98438C9.24479 7.5625 8.85677 8.20312 8.66406 8.90625C8.47135 9.60938 8.47135 10.3151 8.66406 11.0234C8.85677 11.7318 9.24479 12.375 9.82812 12.9531C10.1667 13.2969 10.5729 13.5677 11.0469 13.7656C11.5208 13.9583 12.0885 14.0703 12.75 14.1016L11.3984 15.4609Z" fill="#F69776"/>
  </Svg>
);

const DeleteIcon = (props) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#FF0000"/>
  </Svg>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40, // Adjust for status bar
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
    color: 'black',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  addIcon: {
    marginRight: 4, // Adjust as needed
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  activeLinksText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  addButton: {
    position: 'absolute',
    left: 309,
    top: 135,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFC5B1',
    borderRadius: 4,
  },
  addButtonText: {
    fontFamily: 'SF Pro Display',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  content: {
    flex: 1,
  },
  linkItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  qrCode: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  linkDetails: {
    flex: 1,
  },
  linkName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  linkUrl: {
    color: 'gray',
    fontSize: 12,
    marginBottom: 8,
  },
  linkActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#F69776',
    fontSize: 12,
  },
  actionIcon: {
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  socialHandles: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  socialHandlesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  socialHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#C6C6C8',
    paddingBottom: 16,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
  socialName: {
    fontSize: 16,
    color: 'black',
  },
});

export default MyLinks;