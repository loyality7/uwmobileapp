import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import ServicesScreen from '../screens/apps/Apps';
import Profile from '../screens/Profile';
import BrainBox from '../screens/Hub/BrainBox/BrainBox';
import AgriSure from '../screens/Hub/AgriSure/AgriSure';
import XBO from '../screens/Hub/XBO/XBO';
import MyPosts from '../screens/Hub/MyPosts';
import BrainBoxProduct from '../screens/Hub/BrainBox/brainbox_product';
import AgriSureProduct from '../screens/Hub/AgriSure/agrisure_product';
import XBOProduct from '../screens/Hub/XBO/xbo_product';

const Stack = createStackNavigator();

const ServiceStack = ({ route }) => {
  const { service } = route.params || { service: 'BrainBox' };
  
  const ServiceComponent = (() => {
    switch (service) {
      case 'BrainBox':
        return BrainBox;
      case 'AgriSure':
        return AgriSure;
      case 'XBO':
        return XBO;
      default:
        return BrainBox;
    }
  })();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="ServiceMain" 
        component={ServiceComponent}
        initialParams={{ service }}
      />
    </Stack.Navigator>
  );
};

// Tab Icons Components
const AppsIconInactive = () => (
  <Svg width="23" height="26" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M11.6239 3.0278C12.7529 2.61725 13.7793 2.25802 14.8056 1.95011C15.0109 1.89879 15.3188 2.05274 15.5754 2.10406C15.5241 2.36065 15.4728 2.61725 15.3701 2.87384C15.2675 3.28439 15.1136 3.69494 14.9083 4.31076C16.1912 4.31076 17.2176 4.31076 18.2953 4.31076C19.6296 4.31076 19.9375 4.61867 19.9888 5.95295C19.9888 6.26086 20.0401 6.51746 19.9888 6.82537C19.8862 7.49251 20.1941 7.95438 20.7073 8.41624C22.8627 10.3663 22.8113 13.9586 20.656 16.114C20.348 16.4219 20.0915 16.8325 20.0401 17.243C19.5783 21.7591 15.6781 25.3 11.1107 25.3C6.49204 25.3 2.59183 21.7591 2.07864 17.0891C2.02732 16.7298 1.82205 16.268 1.56546 16.0114C-0.487286 13.9073 -0.538604 10.5203 1.51414 8.41624C1.82205 8.10833 1.92469 7.59515 2.02732 7.1846C2.12996 6.67141 2.02732 6.10691 2.02732 5.59372C2.02732 4.72131 2.43787 4.31076 3.31029 4.25944C4.28534 4.25944 5.31171 4.25944 6.28676 4.25944C6.69731 4.25944 6.9539 4.1568 7.10786 3.74625C8.03159 1.28296 9.77643 0.0513186 12.3937 0C12.6503 0 12.9582 0.153956 13.2148 0.256593C13.1121 0.513186 13.0095 0.71846 12.8555 0.975053C12.4963 1.69351 12.0344 2.36065 11.6239 3.0278ZM3.00238 17.0891C3.15633 21.1432 7.05654 24.5816 11.2647 24.4276C15.3188 24.325 19.1677 20.7327 19.1164 17.1404C14.3438 17.7562 12.8555 16.7812 11.7265 12.2138C11.3673 12.2138 10.9568 12.2138 10.5975 12.2138C9.4172 16.7298 7.46709 18.0128 3.00238 17.0891ZM3.00238 7.38987C3.20765 7.33855 3.36161 7.28723 3.56688 7.23592C6.54336 6.31218 9.36588 7.7491 10.2896 10.7256C10.4436 11.2901 10.7515 11.2901 11.2133 11.3414C11.6752 11.3414 11.9831 11.2901 12.1371 10.7256C12.7529 8.67284 14.1898 7.44119 16.2939 7.08196C17.2176 6.92801 18.1927 7.03064 19.1677 7.03064C19.1677 6.77405 19.1677 6.3635 19.1677 5.95295C19.219 5.38845 18.9624 5.13186 18.3979 5.18317C17.7821 5.23449 17.1663 5.18317 16.5505 5.18317C14.2925 5.18317 14.2925 5.18317 14.2925 2.92516C13.2661 3.18175 12.5476 3.74625 11.9831 4.61867C11.8292 4.82394 11.5726 4.92658 11.3673 5.13186C11.2133 4.87526 10.9568 4.61867 10.9568 4.4134C11.0594 3.28439 11.2647 2.15538 11.4186 1.07769C9.77643 1.12901 8.23687 2.41197 7.87764 4.36208C7.775 4.9779 7.51841 5.18317 6.90259 5.13186C6.18413 5.08054 5.46567 5.13186 4.79852 5.13186C2.7971 5.13186 2.7971 5.13186 2.95106 7.1846C2.89974 7.23592 2.95106 7.28724 3.00238 7.38987ZM0.846997 12.1625C0.846997 14.6771 2.69446 16.5759 5.20907 16.5759C7.62105 16.5759 9.57115 14.6258 9.62247 12.2138C9.67379 9.75053 7.82632 7.85174 5.31171 7.80042C2.89974 7.7491 0.846997 9.75053 0.846997 12.1625ZM21.4771 12.2138C21.4771 9.64789 19.6809 7.80042 17.115 7.80042C14.703 7.80042 12.7529 9.75053 12.7016 12.1625C12.7016 14.7284 14.4977 16.5759 17.0637 16.5759C19.527 16.5759 21.4771 14.6771 21.4771 12.2138Z" fill="#999999"/>
<Path d="M11.0594 21.2973C9.46853 21.2973 7.92897 20.2196 7.51842 18.7314C7.41579 18.4748 7.62106 18.1156 7.62106 17.859C7.82633 18.0643 8.18556 18.2182 8.2882 18.4235C9.16062 20.4249 11.3673 21.0921 12.9582 19.7065C13.3687 19.3472 13.6253 18.7314 13.9332 18.2695C14.0872 18.0643 14.3438 17.9103 14.5491 17.7563C14.6004 18.0129 14.8057 18.3209 14.7543 18.5774C14.3951 20.117 12.7529 21.3486 11.0594 21.2973Z" fill="#999999"/>
<Path d="M5.46567 10.1611C5.46567 11.4954 5.87622 11.8033 7.15918 11.5467C7.51841 12.5731 7.26182 13.3942 6.44072 14.01C5.72226 14.5232 4.69589 14.5232 3.97743 13.9587C3.20765 13.3942 2.89974 12.4705 3.20765 11.5467C3.56688 10.5717 4.28534 10.1611 5.46567 10.1611Z" fill="#999999"/>
<Path d="M17.3203 10.1611C17.3716 11.5467 17.7821 11.8546 19.0138 11.5467C19.373 12.4705 19.1677 13.2916 18.4493 13.8561C17.7308 14.4719 16.7044 14.5232 15.9347 14.01C15.1649 13.4968 14.8057 12.5218 15.0622 11.6494C15.3702 10.623 16.0886 10.1611 17.3203 10.1611Z" fill="#999999"/>
</Svg>
);

