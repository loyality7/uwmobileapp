import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Alert, useWindowDimensions } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RadioButton } from 'react-native-paper';
import { getMethod, postMethod, putMethod } from "../../helpers";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const LockIcon = () => (
  <Svg width="15" height="20" viewBox="0 0 15 20" fill="none">
    <Path 
      d="M2.94141 19.2754C2.22526 19.2754 1.67839 19.0801 1.30078 18.6895C0.929688 18.3053 0.744141 17.7259 0.744141 16.9512V10.2227C0.744141 9.45443 0.929688 8.87826 1.30078 8.49414C1.67839 8.10352 2.22526 7.9082 2.94141 7.9082H11.877C12.5931 7.9082 13.1367 8.10352 13.5078 8.49414C13.8854 8.87826 14.0742 9.45443 14.0742 10.2227V16.9512C14.0742 17.7259 13.8854 18.3053 13.5078 18.6895C13.1367 19.0801 12.5931 19.2754 11.877 19.2754H2.94141ZM2.99023 17.8008H11.8281C12.043 17.8008 12.2057 17.7357 12.3164 17.6055C12.4336 17.4818 12.4922 17.2995 12.4922 17.0586V10.1152C12.4922 9.87435 12.4336 9.69206 12.3164 9.56836C12.2057 9.44466 12.043 9.38281 11.8281 9.38281H2.99023C2.7819 9.38281 2.61914 9.44466 2.50195 9.56836C2.38477 9.69206 2.32617 9.87435 2.32617 10.1152V17.0586C2.32617 17.2995 2.38477 17.4818 2.50195 17.6055C2.61914 17.7357 2.7819 17.8008 2.99023 17.8008ZM2.45312 8.66016V5.57422C2.45312 4.35026 2.6875 3.33464 3.15625 2.52734C3.63151 1.72005 4.24674 1.11784 5.00195 0.720703C5.75716 0.323568 6.55794 0.125 7.4043 0.125C8.25716 0.125 9.0612 0.323568 9.81641 0.720703C10.5716 1.11784 11.1836 1.72005 11.6523 2.52734C12.1276 3.33464 12.3652 4.35026 12.3652 5.57422V8.66016H10.8223V5.36914C10.8223 4.54883 10.6628 3.85872 10.3438 3.29883C10.0312 2.73893 9.61458 2.31576 9.09375 2.0293C8.57943 1.74284 8.01628 1.59961 7.4043 1.59961C6.79883 1.59961 6.23568 1.74284 5.71484 2.0293C5.20052 2.31576 4.78711 2.73893 4.47461 3.29883C4.16211 3.85872 4.00586 4.54883 4.00586 5.36914V8.66016H2.45312Z"
      fill="black"
    />
  </Svg>
);

