import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { useAppTheme } from '../hooks/useAppTheme';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

const CustomInput: React.FC<Props> = ({ label, error, isPassword, style, ...rest }) => {
  const { colors } = useAppTheme();
  const [secure, setSecure] = useState(isPassword ?? false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[typography.body1, { color: colors.text, marginBottom: 6 }]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputRow,
        {
          backgroundColor: colors.inputBackground,
          borderColor: error ? colors.error : colors.border,
          borderWidth: 1,
          borderRadius: 8,
        },
      ]}>
        <TextInput
          {...rest}
          secureTextEntry={secure}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            typography.body1,
            { color: colors.text },
          ]}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setSecure(!secure)} style={styles.eyeBtn}>
            <Text style={{ color: colors.textSecondary }}>{secure ? '👁' : '🙈'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[typography.caption, { color: colors.error, marginTop: 4 }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  input: { flex: 1, height: 48 },
  eyeBtn: { padding: 8 },
});

export default CustomInput;
