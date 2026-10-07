import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DailyDropApp } from './src/DailyDropApp';

// Default Wi-Fi IP of development machine for physical Expo Go / emulator
const DEFAULT_API_BASE_URL = 'http://10.86.31.27:5000';

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
