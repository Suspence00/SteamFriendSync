import { PlayerData, IntersectedGame, IntersectionResult, CombinationGroup, SteamOwnedGame } from '@/types/steam';
import { getSteamHeaderUrl, getSteamIconUrl } from './utils';

export interface KnownGameMeta {
  categories: string[];
  genres: string[];
  maxPlayers?: number;
}

// Comprehensive popular Steam games community tags & metadata registry
export const KNOWN_GAME_TAGS: Record<number, KnownGameMeta> = {
  // Crafting, Survival, Sandbox & Co-op
  105600: { categories: ["Crafting", "Sandbox", "Survival", "Open World Survival Craft", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "2D", "Adventure", "Pixel Graphics"], genres: ["Action", "Adventure", "Indie", "RPG"], maxPlayers: 8 }, // Terraria
  252490: { categories: ["Survival", "Crafting", "Open World Survival Craft", "Building", "Multiplayer", "PvP", "Online PvP", "Sandbox", "Co-op", "Online Co-Op", "FPS", "Shooter", "Open World"], genres: ["Action", "Adventure", "MMO", "RPG"], maxPlayers: 100 }, // Rust
  892970: { categories: ["Open World Survival Craft", "Survival", "Building", "Crafting", "Base-Building", "Online Co-Op", "Multiplayer", "Co-op", "Exploration", "Mythology", "Sandbox", "PvE"], genres: ["Action", "Adventure", "Indie", "RPG"], maxPlayers: 10 }, // Valheim
  413150: { categories: ["Farming Sim", "Crafting", "Building", "Life Sim", "Multiplayer", "Co-op", "Online Co-Op", "Sandbox", "Relaxing", "Pixel Graphics", "Singleplayer"], genres: ["Indie", "RPG", "Simulation"], maxPlayers: 8 }, // Stardew Valley
  322330: { categories: ["Survival", "Crafting", "Multiplayer", "Co-op", "Online Co-Op", "Open World Survival Craft", "Building", "Dark", "Indie", "Adventure"], genres: ["Adventure", "Indie", "Simulation"], maxPlayers: 6 }, // Don't Starve Together
  251570: { categories: ["Survival", "Zombies", "Crafting", "Open World Survival Craft", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "FPS", "Horror", "Sandbox"], genres: ["Action", "Adventure", "Indie", "RPG", "Simulation"], maxPlayers: 8 }, // 7 Days to Die
  1326470: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Horror", "Multiplayer", "Co-op", "Online Co-Op", "First-Person", "Adventure"], genres: ["Action", "Adventure", "Indie", "Simulation"], maxPlayers: 8 }, // Sons of the Forest
  242760: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Horror", "Multiplayer", "Co-op", "Online Co-Op", "First-Person", "Adventure"], genres: ["Action", "Adventure", "Indie", "Simulation"], maxPlayers: 8 }, // The Forest
  1203620: { categories: ["Open World Survival Craft", "Survival", "Crafting", "Base-Building", "Building", "RPG", "Action RPG", "Multiplayer", "Co-op", "Online Co-Op", "Open World"], genres: ["Action", "Adventure", "RPG"], maxPlayers: 16 }, // Enshrouded
  1604030: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Base-Building", "Vampire", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Online PvP", "Action RPG"], genres: ["Action", "Adventure", "RPG"], maxPlayers: 40 }, // V Rising
  648800: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Multiplayer", "Co-op", "Online Co-Op", "Ocean", "Adventure", "Exploration"], genres: ["Adventure", "Indie", "Simulation"], maxPlayers: 8 }, // Raft
  962130: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Building", "Base-Building", "Multiplayer", "Co-op", "Online Co-Op", "Action", "Adventure"], genres: ["Action", "Adventure"], maxPlayers: 4 }, // Grounded
  1623730: { categories: ["Open World Survival Craft", "Crafting", "Survival", "Creature Collector", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Open World", "Shooter"], genres: ["Action", "Adventure", "RPG"], maxPlayers: 32 }, // Palworld
  346110: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Dinosaurs", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Online PvP", "Open World"], genres: ["Action", "Adventure", "MMO", "RPG"], maxPlayers: 70 }, // ARK: Survival Evolved
  2399830: { categories: ["Survival", "Open World Survival Craft", "Crafting", "Dinosaurs", "Building", "Multiplayer", "Co-op", "Online Co-Op", "PvP", "Online PvP"], genres: ["Action", "Adventure", "RPG"], maxPlayers: 70 }, // ARK: Survival Ascended
  526870: { categories: ["Automation", "Building", "Crafting", "Base-Building", "Open World", "Multiplayer", "Co-op", "Online Co-Op", "First-Person", "Sci-Fi"], genres: ["Simulation", "Strategy"], maxPlayers: 8 }, // Satisfactory
  427520: { categories: ["Automation", "Base-Building", "Crafting", "Building", "Resource Management", "Multiplayer", "Co-op", "Online Co-Op", "Strategy", "Sci-Fi"], genres: ["Indie", "Simulation", "Strategy"], maxPlayers: 64 }, // Factorio
  294100: { categories: ["Colony Sim", "Survival", "Base-Building", "Strategy", "Crafting", "Building", "Sandbox", "Story Rich", "Management"], genres: ["Indie", "Simulation", "Strategy"], maxPlayers: 1 }, // RimWorld
  387990: { categories: ["Survival", "Crafting", "Open World", "Underwater", "Building", "Exploration", "Sci-Fi", "Singleplayer", "Atmospheric"], genres: ["Adventure", "Indie"], maxPlayers: 1 }, // Subnautica

  // Popular Action & Co-op Hits
  553850: { categories: ["Online Co-Op", "PvE", "Third-Person Shooter", "Multiplayer", "Action", "Shooter", "Co-op", "Sci-Fi", "Extraction Shooter", "Comedy", "Space"], genres: ["Action"], maxPlayers: 4 }, // Helldivers 2
  1086940: { categories: ["RPG", "Turn-Based Combat", "Choices Matter", "Character Customization", "Story Rich", "Multiplayer", "Co-op", "Online Co-Op", "Fantasy", "Singleplayer"], genres: ["RPG", "Strategy"], maxPlayers: 4 }, // Baldur's Gate 3
  1966720: { categories: ["Online Co-Op", "Horror", "Multiplayer", "Co-op", "Survival Horror", "Proximity Chat", "Sci-Fi", "First-Person", "Comedy", "Indie"], genres: ["Action", "Indie"], maxPlayers: 4 }, // Lethal Company
  548430: { categories: ["Online Co-Op", "PvE", "FPS", "Mining", "Multiplayer", "Co-op", "Shooter", "Sci-Fi", "Procedural Generation", "Space", "Dwarf"], genres: ["Action"], maxPlayers: 4 }, // Deep Rock Galactic
  739630: { categories: ["Horror", "Online Co-Op", "VR", "Investigation", "Multiplayer", "Co-op", "Supernatural", "First-Person", "Survival"], genres: ["Indie"], maxPlayers: 4 }, // Phasmophobia
  632360: { categories: ["Roguelike", "Third-Person Shooter", "Online Co-Op", "Action Roguelike", "Multiplayer", "Co-op", "Action", "Sci-Fi", "Indie"], genres: ["Action", "Indie"], maxPlayers: 4 }, // Risk of Rain 2
  620: { categories: ["Puzzle", "Co-op", "Online Co-Op", "Sci-Fi", "Singleplayer", "Comedy", "First-Person", "Multiplayer"], genres: ["Action", "Adventure"], maxPlayers: 2 }, // Portal 2
  286160: { categories: ["Tabletop", "Board Game", "Sandbox", "Multiplayer", "Moddable", "Physics", "Co-op", "Online Co-Op", "Strategy", "Card Game"], genres: ["Indie", "Simulation", "Strategy"], maxPlayers: 10 }, // Tabletop Simulator
  218620: { categories: ["Heist", "FPS", "Online Co-Op", "Action", "Shooter", "Multiplayer", "Co-op", "Crime", "Stealth"], genres: ["Action", "RPG"], maxPlayers: 4 }, // PAYDAY 2
  945360: { categories: ["Social Deduction", "Multiplayer", "Online Co-Op", "Party Game", "PvP", "Casual", "Sci-Fi", "Survival"], genres: ["Casual", "Indie"], maxPlayers: 15 }, // Among Us
  1172620: { categories: ["Pirates", "Open World", "Multiplayer", "Adventure", "PvP", "Online PvP", "Co-op", "Online Co-Op", "Action"], genres: ["Action", "Adventure"], maxPlayers: 4 }, // Sea of Thieves
  550: { categories: ["Zombies", "Online Co-Op", "FPS", "Action", "Shooter", "Multiplayer", "Co-op", "PvP", "Survival"], genres: ["Action"], maxPlayers: 4 }, // Left 4 Dead 2
  582010: { categories: ["Action RPG", "Hunting", "Co-op", "Online Co-Op", "Action", "RPG", "Multiplayer", "Open World", "Third Person"], genres: ["Action"], maxPlayers: 4 }, // Monster Hunter: World
  1446780: { categories: ["Action RPG", "Hunting", "Co-op", "Online Co-Op", "Action", "RPG", "Multiplayer"], genres: ["Action"], maxPlayers: 4 }, // Monster Hunter Rise
  381210: { categories: ["Horror", "Survival Horror", "Multiplayer", "Online PvP", "PvP", "Asymmetrical VR", "Co-op", "Survival"], genres: ["Action"], maxPlayers: 5 }, // Dead by Daylight
  1225330: { categories: ["Horror", "Online Co-Op", "Multiplayer", "Co-op", "Comedy", "First-Person", "Found Footage"], genres: ["Action", "Indie"], maxPlayers: 4 }, // Content Warning

  // Additional Popular Co-op, Squad & Party Games
  443430: { categories: ["Co-op", "Online Co-Op", "Local Co-Op", "Party Game", "Multiplayer", "Cooking", "Casual"], genres: ["Action", "Casual", "Indie"], maxPlayers: 4 }, // Overcooked! 2
  448510: { categories: ["Co-op", "Local Co-Op", "Party Game", "Multiplayer", "Cooking", "Casual"], genres: ["Action", "Casual", "Indie"], maxPlayers: 4 }, // Overcooked!
  1361210: { categories: ["Online Co-Op", "FPS", "Action", "Co-op", "Multiplayer", "Warhammer 40k", "PvE"], genres: ["Action"], maxPlayers: 4 }, // Warhammer 40,000: Darktide
  552500: { categories: ["Online Co-Op", "Action", "Co-op", "Multiplayer", "First-Person", "Dark Fantasy", "PvE"], genres: ["Action", "Indie"], maxPlayers: 4 }, // Warhammer: Vermintide 2
  49520: { categories: ["Online Co-Op", "FPS", "Action", "Co-op", "Multiplayer", "Loot", "Shooter", "RPG"], genres: ["Action", "RPG"], maxPlayers: 4 }, // Borderlands 2
  397540: { categories: ["Online Co-Op", "FPS", "Action", "Co-op", "Multiplayer", "Loot", "Shooter", "RPG"], genres: ["Action", "RPG"], maxPlayers: 4 }, // Borderlands 3
  582500: { categories: ["Co-op", "Online Co-Op", "Puzzle", "First-Person", "Adventure", "2 Player"], genres: ["Adventure", "Casual", "Indie"], maxPlayers: 2 }, // We Were Here
  865360: { categories: ["Co-op", "Online Co-Op", "Puzzle", "First-Person", "Adventure", "2 Player"], genres: ["Adventure", "Casual", "Indie"], maxPlayers: 2 }, // We Were Here Together
  1607680: { categories: ["Co-op", "Online Co-Op", "Local Co-Op", "Platformer", "2 Player", "Difficult"], genres: ["Action", "Adventure", "Indie"], maxPlayers: 2 }, // Bread & Fred
  1335790: { categories: ["Co-op", "Online Co-Op", "Puzzle", "Spy", "2 Player"], genres: ["Action", "Adventure", "Casual", "Indie"], maxPlayers: 2 }, // Operation: Tango
  880940: { categories: ["Party Game", "Multiplayer", "Online Co-Op", "PvP", "Online PvP", "Casual", "Mini-games"], genres: ["Action", "Casual", "Indie"], maxPlayers: 8 }, // Pummel Party
  1260320: { categories: ["Party Game", "Multiplayer", "Physics", "Funny", "PvP", "Online PvP", "Cute"], genres: ["Action", "Casual", "Indie"], maxPlayers: 8 }, // Party Animals
  285900: { categories: ["Party Game", "Multiplayer", "Physics", "Funny", "PvP", "Online PvP", "Local Multiplayer"], genres: ["Action", "Adventure", "Casual", "Indie"], maxPlayers: 8 }, // Gang Beasts
  477160: { categories: ["Puzzle", "Physics", "Multiplayer", "Co-op", "Online Co-Op", "Funny", "Platformer"], genres: ["Adventure", "Indie", "Simulation"], maxPlayers: 8 }, // Human: Fall Flat
  312530: { categories: ["Party Game", "Multiplayer", "Action", "PvP", "2D", "Local Multiplayer", "Pixel Graphics"], genres: ["Action", "Indie"], maxPlayers: 8 }, // Duck Game
  431240: { categories: ["Multiplayer", "Casual", "Mini Golf", "Sports", "Physics", "Party Game", "PvP"], genres: ["Casual", "Indie", "Sports"], maxPlayers: 12 }, // Golf With Your Friends
  602960: { categories: ["Survival", "Online Co-Op", "Multiplayer", "Submarine", "Sci-Fi", "Horror", "Co-op"], genres: ["Action", "Indie", "Simulation", "Strategy"], maxPlayers: 16 }, // Barotrauma
  108600: { categories: ["Survival", "Zombies", "Multiplayer", "Open World", "Crafting", "Sandbox", "RPG"], genres: ["Indie", "RPG", "Simulation"], maxPlayers: 32 }, // Project Zomboid
  1621690: { categories: ["Survival", "Crafting", "Open World Survival Craft", "Co-op", "Online Co-Op", "Mining", "Sandbox"], genres: ["Adventure", "Indie", "RPG"], maxPlayers: 8 }, // Core Keeper
  815370: { categories: ["Survival", "Open World", "Crafting", "Co-op", "Online Co-Op", "First-Person", "Simulation"], genres: ["Adventure", "Indie", "Simulation"], maxPlayers: 4 }, // Green Hell
  361420: { categories: ["Space", "Open World", "Crafting", "Multiplayer", "Co-op", "Online Co-Op", "Sandbox", "Exploration"], genres: ["Adventure", "Indie"], maxPlayers: 4 }, // Astroneer
  239140: { categories: ["Zombies", "Survival", "Parkour", "Open World", "FPS", "Co-op", "Online Co-Op", "Action"], genres: ["Action", "RPG"], maxPlayers: 4 }, // Dying Light
  534380: { categories: ["Zombies", "Open World", "Parkour", "Co-op", "Online Co-Op", "Action", "RPG"], genres: ["Action", "RPG"], maxPlayers: 4 }, // Dying Light 2
  617290: { categories: ["Third-Person Shooter", "Action", "Souls-like", "Co-op", "Online Co-Op", "Multiplayer", "RPG"], genres: ["Action", "Adventure", "RPG"], maxPlayers: 3 }, // Remnant: From the Ashes
  1282100: { categories: ["Third-Person Shooter", "Action", "Souls-like", "Co-op", "Online Co-Op", "Multiplayer", "RPG"], genres: ["Action", "RPG"], maxPlayers: 3 }, // Remnant II
  680420: { categories: ["Third-Person Shooter", "RPG", "Co-op", "Online Co-Op", "Action", "Loot", "Sci-Fi"], genres: ["Action", "Adventure", "RPG"], maxPlayers: 3 }, // Outriders
  1549970: { categories: ["Third-Person Shooter", "Action", "Co-op", "Online Co-Op", "Sci-Fi", "Shooter", "Aliens"], genres: ["Action"], maxPlayers: 3 }, // Aliens: Fireteam Elite
  493520: { categories: ["Horror", "FPS", "Tactical", "Online Co-Op", "Co-op", "Multiplayer", "Stealth", "Difficult"], genres: ["Action"], maxPlayers: 4 }, // GTFO
  204360: { categories: ["Co-op", "Local Co-Op", "Online Co-Op", "Multiplayer", "Beat 'em up", "Action", "Funny", "2D"], genres: ["Action", "Adventure", "Casual", "Indie", "RPG"], maxPlayers: 4 }, // Castle Crashers
  238460: { categories: ["Platformer", "Co-op", "Multiplayer", "Funny", "Local Co-Op", "Online Co-Op", "2D"], genres: ["Action", "Adventure", "Casual", "Indie"], maxPlayers: 4 }, // BattleBlock Theater
  1454370: { categories: ["Co-op", "Online Co-Op", "Puzzle", "Multiplayer", "Casual", "Funny", "2D"], genres: ["Action", "Casual", "Indie"], maxPlayers: 8 }, // Pico Park
  1097150: { categories: ["Battle Royale", "Multiplayer", "Party Game", "Platformer", "Funny", "PvP", "Online PvP"], genres: ["Action", "Casual", "Indie"], maxPlayers: 4 }, // Fall Guys
  1217060: { categories: ["FPS", "Roguelite", "Action Roguelike", "Online Co-Op", "Co-op", "Shooter", "Multiplayer"], genres: ["Action", "Adventure", "Indie", "RPG"], maxPlayers: 4 }, // Gunfire Reborn
  1337520: { categories: ["Roguelike", "Action Roguelike", "Platformer", "Online Co-Op", "Co-op", "Multiplayer", "2D"], genres: ["Action", "Indie"], maxPlayers: 4 }, // Risk of Rain Returns

  // Competitive PvP & Shooters
  730: { categories: ["FPS", "Shooter", "Multiplayer", "Competitive", "Action", "Team-Based", "e-sports", "Tactical", "PvP", "Online PvP"], genres: ["Action", "Free to Play"], maxPlayers: 10 }, // CS2
  570: { categories: ["MOBA", "Multiplayer", "Strategy", "PvP", "Online PvP", "Competitive", "e-sports", "Team-Based", "Action"], genres: ["Action", "Strategy", "Free to Play"], maxPlayers: 10 }, // Dota 2
  440: { categories: ["FPS", "Hero Shooter", "Multiplayer", "Shooter", "Action", "Comedy", "Competitive", "Class-Based", "PvP", "Online PvP"], genres: ["Action", "Free to Play"], maxPlayers: 32 }, // TF2
  1172470: { categories: ["Battle Royale", "FPS", "Shooter", "Multiplayer", "Hero Shooter", "First-Person", "Action", "PvP", "Online PvP"], genres: ["Action", "Free to Play"], maxPlayers: 60 }, // Apex Legends
  578080: { categories: ["Survival", "Shooter", "Battle Royale", "Multiplayer", "FPS", "PvP", "Online PvP", "Third-Person Shooter", "Tactical"], genres: ["Action", "Adventure", "Free to Play"], maxPlayers: 100 }, // PUBG
  359550: { categories: ["FPS", "Tactical", "Shooter", "Multiplayer", "Competitive", "Action", "PvP", "Online PvP", "Team-Based"], genres: ["Action"], maxPlayers: 10 }, // Rainbow Six Siege
  230410: { categories: ["Free to Play", "Action RPG", "Third-Person Shooter", "Online Co-Op", "Multiplayer", "Co-op", "Sci-Fi", "Ninja"], genres: ["Action", "Free to Play", "RPG"], maxPlayers: 4 }, // Warframe
  1085660: { categories: ["FPS", "Open World", "MMO", "Shooter", "Multiplayer", "Online Co-Op", "PvP", "PvE", "Sci-Fi", "Action RPG"], genres: ["Action", "Free to Play", "Adventure"], maxPlayers: 6 }, // Destiny 2
  271590: { categories: ["Open World", "Action", "Multiplayer", "Crime", "Third Person", "First-Person", "Shooter", "Online PvP", "Co-op"], genres: ["Action", "Adventure"], maxPlayers: 30 }, // GTA V
  1174180: { categories: ["Open World", "Story Rich", "Western", "Adventure", "Multiplayer", "Third Person", "Action", "Singleplayer"], genres: ["Action", "Adventure"], maxPlayers: 32 }, // Red Dead Redemption 2
  2073850: { categories: ["FPS", "Shooter", "Action", "Multiplayer", "Destruction", "Fast-Paced", "Competitive", "PvP", "Online PvP"], genres: ["Action", "Free to Play"], maxPlayers: 12 }, // THE FINALS
  1245620: { categories: ["Souls-like", "Dark Fantasy", "Open World", "RPG", "Difficult", "Third Person", "Action RPG", "Multiplayer", "PvP", "Co-op"], genres: ["Action", "RPG"], maxPlayers: 4 }, // ELDEN RING
  238960: { categories: ["Action RPG", "Hack and Slash", "Dark Fantasy", "Free to Play", "Multiplayer", "Co-op", "PvP", "RPG"], genres: ["Action", "Free to Play", "RPG"], maxPlayers: 6 }, // Path of Exile
  2694490: { categories: ["Action RPG", "Hack and Slash", "Dark Fantasy", "Multiplayer", "Co-op", "PvP", "RPG", "Online Co-Op"], genres: ["Action", "Adventure", "RPG"], maxPlayers: 6 }, // Path of Exile 2
  4000: { categories: ["Sandbox", "Moddable", "Multiplayer", "Physics", "Funny", "Comedy", "First-Person", "Shooter", "Singleplayer"], genres: ["Indie", "Simulation"], maxPlayers: 32 }, // Garry's Mod
  1426210: { categories: ["Co-op", "Online Co-Op", "Local Co-Op", "Puzzle", "Action", "Adventure", "Platformer", "2 Player", "Split Screen"], genres: ["Action", "Adventure"], maxPlayers: 2 }, // It Takes Two
  848450: { categories: ["Co-op", "Online Co-Op", "Local Co-Op", "Action", "Adventure", "Story Rich", "Split Screen"], genres: ["Action", "Adventure"], maxPlayers: 2 }, // A Way Out

  // RPGs & Action RPGs
  1091500: { categories: ["RPG", "Cyberpunk", "Open World", "Singleplayer", "Story Rich", "First-Person", "Sci-Fi", "Action RPG"], genres: ["RPG", "Action"], maxPlayers: 1 }, // Cyberpunk 2077
  292030: { categories: ["RPG", "Open World", "Story Rich", "Atmospheric", "Fantasy", "Singleplayer", "Third Person"], genres: ["RPG", "Adventure"], maxPlayers: 1 }, // The Witcher 3
  489830: { categories: ["RPG", "Open World", "Fantasy", "Singleplayer", "Moddable", "Atmospheric", "Action RPG"], genres: ["RPG"], maxPlayers: 1 }, // Skyrim Special Edition
  377160: { categories: ["RPG", "Open World", "Post-apocalyptic", "Singleplayer", "Shooter", "Sci-Fi", "Action RPG"], genres: ["RPG"], maxPlayers: 1 }, // Fallout 4
  2344520: { categories: ["Action RPG", "Hack and Slash", "Dark Fantasy", "Multiplayer", "Co-op", "Online Co-Op", "PvP"], genres: ["Action", "RPG"], maxPlayers: 4 }, // Diablo IV
  1716740: { categories: ["RPG", "Space", "Open World", "Sci-Fi", "Singleplayer", "Exploration", "Action RPG"], genres: ["RPG", "Action"], maxPlayers: 1 }, // Starfield
  1145360: { categories: ["Roguelike", "Action Roguelike", "Hack and Slash", "Indie", "Mythology", "Singleplayer", "Story Rich"], genres: ["Action", "Indie", "RPG"], maxPlayers: 1 }, // Hades
  1145350: { categories: ["Roguelike", "Action Roguelike", "Hack and Slash", "Indie", "Mythology", "Singleplayer"], genres: ["Action", "Indie", "RPG"], maxPlayers: 1 }, // Hades II
  1687950: { categories: ["JRPG", "Story Rich", "Turn-Based Combat", "Singleplayer", "Anime", "Soundtrack"], genres: ["RPG"], maxPlayers: 1 }, // Persona 5 Royal
  1462040: { categories: ["RPG", "Action RPG", "Story Rich", "Singleplayer", "Third Person"], genres: ["RPG", "Action"], maxPlayers: 1 }, // Final Fantasy VII Remake
  367520: { categories: ["Metroidvania", "Souls-like", "Difficult", "Platformer", "2D", "Indie", "Singleplayer", "Dark Fantasy"], genres: ["Action", "Adventure", "Indie"], maxPlayers: 1 }, // Hollow Knight

  // Strategy, Automation & City Builders
  289070: { categories: ["Strategy", "Turn-Based Strategy", "Historical", "4X", "Multiplayer", "Singleplayer", "Tactical"], genres: ["Strategy"], maxPlayers: 12 }, // Civilization VI
  8930: { categories: ["Strategy", "Turn-Based Strategy", "Historical", "4X", "Multiplayer", "Singleplayer"], genres: ["Strategy"], maxPlayers: 12 }, // Civilization V
  281990: { categories: ["Space", "Strategy", "4X", "Sci-Fi", "Grand Strategy", "Multiplayer", "Singleplayer"], genres: ["Strategy", "Simulation"], maxPlayers: 32 }, // Stellaris
  394360: { categories: ["Strategy", "Grand Strategy", "Historical", "Military", "World War II", "Multiplayer", "Singleplayer"], genres: ["Strategy", "Simulation"], maxPlayers: 32 }, // Hearts of Iron IV
  236850: { categories: ["Grand Strategy", "Strategy", "Historical", "Multiplayer", "Singleplayer"], genres: ["Strategy", "Simulation"], maxPlayers: 32 }, // Europa Universalis IV
  1158310: { categories: ["RPG", "Grand Strategy", "Medieval", "Historical", "Strategy", "Multiplayer", "Simulation"], genres: ["RPG", "Strategy", "Simulation"], maxPlayers: 32 }, // Crusader Kings III
  1142710: { categories: ["Strategy", "Grand Strategy", "Turn-Based Strategy", "Dark Fantasy", "Warhammer 40k", "Multiplayer"], genres: ["Strategy", "Action"], maxPlayers: 8 }, // Total War: WARHAMMER III
  255710: { categories: ["City Builder", "Simulation", "Building", "Management", "Strategy", "Sandbox", "Singleplayer"], genres: ["Simulation", "Strategy"], maxPlayers: 1 }, // Cities: Skylines
  949230: { categories: ["City Builder", "Simulation", "Building", "Management", "Strategy", "Sandbox"], genres: ["Simulation", "Strategy"], maxPlayers: 1 }, // Cities: Skylines II
  646570: { categories: ["Roguelike Deckbuilder", "Card Battler", "Turn-Based Combat", "Strategy", "Indie", "Singleplayer"], genres: ["Strategy", "Indie"], maxPlayers: 1 }, // Slay the Spire
  2379780: { categories: ["Roguelike Deckbuilder", "Card Game", "Poker", "Strategy", "Casual", "Indie", "Singleplayer"], genres: ["Casual", "Indie", "Strategy"], maxPlayers: 1 }, // Balatro
  1794680: { categories: ["Action Roguelike", "Pixel Graphics", "Bullet Hell", "Casual", "Indie", "Singleplayer"], genres: ["Action", "Casual", "Indie"], maxPlayers: 4 }, // Vampire Survivors

  // Simulation, Sports & Racing
  252950: { categories: ["Multiplayer", "Soccer", "Sports", "Competitive", "PvP", "Online PvP", "Co-op", "Fast-Paced"], genres: ["Action", "Sports", "Racing"], maxPlayers: 8 }, // Rocket League
  1222670: { categories: ["Life Sim", "Character Customization", "Building", "Casual", "Simulation", "Singleplayer"], genres: ["Simulation", "Free to Play"], maxPlayers: 1 }, // The Sims 4
  227300: { categories: ["Driving", "Simulation", "Automobile Sim", "Open World", "Multiplayer", "Singleplayer"], genres: ["Indie", "Simulation"], maxPlayers: 8 }, // Euro Truck Simulator 2
  270880: { categories: ["Driving", "Simulation", "Automobile Sim", "Open World", "Multiplayer", "Singleplayer"], genres: ["Indie", "Simulation"], maxPlayers: 8 }, // American Truck Simulator
  1248130: { categories: ["Farming Sim", "Simulation", "Agriculture", "Multiplayer", "Co-op", "Singleplayer"], genres: ["Simulation"], maxPlayers: 16 }, // Farming Simulator 22
  1551360: { categories: ["Racing", "Open World", "Driving", "Multiplayer", "Automobile Sim", "Singleplayer", "PvP"], genres: ["Racing", "Action", "Adventure"], maxPlayers: 12 }, // Forza Horizon 5
  1293830: { categories: ["Racing", "Open World", "Driving", "Multiplayer", "Automobile Sim", "Singleplayer", "PvP"], genres: ["Racing", "Action"], maxPlayers: 12 }, // Forza Horizon 4
  2252570: { categories: ["Sports", "Management", "Football", "Soccer", "Simulation", "Strategy"], genres: ["Simulation", "Sports", "Strategy"], maxPlayers: 1 }, // Football Manager 2024
  2195250: { categories: ["Soccer", "Sports", "Football", "Multiplayer", "PvP", "Online PvP", "Controller"], genres: ["Sports"], maxPlayers: 4 }, // EA SPORTS FC 24
  2050650: { categories: ["Survival Horror", "Zombies", "Action", "Shooter", "Third-Person Shooter", "Singleplayer"], genres: ["Action", "Adventure"], maxPlayers: 1 }, // Resident Evil 4 Remake
};

