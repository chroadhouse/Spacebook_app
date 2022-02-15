import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/LoginScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import SignupScreen from './screens/SignupScreen.js';
import SeachSvreen from './screens/SearchScreen.js';


const Tab = createBottomTabNavigator();

class App extends Component{
    render(){
        return(
            //Need to do some conditional rendering
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Login" component={LoginScreen}/>
                    <Tab.Screen name="Signup" component={SignupScreen}/>
                    <Tab.Screen name="ProfileScreen" component={(ProfileScreen)}/>
                </Tab.Navigator>
            </NavigationContainer>          
        );
    }
}

export default App