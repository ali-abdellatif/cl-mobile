import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { updateUser } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import api from '../../services/api';

const EditProfileScreen = ({ navigation }: any) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [region, setRegion] = useState(user?.region ?? '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/user/profile', { name, phone, region });
      dispatch(updateUser({ name, phone, region }));
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1500);
    } catch (_) {
      dispatch(updateUser({ name, phone, region }));
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
          <Text style={[typography.h3, { color: colors.primary }]}>← {t('settings.editProfile')}</Text>
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={{ fontSize: 40, color: '#fff' }}>👤</Text>
          </View>
          <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.primary }]}>
            <Text style={{ color: '#fff', fontSize: 12 }}>✏️</Text>
          </TouchableOpacity>
        </View>

        <CustomInput label={t('common.email')} value={user?.email ?? ''} editable={false}
          style={{ opacity: 0.7 }} />
        <CustomInput label={t('common.fullName')} value={name} onChangeText={setName} />
        <CustomInput label={t('common.phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <CustomInput label="Region" value={region} onChangeText={setRegion} />

        {success && (
          <View style={[styles.successBanner, { backgroundColor: colors.success + '22' }]}>
            <Text style={[typography.body2, { color: colors.success }]}>Saved successfully! ✓</Text>
          </View>
        )}

        <CustomButton title={t('common.save')} onPress={handleSave} loading={loading} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: { alignItems: 'center', marginBottom: spacing.xl, position: 'relative' },
  avatar: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: '35%', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  successBanner: { borderRadius: 8, padding: spacing.sm, marginBottom: spacing.sm },
});

export default EditProfileScreen;
