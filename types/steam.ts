export interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate?: number;
  communityvisibilitystate?: number; // 3 = public, 1 = private
  profilestate?: number;
  lastlogoff?: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  gameextrainfo?: string;
  gameid?: string;
}

export interface SteamOwnedGame {
  appid: number;
  name: string;
  playtime_forever: number; // in minutes
  img_icon_url: string;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
  rtime_last_played?: number;
  content_descriptorids?: number[];
  playtime_2weeks?: number;
  has_community_visible_stats?: boolean;
}

export interface PlayerData {
  id: string; // resolved steamid64
  inputQuery: string; // what the user originally typed
  summary: SteamPlayerSummary;
  games: SteamOwnedGame[];
  gamesCount: number;
  isPrivate: boolean;
  error?: string;
  color?: string; // assigned accent color for badge
}

export interface IntersectedGame {
  appid: number;
  name: string;
  iconUrl: string;
  headerUrl: string;
  owners: {
    steamid: string;
    playtimeMinutes: number;
    lastPlayed?: number;
  }[];
  ownerCount: number;
  ownerRatio: number; // ownerCount / activePlayersCount
  totalGroupPlaytimeMinutes: number;
  avgGroupPlaytimeMinutes: number;
  isFullMatch: boolean;
  missingPlayers: string[]; // steamids of active players who do NOT own the game
  categories?: string[];
  genres?: string[];
}

export interface CombinationGroup {
  key: string; // e.g., "id1+id2"
  playerIds: string[];
  playerNames: string[];
  gameCount: number;
  games: IntersectedGame[];
}

export interface IntersectionResult {
  activePlayerCount: number;
  totalUniqueGames: number;
  fullMatches: IntersectedGame[]; // N/N
  missingOneMatches: IntersectedGame[]; // (N-1)/N
  partialMatches: IntersectedGame[]; // >=2 and <N (or custom threshold)
  thresholdMatches: IntersectedGame[]; // >= M
  allGames: IntersectedGame[];
  exactCombinations: CombinationGroup[];
}

export type FilterPreset = 'all_own' | 'missing_one' | 'threshold' | 'combinations' | 'all';
export type SortOption = 'playtime_desc' | 'name_asc' | 'name_desc' | 'owners_desc' | 'recent_played';
export type ViewMode = 'grid' | 'table';
