import { PlayerData, IntersectedGame, IntersectionResult, CombinationGroup, SteamOwnedGame } from '@/types/steam';
import { getSteamHeaderUrl, getSteamIconUrl } from './utils';

// Comprehensive popular Steam games community tags & metadata registry
export const KNOWN_GAME_TAGS: Record<number, { categories: string[]; genres: string[] }> = {
  // Crafting, Survival, Sandbox & Co-op
  105600: { categories: ["Crafting", "Sandbox", "Survival", "Open World Survival Craft", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "2D", "Adventure", "Pixel Graphics"], genres: ["Action", "Adventure", "Indie", "RPG"] }, // Terraria
  252490: { categories: ["Survival", "Crafting", "Open World Survival Craft", "Building", "Multiplayer", "PvP", "Online PvP", "Sandbox", "Co-op", "Online Co-Op", "FPS", "Shooter", "Open World"], genres: ["Action", "Adventure", "MMO", "RPG"] }, // Rust
  892970: { categories: ["Open World Survival Craft", "Survival", "Building", "Crafting", "Base-Building", "Online Co-Op", "Multiplayer", "Co-op", "Exploration", "Mythology", "Sandbox", "PvE"], genres: ["Action", "Adventure", "Indie", "RPG"] }, // Valheim
  413150: { categories: ["Farming Sim", "Crafting", "Building", "Life Sim", "Multiplayer", "Co-op", "Online Co-Op", "Sandbox", "Relaxing", "Pixel Graphics", "Singleplayer"], genres: ["Indie", "RPG", "Simulation"] }, // Stardew Valley
  322330: { categories: ["Survival", "Crafting", "Multiplayer", "Co-op", "Online Co-Op", "Open World Survival Craft", "Building", "Dark", "Indie", "Adventure"], genres: ["Adventure", "Indie", "Simulation"] }, // Don't Starve Together
  251570: { categories: ["Survival", "Zombies", "Crafting", "Open World Survival Craft", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "FPS", "Horror", "Sandbox"], genres: ["Action", "Adventure", "Indie", "RPG", "Simulation"] }, // 7 Days to Die
  1326470: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Horror", "Multiplayer", "Co-op", "Online Co-Op", "First-Person", "Adventure"], genres: ["Action", "Adventure", "Indie", "Simulation"] }, // Sons of the Forest
  242760: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Horror", "Multiplayer", "Co-op", "Online Co-Op", "First-Person", "Adventure"], genres: ["Action", "Adventure", "Indie", "Simulation"] }, // The Forest
  1203620: { categories: ["Open World Survival Craft", "Survival", "Crafting", "Base-Building", "Building", "RPG", "Action RPG", "Multiplayer", "Co-op", "Online Co-Op", "Open World"], genres: ["Action", "Adventure", "RPG"] }, // Enshrouded
  1604030: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Base-Building", "Vampire", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Online PvP", "Action RPG"], genres: ["Action", "Adventure", "RPG"] }, // V Rising
  648800: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Multiplayer", "Co-op", "Online Co-Op", "Ocean", "Adventure", "Exploration"], genres: ["Adventure", "Indie", "Simulation"] }, // Raft
  962130: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Base-Building", "Multiplayer", "Co-op", "Online Co-Op", "Action", "Adventure"], genres: ["Action", "Adventure"] }, // Grounded
  1623730: { categories: ["Open World Survival Craft", "Crafting", "Survival", "Creature Collector", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Open World", "Shooter"], genres: ["Action", "Adventure", "RPG"] }, // Palworld
  346110: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Dinosaurs", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Online PvP", "Open World"], genres: ["Action", "Adventure", "MMO", "RPG"] }, // ARK: Survival Evolved
  2399830: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Dinosaurs", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Online PvP"], genres: ["Action", "Adventure", "RPG"] }, // ARK: Survival Ascended
  526870: { categories: ["Automation", "Building", "Crafting", "Base-Building", "Open World", "Multiplayer", "Co-op", "Online Co-Op", "First-Person", "Sci-Fi"], genres: ["Simulation", "Strategy"] }, // Satisfactory
  427520: { categories: ["Automation", "Base-Building", "Crafting", "Building", "Resource Management", "Multiplayer", "Co-op", "Online Co-Op", "Strategy", "Sci-Fi"], genres: ["Indie", "Simulation", "Strategy"] }, // Factorio
  294100: { categories: ["Colony Sim", "Survival", "Base-Building", "Strategy", "Crafting", "Building", "Sandbox", "Story Rich", "Management"], genres: ["Indie", "Simulation", "Strategy"] }, // RimWorld
  387990: { categories: ["Survival", "Crafting", "Open World", "Underwater", "Building", "Exploration", "Sci-Fi", "Singleplayer", "Atmospheric"], genres: ["Adventure", "Indie"] }, // Subnautica

  // Popular Action & Co-op Hits
  553850: { categories: ["Online Co-Op", "PvE", "Third-Person Shooter", "Multiplayer", "Action", "Shooter", "Co-op", "Sci-Fi", "Extraction Shooter", "Comedy", "Space"], genres: ["Action"] }, // Helldivers 2
  1086940: { categories: ["RPG", "Turn-Based Combat", "Choices Matter", "Character Customization", "Story Rich", "Multiplayer", "Co-op", "Online Co-Op", "Fantasy", "Singleplayer"], genres: ["RPG", "Strategy"] }, // Baldur's Gate 3
  1966720: { categories: ["Online Co-Op", "Horror", "Multiplayer", "Co-op", "Survival Horror", "Proximity Chat", "Sci-Fi", "First-Person", "Comedy", "Indie"], genres: ["Action", "Indie"] }, // Lethal Company
  548430: { categories: ["Online Co-Op", "PvE", "FPS", "Mining", "Multiplayer", "Co-op", "Shooter", "Sci-Fi", "Procedural Generation", "Space", "Dwarf"], genres: ["Action"] }, // Deep Rock Galactic
  739630: { categories: ["Horror", "Online Co-Op", "VR", "Investigation", "Multiplayer", "Co-op", "Supernatural", "First-Person", "Survival"], genres: ["Indie"] }, // Phasmophobia
  632360: { categories: ["Roguelike", "Third-Person Shooter", "Online Co-Op", "Action Roguelike", "Multiplayer", "Co-op", "Action", "Sci-Fi", "Indie"], genres: ["Action", "Indie"] }, // Risk of Rain 2
  620: { categories: ["Puzzle", "Co-op", "Online Co-Op", "Sci-Fi", "Singleplayer", "Comedy", "First-Person", "Multiplayer"], genres: ["Action", "Adventure"] }, // Portal 2
  286160: { categories: ["Tabletop", "Board Game", "Sandbox", "Multiplayer", "Moddable", "Physics", "Co-op", "Online Co-Op", "Strategy", "Card Game"], genres: ["Indie", "Simulation", "Strategy"] }, // Tabletop Simulator
  218620: { categories: ["Heist", "FPS", "Online Co-Op", "Action", "Shooter", "Multiplayer", "Co-op", "Crime", "Stealth"], genres: ["Action", "RPG"] }, // PAYDAY 2
  945360: { categories: ["Social Deduction", "Multiplayer", "Online Co-Op", "Party Game", "PvP", "Casual", "Sci-Fi", "Survival"], genres: ["Casual", "Indie"] }, // Among Us
  1172620: { categories: ["Pirates", "Open World", "Multiplayer", "Adventure", "PvP", "Online PvP", "Co-op", "Online Co-Op", "Action"], genres: ["Action", "Adventure"] }, // Sea of Thieves
  550: { categories: ["Zombies", "Online Co-Op", "FPS", "Action", "Shooter", "Multiplayer", "Co-op", "PvP", "Survival"], genres: ["Action"] }, // Left 4 Dead 2
  582010: { categories: ["Action RPG", "Hunting", "Co-op", "Online Co-Op", "Action", "RPG", "Multiplayer", "Open World", "Third Person"], genres: ["Action"] }, // Monster Hunter: World
  1446780: { categories: ["Action RPG", "Hunting", "Co-op", "Online Co-Op", "Action", "RPG", "Multiplayer"], genres: ["Action"] }, // Monster Hunter Rise
  381210: { categories: ["Horror", "Survival Horror", "Multiplayer", "Online PvP", "PvP", "Asymmetrical VR", "Co-op", "Survival"], genres: ["Action"] }, // Dead by Daylight
  1225330: { categories: ["Horror", "Online Co-Op", "Multiplayer", "Co-op", "Comedy", "First-Person", "Found Footage"], genres: ["Action", "Indie"] }, // Content Warning

  // Competitive PvP & Shooters
  730: { categories: ["FPS", "Shooter", "Multiplayer", "Competitive", "Action", "Team-Based", "e-sports", "Tactical", "PvP", "Online PvP"], genres: ["Action", "Free to Play"] }, // CS2
  570: { categories: ["MOBA", "Multiplayer", "Strategy", "PvP", "Online PvP", "Competitive", "e-sports", "Team-Based", "Action"], genres: ["Action", "Strategy", "Free to Play"] }, // Dota 2
  440: { categories: ["FPS", "Hero Shooter", "Multiplayer", "Shooter", "Action", "Comedy", "Competitive", "Class-Based", "PvP", "Online PvP"], genres: ["Action", "Free to Play"] }, // TF2
  1172470: { categories: ["Battle Royale", "FPS", "Shooter", "Multiplayer", "Hero Shooter", "First-Person", "Action", "PvP", "Online PvP"], genres: ["Action", "Free to Play"] }, // Apex Legends
  578080: { categories: ["Survival", "Shooter", "Battle Royale", "Multiplayer", "FPS", "PvP", "Online PvP", "Third-Person Shooter", "Tactical"], genres: ["Action", "Adventure", "Free to Play"] }, // PUBG
  359550: { categories: ["FPS", "Tactical", "Shooter", "Multiplayer", "Competitive", "Action", "PvP", "Online PvP", "Team-Based"], genres: ["Action"] }, // Rainbow Six Siege
  230410: { categories: ["Free to Play", "Action RPG", "Third-Person Shooter", "Online Co-Op", "Multiplayer", "Co-op", "Sci-Fi", "Ninja"], genres: ["Action", "Free to Play", "RPG"] }, // Warframe
  1085660: { categories: ["FPS", "Open World", "MMO", "Shooter", "Multiplayer", "Online Co-Op", "PvP", "PvE", "Sci-Fi", "Action RPG"], genres: ["Action", "Free to Play", "Adventure"] }, // Destiny 2
  271590: { categories: ["Open World", "Action", "Multiplayer", "Crime", "Third Person", "First-Person", "Shooter", "Online PvP", "Co-op"], genres: ["Action", "Adventure"] }, // GTA V
  1174180: { categories: ["Open World", "Story Rich", "Western", "Adventure", "Multiplayer", "Third Person", "Action", "Singleplayer"], genres: ["Action", "Adventure"] }, // Red Dead Redemption 2
  2073850: { categories: ["FPS", "Shooter", "Action", "Multiplayer", "Destruction", "Fast-Paced", "Competitive", "PvP", "Online PvP"], genres: ["Action", "Free to Play"] }, // THE FINALS
  1245620: { categories: ["Souls-like", "Dark Fantasy", "Open World", "RPG", "Difficult", "Third Person", "Action RPG", "Multiplayer", "PvP", "Co-op"], genres: ["Action", "RPG"] }, // ELDEN RING
  238960: { categories: ["Action RPG", "Hack and Slash", "Dark Fantasy", "Free to Play", "Multiplayer", "Co-op", "PvP", "RPG"], genres: ["Action", "Free to Play", "RPG"] }, // Path of Exile
  2694490: { categories: ["Action RPG", "Hack and Slash", "Dark Fantasy", "Multiplayer", "Co-op", "PvP", "RPG", "Online Co-Op"], genres: ["Action", "Adventure", "RPG"] }, // Path of Exile 2
  4000: { categories: ["Sandbox", "Moddable", "Multiplayer", "Physics", "Funny", "Comedy", "First-Person", "Shooter", "Singleplayer"], genres: ["Indie", "Simulation"] }, // Garry's Mod
  1426210: { categories: ["Co-op", "Online Co-Op", "Local Co-Op", "Puzzle", "Action", "Adventure", "Platformer", "2 Player", "Split Screen"], genres: ["Action", "Adventure"] }, // It Takes Two
  848450: { categories: ["Co-op", "Online Co-Op", "Local Co-Op", "Action", "Adventure", "Story Rich", "Split Screen"], genres: ["Action", "Adventure"] }, // A Way Out
  // RPGs & Action RPGs
  1091500: { categories: ["RPG", "Cyberpunk", "Open World", "Singleplayer", "Story Rich", "First-Person", "Sci-Fi", "Action RPG"], genres: ["RPG", "Action"] }, // Cyberpunk 2077
  292030: { categories: ["RPG", "Open World", "Story Rich", "Atmospheric", "Fantasy", "Singleplayer", "Third Person"], genres: ["RPG", "Adventure"] }, // The Witcher 3
  489830: { categories: ["RPG", "Open World", "Fantasy", "Singleplayer", "Moddable", "Atmospheric", "Action RPG"], genres: ["RPG"] }, // Skyrim Special Edition
  377160: { categories: ["RPG", "Open World", "Post-apocalyptic", "Singleplayer", "Shooter", "Sci-Fi", "Action RPG"], genres: ["RPG"] }, // Fallout 4
  2344520: { categories: ["Action RPG", "Hack and Slash", "Dark Fantasy", "Multiplayer", "Co-op", "Online Co-Op", "PvP"], genres: ["Action", "RPG"] }, // Diablo IV
  1716740: { categories: ["RPG", "Space", "Open World", "Sci-Fi", "Singleplayer", "Exploration", "Action RPG"], genres: ["RPG", "Action"] }, // Starfield
  1145360: { categories: ["Roguelike", "Action Roguelike", "Hack and Slash", "Indie", "Mythology", "Singleplayer", "Story Rich"], genres: ["Action", "Indie", "RPG"] }, // Hades
  1145350: { categories: ["Roguelike", "Action Roguelike", "Hack and Slash", "Indie", "Mythology", "Singleplayer"], genres: ["Action", "Indie", "RPG"] }, // Hades II
  1687950: { categories: ["JRPG", "Story Rich", "Turn-Based Combat", "Singleplayer", "Anime", "Soundtrack"], genres: ["RPG"] }, // Persona 5 Royal
  1462040: { categories: ["RPG", "Action RPG", "Story Rich", "Singleplayer", "Third Person"], genres: ["RPG", "Action"] }, // Final Fantasy VII Remake
  367520: { categories: ["Metroidvania", "Souls-like", "Difficult", "Platformer", "2D", "Indie", "Singleplayer", "Dark Fantasy"], genres: ["Action", "Adventure", "Indie"] }, // Hollow Knight

  // Strategy, Automation & City Builders
  289070: { categories: ["Strategy", "Turn-Based Strategy", "Historical", "4X", "Multiplayer", "Singleplayer", "Tactical"], genres: ["Strategy"] }, // Civilization VI
  8930: { categories: ["Strategy", "Turn-Based Strategy", "Historical", "4X", "Multiplayer", "Singleplayer"], genres: ["Strategy"] }, // Civilization V
  281990: { categories: ["Space", "Strategy", "4X", "Sci-Fi", "Grand Strategy", "Multiplayer", "Singleplayer"], genres: ["Strategy", "Simulation"] }, // Stellaris
  394360: { categories: ["Strategy", "Grand Strategy", "Historical", "Military", "World War II", "Multiplayer", "Singleplayer"], genres: ["Strategy", "Simulation"] }, // Hearts of Iron IV
  236850: { categories: ["Grand Strategy", "Strategy", "Historical", "Multiplayer", "Singleplayer"], genres: ["Strategy", "Simulation"] }, // Europa Universalis IV
  1158310: { categories: ["RPG", "Grand Strategy", "Medieval", "Historical", "Strategy", "Multiplayer", "Simulation"], genres: ["RPG", "Strategy", "Simulation"] }, // Crusader Kings III
  1142710: { categories: ["Strategy", "Grand Strategy", "Turn-Based Strategy", "Dark Fantasy", "Warhammer 40k", "Multiplayer"], genres: ["Strategy", "Action"] }, // Total War: WARHAMMER III
  255710: { categories: ["City Builder", "Simulation", "Building", "Management", "Strategy", "Sandbox", "Singleplayer"], genres: ["Simulation", "Strategy"] }, // Cities: Skylines
  949230: { categories: ["City Builder", "Simulation", "Building", "Management", "Strategy", "Sandbox"], genres: ["Simulation", "Strategy"] }, // Cities: Skylines II
  646570: { categories: ["Roguelike Deckbuilder", "Card Battler", "Turn-Based Combat", "Strategy", "Indie", "Singleplayer"], genres: ["Strategy", "Indie"] }, // Slay the Spire
  2379780: { categories: ["Roguelike Deckbuilder", "Card Game", "Poker", "Strategy", "Casual", "Indie", "Singleplayer"], genres: ["Casual", "Indie", "Strategy"] }, // Balatro
  1794680: { categories: ["Action Roguelike", "Pixel Graphics", "Bullet Hell", "Casual", "Indie", "Singleplayer"], genres: ["Action", "Casual", "Indie"] }, // Vampire Survivors

  // Simulation, Sports & Racing
  252950: { categories: ["Multiplayer", "Soccer", "Sports", "Competitive", "PvP", "Online PvP", "Co-op", "Fast-Paced"], genres: ["Action", "Sports", "Racing"] }, // Rocket League
  1222670: { categories: ["Life Sim", "Character Customization", "Building", "Casual", "Simulation", "Singleplayer"], genres: ["Simulation", "Free to Play"] }, // The Sims 4
  227300: { categories: ["Driving", "Simulation", "Automobile Sim", "Open World", "Multiplayer", "Singleplayer"], genres: ["Indie", "Simulation"] }, // Euro Truck Simulator 2
  270880: { categories: ["Driving", "Simulation", "Automobile Sim", "Open World", "Multiplayer", "Singleplayer"], genres: ["Indie", "Simulation"] }, // American Truck Simulator
  1248130: { categories: ["Farming Sim", "Simulation", "Agriculture", "Multiplayer", "Co-op", "Singleplayer"], genres: ["Simulation"] }, // Farming Simulator 22
  1551360: { categories: ["Racing", "Open World", "Driving", "Multiplayer", "Automobile Sim", "Singleplayer", "PvP"], genres: ["Racing", "Action", "Adventure"] }, // Forza Horizon 5
  1293830: { categories: ["Racing", "Open World", "Driving", "Multiplayer", "Automobile Sim", "Singleplayer", "PvP"], genres: ["Racing", "Action"] }, // Forza Horizon 4
  2252570: { categories: ["Sports", "Management", "Football", "Soccer", "Simulation", "Strategy"], genres: ["Simulation", "Sports", "Strategy"] }, // Football Manager 2024
  2195250: { categories: ["Soccer", "Sports", "Football", "Multiplayer", "PvP", "Online PvP", "Controller"], genres: ["Sports"] }, // EA SPORTS FC 24
  2050650: { categories: ["Survival Horror", "Zombies", "Action", "Shooter", "Third-Person Shooter", "Singleplayer"], genres: ["Action", "Adventure"] }, // Resident Evil 4 Remake
};

