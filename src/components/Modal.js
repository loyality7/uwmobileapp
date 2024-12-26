import React from 'react';
import { View, Text } from 'react-native';
import { Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ModalComponent = ({ modalVisible, modalTitle, hideModal, children }) => {
    return (
        <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={{
                backgroundColor: '#fff',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            }}
        >
            <View style={{ padding: 20 }}>
                <Icon name='close' size={30} style={{ alignSelf: 'flex-end' }} color='#000' onPress={hideModal} />
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 600, color: '#005FAC' }}>{modalTitle}</Text>
                </View>
                {children}
            </View>
        </Modal>
    )
};

export default ModalComponent;