const QRCodeIcon = () => (
  <Svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M2.58984 9.20703C1.88672 9.20703 1.35938 9.03125 1.00781 8.67969C0.66276 8.32812 0.490234 7.78776 0.490234 7.05859V2.98633C0.490234 2.25716 0.66276 1.72005 1.00781 1.375C1.35938 1.02344 1.88672 0.847656 2.58984 0.847656H6.74023C7.44336 0.847656 7.9707 1.02344 8.32227 1.375C8.67383 1.72005 8.84961 2.25716 8.84961 2.98633V7.05859C8.84961 7.78776 8.67383 8.32812 8.32227 8.67969C7.9707 9.03125 7.44336 9.20703 6.74023 9.20703H2.58984ZM2.56055 7.6543H6.76953C6.94531 7.6543 7.07878 7.60872 7.16992 7.51758C7.26107 7.42643 7.30664 7.28971 7.30664 7.10742V2.92773C7.30664 2.74544 7.26107 2.61198 7.16992 2.52734C7.07878 2.4362 6.94531 2.39062 6.76953 2.39062H2.56055C2.38477 2.39062 2.2513 2.4362 2.16016 2.52734C2.07552 2.61198 2.0332 2.74544 2.0332 2.92773V7.10742C2.0332 7.28971 2.07552 7.42643 2.16016 7.51758C2.2513 7.60872 2.38477 7.6543 2.56055 7.6543ZM3.79102 6.10156C3.6543 6.10156 3.58594 6.02018 3.58594 5.85742V4.16797C3.58594 4.01823 3.6543 3.94336 3.79102 3.94336H5.5293C5.67253 3.94336 5.74414 4.01823 5.74414 4.16797V5.85742C5.74414 6.02018 5.67253 6.10156 5.5293 6.10156H3.79102ZM12.4727 9.20703C11.7695 9.20703 11.2422 9.03125 10.8906 8.67969C10.5391 8.32812 10.3633 7.78776 10.3633 7.05859V2.98633C10.3633 2.25716 10.5391 1.72005 10.8906 1.375C11.2422 1.02344 11.7695 0.847656 12.4727 0.847656H16.623C17.3262 0.847656 17.8503 1.02344 18.1953 1.375C18.5469 1.72005 18.7227 2.25716 18.7227 2.98633V7.05859C18.7227 7.78776 18.5469 8.32812 18.1953 8.67969C17.8503 9.03125 17.3262 9.20703 16.623 9.20703H12.4727ZM12.4434 7.6543H16.6523C16.8346 7.6543 16.9681 7.60872 17.0527 7.51758C17.1374 7.42643 17.1797 7.28971 17.1797 7.10742V2.92773C17.1797 2.74544 17.1374 2.61198 17.0527 2.52734C16.9681 2.4362 16.8346 2.39062 16.6523 2.39062H12.4434C12.2611 2.39062 12.1243 2.4362 12.0332 2.52734C11.9486 2.61198 11.9062 2.74544 11.9062 2.92773V7.10742C11.9062 7.28971 11.9486 7.42643 12.0332 7.51758C12.1243 7.60872 12.2611 7.6543 12.4434 7.6543ZM13.7129 6.10156C13.5892 6.10156 13.5273 6.02018 13.5273 5.85742V4.16797C13.5273 4.01823 13.5892 3.94336 13.7129 3.94336H15.4609C15.6042 3.94336 15.6758 4.01823 15.6758 4.16797V5.85742C15.6758 6.02018 15.6042 6.10156 15.4609 6.10156H13.7129ZM2.58984 19.0801C1.88672 19.0801 1.35938 18.9043 1.00781 18.5527C0.66276 18.2077 0.490234 17.6706 0.490234 16.9414V12.8594C0.490234 12.1367 0.66276 11.5996 1.00781 11.248C1.35938 10.8965 1.88672 10.7207 2.58984 10.7207H6.74023C7.44336 10.7207 7.9707 10.8965 8.32227 11.248C8.67383 11.5996 8.84961 12.1367 8.84961 12.8594V16.9414C8.84961 17.6706 8.67383 18.2077 8.32227 18.5527C7.9707 18.9043 7.44336 19.0801 6.74023 19.0801H2.58984ZM2.56055 17.5371H6.76953C6.94531 17.5371 7.07878 17.4915 7.16992 17.4004C7.26107 17.3092 7.30664 17.1758 7.30664 17V12.8105C7.30664 12.6283 7.26107 12.4915 7.16992 12.4004C7.07878 12.3092 6.94531 12.2637 6.76953 12.2637H2.56055C2.38477 12.2637 2.2513 12.3092 2.16016 12.4004C2.07552 12.4915 2.0332 12.6283 2.0332 12.8105V17C2.0332 17.1758 2.07552 17.3092 2.16016 17.4004C2.2513 17.4915 2.38477 17.5371 2.56055 17.5371ZM3.79102 15.9844C3.6543 15.9844 3.58594 15.903 3.58594 15.7402V14.0508C3.58594 13.901 3.6543 13.8262 3.79102 13.8262H5.5293C5.67253 13.8262 5.74414 13.901 5.74414 14.0508V15.7402C5.74414 15.903 5.67253 15.9844 5.5293 15.9844H3.79102ZM11.0566 13.3281C10.9199 13.3281 10.8516 13.25 10.8516 13.0938V11.4043C10.8516 11.2546 10.9199 11.1797 11.0566 11.1797H12.7949C12.9316 11.1797 13 11.2546 13 11.4043V13.0938C13 13.25 12.9316 13.3281 12.7949 13.3281H11.0566ZM16.2812 13.3281C16.1445 13.3281 16.0762 13.25 16.0762 13.0938V11.4043C16.0762 11.2546 16.1445 11.1797 16.2812 11.1797H18.0195C18.1562 11.1797 18.2246 11.2546 18.2246 11.4043V13.0938C18.2246 13.25 18.1562 13.3281 18.0195 13.3281H16.2812ZM13.6934 15.9551C13.5566 15.9551 13.4883 15.8737 13.4883 15.7109V14.0215C13.4883 13.8717 13.5566 13.7969 13.6934 13.7969H15.4316C15.5684 13.7969 15.6367 13.8717 15.6367 14.0215V15.7109C15.6367 15.8737 15.5684 15.9551 15.4316 15.9551H13.6934ZM11.0566 18.5625C10.9199 18.5625 10.8516 18.4844 10.8516 18.3281V16.6289C10.8516 16.4792 10.9199 16.4043 11.0566 16.4043H12.7949C12.9316 16.4043 13 16.4792 13 16.6289V18.3281C13 18.4844 12.9316 18.5625 12.7949 18.5625H11.0566ZM16.2812 18.5625C16.1445 18.5625 16.0762 18.4844 16.0762 18.3281V16.6289C16.0762 16.4792 16.1445 16.4043 16.2812 16.4043H18.0195C18.1562 16.4043 18.2246 16.4792 18.2246 16.6289V18.3281C18.2246 18.4844 18.1562 18.5625 18.0195 18.5625H16.2812Z" fill="black"/>
  </Svg>
);

