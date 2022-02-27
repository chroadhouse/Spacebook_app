import React, {Component} from 'react';
import {View, Text, FlatList, ScrollView,Button, Image, StyleSheet} from 'react-native';
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
      postInput: ""
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  
    this.getData();
    this.get_photo()
    this.get_posts()
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
          }else{
            throw 'Something went wrong';
          }
      })
      .then((responseJson) => {
          this.setState({
            isLoading: false,
            firstName: responseJson.first_name,
            lastName: responseJson.last_name
          })
      })
      .catch((error) => {
          console.log("Something is going wrog")
          console.log(error);
      })
  }

  add_post = async () => {
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
        if(response.status ===200){
          console.log("Data added")
          this.get_posts()
        }else{
          console.log(response.status)
        }
      })
      .catch((error) => {
        console.log(error)
      })
    }else{
      console.log("Tried to add post with no data")
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
        console.log("Looking good")
        return response.json()
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
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo", {
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if(value == null){
        this.props.navigation.navigate('Login');
    }
  };

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
              onChangeText={(postInput) => this.setState({postInput})}
              value={this.state.postInput}
            />
            <Button
              title='Add Post'
              //Then have a method for adding post - All posts stored in list for flat list
              onPress={() => this.add_post()}
            />
            <FlatList>
              
              data={this.state.postList}
              renderItem={({item}) => (
                <Text>TESTING</Text>
              )}
            </FlatList>
          </ScrollView>
        </View>
      );
    }
    
  }
}

export default ProfileScreen;