import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppTheme } from '../hooks/useAppTheme';
import { RootState } from '../store';

import HomeScreen from '../screens/Home/HomeScreen';
import ProductDetailsScreen from '../screens/Home/ProductDetailsScreen';
import CategoryProductsScreen from '../screens/Home/CategoryProductsScreen';
import FilterScreen from '../screens/Home/FilterScreen';
import SettingsNavigator from './SettingsNavigator';

// Placeholder screens for tabs not yet built
const CartPlaceholder = () => { const {colors} = useAppTheme(); return <View style={{flex:1,backgroundColor:colors.background,justifyContent:'center',alignItems:'center'}}><Text style={{color:colors.text}}>Cart — Coming Soon</Text></View>; };
const FavPlaceholder = () => { const {colors} = useAppTheme(); return <View style={{flex:1,backgroundColor:colors.background,justifyContent:'center',alignItems:'center'}}><Text style={{color:colors.text}}>Favourites — Coming Soon</Text></View>; };
const MaintPlaceholder = () => { const {colors} = useAppTheme(); return <View style={{flex:1,backgroundColor:colors.background,justifyContent:'center',alignItems:'center'}}><Text style={{color:colors.text}}>Maintenance — Coming Soon</Text></View>; };
const NotifPlaceholder = () => { const {colors} = useAppTheme(); return <View style={{flex:1,backgroundColor:colors.background,justifyContent:'center',alignItems:'center'}}><Text style={{color:colors.text}}>Notifications — Coming Soon</Text></View>; };

export type HomeStackParamList = {
  Home: undefined;
  ProductDetails: { id: number };
  CategoryProducts: { categoryId: number; categoryName: string; filters?: any };
  Filter: undefined;
  Notifications: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Home" component={HomeScreen} />
    <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    <HomeStack.Screen name="CategoryProducts" component={CategoryProductsScreen} />
    <HomeStack.Screen name="Filter" component={FilterScreen} />
    <HomeStack.Screen name="Notifications" component={NotifPlaceholder} />
  </HomeStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'HomeTab', component: HomeStackNavigator, icon: '🏠', label: 'Home' },
  { name: 'CartTab', component: CartPlaceholder, icon: '🛒', label: 'Cart' },
  { name: 'FavTab', component: FavPlaceholder, icon: '🤍', label: 'Fav' },
  { name: 'MaintenanceTab', component: MaintPlaceholder, icon: '🔧', label: 'Service' },
  { name: 'SettingsTab', component: SettingsNavigator, icon: '⚙️', label: 'Settings' },
];

const MainNavigator = () => {
  const { colors } = useAppTheme();
  const cartCount = useSelector((s: RootState) => s.cart.items.length);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => {
        const { state, navigation } = props;
        return (
          <View style={[styles.tabBar, { backgroundColor: colors.bottomNav, borderTopColor: colors.border }]}>
            {TABS.map((tab, index) => {
              const focused = state.index === index;
              const isCart = tab.name === 'CartTab';
              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={() => navigation.navigate(tab.name)}
                  style={styles.tabItem}
                >
                  {focused && <View style={[styles.activeBar, { backgroundColor: colors.primary }]} />}
                  <Text style={{ fontSize: 22 }}>
                    {tab.name === 'FavTab' ? (focused ? '❤️' : '🤍') : tab.icon}
                  </Text>
                  {isCart && cartCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: colors.error }]}>
                      <Text style={styles.badgeText}>{cartCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    >
      {TABS.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', borderTopWidth: 1, paddingBottom: 8, paddingTop: 6, elevation: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  activeBar: { position: 'absolute', top: -6, width: 30, height: 3, borderRadius: 2 },
  badge: { position: 'absolute', top: -4, right: 8, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});

export default MainNavigator;
