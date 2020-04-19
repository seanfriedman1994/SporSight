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
import * as jpeg from 'jpeg-js'
import Constants from "expo-constants";
import Svg, { Circle, Line } from 'react-native-svg'

const VideoOverviewScreen = props => {
   
    return(
      <View></View>
    );
};


export const screenOptions = navData => {
  return {
    headerTitle: "My Videos",
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
    // headerRight: () => (
    //   <HeaderButtons HeaderButtonComponent={HeaderButton}>
    //     <Item
    //       title="Video Options"
    //       iconName={Platform.OS == "android" ? "md-settings" : "ios-settings"}
    //       onPress={() => {
    //         navData.navigation.navigate("VideoOptions");
    //       }}
    //     />
    //   </HeaderButtons>
    // )
  };
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
    },
    errorText: {
      textAlign: 'center',
      fontFamily: 'roboto',
      fontSize: 14,
      color: Colors.Error
    }
});

export default VideoOverviewScreen;