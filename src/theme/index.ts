// src/theme/index.ts
import { MD3LightTheme } from "react-native-paper";

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    white: "#FFFFFF",
    primary: "#FF8A5B",
    onPrimary: "#FFFFFF",
    primaryContainer: "#FCEADE",
    background: "#FFFFFF",
    error: "#B00020",
    success: "#4CAF50",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 50,
  },

  layout: {
    screenPadding: 16,
    cardPadding: 16,
    buttonPadding: 12,
    inputPadding: 12,
  },
  components: {
    button: {
      minWidth: 80,
      height: 40,
      borderRadius: 5,
    },
    card: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
    },
  },
};

export type AppTheme = typeof lightTheme;