const AppsIconActive = () => (
  <Svg width="23" height="26" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M11.6239 3.0278C12.7529 2.61725 13.7793 2.25802 14.8056 1.95011C15.0109 1.89879 15.3188 2.05274 15.5754 2.10406C15.5241 2.36065 15.4728 2.61725 15.3701 2.87384C15.2675 3.28439 15.1136 3.69494 14.9083 4.31076C16.1912 4.31076 17.2176 4.31076 18.2953 4.31076C19.6296 4.31076 19.9375 4.61867 19.9888 5.95295C19.9888 6.26086 20.0401 6.51746 19.9888 6.82537C19.8862 7.49251 20.1941 7.95438 20.7073 8.41624C22.8627 10.3663 22.8113 13.9586 20.656 16.114C20.348 16.4219 20.0915 16.8325 20.0401 17.243C19.5783 21.7591 15.6781 25.3 11.1107 25.3C6.49204 25.3 2.59183 21.7591 2.07864 17.0891C2.02732 16.7298 1.82205 16.268 1.56546 16.0114C-0.487286 13.9073 -0.538604 10.5203 1.51414 8.41624C1.82205 8.10833 1.92469 7.59515 2.02732 7.1846C2.12996 6.67141 2.02732 6.10691 2.02732 5.59372C2.02732 4.72131 2.43787 4.31076 3.31029 4.25944C4.28534 4.25944 5.31171 4.25944 6.28676 4.25944C6.69731 4.25944 6.9539 4.1568 7.10786 3.74625C8.03159 1.28296 9.77643 0.0513186 12.3937 0C12.6503 0 12.9582 0.153956 13.2148 0.256593C13.1121 0.513186 13.0095 0.71846 12.8555 0.975053C12.4963 1.69351 12.0344 2.36065 11.6239 3.0278ZM3.00238 17.0891C3.15633 21.1432 7.05654 24.5816 11.2647 24.4276C15.3188 24.325 19.1677 20.7327 19.1164 17.1404C14.3438 17.7562 12.8555 16.7812 11.7265 12.2138C11.3673 12.2138 10.9568 12.2138 10.5975 12.2138C9.4172 16.7298 7.46709 18.0128 3.00238 17.0891ZM3.00238 7.38987C3.20765 7.33855 3.36161 7.28723 3.56688 7.23592C6.54336 6.31218 9.36588 7.7491 10.2896 10.7256C10.4436 11.2901 10.7515 11.2901 11.2133 11.3414C11.6752 11.3414 11.9831 11.2901 12.1371 10.7256C12.7529 8.67284 14.1898 7.44119 16.2939 7.08196C17.2176 6.92801 18.1927 7.03064 19.1677 7.03064C19.1677 6.77405 19.1677 6.3635 19.1677 5.95295C19.219 5.38845 18.9624 5.13186 18.3979 5.18317C17.7821 5.23449 17.1663 5.18317 16.5505 5.18317C14.2925 5.18317 14.2925 5.18317 14.2925 2.92516C13.2661 3.18175 12.5476 3.74625 11.9831 4.61867C11.8292 4.82394 11.5726 4.92658 11.3673 5.13186C11.2133 4.87526 10.9568 4.61867 10.9568 4.4134C11.0594 3.28439 11.2647 2.15538 11.4186 1.07769C9.77643 1.12901 8.23687 2.41197 7.87764 4.36208C7.775 4.9779 7.51841 5.18317 6.90259 5.13186C6.18413 5.08054 5.46567 5.13186 4.79852 5.13186C2.7971 5.13186 2.7971 5.13186 2.95106 7.1846C2.89974 7.23592 2.95106 7.28724 3.00238 7.38987ZM0.846997 12.1625C0.846997 14.6771 2.69446 16.5759 5.20907 16.5759C7.62105 16.5759 9.57115 14.6258 9.62247 12.2138C9.67379 9.75053 7.82632 7.85174 5.31171 7.80042C2.89974 7.7491 0.846997 9.75053 0.846997 12.1625ZM21.4771 12.2138C21.4771 9.64789 19.6809 7.80042 17.115 7.80042C14.703 7.80042 12.7529 9.75053 12.7016 12.1625C12.7016 14.7284 14.4977 16.5759 17.0637 16.5759C19.527 16.5759 21.4771 14.6771 21.4771 12.2138Z" fill="#007AFF"/>
  <Path d="M11.0593 21.2973C9.46847 21.2973 7.92891 20.2196 7.51836 18.7314C7.41573 18.4748 7.621 18.1156 7.621 17.859C7.82627 18.0643 8.1855 18.2182 8.28814 18.4235C9.16056 20.4249 11.3673 21.0921 12.9581 19.7065C13.3687 19.3472 13.6253 18.7314 13.9332 18.2695C14.0871 18.0643 14.3437 17.9103 14.549 17.7563C14.6003 18.0129 14.8056 18.3209 14.7543 18.5774C14.395 20.117 12.7529 21.3486 11.0593 21.2973Z" fill="#007AFF"/>
  <Path d="M5.46561 10.1611C5.46561 11.4954 5.87616 11.8033 7.15912 11.5467C7.51835 12.5731 7.26176 13.3942 6.44066 14.01C5.7222 14.5232 4.69583 14.5232 3.97737 13.9587C3.20759 13.3942 2.89968 12.4705 3.20759 11.5467C3.56682 10.5717 4.28528 10.1611 5.46561 10.1611Z" fill="#007AFF"/>
  <Path d="M17.3203 10.1611C17.3716 11.5467 17.7821 11.8546 19.0138 11.5467C19.373 12.4705 19.1677 13.2916 18.4493 13.8561C17.7308 14.4719 16.7044 14.5232 15.9347 14.01C15.1649 13.4968 14.8057 12.5218 15.0622 11.6494C15.3702 10.623 16.0886 10.1611 17.3203 10.1611Z" fill="#007AFF"/>
  </Svg>
);

