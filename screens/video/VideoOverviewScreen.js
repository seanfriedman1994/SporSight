import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import Header from "../../components/UI/Header";
import Colors from "../../constants/Colors";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";
import * as jpeg from 'jpeg-js'
import { fetch, decodeJpeg } from "@tensorflow/tfjs-react-native";
import Constants from "expo-constants";
import Svg, { Circle, Line } from 'react-native-svg'
import { FontAwesome } from '@expo/vector-icons';
import CameraPage from './CameraPage';

// to do
// video support
// multiple poses support
// enhance skeleton (enfore cutoff)
// test out different estimation tools

export default class VideoOverviewScreen extends React.Component {
  state = {
    isCameraOpen: false,
    canUseCamera: false,
    image: null,
    poses: null,
    isTFReady: false
  };

  render() {
    let { image, poses, loading, prepping, estimating } = this.state;

    return this.state.isCameraOpen ? <CameraPage closeCameraPage={() => {
      this.setState(oldState => ({ ...oldState, isCameraOpen: false }));
    }} /> : (

        <View
          style={{ height: "100%", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}
        >
          <View
            style={{ width: "100%", flexDirection: "row", justifyContent: "space-around", alignItems: "flex-start", paddingVertical: 10 }}
          >
            <Button
              title="Pick Image"
              onPress={this.pickImage} // Todo: Don't know how to fix task bar spacing on app. 
            />
            <Button
              title="Open Camera"
              onPress={this.openCamera}
            />
            <Button
              disabled={!this.state.image}
              title="Estimate"
              onPress={this.estimate}
            />
            <Button
              disabled={!this.state.image}
              title="Clear"
              onPress={this.clear}
            />
          </View>
          <View style={{ flex: 1 }}>
          </View>
          {image && (
            <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <View>
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 400, height: 400, position: "absolute", top: 0, bottom: 0, left: -200, right: 0 }}
                />
              </View>
              {poses && (
                <View>
                  <Svg
                    height={400}
                    width={400}
                    viewBox="0 0 400 400"
                    fill="blue"
                  >
                    {this.renderJoints()}
                    {this.renderSkeleton()}
                  </Svg>
                </View>
              )}

            </View>
          )}
          {loading ? (
            <Text>
              Loading...
            </Text>
          ) : prepping ? (
            <Text>
              Prepping...
            </Text>
          ) : estimating ? (
            <Text>
              Estimating...
            </Text>
          ) : null}
        </View>
      );
  }

  componentDidMount() {
    this.getPermissionAsync();
    this.readyTF();
  }

  // dots
  renderJoints = () => {
    const { image, poses } = this.state
    return poses.map((pose) => {
      return pose.keypoints.map((keypoint, index) => {
        if (keypoint.score >= .8) {
          return (
            <Circle key={index} r={3} cx={(keypoint.position.x) * (400 / image.width)} cy={keypoint.position.y * (400 / image.height)} fill="white" />
          )
        }
      })
    })
  }

  // lines
  renderSkeleton = () => {
    const { image, poses } = this.state
    return poses.map((pose) => {
      return skeletonPairs.map((pair, index) => {
        return (
          <Line
            key={index}
            x1={((pose.keypoints.find(keypoint => keypoint.part == pair.pair[0])).position.x) * (400 / image.width)}
            x2={((pose.keypoints.find(keypoint => keypoint.part == pair.pair[1])).position.x) * (400 / image.width)}
            y1={((pose.keypoints.find(keypoint => keypoint.part == pair.pair[0])).position.y) * (400 / image.height)}
            y2={((pose.keypoints.find(keypoint => keypoint.part == pair.pair[1])).position.y) * (400 / image.height)}
            stroke="white"
            strokeWidth="2"
          />
        )
      })
    })
  }

  clear = () => {
    this.setState({
      image: null,
      poses: null
    })
  }


  // Added permission for camera as well as camera roll.
  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
    if (status !== "granted") {
      alert("Sorry, we need camera & camera roll permissions to make this work!");
    }
    else {
      this.setState(oldState => ({ ...oldState, canUseCamera: true }));
    }
  };


  readyTF = async () => {
    await tf.ready();
    this.setState({
      isTFReady: true
    });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    });
    console.log(result)
    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  openCamera = async () => {
    this.setState(oldState => ({ ...oldState, isCameraOpen: true }));
  };

  estimate = async () => {
    this.setState({
      loading: true
    }, async () => {
      console.log("1")
      const net = await posenet.load({
        architecture: 'ResNet50',
        outputStride: 32,
        quantBytes: 1
      });

      this.setState({
        loading: false,
        prepping: true
      }, async () => {
        console.log("2")
        const response = await fetch(this.state.image.uri, {}, { isBinary: true });
        const imageData = await response.arrayBuffer();
        const imageTensor = this.imageToTensor(imageData)

        this.setState({
          prepping: false,
          estimating: true
        }, async () => {
          console.log("3")
          const poses = await net.estimateMultiplePoses(imageTensor);
          console.log(poses)
          this.setState({
            estimating: false,
            poses
          });
        })
      })
    })



  };

  // needed for posenet calcs
  imageToTensor(rawImageData) {
    const TO_UINT8ARRAY = true;
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset];
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];

      offset += 4;
    }

    return tf.tensor3d(buffer, [height, width, 3]);
  }
}

export const screenOptions = navData => {
  return {
    headerTitle: "Videos",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS == "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Video Options"
          iconName={Platform.OS == "android" ? "md-settings" : "ios-settings"}
          onPress={() => {
            navData.navigation.navigate("VideoOptions");
          }}
        />
      </HeaderButtons>
    )
  };
};

const skeletonPairs = [
  {
    id: "lowerLeftLeg",
    pair: ["leftAnkle", "leftKnee"]
  },
  {
    id: "upperLeftLeg",
    pair: ["leftKnee", "leftHip"]
  },
  {
    id: "lowerRightLeg",
    pair: ["rightAnkle", "rightKnee"]
  },
  {
    id: "upperRightLeg",
    pair: ["rightKnee", "rightHip"]
  },
  {
    id: "hips",
    pair: ["leftHip", "rightHip"]
  },
  {
    id: "leftSide",
    pair: ["leftHip", "leftShoulder"]
  },
  {
    id: "rightSide",
    pair: ["rightHip", "rightShoulder"]
  },
  {
    id: "shoulders",
    pair: ["leftShoulder", "rightShoulder"]
  },
  {
    id: "lowerLeftArm",
    pair: ["leftWrist", "leftElbow"]
  },
  {
    id: "upperLeftArm",
    pair: ["leftElbow", "leftShoulder"]
  },
  {
    id: "lowerRightArm",
    pair: ["rightWrist", "rightElbow"]
  },
  {
    id: "upperRightArm",
    pair: ["rightElbow", "rightShoulder"]
  }
]
