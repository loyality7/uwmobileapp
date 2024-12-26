import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

const ChangePassword = () => {
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye');

    const handlePasswordVisibility = () => {
        if (rightIcon === 'eye') {
            setRightIcon('eye-off');
            setPasswordVisibility(!passwordVisibility);
        } else if (rightIcon === 'eye-off') {
            setRightIcon('eye');
            setPasswordVisibility(!passwordVisibility);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 20, padding: 25 }}>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>CHANGE PASSWORD</Text>
                </View>
                <View style={{ marginTop: 15 }}>
                    <TextInput
                        label="Old Password"
                        secureTextEntry={passwordVisibility}
                        mode="outlined"
                        onChangeText={() => { }}
                        right={
                            <TextInput.Icon
                                onPress={handlePasswordVisibility}
                                icon={rightIcon}
                                color='#bfbfbf'
                            />
                        }
                        outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                        style={{ backgroundColor: '#fff', marginBottom: 15 }}
                    />
                    <TextInput
                        label="New Password"
                        secureTextEntry={passwordVisibility}
                        mode="outlined"
                        onChangeText={() => { }}
                        right={
                            <TextInput.Icon
                                onPress={handlePasswordVisibility}
                                icon={rightIcon}
                                color='#bfbfbf'
                            />
                        }
                        outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                        style={{ backgroundColor: '#fff', marginBottom: 15 }}
                    />
                    <TextInput
                        label="Confirm Password"
                        secureTextEntry={passwordVisibility}
                        mode="outlined"
                        onChangeText={() => { }}
                        right={
                            <TextInput.Icon
                                onPress={handlePasswordVisibility}
                                icon={rightIcon}
                                color='#bfbfbf'
                            />
                        }
                        outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                        style={{ backgroundColor: '#fff', marginBottom: 15 }}
                    />
                </View>
                <View style={{ marginVertical: 20 }}>
                    <Button
                        mode='contained'
                        buttonColor='#005FAC'
                        style={{ paddingVertical: 4, borderRadius: 25 }}
                        labelStyle={{ fontSize: 14, fontWeight: 600 }}
                    >
                        Update
                    </Button>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF'
    },
});

export default ChangePassword;