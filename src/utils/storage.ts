import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  set: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  get: async (key: string) => {
    const val = await AsyncStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  },
  remove: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
  clear: async () => {
    await AsyncStorage.clear();
  },
};
