import type { IntersectedGame, PlayerData } from '../types/steam';

export interface GenreStat {
  genre: string;
  totalPlaytimeMinutes: number;
  gameCount: number;
  percentageOfTotal: number;
  avgPlaytimeMinutes: number;
  topGames: {
    appid: number;
    name: string;
    playtimeMinutes: number;
    iconUrl: string;
    headerUrl: string;
  }[];
}

export interface PlaytimeBucket {
  label: string;
  count: number;
  percentage: number;
  description: string;
  minHours: number;
  maxHours: number | null;
}

export interface PlayerStatSummary {
  steamid: string;
  personaname: string;
  avatar: string;
  totalPlaytimeMinutes: number;
  qualifyingGamesCount: number;
  unplayedGamesCount: number;
  filteredOutCount: number;
  filteredOutPlaytimeMinutes: number;
  avgPlaytimeMinutes: number;
  topGenre?: string;
  topGame?: {
    appid: number;
    name: string;
    playtimeMinutes: number;
  };
}

export interface LibraryStatsResult {
  totalPlaytimeMinutes: number;
  totalGamesCount: number;
  qualifyingGamesCount: number;
  unplayedGamesCount: number;
  filteredOutCount: number;
  filteredOutPlaytimeMinutes: number;
  avgPlaytimeMinutes: number;
  medianPlaytimeMinutes: number;
  genres: GenreStat[];
  topGames: {
    appid: number;
    name: string;
    playtimeMinutes: number;
    iconUrl: string;
    headerUrl: string;
    genres: string[];
    ownerCount: number;
    owners: { steamid: string; playtimeMinutes: number }[];
  }[];
  playtimeDistribution: PlaytimeBucket[];
  playerSummaries: PlayerStatSummary[];
  minPlaytimeMinutes: number;
  selectedPlayerId: string; // 'all' or specific steamid
}

/**
 * Calculates comprehensive playtime and genre analytics from games list.
 * Supports filtering out card-farming/idle playtime (< 5 hrs by default or custom).
 */
