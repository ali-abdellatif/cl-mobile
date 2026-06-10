import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  Animated, FlatList, ListRenderItem,
} from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Your Destination for\nQuality Car Parts',
    subtitle: 'Your One-Stop Shop for Genuine Car Parts. Explore our extensive catalog for all your automotive needs!',
    bg: '#2196F3',
    icon: '🚙',
  },
  {
    id: '2',
    title: 'Reliable Parts,\nSeamless Shopping',
    subtitle: 'Quality Guaranteed! Shop with Confidence – Authentic Parts, Quick Delivery, and Expert Support.',
    bg: '#1565C0',
    icon: '🚘',
  },
  {
    id: '3',
    title: 'Welcome To 👋',
    subtitle: "Start your journey to choose your car's needs!",
    bg: null,
    icon: null,
    isLast: true,
  },
];

const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  const { colors } = useAppTheme();
  const [current, setCurrent] = useState(0);
  const flatRef = useRef<FlatList>(null);

  const goNext = () => {
    if (current < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: current + 1 });
      setCurrent(current + 1);
    } else {
      onDone();
    }
  };

  const renderItem: ListRenderItem<typeof slides[0]> = ({ item }) => {
    if (item.isLast) {
      return (
        <View style={[styles.slide, { backgroundColor: colors.background, width }]}>
          <Text style={[typography.h1, { color: colors.text, textAlign: 'center', marginBottom: spacing.md }]}>
            Welcome To 👋
          </Text>
          <Text style={[styles.logoLarge, { color: colors.primaryDark }]}>CL</Text>
          <Text style={[typography.body1, { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl }]}>
            Start your journey to choose your car's needs!
          </Text>
          <TouchableOpacity
            onPress={onDone}
            style={[styles.letsStart, { borderColor: colors.primary }]}
          >
            <Text style={[typography.button, { color: colors.primary }]}>Let's start</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={[styles.slide, { backgroundColor: item.bg ?? colors.primary, width }]}>
        <Text style={styles.carEmoji}>{item.icon}</Text>
        <Text style={[typography.h2, styles.title]}>{item.title}</Text>
        <Text style={[typography.body1, styles.subtitle]}>{item.subtitle}</Text>
        <View style={styles.footer}>
          <View style={styles.dots}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.4)', width: i === current ? 24 : 8 }]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={goNext} style={styles.arrow}>
            <Text style={{ color: '#2196F3', fontSize: 22 }}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ref={flatRef}
      data={slides}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={item => item.id}
    />
  );
};

const styles = StyleSheet.create({
  slide: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  carEmoji: { fontSize: 120, marginBottom: spacing.xl },
  title: { color: '#fff', textAlign: 'left', alignSelf: 'flex-start', marginBottom: spacing.sm },
  subtitle: { color: 'rgba(255,255,255,0.85)', textAlign: 'left', alignSelf: 'flex-start' },
  footer: { position: 'absolute', bottom: 60, left: spacing.xl, right: spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  arrow: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  letsStart: { borderWidth: 2, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 60 },
  logoLarge: { fontSize: 64, fontWeight: '900', fontStyle: 'italic', marginBottom: spacing.md },
});

export default SplashScreen;
