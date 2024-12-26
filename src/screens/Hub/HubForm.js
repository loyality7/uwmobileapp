import React, { Fragment, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, StatusBar, ScrollView, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import FormHeader from "../../components/FormHeader";
import { TextInput, Checkbox, Button } from 'react-native-paper';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { postMethod } from "../../helpers";

const gender = ["Male", "Female"];

const HubForm = ({ route, navigation }) => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [isOpenDropdown, setOpenDropdown] = useState(false);
    const [screenName, setScreenName] = useState('');
    const [agreementChecked, setAgreementChecked] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        dob: dayjs(''),
        gender: '',
        addressLine1: "",
        addressLine2: "",
        state: "",
        district: "",
        pincode: "",
        classgrade: "",
        institute: "",
        instituteCity: ""
    })

    const resetFormData = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            dob: dayjs(''),
            gender: '',
            addressLine1: '',
            addressLine2: '',
            state: '',
            district: '',
            pincode: '',
            classgrade: "",
            institute: "",
            instituteCity: ""
        });
    }

    useEffect(() => {
        const path = route?.name?.split('-')[1];
        if (path) {
            getLabel(path);
        }
    }, [route?.name]);

    const handleChange = (e, name) => {
        setFormData({
            ...formData,
            [name]: e.nativeEvent.text
        });
    };

    const showDatepicker = () => {
        setShowPicker(true);
    };

    const handleDateOnChange = (event, selectedDate) => {
        setShowPicker(false);
        const currentDate = selectedDate || date;
        setFormData({
            ...formData,
            dob: dayjs(currentDate.$d).format('YYYY-MM-DD')
        });
    }

    const getLabel = (path) => {
        let label = ''
        if (path === 'farmers') {
            label = 'Farmer'
        } else if (path === 'students') {
            label = 'Student'
        } else {
            label = 'Market Place'
        }
        setScreenName(label);
    }

    const handleSubmit = async () => {
        try {
            let url = "customers/secure/hub/signup";
            let token = await AsyncStorage.getItem("@token");
            let response = await postMethod({ url, token, payload: formData });
            if (response.data) {
                ToastAndroid.show('Hub Sign up successful', ToastAndroid.SHORT);
                resetFormData();
                navigation.goBack();
            } else {
                ToastAndroid.show(response.message, ToastAndroid.SHORT);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const showAgreeMsg = () => {
        ToastAndroid.show('Please agree the terms and condition', ToastAndroid.SHORT)
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <FormHeader />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView>
                    <View style={{ paddingHorizontal: 30 }}>
                        <View style={{ marginVertical: 20 }}>
                            <Text style={{ fontSize: 28, fontWeight: 600, color: '#000000', textAlign: 'center' }}>Registration</Text>
                            <Text style={{ fontSize: 14, fontWeight: 600, color: '#005FAC', textAlign: 'center' }}>{screenName}</Text>
                        </View>
                        <View>
                            <TextInput
                                label="First Name"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                value={formData.first_name}
                                onChange={(e) => handleChange(e, 'first_name')}
                            />
                            <TextInput
                                label="Last Name"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                value={formData.last_name}
                                onChange={(e) => handleChange(e, 'last_name')}
                            />
                            <TextInput
                                label="Email"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'email')}
                                value={formData.email}
                            />
                            <TextInput
                                label="Mobile"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'phone_number')}
                                value={formData.phone_number}
                            />
                            <TextInput
                                label="DOB"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 15 }}
                                value={formData.dob}
                                name='dob'
                                right={<TextInput.Icon icon="calendar" onPress={showDatepicker} />}
                            />
                            {showPicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateOnChange}
                                />
                            )}
                            <SelectDropdown
                                data={gender}
                                onSelect={(selectedItem) => {
                                    setFormData({
                                        ...formData,
                                        gender: selectedItem
                                    });
                                }}
                                defaultButtonText={'Gender'}
                                renderDropdownIcon={(isOpened) => {
                                    return <Icon name={`keyboard-arrow-${isOpened ? 'up' : 'down'}`} size={22} onPress={() => { setOpenDropdown(!isOpenDropdown) }} />;
                                }}
                                buttonStyle={{
                                    width: '100%',
                                    height: 50,
                                    backgroundColor: '#ffffff',
                                    borderRadius: 12,
                                    borderWidth: 0.5,
                                    borderColor: '#000000',
                                    paddingHorizontal: 5,
                                    marginBottom: 10
                                }}
                                buttonTextStyle={{ color: '#000', textAlign: 'left', fontSize: 16 }}
                            />
                            <TextInput
                                label="Address Line 1"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'addressLine1')}
                                value={formData.addressLine1}
                            />
                            <TextInput
                                label="Address Line 2"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'addressLine2')}
                                value={formData.addressLine2}
                            />
                            <TextInput
                                label="City"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'city')}
                                value={formData.city}
                            />
                            <TextInput
                                label="District"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'district')}
                                value={formData.district}
                            />
                            <TextInput
                                label="State"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'state')}
                                value={formData.state}
                            />
                            <TextInput
                                label="Pincode"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 5 }}
                                onChange={(e) => handleChange(e, 'pincode')}
                                value={formData.pincode}
                            />
                        </View>
                        {screenName === 'Student' ? <Fragment>
                            <TextInput
                                label="Class/Grade"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'classgrade')}
                                value={formData.classgrade}
                            />
                            <TextInput
                                label="Institute Name"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'institute')}
                                value={formData.institute}
                            />
                            <TextInput
                                label="Institute City"
                                mode='outlined'
                                outlineStyle={{ borderRadius: 12, borderWidth: 0.5, borderColor: '#000000', borderStyle: 'solid' }}
                                style={{ backgroundColor: '#fff', marginBottom: 10 }}
                                onChange={(e) => handleChange(e, 'instituteCity')}
                                value={formData.instituteCity}
                            />
                        </Fragment> : null}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Checkbox
                                status={agreementChecked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setAgreementChecked(!agreementChecked);
                                }}
                            />
                            <Text style={{ fontSize: 12, fontWeight: 600, color: '#787676' }}>Accept Terms and Conditions & Privacy policy</Text>
                        </View>
                        <View style={{ marginVertical: 20 }}>
                            <Button
                                mode='contained'
                                style={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    justifyContent: 'center',
                                    borderRadius: 25,
                                }}
                                buttonColor='#005FAC'
                                labelStyle={{ fontSize: 14, fontWeight: 600 }}
                                onPress={agreementChecked ? handleSubmit : showAgreeMsg}
                            >
                                Register
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    }
});

export default HubForm;