import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/authService';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'OTP'>;
  route: RouteProp<AuthStackParamList, 'OTP'>;
};

const OTPScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const { email } = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleChange = (val: string, idx: number) => {
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) { setError('Enter complete code'); return; }
    setLoading(true);
    try {
      await authService.verifyOTP(email, code);
      navigation.navigate('NewPassword', { email, otp: code });
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
      <Text style={[typography.h2, { color: colors.text, marginBottom: 4 }]}>{t('auth.getCode')}</Text>
      <Text style={[typography.body1, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
        {t('auth.getCodeSubtitle')}
      </Text>

      <View style={styles.otpRow}>
        {otp.map((val, idx) => (
          <TextInput
            key={idx}
            ref={el => { inputs.current[idx] = el; }}
            value={val}
            onChangeText={v => handleChange(v.slice(-1), idx)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.otpInput, {
              borderColor: val ? colors.primary : colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            }]}
          />
        ))}
      </View>

      {error ? <Text style={[typography.caption, { color: colors.error, textAlign: 'center', marginTop: 8 }]}>{error}</Text> : null}

      <Text style={[typography.body2, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md }]}>
        {t('auth.codeExpires')}{' '}
        <Text style={{ color: colors.error }}>{formatTime(timer)}</Text>
      </Text>

      <CustomButton title={t('common.next')} onPress={handleVerify} loading={loading} style={{ marginTop: spacing.xl }} />

      <TouchableOpacity onPress={() => authService.forgotPassword(email)} style={styles.resendBtn}>
        <Text style={[typography.body1, { color: colors.textSecondary }]}>
          {`If you don't receive code! `}
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{t('auth.resend')}</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl },
  back: { marginBottom: spacing.lg },
  logo: { fontSize: 56, fontWeight: '900', fontStyle: 'italic', alignSelf: 'center', marginBottom: spacing.xl },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: spacing.md },
  otpInput: { width: 60, height: 60, borderRadius: 10, borderWidth: 2, textAlign: 'center', fontSize: 24, fontWeight: '700' },
  resendBtn: { marginTop: spacing.lg, alignItems: 'center' },
});

export default OTPScreen;
