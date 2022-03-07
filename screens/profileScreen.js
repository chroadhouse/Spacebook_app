import React, {Component} from 'react';
import {View, Text, FlatList, ScrollView,Button, Image, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native-web';

class ProfileScreen extends Component{
  constructor(props){
    super(props);
    //Update the states and then update the data
    this.state = {
      isLoading: true,
      firstName: "",
      lastName: "",
      photo: null,
      postList: [],
      postInput: "",
      likeTitle: "Like",
      userInfo: [], 
      validationText: ""
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getData();
      this.get_photo()
      this.get_posts()
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  getData = async () => {
    //This is just a generic statment I think 
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/" + id,{
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
            userInfo: responseJson,
            isLoading: false,
            firstName: responseJson.first_name,
            lastName: responseJson.last_name
          })
      })
      .catch((error) => {
          console.log(error);
      })
  }
  //Functionalilty for updating a post - View a single post and then from there you can edit the post or delete the post ? 

  add_post = async () => {
    this.setState({
      validationText: ""
    })
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id');
    
    if(this.state.postInput != ""){
      let to_send = {
        text: this.state.postInput
      }
      return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post", {
        'method': 'post',
        'headers': {
          "X-Authorization": token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
      })
      .then((response) => {
        if(response.status ===201){
          this.setState({
            postInput: ""
          })
          this.get_posts()
        }else if(response.status === 401) {
          this.props.navigation.navigate("Login")
        }else if(response.status === 404){
          console.log("Not Found")
        }else{
          throw 'Something has gone wrong'
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }else{
      this.setState({
        validationText: "Trying at add post with no data"
      })
    }
  }

  get_posts = async () =>{
    //Post data will be retrieved here - stored in a list
    //flatlist will have the 
    //Data is being added - look @ postman - but it is not showing up after
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem('user_id');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post", {
      'method':'get',
      'headers': {
        'X-Authorization': token
      },
    })
    .then((response) => {
      if(response.status ===200){
        console.log("Looking good response 200")
        return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login")
      }else if(response.status === 403){
        console.log("Can only view posts from your friends or your own posts")
      }else if(response.status === 404){
        console.log("Not Found")
      }else{
        throw "Server error"
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

  get_photo = async () =>{
    const token = await AsyncStorage.getItem("@session_token");
    const id = await AsyncStorage.getItem("user_id");
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo?" + Date.now(), {
      'method': 'get',
      'headers': {
        'X-Authorization': token
      },
    })
    .then((response) => {
      if(response.status === 200){
        return response.blob()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login")
      }else if(response.status === 404){
        console.log("Not found")
      }else{
        throw "Something went wrong with the server"
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if(value == null){
        this.props.navigation.navigate('Login');
    }
  };

  
  // likePost = async (postItem) =>{
  //   let likeRequest
  //   console.log(this.state.likeTitle)
  //   if(this.state.likeTitle =="Like"){
  //     likeRequest = "POST"
  //     this.setState({
  //       likeTitle: "Unlike"
  //     })
  //   }else{
  //     likeRequest = "DELETE"
  //     this.setState({
  //       likeTitle: "Like"
  //     })
  //   }
    

  //   const token = await AsyncStorage.getItem('@session_token')
  //   const id = await AsyncStorage.getItem('user_id')
  //   return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+postItem.post_id+"/like", {
  //     'method': likeRequest,
  //     'headers': {
  //       'X-Authorization': token
  //     }
  //   })
  //   .then((response) =>{
  //     if(response.status === 200){
  //       console.log("response is 2000 - good")
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })
    
  // } 

  render() {
    if (this.state.isLoading){
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Loading..</Text>
        </View>
      );
    }else{

      return (
        <View>
          <ScrollView>
            <Image
              source={{
                uri: this.state.photo,
              }}
              style={{
                width: 400,
                height: 400,
                borderWidth: 5 
              }}
            />
            <Text>{this.state.firstName} {this.state.lastName}</Text>
            <Button
              title='Update Profile'
              onPress={() => this.props.navigation.navigate("UpdateUserScreen")}
            />
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
                    onPress={() => this.props.navigation.navigate('SinglePostScreen',{item: item.post_id, userInfo: this.state.userInfo.user_id })}
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
    }
    
  }
}

export default ProfileScreen;