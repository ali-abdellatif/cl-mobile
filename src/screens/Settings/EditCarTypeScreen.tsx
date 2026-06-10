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

const EditCarTypeScreen = ({ navigation }: any) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const [country, setCountry] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/user/car-type', { country, brand, model });
    } catch (_) {}
    finally {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1500);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.primary, marginBottom: spacing.lg }]}>
          ← {t('settings.editCarType')}
        </Text>
        <CustomInput label={t('carType.country')} placeholder="Japan" value={country} onChangeText={setCountry} />
        <CustomInput label={t('carType.brand')} placeholder="KIA" value={brand} onChangeText={setBrand} />
        <CustomInput label={t('carType.model')} placeholder="A3" value={model} onChangeText={setModel} />
        {success && (
          <View style={{ backgroundColor: colors.success + '22', borderRadius: 8, padding: spacing.sm }}>
            <Text style={[typography.body2, { color: colors.success }]}>Saved! ✓</Text>
          </View>
        )}
        <CustomButton title={t('common.save')} onPress={handleSave} loading={loading} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </View>
  );
};

export default EditCarTypeScreen;
