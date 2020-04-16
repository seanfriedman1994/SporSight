import React, { useEffect } from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    ImageBackground,
    TouchableOpacity,
    Alert,
    StyleSheet,
    AsyncStorage
  } from 'react-native';
  import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as AuthActions from '../screens/actions/auth';
import { NavigationContainer } from '@react-navigation/native';

const LandingPage = props => {
    /* const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
            dispatch(AuthActions.setAutoLoginAttempt());
            return;
        }
        const transformedData = JSON.parse(userData);
        const { token, userId, expiryDate } = transformedData;
        const expirationDate = new Date(expiryDate);

        if (expirationDate <= new Date() || !token || !userId) {
            dispatch(AuthActions.setAutoLoginAttempt());
            return;
        }

        const expirationTime = expirationDate.getTime() - new Date().getTime();

        dispatch(AuthActions.authenticate(userId, token, expirationTime));
        };

        tryLogin();
    }, [dispatch]); */

    return (
        <View style={styles.screen}>
            <ImageBackground source={require('../assets/ball_field.jpg')} 
            style={styles.image}
            >
                <View style={styles.header}>
                   <Text style={styles.text}>SporSight Sports Analytics</Text>
                </View>
                <View>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => props.navigation.navigate('Auth')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground> 
        </View>
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
        marginTop:200,
        paddingTop:15,
        paddingBottom:15,
        paddingHorizontal:30,
        backgroundColor: Colors.Secondary,
        borderRadius:10,
        borderWidth: 1,
        borderColor: Colors.Secondary
      },
      buttonText: {
          padding: 4,
          textAlign: 'center',
          fontFamily: 'roboto-bold',
          fontSize: 18,
          color: 'black'
      }
});

export default LandingPage;