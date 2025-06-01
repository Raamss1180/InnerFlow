import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, Platform } from 'react-native'; 

// Impor Firebase Messaging & Notifee
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import {HomeScreen,RecoveryScreen,MeditationLibrary,DailyJournal,MeditationDetail,JournalForm,} from './src';

const Tab = createBottomTabNavigator();
const MeditationStackNav = createStackNavigator();
const HomeStackNav = createStackNavigator(); 
const JournalStackNav = createStackNavigator();

async function onMessageReceived(remoteMessage) {
  console.log('[FCM] Message received in foreground:', remoteMessage);
  if (remoteMessage.notification) {
    try {
      const channelId = await notifee.createChannel({
        id: 'fcm_foreground_notifications',
        name: 'FCM Foreground Notifications',
        importance: AndroidImportance.HIGH,
      });
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId,
          smallIcon: 'ic_launcher', 
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('[FCM] Error displaying foreground notification with notifee:', error);
    }
  }
}

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
        options={{ title: 'Detail Meditasi', headerTitleStyle: { fontFamily: 'AMORIA', fontSize: 22 } }}
      />
    </MeditationStackNav.Navigator>
  );
}

function HomeStackScreen() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="MeditationDetail" component={MeditationDetail} options={{ title: 'Detail Meditasi', headerTitleStyle: { fontFamily: 'AMORIA', fontSize: 22 } }} />
      {/* Tambahkan screen lain di HomeStack jika ada, misal JournalForm dari HomeScreen */}
      <HomeStackNav.Screen name="JournalForm" component={JournalForm} options={{ title: 'Jurnal Harian', headerTitleStyle: { fontFamily: 'AMORIA', fontSize: 22 } }} />
    </HomeStackNav.Navigator>
  );
}

// Stack khusus untuk tab Jurnal
function JournalStackScreen() {
  return (
    <JournalStackNav.Navigator>
      <JournalStackNav.Screen name="Journals" component={DailyJournal} options={{ title: 'InnerFlow', headerTitleStyle: { fontFamily: 'AMORIA', fontSize: 22 } }} />
      <JournalStackNav.Screen name="JournalForm" component={JournalForm} options={{ title: 'Tambah Jurnal', headerTitleStyle: { fontFamily: 'AMORIA', fontSize: 22 } }} />
    </JournalStackNav.Navigator>
  );
}

// Variabel untuk menyimpan data navigasi dari notifikasi saat aplikasi quit
let initialNotificationData = null;

export default function App() {
  const navigationRef = useNavigationContainerRef(); 

  useEffect(() => {
    const requestUserPermissionAndGetToken = async () => {
      if (Platform.OS === 'android') {
        try {
          const authStatus = await messaging().requestPermission();
          const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

          if (enabled) {
            console.log('[FCM] Authorization status:', authStatus);
            const fcmToken = await messaging().getToken();
            console.log('[FCM] Token:', fcmToken);
          } else {
            console.log('[FCM] User did not grant permission for notifications.');
          }
        } catch (error) {
          console.error('[FCM] Error requesting notification permission:', error);
        }
      }
    };

    requestUserPermissionAndGetToken();
    const unsubscribeForeground = messaging().onMessage(onMessageReceived);
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('[FCM] Notification caused app to open from background state:', remoteMessage);
      if (remoteMessage.data && remoteMessage.data.navigateTo) {
        console.log('[FCM] Navigating to (from background):', remoteMessage.data.navigateTo, remoteMessage.data.params ? JSON.parse(remoteMessage.data.params) : undefined);
        if (navigationRef.isReady()) {
            navigationRef.navigate(remoteMessage.data.navigateTo, remoteMessage.data.params ? JSON.parse(remoteMessage.data.params) : undefined);
        }
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('[FCM] Notification caused app to open from quit state:', remoteMessage);
          if (remoteMessage.data && remoteMessage.data.navigateTo) {
            console.log('[FCM] Storing initial notification data for navigation:', remoteMessage.data.navigateTo, remoteMessage.data.params ? JSON.parse(remoteMessage.data.params) : undefined);
            initialNotificationData = {
                name: remoteMessage.data.navigateTo,
                params: remoteMessage.data.params ? JSON.parse(remoteMessage.data.params) : undefined,
            };
          }
        }
      });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
    };
  }, []);

  const handleNavigationReady = () => {
    if (initialNotificationData && navigationRef.isReady()) {
      console.log('[FCM] Navigator ready, attempting to navigate from initial notification:', initialNotificationData);
      navigationRef.navigate(initialNotificationData.name, initialNotificationData.params);
      initialNotificationData = null; 
    }
  };

  return (
    <NavigationContainer ref={navigationRef} onReady={handleNavigationReady}>
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
          tabBarStyle: [{ display: 'flex' }, null], 
        })}
      >
        <Tab.Screen name="Beranda" component={HomeStackScreen} />
        <Tab.Screen name="Recovery Hub" component={RecoveryScreen} />
        <Tab.Screen name="Meditasi" component={MeditationStack} />
        <Tab.Screen name="Jurnal" component={JournalStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}