import React from "react";
import { Menu, IconButton, Text } from "react-native-paper";

export type MenuOption = { label: string; value: string };

type Props = {
  icon: string;
  options: MenuOption[];
  onSelect: (value: string) => void;
  label?: string;
};

export default function MenuButton({ icon, options, onSelect, label }: Props) {
  const [visible, setVisible] = React.useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<IconButton icon={icon} onPress={() => setVisible(true)} />}
    >
      {label ? (
        <Text
          variant="labelMedium"
          style={{ paddingHorizontal: 12, paddingVertical: 6 }}
        >
          {label}
        </Text>
      ) : null}
      {options.map((opt) => (
        <Menu.Item
          key={opt.value}
          onPress={() => {
            onSelect(opt.value);
            setVisible(false);
          }}
          title={opt.label}
        />
      ))}
    </Menu>
  );
}
