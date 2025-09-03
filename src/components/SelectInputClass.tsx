import React from "react";
import { Menu, Button } from "react-native-paper";

const ROLES = ["All", "Top", "Jungle", "Mid", "ADC", "Support"] as const;

type Props = { value: string; onChange: (v: string) => void };

export default function SelectInputClass({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <Menu
      visible={open}
      onDismiss={() => setOpen(false)}
      anchor={
        <Button mode="contained" onPress={() => setOpen(true)}>
          {value || "Selecione a classe"}
        </Button>
      }
    >
      {ROLES.map((r) => (
        <Menu.Item
          key={r}
          onPress={() => {
            onChange(r);
            setOpen(false);
          }}
          title={r}
        />
      ))}
    </Menu>
  );
}
