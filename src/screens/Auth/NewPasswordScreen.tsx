import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/authService';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'NewPassword'>;
  route: RouteProp<AuthStackParamList, 'NewPassword'>;
};

const NewPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { email, otp } = route.params;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const e: Record<string, string> = {};
    if (!password || password.length < 6) e.password = 'Min 6 characters';
    if (confirm !== password) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      await authService.resetPassword({
        email, otp, password, password_confirmation: confirm,
      });
      navigation.navigate('Login');
    } catch (err: any) {
      setErrors({ password: err.response?.data?.message || t('common.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Text style={{ color: colors.primary, fontSize: 22 }}>←</Text>
      </TouchableOpacity>

      <Text style={[styles.logo, { color: colors.primaryDark }]}>CL</Text>
      <Text style={[typography.h2, { color: colors.text, marginBottom: 4 }]}>{t('auth.newPassword')}</Text>
      <Text style={[typography.body1, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
        {t('auth.newPasswordSubtitle')}
      </Text>

      <CustomInput label="New Password" placeholder="••••••••••"
        value={password} onChangeText={setPassword} isPassword error={errors.password} />

      <CustomInput label="Confirm New Password" placeholder="••••••••••"
        value={confirm} onChangeText={setConfirm} isPassword error={errors.confirm} />

      <CustomButton title="Continue" onPress={handleContinue} loading={loading} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl },
  back: { marginBottom: spacing.lg },
  logo: { fontSize: 56, fontWeight: '900', fontStyle: 'italic', alignSelf: 'center', marginBottom: spacing.xl },
});

export default NewPasswordScreen;
