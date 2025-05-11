import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen, RecoveryScreen, MeditationLibrary, DailyJournal, MeditationDetail, meditationList} from './src';

const Tab = createBottomTabNavigator();
const MeditationStackNav = createStackNavigator();

// 👉 Stack khusus untuk tab Meditasi
function MeditationStack() {
  return (
    <MeditationStackNav.Navigator>
      <MeditationStackNav.Screen
        name="MeditationLibrary"
        component={MeditationLibrary}
        options={{ headerShown: false }}
      />
      <MeditationStackNav.Screen
        name="MeditationDetail"
        component={MeditationDetail}
        options={{ title: 'Detail Meditasi' }}
      />
    </MeditationStackNav.Navigator>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="MeditationDetail" component={MeditationDetail} options={{ title: 'Detail Meditasi' }} />
    </HomeStack.Navigator>
  );
}


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
        <Tab.Screen name="Beranda" component={HomeStackScreen} />
        <Tab.Screen name="Recovery Hub" component={RecoveryScreen} />
        <Tab.Screen name="Meditasi" component={MeditationStack} />
        <Tab.Screen name="Jurnal" component={DailyJournal} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}