import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HeaderComponent = ({ title, onPress, isShowRightIcon = false, screenType = '', titleColor = '#005FAC' }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onPress || (() => navigation.goBack())} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.searchContainer}>
                <Icon name="search" size={24} color="#888" />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search"
                    placeholderTextColor="#999"
                />
                <TouchableOpacity>
                    <Icon name="mic" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {isShowRightIcon && (
                screenType === 'productDetails' ? (
                    <TouchableOpacity style={styles.rightIcon}>
                        <Icon name="share" size={24} color="#000000" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.filterButton}>
                        <Icon name="filter-list" size={20} color="#343A40" />
                        <Text style={styles.filterText}>Filter</Text>
                    </TouchableOpacity>
                )
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 30,
        backgroundColor: 'transparent',
    },
    backButton: {
        marginRight: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#000000',
        fontFamily: 'Gabarito',
    },
    rightIcon: {
        marginLeft: 10,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 10,
    },
    filterText: {
        fontSize: 15,
        color: '#343A40',
        marginLeft: 5,
        fontFamily: 'Gabarito',
    },
});

export default HeaderComponent;
