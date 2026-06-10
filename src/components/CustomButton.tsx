import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { typography } from '../theme/typography';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  style?: object;
}

const CustomButton: React.FC<Props> = ({
  title, onPress, loading, disabled, variant = 'primary', style,
}) => {
  const { colors } = useAppTheme();
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? colors.primary : 'transparent',
          borderWidth: isPrimary ? 0 : 2,
          borderColor: colors.primary,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : colors.primary} />
      ) : (
        <Text style={[
          styles.text,
          typography.button,
          { color: isPrimary ? '#fff' : colors.primary },
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: { textAlign: 'center' },
});

export default CustomButton;
