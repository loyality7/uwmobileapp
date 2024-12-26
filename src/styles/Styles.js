import {StyleSheet} from 'react-native';

const defaultFontFamily = 'Gabarito';

module.exports = StyleSheet.create({
  // Remove the incorrect global selector
  // *{
  //   fontFamily:'Gabarito !important'
  // },
  
  // Update existing text styles to use the default font family
  boldText: {
    color: 'white',
    fontFamily: defaultFontFamily,
    fontWeight: '600', // Equivalent to SemiBold
  },
  para: {
    color: 'white',
    fontFamily: defaultFontFamily,
  },
  small: {
    fontSize: 8,
    color: 'white',
    fontFamily: defaultFontFamily,
  },
  span: {
    fontSize: 10,
    color: 'white',
    fontFamily: defaultFontFamily,
  },
  // ... (other styles remain unchanged)
  
  // Update other text-related styles
  buttonText: {
    color: 'white',
    fontFamily: defaultFontFamily,
    fontWeight: '600', // Equivalent to SemiBold
  },
  modalHeading: {
    color: 'white',
    fontSize: 23,
    fontFamily: defaultFontFamily,
    fontWeight: '600', // Equivalent to SemiBold
  },
  linkText: {
    color: '#56F5FF',
    textAlign: 'center',
    textDecorationColor: '#56F5FF',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    fontFamily: defaultFontFamily,
  },
  input: {
    borderRadius: 8,
    color: 'white',
    paddingHorizontal: '3%',
    width: '95%',
    fontFamily: defaultFontFamily,
    height: 45,
  },
  text: {
    color: 'white',
    textAlign: 'left',
    fontFamily: defaultFontFamily,
  },
  normalText: {
    fontFamily: defaultFontFamily,
  },
  mediumText: {
    fontFamily: defaultFontFamily,
    fontWeight: '500', // Equivalent to Medium
  },
  textLight: {
    color: 'white',
    opacity: 0.8,
    fontFamily: defaultFontFamily,
  },
  // ... (rest of the styles remain unchanged)
});