const CashOnDeliveryIcon = () => (
  <Svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M12.8359 21.0371C11.7812 21.0371 10.7559 20.8743 9.75977 20.5488C8.77018 20.2298 7.85872 19.7741 7.02539 19.1816C6.19206 18.5892 5.48242 17.8958 4.89648 17.1016C4.68164 16.8346 4.59049 16.5612 4.62305 16.2812C4.6556 16.0013 4.78581 15.7799 5.01367 15.6172C5.25456 15.4479 5.50521 15.3926 5.76562 15.4512C6.02604 15.5098 6.25391 15.653 6.44922 15.8809C6.9375 16.5254 7.51042 17.0853 8.16797 17.5605C8.83203 18.0293 9.55794 18.3939 10.3457 18.6543C11.1335 18.9147 11.9635 19.0449 12.8359 19.0449C13.9557 19.0449 15.0039 18.8333 15.9805 18.4102C16.957 17.9935 17.8164 17.4141 18.5586 16.6719C19.3073 15.9297 19.89 15.0703 20.3066 14.0938C20.7233 13.1172 20.9316 12.069 20.9316 10.9492C20.9316 9.82943 20.7233 8.78125 20.3066 7.80469C19.89 6.82161 19.3073 5.96224 18.5586 5.22656C17.8164 4.48438 16.957 3.90495 15.9805 3.48828C15.0039 3.0651 13.9557 2.85352 12.8359 2.85352C11.7161 2.85352 10.6647 3.0651 9.68164 3.48828C8.70508 3.90495 7.8457 4.48438 7.10352 5.22656C6.36784 5.96224 5.78841 6.82161 5.36523 7.80469C4.94857 8.78125 4.74023 9.82943 4.74023 10.9492H2.74805C2.74805 9.55599 3.00846 8.25065 3.5293 7.0332C4.05013 5.80924 4.77279 4.73503 5.69727 3.81055C6.62826 2.88607 7.70247 2.16341 8.91992 1.64258C10.1374 1.12174 11.4427 0.861328 12.8359 0.861328C14.2292 0.861328 15.5345 1.12174 16.752 1.64258C17.9759 2.16341 19.0501 2.88607 19.9746 3.81055C20.8991 4.73503 21.6217 5.80924 22.1426 7.0332C22.6634 8.25065 22.9238 9.55599 22.9238 10.9492C22.9238 12.3424 22.6634 13.651 22.1426 14.875C21.6217 16.0924 20.8991 17.1602 19.9746 18.0781C19.0501 19.0026 17.9759 19.7253 16.752 20.2461C15.5345 20.7734 14.2292 21.0371 12.8359 21.0371ZM1.67383 9.01562H6.29297C6.52734 9.01562 6.70638 9.06771 6.83008 9.17188C6.95378 9.27604 7.01237 9.41276 7.00586 9.58203C7.00586 9.74479 6.9375 9.91732 6.80078 10.0996L4.54492 13.2637C4.38867 13.4785 4.20312 13.5892 3.98828 13.5957C3.77344 13.5957 3.58464 13.485 3.42188 13.2637L1.15625 10.1094C1.01953 9.92708 0.951172 9.7513 0.951172 9.58203C0.944661 9.41276 1 9.27604 1.11719 9.17188C1.24089 9.06771 1.42643 9.01562 1.67383 9.01562ZM11.9863 11.8281H11.5273L14.1641 14.3086C14.2422 14.3802 14.304 14.4616 14.3496 14.5527C14.4017 14.6374 14.4277 14.7285 14.4277 14.8262C14.4277 14.9889 14.3659 15.1289 14.2422 15.2461C14.1185 15.3633 13.9753 15.4219 13.8125 15.4219C13.6758 15.4219 13.5618 15.3926 13.4707 15.334C13.3796 15.2754 13.2884 15.2038 13.1973 15.1191L10.0527 12.1504C9.93555 12.0397 9.84115 11.9323 9.76953 11.8281C9.69792 11.724 9.66211 11.5938 9.66211 11.4375V11.3984C9.66211 11.2096 9.72396 11.0632 9.84766 10.959C9.97786 10.8483 10.1439 10.793 10.3457 10.793H11.6348C12.11 10.793 12.5137 10.6986 12.8457 10.5098C13.1842 10.321 13.3861 9.99219 13.4512 9.52344H10.0039C9.79557 9.52344 9.69141 9.42253 9.69141 9.2207C9.69141 9.01237 9.79557 8.9082 10.0039 8.9082H13.4609C13.3893 8.45247 13.1842 8.12695 12.8457 7.93164C12.5072 7.72982 12.1068 7.62891 11.6445 7.62891H10.1113C9.9681 7.62891 9.85417 7.58659 9.76953 7.50195C9.6849 7.41081 9.64258 7.29362 9.64258 7.15039V7.0918C9.64258 6.93555 9.6849 6.8151 9.76953 6.73047C9.85417 6.63932 9.9681 6.59375 10.1113 6.59375H15.6387C15.847 6.59375 15.9512 6.69792 15.9512 6.90625C15.9512 7.10807 15.847 7.20898 15.6387 7.20898H13.9688C14.2357 7.41732 14.4375 7.67122 14.5742 7.9707C14.7174 8.26367 14.8021 8.57617 14.8281 8.9082H15.6387C15.847 8.9082 15.9512 9.01237 15.9512 9.2207C15.9512 9.42253 15.847 9.52344 15.6387 9.52344H14.8184C14.7533 9.9987 14.5938 10.4056 14.3398 10.7441C14.0859 11.0827 13.7572 11.3464 13.3535 11.5352C12.9499 11.7174 12.4941 11.8151 11.9863 11.8281Z" fill="black"/>
  </Svg>
);

