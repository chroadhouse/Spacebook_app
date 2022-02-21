import React, {Component} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, Button, TextInput, View} from "react-native";

class UpdateUserScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            first_name: "",
            last_name: ""
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
                first_name: responseJson.first_name,
                last_name: responseJson.last_name,
                email: responseJson.email,
              })
          })
          .catch((error) => {
              console.log("Something is going wrog")
              console.log(error);
          })
      }

      updateUser = async() =>{
        //update user needs the ID of the user
        //Then we just update all the data in there
      }
    
      checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null){
            this.props.navigation.navigate('Login');
        }
      };

      render(){
          return(
            <View>
                <Text>First Name</Text>
                <TextInput
                    placeholder={this.state.first_name} 
                    defaultValue={this.state.first_name}
                />
                <Text>Last Name</Text>
                <TextInput
                    placeholder={this.state.last_name}
                    defaultValue={this.state.last_name}
                />
                <Text>Email</Text>
                <TextInput
                    placeholder={this.state.email}
                    defaultValue={this.state.email}
                />
                <Text>Must enter password for information to be saved</Text>
                <Text>Password</Text>
                <TextInput
                    placeholder="Password here"
                />
                <Text>Verify Password</Text>
            </View>
          );
      }
}

export default UpdateUserScreen;