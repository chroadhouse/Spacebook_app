import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, Text, Button, TextInput, FlatList, View } from 'react-native-web';

class SearchScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            userInput: "",
            listData: []
        }
    }
    //Having issues with the userInput but I can't properly think why
    //Look at this in depth tomorrow
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });

      }
    
      componentWillUnmount(){
        this.unsubscribe();
      }
    
    getData = async () => {
        //Initial search should be with user input 
        // And then when filters are added look at 
        //So i need some sort of if statment to see what needs to be added
        //3 things i need to think about 
            //Search in - all or friends
            //limit - limit the number of returns
            //offset - number of items to skip before new start - only really need to fliter one thing
        if(this.state.userInput !== ""){
            const value = await AsyncStorage.getItem('@session_token');
            return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.userInput,{
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
                    listData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            })
        }else{
            console.log("You have not input any data")
        }
    }
    
    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null){
            this.props.navigation.navigate('Login');
        }
    };

    render() {
        return(
            <View>
                <ScrollView>
                    <TextInput
                        placeholder="Enter name to searcg for"
                        onChangeText={(userInput) => this.setState({userInput})}
                        value={this.state.userInput}
                    />
                    <Button
                        title="Seach:"
                        onPress = {() => this.getData()}
                    />
                    <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <View>
                            <Text>{item.user_givenname} {item.user_familyname}</Text>
                            </View>
                        )}
                    />
                </ScrollView>
            </View>
        );      
      }
}

export default SearchScreen;