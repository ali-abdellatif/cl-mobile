import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/authService';
import { setCredentials } from '../../store/slices/authSlice';
import { Storage } from '../../utils/storage';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = { navigation: StackNavigationProp<AuthStackParamList, 'Login'> };

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = t('auth.wrongCredentials');
    if (!password) e.password = t('auth.wrongCredentials');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const { user, token } = res.data.data;
      await Storage.set('token', token);
      await Storage.set('user', user);
      dispatch(setCredentials({ user, token }));
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
      {/* Logo */}
      <Text style={[styles.logo, { color: colors.primaryDark }]}>CL</Text>

      <Text style={[typography.h2, { color: colors.text, marginBottom: 4 }]}>
        {t('auth.loginTitle')}
      </Text>
      <Text style={[typography.body1, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
        {t('auth.loginSubtitle')}
      </Text>

      <CustomInput
        label={t('common.email')}
        placeholder="user@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        style={{ marginBottom: spacing.md }}
      />

      <CustomInput
        label={t('common.password')}
        placeholder="••••••••••"
        value={password}
        onChangeText={setPassword}
        isPassword
        error={errors.password}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgotBtn}
      >
        <Text style={[typography.body2, { color: colors.primary }]}>
          {t('auth.forgotPassword')}
        </Text>
      </TouchableOpacity>

      <CustomButton
        title={t('common.login')}
        onPress={handleLogin}
        loading={loading}
        style={{ marginTop: spacing.lg }}
      />

      <View style={styles.signupRow}>
        <Text style={[typography.body1, { color: colors.textSecondary }]}>
          {t('auth.dontHave')}{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[typography.body1, { color: colors.primary, fontWeight: '700' }]}>
            {t('common.signup')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 56,
    fontWeight: '900',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 4 },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});

export default LoginScreen;
