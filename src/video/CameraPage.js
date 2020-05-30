import React, { useState, useEffect, useRef } from 'react';
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

const CameraPage = ({ navigation }) => {
	const [isRecording, updateIsRecording] = useState(false);
	const [inVideoMode, updateInVideoMode] = useState(false);
	const [hasPermission, updateHasPermission] = useState(null);
	const [cameraType, updateCameraType] = useState(Camera.Constants.Type.back);
	const cameraRef = useRef(null);

	const camera = cameraRef.current;

	const takePicture = async () => {
		if (camera) {
			const { uri } = await camera.takePictureAsync();
			MediaLibrary.saveToLibraryAsync(uri);
			navigation.navigate('Video Annotation', {
				mediaType: 'image',
				uri,
			});
		}
	};

	const takeVideo = async () => {
		if (camera) {
			updateIsRecording(true);
			const { uri } = await camera.recordAsync();
			MediaLibrary.saveToLibraryAsync(uri);
			navigation.navigate('Video Annotation', {
				mediaType: 'video',
				uri,
			});
		}
	};

	const stopVideo = () => {
		camera.stopRecording();
		updateIsRecording(false);
	};

	const pickImage = async () => {
		const mediaInfo = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
		});

		console.log(mediaInfo);

		const { type, uri } = mediaInfo;
		navigation.navigate('Video Annotation', {
			mediaType: type,
			uri,
		});
	};

	if (!hasPermission) {
		(async () => {
			const { status } = await Permissions.askAsync(
				Permissions.CAMERA_ROLL,
				Permissions.CAMERA,
				Permissions.AUDIO_RECORDING
			);

			status !== 'granted'
				? alert(
						'Sorry, we need camera roll permissions to make this work!'
				  )
				: updateHasPermission(status === 'granted');
		})();

		return <View />;
	} else {
		const getPrimaryIcon = () => {
			if (!inVideoMode) {
				return 'camera';
			}
			if (isRecording) {
				return 'stop';
			}
			return 'video-camera';
		};

		const doPrimaryAction = () => {
			if (!inVideoMode) {
				return takePicture();
			}
			if (isRecording) {
				return stopVideo();
			}
			return takeVideo();
		};

		return (
			<View style={{ flex: 1 }}>
				<Camera style={{ flex: 1 }} type={cameraType} ref={cameraRef}>
					<View
						style={{
							flex: 1,
							flexDirection: 'row',
							justifyContent: 'flex-end',
							margin: 30,
						}}
					>
						<TouchableOpacity
							style={{
								alignItems: 'center',
								backgroundColor: 'transparent',
							}}
							onPress={() => updateInVideoMode(!inVideoMode)}
						>
							<FontAwesome
								name={inVideoMode ? 'video-camera' : 'camera'}
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
							onPress={() => pickImage()}
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
							onPress={() =>
								updateCameraType(
									cameraType === Camera.Constants.Type.back
										? Camera.Constants.Type.front
										: Camera.Constants.Type.back
								)
							}
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
};

export default CameraPage;
