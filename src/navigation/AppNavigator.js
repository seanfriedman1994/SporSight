import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { AuthNavigator, Navigator } from './Navigator';

const AppNavigator = props => {
	const isAuth = useSelector(state => !!state.auth.token);
	const autoLoginAttempt = useSelector(
		state => !!state.auth.autoLoginAttempt
	);

	return (
		<NavigationContainer>
			{isAuth && <Navigator />}
			{!isAuth && <AuthNavigator />}
		</NavigationContainer>
	);
};

export default AppNavigator;
