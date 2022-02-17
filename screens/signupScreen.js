import React, { Component } from 'react';
import { ScrollView, TextInput, Button } from 'react-native-web';

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      secondPassord: ""
    }
  }

  signup = () => {
    
    if(this.state.password == this.state.secondPassord){
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
          this.props.navigation.naigate("Login")
      })
      .catch((error) => {
          console.log(error)
      })
    }else{
      console.log("Not the same password Dummy")
    }
  }

  render(){
        return(
            <ScrollView>
                <TextInput
                  placeholder="Enter your first name..."
                  onChangeText={(first_name) => this.setState({first_name})}
                  value={this.state.first_name}
                />
                <TextInput
                  placeholder="Enter your last name..."
                  onChangeText={(last_name) => this.setState({last_name})}
                  value={this.state.last_na}
                />
                <TextInput
                  placeholder="Enter your email..."
                  onChangeText={(email) => this.setState({email})}
                  value={this.state.email}
                />
                <TextInput
                  placeholder="Enter your password"
                  onChangeText={(password) => this.setState({password})}
                  value={this.state.password}
                />
                <TextInput
                  placeholder="Re-enter password"
                  onChangeText={(secondPassord) => this.setState({secondPassord})}
                  value={this.state.secondPassord}
                />
                <Button
                  title="Create account"
                  onPress={() => this.signup()}
                />
            </ScrollView>
        )
  }
}

export default SignupScreen;
