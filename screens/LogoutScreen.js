import React, { Component } from "react";
import {Text, Button, StyleSheet, View} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

class LogoutScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            token: ''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });        
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("login");
        }
    }

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("login");
            }else if(response.status === 401){
                this.props.navigation.navigate("login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <View>
                <Text style={styles.title}>LOGOUT</Text>
                <Text style={styles.messageText}>Are you sure you want to log out? </Text>
                <Button
                    title="Yes"
                    onPress={() => this.logout()}
                />
                <Button
                    title="No"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("profile")}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    messageText:{
        fontSize:18,
        fontWeight:'bold',
        padding:5,
        margin:5,
        textAlign: 'center'
    },
    title: {
        color:'steelblue',
        backgroundColor:'lightblue',
        padding:10,
        flex: 1,
        textAlign: 'center',
        fontSize:25
      },

})

export default LogoutScreen;