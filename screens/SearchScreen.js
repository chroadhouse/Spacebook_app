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
            validationText: "",
            limit: 5,
            offset: 0,
            nextDisabled: false,
            backDisabled: true

        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }
    
    getData = async (page) => {
        if(page == -1){
            let temp = this.state.offset - this.state.limit
            this.setState({
                offset: temp,
                nextDisabled: false
            })
            if(temp==0){
                this.setState({
                    backDisabled: true
                })
            }
        }else if(page ==0){
            this.setState({
                offset: 0,
                
            })
        }else if(page == 1){
            let temp = this.state.offset + this.state.limit
            this.setState({
                offset: temp,
                backDisabled: false
            }) 
        }
        
        this.setState({validationText: ""})
        let searchMethod = 'all'
        if(this.state.friendSearch){
            searchMethod = 'friends'
        }
        //if(this.state.userInput !== ""){
        if(this.state.userInput == ""){
            const value = await AsyncStorage.getItem('@session_token');
            return fetch(`http://localhost:3333/api/1.0.0/search?q=${this.state.userInput}&search_in=${searchMethod}&limit=${this.state.limit}&offset=${this.state.offset}`,{
                'headers': {
                     'X-Authorization': value
                }
            })
            .then((response) => {
                if(response.status ===200){
                    return response.json()
                }else if(response.status === 400){
                    console.log("Bad Request")
                }else if(response.status === 401){
                    this.props.navigation.navigate("login");
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
                console.log(responseJson.length)
                if(responseJson.length < 5){
                    this.setState({
                        listData: responseJson,
                        limit: 5,
                        nextDisabled: true
                    })
                }else{
                    this.setState({
                        listData: responseJson,
                        limit: 5
                    })
                }
                
            })
            .catch((error) => {
                console.log(error);
            })
        }else{
            this.setState({
                validationText: "You have not entered Text in the text box",
                backEnabled: true
            })
        }
    }
    
    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null){
            this.props.navigation.navigate('login');
        }
    };


    render() {
        return(
            <View>
                <ScrollView>
                    <TextInput
                        placeholder="Enter name to search for"
                        onChangeText={(userInput) => this.setState({userInput})}
                        value={this.state.userInput}
                    />
                    <Text>Friends</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={this.state.friendSearch ? "#f5dd4b" : "#f4f3f4"}
                        value={this.state.friendSearch}
                        onValueChange = {(value) => this.setState({friendSearch: value})}
                        
                    />
                    <Button
                        title="Search:"
                        onPress = {() => this.getData(0)}
                    />
                    <Text>{this.state.validationText}</Text>
                    <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <View>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('userScreen',{id: item.user_id })}
                            >
                            <Text>{item.user_givenname} {item.user_familyname}</Text>
                            </TouchableOpacity>
                            </View>
                        )}
                    />
                    <Button
                        title='Next'
                        onPress={() => this.getData(1)}
                        disabled={this.state.nextDisabled}
                    />
                    <Button
                        title='Back'
                        onPress={() => this.getData(-1)}
                        disabled={this.state.backDisabled}
                    />
                </ScrollView>
            </View>
        );      
      }
}

export default SearchScreen;