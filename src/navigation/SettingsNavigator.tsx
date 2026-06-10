import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import EditProfileScreen from '../screens/Settings/EditProfileScreen';
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen';
import EditCarTypeScreen from '../screens/Settings/EditCarTypeScreen';
import LanguageScreen from '../screens/Settings/LanguageScreen';
import OrdersScreen from '../screens/Settings/OrdersScreen';
import OrderDetailsScreen from '../screens/Settings/OrderDetailsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';

export type SettingsStackParamList = {
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  EditCarType: undefined;
  Language: undefined;
  Orders: undefined;
  OrderDetails: { order: any };
  Notifications: undefined;
};

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    <Stack.Screen name="EditCarType" component={EditCarTypeScreen} />
    <Stack.Screen name="Language" component={LanguageScreen} />
    <Stack.Screen name="Orders" component={OrdersScreen} />
    <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

export default SettingsNavigator;
