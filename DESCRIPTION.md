# Description de l'application Registr Frontend

## Vue d'ensemble

**Registr Frontend** est une application web React TypeScript conçue pour la gestion et la documentation de traitements de données personnelles conformément au RGPD (Règlement Général sur la Protection des Données). L'application permet aux organisations de créer, gérer et documenter leurs registres de traitements de données personnelles de manière structurée et conforme.

## Architecture technique

### Stack technologique

- **Framework** : React 19 avec TypeScript
- **Build tool** : Vite 6
- **Routing** : TanStack Router
- **State Management** : TanStack Query (React Query) pour la gestion des données serveur
- **Formulaires** : TanStack Form avec validation Zod
- **UI Framework** : Material-UI (MUI) v6 avec thème personnalisé dark mode
- **Styling** : TailwindCSS 4
- **Internationalisation** : react-i18next (support FR/EN)
- **Authentification** : react-auth-kit
- **Drag & Drop** : @dnd-kit pour la réorganisation des traitements
- **Tests** : Vitest (unitaires), Playwright (e2e), MSW (mocking)

### Structure du projet

L'application suit une architecture basée sur les features avec une séparation claire des responsabilités :

```
src/
├── features/          # Modules fonctionnels
│   ├── auth/         # Authentification
│   ├── treatments/   # Gestion des traitements
│   ├── settings/     # Paramètres et configuration
│   └── subscription/ # Gestion des abonnements
├── components/       # Composants réutilisables
├── routes/          # Configuration des routes
├── utils/           # Utilitaires
└── styles/          # Styles globaux
```

## Fonctionnalités principales

### 1. Authentification et sécurité

- **Connexion** : Système d'authentification avec tokens (JWT)
- **Mot de passe oublié** : Récupération de mot de passe par email
- **Réinitialisation** : Réinitialisation sécurisée du mot de passe
- **Protection des routes** : Routes protégées nécessitant une authentification
- **Gestion de session** : Refresh token automatique

### 2. Gestion des traitements de données personnelles

#### Création et édition de traitements

L'application propose un formulaire en plusieurs étapes (wizard) pour créer un traitement :

**Étape 1 - Titre** : Nom et description du traitement

**Étape 2 - Informations générales** :
- Type de traitement
- Responsable du traitement (nom, entité, adresse, contact)
- DPO (Délégué à la Protection des Données) : interne ou externe
- Informations complètes du DPO si externe

**Étape 3 - Finalités** :
- Sélection des finalités principales du traitement
- Ajout de sous-finalités personnalisées
- Catégories disponibles : collecte de données, gestion utilisateurs, marketing, analyses, conformité légale, amélioration du service, support client, recherche, sécurité

**Étape 4 - Catégories de personnes concernées** :
- Sélection des catégories : clients, employés, fournisseurs, partenaires, prospects, candidats, visiteurs, sous-traitants, actionnaires

**Étape 5 - Données collectées** :
- **Données personnelles** : nom, prénom, email, téléphone, photo, numéro de sécurité sociale, etc.
- **Données financières** : compte bancaire, IBAN/RIB, salaire, dépenses, prêts, informations fiscales, chiffre d'affaires, bilan comptable
- **Données NIR** : Numéro de sécurité sociale avec catégories spécifiques
- **Durée de conservation** : Configuration pour chaque type de données
- **Sources des données** : Identification des sources de collecte
- **Marquage des données sensibles** : Identification automatique ou manuelle

**Étape 6 - Base légale** :
- Sélection ou création de bases légales personnalisées
- Description détaillée de chaque base légale

**Étape 7 - Partage des données** :
- **Accès aux données** : Qui a accès (employés, administrateurs, gestionnaires, fournisseurs externes, équipe technique, service client)
- **Partage avec des tiers** : Partenaires, fournisseurs, régulateurs, filiales, administration publique, clients
- **Transferts hors UE** : Gestion des transferts de données hors Union Européenne
- Informations sur les destinataires (nom, pays, garanties, liens vers documents)

**Étape 8 - Mesures de sécurité** :
- Ajout de mesures de sécurité personnalisées
- Informations complémentaires sur chaque mesure

#### Gestion des traitements

- **Liste des traitements** : Tableau avec colonnes :
  - Nom du traitement
  - Type de traitement
  - Finalités
  - Statut (Brouillon, Validé, Archivé)
  - Données sensibles (indicateur)
  - Date de création
  - Dernière mise à jour
  - Responsable
  - Présence d'un DPO

- **Réorganisation** : Drag & drop pour réorganiser l'ordre des traitements

- **Statuts** :
  - **Brouillon** : Traitement en cours de création/modification
  - **Validé** : Traitement finalisé et validé
  - **Archivé** : Traitement archivé (peut être désarchivé)