const NetBankingIcon = () => (
  <Svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M1.55078 18.0547V17.3955C1.55078 17.2021 1.60352 17.0527 1.70898 16.9473C1.82031 16.8359 1.97559 16.7803 2.1748 16.7803H2.67578V7.27051H1.91992C1.65039 7.27051 1.43945 7.18848 1.28711 7.02441C1.13477 6.85449 1.05859 6.66992 1.05859 6.4707C1.05859 6.16016 1.23438 5.90527 1.58594 5.70605L9.21484 1.30273C9.57227 1.08594 9.94727 0.977539 10.3398 0.977539C10.7266 0.977539 11.1074 1.08594 11.4824 1.30273L19.1113 5.70605C19.457 5.90527 19.6299 6.16016 19.6299 6.4707C19.6299 6.66992 19.5537 6.85449 19.4014 7.02441C19.2549 7.18848 19.0469 7.27051 18.7773 7.27051H18.0215V16.7803H18.5312C18.7246 16.7803 18.874 16.8359 18.9795 16.9473C19.0908 17.0527 19.1465 17.2021 19.1465 17.3955V18.0547H1.55078ZM4.13477 16.7803H16.5537V6.09277L10.6562 2.7793C10.5449 2.72656 10.4395 2.7002 10.3398 2.7002C10.2402 2.7002 10.1406 2.72656 10.041 2.7793L4.13477 6.09277V16.7803ZM1.03223 20.3311C0.81543 20.3311 0.62793 20.252 0.469727 20.0938C0.317383 19.9355 0.241211 19.7451 0.241211 19.5225C0.241211 19.3057 0.317383 19.1182 0.469727 18.96C0.62793 18.8076 0.81543 18.7314 1.03223 18.7314H19.5947C19.8115 18.7314 19.999 18.8076 20.1572 18.96C20.3213 19.1182 20.4033 19.3057 20.4033 19.5225C20.4033 19.7451 20.3213 19.9355 20.1572 20.0938C19.999 20.252 19.8115 20.3311 19.5947 20.3311H1.03223ZM9.58398 11.2959H9.1709L11.5439 13.5283C11.6143 13.5928 11.6699 13.666 11.7109 13.748C11.7578 13.8242 11.7812 13.9062 11.7812 13.9941C11.7812 14.1406 11.7256 14.2666 11.6143 14.3721C11.5029 14.4775 11.374 14.5303 11.2275 14.5303C11.1045 14.5303 11.002 14.5039 10.9199 14.4512C10.8379 14.3984 10.7559 14.334 10.6738 14.2578L7.84375 11.5859C7.73828 11.4863 7.65332 11.3896 7.58887 11.2959C7.52441 11.2021 7.49219 11.085 7.49219 10.9443V10.9092C7.49219 10.7393 7.54785 10.6074 7.65918 10.5137C7.77637 10.4141 7.92578 10.3643 8.10742 10.3643H9.26758C9.69531 10.3643 10.0586 10.2793 10.3574 10.1094C10.6621 9.93945 10.8438 9.64355 10.9023 9.22168H7.7998C7.6123 9.22168 7.51855 9.13086 7.51855 8.94922C7.51855 8.76172 7.6123 8.66797 7.7998 8.66797H10.9111C10.8467 8.25781 10.6621 7.96484 10.3574 7.78906C10.0527 7.60742 9.69238 7.5166 9.27637 7.5166H7.89648C7.76758 7.5166 7.66504 7.47852 7.58887 7.40234C7.5127 7.32031 7.47461 7.21484 7.47461 7.08594V7.0332C7.47461 6.89258 7.5127 6.78418 7.58887 6.70801C7.66504 6.62598 7.76758 6.58496 7.89648 6.58496H12.8711C13.0586 6.58496 13.1523 6.67871 13.1523 6.86621C13.1523 7.04785 13.0586 7.13867 12.8711 7.13867H11.3682C11.6084 7.32617 11.79 7.55469 11.9131 7.82422C12.042 8.08789 12.1182 8.36914 12.1416 8.66797H12.8711C13.0586 8.66797 13.1523 8.76172 13.1523 8.94922C13.1523 9.13086 13.0586 9.22168 12.8711 9.22168H12.1328C12.0742 9.64941 11.9307 10.0156 11.7021 10.3203C11.4736 10.625 11.1777 10.8623 10.8145 11.0322C10.4512 11.1963 10.041 11.2842 9.58398 11.2959Z" fill="black"/>
  </Svg>
);

