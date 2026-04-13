# Contributing to Zoe's ATA Dojo

Thank you for your interest in contributing! This project is a labor of love built for a real 11-year-old black belt, and we welcome help from developers, artists, sound designers, and testers.

## How to Contribute

### Reporting Bugs

Open an [issue](https://github.com/ChiragMirani/zoes-ata-dojo/issues) with:

- A clear title describing the bug
- Steps to reproduce
- What you expected vs. what happened
- Your browser and device (especially important for mobile issues)
- Screenshots or video if possible

### Suggesting Features

Open an issue with the `enhancement` label. Describe:

- What the feature is
- Why it would improve the game
- How it fits with the existing design (see the Game Design Document in `/docs/`)

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run type checking: `npm run type-check`
5. Test in browser: `npm run dev`
6. Test on mobile (if touch-related changes)
7. Commit with clear messages
8. Push and open a Pull Request

### Code Style

- TypeScript strict mode is enabled
- Use meaningful variable names
- Comment complex game logic (especially combo system and AI)
- Follow existing file/folder structure
- Keep files focused — one class per file

## Areas Where We Need Help

### High Priority

- **Character Art** — Anime-stylized sprites with bold outlines for Zoe and opponents
- **Sound Effects** — Kick impacts, combo announcements, UI sounds
- **Music** — Menu theme, battle music, victory jingle
- **Touch Controls** — UX testing and optimization on various iOS/Android devices

### Medium Priority

- **AI Behavior** — More sophisticated opponent AI with difficulty levels
- **Combo System** — Full Killer Instinct-style opener/linker/ender chain
- **Animations** — Spine skeletal animations for characters
- **Accessibility** — Screen reader support, colorblind modes, button remapping

### Nice to Have

- **Additional Characters** — New fighters with unique movesets
- **Arena Backgrounds** — Parallax scrolling dojo/tournament environments
- **Localization** — Korean, Spanish, Portuguese translations
- **Online Multiplayer** — Rollback netcode implementation

## Development Setup

```bash
# Install Node.js 18+
node --version  # Should be 18+

# Clone and install
git clone https://github.com/ChiragMirani/zoes-ata-dojo.git
cd zoes-ata-dojo
npm install

# Development (hot reload)
npm run dev

# Type check
npm run type-check

# Production build
npm run build
```

## Code of Conduct

This is a project built for a child. Please keep all contributions, discussions, and interactions family-friendly, respectful, and inclusive. We have zero tolerance for harassment, discrimination, or inappropriate content.

## Questions?

Open a [discussion](https://github.com/ChiragMirani/zoes-ata-dojo/discussions) or reach out via issues.