- **Actions disponibles** :
  - Créer un nouveau traitement
  - Modifier un traitement existant
  - Visualiser les détails d'un traitement
  - Archiver/Désarchiver
  - Enregistrer comme brouillon à tout moment

- **Export/Import** :
  - Export JSON : Téléchargement de tous les traitements au format JSON
  - Export PDF : Génération d'un rapport PDF de la liste des traitements
  - Import JSON : Importation de traitements depuis un fichier JSON/TXT

- **Visualisation détaillée** : Vue complète d'un traitement avec toutes les informations organisées par sections :
  - Informations générales
  - Responsable du traitement
  - Finalités et sous-finalités
  - Catégories de données personnelles
  - Données financières
  - Données NIR
  - Base légale
  - Mesures de sécurité
  - Transferts de données hors UE
  - Catégories de personnes concernées

### 3. Paramètres et configuration

#### Gestion des paramètres

L'application permet de gérer des paramètres personnalisés organisés par catégories :

- **Types de traitement** : Types personnalisés de traitements
- **Finalités du traitement** : Finalités personnalisées
- **Données personnelles** : Catégories de données personnelles personnalisées
- **Informations économiques** : Types de données financières personnalisées
- **Sources de données** : Sources personnalisées
- **Bases légales** : Bases légales personnalisées
- **Catégories de personnes** : Catégories personnalisées
- **Données collectées** : Types d'accès aux données personnalisés
- **Données partagées** : Types de partage personnalisés
- **Mesures de sécurité** : Mesures personnalisées

**Fonctionnalités** :
- Création, modification, suppression de paramètres
- Tableau de gestion avec recherche et filtres
- Export/Import JSON des paramètres

#### Gestion de l'entité

- **Informations de l'entreprise** :
  - Nom de l'entité
  - Numéro d'entité
  - Adresse complète (rue, code postal, ville, pays)
  - Coordonnées (téléphone, email)
  - Informations du responsable du traitement
  - Informations du DPO externe (si applicable)

### 4. Abonnement

- **Formulaire de souscription** :
  - Informations du compte (prénom, nom, email)
  - Informations de facturation (nom entreprise, adresse, TVA)
  - Méthodes de paiement :
    - Paiement par carte bancaire (Stripe)
    - Paiement par bon de commande
  - Confirmation et remerciements

### 5. Interface utilisateur

#### Navigation

- **Barre de navigation** :
  - Logo de l'application
  - Liens vers les principales sections (Traitements, Paramètres)
  - Menu utilisateur avec avatar :
    - Profil
    - Déconnexion (avec confirmation)

#### Thème et design

- **Thème dark** personnalisé avec :
  - Couleurs primaires : Bleu (#37BCF8)
  - Couleurs secondaires : Or (#DDB867)
  - Palette de couleurs adaptée au dark mode
  - Design moderne et professionnel

#### Internationalisation

- Support multilingue (FR/EN)
- Changement de langue via un sélecteur
- Toutes les traductions stockées dans `/public/locales/`

#### Responsive design

- Interface adaptative pour différents formats d'écran
- Utilisation de Material-UI pour la responsivité

## Flux utilisateur typique

1. **Connexion** : L'utilisateur se connecte avec ses identifiants
2. **Tableau de bord** : Redirection automatique vers la liste des traitements
3. **Création d'un traitement** :
   - Clic sur "Nouveau traitement"
   - Parcours du formulaire en 8 étapes
   - Possibilité de sauvegarder comme brouillon à tout moment
   - Validation finale du traitement
4. **Gestion** :
   - Consultation de la liste des traitements
   - Modification ou visualisation des détails
   - Réorganisation par drag & drop
   - Export/Import de données
5. **Configuration** :
   - Accès aux paramètres pour personnaliser les options
   - Gestion des informations de l'entité

## Sécurité et conformité RGPD

L'application est conçue pour aider les organisations à :
- Documenter tous leurs traitements de données personnelles
- Identifier les données sensibles
- Gérer les bases légales
- Documenter les mesures de sécurité
- Tracker les transferts de données hors UE
- Maintenir un registre conforme au RGPD

## Points techniques notables

- **Gestion d'état** : TanStack Query pour le cache et la synchronisation avec le backend
- **Validation** : Schémas Zod pour la validation côté client et serveur
- **Performance** : Lazy loading des routes, memoization où nécessaire
- **Accessibilité** : Support a11y avec attributs ARIA appropriés
- **PWA** : Configuration pour Progressive Web App (service worker, assets)
- **Tests** : Infrastructure de tests complète (unitaires, e2e, mocks)

## Environnement et déploiement

- Variables d'environnement pour la configuration (API URL, Public URL)
- Build optimisé avec Vite
- Support des environnements de développement, staging et production