const CardsIcon = () => (
  <Svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M3.71094 11.1797C3.48177 11.1797 3.29688 11.1094 3.15625 10.9688C3.01562 10.8281 2.94531 10.6484 2.94531 10.4297V8.98438C2.94531 8.76042 3.01562 8.58073 3.15625 8.44531C3.29688 8.30469 3.48177 8.23438 3.71094 8.23438H5.625C5.85417 8.23438 6.03906 8.30469 6.17969 8.44531C6.32031 8.58073 6.39062 8.76042 6.39062 8.98438V10.4297C6.39062 10.6484 6.32031 10.8281 6.17969 10.9688C6.03906 11.1094 5.85417 11.1797 5.625 11.1797H3.71094ZM0.875 5.67969V3.85156H17.6016V5.67969H0.875ZM2.55469 14.125C1.71094 14.125 1.07292 13.9115 0.640625 13.4844C0.208333 13.0573 -0.0078125 12.4271 -0.0078125 11.5938V3.14062C-0.0078125 2.30729 0.208333 1.67708 0.640625 1.25C1.07292 0.817708 1.71094 0.601562 2.55469 0.601562H15.9141C16.7578 0.601562 17.3958 0.817708 17.8281 1.25C18.2604 1.68229 18.4766 2.3125 18.4766 3.14062V11.5938C18.4766 12.4271 18.2604 13.0573 17.8281 13.4844C17.3958 13.9115 16.7578 14.125 15.9141 14.125H2.55469ZM2.64844 12.5938H15.8203C16.1797 12.5938 16.4557 12.5 16.6484 12.3125C16.8464 12.1198 16.9453 11.8359 16.9453 11.4609V3.28125C16.9453 2.90104 16.8464 2.61719 16.6484 2.42969C16.4557 2.23698 16.1797 2.14062 15.8203 2.14062H2.64844C2.28385 2.14062 2.00521 2.23698 1.8125 2.42969C1.625 2.61719 1.53125 2.90104 1.53125 3.28125V11.4609C1.53125 11.8359 1.625 12.1198 1.8125 12.3125C2.00521 12.5 2.28385 12.5938 2.64844 12.5938Z" fill="black"/>
</Svg>

);

const EMIIcon = () => (
  <Svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<Path d="M9.9375 3.875C9.23958 3.875 8.57552 3.98958 7.94531 4.21875C7.3151 4.44271 6.74219 4.7526 6.22656 5.14844C6.13281 5.21615 6.03385 5.2474 5.92969 5.24219C5.82552 5.23698 5.73177 5.19271 5.64844 5.10938L3.8125 3.26562C3.70833 3.17188 3.65885 3.0625 3.66406 2.9375C3.66927 2.8125 3.72396 2.70833 3.82812 2.625C4.65625 1.93229 5.59115 1.39062 6.63281 1C7.67448 0.604167 8.77604 0.40625 9.9375 0.40625C11.099 0.40625 12.2005 0.604167 13.2422 1C14.2839 1.39062 15.2188 1.93229 16.0469 2.625C16.151 2.70833 16.2031 2.8125 16.2031 2.9375C16.2083 3.0625 16.1641 3.17188 16.0703 3.26562L14.2266 5.10938C14.1484 5.19271 14.0573 5.23958 13.9531 5.25C13.8542 5.25521 13.7604 5.22396 13.6719 5.15625C13.151 4.75521 12.5729 4.44271 11.9375 4.21875C11.3073 3.98958 10.6406 3.875 9.9375 3.875ZM0.398438 9.94531C0.398438 8.78385 0.59375 7.68229 0.984375 6.64062C1.38021 5.59896 1.92448 4.66406 2.61719 3.83594C2.70573 3.73177 2.8099 3.67969 2.92969 3.67969C3.05469 3.67448 3.16667 3.72135 3.26562 3.82031L5.10938 5.66406C5.1875 5.74219 5.22656 5.83333 5.22656 5.9375C5.23177 6.04167 5.20052 6.13802 5.13281 6.22656C4.73177 6.74219 4.41927 7.31771 4.19531 7.95312C3.97135 8.58854 3.85938 9.2526 3.85938 9.94531C3.85938 10.6536 3.97396 11.3281 4.20312 11.9688C4.4375 12.6094 4.76823 13.2005 5.19531 13.7422C5.25781 13.8203 5.28646 13.9036 5.28125 13.9922C5.28125 14.0807 5.24479 14.1615 5.17188 14.2344L3.28906 16.1172C3.19531 16.2109 3.08594 16.2578 2.96094 16.2578C2.83594 16.2578 2.73177 16.2057 2.64844 16.1016C1.94531 15.2734 1.39323 14.3359 0.992188 13.2891C0.596354 12.237 0.398438 11.1224 0.398438 9.94531ZM19.4766 9.94531C19.4766 11.1224 19.276 12.2344 18.875 13.2812C18.4792 14.3281 17.9323 15.2682 17.2344 16.1016C17.1406 16.2057 17.0312 16.2578 16.9062 16.2578C16.7865 16.2578 16.6771 16.2109 16.5781 16.1172L14.6953 14.2344C14.6328 14.1615 14.599 14.0807 14.5938 13.9922C14.5885 13.9036 14.6172 13.8203 14.6797 13.7422C15.1068 13.2005 15.4349 12.6094 15.6641 11.9688C15.8984 11.3281 16.0156 10.6536 16.0156 9.94531C16.0156 9.2526 15.901 8.58854 15.6719 7.95312C15.4479 7.31771 15.138 6.74219 14.7422 6.22656C14.6693 6.13802 14.6328 6.04167 14.6328 5.9375C14.638 5.83333 14.6823 5.74219 14.7656 5.66406L16.6094 3.82031C16.7083 3.72135 16.8177 3.67188 16.9375 3.67188C17.0625 3.67188 17.1667 3.72396 17.25 3.82812C17.9479 4.66146 18.4922 5.59896 18.8828 6.64062C19.2786 7.68229 19.4766 8.78385 19.4766 9.94531ZM9.25 10.7109H8.88281L10.9922 12.6953C11.0547 12.7526 11.1042 12.8177 11.1406 12.8906C11.1823 12.9583 11.2031 13.0312 11.2031 13.1094C11.2031 13.2396 11.1536 13.3516 11.0547 13.4453C10.9557 13.5391 10.8411 13.5859 10.7109 13.5859C10.6016 13.5859 10.5104 13.5625 10.4375 13.5156C10.3646 13.4688 10.2917 13.4115 10.2188 13.3438L7.70312 10.9688C7.60938 10.8802 7.53385 10.7943 7.47656 10.7109C7.41927 10.6276 7.39062 10.5234 7.39062 10.3984V10.3672C7.39062 10.2161 7.4401 10.099 7.53906 10.0156C7.64323 9.92708 7.77604 9.88281 7.9375 9.88281H8.96875C9.34896 9.88281 9.67188 9.80729 9.9375 9.65625C10.2083 9.50521 10.3698 9.24219 10.4219 8.86719H7.66406C7.4974 8.86719 7.41406 8.78646 7.41406 8.625C7.41406 8.45833 7.4974 8.375 7.66406 8.375H10.4297C10.3724 8.01042 10.2083 7.75 9.9375 7.59375C9.66667 7.43229 9.34635 7.35156 8.97656 7.35156H7.75C7.63542 7.35156 7.54427 7.31771 7.47656 7.25C7.40885 7.17708 7.375 7.08333 7.375 6.96875V6.92188C7.375 6.79688 7.40885 6.70052 7.47656 6.63281C7.54427 6.5599 7.63542 6.52344 7.75 6.52344H12.1719C12.3385 6.52344 12.4219 6.60677 12.4219 6.77344C12.4219 6.9349 12.3385 7.01562 12.1719 7.01562H10.8359C11.0495 7.18229 11.2109 7.38542 11.3203 7.625C11.4349 7.85938 11.5026 8.10938 11.5234 8.375H12.1719C12.3385 8.375 12.4219 8.45833 12.4219 8.625C12.4219 8.78646 12.3385 8.86719 12.1719 8.86719H11.5156C11.4635 9.2474 11.3359 9.57292 11.1328 9.84375C10.9297 10.1146 10.6667 10.3255 10.3438 10.4766C10.0208 10.6224 9.65625 10.7005 9.25 10.7109Z" fill="black"/>
</Svg>

);

