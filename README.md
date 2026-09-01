# SteamSync

Compare Steam game libraries across friends to find shared games, overlaps, and missing titles.

---

## Features

- **Multi-Player Comparison**: Compare 2+ Steam libraries at once using SteamID64, vanity usernames, or profile links.
- **Intersection Engine**:
  - **All Own ($N/N$)**: Games owned by everyone in the group.
  - **Missing 1 ($(N-1)/N$)**: Games only 1 person needs to buy.
  - **Custom Threshold ($\ge M$)**: Games owned by at least $M$ players.
  - **Subsets**: Exact breakdown of combination groups.
- **Views**:
  - **Card Grid**: High-res capsule artwork, match badges, and Steam launch shortcuts.
  - **Matrix Table**: High-density comparative spreadsheet with clickable column sorting.
- **Tag & Genre Search**: Search and filter by Steam Community tags (e.g. *Co-op*, *Survival Crafting*, *Open World*, *Roguelike*, *PvP*).
- **Shareable Links**: Synchronized URL state (`?users=id1,id2,id3`) for 1-click sharing.
- **Privacy Detection**: In-app guidance for players with private game details.

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Suspence00/SteamFriendSync.git
cd SteamFriendSync

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your STEAM_API_KEY from https://steamcommunity.com/dev/apikey to .env.local

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## License

[MIT](LICENSE)
