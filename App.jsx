import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecoveryScreen from './src/screens/RecoveryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                let iconName;
    
                if (route.name === 'Beranda') {
                    iconName = 'home-outline';
                } else if (route.name === 'Recovery Hub') {
                    iconName = 'heart-outline';
                }
    
                return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007aff',
                tabBarInactiveTintColor: 'gray',
            })}
            >
            <Tab.Screen name="Beranda" component={HomeScreen} />
            <Tab.Screen name="Recovery Hub" component={RecoveryScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
