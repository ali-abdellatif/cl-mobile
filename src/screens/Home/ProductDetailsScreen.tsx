import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import CustomButton from '../../components/CustomButton';
import { productService } from '../../services/productService';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import { toggleFav } from '../../store/slices/favSlice';
import { RootState } from '../../store';

const ProductDetailsScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  const { colors } = useAppTheme();
  const dispatch = useDispatch();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'brand' | 'model'>('description');

  const cartItems = useSelector((s: RootState) => s.cart.items);
  const favItems = useSelector((s: RootState) => s.favourites.items);
  const inCart = cartItems.some(c => c.id === id);
  const isFav = favItems.some(f => f.id === id);

  useEffect(() => {
    productService.getProductDetails(id)
      .then(res => setProduct(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (!product) return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>Product not found</Text>
    </View>
  );

  const handleCartAction = () => {
    if (inCart) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }));
    }
  };

  const handleFav = () => dispatch(toggleFav({
    id: product.id, name: product.name, price: product.price,
    oldPrice: product.old_price, image: product.image, rating: product.rating ?? 4,
  }));

  const TABS = ['description', 'brand', 'model'] as const;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => navigation.navigate('Notifications')} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back + Title */}
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.primary, fontSize: 18 }}>← </Text>
          </TouchableOpacity>
          <Text style={[typography.h3, { color: colors.text, flex: 1 }]} numberOfLines={1}>
            {product.name}
          </Text>
        </View>

        {/* Main Image */}
        <View style={[styles.mainImageBox, { backgroundColor: colors.primary }]}>
          <Image source={{ uri: product.image }} style={styles.mainImage} resizeMode="contain" />
          <TouchableOpacity onPress={handleFav} style={styles.favBtn}>
            <Text style={{ fontSize: 22 }}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: spacing.md }}>
          {/* Rating + Stock */}
          <View style={styles.ratingRow}>
            <View style={{ flexDirection: 'row' }}>
              {[1,2,3,4,5].map(i => (
                <Text key={i} style={{ fontSize: 16, color: i <= (product.rating ?? 4) ? '#FFC107' : '#E0E0E0' }}>★</Text>
              ))}
            </View>
            <Text style={[typography.body2, { color: product.in_stock ? colors.success : colors.error }]}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[typography.h2, { color: colors.price }]}>
              {product.price?.toLocaleString()} EGP
            </Text>
            {product.old_price && (
              <Text style={[typography.body1, { color: colors.oldPrice, textDecorationLine: 'line-through', marginLeft: 8 }]}>
                {product.old_price?.toLocaleString()} EGP
              </Text>
            )}
          </View>

          {/* Tabs */}
          <View style={[styles.tabRow, { borderColor: colors.border }]}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
              >
                <Text style={[typography.body1, { color: activeTab === tab ? colors.primary : colors.textSecondary, textTransform: 'capitalize' }]}>
                  {tab}
                </Text>
                <Text style={{ color: colors.textSecondary, marginLeft: 4 }}>▾</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={[styles.tabContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[typography.body1, { color: colors.text }]}>
              {activeTab === 'description' && (product.description ?? 'No description available.')}
              {activeTab === 'brand' && (product.brand ?? 'N/A')}
              {activeTab === 'model' && (product.model ?? 'N/A')}
            </Text>
          </View>

          {/* Cart Button */}
          <CustomButton
            title={inCart ? 'Remove from cart' : 'Add to cart'}
            onPress={handleCartAction}
            variant={inCart ? 'outline' : 'primary'}
            style={{ marginTop: spacing.lg, backgroundColor: inCart ? colors.error : colors.primary }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, paddingBottom: 0 },
  mainImageBox: { margin: spacing.md, borderRadius: 12, height: 220, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  mainImage: { width: '75%', height: '85%' },
  favBtn: { position: 'absolute', top: 12, left: 12 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: spacing.md },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, marginBottom: spacing.sm },
  tab: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.sm },
  tabContent: { borderRadius: 8, borderWidth: 1, padding: spacing.md, minHeight: 80 },
});

export default ProductDetailsScreen;