const HomeIconInactive = () => (
  <Svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M0 11.8174C0 11.6058 0 11.3987 0 11.1871C0.135056 10.5163 0.567234 10.0436 1.03543 9.57996C3.8851 6.74379 6.73028 3.90311 9.56645 1.05344C10.0346 0.58074 10.5073 0.135056 11.1871 0C11.3987 0 11.6058 0 11.8174 0C12.4972 0.135056 12.9699 0.58074 13.4381 1.05344C16.3598 3.98865 19.2905 6.91035 22.2167 9.83656C22.3112 9.9311 22.4103 10.0256 22.4958 10.1292C23.5492 11.3672 22.874 13.276 21.2803 13.5731C21.0417 13.6181 20.7941 13.6181 20.5375 13.6361C20.5375 13.7352 20.5375 13.8252 20.5375 13.9107C20.5375 16.0806 20.5375 18.2505 20.5375 20.4249C20.5375 21.9331 19.4705 22.9955 17.9669 23C16.8235 23 15.6755 23 14.532 23C13.9648 23 13.7172 22.7479 13.7172 22.1717C13.7172 20.4519 13.7172 18.7277 13.7172 17.008C13.7172 16.2427 13.2535 15.779 12.4882 15.779C11.8534 15.7745 11.2141 15.797 10.5794 15.7745C9.80055 15.7475 9.27833 16.3057 9.29184 17.053C9.31885 18.7683 9.30084 20.4835 9.30084 22.1942C9.30084 22.7479 9.04424 23 8.48601 23C7.35604 23 6.22607 23 5.09611 23C3.52946 23 2.47602 21.9511 2.47602 20.3799C2.47602 18.2145 2.47602 16.0536 2.47602 13.8882C2.47602 13.8027 2.47602 13.7127 2.47602 13.6406C2.431 13.6271 2.4175 13.6181 2.40399 13.6181C2.29145 13.6136 2.1789 13.6181 2.06635 13.6136C1.24251 13.5686 0.63026 13.1859 0.2431 12.4611C0.130554 12.2631 0.0765316 12.0335 0 11.8174Z" fill="#999999"/>
    </Svg>
);

