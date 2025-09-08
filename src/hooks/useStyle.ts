// src/hooks/useStyles.ts
import { StyleSheet } from "react-native";
import { useAppTheme } from "./useTheme";

export const useStyles = () => {
  const theme = useAppTheme();

  const createStyle = <T extends StyleSheet.NamedStyles<T>>(
    styles: T | (() => T)
  ) => {
    return StyleSheet.create(typeof styles === "function" ? styles() : styles);
  };

  const padding = {
    xs: { padding: theme.spacing.xs },
    sm: { padding: theme.spacing.sm },
    md: { padding: theme.spacing.md },
    lg: { padding: theme.spacing.lg },
    xl: { padding: theme.spacing.xl },
    horizontal: {
      xs: { paddingHorizontal: theme.spacing.xs },
      sm: { paddingHorizontal: theme.spacing.sm },
      md: { paddingHorizontal: theme.spacing.md },
      lg: { paddingHorizontal: theme.spacing.lg },
      xl: { paddingHorizontal: theme.spacing.xl },
    },
    vertical: {
      xs: { paddingVertical: theme.spacing.xs },
      sm: { paddingVertical: theme.spacing.sm },
      md: { paddingVertical: theme.spacing.md },
      lg: { paddingVertical: theme.spacing.lg },
      xl: { paddingVertical: theme.spacing.xl },
    },
  };

  const margin = {
    xs: { margin: theme.spacing.xs },
    sm: { margin: theme.spacing.sm },
    md: { margin: theme.spacing.md },
    lg: { margin: theme.spacing.lg },
    xl: { margin: theme.spacing.xl },
    horizontal: {
      xs: { marginHorizontal: theme.spacing.xs },
      sm: { marginHorizontal: theme.spacing.sm },
      md: { marginHorizontal: theme.spacing.md },
      lg: { marginHorizontal: theme.spacing.lg },
      xl: { marginHorizontal: theme.spacing.xl },
    },
    vertical: {
      xs: { marginVertical: theme.spacing.xs },
      sm: { marginVertical: theme.spacing.sm },
      md: { marginVertical: theme.spacing.md },
      lg: { marginVertical: theme.spacing.lg },
      xl: { marginVertical: theme.spacing.xl },
    },
  };

  const gap = {
    xs: { gap: theme.spacing.xs },
    sm: { gap: theme.spacing.sm },
    md: { gap: theme.spacing.md },
    lg: { gap: theme.spacing.lg },
    xl: { gap: theme.spacing.xl },
  };

  return {
    theme,
    createStyle,
    padding,
    margin,
    gap,
    screen: {
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.layout.screenPadding,
      },
    },
    scrollView: {
      horizontal: {
        flexGrow: 0,
        paddingVertical: theme.spacing.sm,
      },
    },
    button: {
      base: {
        minWidth: theme.components.button.minWidth,
        height: theme.components.button.height,
        borderRadius: theme.components.button.borderRadius,
      },
      contained: {
        backgroundColor: theme.colors.primary,
      },
      outlined: {
        borderWidth: 1,
        borderColor: theme.colors.primary,
        backgroundColor: "transparent",
      },
    },
  };
};
