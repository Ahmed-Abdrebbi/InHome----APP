# InHome Mobile — Architecture & Developer Guide

## 1. Vue d'Ensemble & Vision Produit

**InHome.ma** est une marketplace mobile marocaine (style inDrive) qui connecte les foyers marocains avec des artisans et prestataires qualifiés à proximité (Plomberie, Électricité, Peinture, Climatisation, Menuiserie, Ménage, Déménagement).

### Modèle Métier inDrive
1. **Client** : sélectionne un besoin et une adresse, puis **propose son prix en Dirhams (MAD)**.
2. **Artisans à proximité** : reçoivent la notification instantanée, acceptent ou font une contre-proposition tarifaire (+ délai d'arrivée estimé).
3. **Client** : consulte la liste des offres reçues en direct, compare les profils/notes, et sélectionne la meilleure offre.
4. **Intervention** : suivi du prestataire sur la carte en temps réel, messagerie directe (Chat in-app), paiement en **Cash** à la porte, et notation réciproque.
5. **Mode Prestataire (Artisan)** : bascule possible dans l'app pour consulter les demandes environnantes, envoyer des offres et gérer ses revenus.

---

## 2. Stack Technique Retenue

- **Plateforme** : Expo (SDK 58) / React Native (0.88.1)
- **Langage** : JavaScript pur (ES2022 / JSX) — *Zéro TypeScript, Zéro migration Expo Router imposée*
- **Navigation** : React Navigation 7 (Native Stack + Drawer) avec gestion d'un routeur conditionnel piloté par les stores
- **Gestion d'État** : Zustand 5 avec pattern manuel explicite (`create((set, get) => ({ ... }))`)
- **Stockage Persistant** :
  - `expo-secure-store` pour les données sensibles (JWT token) avec fallback Web/Dev
  - `@react-native-async-storage/async-storage` pour les préférences utilisateur (onboarding vu, langue, mode actif, draft)
- **Cartographie & GPS** : `react-native-maps`, `expo-location`
- **UI & Animations** : Lucide Icons (`lucide-react-native`), `react-native-reanimated`, `@gorhom/bottom-sheet`, `react-native-svg`
- **Réseau & Données** : Axios + couche Mock in-memory réaliste (générateur d'offres temporisées, matching IA sémantique Darija/Français)

---

## 3. Architecture en 3 Couches (Feature-First)

L'application respecte une séparation stricte des responsabilités afin d'éviter le couplage et faciliter le passage des mocks au backend réel :

```
inhome-mobile/
  App.js                         # Point d'entrée : AppProviders + RootNavigator
  docs/
    ARCHITECTURE.md              # Cette documentation
  src/
    app/                         # 1. Couche Application & Navigation
      providers/
        AppProviders.js          # GestureHandler, SafeArea, ThemeProvider, Hydration
      navigation/
        routes.js                # Constantes uniques de TOUTES les routes
        navigationRef.js         # Navigation impérative globale
        RootNavigator.js         # Gated boot (Splash -> Onboarding -> Auth -> Client/Worker)
        OnboardingStack.js       # Stack Onboarding (Welcome, LocationPermission)
        AuthStack.js             # Stack Auth (Login, Register)
        ClientStack.js           # Stack Client (MapHome, Details, Price, Confirmation, Radar, Offers, Tracking, Chat, Rating, etc.)
        WorkerStack.js           # Stack Prestataire (WorkerHome, RequestDetail, SendOffer, ActiveJob, Earnings, Profile)
        linking.js               # Configuration Deep Linking & Notifications

    core/                        # 2. Couche Socle (Agnostique des features)
      config/                    # env.js, constants.js, categories.js, statuses.js
      theme/                     # tokens.js, themes/ (tomato.js, majorelle.js), ThemeProvider.js, useTheme.js
      api/                       # client.js (Axios + JWT), endpoints.js, errors.js, mocks/ (mockDb.js, authMock, etc.)
      storage/                   # secureStorage.js, appStorage.js
      i18n/                      # fr.js, ar.js, index.js (helper t())
      hooks/                     # usePolling.js, useDebounce.js, useCurrentLocation.js, useRequest.js
      utils/                     # formatPrice.js, distance.js (Haversine), validators.js (téléphone marocain 06/07), date.js

    shared/                      # Composants réutilisables transversaux
      components/
        ui/                      # PrimaryButton, ScreenContainer, ScreenHeader, CustomKeypad, BottomSheetContainer
        feedback/                # Loader, ErrorState, EmptyState, Toast
        map/                     # CustomMapView (.native.js, .web.js), ProviderMarker, RadarAnimation
        cards/                   # ProviderInfoCard, ServiceCategoryItem

    features/                    # 3. Couche Métier (Vertical Slices autonomes)
      onboarding/                # SplashScreen, WelcomeScreen, LocationPermissionScreen
      auth/                      # LoginScreen, RegisterScreen | useAuthStore | authApi
      home/                      # MapHomeScreen, SearchServiceScreen, LocationPickerScreen, MenuDrawerScreen | useMapStore, useLocationStore | providersApi
      booking/                   # ProviderDetailsScreen, PriceProposalScreen, ConfirmationScreen, SearchingRadarScreen, OffersListScreen, HistoryScreen | useBookingStore, useOffersStore | bookingsApi, offersApi
      tracking/                  # JobTrackingScreen | useJobStore | jobsApi
      chat/                      # ChatScreen (Client & Prestataire) | useBookingChatStore | messagesApi
      rating/                    # RatingScreen | ratingsApi
      worker/                    # WorkerHomeScreen, WorkerRequestDetailScreen, SendOfferScreen, ActiveJobScreen, WorkerEarningsScreen, WorkerProfileScreen, WorkerOnboardingScreen | useWorkerStore | workersApi
      ai/                        # AIChatAssistantScreen | useAiChatStore | aiApi
      account/                   # ProfileScreen, SavedAddressesScreen, NotificationsScreen, SettingsScreen, HelpScreen | useSettingsStore
      dev/                       # DevMenuScreen (sélecteur de rôle, bascule de thème, reset DB mock)
```

---

## 4. Cycle de Navigation & "Gated Boot"

Le `RootNavigator.js` gère dynamiquement l'affichage selon l'état des stores persistés :

```
[Lancement App.js]
        │
        ▼
[RootNavigator : Hydratation Auth + Settings] ─── (Affiche SplashScreen >= 1.2s)
        │
        ├── !hasSeenOnboarding ? ──► [OnboardingStack] (Welcome -> LocationPermission)
        │                                 │
        │                                 ▼ (Location accordée / sautée)
        │                         setHasSeenOnboarding(true)
        │
        ├── status !== 'authenticated' ? ──► [AuthStack] (LoginScreen <-> RegisterScreen)
        │                                         │
        │                                         ▼ (Connexion réussie)
        │                                 status = 'authenticated'
        │
        └── Authentifié :
                ├── activeMode === 'worker' ? ──► [WorkerStack] (WorkerHome, ActiveJob...)
                └── activeMode === 'client' ? ──► [ClientStack] (MapHome, Booking, Tracking...)
```

### Accès Rapide au Dev Menu
- Un appui long (600ms) sur l'avatar du profil dans le `MenuDrawerScreen` ouvre directement le `DevMenuScreen`.
- Le Dev Menu permet en un clic de :
  1. Basculer entre le mode **Client** et le mode **Prestataire**.
  2. Basculer le thème entre **Tomato Accent** (`#EB431C`) et **Majorelle Blue** (`#1C4DEB`).
  3. Réinitialiser la base de données in-memory (`resetDb()`).

---

## 5. Couche Mocks & Données Réalistes

L'application fonctionne à 100% sans aucun backend lancé grâce à `mockDb.js` :
- **Seed initial** : 8 prestataires marocains géolocalisés à Fquih Ben Salah et Casablanca avec coordonnées GPS, notes, tarifs moyens et avis.
- **Cycle inDrive simulé** :
  - Lorsqu'un client crée une demande (`createBooking`), un timer déclenche automatiquement l'arrivée de **3 contre-propositions d'artisans** après 3s, 7s et 12s.
  - L'écran `SearchingRadarScreen` scrute ces offres en polling (toutes les 3.5s) et affiche le compteur dynamique.
  - L'écran `OffersListScreen` permet de choisir et d'accepter une offre, basculant immédiatement sur le `JobTrackingScreen`.
- **Assistant IA InHome** :
  - `aiApi.matchService(query)` comprend le Darija et le Français (mots clés : *fuite, robini, dow, sbayghi, khdama, clim, r7il, bab*) et propose instantanément le bon corps d'état avec une estimation de prix en DH.
  - `aiApi.streamChat(message, onChunk)` simule un streaming texte chunk par chunk avec conseils pratiques pour le client marocain.

---

## 6. Comment Basculer sur le Backend Réel

Quand `inhome-backend` (Node.js / Express / Prisma / PostgreSQL) sera prêt :

1. Ouvrez `src/core/config/env.js` (ou définissez la variable d'environnement `.env`) :
   ```env
   EXPO_PUBLIC_USE_MOCKS=false
   EXPO_PUBLIC_API_URL=http://<VOTRE_IP_LOCALE>:5000/api
   ```
2. **Sur un téléphone physique** : Remplacez impérativement `localhost` par l'IP de votre machine de développement (ex: `http://192.168.1.50:5000/api`).
3. Tous les services dans `src/features/*/api/*.js` basculeront automatiquement sur `apiClient.js` avec gestion automatique du Bearer JWT injecté par les interceptors Axios.

---

## 7. Commandes Utiles

```bash
# Lancer le serveur Metro Expo
cd inhome-mobile
npx expo start

# Lancer sur émulateur Android
npx expo start --android

# Lancer en mode Web pour test rapide
npx expo start --web
```
