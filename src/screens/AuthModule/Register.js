import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  FlatList,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';
import { postMethod } from '../../helpers';
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomText from '../../components/CustomText';


const { width, height } = Dimensions.get('window');

const UserIcon = () => (
  <Svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M7.80246 0C8.03582 0.0484342 8.27359 0.0880621 8.50255 0.140899C10.0965 0.515164 11.457 2.03424 11.6728 3.66339C11.8137 4.73334 11.6596 5.74606 11.052 6.6531C10.2462 7.85514 9.1366 8.55524 7.66596 8.65651C5.733 8.7886 4.14788 7.6526 3.42577 6.10711C2.74769 4.65849 3.02068 2.72993 4.08623 1.52788C4.73789 0.796962 5.52165 0.286202 6.49473 0.0880621C6.66205 0.0528373 6.82497 0.0264186 6.99229 0C7.26087 0 7.53387 0 7.80246 0Z" fill="#8D8D95"/>
<Path d="M7.49889 17.9999C6.07669 17.9999 4.65008 17.9999 3.22788 17.9999C2.49696 17.9999 1.81008 17.8546 1.20245 17.4231C0.515562 16.9299 0.110476 16.2562 0.0400261 15.4241C-0.0876641 13.9358 0.0840572 12.474 0.643252 11.0826C0.977888 10.2548 1.47544 9.53711 2.29442 9.1012C2.80518 8.82821 3.35557 8.69611 3.93237 8.70492C4.1129 8.70932 4.30664 8.79738 4.46955 8.88545C4.74255 9.03515 4.99352 9.22008 5.25771 9.37859C6.75917 10.2988 8.26063 10.2988 9.75769 9.36979C9.96463 9.2421 10.1804 9.11441 10.3741 8.96911C10.7352 8.70052 11.1271 8.66089 11.5586 8.72693C12.7254 8.89866 13.5532 9.53711 14.108 10.5542C14.6055 11.4657 14.8301 12.452 14.9269 13.4735C14.9798 13.9931 15.0018 14.5126 14.9974 15.0322C14.9798 16.6349 13.901 17.7973 12.3071 17.9647C12.1133 17.9867 11.9196 17.9955 11.7303 17.9955C10.3257 17.9999 8.91229 17.9999 7.49889 17.9999Z" fill="#8D8D95"/>
</Svg>

);

const EmailIcon = () => (
  <Svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M0 1.62136C0.0573909 1.44397 0.114782 1.2718 0.187825 1.04224C2.33216 3.22831 4.4504 5.38829 6.51126 7.49611C4.45562 9.5987 2.33216 11.7639 0.187825 13.9552C0.114782 13.7308 0.0573909 13.5535 0 13.3761C0 9.45783 0 5.5396 0 1.62136Z" fill="#8D8D95"/>
<Path d="M1.04346 0.139564C1.36693 0.0873908 1.6278 0.00391302 1.89389 0.00391302C7.74254 -0.00130434 13.586 -0.00130434 19.4346 0.00391302C19.7007 0.00391302 19.972 0.0873908 20.2903 0.144782C20.1964 0.249129 20.1494 0.301302 20.1025 0.348259C17.4312 3.00911 14.7547 5.66996 12.0834 8.3256C11.5095 8.8995 10.8312 9.12385 10.0538 8.84211C9.77731 8.74298 9.50601 8.56038 9.2921 8.35168C6.58429 5.67518 3.89213 2.98824 1.19476 0.30652C1.15824 0.269998 1.12693 0.233477 1.04346 0.139564Z" fill="#8D8D95"/>
<Path d="M1.16846 14.8526C3.27627 12.7031 5.39452 10.5431 7.52841 8.36743C7.83624 8.67526 8.11276 8.95699 8.39449 9.23351C8.82232 9.66655 9.32318 9.98481 9.92318 10.1205C11.0762 10.3813 12.0779 10.0839 12.9232 9.2596C13.2101 8.97786 13.4919 8.69091 13.7997 8.38308C15.9284 10.5587 18.0466 12.7187 20.1701 14.8839C19.9562 14.9152 19.6692 14.9935 19.3822 14.9935C17.9057 15.0039 16.424 14.9987 14.9475 14.9987C10.638 14.9987 6.3232 14.9987 2.01367 14.9987C1.68498 14.9987 1.38237 14.9622 1.16846 14.8526Z" fill="#8D8D95"/>
<Path d="M21.125 1.05249C21.2868 1.36553 21.3337 1.65249 21.3337 1.95509C21.3337 3.71856 21.3337 5.48203 21.3337 7.24549C21.3337 9.1707 21.3337 11.0907 21.3337 13.0159C21.3337 13.3237 21.292 13.6211 21.1302 13.9394C18.9963 11.7637 16.8781 9.60374 14.812 7.49592C16.8729 5.39333 18.9911 3.23335 21.125 1.05249Z" fill="#8D8D95"/>
  </Svg>
  
);