export function calculateLibraryStats(
  games: IntersectedGame[],
  players: PlayerData[],
  options: {
    minPlaytimeMinutes?: number; // e.g. 300 minutes = 5 hours
    selectedPlayerId?: string; // 'all' or specific steamid
  } = {}
): LibraryStatsResult {
  const minMinutes = options.minPlaytimeMinutes ?? 300; // default 5 hours
  const selectedPlayerId = options.selectedPlayerId || 'all';

  const totalGamesCount = games.length;
  if (totalGamesCount === 0) {
    return {
      totalPlaytimeMinutes: 0,
      totalGamesCount: 0,
      qualifyingGamesCount: 0,
      unplayedGamesCount: 0,
      filteredOutCount: 0,
      filteredOutPlaytimeMinutes: 0,
      avgPlaytimeMinutes: 0,
      medianPlaytimeMinutes: 0,
      genres: [],
      topGames: [],
      playtimeDistribution: [],
      playerSummaries: [],
      minPlaytimeMinutes: minMinutes,
      selectedPlayerId,
    };
  }

  // 1. Determine effective playtime for each game based on scope
  interface EvaluatedGame {
    game: IntersectedGame;
    playtimeMinutes: number;
  }

  const evaluatedGames: EvaluatedGame[] = games.map((game) => {
    let effectiveMinutes = 0;
    if (selectedPlayerId === 'all') {
      effectiveMinutes = game.totalGroupPlaytimeMinutes;
    } else {
      const owner = game.owners.find((o) => o.steamid === selectedPlayerId);
      effectiveMinutes = owner ? owner.playtimeMinutes : 0;
    }
    return { game, playtimeMinutes: effectiveMinutes };
  });

  // 2. Classify games: unplayed, filtered out (< minPlaytime), or qualifying (>= minPlaytime)
  let unplayedGamesCount = 0;
  let filteredOutCount = 0;
  let filteredOutPlaytimeMinutes = 0;
  const qualifyingGames: EvaluatedGame[] = [];

  evaluatedGames.forEach(({ game, playtimeMinutes }) => {
    if (playtimeMinutes <= 0) {
      unplayedGamesCount++;
    } else if (playtimeMinutes < minMinutes) {
      filteredOutCount++;
      filteredOutPlaytimeMinutes += playtimeMinutes;
    } else {
      qualifyingGames.push({ game, playtimeMinutes });
    }
  });

  const qualifyingGamesCount = qualifyingGames.length;
  const totalPlaytimeMinutes = qualifyingGames.reduce(
    (sum, eg) => sum + eg.playtimeMinutes,
    0
  );

  const avgPlaytimeMinutes =
    qualifyingGamesCount > 0
      ? Math.round(totalPlaytimeMinutes / qualifyingGamesCount)
      : 0;

  // 3. Calculate median playtime
  let medianPlaytimeMinutes = 0;
  if (qualifyingGamesCount > 0) {
    const sortedTimes = qualifyingGames
      .map((g) => g.playtimeMinutes)
      .sort((a, b) => a - b);
    const mid = Math.floor(sortedTimes.length / 2);
    if (sortedTimes.length % 2 === 0) {
      medianPlaytimeMinutes = Math.round(
        (sortedTimes[mid - 1] + sortedTimes[mid]) / 2
      );
    } else {
      medianPlaytimeMinutes = sortedTimes[mid];
    }
  }

  // 4. Calculate genre statistics
  const genreMap = new Map<
    string,
    {
      totalPlaytime: number;
      games: {
        appid: number;
        name: string;
        playtimeMinutes: number;
        iconUrl: string;
        headerUrl: string;
      }[];
    }
  >();

  qualifyingGames.forEach(({ game, playtimeMinutes }) => {
    const genres = (game.genres && game.genres.length > 0) ? game.genres : ['Other'];

    genres.forEach((genre) => {
      let entry = genreMap.get(genre);
      if (!entry) {
        entry = { totalPlaytime: 0, games: [] };
        genreMap.set(genre, entry);
      }
      entry.totalPlaytime += playtimeMinutes;
      entry.games.push({
        appid: game.appid,
        name: game.name,
        playtimeMinutes,
        iconUrl: game.iconUrl,
        headerUrl: game.headerUrl,
      });
    });
  });

  const genreStats: GenreStat[] = [];
  genreMap.forEach((data, genre) => {
    // Sort games in this genre by playtime descending
    const sortedTop = [...data.games].sort(
      (a, b) => b.playtimeMinutes - a.playtimeMinutes
    );
    genreStats.push({
      genre,
      totalPlaytimeMinutes: data.totalPlaytime,
      gameCount: data.games.length,
      percentageOfTotal:
        totalPlaytimeMinutes > 0
          ? Math.round((data.totalPlaytime / totalPlaytimeMinutes) * 1000) / 10
          : 0,
      avgPlaytimeMinutes:
        data.games.length > 0
          ? Math.round(data.totalPlaytime / data.games.length)
          : 0,
      topGames: sortedTop.slice(0, 5),
    });
  });

  // Sort genres by total playtime descending
  genreStats.sort((a, b) => b.totalPlaytimeMinutes - a.totalPlaytimeMinutes);

  // 5. Top most played games
  const sortedQualifying = [...qualifyingGames].sort(
    (a, b) => b.playtimeMinutes - a.playtimeMinutes
  );

  const topGames = sortedQualifying.slice(0, 10).map(({ game, playtimeMinutes }) => ({
    appid: game.appid,
    name: game.name,
    playtimeMinutes,
    iconUrl: game.iconUrl,
    headerUrl: game.headerUrl,
    genres: game.genres || ['Other'],
    ownerCount: game.ownerCount,
    owners: game.owners,
  }));

  // 6. Playtime distribution buckets across ALL evaluated games (to visualize card farming vs casual vs deep play)
  const buckets = [
    { label: 'Unplayed (0 hrs)', minHours: 0, maxHours: 0, count: 0, description: 'Backlog / Never opened' },
    { label: '< 5 hrs', minHours: 0.01, maxHours: 5, count: 0, description: 'Card farmed / Brief test' },
    { label: '5 – 20 hrs', minHours: 5, maxHours: 20, count: 0, description: 'Casual / Short playthrough' },
    { label: '20 – 50 hrs', minHours: 20, maxHours: 50, count: 0, description: 'Finished story / Regular play' },
    { label: '50 – 100 hrs', minHours: 50, maxHours: 100, count: 0, description: 'Deep dive / Replayed' },
    { label: '100+ hrs', minHours: 100, maxHours: null, count: 0, description: 'Core obsessions / Main games' },
  ];

  evaluatedGames.forEach(({ playtimeMinutes }) => {
    const hours = playtimeMinutes / 60;
    if (hours <= 0) {
      buckets[0].count++;
    } else if (hours < 5) {
      buckets[1].count++;
    } else if (hours < 20) {
      buckets[2].count++;
    } else if (hours < 50) {
      buckets[3].count++;
    } else if (hours < 100) {
      buckets[4].count++;
    } else {
      buckets[5].count++;
    }
  });

  const playtimeDistribution: PlaytimeBucket[] = buckets.map((b) => ({
    label: b.label,
    count: b.count,
    percentage:
      totalGamesCount > 0 ? Math.round((b.count / totalGamesCount) * 1000) / 10 : 0,
    description: b.description,
    minHours: b.minHours,
    maxHours: b.maxHours,
  }));

  // 7. Per-Player summaries
  const activePlayers = players.filter((p) => !p.isPrivate);
  const playerSummaries: PlayerStatSummary[] = activePlayers.map((p) => {
    let pTotalMinutes = 0;
    let pQualifyingCount = 0;
    let pUnplayedCount = 0;
    let pFilteredCount = 0;
    let pFilteredMinutes = 0;
    const pGenreMinutes = new Map<string, number>();
    let pTopGame: { appid: number; name: string; playtimeMinutes: number } | undefined;

    games.forEach((game) => {
      const owner = game.owners.find((o) => o.steamid === p.id);
      const minutes = owner ? owner.playtimeMinutes : 0;

      if (minutes <= 0) {
        pUnplayedCount++;
      } else if (minutes < minMinutes) {
        pFilteredCount++;
        pFilteredMinutes += minutes;
      } else {
        pQualifyingCount++;
        pTotalMinutes += minutes;

        if (!pTopGame || minutes > pTopGame.playtimeMinutes) {
          pTopGame = { appid: game.appid, name: game.name, playtimeMinutes: minutes };
        }

        const genres = (game.genres && game.genres.length > 0) ? game.genres : ['Other'];
        genres.forEach((g) => {
          pGenreMinutes.set(g, (pGenreMinutes.get(g) || 0) + minutes);
        });
      }
    });

    let topGenre: string | undefined;
    let topGenreMinutes = -1;
    pGenreMinutes.forEach((mins, g) => {
      if (mins > topGenreMinutes) {
        topGenreMinutes = mins;
        topGenre = g;
      }
    });

    const pAvg = pQualifyingCount > 0 ? Math.round(pTotalMinutes / pQualifyingCount) : 0;

    return {
      steamid: p.id,
      personaname: p.summary.personaname,
      avatar: p.summary.avatar,
      totalPlaytimeMinutes: pTotalMinutes,
      qualifyingGamesCount: pQualifyingCount,
      unplayedGamesCount: pUnplayedCount,
      filteredOutCount: pFilteredCount,
      filteredOutPlaytimeMinutes: pFilteredMinutes,
      avgPlaytimeMinutes: pAvg,
      topGenre,
      topGame: pTopGame,
    };
  });

  return {
    totalPlaytimeMinutes,
    totalGamesCount,
    qualifyingGamesCount,
    unplayedGamesCount,
    filteredOutCount,
    filteredOutPlaytimeMinutes,
    avgPlaytimeMinutes,
    medianPlaytimeMinutes,
    genres: genreStats,
    topGames,
    playtimeDistribution,
    playerSummaries,
    minPlaytimeMinutes: minMinutes,
    selectedPlayerId,
  };
}

/**
 * Format minutes into a friendly string (e.g. "1,420 hrs" or "24 mins")
 * along with day equivalence (e.g. "59.2 days").
 */
export function formatPlaytimeDetailed(minutes: number): {
  hoursStr: string;
  daysStr: string;
  exactHours: number;
} {
  if (!minutes || minutes <= 0) {
    return { hoursStr: '0 hrs', daysStr: '0 days', exactHours: 0 };
  }
  const hours = Math.round((minutes / 60) * 10) / 10;
  const days = Math.round((hours / 24) * 10) / 10;
  const hoursStr = hours < 1 ? `${minutes} mins` : `${hours.toLocaleString()} hrs`;
  const daysStr = `${days.toLocaleString()} days`;

  return { hoursStr, daysStr, exactHours: hours };
}
