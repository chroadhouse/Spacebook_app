import React, {Component} from "react";
import {Text} from 'react-native';

class FriendsScreen extends Component{
    constructor(props){
        super(props);

        this.state ={
            first_name: "",
            last_name: ""
        }
    }

    render(){
        return(
            <Text>Testign</Text>
        );
    }

}

export default FriendsScreen;