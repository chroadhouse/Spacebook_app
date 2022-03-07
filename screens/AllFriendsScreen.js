import React, {Component} from 'react'
import {Text, Button, TouchableOpacity} from 'react-native'
import { ScrollView, View, FlatList } from 'react-native-web';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AllFriendsScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            listData: []
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
        //This is just a generic statment I think 
        const token = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + id+"/friends",{
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
            <View>
                <ScrollView>
                <Button
                    title='Friend Requests'
                    onPress={() => this.props.navigation.navigate('friendRequestScreen')}
                />
                <FlatList
                        data={this.state.listData}
                        renderItem={({item}) => (
                            <View>
                            <Text>Testing</Text>
                            <Text>{item.user_id}</Text>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('userScreen',{item: item})}
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

export default AllFriendsScreen