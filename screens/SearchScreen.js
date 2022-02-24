import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, Text, Button, TextInput, FlatList, View, Switch, TouchableOpacity } from 'react-native-web';

class SearchScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            userInput: "",
            friendSearch: false,
            listData: [],
            selectedUserID: 0,
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
            //limit - lmit the number of returns
            //offset - number of items to skip before new start - only really need to fliter one thing
        //Toggle is not currently working
        let searchMethod = 'all'
        if(this.state.friendSearch){
            console.log('TRUE')
            searchMethod = 'friends'
            
        }else{
            console.log('FALSE')
        }

        if(this.state.userInput !== ""){
            const value = await AsyncStorage.getItem('@session_token');
            return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.userInput}&search_in=${searchMethod}`,{
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
                    <Text>Friends</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.friendSearch ? "#f5dd4b" : "#f4f3f4"}
                        value={this.state.friendSearch}
                        onValueChange = {(friendSearch) => this.setState({friendSearch: !friendSearch})}
                        
                    />
                    <Button
                        title="Seach:"
                        onPress = {() => this.getData()}
                    />
                    <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <View>
                            
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('FriendsScreen',{item: item })}
                            >
                            <Text>{item.user_givenname} {item.user_familyname}</Text>
                            </TouchableOpacity>
                            </View>
                        )}
                    />
                </ScrollView>
            </View>
        );      
      }
}

export default SearchScreen;