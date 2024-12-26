import React from 'react';
import { ImageBackground, StyleSheet, Image } from 'react-native';

const FormHeader = () => {
    return (
        <ImageBackground source={require('../assets/regiterFormHeader.png')} resizeMode="cover" style={styles.image}>
            <Image source={require('../assets/UrbanWallah-Logo.png')} style={styles.logoStyle} />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    image: {
        justifyContent: 'center',
        height: 130
    },
    logoStyle: {
        alignSelf: 'center'
    }
});

export default FormHeader;