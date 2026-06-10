// NOTE: Added during setup — OrdersScreen navigates to 'OrderDetails' and the
// SettingsStackParamList declares it, but the spec's SettingsNavigator didn't
// register a screen for it (would crash on tap). Minimal details view of the
// order passed via route params.
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';

const Row = ({ label, value, color }: { label: string; value: string; color: string }) => {
  const { colors } = useAppTheme();
  return (
    <View style={styles.row}>
      <Text style={[typography.body2, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[typography.body1, { color, fontWeight: '600' }]}>{value}</Text>
    </View>
  );
};

const OrderDetailsScreen = ({ route, navigation }: any) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const order = route.params?.order ?? {};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.primary, marginBottom: spacing.lg }]}>
          ← {t('orders.title')} #{order.id ?? '1223344466'}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
          <Row label="Order #" value={`${order.id ?? '1223344466'}`} color={colors.text} />
          <Row label="Item" value={order.product_name ?? 'Headlight 81774B Bundle'} color={colors.text} />
          <Row label="Date" value={order.created_at ?? '12 Dec 2023'} color={colors.text} />
          <Row label="Status" value={order.status ?? 'Delivered'} color={colors.success} />
          <Row label="Total" value={`${order.total?.toLocaleString() ?? '5,000'} EGP`} color={colors.price} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, padding: spacing.md, gap: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
});

export default OrderDetailsScreen;
