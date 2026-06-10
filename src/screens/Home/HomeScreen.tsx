import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, FlatList,
  TouchableOpacity, Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../services/productService';
import { RootState } from '../../store';

const CAR_BRANDS = ['Mercedes', 'KIA', 'Tesla', 'Jeep', 'Audi', 'Ferrari'];
const MAIN_CATEGORIES = [
  { id: 1, name: 'Engine', icon: '⚙️' },
  { id: 2, name: 'Body', icon: '🚗' },
  { id: 3, name: 'Electrical', icon: '⚡' },
  { id: 4, name: 'Suspension', icon: '🔩' },
];

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const user = useSelector((s: RootState) => s.auth.user);

  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [bundles, setBundles] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [bundlesRes, bestRes] = await Promise.all([
        productService.getBundles(),
        productService.getBestSellers(),
      ]);
      setBundles(bundlesRes.data.data ?? []);
      setBestSellers(bestRes.data.data ?? []);
    } catch (_) {
      // use empty arrays on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = () => { setRefreshing(true); loadData(); };

  const goToProduct = (id: number) => navigation.navigate('ProductDetails', { id });
  const goToCategory = (cat: typeof MAIN_CATEGORIES[0]) =>
    navigation.navigate('CategoryProducts', { categoryId: cat.id, categoryName: cat.name });
  const goToFilter = () => navigation.navigate('Filter');
  const goToNotifications = () => navigation.navigate('Notifications');

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        userAvatar={user?.avatar}
        onNotification={goToNotifications}
      />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.section}>
          <Text style={[typography.h2, { color: colors.text }]}>
            {t('home.hello')} {user?.name?.split(' ')[0]},
          </Text>
        </View>

        {/* Search bar */}
        <View style={[styles.searchRow, { paddingHorizontal: spacing.md }]}>
          <View style={{ flex: 1 }}>
            <CustomInput
              placeholder={t('home.filterBrand')}
              value={search}
              onChangeText={setSearch}
              style={{ marginBottom: 0 }}
            />
          </View>
          <TouchableOpacity onPress={goToFilter} style={[styles.filterBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: '#fff', fontSize: 18 }}>⚙</Text>
          </TouchableOpacity>
        </View>

        {/* Car Brand Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsScroll} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 8 }}>
          {CAR_BRANDS.map(brand => (
            <TouchableOpacity
              key={brand}
              onPress={() => setSelectedBrand(selectedBrand === brand ? '' : brand)}
              style={[styles.brandChip, {
                borderColor: selectedBrand === brand ? colors.primary : colors.border,
                backgroundColor: selectedBrand === brand ? colors.primary + '22' : colors.surface,
              }]}
            >
              <Text style={[typography.caption, { color: selectedBrand === brand ? colors.primary : colors.text }]}>
                {brand}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Offers Banner */}
        <View style={styles.section}>
          <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.sm }]}>
            {t('home.categoryOffers')}
          </Text>
          <View style={[styles.banner, { backgroundColor: colors.primary }]}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.body2, { color: '#fff' }]}>Save up to</Text>
              <Text style={[typography.h3, { color: '#FFC107' }]}>10%</Text>
              <Text style={[typography.caption, { color: '#fff', marginTop: 4 }]}>
                Explore our offers on Engine Category
              </Text>
            </View>
            <Text style={{ fontSize: 60 }}>⚙️</Text>
          </View>
        </View>

        {/* Main Categories */}
        <View style={styles.section}>
          <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.sm }]}>
            {t('home.mainCategories')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {MAIN_CATEGORIES.map(cat => (
              <TouchableOpacity key={cat.id} onPress={() => goToCategory(cat)} style={styles.catItem}>
                <View style={[styles.catIcon, { backgroundColor: colors.surface }]}>
                  <Text style={{ fontSize: 28 }}>{cat.icon}</Text>
                </View>
                <Text style={[typography.caption, { color: colors.text, marginTop: 4 }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bundles */}
        {bundles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.h4, { color: colors.text }]}>{t('home.bundles')}</Text>
              <TouchableOpacity onPress={() => goToCategory({ id: 0, name: 'Bundles', icon: '' })}>
                <Text style={[typography.body2, { color: colors.primary }]}>{t('home.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            {bundles.slice(0, 3).map(item => (
              <TouchableOpacity key={item.id} onPress={() => goToProduct(item.id)}
                style={[styles.bundleItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Image source={{ uri: item.image }} style={styles.bundleImage} resizeMode="contain" />
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text style={[typography.body1, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <Text style={[typography.body1, { color: colors.price, fontWeight: '700' }]}>{item.price?.toLocaleString()} EGP</Text>
                    {item.old_price && (
                      <Text style={[typography.caption, { color: colors.oldPrice, textDecorationLine: 'line-through' }]}>{item.old_price?.toLocaleString()} EGP</Text>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    {[1,2,3,4,5].map(i => (
                      <Text key={i} style={{ fontSize: 12, color: i <= (item.rating ?? 4) ? '#FFC107' : '#E0E0E0' }}>★</Text>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[typography.h4, { color: colors.text }]}>{t('home.bestSeller')}</Text>
              <TouchableOpacity>
                <Text style={[typography.body2, { color: colors.primary }]}>{t('home.seeAll')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gridRow}>
              {bestSellers.slice(0, 6).map(item => (
                <ProductCard
                  key={item.id}
                  item={{
                    id: item.id, name: item.name, price: item.price,
                    oldPrice: item.old_price, image: item.image, rating: item.rating ?? 4,
                  }}
                  onPress={() => goToProduct(item.id)}
                  variant="grid"
                />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.md },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.sm },
  filterBtn: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  brandsScroll: { marginTop: spacing.sm },
  brandChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  banner: { borderRadius: 12, padding: spacing.md, flexDirection: 'row', alignItems: 'center', minHeight: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  catItem: { alignItems: 'center', width: 70 },
  catIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  bundleItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.sm, borderRadius: 10, borderWidth: 1, marginBottom: spacing.sm },
  bundleImage: { width: 60, height: 60, borderRadius: 8 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default HomeScreen;
