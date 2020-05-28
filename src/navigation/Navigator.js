import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
import { Platform, SafeAreaView, Button, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import AuthScreen from '../user/AuthScreen';
import VideoEstimationScreen, { screenOptions as VideoEstimationScreenOptions } from '../video/VideoEstimationScreen';
import VideoOverviewScreen, {screenOptions as VideoOverviewScreenOptions} from '../video/VideoOverviewScreen';
import VideoOptionsScreen, { screenOptions as VideoOptionsScreenOptions } from '../video/VideoOptionsScreen';
import Colors from '../constants/Colors';
import * as authActions from '../actions/auth';

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
        <VideoStackNavigator.Navigator initialRouteName = "VideoEstimation" screenOptions={defaultNavOptions}>
            <VideoStackNavigator.Screen
                name="VideoEstimation"
                component={VideoEstimationScreen}
                options={VideoEstimationScreenOptions}
            />
            <VideoStackNavigator.Screen
                name="VideoOptions"
                component={VideoOptionsScreen}
                options={VideoOptionsScreenOptions}
            />
        </VideoStackNavigator.Navigator>
    );
};

const VideoOverviewStackNavigator = createStackNavigator();

export const VideoOverviewNavigator = () => {
    return (
        <VideoOverviewStackNavigator.Navigator initialRouteName = "VideoOverview" screenOptions={defaultNavOptions}>
            <VideoOverviewStackNavigator.Screen
                name="VideoOverview"
                component={VideoOverviewScreen}
                options={VideoOverviewScreenOptions}
            />
        </VideoOverviewStackNavigator.Navigator>
    );
};

const DrawerNavigator = createDrawerNavigator();

export const Navigator = () => {
    const dispatch = useDispatch();

    return (
        <DrawerNavigator.Navigator
            drawerContent={props => {
                return (
                    <View style={{ flex: 1, paddingTop: 20}} backgroundColor={Colors.Primary}>
                        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
                            <DrawerItemList {...props} />
                            {/* <Button
                                title="Logout"
                                color={Colors.Secondary}
                                onPress={() => {
                                    dispatch(authActions.logout());
                                }}

                            /> */}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    dispatch(authActions.logout());
                                }}>
                              <Text style={styles.buttonText}>Logout</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </View>
                );
            } }
            drawerContentOptions={{
                activeTintColor: Colors.Secondary,
                inactiveTintColor: 'white'
            }}
        >
             <DrawerNavigator.Screen
                name="Video Annotation"
                component={VideoOverviewNavigator}
                options={{
                    style: styles.navItem,
                    drawerIcon: props => (
                        <Ionicons
                            name={Platform.OS == 'android' ? 'md-videocam' : 'ios-videocam'}
                            size={23}
                            color={props.focused ? Colors.Secondary : 'white'}
                        />
                    )
                }}
            />
            <DrawerNavigator.Screen
                name="Video Estimation"
                component={VideoNavigator}
                options={{
                    style: styles.navItem,
                    drawerIcon: props => (
                        <FontAwesome5
                            name="walking"
                            size={23}
                            color={props.focused ? Colors.Secondary : 'white'}
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
        <AuthStackNavigator.Navigator initialRouteName = "Auth" screenOptions={{headerShown: false}}>
            <AuthStackNavigator.Screen
                name="Auth"
                component={AuthScreen}/>
        </AuthStackNavigator.Navigator>
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1
      },
      image: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
      },
      header: {
          width: '80%',
          height: 100,
          alignContent: 'center'
      },
      text: {
          fontFamily: 'roboto-bold',
          fontSize: 24,
          textAlign:'center'
      },
      button: {
        paddingTop:18,
        paddingBottom:12,
        paddingHorizontal:30,
      },
      buttonText: {
          padding: 4,
          textAlign: 'center',
          fontFamily: 'roboto',
          fontSize: 16,
          color: Colors.Secondary
      },
      navItem: {
        fontFamily: 'roboto',
        fontSize: 16
    },
      errorText: {
        textAlign: 'center',
        fontFamily: 'roboto',
        fontSize: 14,
        color: Colors.Error
      }
  });
