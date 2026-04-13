# Zoe's ATA Dojo

**A 1v1 arcade fighting game starring Zoe, an 11-year-old black belt from Karate Atlanta Brookwood in Cumming, Georgia.** Killer Instinct-inspired combo breaker system meets authentic ATA Songahm Taekwondo. Built with Phaser 3, TypeScript, and Vite. Free to play in any browser. Coming to iOS.

[![Play Now](https://img.shields.io/badge/Play%20Now-Live%20Demo-E94560?style=for-the-badge&logo=googlechrome&logoColor=white)](https://chiragmirani.github.io/zoes-ata-dojo/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](#tech-stack)
[![Phaser 3](https://img.shields.io/badge/Phaser%203-0F3460?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgMTJsMTAgMTAgMTAtMTBMMTIgMnoiLz48L3N2Zz4=)](#tech-stack)

<!-- Social preview: 1200x630 OG image for link sharing -->
<!-- Screenshot/GIF will go here once gameplay is ready -->

---

## What Is Zoe's ATA Dojo?

Zoe's ATA Dojo is a free, browser-based 2D fighting game where players control Zoe — an 11-year-old black belt taekwondo practitioner — in 1v1 arcade matches against fighters from dojos around the world. The game features a combo breaker system inspired by Killer Instinct, authentic ATA Songahm Taekwondo techniques, and an art style designed for young players.

**Who is this for?** Kids aged 8-14 who love martial arts, fans of classic arcade fighters, taekwondo students, and anyone who wants a fun, fair fighting game with no pay-to-win mechanics.

### Why This Game Exists

There are zero major fighting games with a young girl of color as the protagonist. There's no mobile fighter built around authentic ATA taekwondo. And most mobile fighting games are ruined by pay-to-win mechanics and energy gates. Zoe's ATA Dojo fixes all three.

---

## Features

- **Killer Instinct-style combo system** — Opener → Auto-Double → Linker → Ender chain with a full combo breaker mechanic. Defenders can break combos by reading the attacker's strength choice.
- **Authentic ATA taekwondo moves** — Ap Chagi, Bandal Chagi, Dollyo Chagi, Dwit Huryeo Chagi, Naeryeo Chagi, Hwechul Chagi, and more. Not generic kicks — real Songahm techniques.
- **8 playable characters** — Fighters representing taekwondo, capoeira, kung fu, muay thai, karate, sambo, jiu-jitsu, and a Grand Master final boss.
- **3-tier control system** — Dynamic (auto-combo, beginner-friendly), Modern (4-button, intermediate), and Classic (full 6-button, advanced). Inspired by Street Fighter 6's accessibility model.
- **Belt progression system** — White → Orange → Yellow → Camouflage → Green → Purple → Blue → Brown → Red → Black. Mirrors the real ATA Songahm belt order.
- **Ki Meter with 3 levels** — Enhanced specials, guaranteed combo breakers, and cinematic Ultra Combos unique to each character.
- **6 game modes** — Arcade Mode, Dojo Story Mode, Training Mode, Daily Challenges, Ranked Matches, and Local Versus.
- **Zero pay-to-win** — All gameplay content is earnable through play. Monetization is cosmetic-only.
- **Mobile-first design** — Touch controls built for phones and tablets. 60 FPS target on modern devices.
- **Works everywhere** — Play in any browser. No download required. PWA-ready for home screen install on iOS and Android.

---

## Play Now

### Browser (Live)

**[Play Zoe's ATA Dojo →](https://chiragmirani.github.io/zoes-ata-dojo/)**

Works on Chrome, Safari, Firefox, and Edge. Mobile and desktop.

### Install as App (PWA)

On your phone, open the link above in Safari (iOS) or Chrome (Android), tap "Add to Home Screen," and it installs as a standalone app — no App Store needed.

### iOS App Store

Coming soon. The web version will be wrapped with [Capacitor](https://capacitorjs.com/) for native iOS distribution, and eventually rebuilt as a native Swift app.

---

## Tech Stack

| Component | Technology | Why |
|-----------|-----------|-----|
| Game Engine | [Phaser 3](https://phaser.io/) | Most mature HTML5 2D game framework. Built-in physics, collision, input handling. |
| Language | [TypeScript](https://www.typescriptlang.org/) | Type safety, better IDE support, fewer bugs at scale. |
| Bundler | [Vite](https://vitejs.dev/) | Instant dev server, fast builds, tree-shaking, HMR. |
| Animation | Spine (planned) | 50-80% smaller than sprite sheets. Smooth skeletal animation. |
| Hosting | [GitHub Pages](https://pages.github.com/) | Free, automatic deploys, HTTPS. |
| iOS Wrapper | [Capacitor](https://capacitorjs.com/) (planned) | Modern PWA-to-native bridge. Same codebase for web + iOS. |
| CI/CD | [GitHub Actions](https://github.com/features/actions) | Auto-build and deploy on every push to `main`. |

---

## Getting Started

### For Players

Just **[click here to play](https://chiragmirani.github.io/zoes-ata-dojo/)**. No installation needed.

### For Developers

```bash
# Clone the repo
git clone https://github.com/ChiragMirani/zoes-ata-dojo.git
cd zoes-ata-dojo

# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Requirements:** Node.js 18+ and npm 9+.

---

## Project Structure

```
zoes-ata-dojo/
├── src/
│   ├── main.ts                    # Entry point & Phaser config
│   └── game/
│       ├── scenes/
│       │   ├── BootScene.ts       # Asset preloading
│       │   ├── MenuScene.ts       # Main menu
│       │   ├── BattleScene.ts     # Core fight gameplay
│       │   ├── TrainingScene.ts   # Practice mode
│       │   └── GameOverScene.ts   # Results screen
│       ├── characters/
│       │   ├── Character.ts       # Base fighter class
│       │   ├── Zoe.ts             # Zoe's moveset & stats
│       │   └── opponents/         # AI opponent classes
│       ├── systems/
│       │   ├── ComboSystem.ts     # KI-style combo engine
│       │   ├── HealthSystem.ts    # Health bars & damage
│       │   ├── KiMeter.ts         # Super meter management
│       │   └── ProgressionSystem.ts # Belt ranking & XP
│       ├── input/
│       │   ├── InputManager.ts    # Keyboard + touch input
│       │   └── TouchControls.ts   # Mobile button layout
│       ├── ui/
│       │   ├── HUD.ts             # In-match UI (health, ki, timer)
│       │   └── ComboCounter.ts    # Combo hit display
│       └── config/
│           ├── GameConfig.ts      # Phaser game configuration
│           └── Constants.ts       # Game-wide constants
├── public/
│   ├── assets/                    # Sprites, audio, UI art
│   ├── icons/                     # PWA icons (192, 512px)
│   ├── manifest.json              # PWA manifest
│   └── service-worker.js          # Offline caching
├── .github/
│   └── workflows/
│       └── deploy.yml             # Auto-deploy to GitHub Pages
├── docs/
│   └── GAME_DESIGN_DOCUMENT.md    # Full GDD
├── index.html                     # Entry HTML with SEO/schema
├── vite.config.ts                 # Build configuration
├── tsconfig.json                  # TypeScript configuration
├── LICENSE                        # MIT License
├── CONTRIBUTING.md                # How to contribute
├── SECURITY.md                    # Security policy
└── README.md                      # You are here
```

---

## Game Mechanics

### Combo System (Killer Instinct-Inspired)

Every combo follows a structured chain:

**Opener → Auto-Double → Linker → Auto-Double → Ender**

- **Opener** — A special move that starts the combo (e.g., Zoe's Front Kick)
- **Auto-Double** — Automatic 2-hit follow-up. Light (fast, less damage), Medium (balanced), Heavy (slow, more damage, easier to break)
- **Linker** — A special technique connecting auto-doubles. Each character has 2-3 unique linkers
- **Ender** — Finishing move with bonus effects (extra damage, meter gain, or wall push)

**Combo Breaker:** The defending player can interrupt combos by matching the attacker's auto-double strength. Wrong guess = 3-second lockout. This creates constant mind-games and mirrors real taekwondo's block-and-counter philosophy.

### Taekwondo Move Set

| Move | Korean Name | Type | Description |
|------|-------------|------|-------------|
| Front Kick | Ap Chagi | Light | Fast poke, combo opener |
| Roundhouse Kick | Bandal Chagi | Medium | Core bread-and-butter kick |
| Turning Kick | Dollyo Chagi | Heavy | High damage, slower startup |
| Spinning Back Kick | Dwit Huryeo Chagi | Special | Combo linker, great range |
| Axe Kick | Naeryeo Chagi | Overhead | Hits crouching opponents |
| Tornado Kick | Hwechul Chagi | Super | Multi-rotation Ultra Combo finisher |

### Controls

| Mode | Target | Layout |
|------|--------|--------|
| Dynamic | Beginners (8-10) | 3 buttons + joystick. Auto-combos on repeated taps. |
| Modern | Intermediate (10-13) | 4 buttons (LK, MK, HK, Special). Hold Assist for auto-combo. |
| Classic | Advanced (13+) | Full 6-button layout. Manual combos. Maximum control. |

---

## The Brookwood Legacy

Zoe trains at **Karate Atlanta Brookwood** in Cumming, Georgia — a real ATA (American Taekwondo Association) school with a 5-star reputation and 25+ years of Metro Atlanta martial arts history.

The game honors the school's lineage: Chief Instructor **John-Michael Dietz** (4th Degree Black Belt) and the legacy of **Grand Master Soon Ho Lee** (9th Degree), who led ATA International and its 1,500+ schools across 16 countries.

The Songahm Taekwondo tradition — founded by Grand Master Haeng Ung Lee in 1969 — emphasizes positive mental attitude, high goal-setting, perseverance, and self-control. These values are woven into the game's progression system and story mode.

---

## Roadmap

- [x] Game Design Document complete
- [x] Project scaffolding (Phaser 3 + TypeScript + Vite)
- [x] GitHub Pages deployment pipeline
- [ ] **Phase 1: Prototype** — Basic 1v1 framework with placeholder art, Zoe's core moveset, Dynamic controls
- [ ] **Phase 2: Core Game** — Combo system, combo breakers, Ki Meter, AI opponent, Arcade Mode, Training Mode
- [ ] **Phase 3: Content & Polish** — All 8 characters, 5 arenas, belt progression, customization, sound design
- [ ] **Phase 4: Launch** — iOS App Store via Capacitor, Ranked Mode, Daily Challenges
- [ ] **Phase 5: Multiplayer** — Online 1v1 with rollback netcode
- [ ] **Phase 6: Native Swift** — Full native iOS rebuild for maximum performance

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Areas where we especially need help:**

- Character sprite art and animation (anime-stylized, bold outlines)
- Sound design (kick impacts, announcer voice, music)
- AI opponent behavior and difficulty tuning
- Touch control UX testing on various iOS/Android devices
- Accessibility improvements

---

## FAQ

**Is Zoe's ATA Dojo free to play?**
Yes. The browser version is completely free with no ads. The game will never have pay-to-win mechanics. Future monetization is cosmetic-only (skins, belt flair, dobok colors).

**What is ATA Taekwondo?**
ATA stands for American Taekwondo Association, founded in 1969. ATA schools teach Songahm Taekwondo, a curriculum emphasizing discipline, respect, and self-defense. There are over 1,500 ATA schools in 16+ countries.

**What devices can I play on?**
Any device with a modern web browser — iPhone, iPad, Android phones/tablets, Mac, Windows, Linux, Chromebook. The game is designed mobile-first with touch controls.

**How is this different from other mobile fighting games?**
Three ways: (1) authentic martial arts moves instead of generic attacks, (2) a Killer Instinct-style combo breaker system that keeps both players engaged, and (3) zero pay-to-win — no energy gates, no loot boxes, no stamina timers.

**Will this be on the iOS App Store?**
Yes. After the browser version is polished, we'll wrap it with Capacitor for App Store submission. Long-term plan is a full native Swift rebuild.

**Can I contribute art, code, or music?**
Absolutely. See [CONTRIBUTING.md](CONTRIBUTING.md). We especially need character artists, sound designers, and mobile UX testers.

**Who made this?**
Built by [Chirag Mirani](https://github.com/ChiragMirani) for his daughter Zoe, a real black belt at Karate Atlanta Brookwood in Cumming, Georgia.

---

## License

This project is licensed under the [MIT License](LICENSE).

**Note:** The game code is open source under MIT. Character names, story, and original artwork are the intellectual property of Chirag Mirani. You're free to fork the codebase and build your own fighting game, but please create your own characters and story.

---

## Acknowledgments

- **Zoe** — The real black belt who inspired this entire project
- **Karate Atlanta Brookwood** — Cumming, GA's finest ATA school
- **Chief Instructor John-Michael Dietz** — For building confident martial artists
- **Grand Master Soon Ho Lee** — For leading ATA International and the Songahm tradition
- **Killer Instinct** — For revolutionizing fighting game combo systems
- **Phaser** — For making browser game development accessible to everyone

---

<p align="center">
  <strong>Every kick tells a story.</strong><br>
  Made with ❤️ in Cumming, Georgia
</p>
