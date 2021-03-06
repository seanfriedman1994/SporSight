import React, {
	useState,
	useEffect,
	useReducer,
	useCallback,
	useRef,
} from 'react';
import {
	AsyncStorage,
	ScrollView,
	View,
	ImageBackground,
	KeyboardAvoidingView,
	StyleSheet,
	Button,
	ActivityIndicator,
	Alert,
	Text,
	TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CLIENT_ID, TENANT_ID } from 'react-native-dotenv';
import Input from '../shared/components/Input';
import Card from '../shared/components/Card';
import Colors from '../constants/Colors';
import * as authActions from '../actions/auth';

import { AuthSession } from 'expo';
import { openAuthSession } from 'azure-ad-graph-expo';
import { render } from 'react-dom';
import { add } from '@tensorflow/tfjs';
import { UserExists, GetUser } from '../helpers/db';

const AuthScreen = props => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const isMountedRef = useRef(null);

	const dispatch = useDispatch();

	useEffect(() => {
		isMountedRef.current = true;
		const tryLogin = async () => {
			//look for User Data in Storage
			const userData = await AsyncStorage.getItem('userData');

			if (userData) {
				//create object from storage string
				const transformedData = JSON.parse(userData);

				//deconstruct the JSON object
				const {
					userId,
					displayName,
					token,
					refreshToken,
					expiryDate,
				} = transformedData;

				//check if token is valid
				const expirationDate = new Date(expiryDate);

				if (expirationDate <= new Date() || !userId || !token) {
					//invalid user object
				} else {
					//valid user object, already signed in.
					if (isMountedRef.current) {
						dispatch(
							authActions.authenticate(
								userId,
								displayName,
								token,
								refreshToken,
								expiryTime
							)
						);
					}

					let user = GetUser(userId);

					if (user == null) {
						console.log('user is null');
					} else {
						console.log(JSON.stringify(user));
					}

					return () => (isMountedRef.current = false);
					// if(!UserExists(userId))
					// {
					//   AddUser();
					// }
				}
			}
		};

		tryLogin();
	}, [dispatch]);

	useEffect(() => {
		if (error && isMountedRef.current) {
			Alert.alert('An Error Occured.', error, [{ text: 'Okay' }]);
		}

		return () => (isMountedRef.current = false);
	}, [error]);

	const authHandler = async () => {
		setError(null);
		setIsLoading(true);

		let action;
		let response;

		try {
			if (isMountedRef.current) {
				action = await authActions.loginAsync();
				response = await dispatch(action);

				//look for User Data in Storage
				const userData = await AsyncStorage.getItem('userData');

				if (userData) {
					//create object from storage string
					const transformedData = JSON.parse(userData);

					//deconstruct the JSON object
					const {
						userId,
						displayName,
						token,
						refreshToken,
						expiryDate,
					} = transformedData;

					console.log(userId);
					// let user = GetUser(userId);

					// if(user == null)
					// {
					//   console.log("user is null");
					// }
					// else
					// {
					//   console.log(user.Id);
					// }
				}
			}
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
			return;
		}

		isMountedRef.current = false;
	};

	return (
		<View style={styles.screen}>
			<ImageBackground
				source={require('../../assets/ball_field.jpg')}
				style={styles.image}
			>
				<View style={styles.header}>
					<Text style={styles.text}>SporSight Sports Analytics</Text>
				</View>

				<View>
					{isLoading ? (
						<ActivityIndicator
							size="large"
							color={Colors.Secondary}
						/>
					) : (
						<TouchableOpacity
							style={styles.button}
							onPress={authHandler}
						>
							<Text style={styles.buttonText}>Login</Text>
						</TouchableOpacity>
					)}
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	image: {
		width: '100%',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	header: {
		width: '80%',
		height: 100,
		alignContent: 'center',
	},
	text: {
		fontFamily: 'roboto-bold',
		fontSize: 24,
		textAlign: 'center',
	},
	button: {
		marginTop: 200,
		paddingTop: 15,
		paddingBottom: 15,
		paddingHorizontal: 30,
		backgroundColor: Colors.Secondary,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: Colors.Secondary,
	},
	buttonText: {
		padding: 4,
		textAlign: 'center',
		fontFamily: 'roboto-bold',
		fontSize: 18,
		color: 'black',
	},
	errorText: {
		textAlign: 'center',
		fontFamily: 'roboto',
		fontSize: 14,
		color: Colors.Error,
	},
});

export default AuthScreen;
