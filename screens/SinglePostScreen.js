import React, {Component} from "react";
import {Text, Button, TextInput, View, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


class SinglePostScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            //Here i want to do what i did for the user screen 
            postData: this.props.route.params.item,
            postText: "",
            editPost: false,
            userVerifed: false
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
        this.checkUser();

    }
    
    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null){
            this.props.navigation.navigate('Login');
        }
    };
    //If the logged in user is the same as the author then they should be able to see  the update and delet button
    //Could possibly hide this in a view

    updatePost = async () =>{
        //Don't need to verify 
        //Patch 
        console.log(this.state.postText)
        //Check if they are the same 
        if(this.state.postText != this.state.postData.text){
            //Doesn't need updating
            let to_send = {}
            to_send['text'] = this.state.postText
            const token = await AsyncStorage.getItem('@session_token');
            const id = await AsyncStorage.getItem('user_id');
            console.log(JSON.stringify(to_send))
            return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+this.state.postData.post_id,{
                'method': 'PATCH',
                'headers': {
                    'X-Authorization':token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(to_send)
            })
            .then((response) => {
                if(response.status === 200){
                    console.log('Good responseß')
                }else{
                    console.log('Bad response')
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }

    deletePost = async () =>{
        //Delete
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post/"+this.state.postData.post_id, {
            'method': 'Delete',
            'headers':{
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status ===200){
                console.log("Response is good")
                //Naviagte backward
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    checkUser = async () =>{
        const id = await AsyncStorage.getItem('user_id')
        if(id == this.state.postData.author.user_id){
            this.setState({
                userVerifed: true
            })
        }else{
            this.setState({
                userVerifed: false
            })    
        }
    }

    //Must be able to still like and unlike on this screen - Can be done lateer 
    //Conditional rendering if the author is the same as the user logged in 
    render(){
        if(this.state.userVerifed){
            return(
                <ScrollView>
                    <TextInput
                        multiline
                        editable={this.state.editPost}
                        numberOfLines={4}
                        onChangeText={(value) => this.setState({postText: value})}
                        defaultValue={this.state.postData.text}
                    />
                    <Button
                        title="Update"
                        onPress={(value) => this.setState({editPost: value})}
                        value={this.state.editPost}
                        
                    />
                    <Button
                        title="Save"
                        onPress={() => this.updatePost()}
                    />
                    <Button
                        title="Delete"
                        onPress={() => this.deletePost()}
                    />
                </ScrollView>
            )
        }else{
            return(
                <ScrollView>
                    <TextInput
                        multiline
                        editable={false}
                        numberOfLines={4}
                        defaultValue={this.state.postData.text}
                    />
                </ScrollView>
            )
        }
    }
}

export default SinglePostScreen;