import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import { toggleTheme } from '../../store/slices/themeSlice';
import { logout } from '../../store/slices/authSlice';
import { Storage } from '../../utils/storage';
import { RootState } from '../../store';

const SettingsScreen = ({ navigation }: any) => {
  const { colors, isDark } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  const handleLogout = async () => {
    await Storage.clear();
    dispatch(logout());
  };

  const MENU_ITEMS = [
    { label: t('settings.editProfile'), icon: '👤', screen: 'EditProfile' },
    { label: t('settings.changePassword'), icon: '🔒', screen: 'ChangePassword' },
    { label: t('settings.editCarType'), icon: '🚗', screen: 'EditCarType' },
    { label: t('settings.language'), icon: '🌐', screen: 'Language' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header onNotification={() => navigation.navigate('Notifications')} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h2, { color: colors.primary, marginBottom: spacing.md }]}>
          {t('settings.title')}
        </Text>

        {/* My Orders */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Orders')}
          style={[styles.menuItem, { backgroundColor: colors.primary, borderRadius: 10, marginBottom: spacing.sm }]}
        >
          <Text style={{ fontSize: 20 }}>📦</Text>
          <Text style={[typography.body1, { color: '#fff', marginLeft: spacing.sm, flex: 1, fontWeight: '600' }]}>
            {t('settings.myOrders')}
          </Text>
          <Text style={{ color: '#fff' }}>›</Text>
        </TouchableOpacity>

        {/* Account section */}
        <Text style={[typography.h4, { color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.sm }]}>
          {t('settings.account')}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.screen}
              onPress={() => navigation.navigate(item.screen)}
              style={[
                styles.menuItem,
                { borderBottomWidth: index < MENU_ITEMS.length - 1 ? 1 : 0, borderBottomColor: colors.border },
              ]}
            >
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
              <Text style={[typography.body1, { color: colors.text, marginLeft: spacing.sm, flex: 1 }]}>
                {item.label}
              </Text>
              <Text style={{ color: colors.textSecondary }}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* More section */}
        <Text style={[typography.h4, { color: colors.textSecondary, marginBottom: spacing.sm, marginTop: spacing.lg }]}>
          {t('settings.more')}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          {/* Notifications toggle */}
          <View style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <Text style={[typography.body1, { color: colors.text, marginLeft: spacing.sm, flex: 1 }]}>
              {t('settings.notifications')}
            </Text>
            <Switch value={true} onValueChange={() => {}} thumbColor={colors.primary} trackColor={{ true: colors.primary + '66', false: colors.border }} />
          </View>

          {/* Dark Mode toggle */}
          <View style={styles.menuItem}>
            <Text style={{ fontSize: 18 }}>🌙</Text>
            <Text style={[typography.body1, { color: colors.text, marginLeft: spacing.sm, flex: 1 }]}>
              {t('settings.darkMode')}
            </Text>
            <Switch
              value={isDark}
              onValueChange={() => { dispatch(toggleTheme()); }}
              thumbColor={colors.primary}
              trackColor={{ true: colors.primary + '66', false: colors.border }}
            />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutBtn, { borderColor: colors.error, marginTop: spacing.xl }]}
        >
          <Text style={{ fontSize: 18 }}>🚪</Text>
          <Text style={[typography.body1, { color: colors.error, marginLeft: spacing.sm, fontWeight: '600' }]}>
            {t('common.logout')}
          </Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderRadius: 10, padding: spacing.md },
});

export default SettingsScreen;