const LockIcon = () => (
  <Svg width="13" height="17" viewBox="0 0 13 17" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M1.82414 6.35918C1.82414 6.27811 1.82414 6.19704 1.82414 6.13623C1.84441 5.32551 1.80387 4.53504 1.86468 3.72432C2.02682 1.94071 3.48613 0.400328 5.24947 0.0760367C7.56005 -0.349596 9.70848 1.04891 10.2152 3.33922C10.276 3.60271 10.3165 3.86619 10.3165 4.12968C10.3165 4.77826 10.2963 5.42685 10.2963 6.07543C10.2963 6.17677 10.2557 6.25784 10.2355 6.35918C10.7624 6.35918 11.2083 6.52133 11.5934 6.88616C11.9583 7.23072 12.1407 7.65635 12.1407 8.16306C12.1407 10.5142 12.1407 12.8653 12.1407 15.2164C12.1407 16.1893 11.3299 17 10.3571 17C7.49924 17 4.64142 17 1.7836 17C0.810729 17 0 16.1893 0 15.2164C0 12.8653 0 10.5142 0 8.16306C0 7.23072 0.729656 6.48079 1.66199 6.37945C1.7228 6.37945 1.76334 6.35918 1.82414 6.35918ZM3.01996 6.37945C3.16184 6.37945 3.22265 6.37945 3.28345 6.37945C4.31713 6.37945 5.35081 6.37945 6.40476 6.37945C7.09388 6.37945 7.80327 6.37945 8.49238 6.37945C8.83694 6.37945 9.1207 6.1565 9.1207 5.83221C9.1207 5.16336 9.16124 4.49451 9.08016 3.84593C8.91802 2.40688 7.68166 1.29213 6.24261 1.23133C4.74276 1.17052 3.36452 2.16366 3.14157 3.60271C2.9997 4.49451 3.04023 5.42685 3.01996 6.37945ZM6.08047 12.5815C6.74932 12.5815 7.29656 12.0343 7.29656 11.3654C7.29656 10.6966 6.74932 10.1493 6.08047 10.1493C5.41161 10.1493 4.86437 10.6966 4.86437 11.3452C4.86437 12.0343 5.41161 12.5815 6.08047 12.5815Z" fill="#8D8D95"/>
  </Svg>
  
  
);

