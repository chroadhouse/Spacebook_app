import React, {Component} from "react";
import {Text, Button, TextInput, View,  StyleSheet} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5 } from '@expo/vector-icons/';


class SinglePostScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            //Here i want to do what i did for the user screen 
            userID: this.props.route.params.userInfo,
            postID: this.props.route.params.item,
            userName: this.props.route.params.userName,
            postData: [],
            postText: "",
            authorName:"",
            editPost: false,
            userVerifed: false,
            updating: false, 
            likeTitle: "thumbs-up", 
            validationText: "",
            ownProfile: false
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
            this.props.navigation.navigate('login');
        }
    };

    updatePost = async () =>{
        
        this.setState({validationText: ""})
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
            this.setState({validationText: "You are trying to update the post with no data"})
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
                this.props.navigation.navigate("login");
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
        const id = await AsyncStorage.getItem('user_id')
        const token = await AsyncStorage.getItem('@session_token')
        if(id != this.state.userID){
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
                        likeTitle: "thumbs-down"
                    })
                }
                
            })
        }else{
            this.setState({ownProfile: true})
        }
    }


    likePost = async () =>{
        let likeRequest
        if(this.state.likeTitle =="thumbs-up"){
            likeRequest = "POST"
            this.setState({
                likeTitle: "thumbs-down"
            })
        }else{
            likeRequest ="DELETE"
            this.setState({
                likeTitle: "thumbs-up"
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
                this.getPostData()
                console.log("response is 2000 - good")
            }else if(response.status === 401){
                this.props.navigation.navigate("login")
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
                this.props.navigation.navigate("login")
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
                    userVerifed: true,
                    authorName: responseJson.author.first_name
                })
            }else{
                this.setState({
                    postData: responseJson,
                    userVerifed: false,
                    authorName: responseJson.author.first_name
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
                    <View>
                        <View>
                            <Text style={styles.label}>Posted to {this.state.userName}'s wall</Text>
                            <Text style={styles.label}>By {this.state.authorName}</Text>
                        </View>
                        
                        <TextInput
                            style={styles.postStyle}
                            multiline
                            editable={this.state.editPost}
                            numberOfLines={4}
                            onChangeText={(value) => this.setState({postText: value})}
                            defaultValue={this.state.postData.text}
                        />
                        <Text style={styles.label}>Likes: {this.state.postData.numLikes}</Text>
                        <Button
                            title="Update"
                            onPress={(value) => this.setState({editPost: value})}
                            value={this.state.editPost}
                            
                        />
                        <Button
                            title="Delete"
                            onPress={() => this.deletePost()}
                        />
                    </View>
                )
            }else{
                return(
                    <View>
                        <View>
                            <Text style={styles.label}>Posted to {this.state.userName}'s wall</Text>
                            <Text style={styles.label}>By {this.state.authorName}</Text>
                        </View>
                        <TextInput
                            style={styles.postStyle}
                            multiline
                            editable={this.state.editPost}
                            numberOfLines={4}
                            onChangeText={(value) => this.setState({postText: value})}
                            defaultValue={this.state.postData.text}
                        />
                        <Text>{this.state.validationText}</Text>
                        <Text style={styles.label}>Likes: {this.state.postData.numLikes}</Text>
                        <Button
                            title="Save"
                            onPress={() => this.updatePost()}
                        />
                        <Button
                            title="Back"
                            onPress={(value) => this.setState({editPost: false}, () => this.getPostData())}Yea
                            value={this.state.editPost}
                        />
                    </View>
                )
            }
        }else{
            if(!this.state.ownProfile){
                return(
                    <View>
                        <View>
                            <Text style={styles.label}>Posted to {this.state.userName}'s wall</Text>
                            <Text style={styles.label}>By {this.state.authorName}</Text>
                        </View>
                        <TextInput
                            style={styles.postStyle}
                            multiline
                            editable={false}
                            numberOfLines={4}
                            defaultValue={this.state.postData.text}
                        />
                        <Text style={styles.label}>Likes: {this.state.postData.numLikes}</Text>
                        <FontAwesome5
                            name={this.state.likeTitle}
                            onPress={() => this.likePost()}
                            size={30}
                        />
                    </View>
                )
            }else{
                return(
                    <View>
                        <View>
                            <Text style={styles.label}>Posted to {this.state.userName}'s wall</Text>
                            <Text style={styles.label}>By {this.state.authorName}</Text>
                        </View>
                        <TextInput
                            style={styles.postStyle}
                            multiline
                            editable={false}
                            numberOfLines={4}
                            defaultValue={this.state.postData.text}
                        />
                        <Text style={styles.label}>Likes: {this.state.postData.numLikes}</Text>
                    </View>
                )
            }
        }
    }
}

const styles = StyleSheet.create({
    label: {
        fontSize:15,
        color:'steelblue'
    },
    postStyle: {
        borderWidth:1,
        borderColor: 'lightblue',
        borderRadius:5,
      }
})

export default SinglePostScreen;