const HomeIconActive = () => (
  <Svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M0 11.8174C0 11.6058 0 11.3987 0 11.1871C0.135056 10.5163 0.567234 10.0436 1.03543 9.57996C3.8851 6.74379 6.73028 3.90311 9.56645 1.05344C10.0346 0.58074 10.5073 0.135056 11.1871 0C11.3987 0 11.6058 0 11.8174 0C12.4972 0.135056 12.9699 0.58074 13.4381 1.05344C16.3598 3.98865 19.2905 6.91035 22.2167 9.83656C22.3112 9.9311 22.4103 10.0256 22.4958 10.1292C23.5492 11.3672 22.874 13.276 21.2803 13.5731C21.0417 13.6181 20.7941 13.6181 20.5375 13.6361C20.5375 13.7352 20.5375 13.8252 20.5375 13.9107C20.5375 16.0806 20.5375 18.2505 20.5375 20.4249C20.5375 21.9331 19.4705 22.9955 17.9669 23C16.8235 23 15.6755 23 14.532 23C13.9648 23 13.7172 22.7479 13.7172 22.1717C13.7172 20.4519 13.7172 18.7277 13.7172 17.008C13.7172 16.2427 13.2535 15.779 12.4882 15.779C11.8534 15.7745 11.2141 15.797 10.5794 15.7745C9.80055 15.7475 9.27833 16.3057 9.29184 17.053C9.31885 18.7683 9.30084 20.4835 9.30084 22.1942C9.30084 22.7479 9.04424 23 8.48601 23C7.35604 23 6.22607 23 5.09611 23C3.52946 23 2.47602 21.9511 2.47602 20.3799C2.47602 18.2145 2.47602 16.0536 2.47602 13.8882C2.47602 13.8027 2.47602 13.7127 2.47602 13.6406C2.431 13.6271 2.4175 13.6181 2.40399 13.6181C2.29145 13.6136 2.1789 13.6181 2.06635 13.6136C1.24251 13.5686 0.63026 13.1859 0.2431 12.4611C0.130554 12.2631 0.0765316 12.0335 0 11.8174Z" fill="#007AFF"/>
  </Svg>
);

