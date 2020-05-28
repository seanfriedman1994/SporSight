import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {
	FontAwesome,
	Ionicons,
	MaterialCommunityIcons,
} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

class CameraPage extends Component {
	state = {
		isRecording: false,
		inVideoMode: false,
		hasPermission: null,
		cameraType: Camera.Constants.Type.back,
	};

	async componentDidMount() {
		this.getPermissionAsync();
	}

	getPermissionAsync = async () => {
		// Camera roll Permission
		if (Platform.OS === 'ios') {
			const { status } = await Permissions.askAsync(
				Permissions.CAMERA_ROLL
			);
			if (status !== 'granted') {
				alert(
					'Sorry, we need camera roll permissions to make this work!'
				);
			}
		}
		// Camera Permission
		const { status } = await Permissions.askAsync(
			Permissions.CAMERA,
			Permissions.AUDIO_RECORDING
		);
		this.setState({ hasPermission: status === 'granted' });
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
			console.log('Photo', photo);
		}
	};

	takeVideo = async () => {
		if (this.camera) {
			this.setState(oldState => ({ ...oldState, isRecording: true }));
			let video = await this.camera.recordAsync();
			MediaLibrary.saveToLibraryAsync(video.uri);
			console.log('Video', video);
		}
	};

	stopVideo = async () => {
		this.camera.stopRecording();
		this.setState(oldState => ({ ...oldState, isRecording: false }));
	};

	pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
		});
	};

	render() {
		const { hasPermission } = this.state;
		if (hasPermission === null) {
			return <View />;
		} else if (hasPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
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
						type={this.state.cameraType}
						ref={ref => {
							this.camera = ref;
						}}
					>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								margin: 30,
							}}
						>
							<TouchableOpacity
								style={{
									alignItems: 'center',
									backgroundColor: 'transparent',
								}}
								onPress={() => this.props.closeCameraPage()}
							>
								<FontAwesome
									name="arrow-left"
									style={{ color: '#fff', fontSize: 40 }}
								/>
							</TouchableOpacity>
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
									style={{ color: '#fff', fontSize: 40 }}
								/>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								justifyContent: 'space-between',
								margin: 30,
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
