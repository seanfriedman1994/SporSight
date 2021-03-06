import React, { Component } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	Image,
	StyleSheet,
	Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {
	FontAwesome,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import Torch from 'react-native-torch';

class CameraPage extends Component {
	state = {
		isRecording: false,
		inVideoMode: false,
		hasPermission: null,
		cameraType: Camera.Constants.Type.back,
		flashMode: Camera.Constants.FlashMode.off,
	};

	setFlashMode = flashMode => this.setState({ flashMode });

	async componentDidMount() {
		this.getPermissionAsync();
	}

	getPermissionAsync = async () => {
		const { status } = await Permissions.askAsync(
			Permissions.CAMERA_ROLL,
			Permissions.CAMERA,
			Permissions.AUDIO_RECORDING
		);

		status !== 'granted'
			? alert('Sorry, we need camera roll permissions to make this work!')
			: this.setState({ hasPermission: status === 'granted' });
	};

	handleCameraType = () => {
		const { cameraType } = this.state;

		this.setState({
			cameraType:
				cameraType === Camera.Constants.Type.back
					? Camera.Constants.Type.front
					: Camera.Constants.Type.back,
		});
	};

	takePicture = async () => {
		if (this.camera) {
			let photo = await this.camera.takePictureAsync();
			MediaLibrary.saveToLibraryAsync(photo.uri);
			this.props.navigation.navigate('Video Estimation', {
				mediaType: 'photo',
				uri: photo.uri,
			});
			console.log('Photo', photo);
		}
	};

	takeVideo = async () => {
		if (this.camera) {
			this.setState(oldState => ({
				...oldState,
				isRecording: true,
			}));

			let video = await this.camera.recordAsync();
			MediaLibrary.saveToLibraryAsync(video.uri);
			this.props.navigation.navigate('Video Annotation', {
				mediaType: 'video',
				uri: video.uri,
			});
			console.log('Video', video);
		}
	};

	stopVideo = async () => {
		this.camera.stopRecording();
		this.setState(oldState => ({
			...oldState,
			isRecording: false,
		}));
	};

	pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		});
	};

	render() {
		const { hasPermission, flashMode, cameraType, capturing } = this.state;
		if (hasPermission === null) {
			return <View />;
		} else if (hasPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			const getFlashIcon = () => {
				if (Platform.OS === 'ios') {
					if (
						this.state.flashMode === Camera.Constants.FlashMode.on
					) {
						return 'ios-flash';
					} else {
						return 'ios-flash-off';
					}
				} else {
					if (
						this.state.flashMode === Camera.Constants.FlashMode.on
					) {
						return 'md-flash';
					} else {
						return 'md-flash-off';
					}
				}
			};
			const getPrimaryIcon = () => {
				if (!this.state.inVideoMode) {
					return 'camera';
				}
				if (this.state.isRecording) {
					return 'stop';
				}
				return 'video-camera';
			};
			const doPrimaryAction = () => {
				if (!this.state.inVideoMode) {
					return this.takePicture();
				}
				if (this.state.isRecording) {
					return this.stopVideo();
				}
				return this.takeVideo();
			};
			return (
				<View style={{ flex: 1 }}>
					<Camera
						style={{ flex: 1 }}
						type={cameraType}
						flashMode={flashMode}
						ref={ref => {
							this.camera = ref;
						}}
					>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: this.state.inVideoMode
									? 'flex-end'
									: 'space-between',
								margin: 30,
								marginTop: 55,
							}}
						>
							{!this.state.inVideoMode && (
								<TouchableOpacity
									style={{
										alignItems: 'center',
										backgroundColor: 'transparent',
									}}
									onPress={() =>
										this.state.flashMode ===
										Camera.Constants.FlashMode.off
											? this.setState({
													flashMode:
														Camera.Constants
															.FlashMode.on,
											  })
											: this.setState({
													flashMode:
														Camera.Constants
															.FlashMode.off,
											  })
									}
								>
									<Ionicons
										name={getFlashIcon()}
										style={{ color: '#fff', fontSize: 30 }}
									/>
								</TouchableOpacity>
							)}

							<TouchableOpacity
								style={{
									alignItems: 'center',
									backgroundColor: 'transparent',
								}}
								onPress={() =>
									this.setState(oldState => ({
										...oldState,
										inVideoMode: !oldState.inVideoMode,
									}))
								}
							>
								<FontAwesome
									name={
										this.state.inVideoMode
											? 'video-camera'
											: 'camera'
									}
									style={{ color: '#fff', fontSize: 30 }}
								/>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								margin: 30,
								marginBottom: 40,
							}}
						>
							<TouchableOpacity
								style={{
									alignSelf: 'flex-end',
									alignItems: 'center',
									backgroundColor: 'transparent',
								}}
								onPress={() => this.pickImage()}
							>
								<Ionicons
									name="ios-photos"
									style={{ color: '#fff', fontSize: 40 }}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									alignSelf: 'flex-end',
									alignItems: 'center',
									backgroundColor: 'transparent',
								}}
								onPress={() => doPrimaryAction()}
							>
								<FontAwesome
									name={getPrimaryIcon()}
									style={{ color: '#fff', fontSize: 40 }}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									alignSelf: 'flex-end',
									alignItems: 'center',
									backgroundColor: 'transparent',
								}}
								onPress={() => this.handleCameraType()}
							>
								<MaterialCommunityIcons
									name="camera-switch"
									style={{ color: '#fff', fontSize: 40 }}
								/>
							</TouchableOpacity>
						</View>
					</Camera>
				</View>
			);
		}
	}
}

export default CameraPage;

const styles = StyleSheet.create({
	recordButton: {
		height: 72,
		width: 72,
		borderWidth: 5,
		borderColor: 'red',
		borderRadius: 36,
		justifyContent: 'center',
		alignItems: 'center',
	},
	record: {
		height: 56,
		width: 56,
		borderRadius: 28,
		backgroundColor: 'blue',
	},
	smallCircle: {
		height: 8,
		width: 8,
		borderRadius: 4,
		marginRight: 2,
		backgroundColor: 'green',
	},
});
