import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import loginScreen from './screens/loginScreen';
import profileScreen from './screens/profileScreen';
import signupScreen from './screens/signupScreen';

const Drawer = createDrawerNavigator();

class App extends Component{
    render(){
        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Signup">
                    <Drawer.Screen name="login" component={loginScreen}/>
                    <Drawer.Screen name="Signup" component={signupScreen}/>
                </Drawer.Navigator>     
            </NavigationContainer>
        );
    }
}

export default App