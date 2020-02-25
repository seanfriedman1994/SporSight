import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import AuthScreen from '../screens/user/AuthScreen';
import VideoOverviewScreen, { screenOptions as VideoOverviewScreenOptions } from '../screens/video/VideoOverviewScreen';
import VideoOptionsScreen, { screenOptions as VideoOptionsScreenOptions } from '../screens/video/VideoOptionsScreen';
import Colors from '../constants/Colors';
import LandingPage from '../screens/LandingPage';
import * as authActions from '../screens/actions/auth';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.Primary
    },
    headerTitleStyle: {
        fontFamily: 'roboto-bold'
    },
    headerBackTiltStyle: {
        fontFamily: 'roboto'
    },
    headerTintColor: 'white'
};

const VideoStackNavigator = createStackNavigator();

export const VideoNavigator = () => {
    return (
        <VideoStackNavigator.Navigator screenOptions={defaultNavOptions}>
            <VideoStackNavigator.Screen 
                name="VideoOverview" 
                component={VideoOverviewScreen}
                options={VideoOverviewScreenOptions} 
            />
            <VideoStackNavigator.Screen 
                name="VideoOptions" 
                component={VideoOptionsScreen}
                options={VideoOptionsScreenOptions} 
            />
        </VideoStackNavigator.Navigator>
    );
};

const DrawerNavigator = createDrawerNavigator();

export const Navigator = () => {
    const dispatch = useDispatch();

    return (
        <DrawerNavigator.Navigator
            drawerContent={props => {
                return (
                    <View style={{ flex: 1, paddingTop: 20}}>
                        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                            <DrawerItemList {...props} />
                            <Button
                                title="Logout"
                                color={Colors.Primary}
                                onPress={() => {
                                    dispatch(authActions.logout());
                                }}
                            />
                        </SafeAreaView>
                    </View>
                );
            } }
            drawerContentOptions={{
                activeTintColor: Colors.Primary
            }}
        >
            <DrawerNavigator.Screen 
                name="Video" 
                component={VideoNavigator} 
                options={{
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.OS == 'android' ? 'md-videocam' : 'ios-videocam'}
                            size={23}
                            color={Colors.Secondary}
                        />
                    )
                }}
            />
        </DrawerNavigator.Navigator>
    );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator initialRouteName = "LandingPage" screenOptions={{headerShown: false}}>
            <AuthStackNavigator.Screen 
                name="LandingPage"
                component={LandingPage} />
            <AuthStackNavigator.Screen 
                name="Auth"
                component={AuthScreen}/>
        </AuthStackNavigator.Navigator>
    );
};
