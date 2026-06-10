import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { spacing } from '../theme/spacing';

interface Props {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  userAvatar?: string;
  onNotification?: () => void;
  notifCount?: number;
}

const Header: React.FC<Props> = ({
  showBack, onBack, title, userAvatar, onNotification, notifCount,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}>
      {/* Left side */}
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: colors.primary, fontSize: 22 }}>←</Text>
          </TouchableOpacity>
        ) : userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>

      {/* Center logo */}
      <View style={styles.center}>
        <Text style={[styles.logoText, { color: colors.primaryDark }]}>CL</Text>
      </View>

      {/* Right side - Bell */}
      <TouchableOpacity onPress={onNotification} style={styles.bellBtn}>
        <Text style={{ fontSize: 22 }}>🔔</Text>
        {notifCount ? (
          <View style={[styles.badge, { backgroundColor: colors.error }]}>
            <Text style={styles.badgeText}>{notifCount}</Text>
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    elevation: 2,
  },
  left: { width: 40 },
  center: { flex: 1, alignItems: 'center' },
  logoText: { fontSize: 24, fontWeight: '800', fontStyle: 'italic' },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  avatarPlaceholder: { width: 38, height: 38 },
  backBtn: { padding: 4 },
  bellBtn: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    width: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});

export default Header;
