import type { SvgProps } from "react-native-svg";
import { AppIcon } from "../icons";
import type { IconName } from "../icons";

export type RoleUpper = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT" | "ALL";

const roleIconMap: Record<RoleUpper, IconName> = {
  TOP: "TopIcon",
  JUNGLE: "JgIcon",
  MID: "MidIcon",
  ADC: "BotIcon",
  SUPPORT: "SupIcon",
  ALL: "AllIcon",
};

interface RoleIconProps extends Omit<SvgProps, "role"> {
  role: RoleUpper;
}

export function RoleIcon({ role, ...props }: RoleIconProps) {
  const name = roleIconMap[role] ?? "AllIcon";
  return <AppIcon name={name} {...props} />;
}
