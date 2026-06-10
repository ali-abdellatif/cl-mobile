// NOTE: Added during setup — SettingsNavigator imports this but the spec didn't
// provide it. Simple, self-contained notifications list with an empty state.
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  icon: string;
}

const SAMPLE: NotificationItem[] = [];

const NotificationsScreen = ({ navigation }: any) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <View style={{ padding: spacing.md, paddingBottom: 0 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
          <Text style={[typography.h3, { color: colors.primary }]}>← {t('notifications.title')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={SAMPLE}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.sm, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
            <Text style={{ fontSize: 22, marginRight: spacing.sm }}>{item.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[typography.body1, { color: colors.text, fontWeight: '600' }]}>{item.title}</Text>
              <Text style={[typography.body2, { color: colors.textSecondary }]} numberOfLines={2}>{item.body}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 2 }]}>{item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 50 }}>🔔</Text>
            <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.md }]}>
              {t('notifications.empty')}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 12, borderWidth: 1, padding: spacing.md },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
});

export default NotificationsScreen;
