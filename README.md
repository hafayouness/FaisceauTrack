# 🚚 FaisceauTrack

> **Système de gestion, de suivi et de traçabilité des livraisons de faisceaux**

**FaisceauTrack** est une application web conçue pour digitaliser et centraliser la gestion des livraisons de faisceaux dans un environnement industriel.

Elle permet de gérer les **livraisons, références, quantités, remorques, transporteurs et destinations**, tout en assurant une traçabilité complète des opérations.

L'objectif est de remplacer les suivis manuels et les fichiers Excel dispersés par une solution **centralisée, fiable, sécurisée et facilement exploitable**.

---

## 📋 Sommaire

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Workflow](#-workflow)
- [Exemple](#-exemple)
- [Rôles utilisateurs](#-rôles-utilisateurs)
- [Statuts](#-statuts)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API](#-api)
- [Export Excel](#-export-excel)
- [Sécurité](#-sécurité)
- [Structure du projet](#-structure-du-projet)
- [Git](#-git)
- [Auteur](#-auteur)

---

# 🎯 Présentation

Dans un environnement industriel, le suivi des livraisons peut rapidement devenir complexe lorsqu'il est réalisé à travers plusieurs fichiers Excel ou documents manuels.

**FaisceauTrack** apporte une solution centralisée permettant de suivre chaque livraison depuis sa préparation jusqu'à sa réception.

Chaque livraison peut contenir :

- Une ou plusieurs références de faisceaux
- Une quantité pour chaque référence
- Une remorque
- Un transporteur
- Une destination
- Une date et une heure
- Un statut de livraison
- Les utilisateurs ayant effectué les différentes opérations

L'application conserve également un **historique complet** permettant de retrouver rapidement les informations liées à une livraison.

---

# ✨ Fonctionnalités

## 📦 Gestion des faisceaux

- Création d'une référence de faisceau
- Consultation des références disponibles
- Recherche d'une référence
- Association de plusieurs références à une livraison
- Gestion des quantités
- Suivi des références livrées

---

## 🚚 Gestion des livraisons

Création et gestion complète d'une livraison :

- Numéro de livraison
- Numéro de remorque
- Transporteur
- Destination
- Date et heure
- Références
- Quantités
- Statut
- Utilisateur responsable

Une livraison peut contenir plusieurs références.

### Exemple

```text
Livraison : DL-2026-001
Remorque  : REM-025
Transporteur : Transport XYZ
Destination : Site Production A

FA-001 → 500 PCS
FA-002 → 250 PCS
FA-015 → 120 PCS
FA-023 → 800 PCS
```

---

# 🔎 Traçabilité

Chaque opération est enregistrée afin de garantir une traçabilité complète.

Il est possible de retrouver :

| Information  | Description                            |
| ------------ | -------------------------------------- |
| Livraison    | Identifiant de la livraison            |
| Référence    | Référence du faisceau                  |
| Quantité     | Quantité livrée                        |
| Remorque     | Numéro de remorque                     |
| Transporteur | Société de transport                   |
| Destination  | Destination de la livraison            |
| Date         | Date de l'opération                    |
| Heure        | Heure de l'opération                   |
| Utilisateur  | Utilisateur ayant effectué l'opération |
| Statut       | État actuel de la livraison            |

---

# 📊 Historique

FaisceauTrack dispose d'un historique permettant de consulter les livraisons passées.

### 🔍 Recherche

Les utilisateurs peuvent rechercher une livraison selon plusieurs critères :

- Référence
- Numéro de livraison
- Remorque
- Transporteur
- Destination
- Date
- Statut

### 🔃 Filtres

Les filtres permettent de limiter rapidement les résultats afin de retrouver une opération spécifique.

---

# 📈 Rapports

L'application permet de générer des rapports à partir des données enregistrées.

Les données peuvent notamment être utilisées pour :

- Suivi des livraisons
- Analyse des quantités
- Contrôle logistique
- Reporting
- Archivage
- Analyse des références

---

# 📥 Export Excel

L'historique des livraisons peut être exporté au format **Excel (.xlsx)**.

L'export permet notamment de récupérer :

```text
Livraison
Date
Remorque
Transporteur
Destination
Référence
Quantité
Statut
Utilisateur
```

Cela facilite l'exploitation des données dans Excel pour les besoins administratifs, logistiques ou industriels.

---

# 🖨️ Impression

Les informations peuvent également être préparées pour impression.

Cela permet notamment de générer :

- Bon de livraison
- Rapport de livraison
- Historique filtré
- Documents de suivi

---

# 🔄 Workflow

Le fonctionnement général de l'application est le suivant :

```text
┌──────────────────────┐
│  Création livraison  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Infos transport      │
│ - Remorque           │
│ - Transporteur       │
│ - Destination        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Ajout des références │
│ + quantités          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Validation           │
│ de la livraison      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Traçabilité          │
│ + Historique         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Recherche / Filtres  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Excel / Impression   │
└──────────────────────┘
```

---

# 👥 Rôles utilisateurs

Le système prévoit plusieurs niveaux d'accès :

| Rôle               | Description                        |
| ------------------ | ---------------------------------- |
| `ADMIN`            | Administration complète du système |
| `LOGISTIC_MANAGER` | Gestion et suivi des livraisons    |
| `RECEPTION`        | Gestion de la réception            |
| `VIEWER`           | Consultation des données           |

Les permissions sont contrôlées côté API afin de sécuriser les opérations.

---

# 📌 Statuts des livraisons

Une livraison peut évoluer selon plusieurs états :

```text
PREPARATION
     ↓
LOADING
     ↓
READY
     ↓
IN_TRANSIT
     ↓
ARRIVED
     ↓
PARTIAL_RECEPTION
     ↓
RECEIVED
```

Un statut peut également évoluer vers :

```text
CANCELLED
```

---

# 🛠️ Stack technique

## Backend

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **Sequelize ORM**
- **JWT**
- **bcryptjs**
- **ExcelJS**
- **express-validator**
- **Helmet**
- **CORS**
- **Morgan**
- **dotenv**

### Architecture

Le backend suit une architecture organisée autour des responsabilités :

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
PostgreSQL
```

Cette organisation permet de séparer clairement :

- Les routes HTTP
- La logique métier
- Les contrôleurs
- L'accès aux données
- Les validations
- Les services d'export
- La sécurité

---

# 💻 Frontend

Le frontend est conçu pour fournir une interface permettant notamment :

- La connexion
- La création d'une livraison
- La gestion des références
- La consultation des livraisons
- La recherche
- Les filtres
- La consultation de l'historique
- L'export Excel
- L'impression

---

# 🗄️ Base de données

La base de données utilisée est **PostgreSQL** avec **Sequelize** comme ORM.

Les principales entités sont notamment :

```text
User
Delivery
DeliveryItem
Reference
Trailer
Carrier
Destination
History
```

Relations principales :

```text
User
 │
 └────── Delivery
             │
             ├──── Trailer
             ├──── Carrier
             ├──── Destination
             │
             └──── DeliveryItem
                       │
                       └──── Reference
```

---

# 📁 Structure du projet

```text
FaisceauTrack/
│
├── Backend/
│   │
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── seeders/
│   ├── migrations/
│   ├── uploads/
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│
├── .gitignore
└── README.md
```

---

# ⚙️ Installation

## 1. Cloner le projet

```bash
git clone https://github.com/hafayouness/FaisceauTrack.git
```

```bash
cd FaisceauTrack
```

---

## 2. Installer le backend

```bash
cd Backend
```

```bash
npm install
```

---

## 3. Configurer les variables d'environnement

Créer un fichier :

```text
.env
```

Exemple :

```env
PORT=5000

NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=faisceau_track
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

> Ne jamais publier le fichier `.env` sur GitHub.

---

## 4. Créer la base PostgreSQL

Créer une base :

```sql
CREATE DATABASE faisceau_track;
```

Puis vérifier les informations de connexion dans `.env`.

---

## 5. Démarrer le serveur

En développement :

```bash
npm run dev
```

Ou :

```bash
npm start
```

Le serveur sera accessible sur :

```text
http://localhost:5000
```

---

# ❤️ Health Check

L'API expose une route permettant de vérifier que le serveur fonctionne :

```http
GET /health
```

Réponse :

```json
{
  "success": true,
  "message": "FaisceauTrack API opérationnelle"
}
```

---

# 🔐 Authentification

L'API utilise **JWT (JSON Web Token)** pour sécuriser les accès.

Principales opérations :

```http
POST /api/login
GET  /api/me
```

Le token doit ensuite être envoyé dans le header :

```http
Authorization: Bearer <TOKEN>
```

L'inscription publique n'est pas destinée à être ouverte à tous les utilisateurs. La création des comptes peut être réservée à l'administration.

---

# 🌐 API

## Authentication

### Login

```http
POST /api/login
```

Exemple :

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

---

## Utilisateur connecté

```http
GET /api/me
```

Header :

```http
Authorization: Bearer <TOKEN>
```

---

## Livraisons

### Liste des livraisons

```http
GET /api/deliveries
```

### Détails d'une livraison

```http
GET /api/deliveries/:id
```

### Créer une livraison

```http
POST /api/deliveries
```

### Modifier une livraison

```http
PUT /api/deliveries/:id
```

### Supprimer une livraison

```http
DELETE /api/deliveries/:id
```

---

# 📤 Export

L'historique peut être exporté au format Excel :

```http
GET /api/export/deliveries
```

Le serveur génère un fichier :

```text
deliveries.xlsx
```

Ce fichier peut ensuite être ouvert avec Microsoft Excel ou tout autre logiciel compatible.

---

# 🧪 Tests API

Les endpoints peuvent être testés avec :

- Postman
- Insomnia
- Thunder Client

Exemple :

```text
POST http://localhost:5000/api/deliveries
```

Header :

```text
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

---

# 🔒 Sécurité

Le backend intègre plusieurs mécanismes de sécurité :

- Authentification JWT
- Hash des mots de passe avec bcrypt
- Validation des données
- Helmet
- CORS
- Variables sensibles dans `.env`
- Contrôle des rôles
- Protection des routes
- Validation des paramètres
- Gestion centralisée des erreurs

---

# 🚫 Pas de QR Code

FaisceauTrack ne repose pas sur l'utilisation de QR codes.

La traçabilité est basée principalement sur :

```text
Référence
+
Quantité
+
Livraison
+
Remorque
+
Transporteur
+
Destination
+
Date / Heure
```

Cela permet de conserver un système simple et adapté au processus logistique existant.

---

# 🎯 Objectifs du projet

FaisceauTrack a pour objectifs de :

- Centraliser les données logistiques
- Améliorer la traçabilité des faisceaux
- Réduire les erreurs de saisie
- Réduire l'utilisation des fichiers Excel dispersés
- Faciliter la recherche des livraisons
- Suivre les quantités livrées
- Améliorer le suivi des remorques
- Centraliser les informations des transporteurs
- Conserver un historique fiable
- Faciliter les rapports
- Exporter les données vers Excel
- Faciliter l'impression des documents
- Améliorer la visibilité des opérations logistiques

---

# 📊 Exemple métier

Une remorque peut contenir plusieurs références :

```text
REM-025
│
└── DL-2026-001
      │
      ├── FA-001 → 500 PCS
      ├── FA-002 → 250 PCS
      ├── FA-015 → 120 PCS
      └── FA-023 → 800 PCS
```

Le système permet ensuite de retrouver toutes ces informations à partir de :

```text
DL-2026-001
REM-025
FA-001
Transporteur
Destination
Date
```

---

# 🚀 Évolutions possibles

Le projet peut évoluer avec :

- Dashboard logistique
- Statistiques de livraison
- Graphiques
- Notifications
- Suivi des réceptions partielles
- Gestion avancée des stocks
- Gestion documentaire
- Historique des modifications
- Audit complet des actions utilisateurs
- Import Excel
- API externe
- Déploiement Docker
- CI/CD avec GitHub Actions

---

# 👨‍💻 Auteur

**Youness Hafa**

Développeur Full Stack Web & Mobile

- GitHub : [hafayouness](https://github.com/hafayouness)
- LinkedIn : [Youness Hafa](https://www.linkedin.com/in/youness-hafa-551881396/)

---

# 📄 Licence

Ce projet est développé dans le cadre d'un projet professionnel / industriel.

Tous droits réservés.