export function calculateLibraryIntersections(
  players: PlayerData[],
  activePlayerIds: string[],
  thresholdMin: number = 2,
  tagOverrides?: Record<number, { categories: string[]; genres: string[]; maxPlayers?: number }>
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

    // Player capacity and multiplayer detection logic
    let maxPlayers: number | undefined = curatedTags?.maxPlayers ?? dynamicTags?.maxPlayers;
    let minPlayers = 1;

    const allTagsArr = Array.from(tagSet);
    const hasSingleplayer = allTagsArr.some((t) => /single[- ]?player/i.test(t));
    const hasCoop = allTagsArr.some((t) => /co[- ]?op/i.test(t));
    const hasPvp = allTagsArr.some((t) => /pvp|versus|competitive/i.test(t));
    const hasMultiplayerTag = allTagsArr.some((t) => /multi[- ]?player|mmo|party game|battle royale|team[- ]?based/i.test(t));
    const isMultiplayerCategory = hasCoop || hasPvp || hasMultiplayerTag;

    if (maxPlayers === undefined) {
      if (allTagsArr.some((t) => /massively multiplayer|mmo|mmorpg/i.test(t))) {
        maxPlayers = 32;
      } else if (allTagsArr.some((t) => /battle royale/i.test(t))) {
        maxPlayers = 60;
      } else if (allTagsArr.some((t) => /4 player|party game/i.test(t))) {
        maxPlayers = 4;
      } else if (
        allTagsArr.some((t) => /2 player/i.test(t)) ||
        nameLower.includes('it takes two') ||
        nameLower.includes('a way out') ||
        nameLower.includes('we were here') ||
        nameLower.includes('bread & fred') ||
        nameLower.includes('operation: tango') ||
        nameLower.includes('biped')
      ) {
        maxPlayers = 2;
        minPlayers = 2;
      } else if (isMultiplayerCategory) {
        maxPlayers = 4;
      } else if (hasSingleplayer) {
        maxPlayers = 1;
      } else {
        maxPlayers = 4;
      }
    }

    const isMultiplayer = maxPlayers > 1;

    let playerSupportLabel = 'Singleplayer';
    if (isMultiplayer) {
      if (maxPlayers === 2) {
        playerSupportLabel = '2 Players (Duo)';
      } else if (maxPlayers === 3) {
        playerSupportLabel = '3 Players';
      } else if (maxPlayers === 4) {
        playerSupportLabel = 'Up to 4 Players';
      } else if (maxPlayers > 4 && maxPlayers <= 8) {
        playerSupportLabel = `Up to ${maxPlayers} Players`;
      } else if (maxPlayers > 8 && maxPlayers <= 16) {
        playerSupportLabel = `${maxPlayers}+ Players`;
      } else {
        playerSupportLabel = 'Massive Multiplayer';
      }
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
      maxPlayers,
      minPlayers,
      isMultiplayer,
      playerSupportLabel,
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
