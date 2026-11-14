# InHome.ma 🏠

> A mobile marketplace that connects Moroccan households with nearby home-service professionals — plumbers, electricians, painters, handymen and more — in a few taps. Think **inDrive, but for home services**: the client proposes a price, nearby workers respond, the client picks the best offer.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey)
![Expo](https://img.shields.io/badge/Expo-React%20Native-000020?logo=expo)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-orange)

---

## Table of contents

1. [The problem](#the-problem)
2. [Features](#features)
3. [Tech stack](#tech-stack)
4. [Project structure](#project-structure)
5. [Getting started](#getting-started)
6. [Environment variables](#environment-variables)
7. [App flow](#app-flow)
8. [Design system](#design-system)
9. [API overview](#api-overview)
10. [Roadmap](#roadmap)
11. [Author](#author)

---

## The problem

In Morocco, finding a trustworthy craftsman for a quick home repair still relies on word of mouth, phone calls and haggling with no guarantees. Workers, on the other side, lose time and money looking for clients.

**InHome.ma** fixes both sides:

- **Clients** describe the job, see providers around them on a map, propose their own price and get matched with the closest available worker.
- **Workers** receive nearby job requests, accept or counter-offer, and build a reputation through ratings.

## Features

### Client app

- Onboarding, location permission and dark-themed map home screen
- Service search with filterable suggestions and category pills
- Provider details in a draggable bottom sheet
- **Price proposal** screen with custom numeric keypad (MAD)
- Live "searching" radar animation while nearby workers are being matched
- Confirmation screen with selectable quote tiers
- Side drawer menu (profile, history, settings)

### Worker app *(in progress)*

- Receive and answer nearby job requests
- Accept, decline or counter-offer a price
- Availability toggle, earnings and job history

### Platform

- JWT authentication
- Proximity-based matching of clients and workers
- AI-assisted service matching using embeddings (pgvector)
- French-first interface, Arabic (RTL) ready, prices in MAD

## Tech stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native, Expo, JavaScript (ES Modules, no TypeScript) |
| Navigation | React Navigation (stack + drawer) |
| UI / animation | StyleSheet, Reanimated, Gesture Handler, `@gorhom/bottom-sheet`, `lucide-react-native`, `react-native-svg` |
| Maps & location | `react-native-maps`, `expo-location` |
| Backend | Node.js, Express |
| Database | PostgreSQL + **pgvector**, accessed through **Prisma** |
| AI | Claude API (service understanding) + vector embeddings |
| Tooling | Docker (local database), Google Stitch (UI design) |

## Project structure

```
InHome----APP/
├── inhome-mobile/        # Expo / React Native app (client + worker)
├── inhome-backend/       # Express REST API + Prisma + pgvector
├── walkthrough.md        # Notes on the Stitch → React Native implementation
├── .gitignore
└── README.md
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) LTS (v20 or later recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for the database)
- [Expo Go](https://expo.dev/go) on your phone, or an Android emulator / iOS simulator
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Ahmed-Abdrebbi/InHome----APP.git
cd InHome----APP
```

### 2. Start the database

```bash
docker run -d \
  --name inhome-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=inhome \
  -p 5432:5432 \
  pgvector/pgvector:pg16
```

### 3. Run the backend

```bash
cd inhome-backend
npm install
cp .env.example .env        # then fill in the values (see below)
npx prisma migrate dev --name init
npm run dev
```

The API runs on `http://localhost:3000` by default.

### 4. Run the mobile app

```bash
cd inhome-mobile
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `a` (Android) / `i` (iOS).

> **Tip:** on a physical phone, `localhost` points to the phone itself. Use your computer's local IP (for example `http://192.168.1.20:3000`) as the API base URL in the mobile app.

## Environment variables

Create `inhome-backend/.env`:

```env
# Server
PORT=3000

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/inhome"

# Auth
JWT_SECRET="change-me-to-a-long-random-string"

# AI
ANTHROPIC_API_KEY="your-claude-api-key"
```

Never commit your real `.env`. Keep an `.env.example` with empty values instead.

## App flow

```mermaid
graph TD
    A[Splash Screen] -->|Hydratation & Auto-boot| B{Onboarding vu ?}
    B -->|Non| C[Onboarding : Welcome & Location]
    C -->|Terminé| D{Authentifié ?}
    B -->|Oui| D
    D -->|Non| E[AuthStack : Login / Register]
    D -->|Oui| F{Mode Actif ?}
    
    subgraph ClientFlow [Mode Client]
        F -->|Client| G[Map Home]
        G -->|Menu| H[Drawer Menu / Profil]
        G -->|Recherche / IA| I[Search Service + AI Match]
        I --> J[Provider Details]
        J -->|Proposer Prix| K[Price Proposal MAD]
        K --> L[Confirmation & Tiers]
        L --> M[Searching Radar]
        M -->|Offres reçues| N[Offers List]
        N -->|Accepter offre| O[Job Tracking GPS]
        O -->|Terminé| P[Rating & Avis]
        P --> G
    end

    subgraph WorkerFlow [Mode Prestataire]
        F -->|Prestataire| W1[Worker Home & Demandes Proches]
        W1 --> W2[Détails Demande]
        W2 --> W3[Envoyer Offre / Contre-proposition]
        W3 --> W4[Mission Active & Suivi]
        W1 --> W5[Revenus & Portefeuille]
    end
```

## Design system

Dark Material 3-inspired theme, designed in Google Stitch and exported as tokens in `colors.js`.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent` | `#EB431C` | Primary buttons (tomato) |
| `secondaryContainer` | `#CB2C02` | Button fills, accents |
| `background` | `#131313` | Screen backgrounds |
| `surfaceContainer` | `#1F2020` | Cards, elevated surfaces |
| `onSurface` | `#E4E2E1` | Primary text |
| `outlineVariant` | `#444748` | Borders, dividers |

Brand colors: Tomato `#EB431C`, Black Chocolate `#3A1202`, Kobe gradient `#8D2A13`.

## API overview

> Adjust this table to match your real routes.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create an account (client or worker) | No |
| POST | `/api/auth/login` | Log in and receive a JWT | No |
| GET | `/api/providers/nearby` | Workers around a position | Yes |
| POST | `/api/bookings` | Create a booking request with a proposed price | Yes |
| PATCH | `/api/bookings/:id` | Accept, counter-offer or cancel | Yes |
| POST | `/api/ai/match` | Match a free-text request to a service category | Yes |

## Roadmap

- [x] Design tokens and reusable UI components
- [x] 3-Layer feature-first architecture (`app/`, `core/`, `shared/`, `features/`)
- [x] Onboarding, map home and booking flow screens (client)
- [x] Complete state management with Zustand 5 + persistent hydration
- [x] Realistic mock engine (`mockDb.js`) with timed worker offers and AI semantic matching
- [x] Authentication screens (login / register) & session storage
- [x] Worker mode screens (nearby requests, send offer, active job, earnings, profile)
- [x] End-to-end client tracking, chat, and rating screens
- [ ] Backend implementation: Express controllers, Prisma migrations, PostgreSQL + pgvector
- [ ] Connect mobile app to live backend (`EXPO_PUBLIC_USE_MOCKS=false`)
- [ ] WebSocket real-time gateway for instant offer alerts
- [ ] Push notifications (Expo Notifications)
- [ ] Arabic translation and RTL layout
- [ ] Production deployment & App Store / Play Store release

## Author

**Ahmed** — developer & entrepreneur based in Morocco.
GitHub: [@Ahmed-Abdrebbi](https://github.com/Ahmed-Abdrebbi)

---

Made in Morocco 🇲🇦
