import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import { orderService } from '../../services/orderService';

const OrdersScreen = ({ navigation }: any) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [tab, setTab] = useState<'previous' | 'current'>('previous');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [tab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = tab === 'current'
        ? await orderService.getCurrentOrders()
        : await orderService.getPreviousOrders();
      setOrders(res.data.data ?? []);
    } catch (_) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <View style={{ padding: spacing.md, paddingBottom: 0 }}>
        <Text style={[typography.h3, { color: colors.primary, marginBottom: spacing.md }]}>
          ← {t('orders.title')}
        </Text>
        <View style={[styles.tabRow, { borderColor: colors.border }]}>
          {(['previous', 'current'] as const).map(t2 => (
            <TouchableOpacity
              key={t2}
              onPress={() => setTab(t2)}
              style={[styles.tabBtn, tab === t2 && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[typography.body1, { color: tab === t2 ? colors.primary : colors.textSecondary, fontWeight: tab === t2 ? '700' : '400' }]}>
                {t2 === 'previous' ? t('orders.previous') : t('orders.current')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item, i) => item.id?.toString() ?? i.toString()}
          contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('OrderDetails', { order: item })}
              style={[styles.orderCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[typography.body1, { color: colors.primary, fontWeight: '700' }]}>
                  #{item.id ?? '1223344466'}
                </Text>
                <Text style={[typography.body2, { color: colors.text }]} numberOfLines={1}>
                  {item.product_name ?? 'Headlight 81774B Bundle'}
                </Text>
                <Text style={[typography.h4, { color: colors.price }]}>
                  {item.total?.toLocaleString() ?? '5,000'} EGP
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {item.created_at ?? '12 Dec 2023'}
                </Text>
                <TouchableOpacity style={{ marginTop: spacing.sm }}>
                  <Text style={{ color: colors.error, fontSize: 18 }}>🗑</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ fontSize: 50 }}>📦</Text>
              <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.md }]}>
                No orders yet
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', borderBottomWidth: 1 },
  tabBtn: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  orderCard: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: spacing.md },
});

export default OrdersScreen;
