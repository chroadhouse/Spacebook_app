import React, {Component} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, Button, TextInput, View, StyleSheet} from "react-native";

class UpdateUserScreen extends Component{
  constructor(props){
    super(props);

    this.state = {
      email_og: "",
      password: "",
      first_name_og: "",
      last_name_og: "",
      email: "",
      first_name: "",
      last_name: "",
      password_verify: "",
      validationText: ""
    }
  }

  

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.getData();
    });
      
  }
    
  componentWillUnmount(){
    this.unsubscribe();
  }
    
  getData = async () => {
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
        this.props.navigation.navigate("login");
      }else{
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      this.setState({
        first_name_og: responseJson.first_name,
        last_name_og: responseJson.last_name,
        email_og: responseJson.email,
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }


  updateUser = async() =>{
    this.setState({
      validationText: ""
    })
    let to_send = {};
    let tempString = ""
    let firstNameChange, lastNameChange = false
    let passValidation = true
        
    if(this.state.first_name != this.state.first_name_og && this.state.first_name != ""){
      to_send['first_name'] = this.state.first_name;
      firstNameChange = true
    }

    if(this.state.last_name != this.state.last_name_og && this.state.last_name != ""){
      to_send['last_name'] = this.state.last_name;
      lastNameChange = true
    }

    if(this.state.email != this.state.email_og && this.state.email != ""){
      if(this.state.email.includes("@")){
        to_send['email'] = this.state.email;
      }else{
        tempString = tempString + "- Email does not contain @ symbol \n"
        passValidation = false
      }
    }

    if(this.state.password != "" && this.state.password_verify != ""){
      let tempFirstName, tempLastName

      if(firstNameChange){
        tempFirstName = this.state.first_name
      }else{
        tempFirstName = this.state.first_name_og
      }

      if(lastNameChange){
        tempLastName = this.state.last_name
      }else{
        tempLastName = this.state.last_name_og
      }
      //Password Validation
      if(this.state.password.length > 7){
        if(/\d/.test(this.state.password)){
          if(/[A-Z]/.test(this.state.password)){
            if(!this.state.password.includes(tempFirstName) && ! this.state.password.includes(tempLastName)){
              if(this.state.password === this.state.password_verify){
                to_send['password'] = this.state.password;
              }else{
                tempString = tempString + "- The passwords you have entered are not the same \n"
                passValidation = false
              }
            }else{
              tempString = tempString + "- Password cannot contain first or last name \n"
              passValidation = false
            }
          }else{
            tempString = tempString + "- Password must contain a capital letter \n"
            passValidation = false
          }
        }else{
          tempString = tempString + "- Password must contain an integer\n"
          passValidation = false
        }
      }else{
        tempString = tempString + "- Password must be longer than 7 characters \n"
        passValidation = false
      }
    }

    
    const token = await AsyncStorage.getItem('@session_token');
    const id = await AsyncStorage.getItem('user_id');
    if(passValidation){
      return fetch("http://localhost:3333/api/1.0.0/user/" + id,{
        'method': 'PATCH',
        'headers': {
          'X-Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(to_send)
      })
      .then((response) => {
        if(response.status ===200){
          this.props.navigation.navigate('profileScreen')
        }else if(response.status === 401){
          this.props.navigation.navigate("login");
        }else if(response.status === 403){
          console.log("Forbidden")
        }else if(response.status === 404){
          console.log("Not Found")
        }else{
          throw "Something"
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }else{
      this.setState({validationText: tempString})
    }
  }
    

  
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if(value == null){
      this.props.navigation.navigate('login');
    }
  };

  render(){
    return(
      <View>
        <Text style={styles.title}>SPACEBOOK</Text>

        <View style={styles.formItem}>
          <Text style={styles.formLabel}>First Name</Text>
          <TextInput
            style={styles.formInput}
            onChangeText={(value) => this.setState({first_name: value})}
            defaultValue={this.state.first_name_og}
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Last Name</Text>
          <TextInput
            defaultValue={this.state.last_name_og}
            onChangeText={(value) => this.setState({last_name: value})}
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.formInput}
            onChangeText={(value) => this.setState({email: value})}
            defaultValue={this.state.email_og}
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Update a new Password</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Password here"
            onChangeText={(value) => this.setState({password: value})}
          />
        </View>

        <View style={styles.formItem}>
          <Text style={styles.formLabel}>Verify Password</Text>
          <TextInput
            style={styles.formInput}
            placeholder="Password Here"
            onChangeText={(value) => this.setState({password_verify: value})}
          />
        </View>
        <Button
          title="Save Data"
          onPress={() => this.updateUser()}
        />
        <Button
          title="Update Profile Photo"
          onPress={() => this.props.navigation.navigate('cameraScreen')}
        />
        
        <Text>{this.state.validationText}</Text>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color:'steelblue',
    backgroundColor:'lightblue',
    padding:10,
    flex: 1,
    justifyContent: 'center',
    fontSize:25
  },
  formItem: {
    padding:25,
    borderColor: 'steelblue',
    borderRadius: 3,
    borderWidth: 1
  },
  formLabel: {
    fontSize:15,
    color:'steelblue'
  },
  formInput: {
    borderWidth:1,
    borderColor: 'lightblue',
    borderRadius:5,
  }
})

export default UpdateUserScreen;