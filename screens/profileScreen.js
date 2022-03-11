import React, {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Text, Button, Image, StyleSheet, TextInput, FlatList, View, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import {FontAwesome5} from '@expo/vector-icons'

class ProfileScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            userID: "",
            userIDPass: this.props.route.params.id,
            myProfile: false,
            isFriends: false,
            userInfo: [],
            postList: [],
            postInput: "",
            validationText: "",
            photo: null
        }
    }

    async componentDidMount() {
        const id = await AsyncStorage.getItem('user_id')
        //Checks the ID is -1 from navigator or the passed ID is the same as async
        if(this.state.userIDPass == -1 || this.state.userIDPass == id){
            this.setState({
                userID: id,
                myProfile: true
            })
        }else{
            this.setState({
                userID: this.state.userIDPass,
                myProfile: false
            })
        }

        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.getData();
            this.get_photo();
            this.get_posts();
        });
        this.getData();
        this.get_photo();
        this.get_posts();    
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value == null){
            this.props.navigation.navigate('login');
        }
    }

    getData = async () =>{
        const token = await AsyncStorage.getItem('@session_token')  
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.userID,{
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
            }else if(response.status === 404){
                console.log("Not found")
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            this.setState({
                userInfo: responseJson   
            })
            console.log(this.state.userInfo)
        })
        .catch((error) => {
            console.log(error);
        })
    }

    get_photo = async () =>{ 
        const token = await AsyncStorage.getItem("@session_token");
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/photo?" + Date.now(), {
            'method': 'get',
            'headers': {
                'X-Authorization': token
            },
        })
        .then((response) => {
            if(response.status === 200){
                return response.blob()
            }else if(response.status === 401){
                this.props.navigation.navigate("login")
            }else if(response.status === 404){
                console.log("Not found")
            }else{
                throw "Something"
            }
        })
        .then((responseBlob) =>{
            let data = URL.createObjectURL(responseBlob);
            this.setState({
                photo: data,
            })
        })
        .catch((error) =>{ 
            console.log(error)
        })
    }

    addFriend = async () =>{
        this.setState({validationText:""})
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/friends",{
            'method': 'post',
            'headers' : {
                    'X-Authorization': value
            }
        })
        .then((response) => {
            if(response.status ===200){
                console.log("Friend request sent")
            }else if(response.status === 401){
                this.props.navigation.navigate("login");
            }else if(response.status === 403){
                this.setState({validationText:"You have already sent your request"})
            }else if(response.status === 404){
                console.log('Not found')
            }else{
                console.log("Really not sure now")
            }
        })
        .catch((error) => {
            console.log(error);
        })
        
    }

    get_posts = async () =>{
        const token = await AsyncStorage.getItem("@session_token");
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post", {
          'method':'get',
          'headers': {
            'X-Authorization': token
          },
        })
        .then((response) => {
            if(response.status ===200){
                this.setState({
                  isFriends: true
                })
                return response.json()
            }else if(response.status === 401){
                this.props.navigation.navigate("login")
            }else if(response.status === 403){
                this.setState({
                    isFriends: false
                })
            }else{
                throw "Something went wrong"
            }
            
        })
        .then((responseJson) => {
          this.setState({
            postList: responseJson
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }

    add_post = async () => {
        const token = await AsyncStorage.getItem("@session_token")
        if(this.state.postInput != ""){
            let to_send =  {
                text: this.state.postInput
            }
            return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userID+"/post", {
                'method':"post",
                'headers': {
                    'X-Authorization': token,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(to_send)
            })
            .then((response) => {
                if(response.status === 201){
                    this.setState({
                        postInput: ""
                    })
                    this.get_posts();
                }else if(response.status === 401){
                    this.props.navigation.navigate("login")
                }else if(response.status === 404){
                    console.log("Not Found")
                }else{
                    throw "Somthing went wrong"
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }else{
            this.setState({validationText: "- Trying to add post with no text"})
        }
    }

    render(){
        if(this.state.myProfile){
            //Render profile
            return(
                <View>
                    <View style={styles.container}>
                        <Image
                            source={{
                            uri: this.state.photo,
                            }}
                            style = {styles.photoStyle}
                        />
                        <Text style={styles.nameStyle}>{this.state.userInfo.first_name} {this.state.userInfo.last_name}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            title='Friends'
                            onPress={() => this.props.navigation.navigate('friendsScreen',{userID: this.state.userID})}
                        />
                        <FontAwesome5 
                            name={'user-edit'} 
                            onPress={() => this.props.navigation.navigate('updateUserScreen')}
                            size={30}
                        />
                    </View>
                    <View style={styles.addPostContainer}>
                        <Text>Add Post</Text>
                        <TextInput
                            placeholder="Add posts"
                            onChangeText={(value) => this.setState({postInput: value})}
                            value={this.state.postInput}
                        />
                        <Text>{this.state.validationText}</Text>
                        <Button
                            title='Add Post'
                            onPress={() => this.add_post()}
                        />
                    </View>
                    <View>
                        <FlatList
                            style={{flex: 1}}
                            scrollEnabled={true}
                            data={this.state.postList}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={styles.postItem}
                                    onPress={() => this.props.navigation.navigate('singlePostScreen',{item: item.post_id, userInfo: this.state.userInfo.user_id, userName: this.state.userInfo.first_name })}
                                >
                                    <Text>{item.text}</Text>
                                    <Text>{item.numLikes} Likes</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
              );
        }else{
            if(!this.state.isFriends){
                return(
                    //Not friends
                    <View>
                        <View style={styles.container}>
                            <Image
                                source={{
                                    uri: this.state.photo,
                                }}
                                style = {styles.photoStyle}
                            />
                            <Text style={styles.nameStyle}>{this.state.userInfo.first_name} {this.state.userInfo.last_name}</Text>
                        </View>
                        <Button
                            title="Add Friend"
                            onPress = {() => this.addFriend()}
                        />
                        <Text>{this.state.validationText}</Text>
                    </View>
                ) 
            }else{
                return(
                    //You are friends
                    <View>
                        <View style={styles.container}>
                            <Image
                                source={{
                                    uri: this.state.photo,
                                }}
                                style = {styles.photoStyle}
                            />
                            <Text style={styles.nameStyle}>{this.state.userInfo.first_name} {this.state.userInfo.last_name}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Friends"
                                onPress={() => this.props.navigation.navigate('friendsScreen',{userID: this.state.userID})}
                            />
                        </View>
                        <View style={styles.addPostContainer}> 
                            <Text>Add Post</Text>
                            <TextInput
                                placeholder="Add a post"
                                onChangeText={(postInput) => this.setState({postInput})}
                                value={this.state.postInput}
                            />
                            <Text>{this.state.validationText}</Text>
                            <Button
                                title="Add Post"
                                onPress={() => this.add_post()}
                            />
                        </View>
                        <View >
                            <TouchableWithoutFeedback>
                            <FlatList
                                data={this.state.postList}
                                renderItem={({item}) => ( 
                                    <TouchableOpacity
                                        style={styles.postItem}
                                        onPress={() => this.props.navigation.navigate('singlePostScreen',{item: item.post_id, userInfo: this.state.userID, userName: this.state.userInfo.first_name})}
                                    >
                                        <Text>{item.text}</Text> 
                                        <Text>{item.numLikes} Likes</Text>
                                    </TouchableOpacity> 

                                )}
                            />
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                );
            }
            
        }
        
    }
}

const styles = StyleSheet.create({
    photoStyle: {
        width: 200,
        height: 200,
    },
    postItem: {
        padding:15,
        borderColor: 'steelblue',
        borderRadius: 1,
        borderWidth: 1,
        margin: 5
    },
    addPostContainer:{
        flex:1,
        alignItems: 'center',
        flexDirection: 'row',
        margin: 0,
        justifyContent: 'space-evenly',
        backgroundColor: 'lightblue'
    },
    nameStyle:{
        flex:1,
        width:130,
        height: 110,
        textAlign: 'center',
        fontSize: 18,
        
    },
    container: {
        flex: 1,
        height: 300,
        width: 393,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',    
    },
    buttonContainer: {
        flex:1,
        flexDirection:'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'center',
        
    }

})

export default ProfileScreen;