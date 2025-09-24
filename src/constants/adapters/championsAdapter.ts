import type {
  BuildSpec,
  Champion,
  ChampionClass,
  Role,
} from "../../types/domain";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

function inferRoles(tags: string[]): Role[] {
  const set = new Set<Role>();
  const t = tags[0];
  switch (t) {
    case "Marksman":
      set.add("ADC");
      break;
    case "Support":
      set.add("SUPPORT");
      break;
    case "Mage":
      set.add("MID");
      break;
    case "Fighter":
    case "Tank":
      set.add("TOP");
      break;
    case "Assassin":
      if (!tags.includes("Mage")) set.add("JUNGLE");
      break;
    default:
      break;
  }
  if (set.size === 0) set.add("TOP");
  return Array.from(set);
}

function toChampionClasses(tags: string[]): ChampionClass[] {
  const allowed: ChampionClass[] = [
    "Assassin",
    "Fighter",
    "Mage",
    "Marksman",
    "Support",
    "Tank",
  ];
  return tags.filter((t): t is ChampionClass =>
    (allowed as string[]).includes(t)
  );
}

const TEMPLATES: Record<
  Role,
  Omit<BuildSpec, "id" | "title" | "winRate" | "pickRate">
> = {
  TOP: {
    role: "TOP",
    primaryStyle: 8000,
    secondaryStyle: 8400,
    runes: [8005, 9111, 9104, 8014, 8401, 8473],
    items: {
      start: [1054, 2003],
      core: [6630, 3071, 3053],
      boots: [3047, 3111],
      optional: [6333, 3156, 3026],
    },
    skillOrder: "Q>E>W>Q>Q>R>Q>E>Q>E>R>E>E>W>W",
  },
  JUNGLE: {
    role: "JUNGLE",
    primaryStyle: 8000,
    secondaryStyle: 8100,
    runes: [8010, 9111, 9104, 8017, 8139, 8135],
    items: {
      start: [1103],
      core: [6630, 3071, 3026],
      boots: [3047, 3111],
      optional: [6333, 3814],
    },
    skillOrder: "Q>W>E>Q>Q>R>Q>W>Q>W>R>W>W>E>E",
  },
  MID: {
    role: "MID",
    primaryStyle: 8200,
    secondaryStyle: 8100,
    runes: [8214, 8226, 8210, 8236, 8139, 8135],
    items: {
      start: [1056, 2003],
      core: [6655, 4645, 3089],
      boots: [3020],
      optional: [3157, 3102],
    },
    skillOrder: "Q>W>E>Q>Q>R>Q>W>Q>W>R>W>W>E>E",
  },
  ADC: {
    role: "ADC",
    primaryStyle: 8000,
    secondaryStyle: 8100,
    runes: [8008, 9111, 9104, 8014, 8139, 8135],
    items: {
      start: [1055, 2003],
      core: [6672, 3031, 3094],
      boots: [3006],
      optional: [3036, 3072],
    },
    skillOrder: "Q>W>E>Q>Q>R>Q>W>Q>W>R>W>W>E>E",
  },
  SUPPORT: {
    role: "SUPPORT",
    primaryStyle: 8400,
    secondaryStyle: 8300,
    runes: [8465, 8446, 8473, 8451, 8345, 8347],
    items: {
      start: [3860],
      core: [3190, 3050, 3109],
      boots: [3117, 3047],
      optional: [3222, 3107],
    },
    skillOrder: "Q>W>E>Q>Q>R>Q>W>Q>W>R>W>W>E>E",
  },
};

function synthBestBuildFor(championName: string, roles: Role[]): BuildSpec {
  const role = roles[0] ?? "TOP";
  const t = TEMPLATES[role];
  return {
    id: `${championName.toLowerCase()}-${role.toLowerCase()}-best`,
    title: "Build recomendada",
    winRate: 52.0 + Math.random() * 3,
    pickRate: 10.0 + Math.random() * 15,
    ...t,
    isBest: true,
  };
}

export function buildChampionsFromDdragonJson(json: any): Champion[] {
  const entries: Champion[] = [];
  const data = json?.data ?? {};
  for (const node of Object.values<any>(data)) {
    const tags: string[] = Array.isArray(node?.tags) ? node.tags : [];
    const roles = inferRoles(tags);
    const classes = toChampionClasses(tags);
    const id: string = node?.id ?? node?.name ?? "";
    const key: string = node?.key ?? "";
    const name: string = node?.name ?? id;

    const champion: Champion = {
      id,
      key,
      name,
      roles,
      classes,
      builds: [synthBestBuildFor(id, roles)],
      searchKey: normalize(name),
    };
    entries.push(champion);
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name));
}
