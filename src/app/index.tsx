import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Calendar, Folder, Settings, BarChart } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { initDB } from '../db';
import { useStore } from '../store';

// Import Screens
import HomeScreen from '../features/tasks/HomeScreen';
import UpcomingScreen from '../features/tasks/UpcomingScreen';
import ListsScreen from '../features/lists/ListsScreen';
import StatsScreen from '../features/stats/StatsScreen';
import SettingsScreen from '../features/settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeIcon = ({ color, size }: { color: string, size: number }) => <Home color={color} size={size} />;
const UpcomingIcon = ({ color, size }: { color: string, size: number }) => <Calendar color={color} size={size} />;
const ListsIcon = ({ color, size }: { color: string, size: number }) => <Folder color={color} size={size} />;
const StatsIcon = ({ color, size }: { color: string, size: number }) => <BarChart color={color} size={size} />;
const SettingsIcon = ({ color, size }: { color: string, size: number }) => <Settings color={color} size={size} />;

function TabNavigator() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6', // blue-500
        tabBarInactiveTintColor: '#9ca3af', // gray-400
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
        }
      }}
    >
      <Tab.Screen 
        name="Today" 
        component={HomeScreen}
        options={{
          tabBarLabel: t('today'),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen 
        name="Upcoming" 
        component={UpcomingScreen}
        options={{
          tabBarLabel: t('upcoming'),
          tabBarIcon: UpcomingIcon,
        }}
      />
      <Tab.Screen 
        name="Lists" 
        component={ListsScreen}
        options={{
          tabBarLabel: t('lists'),
          tabBarIcon: ListsIcon,
        }}
      />
      <Tab.Screen 
        name="Stats" 
        component={StatsScreen}
        options={{
          tabBarLabel: t('stats'),
          tabBarIcon: StatsIcon,
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: t('settings'),
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const fetchData = useStore(state => state.fetchData);

  useEffect(() => {
    const setup = async () => {
      await initDB();
      await fetchData();
    };
    setup();
  }, [fetchData]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