const PhoneIcon = () => (
  <Svg width="14" height="23" viewBox="0 0 14 23" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M13.2312 4.8078C13.6522 4.94361 13.7405 5.05905 13.7405 5.48686C13.7405 5.86714 13.7405 6.24742 13.7405 6.6277C13.7405 7.08946 13.6794 7.17774 13.2312 7.34751C13.2312 7.43578 13.2312 7.53764 13.2312 7.6395C13.2312 11.9244 13.2312 16.2093 13.2312 20.501C13.2312 21.7709 12.4299 22.742 11.2144 22.966C11.0514 22.9932 10.8748 23 10.7119 23C8.15858 23 5.61208 23 3.05878 23C1.54446 23 0.519073 21.9746 0.519073 20.4671C0.519073 17.194 0.519073 13.9277 0.519073 10.6546C0.519073 10.5527 0.519073 10.4508 0.519073 10.3286C0.0573076 10.2539 -0.0173897 9.94154 0.00298232 9.54089C0.0233543 9.16741 0.00298222 8.79392 0.00977289 8.42043C0.00977289 8.04694 0.125214 7.91113 0.519073 7.80927C0.519073 7.73457 0.519073 7.65309 0.519073 7.5716C0.519073 7.4969 0.519073 7.4222 0.519073 7.3543C0.0505169 7.16416 0.00977289 7.10304 0.00977289 6.58695C0.00977289 6.21346 0.00977289 5.83998 0.00977289 5.46649C0.00977289 5.05226 0.104842 4.92324 0.519073 4.8078C0.519073 4.02008 0.512283 3.22557 0.519073 2.42427C0.532655 1.20195 1.35433 0.237673 2.55627 0.0271627C2.71246 -2.63091e-08 2.87544 0 3.03841 0C5.5985 0 8.15858 0 10.7119 0C12.2058 0 13.2312 1.02539 13.238 2.51934C13.2312 3.29348 13.2312 4.05403 13.2312 4.8078ZM4.0638 0.998229C3.71069 0.998229 3.40511 0.998229 3.09274 0.998229C2.08772 1.00502 1.5173 1.57544 1.5173 2.57366C1.5173 3.77561 1.5173 4.97756 1.5173 6.1863C1.5173 10.9398 1.5173 15.6932 1.5173 20.4467C1.5173 21.4042 2.08093 22.0086 3.00446 22.0086C5.5917 22.0154 8.17216 22.0154 10.7594 22.0086C11.2076 22.0086 11.5879 21.8592 11.8867 21.5196C12.1787 21.1937 12.2398 20.8066 12.2398 20.3856C12.2398 14.4641 12.2398 8.54266 12.2398 2.6212C12.2398 2.51255 12.2398 2.4039 12.2262 2.28846C12.1787 1.77916 11.9206 1.39209 11.4656 1.1612C10.902 0.869206 10.2908 1.03897 9.70006 0.991438C9.69327 1.10688 9.68648 1.1612 9.68648 1.22232C9.6729 2.07795 9.65252 2.09832 8.79011 2.09832C7.39123 2.09832 5.99235 2.09832 4.59348 2.09832C4.23357 2.09832 4.07059 1.94213 4.0638 1.6026C4.05701 1.41246 4.0638 1.22911 4.0638 0.998229Z" fill="#8D8D95"/>
  </Svg>
  
);

