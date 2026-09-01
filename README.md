# 🎮 SteamSync — Shared Library & Overlap Finder

**SteamSync** is a high-performance, full-stack web application designed for gaming groups and squads (2+ players) to instantly compare their Steam game libraries, discover shared games, calculate subset overlaps, and find what to play together.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS** featuring a sleek, minimalist monochromatic black-and-white design.

---

## ✨ Features

- **Dynamic Player Input**:
  - Add players via 64-bit SteamID (`76561198...`), custom vanity usernames (`/id/username`), or direct profile URLs.
  - Live player resolution and batch owned-game querying via the Steam Web API.
- **Set Intersection Engine**:
  - **All Own ($N/N$)**: Games owned by 100% of the active squad.
  - **Missing 1 Player ($(N-1)/N$)**: Identify games that only 1 player needs to buy for a full squad session.
  - **Custom Threshold ($\ge M$)**: Filter games owned by at least $M$ squad members.
  - **Subsets / Combinations**: Exact power-set combination breakdown showing exclusive overlaps.
- **Matrix Spreadsheet & Card Views**:
  - **Cards Grid**: High-res capsule artwork, match badges, direct Steam launch (`steam://run/...`), and store links.
  - **Interactive Table Matrix**: Compact multi-line titles, sticky header, clickable column sorting (by Title, Match ratio, Group Hours, or any individual player's hours).
- **Searchable Tag & Genre Filters**:
  - Search any Steam Community tag or genre (*Survival Crafting*, *Open World*, *Co-op*, *PvP*, *Roguelike*, *FPS*, *Strategy*, etc.).
  - Auto-complete dropdown and multi-tag filtering with stackable badges.
- **Privacy Detection & Guided Resolution**:
  - Gracefully detects private Steam libraries per-user without breaking comparison for the rest of the squad.
  - In-app 3-step privacy setting guide to help friends make their Game Details public.
- **Zero-Config Shareable URLs**:
  - Instant two-way URL synchronization (`?users=id1,id2,id3`) with a 1-click share button.
- **Secure Key Handling**:
  - Server-side API key proxying prevents client-side key leakage and bypasses browser CORS restrictions.
  - In-app API key modal support for client-side override or multi-user setups.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18.17+ (v20+ recommended)
- [pnpm](https://pnpm.io/) (or `npm` / `yarn`)
- A [Steam Web API Key](https://steamcommunity.com/dev/apikey) (Free)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/SteamFriendSync.git
   cd SteamFriendSync
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```
   Add your Steam Web API Key:
   ```env
   STEAM_API_KEY=your_steam_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   pnpm build
   pnpm start
   ```

---

## ☁️ Deployment Guide

### Deploying to Cloudflare Pages (Recommended)

1. **Push your repository to GitHub**.
2. Go to the **[Cloudflare Dashboard](https://dash.cloudflare.com/)** $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
3. Select your GitHub repository.
4. Set the build configuration:
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages` (or `pnpm build`)
   - **Output directory**: `.vercel/output/static` (or `.next`)
5. Add Environment Variables in Cloudflare Pages settings:
   - `STEAM_API_KEY`: `your_steam_api_key`
   - `NODE_VERSION`: `20`
6. Click **Save and Deploy**.
7. Connect your custom domain in the **Custom Domains** tab with 1 click.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

*Disclaimer: SteamSync is an independent open-source tool powered by the Steam® Web API and is not affiliated with or endorsed by Valve Corporation.*
