import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, Text, Button, TextInput } from 'react-native-web';

class SearchScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            userInput: ""
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
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search",{
            'headers': {
              'X-Authorization': value
            }
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
                listData: responseJson
              })
          })
          .catch((error) => {
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
            <ScrollView>
                <Text>"Please Input something here"</Text>
            </ScrollView>
          );
      }
}

export default SearchScreen;