import React, {Component} from "react";
import {Text, ScrollView, Button, View, FlatList} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            requestList: []
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
        this.getData();
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

    getData = async () =>{
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests",{
            'method': 'get',
            'headers': {
                'X-Authorization': token,
                'Content-Type': 'application/json'
            },
        })
        .then((response) => {
            if(response.status ===200){
                console.log("Request is good")
                return response.json()
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            this.setState({
                requestList: responseJson
            })
        })
        .catch((error) => {
            console.log("Something is going wrog")
            console.log(error);
        })
    }

    acceptFriendRequest = async () =>{
        //Here the friend request is accepteds
    }

    delectFriendRequest = async () =>{
        //Here the friend request is deleted
    }

    render(){
        return(
            <View>
                <ScrollView>
                    <Text>This is a test for the screen</Text>
                    <FlatList
                        data={this.state.requestList}
                        renderItem={({item}) => (
                            <View>
                                <Text>{item.} {item.user_familyname}</Text>
                                <Button
                                    title="Accept"
                                />
                                <Button
                                    title="Decline"
                                />
                            </View>
                        )}
                    />
                </ScrollView>
            </View>
        );
    }
}

export default FriendRequestScreen;