import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/authService';
import { setCredentials } from '../../store/slices/authSlice';
import { Storage } from '../../utils/storage';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'CarType'>;
  route: RouteProp<AuthStackParamList, 'CarType'>;
};

const CarTypeScreen: React.FC<Props> = ({ route }) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user, token } = route.params;

  const [country, setCountry] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const e: Record<string, string> = {};
    if (!country) e.country = 'Required';
    if (!brand) e.brand = 'Required';
    if (!model) e.model = 'Required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      await authService.setCarType({ country, brand, model });
    } catch (_) {
      // non-blocking — user still proceeds
    } finally {
      // Complete login here: persist token and flip isLoggedIn, which
      // makes AppNavigator swap the Auth stack for Main.
      await Storage.set('token', token);
      dispatch(setCredentials({ user, token }));
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.logo, { color: colors.primaryDark }]}>CL</Text>
      <Text style={[typography.h2, { color: colors.text, marginBottom: 4 }]}>{t('carType.title')}</Text>
      <Text style={[typography.body1, { color: colors.textSecondary, marginBottom: spacing.xl }]}>
        {t('carType.subtitle')}
      </Text>

      <CustomInput label={t('carType.country')} placeholder="Japan, USA, China, etc"
        value={country} onChangeText={setCountry} error={errors.country} />

      <CustomInput label={t('carType.brand')} placeholder="KIA, Jeffy, Cherry, etc"
        value={brand} onChangeText={setBrand} error={errors.brand} />

      <CustomInput label={t('carType.model')} placeholder="A3, A3 allroad, Encore, etc"
        value={model} onChangeText={setModel} error={errors.model} />

      <CustomButton title={t('common.next')} onPress={handleNext} loading={loading} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
  logo: { fontSize: 56, fontWeight: '900', fontStyle: 'italic', alignSelf: 'center', marginBottom: spacing.xl },
});

export default CarTypeScreen;
