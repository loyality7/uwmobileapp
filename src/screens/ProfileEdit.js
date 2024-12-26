import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, TextInput } from 'react-native-paper';

const ProfileEdit = () => {
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#ffffff', marginHorizontal: 20, marginTop: 20, padding: 25 }}>
                <View style={{ alignSelf: 'center' }}>
                    <Avatar.Text size={58} label="U" color='#000000' style={{ backgroundColor: '#bfbfbf' }} />
                </View>
                <View style={{ marginTop: 20 }}>
                    <TextInput
                        label="First Name"
                        mode='outlined'
                        outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                        style={{ backgroundColor: '#fff', marginBottom: 10 }}
                    />
                    <TextInput
                        label="Last Name"
                        mode='outlined'
                        outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                        style={{ backgroundColor: '#fff', marginBottom: 10 }}
                    />
                    <TextInput
                        label="Email"
                        mode='outlined'
                        outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                        style={{ backgroundColor: '#fff', marginBottom: 10 }}
                    />
                    <TextInput
                        label="Mobile"
                        mode='outlined'
                        outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                        style={{ backgroundColor: '#fff', marginBottom: 10 }}
                    />
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFEFEF'
    },
});

export default ProfileEdit;