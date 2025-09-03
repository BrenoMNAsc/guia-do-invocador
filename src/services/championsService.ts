import { Champion } from "../types/domain";
import { http } from "./http";

const placeholder = (w = 300, h = 300) =>
  `https://via.placeholder.com/${w}x${h}.png?text=LoL`;

const DB: Champion[] = [
  {
    id: "aatrox",
    name: "Aatrox",
    role: "Top",
    portrait: placeholder(400, 300),
    builds: [
      {
        title: "Default Bruiser",
        winRate: 51.2,
        pickRate: 12.1,
        runes: Array.from(
          { length: 9 },
          (_, i) => placeholder(64, 64) + `+Rune${i + 1}`
        ),
        items: Array.from(
          { length: 6 },
          (_, i) => placeholder(64, 64) + `+Item${i + 1}`
        ),
        skills: "Q>W>E>Q>Q>R>Q>E>Q>E>R>E>E>W>W",
      },
    ],
  },
  {
    id: "ahri",
    name: "Ahri",
    role: "Mid",
    portrait: placeholder(400, 300),
    builds: [
      {
        title: "Burst Mage",
        winRate: 53.0,
        pickRate: 18.3,
        runes: Array.from(
          { length: 9 },
          (_, i) => placeholder(64, 64) + `+Rune${i + 1}`
        ),
        items: Array.from(
          { length: 6 },
          (_, i) => placeholder(64, 64) + `+Item${i + 1}`
        ),
        skills: "Q>W>E>Q>Q>R>Q>E>Q>E>R>E>E>W>W",
      },
    ],
  },
  {
    id: "akali",
    name: "Akali",
    role: "Mid",
    portrait: placeholder(400, 300),
    builds: [
      {
        title: "Assassin",
        winRate: 49.4,
        pickRate: 9.2,
        runes: Array.from(
          { length: 9 },
          (_, i) => placeholder(64, 64) + `+Rune${i + 1}`
        ),
        items: Array.from(
          { length: 6 },
          (_, i) => placeholder(64, 64) + `+Item${i + 1}`
        ),
        skills: "Q>E>W>Q>Q>R>Q>E>Q>E>R>E>E>W>W",
      },
    ],
  },
];

export const championsService = {
  list: () => http.get(() => DB),
  byId: (id: string) => http.get(() => DB.find((c) => c.id === id)!),
};
