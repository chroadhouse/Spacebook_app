import React, {Component} from 'react'
import {Text, TouchableOpacity} from 'react-native'
import { View, FlatList, StyleSheet } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AllFriendsScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            listData: [],
            userID: this.props.route.params.userID
        }
    }
    
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
          this.getData();
        });
      
        
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
    
    getData = async () => {
        const token = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.userID+"/friends",{
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
                this.props.navigation.navigate("login");
            }else if(response.status === 403){
                console.log("You can only view the friends of yourself or your friends");
            }else if(response.status === 404){
                console.log("No one is there")
            }else if(response.status === 500){
                console.log("Server Error")
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
            console.log("Something is going wrog")
            console.log(error);
        })
    }

    render() {
        return (
            <View style={{backgroundColor: 'lightblue'}}>
                <Text style={styles.title}>Friends</Text>
                <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View style={styles.friendItem}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('userScreen',{id: item.user_id})}
                        >
                        <Text style={styles.friendText}>{item.user_givenname} {item.user_familyname}</Text>
                        </TouchableOpacity>
                        </View>
                    )}
                />
            </View>

        );
    }
}

const styles = StyleSheet.create({
    title: {
        color:'steelblue',
        backgroundColor:'lightblue',
        padding:10,
        flex: 1,
        textAlign: 'center',
        fontSize:25
      },
      friendItem: {
        padding:15,
        borderColor: 'steelblue',
        borderRadius: 1,
        borderWidth: 1
    },
    friendText:{
        textAlign: 'center',
        fontSize: 18,
    }
})

export default AllFriendsScreen