// Add this with your other SVG components at the top of the file
const PencilIcon = () => (
  <Svg width="25" height="25" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M3.71973 14.3252L1.52246 15.1602C1.38184 15.2188 1.25293 15.1865 1.13574 15.0635C1.01855 14.9463 0.989258 14.8145 1.04785 14.668L1.91797 12.5234L12.0166 2.4248L13.8184 4.23535L3.71973 14.3252ZM14.7061 3.35645L12.8955 1.5459L13.8887 0.561523C14.1348 0.321289 14.3896 0.192383 14.6533 0.174805C14.9229 0.157227 15.1689 0.262695 15.3916 0.491211L15.7695 0.869141C15.998 1.09766 16.1064 1.34375 16.0947 1.60742C16.083 1.86523 15.9541 2.12012 15.708 2.37207L14.7061 3.35645Z" fill="#29BDEE"/>
  </Svg>
  
);

const CheckoutOverview = ({ navigation, route }) => {
  const { cartData, addressData } = route.params;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(cartData.paymentMethod || 'upi');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [showMagicCoinsInput, setShowMagicCoinsInput] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [magicCoins, setMagicCoins] = useState('');
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const calculatedTotals = useMemo(() => {
    const itemTotal = cartData.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const delivery = 40;  
    const quantity = cartData.orderItems.reduce((total, item) => total + item.quantity, 0);
    const total = itemTotal + delivery;
    const balanceUsed = cartData.balanceUsed || 0;
    const discountApplied = cartData.discountApplied || 0;
    const orderTotal = total - balanceUsed - discountApplied;

    return {
      itemTotal,
      delivery,
      total,
      balanceUsed,
      discountApplied,
      orderTotal,
      quantity,
      itemCount: cartData.orderItems.length,
      totalQuantity: cartData.orderItems.reduce((total, item) => total + item.quantity, 0),
    };
  }, [cartData]);

  const handlePlaceOrder = async () => {
    try {
      const url = "customers/secure/cart/placeorder";
      const token = await AsyncStorage.getItem("@token");
      
      const response = await postMethod({ 
        url, 
        token, 
        payload: {
          cartData,
          addressData,
          paymentMethod
        }
      });

      if (response.success) {
        console.log("Order placed successfully:", response.data);
        setShowConfirmation(true);
        setTimeout(() => {
          navigation.navigate('Home');
        }, 2000);
      } else {
        console.error("Failed to place order:", response.message);
        Alert.alert('Error', 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error?.response?.message || error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    // Update cartData with the new payment method
    cartData.paymentMethod = value;
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressItem}>
        <View style={[styles.progressDot, styles.completedDot]} />
        <Text style={[styles.progressText, styles.completedText]}>Cart</Text>
      </View>
      <View style={[styles.progressLine, styles.completedLine]} />
      <View style={styles.progressItem}>
        <View style={[styles.progressDot, styles.completedDot]} />
        <Text style={[styles.progressText, styles.completedText]}>Address</Text>
      </View>
      <View style={styles.progressLine} />
      <View style={styles.progressItem}>
        <View style={[styles.progressDot, styles.activeDot]} />
        <Text style={[styles.progressText, styles.activeText]}>Payment</Text>
      </View>
    </View>
  );

  const renderDiscountSection = () => (
    <View style={styles.card}>
      <Text style={styles.paymentTitle}>
        Discounts & Offers
      </Text>
      <View style={styles.paymentMethodContainer}>
        <TouchableOpacity style={styles.discountItem} onPress={() => setShowPromoInput(!showPromoInput)}>
          <Text style={styles.discountText}>Have a Promo code</Text>
          <Text style={[styles.applyText, styles.applyButton]}>Apply</Text>
        </TouchableOpacity>
        {showPromoInput && (
          <TextInput
            style={styles.discountInput}
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Enter promo code"
          />
        )}
        <View style={styles.separator} />
        <TouchableOpacity style={styles.discountItem} onPress={() => setShowMagicCoinsInput(!showMagicCoinsInput)}>
          <Text style={styles.discountText}>Use Magic Coins</Text>
          <Text style={[styles.applyText, styles.applyButton]}>Apply</Text>
        </TouchableOpacity>
        {showMagicCoinsInput && (
          <TextInput
            style={styles.discountInput}
            value={magicCoins}
            onChangeText={setMagicCoins}
            placeholder="Enter Magic Coins amount"
            keyboardType="numeric"
          />
        )}
      </View>
    </View>
  );

  if (showConfirmation) {
    return (
      <LinearGradient
        colors={['#2DBDEE', '#E9F0F5']}
        locations={[0, 0.3]}
        style={styles.container}
      >
        <View style={styles.confirmationContent}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.confirmationTitle}>Your order is confirmed</Text>
          <Text style={styles.confirmationText}>
            The items you ordered have been accepted and are on their way to being processed
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('OrderList')}
            style={styles.trackOrderButton}
          >
            Track order
          </Button>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#B2E3F4', '#FFFFFF']}
        style={styles.gradientBackground}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name='arrow-back' size={24} color='#000000' />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cart Summary</Text>
          </View>
          
          {renderProgressBar()}

          
          <View style={styles.card}>
            <Text style={styles.paymentTitle}>
              Ship to this address
            </Text>
            <View style={styles.paymentMethodContainer}>
              <View style={styles.addressBox}>
                <Text style={styles.addressText}>{addressData.formattedShipping}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Address', { cartData })}>
                  <PencilIcon />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.OrderDetailsCard}>
            <Text style={styles.cardTitle}>
              <Image source={require('../../assets/payment/Payment-details.png')} /> Order details
            </Text>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Items ({calculatedTotals.itemCount})</Text>
              <Text style={styles.cardTitle}>{calculatedTotals.totalQuantity} items</Text>
              
            </View>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Item Total</Text>
              <Text style={styles.cardTitle}>₹{calculatedTotals.itemTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Delivery</Text>
              <Text style={styles.cardTitle}>₹{calculatedTotals.delivery.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Total</Text>
              <Text style={styles.cardTitle}>₹{calculatedTotals.total.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Balance used</Text>
              <Text style={styles.cardTitle}>₹{calculatedTotals.balanceUsed.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>Discount applied</Text>
              <Text style={styles.cardTitle}>₹{calculatedTotals.discountApplied.toFixed(2)}</Text>
            </View>
            <View style={styles.horizontal}></View>
            <View style={[styles.row, styles.orderTotal]}>
              <Text style={styles.cardTitle}>Order total</Text>
              <Text style={styles.boldText}>₹{calculatedTotals.orderTotal.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>
             Payment Method
            </Text>
            <View style={styles.paymentMethodContainer}>
              <Text style={styles.paymentMethodTitle}>Preferred payment method</Text>
              <RadioButton.Group onValueChange={handlePaymentMethodChange} value={paymentMethod}>
                <View style={styles.noBorder}>
                  <RadioButton.Android value="upi" color="#6200EE" />
                  <Text style={styles.radioButtonLabel}>QR based UPI payment</Text>
                  <QRCodeIcon />
                </View>
              </RadioButton.Group>
            </View>

            <Text style={styles.morePaymentMethodTitle}>More ways to pay</Text>
            <View style={[styles.paymentMethodContainer, styles.morePaymentContainer]}>
              <RadioButton.Group onValueChange={handlePaymentMethodChange} value={paymentMethod}>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Android value="cod" />
                  <Text style={styles.radioButtonLabel}>Cash on Delivery</Text>
                  <CashOnDeliveryIcon />
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Android value="netbanking" />
                  <Text style={styles.radioButtonLabel}>Net Banking</Text>
                  <NetBankingIcon />
                </View>
                <View style={styles.radioButtonContainer}>
                  <RadioButton.Android value="card" />
                  <Text style={styles.radioButtonLabel}>Credit or Debit cards</Text>
                  <CardsIcon />
                </View>
                <View style={styles.noBorder}>
                  <RadioButton.Android value="emi" />
                  <Text style={styles.radioButtonLabel}>EMI</Text>
                  <EMIIcon />
                </View>
              </RadioButton.Group>
            </View>

            <View style={styles.secureTransactionContainer}>
              <LockIcon />
              <Text style={styles.secureTransactionText}>All transactions are Secure by default</Text>
            </View>
          </View>
          
         
          {renderDiscountSection()}
          
          <View style={styles.ProductCount}>
              <Text style={styles.ProductCountText}> Products ({cartData.orderItems.length})</Text>
            </View>
          {cartData.orderItems.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.productPrice}>Rs. {item.price}</Text>
                <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
                <Text style={styles.deliveryInfo}>Arriving {item.estimatedDelivery || 'Soon'}</Text>
              </View>
            </View>
          ))}

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By placing your order, you agree to Urbanwalla's Terms of use and Privacy policy
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { height: screenHeight * 0.1 }]}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalAmount}>₹{calculatedTotals.orderTotal.toFixed(2)}</Text>
            <Text style={styles.taxesText}>Inclusive of all taxes</Text>
          </View>
          <TouchableOpacity
            style={styles.placeOrderButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderButtonText}>Continue to buy ({cartData.orderItems.length} items)</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'black',
    marginLeft: 16,
  },
  card: {
    marginBottom: width * 0.04,
  },
  OrderDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  paymentMethodContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: width * 0.04,
    marginBottom: width * 0.04,
    marginHorizontal: width * 0.04,
  },
  paymentTitle: {
    fontSize: 20,
    fontWeight: '800',  // Updated from 600 to 800
    lineHeight: 28,
    marginLeft: width * 0.06,
    fontFamily: 'Gabarito',
    marginBottom: width * 0.02,
    color: '#000000',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',  // Updated from 500 to 800
    lineHeight: 24,
    marginBottom: 8,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderTotal: {
    marginTop: 8,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
  },
  changeLink: {
    color: '#29BDEE',
    fontFamily: 'Gabarito',
  },
  ProductCount: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  ProductCountText: {
    fontSize: 18,
    fontWeight: '800',  // Updated from 500 to 800
    lineHeight: 24,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  text: {
    color: 'black',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: width * 0.04,
    flexDirection: 'row',
    marginBottom: width * 0.04,
    marginHorizontal: width * 0.04,
  },
  productImage: {
    width: width * 0.2,
    height: width * 0.2,
    marginRight: width * 0.04,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  productPrice: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  productQuantity: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  deliveryInfo: {
    fontSize: 12,
    color: 'green',
    marginTop: 4,
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmationContent: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    margin: 16,
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    color: 'white',
    fontSize: 40,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  confirmationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  trackOrderButton: {
    backgroundColor: '#4A90E2',
  },
   
  horizontal: {
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width * 0.04,
    marginVertical: width * 0.05,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minHeight: 58,
    padding: width * 0.04,
    elevation: 2,
  },
  progressItem: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  progressDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginBottom: 5,
  },
  completedDot: {
    backgroundColor: '#2DBDEE',
  },
  progressText: {
    fontSize: width * 0.035,
    color: '#757575',
    fontFamily: 'Gabarito',
  },
  completedText: {
    color: '#2DBDEE',
    fontFamily: 'Gabarito',
  },
  activeText: {
    color: 'black',
    fontFamily: 'Gabarito',
    fontWeight: '900',
  },
  progressLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  completedLine: {
    backgroundColor: '#2DBDEE',
  },
  footer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  totalAmount: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#2DBDEE',
    fontFamily: 'Gabarito',
  },
  taxesText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#666666',
    fontFamily: 'Gabarito',
  },
  placeOrderButton: {
    backgroundColor: '#2DBDEE',
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.06,
    borderRadius: 25,
  },
  placeOrderButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Gabarito',
  },

  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 15,
    gap: 18,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  addressBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  editButton: {
    padding: 4,
  },
 
  paymentMethodTitle: {
    fontSize: 18,
    fontWeight: '800',  // Updated from 500 to 800
    lineHeight: 24,
    fontFamily: 'Gabarito',
    marginBottom: 12,
    color: '#000000',
  },
  morePaymentMethodTitle: {
    fontSize: 18,
    fontWeight: '800',  // Updated from 600 to 800
    lineHeight: 24,
    fontFamily: 'Gabarito',
    marginBottom: 0,
    marginLeft: 24,
    marginTop: 10,
    color: '#000000',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  noBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0,
  },
  radioButtonLabel: {
    flex: 1,
    marginLeft: width * 0.02,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#000000',
    fontFamily: 'Gabarito',
  },
  secureTransactionContainer: {
    flexDirection: 'column',  // Changed to column
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 8,
    gap: 8,  // Add space between icon and text
  },
  secureTransactionText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#666666',
    fontFamily: 'Gabarito',
    textAlign: 'center',
  },
  lockIcon: {
    width: 14,
    height: 14,
  },
  morePaymentContainer: {
    marginTop: 8,
    marginBottom: 0,
    paddingBottom: 8,
  },
  discountText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    fontWeight: '500',
    fontFamily: 'Gabarito',
  },
  discountInput: {
    marginTop: 8,
    backgroundColor: '#F0F8FF',
    borderRadius: 4,
    marginHorizontal: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  discountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  applyText: {
    color: '#29BDEE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  termsContainer: {
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.05,
    alignItems: 'center',
    marginBottom: width * 0.2,
  },
  termsText: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Gabarito',
  },
});

export default CheckoutOverview;
