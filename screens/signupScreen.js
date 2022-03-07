import React, { Component } from 'react';
import { Text, ScrollView, TextInput, Button } from 'react-native-web';

class SignupScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      secondPassord: "",
      validationText: ""
    }
  }

  checkPassword(){
    let tempPassword = String(this.state.password)
    if(tempPassword.length > 7){
      if(/\d/.test(tempPassword)){
        if(/[A-Z]/.test(tempPassword)){
          let tempLastName = String(this.state.last_name)
          let tempFirstName = String(this.state.first_name)
          if(!tempPassword.includes(tempLastName) && !tempPassword.includes(tempFirstName)){
            return true
          }else{
            this.setState({
              validationText: "- Password cannot contain your first or last name"
            })
            return false
          }
        }else{
          this.setState({
            validationText: "- Password must include a capital letter"
          })
          return false
        }
      }else{
        this.setState({
          validationText: "- Password must contain an Integer"
        })
        return false
      }
    }else{
      this.setState({
        validationText: "- Password must be longer than 7 characters"
      })
      return false
    }
  }

  signup = () => {
    //Reset the validation text
    this.setState({
      validationText: ""
    })
    
    if(this.state.email != "" && this.state.password != "" && this.state.first_name != "" && this.state.last_name != "" && this.state.secondPassord !=""){
      if(this.state.email.includes("@")){
        if(this.checkPassword()){
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
                this.props.navigation.navigate("Login")
            })
            .catch((error) => {
                console.log(error)
            })
          }else{
            this.setState({
              validationText: "- The passwords do not Match"
            })
          }
        }
      }else{
        this.setState({
          validationText: "- Not a vaild email address, must have @ symbol"
        })
      }
    }else{
      this.setState({
        validationText: "- Data has been missed from some of the TextBoxes"
      })
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
                <Text>{this.state.validationText}</Text>
            </ScrollView>
        )
  }
}

export default SignupScreen;
