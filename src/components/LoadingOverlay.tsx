import { View } from "react-native";
import { ActivityIndicator, Modal, Portal, Text } from "react-native-paper";
import { useStyles } from "../hooks/useStyle";
import { useEffect } from "react";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({
  visible,
  message = "Carregando...",
}: LoadingOverlayProps) => {
  const { theme, createStyle } = useStyles();

  const styles = createStyle({
    modalContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    loadingContent: {
      backgroundColor: theme.colors.elevation.level3,
      padding: theme.spacing.lg,
      borderRadius: theme.roundness,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000,
    },
    loadingText: {
      marginLeft: theme.spacing.md,
      color: theme.colors.onSurface,
    },
  });

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={styles.modalContainer}
        theme={{ colors: { backdrop: "rgba(0, 0, 0, 0.5)" } }}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator
            size="large"
            animating={true}
            color={theme.colors.primary}
          />
          <Text variant="bodyLarge" style={styles.loadingText}>
            {message}
          </Text>
        </View>
      </Modal>
    </Portal>
  );
};
