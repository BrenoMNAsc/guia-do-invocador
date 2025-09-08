import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { Card, Text } from "react-native-paper";
import type { Champion } from "../types/domain";
import { getChampionImage } from "../assets/champion";
import Svg, { Circle } from "react-native-svg";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RoleIcon } from "../icons/RoleIcon";

type Props = {
  champion: Champion;
  onPress: () => void;
};

export default function ChampionCard({ champion, onPress }: Props) {
  const build = champion.builds?.[0];
  const imageSource = getChampionImage(champion.name);
  const primaryRoleUpper =
    (Array.isArray((champion as any).roles)
      ? (champion as any).roles[0]
      : (champion as any).role
    )?.toUpperCase?.() ?? "ALL";

  const runeKeystoneSrc = {
    uri: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/rune/${build?.runes?.[0]}.png`,
  };
  const itemSrcs = [
    {
      uri: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${build?.items?.core[0]}.png`,
    },
    {
      uri: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${build?.items?.core[1]}.png`,
    },
    {
      uri: `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${build?.items?.core[2]}.png`,
    },
  ];

  return (
    <Card onPress={onPress} style={styles.card} mode="elevated">
      <View style={styles.root}>
        <ImageBackground
          source={imageSource}
          style={styles.left}
          imageStyle={styles.leftImg}
        >
          <View style={styles.starBadge}>
            <MaterialCommunityIcons
              name="star-outline"
              size={16}
              color="#FF7A66"
            />
          </View>

          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{champion.name}</Text>
            <View style={styles.roleBadge}>
              <RoleIcon
                role={primaryRoleUpper}
                width={18}
                height={18}
                color="#2B2B2B"
              />
            </View>
          </View>
        </ImageBackground>
        <View style={styles.right}>
          <View style={styles.topPanel}>
            <Image source={runeKeystoneSrc} style={styles.runeIcon} />
            <View style={styles.itemsRow}>
              {itemSrcs.map((src, idx) => (
                <Image key={idx} source={src} style={styles.itemIcon} />
              ))}
            </View>
          </View>

          <View style={styles.band}>
            <View style={styles.statsCol}>
              <View style={styles.statRow}>
                <MaterialCommunityIcons name="trophy" size={16} color="#FFF" />
                <Text style={styles.statText}>{formatCompact(150000)}</Text>
              </View>
              <View style={[styles.statRow, { marginTop: 6 }]}>
                <MaterialCommunityIcons
                  name="sword-cross"
                  size={16}
                  color="#FFF"
                />
                <Text style={styles.statText}>{formatCompact(200000)}</Text>
              </View>
            </View>

            <View style={styles.donutWrap}>
              <Donut
                progress={0.75}
                size={44}
                track="rgba(255,255,255,0.3)"
                fill="#FFF"
              />
              <Text style={styles.donutLabel}>75%</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

function Donut({
  progress,
  size = 40,
  stroke = 4,
  track = "#DDD",
  fill = "#FFF",
}: {
  progress: number;
  size?: number;
  stroke?: number;
  track?: string;
  fill?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - progress);

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={track}
        strokeWidth={stroke}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={fill}
        strokeWidth={stroke}
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={offset}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function formatCompact(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

const COLORS = {
  cardBg: "#F7F7F7",
  beige: "#FCEADE",
  accent: "#FF8A65",
  name: "#FF8A65",
  surface: "#2B2B2B",
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.cardBg,
  },
  root: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  left: {
    width: 140,
    height: 140,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: "hidden",
  },
  leftImg: {
    resizeMode: "cover",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  starBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nameText: {
    color: COLORS.name,
    fontSize: 18,
    fontWeight: "700",
  },
  roleBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FFE1D6",
    alignItems: "center",
    justifyContent: "center",
  },

  right: {
    flex: 1,
    height: 140,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.name,
  },

  topPanel: {
    flex: 1,
    backgroundColor: COLORS.beige,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 12,
  },
  runeIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 8,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  band: {
    height: 64,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsCol: {
    flexDirection: "column",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statText: {
    color: "#FFF",
    fontWeight: "700",
  },

  donutWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  donutLabel: {
    position: "absolute",
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
});
