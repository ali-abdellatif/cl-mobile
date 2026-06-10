import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/authService';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'ForgotPassword'> };

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!email) { setError('Required'); return; }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      navigation.navigate('OTP', { email, mode: 'forgot' });
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.error'));
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
      <Text style={[typography.h2, { color: colors.text, marginBottom: 4 }]}>{t('auth.forgotPassword')}</Text>
      <Text style={[typography.body1, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
        {t('auth.forgotSubtitle')}
      </Text>

      <CustomInput
        label={t('common.email')} placeholder="user@gmail.com"
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" error={error}
      />

      <CustomButton title={t('common.next')} onPress={handleNext} loading={loading} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl },
  back: { marginBottom: spacing.lg },
  logo: { fontSize: 56, fontWeight: '900', fontStyle: 'italic', alignSelf: 'center', marginBottom: spacing.xl },
});

export default ForgotPasswordScreen;
