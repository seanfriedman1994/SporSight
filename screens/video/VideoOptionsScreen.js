import React from 'react';
import {Platform, Text, View, ImageBackground, StyleSheet, Button, Alert, TouchableOpacity} from 'react-native';


const VideoOptionsScreen = props => {
    return (
        <View style={styles.screen}>
            <Text>Video Options Screen</Text>
        </View>
    );
};

export const screenOptions = {
    headerTitle: 'Video Options'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    }
});

export default VideoOptionsScreen;