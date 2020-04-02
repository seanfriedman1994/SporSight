import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import { AuthNavigator, Navigator } from './Navigator';
import LandingPage from '../screens/LandingPage';

const AppNavigator = props => {
    const isAuth = useSelector(state => !!state.auth.token);
    const autoLoginAttempt = useSelector(state => !!state.auth.autoLoginAttempt);

    return (
        <NavigationContainer>
            <Navigator />
        </NavigationContainer>
    );
};

export default AppNavigator;