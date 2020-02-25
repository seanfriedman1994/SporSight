import React from 'react';
import {View, Text, StyleSheet, StatusBar } from 'react-native';
import Constants from 'expo-constants';
import Colors from '../../constants/Colors';

const Header = props => {
    return (
        <View style={styles.StatusBar}>
            <StatusBar translucent barStyle="light-content" />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 90,
        paddingTop: 36,
        backgroundColor: '#282c34',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        color: '#ffff',
        fontSize: 18
    },
    statusBar: {
        height: Constants.statusBarHeight,
        backgroundColor: Colors.Dark
    }
});

export default Header;