export function calculateLibraryIntersections(
  players: PlayerData[],
  activePlayerIds: string[],
  thresholdMin: number = 2,
  tagOverrides?: Record<number, { categories: string[]; genres: string[] }>
): IntersectionResult {
  const activePlayers = players.filter((p) => activePlayerIds.includes(p.id) && !p.isPrivate);
  const activeCount = activePlayers.length;

  if (activeCount === 0) {
    return {
      activePlayerCount: 0,
      totalUniqueGames: 0,
      fullMatches: [],
      missingOneMatches: [],
      partialMatches: [],
      thresholdMatches: [],
      allGames: [],
      exactCombinations: [],
    };
  }

  // Map each appid to accumulated game info & owners
  const gameMap = new Map<
    number,
    {
      appid: number;
      name: string;
      iconUrl: string;
      owners: { steamid: string; playtimeMinutes: number; lastPlayed?: number }[];
    }
  >();

  activePlayers.forEach((player) => {
    (player.games || []).forEach((game: SteamOwnedGame) => {
      let existing = gameMap.get(game.appid);
      if (!existing) {
        existing = {
          appid: game.appid,
          name: game.name,
          iconUrl: getSteamIconUrl(game.appid, game.img_icon_url),
          owners: [],
        };
        gameMap.set(game.appid, existing);
      }
      existing.owners.push({
        steamid: player.id,
        playtimeMinutes: game.playtime_forever || 0,
        lastPlayed: game.rtime_last_played,
      });
    });
  });

  const activeIdSet = new Set(activePlayers.map((p) => p.id));
  const intersectedGames: IntersectedGame[] = [];

  // Group by exact combination key (sorted player IDs joined by "+")
  const combinationsMap = new Map<string, IntersectedGame[]>();

  gameMap.forEach((entry) => {
    const ownerIds = entry.owners.map((o) => o.steamid);
    const ownerIdSet = new Set(ownerIds);
    const missingPlayers = activePlayers
      .filter((p) => !ownerIdSet.has(p.id))
      .map((p) => p.id);

    const totalGroupPlaytime = entry.owners.reduce((sum, o) => sum + o.playtimeMinutes, 0);
    const avgPlaytime = entry.owners.length > 0 ? Math.round(totalGroupPlaytime / entry.owners.length) : 0;
    const isFullMatch = entry.owners.length === activeCount;

    // Merge tags from dynamic fetch, curated registry, and name heuristics
    const dynamicTags = tagOverrides?.[entry.appid];
    const curatedTags = KNOWN_GAME_TAGS[entry.appid];

    const tagSet = new Set<string>();
    const genreSet = new Set<string>();

    if (dynamicTags) {
      (dynamicTags.categories || []).forEach((c) => tagSet.add(c));
      (dynamicTags.genres || []).forEach((g) => genreSet.add(g));
    }
    if (curatedTags) {
      (curatedTags.categories || []).forEach((c) => tagSet.add(c));
      (curatedTags.genres || []).forEach((g) => genreSet.add(g));
    }

    // Comprehensive heuristics from game name if specific genres or tags not yet resolved
    const nameLower = entry.name.toLowerCase();

    // Survival / Crafting
    if (nameLower.includes('craft') || nameLower.includes('survival') || nameLower.includes('rust') || nameLower.includes('valheim') || nameLower.includes('terraria') || nameLower.includes('forest') || nameLower.includes('enshrouded') || nameLower.includes('palworld') || nameLower.includes('ark')) {
      tagSet.add('Crafting');
      tagSet.add('Survival');
      tagSet.add('Open World Survival Craft');
      tagSet.add('Building');
      genreSet.add('Adventure');
    }

    // RPG
    if (nameLower.includes('dungeon') || nameLower.includes('rpg') || nameLower.includes('dragon') || nameLower.includes('fantasy') || nameLower.includes('quest') || nameLower.includes('witcher') || nameLower.includes('souls') || nameLower.includes('ring') || nameLower.includes('baldur') || nameLower.includes('divinity') || nameLower.includes('fallout') || nameLower.includes('skyrim') || nameLower.includes('elder scrolls') || nameLower.includes('cyberpunk') || nameLower.includes('persona') || nameLower.includes('final fantasy')) {
      tagSet.add('RPG');
      tagSet.add('Action RPG');
      genreSet.add('RPG');
    }

    // Strategy
    if (nameLower.includes('civilization') || nameLower.includes('total war') || nameLower.includes('crusader kings') || nameLower.includes('hearts of iron') || nameLower.includes('stellaris') || nameLower.includes('europa universalis') || nameLower.includes('starcraft') || nameLower.includes('age of empires') || nameLower.includes('xcom') || nameLower.includes('rimworld') || nameLower.includes('factorio') || nameLower.includes('tactics') || nameLower.includes('command & conquer') || nameLower.includes('anno') || nameLower.includes('slay the spire') || nameLower.includes('balatro') || nameLower.includes('strategy')) {
      tagSet.add('Strategy');
      genreSet.add('Strategy');
    }

    // Simulation
    if (nameLower.includes('simulator') || nameLower.includes('sim ') || nameLower.includes('flight') || nameLower.includes('farming') || nameLower.includes('truck') || nameLower.includes('train') || nameLower.includes('cities:') || nameLower.includes('planet zoo') || nameLower.includes('planet coaster') || nameLower.includes('tycoon') || nameLower.includes('flipper') || nameLower.includes('the sims')) {
      tagSet.add('Simulation');
      genreSet.add('Simulation');
    }

    // Shooters / FPS
    if (nameLower.includes('war') || nameLower.includes('strike') || nameLower.includes('duty') || nameLower.includes('shooter') || nameLower.includes('sniper') || nameLower.includes('battlefield') || nameLower.includes('siege') || nameLower.includes('fps') || nameLower.includes('counter-strike') || nameLower.includes('black ops') || nameLower.includes('doom') || nameLower.includes('halo') || nameLower.includes('destiny') || nameLower.includes('apex') || nameLower.includes('overwatch') || nameLower.includes('pubg')) {
      tagSet.add('FPS');
      tagSet.add('Shooter');
      tagSet.add('PvP');
      tagSet.add('Online PvP');
      genreSet.add('Action');
    }

    // Racing & Driving
    if (nameLower.includes('forza') || nameLower.includes('need for speed') || nameLower.includes('dirt') || nameLower.includes('racing') || nameLower.includes('rally') || nameLower.includes('f1') || nameLower.includes('assetto') || nameLower.includes('grid') || nameLower.includes('motorsport') || nameLower.includes('burnout')) {
      tagSet.add('Racing');
      genreSet.add('Racing');
    }

    // Sports
    if (nameLower.includes('fifa') || nameLower.includes('nba') || nameLower.includes('fc 2') || nameLower.includes('football') || nameLower.includes('madden') || nameLower.includes('rocket league') || nameLower.includes('wwe') || nameLower.includes('pga') || nameLower.includes('hockey')) {
      tagSet.add('Sports');
      genreSet.add('Sports');
    }

    // Horror
    if (nameLower.includes('horror') || nameLower.includes('resident evil') || nameLower.includes('silent hill') || nameLower.includes('dead space') || nameLower.includes('outlast') || nameLower.includes('amnesia') || nameLower.includes('phasmophobia') || nameLower.includes('lethal company')) {
      tagSet.add('Horror');
      genreSet.add('Action');
    }

    // Puzzle & Platformer
    if (nameLower.includes('portal') || nameLower.includes('puzzle') || nameLower.includes('talos') || nameLower.includes('witness') || nameLower.includes('tetris') || nameLower.includes('hollow knight') || nameLower.includes('celeste') || nameLower.includes('cuphead') || nameLower.includes('platformer')) {
      tagSet.add('Puzzle');
      genreSet.add('Adventure');
    }

    if (tagSet.size === 0) {
      tagSet.add('Multi-player');
      tagSet.add('Co-op');
    }
    if (genreSet.size === 0) {
      genreSet.add('Action');
      genreSet.add('Indie');
    }

    const game: IntersectedGame = {
      appid: entry.appid,
      name: entry.name,
      iconUrl: entry.iconUrl,
      headerUrl: getSteamHeaderUrl(entry.appid),
      owners: entry.owners,
      ownerCount: entry.owners.length,
      ownerRatio: entry.owners.length / activeCount,
      totalGroupPlaytimeMinutes: totalGroupPlaytime,
      avgGroupPlaytimeMinutes: avgPlaytime,
      isFullMatch,
      missingPlayers,
      categories: Array.from(tagSet),
      genres: Array.from(genreSet),
    };

    intersectedGames.push(game);

    // Combination key: sorted active owner IDs
    const comboKey = ownerIds
      .filter((id) => activeIdSet.has(id))
      .sort()
      .join('+');

    if (comboKey) {
      const list = combinationsMap.get(comboKey) || [];
      list.push(game);
      combinationsMap.set(comboKey, list);
    }
  });

  // Buckets
  const fullMatches = intersectedGames.filter((g) => g.ownerCount === activeCount);
  const missingOneMatches = activeCount >= 3 ? intersectedGames.filter((g) => g.ownerCount === activeCount - 1) : [];
  const partialMatches = intersectedGames.filter((g) => g.ownerCount >= 2 && g.ownerCount < activeCount);
  const effectiveThreshold = Math.min(Math.max(thresholdMin, 2), activeCount);
  const thresholdMatches = intersectedGames.filter((g) => g.ownerCount >= effectiveThreshold);

  // Exact combinations list sorted by largest owner group down
  const exactCombinations: CombinationGroup[] = [];
  combinationsMap.forEach((games, key) => {
    const playerIds = key.split('+');
    const playerNames = playerIds.map((id) => {
      const p = activePlayers.find((ap) => ap.id === id);
      return p ? p.summary.personaname : id;
    });

    exactCombinations.push({
      key,
      playerIds,
      playerNames,
      gameCount: games.length,
      games: games.sort((a, b) => b.totalGroupPlaytimeMinutes - a.totalGroupPlaytimeMinutes),
    });
  });

  // Sort combinations: most players first, then highest game count
  exactCombinations.sort((a, b) => {
    if (b.playerIds.length !== a.playerIds.length) {
      return b.playerIds.length - a.playerIds.length;
    }
    return b.gameCount - a.gameCount;
  });

  return {
    activePlayerCount: activeCount,
    totalUniqueGames: intersectedGames.length,
    fullMatches,
    missingOneMatches,
    partialMatches,
    thresholdMatches,
    allGames: intersectedGames,
    exactCombinations,
  };
}
