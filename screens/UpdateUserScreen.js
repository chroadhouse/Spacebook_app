import React, {Component} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, Button, TextInput, View} from "react-native";

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
            password_verify: ""
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
                first_name_og: responseJson.first_name,
                last_name_og: responseJson.last_name,
                email_og: responseJson.email,
              })
          })
          .catch((error) => {
              console.log("Something is going wrog")
              console.log(error);
          })
      }

      updateUser = async() =>{
        //Update user needs the ID of the user
        //Then we just update all the data in there
        //

        let to_send = {};
        
        if(this.state.first_name != this.state.first_name_og && this.state.first_name != ""){
            to_send['first_name'] = this.state.first_name;
        }

        if(this.state.last_name != this.state.last_name_og && this.state.last_name != ""){
            to_send['last_name'] = this.state.last_name;
        }

        if(this.state.email != this.state.email_og && this.state.email != ""){
            to_send['email'] = this.state.email;
        }

        if(this.state.password != "" && this.state.password === this.state.password_verify){
            to_send['password'] = this.state.password;
        }

        console.log(JSON.stringify(to_send));
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('user_id');

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
                this.props.navigation.navigate("Login");
              }else{
                throw 'Something went wrong';
              }
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

      render(){
          return(
            <View>
                <Text>First Name</Text>
                <TextInput
                    placeholder={this.state.first_name_og} 
                    //defaultValue={this.state.first_name_og}
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                />
                <Text>Last Name</Text>
                <TextInput
                    placeholder={this.state.last_name_og}
                    //defaultValue={this.state.last_name_og}
                />
                <Text>Email</Text>
                <TextInput
                    placeholder={this.state.email_og}
                    //defaultValue={this.state.email_og}
                />

                <Text>Update a new Password</Text>
                <TextInput
                    placeholder="Password here"
                />
                <Text>Verify Password</Text>
                <Button
                    title="Save Data"
                    onPress={() => this.updateUser()}
                />
            </View>
          );
      }
}

export default UpdateUserScreen;