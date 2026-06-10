import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Storage } from '../utils/storage';
import LoaderScreen from '../screens/Splash/LoaderScreen';
import SplashScreen from '../screens/Splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [appState, setAppState] = useState<'loading' | 'splash' | 'ready'>('loading');

  useEffect(() => { checkFirstLaunch(); }, []);

  const checkFirstLaunch = async () => {
    const seen = await Storage.get('splashSeen');
    if (seen) setAppState('ready');
  };

  if (appState === 'loading') {
    return <LoaderScreen onFinish={() => setAppState('splash')} />;
  }
  if (appState === 'splash') {
    return (
      <SplashScreen onDone={async () => {
        await Storage.set('splashSeen', true);
        setAppState('ready');
      }} />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn
          ? <Stack.Screen name="Main" component={MainNavigator} />
          : <Stack.Screen name="Auth" component={AuthNavigator} />
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
