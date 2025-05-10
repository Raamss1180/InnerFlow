import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HomeScreen, RecoveryScreen, MeditationLibrary, DailyJournal } from './src';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            // Atur ikon untuk masing-masing tab
            if (route.name === 'Beranda') {
              iconName = 'home-outline';
            } else if (route.name === 'Recovery Hub') {
              iconName = 'medkit-outline';
            } else if (route.name === 'Meditasi') {
              iconName = 'library-outline';
            } else if (route.name === 'Jurnal') {
              iconName = 'document-text-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007aff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Beranda" component={HomeScreen} />
        <Tab.Screen name="Recovery Hub" component={RecoveryScreen} />
        <Tab.Screen name="Meditasi" component={MeditationLibrary} />
        <Tab.Screen name="Jurnal" component={DailyJournal} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
