import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TextInput, Button } from 'react-native-web';

class loginScreen extends Component{
  constructor(props){
    super(props);

    this.state = {
      email: "",
      password: ""
    }
  }

  login = async () => {

    //Validation here...
    //validation needs to be to check if the email is a vaid email 
    //What sort of validation do you need for an email ? 
    if(this.state.email.length > 0 && this.state.password.length > 0){
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
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                this.props.navigation.navigate("profileScreen");
        })
        .catch((error) => {
            console.log(error);
        })
      }else{
        //Some sort of alert here
        console.log("@ me silly ")
      }
    }else{
      console.log("You are missing one or more text boxes")
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
          onPress={() => this.props.navigation.navigate('signupScreen')}
        />
      </ScrollView>
    );
  }
}

export default loginScreen