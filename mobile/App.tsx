import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DailyDropApp } from './src/DailyDropApp';

// Current Wi-Fi IP of development machine for Expo Go on Android phone
const DEFAULT_API_BASE_URL = 'http://172.19.13.103:5000';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <DailyDropApp
        apiBaseUrl={DEFAULT_API_BASE_URL}
        initialUserId="user_alex"
      />
    </SafeAreaProvider>
  );
}
