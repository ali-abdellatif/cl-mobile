import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, I18nManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import Header from '../../components/Header';
import { setLanguage } from '../../store/slices/themeSlice';
import { RootState } from '../../store';

const LANGUAGES = [
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'en', label: 'English (UK)', native: 'English (UK)' },
  { code: 'en', label: 'English (USA)', native: 'English (USA)' },
];

const LanguageScreen = ({ navigation }: any) => {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLang = useSelector((s: RootState) => s.theme.language);

  const handleSelect = (code: 'en' | 'ar') => {
    i18n.changeLanguage(code);
    dispatch(setLanguage(code));
    I18nManager.forceRTL(code === 'ar');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.primary, marginBottom: spacing.lg }]}>
          ← {t('settings.language')}
        </Text>
        <Text style={[typography.body2, { color: colors.textSecondary, marginBottom: spacing.md }]}>Selected</Text>
        {LANGUAGES.map((lang, index) => {
          const isSelected = currentLang === lang.code;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(lang.code as 'en' | 'ar')}
              style={[styles.langItem, { borderBottomColor: colors.border }]}
            >
              <Text style={[typography.body1, { color: isSelected ? colors.primary : colors.text, flex: 1 }]}>
                {lang.native}
              </Text>
              {isSelected && <Text style={{ color: colors.primary, fontSize: 20 }}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  langItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1 },
});

export default LanguageScreen;
