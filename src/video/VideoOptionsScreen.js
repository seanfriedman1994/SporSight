import React from 'react';
import {
	Platform,
	Text,
	View,
	ImageBackground,
	StyleSheet,
	Button,
	Alert,
	TouchableOpacity,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const VideoOptionsScreen = props => {
	return (
		<View style={styles.screen}>
			<Svg height={400} width={400} viewBox="0 0 400 400" fill="blue">
				<Circle r={200} fill="green" />
			</Svg>
		</View>
	);
};

export const screenOptions = {
	headerTitle: 'Video Options',
};

const styles = StyleSheet.create({
	screen: {
		margin: 20,
	},
	summary: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		padding: 10,
	},
});

export default VideoOptionsScreen;
