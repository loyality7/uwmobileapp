import { StyleSheet } from 'react-native';

export const HeaderStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 18,
        color: '#005FAC',
        fontWeight: 700
    }
});