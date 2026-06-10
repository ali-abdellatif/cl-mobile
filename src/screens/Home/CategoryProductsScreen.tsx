import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../services/productService';

const CategoryProductsScreen = ({ route, navigation }: any) => {
  const { categoryId, categoryName, filters } = route.params;
  const { colors } = useAppTheme();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts({ category_id: categoryId, ...filters })
      .then(res => setProducts(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => navigation.navigate('Notifications')} />
      <View style={{ padding: spacing.md, paddingBottom: 0 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
          <Text style={[typography.h4, { color: colors.primary }]}>← {categoryName}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: spacing.md, gap: 8 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => (
            <ProductCard
              item={{ id: item.id, name: item.name, price: item.price, oldPrice: item.old_price, image: item.image, rating: item.rating ?? 4 }}
              onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
              variant="grid"
            />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: colors.textSecondary }}>No products found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 },
});

export default CategoryProductsScreen;