const CalendarIcon = () => (
  <Svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M4.68975 1.43939C4.68975 1.19949 4.68975 0.959596 4.68975 0.767677C4.68975 0.335859 4.97763 0.0479798 5.40945 0C5.84127 0 6.12915 0.335859 6.12915 0.767677C6.12915 1.00758 6.12915 1.19949 6.12915 1.43939C8.04834 1.43939 9.96753 1.43939 11.8867 1.43939C11.8867 1.24747 11.8867 1.05556 11.8867 0.863636C11.8867 0.383838 12.1746 0.0479798 12.6064 0.0479798C12.9903 -4.64721e-08 13.2781 0.335858 13.2781 0.815656C13.2781 1.00758 13.2781 1.19949 13.2781 1.39141C13.566 1.39141 13.8539 1.39141 14.1898 1.39141C14.7175 1.39141 15.2453 1.48737 15.7251 1.72727C17.0206 2.39899 17.7403 3.45455 17.8362 4.89394C18.0281 8.01263 18.0281 11.0833 17.8842 14.202C17.8362 14.8258 17.8362 15.4495 17.6923 16.0732C17.3564 17.6086 16.013 18.7121 14.4297 18.8081C11.6468 19 8.864 19.048 6.12915 18.952C5.12157 18.904 4.114 18.904 3.1544 18.7601C1.57107 18.5682 0.323592 17.1288 0.179652 15.4975C-0.0122669 12.2828 -0.0602466 9.11616 0.0836928 5.90152C0.131673 5.27778 0.131673 4.70202 0.275612 4.07828C0.611471 2.59091 2.09884 1.43939 3.68218 1.43939C4.01804 1.43939 4.30592 1.43939 4.68975 1.43939ZM1.52309 7.19697C1.52309 7.24495 1.52309 7.29293 1.52309 7.29293C1.42713 10.0278 1.47511 12.7146 1.66703 15.4495C1.71501 16.5051 2.57864 17.3207 3.6342 17.4167C4.30591 17.4646 4.97763 17.4646 5.64935 17.5126C8.57612 17.6566 11.5509 17.6086 14.4776 17.4167C15.5332 17.3687 16.3488 16.5051 16.4448 15.4495C16.6367 12.7146 16.6367 10.0278 16.5887 7.29293C16.5887 7.24495 16.5887 7.19697 16.5408 7.14899C11.4549 7.19697 6.51299 7.19697 1.52309 7.19697ZM16.4448 5.7096C16.3968 5.2298 16.3968 4.79798 16.3009 4.36616C15.965 3.16667 14.6216 2.49495 13.3261 2.87879C13.3261 3.07071 13.3261 3.26263 13.3261 3.50253C13.3261 3.98232 13.0382 4.31818 12.6064 4.31818C12.1746 4.31818 11.8867 3.98232 11.8867 3.5505C11.8867 3.35859 11.8867 3.11869 11.8867 2.92677C9.96753 2.92677 8.04834 2.92677 6.12915 2.92677C6.12915 3.16667 6.12915 3.40657 6.12915 3.59848C6.12915 4.0303 5.84127 4.31818 5.40945 4.36616C4.97763 4.36616 4.68975 4.0303 4.68975 3.59848C4.68975 3.35859 4.68975 3.16667 4.68975 2.92677C4.3539 2.92677 4.01804 2.92677 3.73016 2.92677C3.29834 2.92677 2.9145 3.07071 2.57864 3.31061C1.66703 3.93434 1.57107 4.79798 1.61905 5.80556C6.51299 5.7096 11.4549 5.7096 16.4448 5.7096Z" fill="#8D8D95"/>
  <Path d="M5.40945 9.35596C5.98521 9.35596 6.51298 9.83575 6.465 10.4595C6.465 11.0352 5.98521 11.515 5.40945 11.515C4.83369 11.515 4.30591 11.0353 4.35389 10.4115C4.30591 9.83576 4.78571 9.35596 5.40945 9.35596Z" fill="#8D8D95"/>
  <Path d="M10.0637 10.4115C10.0637 10.9873 9.58395 11.515 9.00819 11.515C8.43244 11.515 7.95264 11.0352 7.95264 10.4595C7.95264 9.88373 8.43244 9.35596 9.00819 9.35596C9.58395 9.35596 10.0637 9.83576 10.0637 10.4115Z" fill="#8D8D95"/>
  <Path d="M12.5586 9.35596C13.1344 9.35596 13.6621 9.83575 13.6141 10.4595C13.6141 11.0352 13.1344 11.515 12.5586 11.515C11.9828 11.515 11.4551 11.0353 11.503 10.4115C11.503 9.78778 11.9828 9.35596 12.5586 9.35596Z" fill="#8D8D95"/>
  <Path d="M6.46475 14.0099C6.46475 14.5857 5.98496 15.1134 5.36122 15.0655C4.78546 15.0655 4.30566 14.5857 4.30566 13.9619C4.30566 13.3862 4.78546 12.8584 5.4092 12.9064C5.98496 12.9543 6.46475 13.4341 6.46475 14.0099Z" fill="#8D8D95"/>
  <Path d="M10.0634 14.0103C10.0634 14.586 9.58359 15.1138 8.95985 15.1138C8.3841 15.1138 7.9043 14.634 7.9043 14.0583C7.9043 13.4825 8.3841 12.9547 9.00783 12.9547C9.58359 12.9067 10.0634 13.3865 10.0634 14.0103Z" fill="#8D8D95"/>
  <Path d="M13.662 14.0099C13.662 14.5857 13.1822 15.0655 12.6065 15.0655C12.0307 15.0655 11.5029 14.5857 11.5029 13.9619C11.5029 13.3862 11.9827 12.8584 12.6065 12.9064C13.1822 12.9543 13.662 13.4341 13.662 14.0099Z" fill="#8D8D95"/>
  </Svg>
  
);

const GenderIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M12.6734 10.4052C13.7481 9.33047 14.8078 8.27077 15.8725 7.20107C15.8176 7.20107 15.7626 7.20107 15.7026 7.20107C15.2577 7.20107 14.8178 7.20607 14.373 7.20107C14.0431 7.19607 13.7881 6.93615 13.7831 6.62123C13.7731 6.30132 14.0181 6.0164 14.343 6.0114C15.3677 6.00141 16.3874 6.00141 17.4121 6.0114C17.727 6.0164 17.972 6.27633 17.972 6.60124C17.977 7.60096 17.977 8.59568 17.972 9.5954C17.972 9.9403 17.697 10.2052 17.3671 10.2002C17.0422 10.1952 16.7823 9.93531 16.7773 9.5954C16.7723 9.16052 16.7773 8.72065 16.7773 8.28577C16.7773 8.22578 16.7773 8.1658 16.7773 8.12581C15.7176 9.18552 14.6529 10.2502 13.5832 11.3149C15.0678 13.3693 14.348 15.9936 12.6335 17.2183C10.9539 18.4179 8.61458 18.223 7.16498 16.7284C5.71039 15.2338 5.58543 12.8845 6.85507 11.2349C8.13971 9.55541 10.689 8.97058 12.6734 10.4052ZM13.1833 13.7892C13.1783 12.1347 11.8387 10.7951 10.1991 10.7951C8.5296 10.7951 7.19497 12.1347 7.19497 13.8092C7.19997 15.4538 8.55459 16.7934 10.2141 16.7834C11.8487 16.7784 13.1883 15.4238 13.1833 13.7892Z" fill="#8D8D95"/>
  <Path d="M1.39676 9.80532C1.09685 9.5104 0.836919 9.25047 0.576992 8.99055C0.292072 8.70563 0.272077 8.35073 0.522007 8.0958C0.771937 7.84087 1.13184 7.86086 1.41676 8.14079C1.67668 8.40071 1.93661 8.66564 2.23153 8.96556C2.97132 8.21077 3.70112 7.46597 4.42591 6.72118C2.95133 4.67676 3.58115 2.08248 5.30567 0.817837C7.01019 -0.431813 9.37953 -0.231869 10.8441 1.2977C12.3037 2.82727 12.3937 5.19661 11.0591 6.85115C9.74442 8.48069 7.25512 8.98555 5.31067 7.59094C4.57587 8.32573 3.84108 9.06053 3.08629 9.82032C3.34122 10.0702 3.61614 10.3452 3.89106 10.6201C4.06102 10.785 4.126 10.985 4.06601 11.2149C3.94605 11.6548 3.4162 11.8048 3.08129 11.4948C2.83136 11.2599 2.59643 11.01 2.35149 10.7701C2.30651 10.7251 2.26152 10.6851 2.20654 10.6351C1.82164 11.02 1.45175 11.4049 1.06186 11.7748C0.956885 11.8747 0.806927 11.9597 0.661968 11.9847C0.412038 12.0347 0.177104 11.8897 0.0621359 11.6648C-0.0528319 11.4349 -0.0178417 11.1699 0.177104 10.975C0.517009 10.6301 0.861912 10.2852 1.20682 9.94528C1.2618 9.90029 1.32178 9.8603 1.39676 9.80532ZM7.78497 7.20105C9.44451 7.20105 10.7841 5.86642 10.7891 4.20689C10.7941 2.55235 9.44951 1.21273 7.78997 1.21273C6.15543 1.20773 4.80581 2.55235 4.80581 4.18689C4.80081 5.85143 6.13543 7.20105 7.78497 7.20105Z" fill="#8D8D95"/>
  </Svg>
  

);

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const genderOptions = ['Select Gender', 'Male', 'Female', 'Other'];

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  const handleSkip = () => {
    // Navigate to the Home screen without registering
    navigation.replace('Home');
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

 

const onRegister = async () => {
  if (!firstName.trim()) {
    Alert.alert('Validation Error', 'First Name is required.');
    return;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    Alert.alert('Validation Error', 'Phone Number must be 10 digits.');
    return;
  }

  try {
    console.log('Registering user...');
    const registerResponse = await postMethod({
      url: 'customers/',
      payload: {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        dob,
        gender,
        userType: 'Customer'
      },
      token: ''
    });

    console.log('Register response:', registerResponse);

    if (registerResponse && registerResponse.success) {
      console.log('User registered successfully');
      Alert.alert(
        'Success', 
        'Registration successful. You can now log in with your credentials.'
      );
      navigation.navigate('Login');
    } else {
      throw new Error(registerResponse ? registerResponse.message : 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    Alert.alert('Error', error.message || 'An unexpected error occurred during registration');
  }
};

// ... rest of the code ...
  
  const onChangeDob = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
        setDob(formattedDate);
    }
};

  const renderGenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.genderItem}
      onPress={() => {
        setGender(item);
        setShowGenderModal(false);
      }}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.topCircle} />
            <View style={styles.bottomCircle} />
  
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Welcome,</Text>
                <Text style={styles.subHeaderText}>Let's onboard you!</Text>
              </View>
            </View>
  
            <View style={styles.formContainer}>
              <TextInput
                theme={{
                  colors: {
                    primary: '#29BDEE',
                  },
                }}
                placeholder="Name"
                labelStyle={{color: '#CCCCCC'}}
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                placeholderTextColor="#CCCCCC"
                left={<TextInput.Icon icon={() => <UserIcon />} />}
              />
              <TextInput
                theme={{
                  colors: {
                    primary: '#29BDEE',
                  },
                }}
                placeholder="Email"
                labelStyle={{color: '#CCCCCC'}}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                placeholderTextColor="#CCCCCC"
                left={<TextInput.Icon icon={() => <EmailIcon />} />}
              />
              <TextInput
                theme={{
                  colors: {
                    primary: '#29BDEE',
                  },
                }}
                placeholder="Mobile Number"
                labelStyle={{color: '#CCCCCC'}}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.input}
                placeholderTextColor="#CCCCCC"
                left={<TextInput.Icon icon={() => <PhoneIcon />} />}
                keyboardType="phone-pad"
              />
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <TextInput
                  theme={{
                    colors: {
                      primary: '#29BDEE',
                    },
                  }}
                  placeholder="Date of Birth"
                  labelStyle={{color: '#CCCCCC'}}
                  value={dob}
                  editable={false}
                  placeholderTextColor="#CCCCCC"
                  style={styles.input}
                  left={<TextInput.Icon icon={() => <CalendarIcon />} />}
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dob ? new Date(dob.split('-').reverse().join('-')) : new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeDob}
                  maximumDate={new Date()}
                  disabled={false}
                />
              )}
  
              <TouchableOpacity onPress={() => setShowGenderModal(true)}>
                <TextInput
                  theme={{
                    colors: {
                      primary: '#29BDEE',
                    },
                  }}
                  placeholder="Gender"
                  labelStyle={{color: '#CCCCCC'}}
                  value={gender}
                  placeholderTextColor="#CCCCCC"
                  editable={false}
                  style={styles.input}
                  left={<TextInput.Icon icon={() => <GenderIcon />} />}
                  right={<TextInput.Icon icon="chevron-down" />}
                />
              </TouchableOpacity>
              <TextInput
                theme={{
                  colors: {
                    primary: '#29BDEE',
                  },
                }}
                placeholder="Password"
                labelStyle={{color: '#CCCCCC'}}
                value={password}
                placeholderTextColor="#CCCCCC"
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon={() => <LockIcon />} />}
                right={<TextInput.Icon icon={showPassword ? "eye" : "eye-off"} onPress={togglePasswordVisibility} />}
              />
            </View>
  
            <TouchableOpacity style={styles.registerButton} onPress={onRegister}>
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
  
            <Text style={styles.loginPromptText}>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Log In
              </Text>
            </Text>
  
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
  
            <Text style={styles.termsText}>
              By Signing up you agree to{'\n'}
              <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        visible={showGenderModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={genderOptions}
              renderItem={renderGenderItem}
              keyExtractor={(item) => item}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowGenderModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
 
  },
  
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',  
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    padding: 20,
    // paddingTop: 40,
    marginLeft: 20,
    paddingBottom: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  genderItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  genderItemText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#29BDEE',
    fontSize: 16,
  },
  topCircle: {
    position: 'absolute',
    width: width * 0.4,
    top: width * 0.32,
    height: width * 0.4,
    right: -width * 0.29,
    // top: -width * -0.05,
    backgroundColor: 'rgba(255, 139, 54, 0.3)',
    borderRadius: width * 0.2,
  },
  bottomCircle: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    left: -width * 0.3,
    bottom: -width * 0.3,
    backgroundColor: 'rgba(154, 175, 250, 0.67)',
    borderRadius: width * 0.3,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
     
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#29BDEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 50,
    height: 50,
    tintColor: 'white',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: 40,  
  },
  input: {
    marginBottom: 15,
    marginTop: 20,
    width: '93%',
    backgroundColor: 'transparent',
    height: 50,
  },
  registerButton: {
    backgroundColor: '#29BDEE',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 20,
    marginLeft: '25%',
    width: '50%',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#29BDEE',
    fontWeight: 'bold',
  },
  skipText: {
    fontSize: 14,
    color: '#29BDEE',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '400',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 20,
  },
  termsLink: {
    color: '#29BDEE',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,  
  },
  logoContainer: {
    width: 90,
    height: 90,
    backgroundColor: '#00BFFF',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontFamily: 'Arial',
    fontWeight: '600',
    fontSize: 40,
    color: '#00BFFF',
  },
  subHeaderText: {
    fontFamily: 'Arial',
    fontWeight: '400',
    fontSize: 16,
    color: '#000000',
    marginTop: 5,
  },
});

export default Register;