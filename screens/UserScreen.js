import React, {Component} from "react";
import {Text, Button, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from "react-native-web";

class FriendsScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            photo: null,
            userInfo: this.props.route.params.item
        }
    }
    // Conditional rendering 
    //Have a button to add friend and send a friend request button


    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
        this.get_photo()
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

    get_photo = async () =>{
        const token = await AsyncStorage.getItem("@session_token");
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userInfo.user_id+"/photo", {
            'method': 'get',
            'headers': {
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status === 200){
                console.log("Looking good")
                return response.blob()
            }
        })
        .then((responseBlob) =>{
            console.log("Second section")
            let data = URL.createObjectURL(responseBlob);
            this.setState({
                photo: data,
            })
        })
        .catch((error) =>{ 
            console.log(error)
        })
    }
    

    addFriend = async () =>{
        //Send a friend request for this 
        const value = await AsyncStorage.getItem('@session_token');
        //const id = await AsyncStorage.getItem('user_id');
        console.log(this.state.userInfo.user_id)
        
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userInfo.user_id+"/friends",{
            'method': 'post',
            'headers' : {
                    'X-Authorization': value
            }
        })
        .then((response) => {
            if(response.status ===200){
                console.log("Friend request sent")
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else if(response.status === 403){
                console.log("User is already added as a friend")
            }else if(response.status === 404){
                console.log('Not found')
            }else{
                console.log("Really not sure now")
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    render(){
        return(
            <View>
                <Image
                    source={{
                        uri: this.state.photo,
                    }}
                    style = {{
                        width: 400,
                        height: 400,
                        borderWidth: 5
                    }}
                />
                <Text>{this.state.userInfo.user_givenname}</Text>
                <Button
                    title="Add Friend"
                    onPress = {() => this.addFriend()}
                />
            </View>
        );
    }

}

export default FriendsScreen;