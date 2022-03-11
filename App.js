import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons/';



import LoginScreen from './screens/LoginScreen.js';
import ProfileScreen from './screens/ProfileScreen.js';
import SignupScreen from './screens/SignupScreen.js';
import SearchScreen from './screens/SearchScreen.js';
import LogoutScreen from './screens/LogoutScreen.js';
import UpdateUserScreen from './screens/UpdateUserScreen.js';
import AllFriendsScreen from './screens/AllFriendsScreen.js';
import FriendRequestScreen from './screens/FriendRequestScreen.js';
import CameraScreen from './screens/CameraScreen.js';
import SinglePostScreen from './screens/SinglePostScreen.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


function Tabs() {
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'profile') {
                    iconName = 'user-alt'
                } else if (route.name === 'search') {
                    iconName = focused ? 'list' : 'search';
                } else if (route.name === 'friends') {
                    iconName = "users"
                }else if (route.name === 'logout') {
                    iconName = 'sign-out-alt';
                }
                return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'steelblue',
                tabBarInactiveTintColor: 'gray',
                
            })}
        >
            <Tab.Screen name="profile" component={ProfileScreen} initialParams={{id: -1}} options={{title:''}} />
            <Tab.Screen name="search" component={SearchScreen} options={{title: ''}} />
            <Tab.Screen name="friends" component={FriendRequestScreen} options={{title: ''}} />
            <Tab.Screen name="logout" component={LogoutScreen} options={{title:''}} />
        </Tab.Navigator>
    );
}

class App extends Component {
    render(){
        return(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="login" component={LoginScreen} options={{headerShown: false}} />
                    <Stack.Screen name="signup" component={SignupScreen} options={{headerTitle: ''}} />
                    <Stack.Screen name="profileScreen" component={Tabs} options={{headerShown: false, cardStyle: {flex: 1}}} />
                    <Stack.Screen name="updateUserScreen" component={UpdateUserScreen} options={{headerTitle: '' }} />
                    <Stack.Screen name="userScreen" component={ProfileScreen} options={{headerTitle: '' }} />
                    <Stack.Screen name="friendsScreen" component={AllFriendsScreen} options={{headerTitle: '' }} />
                    <Stack.Screen name="cameraScreen" component={CameraScreen} options={{headerTitle: '' }} />
                    <Stack.Screen name="singlePostScreen" component={SinglePostScreen} options={{headerTitle: '' }} /> 
                </Stack.Navigator>
            </NavigationContainer>          
        );
    }
}

export default App