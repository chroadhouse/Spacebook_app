import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TextInput, Button } from 'react-native-web';

class signupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    }
  }

  signup = () => {
    //Validation here 

    return fetch("http://localhost:3333/api/1.0.0/user", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })
    .then((response) => {
        if(response.status === 201){
            return response.json
        }else if(response.status === 400){
            throw 'Failed Validation';
        }else{
            throw 'Something went wrong';
        }
    })
    .then((responseJson) => {
        console.log("User created with ID: ",responseJson);
        this.props.navigation.naigate("login")
    })
    .catch((error) => {
        console.log(error)
        //Probably want to have some sort of alert here for the user
    })
  }

  render(){
      return(
          <ScrollView>
              <TextInput
                placeholder="Eneter your first name..."
                onChangeText={(first_name) => this.setState({first_name})}
                value={this.state.first_name}
              />
              <TextInput
                placeholder="Enter your last name..."
                onChangeText={(last_name) => this.setState({last_name})}
                value={this.state.fir}
              />
              <TextInput
                placeholder="Enter your email..."
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
              />
              <Button
                title="Create account"
                onPress={() => this.signup()}
              />
          </ScrollView>
      )
  }
}

export default signupScreen;
