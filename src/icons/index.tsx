// src/icons/index.ts
export { default as AllIcon } from "../../assets/icons/all-icon.svg";
export { default as TopIcon } from "../../assets/icons/top-icon.svg";
export { default as MidIcon } from "../../assets/icons/mid-icon.svg";
export { default as SupIcon } from "../../assets/icons/sup-icon.svg";
export { default as BotIcon } from "../../assets/icons/bot-icon.svg";
export { default as JgIcon } from "../../assets/icons/jg-icon.svg";
export { default as StarIcon } from "../../assets/icons/star-icon.svg";

import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import AllIconCmp from "../../assets/icons/all-icon.svg";
import TopIconCmp from "../../assets/icons/top-icon.svg";
import MidIconCmp from "../../assets/icons/mid-icon.svg";
import SupIconCmp from "../../assets/icons/sup-icon.svg";
import BotIconCmp from "../../assets/icons/bot-icon.svg";
import JgIconCmp from "../../assets/icons/jg-icon.svg";
import StarIconCmp from "../../assets/icons/star-icon.svg";

export const Icons = {
  AllIcon: AllIconCmp,
  TopIcon: TopIconCmp,
  MidIcon: MidIconCmp,
  SupIcon: SupIconCmp,
  BotIcon: BotIconCmp,
  JgIcon: JgIconCmp,
  StarIcon: StarIconCmp,
} satisfies Record<string, ComponentType<SvgProps>>;

export type IconName = keyof typeof Icons;

export type AppIconProps = SvgProps & { name: IconName };
export function AppIcon({ name, ...props }: AppIconProps) {
  const Cmp = Icons[name];
  return <Cmp {...props} />;
}
