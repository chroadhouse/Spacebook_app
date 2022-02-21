import React, {Component} from 'react';
import {View, Text, FlatList, ScrollView,Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component{
  constructor(props){
    super(props);
    //Update the states and then update the data
    this.state = {
      isLoading: true,
      firstName: "",
      lastName: "",

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
            <Text>{this.state.firstName} {this.state.lastName}</Text>
            <Button
              title='Update Profile'
              onPress={() => this.props.navigation.navigate("UpdateUserScreen")}
            />
          </ScrollView>
        </View>
      );
    }
    
  }
}

export default ProfileScreen;