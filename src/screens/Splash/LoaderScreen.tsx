import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

const LoaderScreen = ({ onFinish }: { onFinish: () => void }) => {
  const { colors } = useAppTheme();
  const carX = useRef(new Animated.Value(-100)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(carX, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();

    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.Text
        style={[styles.carIcon, { transform: [{ translateX: carX }] }]}
      >
        🚗
      </Animated.Text>
      <Animated.View style={[styles.spinner, { borderTopColor: colors.primary, transform: [{ rotate: spin }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  carIcon: { fontSize: 80, marginBottom: 60 },
  spinner: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 4, borderColor: '#E0E0E0',
  },
});

export default LoaderScreen;
