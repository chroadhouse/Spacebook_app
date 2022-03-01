import React, {Component} from "react";
import {Text, Button, Image, StyleSheet, TextInput, FlatList, View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            photo: null,
            userInfo: this.props.route.params.item,
            postList: [],
            likeTitle: "Like",
            postInput: ""
        }
    }
    // Conditional rendering 
    //Have a button to add friend and send a friend request button
    //User screen - need to be able to add a post to a wall - see likes and unlikes, 
    //View a single post - update the post if it is yours 

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.get_photo();
        });
        
    }
    
    get_posts = async () =>{
        //Post data will be retrieved here - stored in a list
        //flatlist will have the 
        //Data is being added - look @ postman - but it is not showing up after
        const token = await AsyncStorage.getItem("@session_token");
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userInfo.user_id+"/post", {
          'method':'get',
          'headers': {
            'X-Authorization': token
          },
        })
        .then((response) => {
          if(response.status ===200){
            console.log("Looking good response 200")
            return response.json()
          }else{
            console.log(response.status)
            console.log("!200")
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
                if(response.status === 200){
                    // get the posts
                }else{
                    console.log(response.status)
                }
            })
            .catch((error) => {
                console.log("Tried to add post with no data")
            })
        }
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

    likePost = async (postItem) => {
        let likeRequest
        console.log(this.state.likeTitle)
        if(this.state.likeTitle == "Like"){
            likeRequest = "POST"
            this.setState({
                likeTitle: "Unlike"
            })
        }else{
            likeRequest = "DELETE"
            this.setState({
                likeTitle: "Like"
            })
        }

        const token = await AsyncStorage.getItem('@sessions_token')
        const id = await AsyncStorage.getItem('user_id')
        return fetch("http://localhost:3333/api/1.0.0/user"+id+"/post/"+postItem.post_id+"/like", {
            'method': likeRequest,
            'headers': {
                'X-Authorization': token
            }
         })
        .then((response) =>{
            if(response.status === 200){
                console.log("response is 2000 - good")
            }
        })
        .catch((error) => {
            console.log(error)
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
                <Text>Add Post</Text>
                <TextInput
                    placeholder="What do you want to write about"
                    onChangeText={(postInput) => this.setState({postInput})}
                    value={this.state.postInput}
                />
                <Button
                    title="Add Post"
                    onPress={() => this.add_post()}
                />
                <FlatList
                    data={this.state.postList}
                    renderItem={({item}) => (
                        <View>
                           <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('SinglePostScreen',{item: item})}
                           >
                           <Text>{item.text}</Text>
                           <Text>{item.numlikes}</Text> 
                            </TouchableOpacity> 
                            <Button
                                title={this.state.likeTitle}
                                onPress={() => this.likePost(item)}
                            />
                        </View>
                    )}
                />
            </View>
        );
    }

}

export default FriendsScreen;