import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import notifee, { EventType } from '@notifee/react-native';
import AppNavigator from './src/app';
import './src/i18n'; // Initialize i18n

// Handle background events for notifications
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  if (type === EventType.ACTION_PRESS && pressAction?.id === 'mark-as-done') {
    // We would mark the task as done in DB here
    // Requires headless store execution
    console.log('Task marked as done in background:', notification?.data?.taskId);
    await notifee.cancelNotification(notification?.id || '');
  }
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Request permission for notifications on startup
    const requestPermissions = async () => {
      await notifee.requestPermission();
    };
    requestPermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar 
            barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          />
          <AppNavigator />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