const MyPostsIconInactive = () => (
  <Svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M1 12.0138C1 9.17317 1 6.28266 1 3.39215C1 2.39542 1.44853 1.59804 2.34558 1.19935C2.6446 1.04984 3.04329 1 3.39215 1C7.12988 1 10.9174 1 14.6552 1C16.4991 1 18.3929 1 20.2368 1C21.6821 1 22.629 1.94689 22.629 3.39215C22.629 9.12333 22.629 14.8545 22.629 20.5857C22.629 21.8316 21.8815 22.7785 20.6854 22.9779C20.5359 23.0277 20.3864 22.9779 20.2368 22.9779C14.6053 22.9779 8.97382 22.9779 3.29247 22.9779C1.99673 23.0277 1 22.0808 1 20.6355C1 17.7949 1 14.9044 1 12.0138ZM1.5482 5.08659C1.5482 5.18626 1.5482 5.28593 1.5482 5.3856C1.5482 10.4689 1.5482 15.5522 1.5482 20.6355C1.5482 21.7818 2.29575 22.5293 3.44198 22.5293C9.0735 22.5293 14.705 22.5293 20.3365 22.5293C21.5326 22.5293 22.2303 21.7818 22.2303 20.6355C22.2303 15.5522 22.2303 10.4689 22.2303 5.3856C22.2303 5.28593 22.2303 5.23609 22.2303 5.13642C15.303 5.08658 8.42562 5.08659 1.5482 5.08659ZM1.5482 4.53838C8.42562 4.53838 15.303 4.53838 22.1805 4.53838C22.1805 4.04002 22.1805 3.59149 22.1805 3.14297C22.1805 3.09313 22.1805 3.04329 22.1805 3.04329C22.031 2.0964 21.3333 1.5482 20.2867 1.5482C14.6552 1.5482 9.0735 1.5482 3.44198 1.5482C3.34231 1.5482 3.24264 1.5482 3.14297 1.5482C2.34558 1.59804 1.69771 2.14624 1.59804 2.89378C1.49836 3.44198 1.5482 3.99018 1.5482 4.53838Z" fill="#999999" stroke="#999999" stroke-width="0.5"/>
<Path d="M9.07305 7.08008C10.4186 7.08008 11.7642 7.08008 13.1098 7.08008C14.2062 7.08008 14.8541 7.72795 14.8541 8.82435C14.8541 10.6683 14.8541 12.5621 14.8541 14.406C14.8541 15.5024 14.2062 16.1503 13.1098 16.1503C10.4186 16.1503 7.67763 16.1503 4.98646 16.1503C3.9399 16.1503 3.24219 15.5024 3.24219 14.406C3.24219 12.5621 3.24219 10.6683 3.24219 8.82435C3.24219 7.77779 3.89006 7.08008 4.93662 7.08008C6.33204 7.08008 7.67763 7.08008 9.07305 7.08008ZM14.1564 15.0041C14.2062 15.0041 14.2062 15.0041 14.256 14.9542C14.256 14.8047 14.3059 14.6054 14.3059 14.4559C14.3059 12.5621 14.3059 10.6185 14.3059 8.72468C14.3059 8.02697 13.8573 7.57844 13.1596 7.57844C10.4186 7.57844 7.67763 7.57844 4.93662 7.57844C4.23892 7.57844 3.74055 8.02697 3.74055 8.77452C3.74055 10.6683 3.74055 12.5621 3.74055 14.4559C3.74055 14.5555 3.74055 14.6552 3.79039 14.8047C3.89006 14.705 3.9399 14.6054 3.98973 14.5555C4.68744 13.6086 5.38515 12.6618 6.08286 11.7149C6.58123 11.0172 7.27894 11.0172 7.7773 11.7149C8.3255 12.4624 8.8737 13.21 9.4219 13.9575C9.47174 13.9575 9.47174 13.9575 9.47174 13.9077C9.82059 13.5588 10.2193 13.1601 10.5681 12.8113C11.0167 12.3627 11.5649 12.3627 12.0632 12.8113C12.6613 13.4093 13.2593 14.0073 13.8573 14.6054C13.9072 14.7549 14.0567 14.9044 14.1564 15.0041ZM4.03957 15.3031C4.33859 15.5523 4.63761 15.6519 4.98646 15.6519C6.58123 15.6519 8.17599 15.6519 9.77076 15.6519C9.82059 15.6519 9.92026 15.6519 9.9701 15.6519C9.92026 15.6021 9.87043 15.5523 9.87043 15.5024C9.02321 14.3562 8.17599 13.1601 7.32877 12.0139C7.02975 11.6152 6.78057 11.665 6.48155 12.0139C5.88352 12.8611 5.28548 13.6585 4.68744 14.5057C4.4881 14.7549 4.23892 15.0041 4.03957 15.3031ZM13.8573 15.5024C13.8573 15.4526 13.8573 15.4526 13.8573 15.4028C13.1098 14.6552 12.3124 13.8578 11.5649 13.1103C11.4154 12.9608 11.1662 12.9109 10.9668 13.1103C10.5183 13.509 10.1196 13.9575 9.67108 14.406C9.9701 14.8047 10.2193 15.2034 10.5183 15.6021C10.5681 15.6519 10.6678 15.7018 10.7176 15.7018C11.515 15.7018 12.3124 15.7018 13.1596 15.7018C13.4586 15.6519 13.658 15.5523 13.8573 15.5024Z" fill="#AAAAAA" stroke="#999999" stroke-width="0.3"/>
<Path d="M10.3694 8.52539C11.0672 8.52539 11.5655 9.07359 11.5655 9.72146C11.5655 10.4192 11.0173 10.9674 10.3196 10.9175C9.67174 10.9175 9.12354 10.3693 9.12354 9.72146C9.17337 9.02375 9.67174 8.52539 10.3694 8.52539ZM11.0672 9.72146C11.0672 9.32277 10.7183 9.02375 10.3196 9.02375C9.92092 9.02375 9.6219 9.37261 9.6219 9.7713C9.6219 10.17 9.97075 10.469 10.3196 10.469C10.7681 10.4192 11.117 10.1202 11.0672 9.72146Z" fill="#999999"/>
  </Svg>
);

