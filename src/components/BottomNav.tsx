import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';

type Tab = 'home' | 'cart' | 'fav' | 'maintenance' | 'settings';

interface Props {
  active: Tab;
  onPress: (tab: Tab) => void;
  cartCount?: number;
}

const TABS: { key: Tab; icon: string; iconActive: string }[] = [
  { key: 'home',        icon: '🏠', iconActive: '🏠' },
  { key: 'cart',        icon: '🛒', iconActive: '🛒' },
  { key: 'fav',         icon: '🤍', iconActive: '❤️' },
  { key: 'maintenance', icon: '🔧', iconActive: '🔧' },
  { key: 'settings',    icon: '⚙️', iconActive: '⚙️' },
];

const BottomNav: React.FC<Props> = ({ active, onPress, cartCount }) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bottomNav, borderTopColor: colors.border }]}>
      {TABS.map(tab => {
        const isActive = active === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onPress(tab.key)}
            style={styles.tab}
          >
            <View style={isActive ? [styles.activeIndicator, { backgroundColor: colors.primary }] : null} />
            <Text style={{ fontSize: 22 }}>{isActive ? tab.iconActive : tab.icon}</Text>
            {tab.key === 'cart' && cartCount ? (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  activeIndicator: {
    position: 'absolute', top: -6, width: 30, height: 3, borderRadius: 2,
  },
  badge: {
    position: 'absolute', top: -4, right: 8,
    width: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});

export default BottomNav;
