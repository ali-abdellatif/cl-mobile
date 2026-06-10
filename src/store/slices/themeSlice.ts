// NOTE: Scaffolded by setup. Exposes state.theme.isDark used by useAppTheme.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Language = 'en' | 'ar';

interface ThemeState {
  isDark: boolean;
  language: Language;
}

const initialState: ThemeState = {
  isDark: false,
  language: 'en',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: state => {
      state.isDark = !state.isDark;
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDark = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setLanguage } = themeSlice.actions;
export default themeSlice.reducer;
