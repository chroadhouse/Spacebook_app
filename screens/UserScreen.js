import React, {Component} from "react";
import {Text, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from "react-native-web";

class FriendsScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            userInfo: this.props.route.params.item
        }
    }
    // Conditional rendering 
    //Have a button to add friend and send a friend request button


    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });

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

    //Need to do the Async for this section

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