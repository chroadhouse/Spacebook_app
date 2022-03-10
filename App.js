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

// Friends request tabs need to be able to see the difference between the two 

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
                // You can return any component that you like here!
                return <FontAwesome5 name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'steelblue',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="profile" component={ProfileScreen} initialParams={{id: -1}} options={{title:'Profile'}} />
            <Tab.Screen name="search" component={SearchScreen} options={{title: 'Search'}} />
            <Tab.Screen name="friends" component={FriendRequestScreen} options={{title: 'Friend Requests'}} />
            <Tab.Screen name="logout" component={LogoutScreen} options={{title:''}} />
        </Tab.Navigator>
    );
}
//Friends needs to become friend request and friend request needs to become freinds


class App extends Component {
    //Get the number of friends
    render(){
        return(
            //Need to do some conditional rendering
            //Do an if Statement for logged in 
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="login" component={LoginScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="signup" component={SignupScreen} options={{headerTitle: ''}}/>
                    <Stack.Screen name="profileScreen" component={Tabs} options={{headerShown: false}} />
                    <Stack.Screen name="updateUserScreen" component={UpdateUserScreen} options={{headerTitle: '' }} />
                    <Stack.Screen name="userScreen" component={ProfileScreen} />
                    <Stack.Screen name="friendsScreen" component={AllFriendsScreen} />
                    <Stack.Screen name="cameraScreen" component={CameraScreen} />
                    <Stack.Screen name="singlePostScreen" component={SinglePostScreen} />
                    
                </Stack.Navigator>
            </NavigationContainer>          
        );
    }
}



export default App