# 🎓 CampusHub — Frontend

Interface web de **CampusHub**, une plateforme de gestion universitaire pour l'**ENICarthage**.
Elle propose un espace dédié à chaque profil (**étudiant**, **enseignant**, **administrateur**) pour réserver des salles, suivre les événements et les clubs, et faire ses demandes administratives.

Développée avec **Angular 21** et **Tailwind CSS**. Elle consomme l'API REST Spring Boot du dépôt backend.

> 🔗 **Backend :** [jaz56/campushub-backend](https://github.com/jaz56/campushub-backend)

---

## ✨ Fonctionnalités

### 👨‍🏫 Espace Enseignant
- **Tableau de bord** personnel
- **Réservation de salle** : recherche des salles disponibles sur un créneau, puis envoi de la demande
- **Mes réservations** : suivi des statuts (en attente, approuvée, rejetée), modification et annulation
- **Calendrier** des réservations (vues mois, semaine, jour et liste avec FullCalendar)
- **Assistant chatbot** qui guide pas à pas dans une réservation de salle

### 🎓 Espace Étudiant
- **Tableau de bord**
- **Événements** du campus, avec inscription
- **Clubs**
- **Mes demandes** : demandes de documents administratifs et suivi de leur état

### 🛡️ Espace Administrateur *(en cours d'intégration)*
- Tableau de bord et **statistiques**
- **Validation des réservations**
- **Gestion des utilisateurs**
- Notifications et profil

### 🔐 Authentification
- Connexion et mot de passe oublié
- **Guards** de route (`authGuard`, `adminGuard`)
- **Intercepteur HTTP** qui ajoute le token JWT à chaque requête

---

## 🛠️ Technologies

| Catégorie | Outils |
|---|---|
| Framework | Angular 21 (composants standalone, lazy loading, SSR) |
| Langage | TypeScript 5.9 |
| Style | Tailwind CSS 3, SCSS |
| Calendrier | FullCalendar 6 |
| Icônes | Lucide Angular |
| Authentification | @auth0/angular-jwt |
| Réactivité | RxJS |
| Tests | Vitest |
| Rendu serveur | Angular SSR + Express |

---

## 🏗️ Architecture

```
src/app/
├── core/
│   ├── guards/          # auth-guard, admin-guard
│   ├── interceptors/    # auth-token-interceptor (JWT)
│   ├── models/          # User, Salle, Reservation, Evenement, Demande, Club, Etudiant
│   └── services/        # api, auth
├── shared/
│   ├── components/      # header, chatbot-widget
│   └── pipes/           # markdown-to-html
└── features/            # modules chargés à la demande (lazy loading)
    ├── auth/            # login, forgot-password
    ├── enseignant/      # dashboard, reservation-salle, mes-reservations, calendrier
    ├── etudiant/        # dashboard, evenements, clubs, mes-demandes
    └── admin/           # dashboard, analytics, reservations, users, notifications, profile
```

### Routes principales

| Route | Page |
|---|---|
| `/auth/login` | Connexion |
| `/auth/forgot-password` | Mot de passe oublié |
| `/enseignant/dashboard` | Tableau de bord enseignant |
| `/enseignant/reservation-salle` | Réserver une salle |
| `/enseignant/mes-reservations` | Mes réservations |
| `/enseignant/calendrier` | Calendrier |
| `/etudiant/dashboard` | Tableau de bord étudiant |
| `/etudiant/evenements` | Événements |
| `/etudiant/clubs` | Clubs |
| `/etudiant/mes-demandes` | Mes demandes |

---

## 🚀 Installation et lancement

### Prérequis
- **Node.js** 20 ou plus et **npm**
- **Angular CLI** : `npm install -g @angular/cli`
- Le [backend CampusHub](https://github.com/jaz56/campushub-backend) lancé en local

### 1. Cloner et installer

```bash
git clone https://github.com/jaz56/campushub-frontend.git
cd campushub-frontend
npm install
```

### 2. Configurer l'URL de l'API

Dans `src/environments/environment.development.ts`, indiquez l'adresse du backend. Par défaut, il tourne sur le port `8082` :

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8082/api/v1'
};
```

### 3. Lancer le serveur de développement

```bash
npm start
```

L'application est accessible sur **http://localhost:4200**. C'est l'origine autorisée par la configuration CORS du backend.

### Autres commandes

```bash
npm run build                          # build de production → dist/
npm test                               # tests unitaires (Vitest)
npm run serve:ssr:campushub-frontend   # lancer la version SSR après le build
```

---

## 🧪 Comptes de démonstration

Ces comptes sont créés automatiquement par le backend au démarrage :

| Rôle | Email | Mot de passe |
|---|---|---|
| Admin | `admin@enicarthage.tn` | `admin123` |
| Enseignant | `jean.dupont@enicarthage.tn` | `enseignant123` |
| Étudiant | `ahmed.benali@enicarthage.tn` | `etudiant123` |

---

## 🗺️ Améliorations prévues

- [ ] Réactiver et brancher le module **Admin** sur l'API
- [ ] Aligner les routes du service d'événements étudiant sur celles du backend
- [ ] Authentification JWT complète, côté front et côté back
- [ ] Configuration de l'URL de production

---

## 🔗 Dépôts du projet

| Partie | Dépôt |
|---|---|
| Frontend (Angular) | [jaz56/campushub-frontend](https://github.com/jaz56/campushub-frontend) |
| Backend (Spring Boot) | [jaz56/campushub-backend](https://github.com/jaz56/campushub-backend) |

---

## 👩‍💻 Équipe

Projet réalisé par des étudiants en génie logiciel de l'**ENICarthage**.
