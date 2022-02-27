import { Camera } from 'expo-camera';
import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class CameraScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            hasPermission: null,
            type: Camera.Constants.Type.back
        }
    }

    async componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
        const { status } = await Camera.requestCameraPermissionsAsync();
        this.setState({hasPermission: status ==='granted'});
    }

    componentWillUnmount(){
        this.unsubscribe();
      }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null){
            this.props.navigation.navigate('Login');
        }
    };

    takePicture = async () => {
        if(this.camera){
            const options = {
                quality: 0.5, 
                base64: true,
                onPictureSaved: (data) => this.sendToServer(data)
            };
            await this.camera.takePictureAsync(options); 
        } 
    }

    sendToServer = async (data) => {
        // Get these from AsyncStorage
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('user_id');
  
        let res = await fetch(data.base64);
        let blob = await res.blob();
  
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
            method: "POST",
            headers: {
                "Content-Type": "image/png",
                "X-Authorization": token
            },
            body: blob
        })
        .then((response) => {
            console.log("Picture added", response);
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render(){
        if(this.state.hasPermission){
            return(
                <View style={styles.container}>
                    <Camera 
                        style={styles.camera} 
                        type={this.state.type}
                        ref={ref => this.camera = ref}
                    >
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.takePicture();
                            }}>
                            <Text style={styles.text}> Take Photo </Text>
                        </TouchableOpacity>
                    </View>
                    </Camera>
                </View>
            );
        }else{
            return(
                <Text>Camera does not have permission</Text>
            )
        }

    }

}

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
      margin: 20,
    },
    button: {
      flex: 0.1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 18,
      color: 'white',
    },
  });