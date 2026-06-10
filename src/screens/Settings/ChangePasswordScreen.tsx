import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import api from '../../services/api';

const ChangePasswordScreen = ({ navigation }: any) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = async () => {
    const e: Record<string, string> = {};
    if (!current) e.current = 'Required';
    if (!newPass || newPass.length < 6) e.newPass = 'Min 6 characters';
    if (confirm !== newPass) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setLoading(true);
    try {
      await api.post('/user/change-password', {
        current_password: current,
        password: newPass,
        password_confirmation: confirm,
      });
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err: any) {
      setErrors({ current: err.response?.data?.message || t('common.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.primary, marginBottom: spacing.lg }]}>
          ← {t('settings.changePassword')}
        </Text>
        <CustomInput label="Current Password" value={current} onChangeText={setCurrent} isPassword error={errors.current} />
        <CustomInput label="New Password" value={newPass} onChangeText={setNewPass} isPassword error={errors.newPass} />
        <CustomInput label="Confirm New Password" value={confirm} onChangeText={setConfirm} isPassword error={errors.confirm} />
        {success && (
          <View style={{ backgroundColor: colors.success + '22', borderRadius: 8, padding: spacing.sm, marginBottom: spacing.sm }}>
            <Text style={[typography.body2, { color: colors.success }]}>Password changed successfully! ✓</Text>
          </View>
        )}
        <CustomButton title={t('settings.changePassword')} onPress={handleChange} loading={loading} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;
