import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/authService';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'Register'> };

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    email: '', name: '', phone: '+20',
    region: '', password: '', confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Required';
    if (!form.name) e.name = 'Required';
    if (!form.phone || form.phone === '+20') e.phone = 'Required';
    if (!form.region) e.region = 'Required';
    if (!form.password || form.password.length < 6) e.password = 'Min 6 chars';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.register({
        email: form.email,
        name: form.name,
        phone: form.phone,
        region: form.region,
        password: form.password,
        password_confirmation: form.confirm,
      });
      const { user, token } = res.data.data;
      // Defer login completion until after the car-type step.
      navigation.navigate('CarType', { user, token });
    } catch (err: any) {
      const msg = err.response?.data?.message || t('common.error');
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.logo, { color: colors.primaryDark }]}>CL</Text>

      <Text style={[typography.h2, { color: colors.text, marginBottom: 4 }]}>
        {t('auth.createAccount')}
      </Text>
      <Text style={[typography.body1, { color: colors.textSecondary, marginBottom: spacing.lg }]}>
        {t('auth.createSubtitle')}
      </Text>

      <CustomInput label={t('common.email')} placeholder="user@gmail.com"
        value={form.email} onChangeText={v => set('email', v)}
        keyboardType="email-address" autoCapitalize="none" error={errors.email} />

      <CustomInput label={t('common.fullName')} placeholder="full name"
        value={form.name} onChangeText={v => set('name', v)} error={errors.name} />

      <CustomInput label={t('common.phone')} placeholder="+20"
        value={form.phone} onChangeText={v => set('phone', v)}
        keyboardType="phone-pad" error={errors.phone} />

      <CustomInput label="Region" placeholder="Cairo, Giza, etc"
        value={form.region} onChangeText={v => set('region', v)} error={errors.region} />

      <CustomInput label={t('common.password')} placeholder="••••••••••"
        value={form.password} onChangeText={v => set('password', v)}
        isPassword error={errors.password} />

      <CustomInput label="Confirm Password" placeholder="••••••••••"
        value={form.confirm} onChangeText={v => set('confirm', v)}
        isPassword error={errors.confirm} />

      <CustomButton title={t('auth.createAccount')} onPress={handleRegister} loading={loading} />

      <View style={styles.loginRow}>
        <Text style={[typography.body1, { color: colors.textSecondary }]}>
          {t('auth.alreadyHave')}{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[typography.body1, { color: colors.primary, fontWeight: '700' }]}>
            {t('common.login')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl },
  logo: { fontSize: 56, fontWeight: '900', fontStyle: 'italic', alignSelf: 'center', marginBottom: spacing.lg, marginTop: spacing.lg },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
});

export default RegisterScreen;
