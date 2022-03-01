import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LoginScreen from './screens/LoginScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import SignupScreen from './screens/SignupScreen.js';
import SearchScreen from './screens/SearchScreen.js';
import LogoutScreen from './screens/LogoutScreen.js';
import UpdateUserScreen from './screens/UpdateUserScreen.js';
import FriendsScreen from './screens/UserScreen.js';
import AllFriendsScreen from './screens/AllFriendsScreen.js';
import FriendRequestScreen from './screens/FriendRequestScreen.js';
import CameraScreen from './screens/CameraScreen.js';
import SinglePostScreen from './screens/SinglePostScreen.js';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Friends request tabs need to be able to see the difference between the two 

function Tabs() {
    return(
        <Tab.Navigator>
            <Tab.Screen name="Profile" component={ProfileScreen}/>
            <Tab.Screen name="Search" component={SearchScreen}/>
            <Tab.Screen name="Friends" component={AllFriendsScreen}/>
            <Tab.Screen name="Logout" component={LogoutScreen}/>
        </Tab.Navigator>
    );
}


class App extends Component {
    render(){
        return(
            //Need to do some conditional rendering
            //Do an if Statement for logged in 
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="Signup" component={SignupScreen}/>
                    <Stack.Screen name="profileScreen" component={Tabs} options={{headerShown: false}} />
                    <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen}/>
                    <Stack.Screen name="UserScreen" component={FriendsScreen}/>
                    <Stack.Screen name="FriendRequestScreen" component={FriendRequestScreen}/>
                    <Stack.Screen name="CameraScreen" component={CameraScreen}/>
                    <Stack.Screen name="SinglePostScreen" component={SinglePostScreen}/>
                </Stack.Navigator>
            </NavigationContainer>          
        );
    }
}



export default App