const MyPostsIconActive = () => (
  <Svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M1 12.0138C1 9.17317 1 6.28266 1 3.39215C1 2.39542 1.44853 1.59804 2.34558 1.19935C2.6446 1.04984 3.04329 1 3.39215 1C7.12988 1 10.9174 1 14.6552 1C16.4991 1 18.3929 1 20.2368 1C21.6821 1 22.629 1.94689 22.629 3.39215C22.629 9.12333 22.629 14.8545 22.629 20.5857C22.629 21.8316 21.8815 22.7785 20.6854 22.9779C20.5359 23.0277 20.3864 22.9779 20.2368 22.9779C14.6053 22.9779 8.97382 22.9779 3.29247 22.9779C1.99673 23.0277 1 22.0808 1 20.6355C1 17.7949 1 14.9044 1 12.0138ZM1.5482 5.08659C1.5482 5.18626 1.5482 5.28593 1.5482 5.3856C1.5482 10.4689 1.5482 15.5522 1.5482 20.6355C1.5482 21.7818 2.29575 22.5293 3.44198 22.5293C9.0735 22.5293 14.705 22.5293 20.3365 22.5293C21.5326 22.5293 22.2303 21.7818 22.2303 20.6355C22.2303 15.5522 22.2303 10.4689 22.2303 5.3856C22.2303 5.28593 22.2303 5.23609 22.2303 5.13642C15.303 5.08658 8.42562 5.08659 1.5482 5.08659ZM1.5482 4.53838C8.42562 4.53838 15.303 4.53838 22.1805 4.53838C22.1805 4.04002 22.1805 3.59149 22.1805 3.14297C22.1805 3.09313 22.1805 3.04329 22.1805 3.04329C22.031 2.0964 21.3333 1.5482 20.2867 1.5482C14.6552 1.5482 9.0735 1.5482 3.44198 1.5482C3.34231 1.5482 3.24264 1.5482 3.14297 1.5482C2.34558 1.59804 1.69771 2.14624 1.59804 2.89378C1.49836 3.44198 1.5482 3.99018 1.5482 4.53838Z" fill="#999999" stroke="#999999" stroke-width="0.5"/>
  </Svg>
  
);

