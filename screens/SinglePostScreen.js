import React, {Component} from "react";
import {Text, Button, TextInput, View, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";


class SinglePostScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            //Here i want to do what i did for the user screen 
            userID: this.props.route.params.userInfo,
            postID: this.props.route.params.item,
            postData: [],
            postText: "",
            editPost: false,
            userVerifed: false,
            updating: false, 
            likeTitle: "Like", 
            numberOfLikes: 0
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getPostData();
        });
        if(!this.state.userVerifed){
            this.checkLiked();
        }

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

    updatePost = async () =>{
        console.log(this.state.postText)
        //Check if they are the same 
        //this.setState({editPost: false})
        if(this.state.postText != ""){
            if(this.state.postText != this.state.postData.text){
                //Doesn't need updating
                let to_send = {}
                to_send['text'] = this.state.postText
                const token = await AsyncStorage.getItem('@session_token');
                
                console.log(JSON.stringify(to_send))
                return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post/"+this.state.postID,{
                    'method': 'PATCH',
                    'headers': {
                        'X-Authorization':token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(to_send)
                })
                .then((response) => {
                    if(response.status === 200){
                        console.log('Good response')
                    }else if(response.status === 400){

                    }else if(response.status === 401){
                        this.props.navigation.navigate("Login")
                    }else if(response.status === 403){
                        console.log("Cannot update other peoples posts")
                    }else if(response.status === 404){
                        console.log("Not found")
                    }else{
                        throw "Server Error "
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
            }
        }
        else{
            console.log("NO DATA")
        }
    }

    deletePost = async () =>{
        //Delete
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post/"+this.state.postID, {
            'method': 'Delete',
            'headers':{
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status ===200){
                console.log("Response is good")
                this.props.navigation.navigate("profileScreen")
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else if(response.status === 403){
                console.log("You can only delete your own posts")
            }else if(response.status === 404){
                console.log("Not found")
            }else{
                throw "Something not working"
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    checkLiked = async () =>{
        //Check whether they have being liked or not 
        //not liked - will like 
        const token = await AsyncStorage.getItem('@session_token')
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post/"+this.state.postID+"/like", {
            'method': 'POST',
            'headers':{
                'X-Authorization': token
            }
        })
        .then((response) => {
            if(response.status === 200){
                return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post/"+this.state.postID+"/like", {
                    'method': 'DELETE',
                    'headers':{
                        'X-Authorization': token
                    }
                })
            
            }else if(response.status === 400 || response.status === 403){
                this.setState({
                    likeTitle: "unlike"
                })
            }
            
        })  
    }


    likePost = async () =>{
        let likeRequest
        if(this.state.likeTitle =="Like"){
            likeRequest = "POST"
            this.setState({
                likeTitle: "Unlike"
            })
        }else{
            likeRequest ="DELETE"
            this.setState({
                likeTitle: "Like"
            })
        }

        const token = await AsyncStorage.getItem('@session_token')
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post/"+this.state.postID+"/like", {
            'method': likeRequest,
            'headers': {
                'X-Authorization': token
            }
         })
        .then((response) =>{
            if(response.status === 200){
                console.log("response is 2000 - good")
            }else if(response.status === 401){
                this.props.navigation.navigate("Login")
            }else if(response.status === 403){
                console.log("Forbidden ")
            }else{
                throw "Somehting"
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    getPostData = async () =>{
        const id = await AsyncStorage.getItem('user_id')
        const token = await AsyncStorage.getItem('@session_token')
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post/"+this.state.postID, {
            'method': 'get',
            'headers':{
                'X-Authorization': token
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
                this.props.navigation.navigate("Login")
            }else if(response.status === 403){
                console.log("Can only view the posts of yourself or friends")
            }else if(response.status === 404){
                console.log("Not Found")
            }else{
                throw "Something not working"
            }
        })
        .then((responseJson) => {
            if(id == responseJson.author.user_id){
                this.setState({
                    postData: responseJson,
                    userVerifed: true
                })
            }else{
                this.setState({
                    postData: responseJson,
                    userVerifed: false
                })
            }
            
        })
        .catch((error) => {
            console.log(error)
        })
    }


    //Must be able to still like and unlike on this screen - Can be done lateer 
    //Conditional rendering if the author is the same as the user logged in 
    render(){
        if(this.state.userVerifed){
            if(!this.state.editPost){
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
                            editable={this.state.editPost}
                            numberOfLines={4}
                            onChangeText={(value) => this.setState({postText: value})}
                            defaultValue={this.state.postData.text}
                        />
                        <Button
                            title="Save"
                            onPress={() => this.updatePost()}
                        />
                        <Button
                            title="Back"
                            onPress={(value) => this.setState({editPost: false})}
                            value={this.state.editPost}
                        />
                    </ScrollView>
                )
            }
        }else{
            return(
                <ScrollView>
                    <TextInput
                        multiline
                        editable={false}
                        numberOfLines={4}
                        defaultValue={this.state.postData.text}
                    />
                    <Button
                        title={this.state.likeTitle}
                        onPress={() => this.likePost()}
                    />
                </ScrollView>
            )
        }
    }
}

export default SinglePostScreen;