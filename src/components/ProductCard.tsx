import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useAppTheme } from '../hooks/useAppTheme';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { toggleFav } from '../store/slices/favSlice';
import { addToCart } from '../store/slices/cartSlice';
import { RootState } from '../store';

interface Props {
  item: {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    rating: number;
    inStock?: boolean;
  };
  onPress: () => void;
  variant?: 'grid' | 'list';
}

const StarRating = ({ rating, color }: { rating: number; color: string }) => (
  <View style={{ flexDirection: 'row' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Text key={i} style={{ fontSize: 12, color: i <= rating ? '#FFC107' : '#E0E0E0' }}>★</Text>
    ))}
  </View>
);

const ProductCard: React.FC<Props> = ({ item, onPress, variant = 'grid' }) => {
  const { colors } = useAppTheme();
  const dispatch = useDispatch();
  const favItems = useSelector((s: RootState) => s.favourites.items);
  const isFav = favItems.some(f => f.id === item.id);
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const inCart = cartItems.some(c => c.id === item.id);

  const handleFav = () => dispatch(toggleFav({
    id: item.id, name: item.name, price: item.price,
    oldPrice: item.oldPrice, image: item.image, rating: item.rating,
  }));

  const handleCart = () => dispatch(addToCart({
    id: item.id, name: item.name, price: item.price,
    image: item.image, quantity: 1,
  }));

  if (variant === 'list') {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.listCard, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <View style={[styles.listImageBox, { backgroundColor: colors.primary }]}>
          <Image source={{ uri: item.image }} style={styles.listImage} resizeMode="contain" />
          <TouchableOpacity onPress={handleFav} style={styles.listFavBtn}>
            <Text style={{ fontSize: 16 }}>{isFav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listInfo}>
          <Text style={[typography.h4, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Text style={[typography.h4, { color: colors.price }]}>{item.price.toLocaleString()} EGP</Text>
            {item.oldPrice && (
              <Text style={[typography.caption, { color: colors.oldPrice, textDecorationLine: 'line-through' }]}>
                {item.oldPrice.toLocaleString()} EGP
              </Text>
            )}
          </View>
          <StarRating rating={item.rating} color={colors.star} />
          <TouchableOpacity onPress={handleCart} style={styles.addToCartText}>
            <Text style={[typography.body2, { color: colors.primary, fontWeight: '600' }]}>
              {inCart ? 'Remove from cart' : 'Add to cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.gridCard, { backgroundColor: colors.cardBackground }]}>
      <View style={[styles.gridImageBox, { backgroundColor: colors.primary }]}>
        <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="contain" />
        <TouchableOpacity onPress={handleFav} style={styles.gridFavBtn}>
          <Text style={{ fontSize: 14 }}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCart} style={[styles.gridCartBtn, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', fontSize: 16 }}>→</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridInfo}>
        <Text style={[typography.body2, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[typography.h4, { color: colors.price }]}>{item.price.toLocaleString()} EGP</Text>
        {item.oldPrice && (
          <Text style={[typography.caption, { color: colors.oldPrice, textDecorationLine: 'line-through' }]}>
            {item.oldPrice.toLocaleString()} EGP
          </Text>
        )}
        <StarRating rating={item.rating} color={colors.star} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridCard: { width: '48%', borderRadius: 12, overflow: 'hidden', marginBottom: spacing.sm, elevation: 2 },
  gridImageBox: { height: 120, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  gridImage: { width: '80%', height: '80%' },
  gridFavBtn: { position: 'absolute', top: 8, left: 8 },
  gridCartBtn: { position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  gridInfo: { padding: spacing.sm },
  listCard: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, marginBottom: spacing.sm, overflow: 'hidden', elevation: 1 },
  listImageBox: { width: 100, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  listImage: { width: 80, height: 80 },
  listFavBtn: { position: 'absolute', top: 8, left: 8 },
  listInfo: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  addToCartText: { marginTop: 4 },
});

export default ProductCard;
