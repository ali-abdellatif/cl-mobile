import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import NewPasswordScreen from '../screens/Auth/NewPasswordScreen';
import CarTypeScreen from '../screens/Auth/CarTypeScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OTP: { email: string; mode: 'forgot' };
  NewPassword: { email: string; otp: string };
  CarType: { user: any; token: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
    <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
    <Stack.Screen name="CarType" component={CarTypeScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