const MeIconInactive = () => (
  <Svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M1 12.0138C1 9.17317 1 6.28266 1 3.39215C1 2.39542 1.44853 1.59804 2.34558 1.19935C2.6446 1.04984 3.04329 1 3.39215 1C7.12988 1 10.9174 1 14.6552 1C16.4991 1 18.3929 1 20.2368 1C21.6821 1 22.629 1.94689 22.629 3.39215C22.629 9.12333 22.629 14.8545 22.629 20.5857C22.629 21.8316 21.8815 22.7785 20.6854 22.9779C20.5359 23.0277 20.3864 22.9779 20.2368 22.9779C14.6053 22.9779 8.97382 22.9779 3.29247 22.9779C1.99673 23.0277 1 22.0808 1 20.6355C1 17.7949 1 14.9044 1 12.0138ZM1.5482 5.08659C1.5482 5.18626 1.5482 5.28593 1.5482 5.3856C1.5482 10.4689 1.5482 15.5522 1.5482 20.6355C1.5482 21.7818 2.29575 22.5293 3.44198 22.5293C9.0735 22.5293 14.705 22.5293 20.3365 22.5293C21.5326 22.5293 22.2303 21.7818 22.2303 20.6355C22.2303 15.5522 22.2303 10.4689 22.2303 5.3856C22.2303 5.28593 22.2303 5.23609 22.2303 5.13642C15.303 5.08658 8.42562 5.08659 1.5482 5.08659ZM1.5482 4.53838C8.42562 4.53838 15.303 4.53838 22.1805 4.53838C22.1805 4.04002 22.1805 3.59149 22.1805 3.14297C22.1805 3.09313 22.1805 3.04329 22.1805 3.04329C22.031 2.0964 21.3333 1.5482 20.2867 1.5482C14.6552 1.5482 9.0735 1.5482 3.44198 1.5482C3.34231 1.5482 3.24264 1.5482 3.14297 1.5482C2.34558 1.59804 1.69771 2.14624 1.59804 2.89378C1.49836 3.44198 1.5482 3.99018 1.5482 4.53838Z" fill="#999999" stroke="#999999" stroke-width="0.5"/>
  <Path d="M9.07305 7.08008C10.4186 7.08008 11.7642 7.08008 13.1098 7.08008C14.2062 7.08008 14.8541 7.72795 14.8541 8.82435C14.8541 10.6683 14.8541 12.5621 14.8541 14.406C14.8541 15.5024 14.2062 16.1503 13.1098 16.1503C10.4186 16.1503 7.67763 16.1503 4.98646 16.1503C3.9399 16.1503 3.24219 15.5024 3.24219 14.406C3.24219 12.5621 3.24219 10.6683 3.24219 8.82435C3.24219 7.77779 3.89006 7.08008 4.93662 7.08008C6.33204 7.08008 7.67763 7.08008 9.07305 7.08008ZM14.1564 15.0041C14.2062 15.0041 14.2062 15.0041 14.256 14.9542C14.256 14.8047 14.3059 14.6054 14.3059 14.4559C14.3059 12.5621 14.3059 10.6185 14.3059 8.72468C14.3059 8.02697 13.8573 7.57844 13.1596 7.57844C10.4186 7.57844 7.67763 7.57844 4.93662 7.57844C4.23892 7.57844 3.74055 8.02697 3.74055 8.77452C3.74055 10.6683 3.74055 12.5621 3.74055 14.4559C3.74055 14.5555 3.74055 14.6552 3.79039 14.8047C3.89006 14.705 3.9399 14.6054 3.98973 14.5555C4.68744 13.6086 5.38515 12.6618 6.08286 11.7149C6.58123 11.0172 7.27894 11.0172 7.7773 11.7149C8.3255 12.4624 8.8737 13.21 9.4219 13.9575C9.47174 13.9575 9.47174 13.9575 9.47174 13.9077C9.82059 13.5588 10.2193 13.1601 10.5681 12.8113C11.0167 12.3627 11.5649 12.3627 12.0632 12.8113C12.6613 13.4093 13.2593 14.0073 13.8573 14.6054C13.9072 14.7549 14.0567 14.9044 14.1564 15.0041ZM4.03957 15.3031C4.33859 15.5523 4.63761 15.6519 4.98646 15.6519C6.58123 15.6519 8.17599 15.6519 9.77076 15.6519C9.82059 15.6519 9.92026 15.6519 9.9701 15.6519C9.92026 15.6021 9.87043 15.5523 9.87043 15.5024C9.02321 14.3562 8.17599 13.1601 7.32877 12.0139C7.02975 11.6152 6.78057 11.665 6.48155 12.0139C5.88352 12.8611 5.28548 13.6585 4.68744 14.5057C4.4881 14.7549 4.23892 15.0041 4.03957 15.3031ZM13.8573 15.5024C13.8573 15.4526 13.8573 15.4526 13.8573 15.4028C13.1098 14.6552 12.3124 13.8578 11.5649 13.1103C11.4154 12.9608 11.1662 12.9109 10.9668 13.1103C10.5183 13.509 10.1196 13.9575 9.67108 14.406C9.9701 14.8047 10.2193 15.2034 10.5183 15.6021C10.5681 15.6519 10.6678 15.7018 10.7176 15.7018C11.515 15.7018 12.3124 15.7018 13.1596 15.7018C13.4586 15.6519 13.658 15.5523 13.8573 15.5024Z" fill="#AAAAAA" stroke="#999999" stroke-width="0.3"/>
  <Path d="M10.3694 8.52539C11.0672 8.52539 11.5655 9.07359 11.5655 9.72146C11.5655 10.4192 11.0173 10.9674 10.3196 10.9175C9.67174 10.9175 9.12354 10.3693 9.12354 9.72146C9.17337 9.02375 9.67174 8.52539 10.3694 8.52539ZM11.0672 9.72146C11.0672 9.32277 10.7183 9.02375 10.3196 9.02375C9.92092 9.02375 9.6219 9.37261 9.6219 9.7713C9.6219 10.17 9.97075 10.469 10.3196 10.469C10.7681 10.4192 11.117 10.1202 11.0672 9.72146Z" fill="#999999"/>
  </Svg>

);

