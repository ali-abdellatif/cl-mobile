import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { LightColors, DarkColors } from '../theme/colors';

export const useAppTheme = () => {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const colors = isDark ? DarkColors : LightColors;
  return { colors, isDark };
};
