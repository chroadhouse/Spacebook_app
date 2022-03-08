import React, {Component} from "react";
import {Text, Button, Image, StyleSheet, TextInput, FlatList, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            photo: null,
            userID: this.props.route.params.userID,
            userInfo: [], 
            postList: [],
            
            postInput: "",
            friends: false, 
            validationText: ""
        }
    }
    

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getData();
          this.get_photo();
          this.get_posts();
        });
        
    }

    getData = async () =>{
        const token = await AsyncStorage.getItem('@session_token')
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.userID,{
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
                this.props.navigation.navigate("Login");
            }else if(response.status === 404){
                console.log("Not found")
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            this.setState({
                userInfo: responseJson   
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    get_posts = async () =>{
        //Post data will be retrieved here - stored in a list
        //flatlist will have the 
        //Data is being added - look @ postman - but it is not showing up after
        const token = await AsyncStorage.getItem("@session_token");
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post", {
          'method':'get',
          'headers': {
            'X-Authorization': token
          },
        })
        .then((response) => {
          if(response.status ===200){
              this.setState({
                  friends: true
              })
            return response.json()
          }else if(response.status === 401){
            this.props.navigation.navigate("login")
          }else if(response.status === 403){
              this.setState({
                  friends: false
              })
          }else{
              throw "Something"
          }
            
        })
        .then((responseJson) => {
          this.setState({
            postList: responseJson
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    add_post = async () => {

        const token = await AsyncStorage.getItem("@session_token")
        if(this.state.postInput != ""){
            let to_send =  {
                text: this.state.postInput
            }
            return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userInfo.user_id+"/post", {
                'method':"post",
                'headers': {
                    'X-Authorization': token,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(to_send)
            })
            .then((response) => {
                if(response.status === 201){
                    this.get_posts();
                }else if(response.status === 401){
                    this.props.navigation.navigate("login")
                }else if(response.status === 404){
                    console.log("Not Found")
                }else{
                    throw "Somthing"
                }
            })
            .catch((error) => {
                console.log("Tried to add post with no data")
            })
        }else{
            this.setState({validationText: "- Trying to add post with no text"})
        }
    }


    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null){
            this.props.navigation.navigate('login');
        }
    };

    get_photo = async () =>{
        const token = await AsyncStorage.getItem("@session_token");
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/photo", {
            'method': 'get',
            'headers': {
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.blob()
            }else if(response.status === 401){
                this.props.navigation.navigate("login")
            }else if(response.status === 404){
                console.log("Not found")
            }else{
                throw "Something"
            }
        })
        .then((responseBlob) =>{
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
        this.setState({validationText:"You have already sent your request"})
        //Send a friend request for this 
        const value = await AsyncStorage.getItem('@session_token');
        //const id = await AsyncStorage.getItem('user_id');
        
        
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/friends",{
            'method': 'post',
            'headers' : {
                    'X-Authorization': value
            }
        })
        .then((response) => {
            if(response.status ===200){
                console.log("Friend request sent")
            }else if(response.status === 401){
                this.props.navigation.navigate("login");
            }else if(response.status === 403){
                this.setState({validationText:"You have already sent your request"})
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
        if(!this.state.friends){
            //Do something 
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
                    <Text>{this.state.validationText}</Text>
                </View>
            )
        }else{
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
                    <Text>Add Post</Text>
                    <TextInput
                        placeholder="What do you want to write about"
                        onChangeText={(postInput) => this.setState({postInput})}
                        value={this.state.postInput}
                    />
                    <Text>{this.state.validationText}</Text>
                    <Button
                        title="Add Post"
                        onPress={() => this.add_post()}
                    />
                    <FlatList
                        data={this.state.postList}
                        renderItem={({item}) => (
                            <View>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('singlePostScreen',{item: item.post_id, userInfo: this.state.userID})}
                            >
                                <Text>{item.text}</Text>
                                <Text>{item.numLikes} Likes</Text> 
                            </TouchableOpacity> 
                            </View>
                        )}
                    />
                </View>
            );
        }
    }

}

export default FriendsScreen;