const MeIconActive = () => (
  <Svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M9.21828 0C9.61475 0.0886838 10.0269 0.140851 10.4129 0.266051C12.7083 1.0016 14.2367 3.26043 14.0542 5.60794C13.8559 8.10674 12.0614 10.0786 9.63562 10.4751C6.64124 10.9603 3.85552 8.82664 3.54774 5.80096C3.2556 2.93178 5.3475 0.339085 8.21146 0.0365168C8.26363 0.0313002 8.31058 0.0156501 8.36275 0C8.64445 0 8.93136 0 9.21828 0Z" fill="#007AFF"/>
<Path d="M8.785 19.9955C6.09319 19.9955 3.39616 19.9955 0.704346 19.9955C0.208761 19.9955 -0.00512364 19.7711 9.30499e-05 19.2755C0.0470433 15.5717 2.78581 12.3999 6.45836 11.8052C6.79223 11.7531 7.13131 11.727 7.4704 11.7218C8.3155 11.7113 9.1606 11.7113 10.0057 11.7166C13.407 11.7479 16.4014 14.0693 17.2934 17.3506C17.4656 17.987 17.5595 18.6339 17.5699 19.2964C17.5751 19.7659 17.3508 19.9955 16.8865 19.9955C14.1843 19.9955 11.4872 19.9955 8.785 19.9955Z" fill="#007AFF"/>
</Svg>

);

const Tab = createBottomTabNavigator();

const HubTabNavigation = ({ route }) => {
  const { service } = route.params || { service: 'BrainBox' };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999999',
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingTop: 5,
          paddingBottom: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(0, 0, 0, 0.1)',
        },
        tabBarLabel: ({ focused, color }) => {
          let label;
          switch (route.name) {
            case 'Apps':
              label = 'Apps';
              break;
            case 'Home':
              label = 'Home';
              break;
            case 'MyPosts':
              label = 'My Posts';
              break;
            case 'Me':
              label = 'Me';
              break;
          }
          return (
            <Text style={{ 
              color: focused ? '#007AFF' : '#999999',
              fontSize: 12,
              marginTop: 4
            }}>
              {label}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen
        name="Apps"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <AppsIconActive /> : <AppsIconInactive />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={ServiceStack}
        initialParams={{ service }}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <HomeIconActive /> : <HomeIconInactive />
          ),
        }}
      />
      <Tab.Screen
        name="MyPosts"
        component={MyPosts}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <MyPostsIconActive /> : <MyPostsIconInactive />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            focused ? <MeIconActive /> : <MeIconInactive />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HubTabNavigation;