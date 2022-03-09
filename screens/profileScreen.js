import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, Button, Image, StyleSheet, ScrollView,TextInput, FlatList, View, TouchableOpacity} from 'react-native';
import {FontAwesome5} from '@expo/vector-icons'

class ProfileScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            userID: "",
            userIDPass: this.props.route.params.id,
            myProfile: false,
            isFriends: false,
            userInfo: [],
            postList: [],
            postInput: "",
            validationText: "",
            photo: null
        }
    }

    async componentDidMount() {
        const id = await AsyncStorage.getItem('user_id')
        console.log(id)
        console.log(this.state.userIDPass)
        if(this.state.userIDPass == -1 || this.state.userIDPass == id){
            console.log('In the right place')
            this.setState({
                userID: id,
                myProfile: true
            })
        }else{
            this.setState({
                userID: this.state.userIDPass,
                myProfile: false
            })
        }

        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.getData();
            this.get_photo();
            this.get_posts();
        });
        this.getData();
        this.get_photo();
        this.get_posts();
        
        
    }

    componentWillUnmount(){
        this.unsubscribe();
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

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('user_id')
        
        // console.log(id)
        // if(this.state.userIDPass === -1 || this.state.userIDPass === id){
        //     console.log('In the right place')
        //     this.setState({
        //         userID: id,
        //         myProfile: true
        //     })
        //     console.log("Id is "+this.state.userID)
        // }else{
        //     console.log('FUCK')
        //     this.setState({
        //         userID: userIDPass,
        //         myProfile: false
        //     })
        // }

        if(value == null){
            this.props.navigation.navigate('login');
        }
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
            console.log(this.state.userInfo)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    get_photo = async () =>{
        
        const token = await AsyncStorage.getItem("@session_token");
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/photo?" + Date.now(), {
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
        this.setState({validationText:""})
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

    get_posts = async () =>{
        console.log('Posts')
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
                  isFriends: true
              })
            return response.json()
          }else if(response.status === 401){
            this.props.navigation.navigate("login")
          }else if(response.status === 403){
              this.setState({
                  isFriends: false
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

    add_post = async () => {

        const token = await AsyncStorage.getItem("@session_token")
        if(this.state.postInput != ""){
            let to_send =  {
                text: this.state.postInput
            }
            return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post", {
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

    render(){
        //Profile
        if(this.state.myProfile){
            return (
                <View>
                  <ScrollView>
                    <Image
                      source={{
                        uri: this.state.photo,
                      }}
                      style={{
                        width: 200,
                        height: 200,
                        borderWidth: 5 
                      }}
                    />
                    <Text>{this.state.userInfo.first_name} {this.state.userInfo.last_name}</Text>
                    <Button
                      title='Friends'
                      onPress={() => this.props.navigation.navigate('friendsScreen',{userID: this.state.userID})}
                    />
                    <FontAwesome5.Button name={'user-edit'} onPress={() => this.props.navigation.navigate('updateUserScreen')}/>
                    <Text>Add Post</Text>
                    <TextInput
                      placeholder="Add posts"
                      onChangeText={(value) => this.setState({postInput: value})}
                      value={this.state.postInput}
                    />
                    <Text>{this.state.validationText}</Text>
                    <Button
                      title='Add Post'
                      onPress={() => this.add_post()}
                    />
                    <FlatList
                      data={this.state.postList}
                      renderItem={({item}) => (
                        <View>
                          <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('singlePostScreen',{item: item.post_id, userInfo: this.state.userInfo.user_id })}
                          >
                            <Text>{item.text}</Text>
                            <Text>{item.numLikes} Likes</Text>
                          </TouchableOpacity>
                          {/* <Button
                            title={this.state.likeTitle}
                            onPress={() => this.likePost(item)}
                          /> */}
                          
                        </View>
                      )}
                    />
                  </ScrollView>
                </View>
              );
        }else{
            //Don't render the profile - render a user screen
            if(!this.state.isFriends){
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
                        <Text>{this.state.userInfo.first_name}</Text>
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
                        <Button
                            title="Friends"
                            onPress={() => this.props.navigation.navigate('friendsScreen',{userID: this.state.userID})}
                        />
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

    

}

export default ProfileScreen;