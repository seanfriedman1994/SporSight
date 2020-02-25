import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Header from '../../components/UI/Header';
import Colors from '../../constants/Colors';

const VideoOverviewScreen = props => {

    return (
        <View>
            <Text>Video Overview Screen</Text>
        </View>
    );
};

export const screenOptions = navData => {

    return {
        headerTitle: 'Videos',
        headerLeft: () => ( 
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title="Menu"
                iconName={Platform.OS == 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title="Video Options"
                iconName={Platform.OS == 'android' ? 'md-settings' : 'ios-settings'}
                onPress={() => {
                    navData.navigation.navigate('VideoOptions');
                }}
            />
            </HeaderButtons>
        )
    };
};

export default VideoOverviewScreen;