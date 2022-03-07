import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, ScrollView, TextInput, Button } from 'react-native-web';

class LoginScreen extends Component{
  constructor(props){
    super(props);

    this.state = {
      email: "",
      password: "",
      validationText: ""
      
    }
  }

  login = async () => {
    this.setState({
      validationText: ""
    })
    if(this.state.email != "" && this.state.password != ""){
      if(this.state.email.includes("@")){
        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                this.setState({
                  validationText: "- Email address or password are incorrect"
                })
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('user_id', responseJson.id);
                this.props.navigation.navigate("profileScreen");
        })
        .catch((error) => {
            console.log(error);
        })
      }else{
        this.setState({
          validationText: "- Email address is invalid, does not contain @ symbol"
        })
      }
    }else{
      this.setState({
        validationText: "- TextBox is missing data"
      })
    }
  }

  render(){
    return(
      <ScrollView>
        <TextInput
          placeholder="Enter your email"
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          placeholder="Enter your password..."
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
          secureTextEntry
          style={{padding:5, borderWidth:1, margin:5}}
        />
        <Button
          title="Login"
          onPress={() => this.login()}
        />
        <Button
          title="Don't have an account?"
          color="darkblue"
          onPress={() => this.props.navigation.navigate("Signup")}
        />
        <Text>{this.state.validationText}</Text>
      </ScrollView>
    );
  }
}

export default LoginScreen;