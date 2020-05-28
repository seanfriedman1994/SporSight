import React from 'react';
import { View, Platform, StyleSheet, Dimensions } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../shared/components/HeaderButton';
import { Video } from 'expo-av';

// import SampleVideo from '../../../assets/sample_video/IMG-2761.MP4'
const { width, height } = Dimensions.get('window');
const VideoOverviewScreen = props => {
	return (
		<View>
			<Video
				style={{
					flexDirection: 'column',
					justifyContent: 'flex-start',
					alignItems: 'center',
				}}
				source={{
					uri:
						'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
				}}
				// source={SampleVideo}
				rate={1.0}
				volume={1.0}
				isMuted={false}
				resizeMode="cover"
				shouldPlay={false}
				isLooping={false}
				useNativeControls
				style={styles.video}
			/>
		</View>
	);
};

export const screenOptions = navData => {
	return {
		headerTitle: 'Video Annotation',
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
	};
};

const styles = StyleSheet.create({
	video: {
		width: width,
		height: height / 2,
	},
});

export default VideoOverviewScreen;
