import React, {Component} from "react";
import {Text, ScrollView, Button, View, FlatList} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            requestList: [], 
            userID: "",
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
        const id = await AsyncStorage.getItem('user_id');
        if(value == null){
            this.props.navigation.navigate('login');
        }else{
            this.setState({
                userID: id
            });
        }
    }

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
                return response.json()
            }else if(response.status === 401){
                this.props.navigation.navigate("login");
            }else if(response.status === 500){
                console.log("Server Error")
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

    acceptFriendRequest =  async (requestID) =>{
        //Once the request is accepted need to recall the get data 
        //Here the friend request is accepteds
        console.log("Method is working")
        console.log(requestID)
        
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+ requestID, {
            'method': 'post',
            'headers':{
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status ===200){
                this.getData()
            }else if(response.status === 401){
                this.props.navigation.navigate("login");
            }else if(response.status === 404){
                console.log("Not found")
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    deleteFriendRequest =  async (requestID) =>{
        //Here the friend request is deleted
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+ requestID, {
            'method': 'Delete',
            'headers':{
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status ===200){
                this.getData()
            }else if(response.status === 401){
                this.props.navigation.navigate("login");
            }else if(response.status === 404){
                console.log("Not found")
            }else if(response.status === 500){
                
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
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
                                <Text>{item.user_id} {item.first_name} {item.last_name}</Text>
                                <Button
                                    title="Accept"
                                    onPress={() => this.acceptFriendRequest(item.user_id)}
                                />
                                <Button
                                    title="Decline"
                                    onPress={() => this.deleteFriendRequest(item.user_id)}
                                />
                            </View>
                        )}
                    />
                    <Button
                        title='Friends'
                        onPress={() => this.props.navigation.navigate('friendsScreen',{userID: this.state.userID})} 
                    />
                </ScrollView>
            </View>
        );
    }
}

export default FriendRequestScreen;