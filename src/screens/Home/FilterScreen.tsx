import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import Header from '../../components/Header';

const CATEGORIES = [
  { id: 1, name: 'Engine', icon: '⚙️' },
  { id: 2, name: 'Body', icon: '🚗' },
  { id: 3, name: 'Electrical', icon: '⚡' },
  { id: 4, name: 'Suspension', icon: '🔩' },
];

const FilterScreen = ({ navigation, route }: any) => {
  const { colors } = useAppTheme();
  const [country, setCountry] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [selectedCat, setSelectedCat] = useState<number | null>(null);

  const handleApply = () => {
    navigation.navigate('CategoryProducts', {
      categoryId: selectedCat,
      categoryName: 'Filtered Results',
      filters: { country, brand, model },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header showBack onBack={() => navigation.goBack()} onNotification={() => {}} />
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.md }]}>Filter</Text>

        <CustomInput label="Country of origin" placeholder="Japan" value={country} onChangeText={setCountry} />
        <CustomInput label="Car Brand" placeholder="KIA" value={brand} onChangeText={setBrand} />
        <CustomInput label="Model" placeholder="A3" value={model} onChangeText={setModel} />

        <Text style={[typography.h4, { color: colors.text, marginVertical: spacing.md }]}>Category</Text>
        <View style={styles.catRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
              style={[styles.catChip, {
                backgroundColor: selectedCat === cat.id ? colors.primary + '22' : colors.surface,
                borderColor: selectedCat === cat.id ? colors.primary : colors.border,
              }]}
            >
              <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
              <Text style={[typography.caption, { color: selectedCat === cat.id ? colors.primary : colors.text, marginTop: 4 }]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <CustomButton title="Apply" onPress={handleApply} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  catRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  catChip: { width: 80, height: 80, borderRadius: 12, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
});

export default FilterScreen;
