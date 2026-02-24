# Spécifications Fonctionnelles - Vue d'un Traitement

## Document de spécifications pour développeur expérimenté

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr Frontend - Gestion des traitements RGPD  

---

## Table des matières

1. [Contexte métier et RGPD](#1-contexte-métier-et-rgpd)
2. [Vue d'ensemble de la page](#2-vue-densemble-de-la-page)
3. [En-tête de la page](#3-en-tête-de-la-page)
4. [Section 1 : En-tête du traitement](#4-section-1--en-tête-du-traitement)
5. [Section 2 : Description et acteurs](#5-section-2--description-et-acteurs)
6. [Section 3 : Finalités du traitement](#6-section-3--finalités-du-traitement)
7. [Section 4 : Données personnelles et financières](#7-section-4--données-personnelles-et-financières)
8. [Section 5 : Base légale](#8-section-5--base-légale)
9. [Section 6 : Catégories de personnes concernées](#9-section-6--catégories-de-personnes-concernées)
10. [Section 7 : Destinataires des données](#10-section-7--destinataires-des-données)
11. [Section 8 : Mesures de sécurité](#11-section-8--mesures-de-sécurité)
12. [Section 9 : Transferts hors UE](#12-section-9--transferts-hors-ue)
13. [Structure des données](#13-structure-des-données)
14. [Intégration API](#14-intégration-api)
15. [Règles de gestion](#15-règles-de-gestion)
16. [Internationalisation](#16-internationalisation)
17. [Accessibilité](#17-accessibilité)
18. [Cas d'usage détaillés](#18-cas-dusage-détaillés)
19. [Maquettes et wireframes](#19-maquettes-et-wireframes)
20. [Annexes](#20-annexes)

---

## 1. Contexte métier et RGPD

### 1.1 Obligation de tenue d'un registre

**Article 30 du RGPD** : Le responsable du traitement et le sous-traitant tiennent un **registre des activités de traitement** effectuées sous leur responsabilité.

**Contenu obligatoire du registre** :
- Nom et coordonnées du responsable du traitement
- Finalités du traitement
- Description des catégories de personnes concernées
- Description des catégories de données à caractère personnel
- Catégories de destinataires
- Transferts de données vers un pays tiers
- Délais de suppression
- Description générale des mesures de sécurité

### 1.2 Consultation du registre

**Article 30.4 du RGPD** : Le registre est tenu **par écrit**, y compris sous forme électronique.

**Article 30.5 du RGPD** : Le responsable du traitement ou le sous-traitant met le registre à la disposition de l'autorité de contrôle **sur demande**.

**Conséquence** : La vue d'un traitement doit permettre de consulter **toutes les informations** enregistrées de manière claire et complète.

### 1.3 Transparence et accountability

**Principe d'accountability (Article 5.2 du RGPD)** : Le responsable du traitement est responsable du respect des principes et doit être en mesure de **démontrer** que ces principes sont respectés.

**Conséquence** : La vue d'un traitement sert de **preuve de conformité** et doit être :
- Complète
- Lisible
- Imprimable / Exportable
- Structurée

### 1.4 Utilité de la vue

**Pour l'organisation** :
- Consulter les détails d'un traitement
- Vérifier la conformité
- Préparer un audit
- Répondre à une demande de la CNIL

**Pour les auditeurs** :
- Vérifier la conformité RGPD
- Analyser les risques
- Valider les mesures de sécurité

**Pour la CNIL** :
- Contrôler le registre
- Vérifier les déclarations
- Instruire une plainte

---

## 2. Vue d'ensemble de la page

### 2.1 Objectif de la page

La page de vue d'un traitement affiche **toutes les informations** d'un traitement de données personnelles de manière **structurée et lisible**.

**Mode** : Lecture seule (consultation)

**Accès** : Via la liste des traitements ou un lien direct

**URL** : `/dashboard/treatments/view/{id}`

### 2.2 Structure générale

La page est composée de **9 sections** affichées verticalement :

1. **En-tête du traitement** : Titre, date de création, date de mise à jour
2. **Description et acteurs** : Responsable, DPO, organisation externe
3. **Finalités du traitement** : Finalité principale et sous-finalités
4. **Données personnelles et financières** : Catégories de données collectées
5. **Base légale** : Fondement juridique du traitement
6. **Catégories de personnes concernées** : Types de personnes dont les données sont traitées
7. **Destinataires des données** : Accès interne et partage externe
8. **Mesures de sécurité** : Mesures techniques et organisationnelles
9. **Transferts hors UE** : Transferts vers des pays tiers (si applicable)

### 2.3 Layout responsive

#### Desktop (> 960px)
- Largeur maximale : 1440px
- Centré horizontalement
- Marges latérales : Auto

#### Tablet (600px - 960px)
- Largeur : 90% de l'écran
- Centré horizontalement

#### Mobile (< 600px)
- Largeur : 95% de l'écran
- Tables avec scroll horizontal si nécessaire

### 2.4 Style général

**Fond** : Dark mode (fond sombre #10172A ou similaire)

**Texte** : Blanc ou gris clair

**Titres de section** : 
- Couleur : Secondaire (or #DDB867 ou bleu #37BCF8)
- Majuscules
- Préfixe : "#"
- Espacement des lettres : 0.1em

**Tables** :
- Fond alterné pour les lignes (zebra striping)
- Bordures arrondies
- Séparateur vertical pour la première colonne

---

## 3. En-tête de la page

### 3.1 Bouton "Retour"

**Position** : En haut à gauche de la page

**Icône** : Flèche vers la gauche (ArrowBack)

**Texte** : "Retour"

**Action** : Retour à la liste des traitements (`/dashboard/treatments`)

**Style** :
- Bouton avec icône à gauche
- Couleur : Blanc ou bleu primaire
- Hover : Effet de surbrillance

### 3.2 Actions disponibles (optionnelles)

**Bouton "Modifier"** :
- Position : En haut à droite
- Icône : Crayon (Edit)
- Action : Redirection vers le formulaire d'édition
- Disponibilité : Selon les permissions

**Bouton "Exporter"** :
- Position : En haut à droite
- Icône : Téléchargement (Download)
- Action : Export PDF ou Excel
- Disponibilité : Selon les permissions

**Bouton "Archiver"** :
- Position : En haut à droite
- Icône : Archive
- Action : Archiver le traitement
- Disponibilité : Si le traitement n'est pas archivé

---

## 4. Section 1 : En-tête du traitement

### 4.1 Objectif

Afficher les **informations principales** du traitement : titre, date de création, date de mise à jour.

### 4.2 Layout

**Disposition** : Grille à 3 colonnes égales

**Alignement** : Centré horizontalement et verticalement

### 4.3 Colonne 1 : Titre du traitement

**Label** : "Nom du traitement"

**Valeur** : Titre du traitement (ex: "Gestion des candidatures")

**Style** :
- Label : Couleur primaire (#37BCF8), taille subtitle1, poids 600
- Valeur : Taille H5, poids bold

### 4.4 Colonne 2 : Date de création

**Label** : "Date de création du traitement"

**Valeur** : Date de création au format `dd/MM/yyyy` (ex: "15/01/2026")

**Style** :
- Label : Couleur primaire (#37BCF8), taille subtitle1, poids 600
- Valeur : Taille H5, poids bold

### 4.5 Colonne 3 : Date de mise à jour

**Label** : "Mise à jour du traitement"

**Valeur** : Date de dernière modification au format `dd/MM/yyyy` (ex: "18/02/2026")

**Style** :
- Label : Couleur primaire (#37BCF8), taille subtitle1, poids 600
- Valeur : Taille H5, poids bold

### 4.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│   │ Nom du          │  │ Date de création│  │ Mise à jour du  ││
│   │ traitement      │  │ du traitement   │  │ traitement      ││
│   │                 │  │                 │  │                 ││
│   │ Gestion des     │  │ 15/01/2026      │  │ 18/02/2026      ││
│   │ candidatures    │  │                 │  │                 ││
│   └─────────────────┘  └─────────────────┘  └─────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Section 2 : Description et acteurs

### 5.1 Objectif

Afficher les **acteurs impliqués** dans le traitement : responsable du traitement, DPO (délégué à la protection des données), organisation externe du DPO.

**Obligation RGPD** : Article 30.1.a - Le registre doit contenir le nom et les coordonnées du responsable du traitement et du DPO.

### 5.2 Titre de la section

**Texte** : "# INFORMATIONS GÉNÉRALES" ou "# DESCRIPTION"

**Style** : Titre de section (voir style général)

### 5.3 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Acteurs impliqués
2. Nom
3. Numéro de l'entité (conditionnel)
4. Adresse
5. Code Postal
6. Ville
7. Pays
8. Téléphone
9. Email

**Lignes** :
1. Responsable du traitement
2. Délégué à la protection des données (DPO)
3. Société du DPO (si DPO externe)

### 5.4 Ligne 1 : Responsable du traitement

**Colonne "Acteurs impliqués"** : "Responsable du traitement"

**Données affichées** :
- Nom : `responsible.fullName`
- Numéro de l'entité : `responsible.entityNumber` (si présent)
- Adresse : `responsible.address.streetAndNumber`
- Code Postal : `responsible.address.postalCode`
- Ville : `responsible.address.city`
- Pays : `responsible.address.country`
- Téléphone : `responsible.address.phone`
- Email : `responsible.address.email`

### 5.5 Ligne 2 : Délégué à la protection des données (DPO)

**Colonne "Acteurs impliqués"** : "Délégué à la protection des données"

**Condition d'affichage** : Si `hasDPO = true`

**Données affichées** :
- Nom : `DPO.fullName`
- Adresse : `DPO.address.streetAndNumber`
- Code Postal : `DPO.address.postalCode`
- Ville : `DPO.address.city`
- Pays : `DPO.address.country`
- Téléphone : `DPO.address.phone`
- Email : `DPO.address.email`

**Si `hasDPO = false`** :
- Afficher "N/A" sur toutes les colonnes (colspan=7)

### 5.6 Ligne 3 : Société du DPO (DPO externe)

**Colonne "Acteurs impliqués"** : "Société du DPO"

**Condition d'affichage** : Si `hasExternalDPO = true`

**Données affichées** :
- Nom : `externalOrganizationDPO.fullName`
- Numéro de l'entité : `externalOrganizationDPO.entityNumber` (si présent)
- Adresse : `externalOrganizationDPO.address.streetAndNumber`
- Code Postal : `externalOrganizationDPO.address.postalCode`
- Ville : `externalOrganizationDPO.address.city`
- Pays : `externalOrganizationDPO.address.country`
- Téléphone : `externalOrganizationDPO.address.phone`
- Email : `externalOrganizationDPO.address.email`

**Si `hasExternalDPO = false`** : La ligne n'est pas affichée

### 5.7 Colonne conditionnelle "Numéro de l'entité"

**Condition d'affichage** : Si au moins un acteur a un `entityNumber`

**Logique** :
- Si `responsible.entityNumber` existe OU `externalOrganizationDPO.entityNumber` existe
- Alors afficher la colonne "Numéro de l'entité"
- Sinon masquer la colonne

### 5.8 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # INFORMATIONS GÉNÉRALES                                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Acteurs    │ Nom      │ Adresse  │ CP   │ Ville │ Pays  │  │
│  │ impliqués  │          │          │      │       │       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Responsable│ Acme Inc │ 1 rue... │ 75001│ Paris │ France│  │
│  │ du         │          │          │      │       │       │  │
│  │ traitement │          │          │      │       │       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Délégué à  │ Jean     │ 2 av...  │ 75002│ Paris │ France│  │
│  │ la         │ Dupont   │          │      │       │       │  │
│  │ protection │          │          │      │       │       │  │
│  │ des données│          │          │      │       │       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Société du │ DPO      │ 3 bd...  │ 75003│ Paris │ France│  │
│  │ DPO        │ Services │          │      │       │       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Section 3 : Finalités du traitement

### 6.1 Objectif

Afficher les **finalités** du traitement : finalité principale et sous-finalités.

**Obligation RGPD** : Article 30.1.b - Le registre doit contenir les finalités du traitement.

### 6.2 Titre de la section

**Texte** : "# FINALITÉS"

**Style** : Titre de section (voir style général)

### 6.3 Condition d'affichage

**Affichage** : Si `reasons.length > 0`

**Masquage** : Si aucune finalité n'est renseignée

### 6.4 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Description (30% de largeur)
2. Informations complémentaires (70% de largeur)

**Lignes** :
1. Finalité principale
2. Sous-finalité 1 (si présente)
3. Sous-finalité 2 (si présente)
4. ...

### 6.5 Ligne 1 : Finalité principale

**Colonne "Description"** : "Finalité principale"

**Colonne "Informations complémentaires"** : Liste des finalités principales séparées par des virgules

**Données** : `reasons.join(', ')`

**Exemple** : "Recrutement, Gestion des candidatures"

### 6.6 Lignes suivantes : Sous-finalités

**Colonne "Description"** : "Sous-finalités {index + 1}"

**Colonne "Informations complémentaires"** : `{subReason.name} : {subReason.moreInfo}`

**Données** : Tableau `subReasons`

**Exemple** :
- Sous-finalités 1 : "Entretiens téléphoniques : Prise de contact avec les candidats"
- Sous-finalités 2 : "Tests techniques : Évaluation des compétences"

### 6.7 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # FINALITÉS                                                    │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Description      │ Informations complémentaires          │  │
│  │ (30%)            │ (70%)                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Finalité         │ Recrutement, Gestion des candidatures │  │
│  │ principale       │                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Sous-finalités 1 │ Entretiens téléphoniques : Prise de  │  │
│  │                  │ contact avec les candidats            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Sous-finalités 2 │ Tests techniques : Évaluation des    │  │
│  │                  │ compétences                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Section 4 : Données personnelles et financières

### 7.1 Objectif

Afficher les **catégories de données** collectées : données personnelles et données financières.

**Obligation RGPD** : Article 30.1.c - Le registre doit contenir une description des catégories de données à caractère personnel.

### 7.2 Deux sous-sections

Cette section est divisée en **deux sous-sections** :
1. **Données personnelles**
2. **Données financières**

Chaque sous-section est affichée **uniquement si elle contient des données**.

### 7.3 Sous-section 1 : Données personnelles

#### 7.3.1 Titre de la sous-section

**Texte** : "# DONNÉES PERSONNELLES"

**Style** : Titre de section (voir style général)

#### 7.3.2 Condition d'affichage

**Affichage** : Si `personalDataGroup.data.name.length > 0`

**Masquage** : Si aucune donnée personnelle n'est renseignée

#### 7.3.3 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Description (30% de largeur)
2. Donnée sensible (70% de largeur, centré)

**Lignes** : Une ligne par donnée personnelle

#### 7.3.4 Données affichées

**Pour chaque donnée** dans `personalDataGroup.data.name` :

**Colonne "Description"** : `data.name`

**Colonne "Donnée sensible"** :
- Si `data.isSensitive = true` : Afficher l'icône de sensibilité (cadenas ou icône spécifique)
- Si `data.isSensitive = false` : Cellule vide

**Icône de sensibilité** :
- Source : `/public/icon-sensitive.svg`
- Taille : 20px
- Position : Centrée verticalement et horizontalement

#### 7.3.5 Durée de conservation

**Position** : Sous la table

**Format** : "Durée de conservation : {conservationDuration}"

**Données** : `personalDataGroup.conservationDuration`

**Valeur par défaut** : "-" si non renseigné

**Style** :
- Marge supérieure : 2em
- Couleur : Blanc

#### 7.3.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # DONNÉES PERSONNELLES                                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Description      │ Donnée sensible                       │  │
│  │ (30%)            │ (70%, centré)                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Nom              │                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Prénom           │                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Email            │                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Numéro de        │              🔒                       │  │
│  │ sécurité sociale │                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Données de santé │              🔒                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Durée de conservation : 5 ans après la fin du contrat         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Sous-section 2 : Données financières

#### 7.4.1 Titre de la sous-section

**Texte** : "# DONNÉES FINANCIÈRES"

**Style** : Titre de section (voir style général)

#### 7.4.2 Condition d'affichage

**Affichage** : Si `financialDataGroup.data.name.length > 0`

**Masquage** : Si aucune donnée financière n'est renseignée

#### 7.4.3 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Description
2. Donnée sensible

**Lignes** : Une ligne par donnée financière

#### 7.4.4 Données affichées

**Pour chaque donnée** dans `financialDataGroup.data.name` :

**Colonne "Description"** : `data.name`

**Colonne "Donnée sensible"** :
- Si `data.isSensitive = true` : Afficher l'icône de sensibilité
- Si `data.isSensitive = false` : Cellule vide

**Note** : Les données financières sont **automatiquement sensibles** dans la plupart des cas.

#### 7.4.5 Durée de conservation

**Position** : Sous la table

**Format** : "Durée de conservation : {conservationDuration}"

**Données** : `financialDataGroup.conservationDuration`

**Valeur par défaut** : "-" si non renseigné

#### 7.4.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # DONNÉES FINANCIÈRES                                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Description      │ Donnée sensible                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Numéro de carte  │              🔒                       │  │
│  │ bancaire         │                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ RIB              │              🔒                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Salaire          │              🔒                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Durée de conservation : 10 ans (obligations fiscales)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Section 5 : Base légale

### 8.1 Objectif

Afficher la **base légale** du traitement, c'est-à-dire le fondement juridique qui autorise le traitement.

**Obligation RGPD** : Article 30.1.b - Le registre doit contenir les finalités du traitement (incluant la base légale).

**Article 6 du RGPD** : Le traitement n'est licite que si au moins une des 6 bases légales s'applique.

### 8.2 Titre de la section

**Texte** : "# BASE LÉGALE"

**Style** : Titre de section (voir style général)

### 8.3 Condition d'affichage

**Affichage** : Si `legalBase.length > 0`

**Masquage** : Si aucune base légale n'est renseignée

### 8.4 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Description (30% de largeur)
2. Informations complémentaires (70% de largeur)

**Lignes** : Une ligne par base légale

### 8.5 Données affichées

**Pour chaque base légale** dans `legalBase` :

**Colonne "Description"** : `legalBase.name`

**Colonne "Informations complémentaires"** : `legalBase.additionalInformation`

**Exemples** :
- Consentement de la personne concernée | Formulaire de consentement signé
- Exécution d'un contrat | Contrat de travail
- Obligation légale | Code du travail

### 8.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # BASE LÉGALE                                                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Description      │ Informations complémentaires          │  │
│  │ (30%)            │ (70%)                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Exécution d'un   │ Contrat de travail avec le candidat   │  │
│  │ contrat          │                                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Intérêt légitime │ Gestion des candidatures pour le      │  │
│  │                  │ recrutement                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 9. Section 6 : Catégories de personnes concernées

### 9.1 Objectif

Afficher les **catégories de personnes concernées** par le traitement.

**Obligation RGPD** : Article 30.1.c - Le registre doit contenir une description des catégories de personnes concernées.

### 9.2 Titre de la section

**Texte** : "# CATÉGORIES DE PERSONNES CONCERNÉES" ou "# CATEGORIES"

**Style** : Titre de section (voir style général)

### 9.3 Condition d'affichage

**Affichage** : Si `subjectCategories.length > 0`

**Masquage** : Si aucune catégorie n'est renseignée

### 9.4 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Description (30% de largeur)
2. Informations complémentaires (70% de largeur)

**Lignes** : Une ligne par catégorie de personne

### 9.5 Données affichées

**Pour chaque catégorie** dans `subjectCategories` :

**Colonne "Description"** : `subjectCategory.name`

**Colonne "Informations complémentaires"** : `subjectCategory.additionalInformation`

**Exemples** :
- Candidats | Personnes ayant postulé à une offre d'emploi
- Employés | Salariés de l'entreprise
- Clients | Personnes ayant acheté un produit ou service

### 9.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # CATÉGORIES DE PERSONNES CONCERNÉES                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Description      │ Informations complémentaires          │  │
│  │ (30%)            │ (70%)                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Candidats        │ Personnes ayant postulé à une offre   │  │
│  │                  │ d'emploi                              │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Employés         │ Salariés de l'entreprise              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Section 7 : Destinataires des données

### 10.1 Objectif

Afficher les **destinataires** des données : accès interne et partage externe.

**Obligation RGPD** : Article 30.1.d - Le registre doit contenir les catégories de destinataires auxquels les données ont été ou seront communiquées.

### 10.2 Titre de la section

**Texte** : "# PARTAGE DES DONNÉES" ou "# DESTINATAIRES"

**Style** : Titre de section (voir style général)

### 10.3 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Catégorie
2. Description
3. Informations complémentaires

**Lignes** :
- Destinataire 1 (accès interne)
- Destinataire 2 (accès interne)
- ...
- Destinataire tier 1 (partage externe)
- Destinataire tier 2 (partage externe)
- ...

### 10.4 Destinataires internes (dataAccess)

**Catégorie** : "Destinataire {index + 1}"

**Description** : `dataAccess.name`

**Informations complémentaires** : `dataAccess.additionalInformation`

**Données** : Tableau `dataAccess`

**Exemples** :
- Destinataire 1 | Service RH | Gestion des candidatures
- Destinataire 2 | Direction | Validation des embauches

### 10.5 Destinataires externes (sharedData)

**Catégorie** : "Destinataire tier {index + 1}"

**Description** : `sharedData.name`

**Informations complémentaires** : `sharedData.additionalInformation`

**Données** : Tableau `sharedData`

**Exemples** :
- Destinataire tier 1 | Agence d'intérim | Sourcing de candidats
- Destinataire tier 2 | Prestataire de paie | Calcul des salaires

### 10.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # PARTAGE DES DONNÉES                                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Catégorie        │ Description │ Informations            │  │
│  │                  │             │ complémentaires         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Destinataire 1   │ Service RH  │ Gestion des candidatures│  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Destinataire 2   │ Direction   │ Validation des          │  │
│  │                  │             │ embauches               │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Destinataire     │ Agence      │ Sourcing de candidats   │  │
│  │ tier 1           │ d'intérim   │                         │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Destinataire     │ Prestataire │ Calcul des salaires     │  │
│  │ tier 2           │ de paie     │                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 11. Section 8 : Mesures de sécurité

### 11.1 Objectif

Afficher les **mesures de sécurité** mises en place pour protéger les données.

**Obligation RGPD** : Article 30.1.g - Le registre doit contenir une description générale des mesures de sécurité techniques et organisationnelles.

### 11.2 Titre de la section

**Texte** : "# MESURES DE SÉCURITÉ"

**Style** : Titre de section (voir style général)

### 11.3 Condition d'affichage

**Affichage** : Si `securitySetup.length > 0`

**Masquage** : Si aucune mesure de sécurité n'est renseignée

### 11.4 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Description (30% de largeur)
2. Informations complémentaires (70% de largeur)

**Lignes** : Une ligne par mesure de sécurité

### 11.5 Données affichées

**Pour chaque mesure** dans `securitySetup` :

**Colonne "Description"** : `securitySetup.name`

**Colonne "Informations complémentaires"** : `securitySetup.additionalInformation`

**Exemples** :
- Chiffrement des données | Chiffrement AES-256 pour les données au repos
- Double authentification | 2FA obligatoire pour tous les comptes administrateurs
- Sauvegardes régulières | Sauvegardes quotidiennes automatiques

### 11.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # MESURES DE SÉCURITÉ                                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Description      │ Informations complémentaires          │  │
│  │ (30%)            │ (70%)                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Chiffrement des  │ Chiffrement AES-256 pour les données  │  │
│  │ données          │ au repos, TLS 1.3 pour les données en │  │
│  │                  │ transit                               │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Double           │ 2FA obligatoire pour tous les comptes │  │
│  │ authentification │ administrateurs                       │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Sauvegardes      │ Sauvegardes quotidiennes automatiques │  │
│  │ régulières       │ à 2h, conservation 30 jours           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. Section 9 : Transferts hors UE

### 12.1 Objectif

Afficher les **transferts de données vers des pays tiers** (hors Union Européenne).

**Obligation RGPD** : Article 30.1.e - Le registre doit contenir les transferts de données vers un pays tiers ou une organisation internationale.

### 12.2 Titre de la section

**Texte** : "# TRANSFERTS DE DONNÉES HORS UE"

**Style** : Titre de section (voir style général)

### 12.3 Condition d'affichage

**Affichage** : Si `areDataExportedOutsideEU = true`

**Masquage** : Si `areDataExportedOutsideEU = false` (pas de transferts hors UE)

### 12.4 Structure de la table

**Type** : Table HTML avec en-têtes et lignes

**Colonnes** :
1. Acteurs impliqués
2. Destinataire
3. Pays du destinataire
4. Types de garanties
5. Lien vers le document

**Lignes** : Une ligne (destinataire unique)

### 12.5 Données affichées

**Colonne "Acteurs impliqués"** : "Organisme destinataire"

**Colonne "Destinataire"** : `recipient.fullName`

**Colonne "Pays du destinataire"** : `recipient.country`

**Colonne "Types de garanties"** : `recipient.guaranteeTypes`

**Colonne "Lien vers le document"** : `recipient.linkToDoc`

**Exemples** :
- Organisme destinataire | AWS Inc. | États-Unis | Clauses contractuelles types | https://aws.amazon.com/compliance/gdpr/

### 12.6 Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # TRANSFERTS DE DONNÉES HORS UE                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Acteurs   │ Destinataire│ Pays │ Types de │ Lien vers   │  │
│  │ impliqués │             │      │ garanties│ le document │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Organisme │ AWS Inc.    │ USA  │ Clauses  │ https://... │  │
│  │ destinat. │             │      │ contract.│             │  │
│  │           │             │      │ types    │             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 13. Structure des données

### 13.1 Modèle de données complet

**Endpoint** : `GET /api/v1/treatments/{id}`

**Réponse** :
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "validated",
  "creationDate": "2026-01-15T10:30:00Z",
  "updateDate": "2026-02-18T16:45:00Z",
  "order": 1,
  "data": {
    "title": "Gestion des candidatures",
    "treatmentType": "RH",
    "responsible": {
      "fullName": "Acme Inc.",
      "entityNumber": "123456789",
      "address": {
        "streetAndNumber": "1 rue de la Paix",
        "postalCode": "75001",
        "city": "Paris",
        "country": "France",
        "phone": "+33 1 23 45 67 89",
        "email": "contact@acme.com"
      }
    },
    "hasDPO": true,
    "DPO": {
      "fullName": "Jean Dupont",
      "address": {
        "streetAndNumber": "2 avenue des Champs",
        "postalCode": "75002",
        "city": "Paris",
        "country": "France",
        "phone": "+33 1 98 76 54 32",
        "email": "dpo@acme.com"
      }
    },
    "hasExternalDPO": true,
    "externalOrganizationDPO": {
      "fullName": "DPO Services",
      "entityNumber": "987654321",
      "address": {
        "streetAndNumber": "3 boulevard Saint-Germain",
        "postalCode": "75003",
        "city": "Paris",
        "country": "France",
        "phone": "+33 1 11 22 33 44",
        "email": "contact@dpo-services.com"
      }
    },
    "reasons": ["Recrutement"],
    "subReasons": [
      {
        "name": "Entretiens téléphoniques",
        "moreInfo": "Prise de contact avec les candidats"
      },
      {
        "name": "Tests techniques",
        "moreInfo": "Évaluation des compétences"
      }
    ],
    "personalDataGroup": {
      "data": {
        "name": [
          { "name": "Nom", "isSensitive": false },
          { "name": "Prénom", "isSensitive": false },
          { "name": "Email", "isSensitive": false },
          { "name": "Numéro de sécurité sociale", "isSensitive": true }
        ]
      },
      "conservationDuration": "5 ans après la fin du contrat"
    },
    "financialDataGroup": {
      "data": {
        "name": [
          { "name": "Numéro de carte bancaire", "isSensitive": true },
          { "name": "RIB", "isSensitive": true }
        ]
      },
      "conservationDuration": "10 ans (obligations fiscales)"
    },
    "legalBase": [
      {
        "name": "Exécution d'un contrat",
        "additionalInformation": "Contrat de travail avec le candidat"
      },
      {
        "name": "Intérêt légitime",
        "additionalInformation": "Gestion des candidatures pour le recrutement"
      }
    ],
    "subjectCategories": [
      {
        "name": "Candidats",
        "additionalInformation": "Personnes ayant postulé à une offre d'emploi"
      },
      {
        "name": "Employés",
        "additionalInformation": "Salariés de l'entreprise"
      }
    ],
    "dataAccess": [
      {
        "name": "Service RH",
        "additionalInformation": "Gestion des candidatures"
      },
      {
        "name": "Direction",
        "additionalInformation": "Validation des embauches"
      }
    ],
    "sharedData": [
      {
        "name": "Agence d'intérim",
        "additionalInformation": "Sourcing de candidats"
      }
    ],
    "securitySetup": [
      {
        "name": "Chiffrement des données",
        "additionalInformation": "Chiffrement AES-256 pour les données au repos, TLS 1.3 pour les données en transit"
      },
      {
        "name": "Double authentification",
        "additionalInformation": "2FA obligatoire pour tous les comptes administrateurs"
      },
      {
        "name": "Sauvegardes régulières",
        "additionalInformation": "Sauvegardes quotidiennes automatiques à 2h, conservation 30 jours"
      }
    ],
    "areDataExportedOutsideEU": true,
    "recipient": {
      "fullName": "AWS Inc.",
      "country": "États-Unis",
      "guaranteeTypes": "Clauses contractuelles types",
      "linkToDoc": "https://aws.amazon.com/compliance/gdpr/"
    }
  }
}
```

### 13.2 Types TypeScript

**Treatment** :
```typescript
interface Treatment {
  id: string;
  status: 'draft' | 'validated' | 'archived';
  creationDate: string; // ISO 8601
  updateDate: string; // ISO 8601
  order: number;
  data: TreatmentData;
}
```

**TreatmentData** :
```typescript
interface TreatmentData {
  title: string;
  treatmentType?: string;
  responsible?: Actor;
  hasDPO: boolean;
  DPO?: Person;
  hasExternalDPO?: boolean;
  externalOrganizationDPO?: Actor;
  reasons: string[];
  subReasons: SubReason[];
  personalDataGroup?: DataGroup;
  financialDataGroup?: DataGroup;
  legalBase: LegalBase[];
  subjectCategories: DataSource[];
  dataAccess: DataSource[];
  sharedData: DataSource[];
  securitySetup: SecurityMeasure[];
  areDataExportedOutsideEU: boolean;
  recipient?: Recipient;
}
```

**Actor** :
```typescript
interface Actor {
  fullName: string;
  entityNumber?: string;
  address: Address;
}
```

**Person** :
```typescript
interface Person {
  fullName: string;
  address: Address;
}
```

**Address** :
```typescript
interface Address {
  streetAndNumber: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
}
```

**SubReason** :
```typescript
interface SubReason {
  name: string;
  moreInfo: string;
}
```

**DataGroup** :
```typescript
interface DataGroup {
  data: {
    name: DataItem[];
  };
  conservationDuration?: string;
}
```

**DataItem** :
```typescript
interface DataItem {
  name: string;
  isSensitive: boolean;
}
```

**LegalBase** :
```typescript
interface LegalBase {
  name: string;
  additionalInformation: string;
}
```

**DataSource** :
```typescript
interface DataSource {
  name: string;
  additionalInformation: string;
}
```

**SecurityMeasure** :
```typescript
interface SecurityMeasure {
  name: string;
  additionalInformation: string;
}
```

**Recipient** :
```typescript
interface Recipient {
  fullName: string;
  country: string;
  guaranteeTypes: string;
  linkToDoc: string;
}
```

---

## 14. Intégration API

### 14.1 Récupération d'un traitement

#### Endpoint : GET /api/v1/treatments/{id}

**Méthode** : GET

**Paramètres** :
- `id` : Identifiant unique du traitement (UUID)

**Requête** :
```http
GET /api/v1/treatments/550e8400-e29b-41d4-a716-446655440000 HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Accept: application/json
```

**Réponse (succès)** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "validated",
  "creationDate": "2026-01-15T10:30:00Z",
  "updateDate": "2026-02-18T16:45:00Z",
  "order": 1,
  "data": {
    "title": "Gestion des candidatures",
    ...
  }
}
```

**Réponse (erreur - traitement non trouvé)** :
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": "Treatment not found",
  "message": "Le traitement avec l'ID 550e8400-e29b-41d4-a716-446655440000 n'existe pas"
}
```

**Réponse (erreur - non autorisé)** :
```http
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Forbidden",
  "message": "Vous n'avez pas les permissions pour consulter ce traitement"
}
```

### 14.2 Gestion du cache

**Stratégie** : Cache avec invalidation

**Durée de cache** : 5 minutes

**Invalidation** :
- Après modification du traitement
- Après suppression du traitement
- Après archivage du traitement

**Clé de cache** : `treatment-{id}`

### 14.3 Gestion des erreurs

#### Traitement non trouvé (404)

**Affichage** : Message d'erreur centré

**Texte** : "Traitement non trouvé"

**Action** : Bouton "Retour à la liste"

#### Erreur de chargement (500)

**Affichage** : Message d'erreur centré

**Texte** : "Erreur lors du chargement des données"

**Action** : Bouton "Réessayer"

#### Non autorisé (403)

**Affichage** : Message d'erreur centré

**Texte** : "Vous n'avez pas les permissions pour consulter ce traitement"

**Action** : Bouton "Retour à la liste"

---

## 15. Règles de gestion

### 15.1 Règles d'affichage

#### RG-A1 : Affichage conditionnel des sections

**Règle** : Une section n'est affichée que si elle contient des données.

**Sections concernées** :
- Finalités : Si `reasons.length > 0`
- Données personnelles : Si `personalDataGroup.data.name.length > 0`
- Données financières : Si `financialDataGroup.data.name.length > 0`
- Base légale : Si `legalBase.length > 0`
- Catégories de personnes : Si `subjectCategories.length > 0`
- Mesures de sécurité : Si `securitySetup.length > 0`
- Transferts hors UE : Si `areDataExportedOutsideEU = true`

#### RG-A2 : Colonne conditionnelle "Numéro de l'entité"

**Règle** : La colonne "Numéro de l'entité" n'est affichée que si au moins un acteur a un `entityNumber`.

**Condition** : `responsible.entityNumber` existe OU `externalOrganizationDPO.entityNumber` existe

#### RG-A3 : Affichage du DPO

**Règle** : Si `hasDPO = false`, afficher "N/A" sur toutes les colonnes du DPO.

**Colspan** : 7 (toutes les colonnes sauf "Acteurs impliqués")

#### RG-A4 : Affichage de l'organisation externe du DPO

**Règle** : La ligne "Société du DPO" n'est affichée que si `hasExternalDPO = true`.

#### RG-A5 : Icône de sensibilité

**Règle** : L'icône de sensibilité n'est affichée que si `isSensitive = true`.

**Position** : Centrée verticalement et horizontalement

#### RG-A6 : Durée de conservation

**Règle** : Si `conservationDuration` est vide ou null, afficher "-".

### 15.2 Règles de formatage

#### RG-F1 : Format des dates

**Règle** : Les dates sont affichées au format `dd/MM/yyyy`.

**Exemple** : "15/01/2026"

**Fonction** : `format(date, 'dd/MM/yyyy')`

#### RG-F2 : Liste de finalités

**Règle** : Les finalités principales sont séparées par des virgules.

**Exemple** : "Recrutement, Gestion des candidatures"

**Fonction** : `reasons.join(', ')`

#### RG-F3 : Sous-finalités

**Règle** : Format `{name} : {moreInfo}`

**Exemple** : "Entretiens téléphoniques : Prise de contact avec les candidats"

### 15.3 Règles de navigation

#### RG-N1 : Bouton "Retour"

**Règle** : Le bouton "Retour" redirige vers la liste des traitements.

**URL** : `/dashboard/treatments`

#### RG-N2 : Bouton "Modifier"

**Règle** : Le bouton "Modifier" redirige vers le formulaire d'édition.

**URL** : `/dashboard/treatments/edit/{id}`

**Disponibilité** : Selon les permissions de l'utilisateur

---

## 16. Internationalisation

### 16.1 Clés de traduction - Vue du traitement

**Namespace** : `treatments`

| Clé | Français | Anglais |
|-----|----------|---------|
| `details.title` | Nom du traitement | Treatment Name |
| `details.creationDate` | Date de création du traitement | Treatment Creation Date |
| `details.updateDate` | Mise à jour du traitement | Treatment Update Date |
| `details.description` | Description | Description |
| `details.actors` | Acteurs impliqués | Involved Actors |
| `details.responsible` | Responsable du traitement | Data Controller |
| `details.dpo` | Délégué à la protection des données | Data Protection Officer |
| `details.dpoExternalOrganization` | Société du DPO | DPO Organization |
| `details.fullName` | Nom | Name |
| `details.entityNumber` | Numéro de l'entité | Entity Number |
| `details.address` | Adresse | Address |
| `details.postalCode` | Code Postal | Postal Code |
| `details.city` | Ville | City |
| `details.country` | Pays | Country |
| `details.phone` | Téléphone | Phone |
| `details.email` | Email | Email |
| `details.purposes` | Finalités | Purposes |
| `details.reason` | Finalité principale | Main Purpose |
| `details.subReasons` | Sous-finalités | Sub-purposes |
| `details.additionalInfo` | Informations complémentaires | Additional Information |
| `details.personalDataCategories` | Données personnelles | Personal Data |
| `details.financialCategories` | Données financières | Financial Data |
| `details.isSensitive` | Donnée sensible | Sensitive Data |
| `details.conservationDuration` | Durée de conservation | Retention Period |
| `details.legalBase` | Base légale | Legal Basis |
| `steps.categories` | Catégories de personnes concernées | Data Subject Categories |
| `form.data.sharedData` | Partage des données | Data Sharing |
| `details.category` | Catégorie | Category |
| `details.recipient` | Destinataire | Recipient |
| `details.recipientExternal` | Destinataire tier | External Recipient |
| `details.securityMeasures` | Mesures de sécurité | Security Measures |
| `details.dataTransfers` | Transferts de données hors UE | Data Transfers outside EU |
| `details.EUTransferRecipient` | Organisme destinataire | Recipient Organization |
| `form.security.recipientCountry` | Pays du destinataire | Recipient Country |
| `form.security.guaranteeTypes` | Types de garanties | Guarantee Types |
| `form.security.linkToDoc` | Lien vers le document | Link to Document |
| `noTreatmentFound` | Traitement non trouvé | Treatment not found |
| `loading` | Chargement... | Loading... |
| `errorLoading` | Erreur lors du chargement des données | Error loading data |

### 16.2 Clés communes

**Namespace** : `common`

| Clé | Français | Anglais |
|-----|----------|---------|
| `common:back` | Retour | Back |
| `common:edit` | Modifier | Edit |
| `common:export` | Exporter | Export |
| `common:archive` | Archiver | Archive |
| `common:retry` | Réessayer | Retry |

---

## 17. Accessibilité

### 17.1 Navigation au clavier

#### Bouton "Retour"
- Tab : Focus sur le bouton
- Entrée ou Espace : Retour à la liste

#### Boutons d'action (Modifier, Exporter, Archiver)
- Tab : Navigation entre les boutons
- Entrée ou Espace : Exécution de l'action

#### Tables
- Tab : Navigation entre les cellules
- Flèches : Navigation dans la table (optionnel)

### 17.2 Lecteurs d'écran

#### Attributs ARIA

**Bouton "Retour"** :
- `aria-label="Retour à la liste des traitements"`

**Titres de section** :
- `role="heading"`
- `aria-level="2"`

**Tables** :
- `role="table"`
- `role="rowgroup"` pour thead et tbody
- `role="row"` pour les lignes
- `role="columnheader"` pour les en-têtes
- `role="cell"` pour les cellules

**Icône de sensibilité** :
- `alt="Donnée sensible"`
- `role="img"`

#### Annonces vocales

**Chargement** :
- Annonce : "Chargement du traitement en cours"

**Erreur** :
- Annonce : "Erreur lors du chargement du traitement"

**Traitement chargé** :
- Annonce : "Traitement {title} chargé"

### 17.3 Contraste et visibilité

#### Ratios de contraste (WCAG AA)

**Texte normal** : Minimum 4.5:1
- Texte blanc sur fond sombre : ✅ Conforme

**Titres de section** : Minimum 3:1
- Texte coloré (or/bleu) sur fond sombre : ✅ Conforme

**Icône de sensibilité** :
- Contraste minimum : 3:1
- Visible sur le fond : ✅ Conforme

#### États de focus

**Tous les éléments interactifs** :
- Outline : 2px solid bleu primaire
- Offset : 2px

### 17.4 Responsive design

#### Desktop (> 960px)
- Tables : Largeur maximale 1440px
- Colonnes : Largeurs fixes ou pourcentages

#### Tablet (600px - 960px)
- Tables : Largeur 90% de l'écran
- Colonnes : Largeurs adaptatives

#### Mobile (< 600px)
- Tables : Scroll horizontal si nécessaire
- Colonnes : Largeurs minimales
- Affichage alternatif : Liste au lieu de table (optionnel)

---

## 18. Cas d'usage détaillés

### 18.1 Cas d'usage 1 : Consultation d'un traitement complet

**Contexte** : Un utilisateur veut consulter tous les détails d'un traitement RH.

**Scénario** :
1. L'utilisateur clique sur un traitement dans la liste
2. Redirection vers `/dashboard/treatments/view/{id}`
3. Affichage du loader pendant le chargement
4. Affichage de l'en-tête : Titre, date de création, date de mise à jour
5. Affichage de la section "Description" avec le responsable, le DPO et l'organisation externe
6. Affichage de la section "Finalités" avec la finalité principale et les sous-finalités
7. Affichage de la section "Données personnelles" avec 4 données dont 1 sensible
8. Affichage de la section "Données financières" avec 2 données sensibles
9. Affichage de la section "Base légale" avec 2 bases légales
10. Affichage de la section "Catégories de personnes" avec 2 catégories
11. Affichage de la section "Destinataires" avec 2 destinataires internes et 1 externe
12. Affichage de la section "Mesures de sécurité" avec 3 mesures
13. Affichage de la section "Transferts hors UE" avec 1 destinataire
14. L'utilisateur peut cliquer sur "Retour" pour revenir à la liste

### 18.2 Cas d'usage 2 : Consultation d'un traitement sans DPO

**Contexte** : Un traitement n'a pas de DPO désigné.

**Scénario** :
1. L'utilisateur ouvre un traitement avec `hasDPO = false`
2. Affichage de la section "Description"
3. Ligne "Responsable du traitement" : Données complètes
4. Ligne "Délégué à la protection des données" : "N/A" sur toutes les colonnes (colspan=7)
5. Ligne "Société du DPO" : Non affichée (car `hasExternalDPO = false`)

### 18.3 Cas d'usage 3 : Consultation d'un traitement sans transferts hors UE

**Contexte** : Un traitement ne comporte pas de transferts hors UE.

**Scénario** :
1. L'utilisateur ouvre un traitement avec `areDataExportedOutsideEU = false`
2. Toutes les sections s'affichent normalement
3. La section "Transferts hors UE" n'est pas affichée

### 18.4 Cas d'usage 4 : Consultation d'un traitement minimal

**Contexte** : Un traitement en brouillon avec peu de données renseignées.

**Scénario** :
1. L'utilisateur ouvre un traitement avec :
   - Titre : "Nouveau traitement"
   - Responsable : Renseigné
   - DPO : Non renseigné (`hasDPO = false`)
   - Finalités : Vide (`reasons = []`)
   - Données : Vide
   - Base légale : Vide
   - Mesures de sécurité : Vide
2. Affichage de l'en-tête : Titre, dates
3. Affichage de la section "Description" avec le responsable et "N/A" pour le DPO
4. Sections "Finalités", "Données", "Base légale", "Mesures de sécurité" : Non affichées (car vides)
5. Section "Destinataires" : Affichée (toujours affichée même si vide)

### 18.5 Cas d'usage 5 : Erreur de chargement

**Contexte** : Le traitement n'existe pas ou l'utilisateur n'a pas les permissions.

**Scénario** :
1. L'utilisateur tente d'accéder à `/dashboard/treatments/view/invalid-id`
2. Requête API : `GET /api/v1/treatments/invalid-id`
3. Réponse : 404 Not Found
4. Affichage d'un message d'erreur : "Traitement non trouvé"
5. Bouton "Retour à la liste" affiché
6. Clic sur le bouton → Redirection vers `/dashboard/treatments`

### 18.6 Cas d'usage 6 : Modification d'un traitement

**Contexte** : Un utilisateur veut modifier un traitement après consultation.

**Scénario** :
1. L'utilisateur consulte un traitement
2. Il clique sur le bouton "Modifier" (en haut à droite)
3. Redirection vers `/dashboard/treatments/edit/{id}`
4. Le formulaire d'édition s'ouvre avec les données du traitement

### 18.7 Cas d'usage 7 : Export d'un traitement

**Contexte** : Un utilisateur veut exporter un traitement en PDF.

**Scénario** :
1. L'utilisateur consulte un traitement
2. Il clique sur le bouton "Exporter" (en haut à droite)
3. Une modale s'ouvre avec les options d'export (PDF, Excel)
4. Il sélectionne "PDF"
5. Le fichier PDF est généré et téléchargé
6. Le PDF contient toutes les sections du traitement

---

## 19. Maquettes et wireframes

### 19.1 Vue d'ensemble de la page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [ ← Retour ]                           [ Modifier ] [ Exporter]│
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ EN-TÊTE DU TRAITEMENT                                     │ │
│  │                                                           │ │
│  │  Nom du traitement    Date de création    Mise à jour    │ │
│  │  Gestion des          15/01/2026          18/02/2026     │ │
│  │  candidatures                                             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # INFORMATIONS GÉNÉRALES                                  │ │
│  │                                                           │ │
│  │ [Table avec responsable, DPO, organisation externe]      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # FINALITÉS                                               │ │
│  │                                                           │ │
│  │ [Table avec finalité principale et sous-finalités]       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # DONNÉES PERSONNELLES                                    │ │
│  │                                                           │ │
│  │ [Table avec données et icônes de sensibilité]            │ │
│  │ Durée de conservation : 5 ans                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # DONNÉES FINANCIÈRES                                     │ │
│  │                                                           │ │
│  │ [Table avec données et icônes de sensibilité]            │ │
│  │ Durée de conservation : 10 ans                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # BASE LÉGALE                                             │ │
│  │                                                           │ │
│  │ [Table avec bases légales]                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # CATÉGORIES DE PERSONNES CONCERNÉES                      │ │
│  │                                                           │ │
│  │ [Table avec catégories]                                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # PARTAGE DES DONNÉES                                     │ │
│  │                                                           │ │
│  │ [Table avec destinataires internes et externes]          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # MESURES DE SÉCURITÉ                                     │ │
│  │                                                           │ │
│  │ [Table avec mesures de sécurité]                         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ # TRANSFERTS DE DONNÉES HORS UE                           │ │
│  │                                                           │ │
│  │ [Table avec destinataire hors UE]                        │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 19.2 Détail d'une table standard

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  # SECTION TITLE                                                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Description      │ Informations complémentaires          │  │
│  │ (30%)            │ (70%)                                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Élément 1        │ Détails de l'élément 1                │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Élément 2        │ Détails de l'élément 2                │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Élément 3        │ Détails de l'élément 3                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 19.3 Style des tables

**Caractéristiques visuelles** :

**En-têtes** :
- Couleur : Primaire (#37BCF8)
- Poids : 600
- Taille : 0.8rem
- Alignement : Centré
- Bordure inférieure : Aucune

**Lignes** :
- Fond alterné : Lignes impaires avec fond gris semi-transparent (#D9D9D91A)
- Padding : 16px
- Bordure inférieure : Aucune

**Première colonne** :
- Alignement : Droite
- Largeur : 210px
- Séparateur vertical : Ligne blanche semi-transparente (#FFFFFF1A) à droite
- Bordure arrondie : 8px à gauche

**Dernière colonne** :
- Bordure arrondie : 8px à droite

---

## 20. Annexes

### 20.1 Exemple de traitement complet

**Traitement** : Gestion des candidatures

**Responsable** : Acme Inc.

**DPO** : Jean Dupont

**Organisation externe du DPO** : DPO Services

**Finalités** :
- Recrutement
- Sous-finalités : Entretiens téléphoniques, Tests techniques

**Données personnelles** :
- Nom, Prénom, Email, Numéro de sécurité sociale (sensible)
- Durée de conservation : 5 ans

**Données financières** :
- Numéro de carte bancaire (sensible), RIB (sensible)
- Durée de conservation : 10 ans

**Base légale** :
- Exécution d'un contrat
- Intérêt légitime

**Catégories de personnes** :
- Candidats
- Employés

**Destinataires** :
- Service RH (interne)
- Direction (interne)
- Agence d'intérim (externe)

**Mesures de sécurité** :
- Chiffrement des données
- Double authentification
- Sauvegardes régulières

**Transferts hors UE** :
- AWS Inc. (États-Unis)

### 20.2 Exemple de traitement minimal

**Traitement** : Newsletter marketing

**Responsable** : Acme Inc.

**DPO** : Non

**Finalités** :
- Marketing

**Données personnelles** :
- Email
- Durée de conservation : 3 ans

**Base légale** :
- Consentement

**Catégories de personnes** :
- Abonnés

**Destinataires** :
- Service marketing (interne)

**Mesures de sécurité** :
- Chiffrement des données

**Transferts hors UE** : Non

### 20.3 Checklist de vérification

**Avant de publier la vue d'un traitement** :

☐ **Affichage de l'en-tête**
   - Titre du traitement
   - Date de création
   - Date de mise à jour

☐ **Section Description**
   - Responsable du traitement
   - DPO (ou "N/A" si non renseigné)
   - Organisation externe du DPO (si applicable)

☐ **Section Finalités**
   - Finalité principale
   - Sous-finalités (si présentes)

☐ **Section Données**
   - Données personnelles (si présentes)
   - Données financières (si présentes)
   - Icônes de sensibilité
   - Durée de conservation

☐ **Section Base légale**
   - Bases légales (si présentes)

☐ **Section Catégories de personnes**
   - Catégories (si présentes)

☐ **Section Destinataires**
   - Destinataires internes
   - Destinataires externes

☐ **Section Mesures de sécurité**
   - Mesures (si présentes)

☐ **Section Transferts hors UE**
   - Destinataire hors UE (si applicable)

☐ **Navigation**
   - Bouton "Retour" fonctionnel
   - Boutons d'action (Modifier, Exporter) selon permissions

☐ **Responsive**
   - Desktop : OK
   - Tablet : OK
   - Mobile : OK

☐ **Accessibilité**
   - Navigation au clavier
   - Lecteurs d'écran
   - Contraste

☐ **Gestion des erreurs**
   - Traitement non trouvé
   - Erreur de chargement
   - Non autorisé

### 20.4 Comparaison avec le formulaire

| Aspect | Formulaire (édition) | Vue (consultation) |
|--------|---------------------|-------------------|
| **Mode** | Édition | Lecture seule |
| **Structure** | 8 étapes | 9 sections |
| **Navigation** | Étape par étape | Scroll vertical |
| **Validation** | Oui | Non |
| **Sauvegarde** | Oui | Non |
| **Affichage conditionnel** | Oui | Oui |
| **Responsive** | Oui | Oui |
| **Accessibilité** | Oui | Oui |

### 20.5 Bonnes pratiques d'affichage

✅ **Clarté** : Utiliser des titres de section clairs et des labels explicites

✅ **Hiérarchie** : Respecter la hiérarchie visuelle (titres, sous-titres, contenu)

✅ **Espacement** : Aérer les sections pour faciliter la lecture

✅ **Contraste** : Assurer un contraste suffisant pour la lisibilité

✅ **Responsive** : Adapter l'affichage à tous les écrans

✅ **Performance** : Optimiser le chargement des données

✅ **Accessibilité** : Respecter les normes WCAG AA

✅ **Cohérence** : Utiliser un style cohérent pour toutes les sections

✅ **Feedback** : Afficher des messages clairs en cas d'erreur

✅ **Navigation** : Faciliter le retour à la liste

### 20.6 Évolutions futures possibles

**Export PDF** : Générer un PDF du traitement pour impression ou archivage

**Export Excel** : Exporter les données du traitement dans un fichier Excel

**Impression** : Optimiser l'affichage pour l'impression

**Partage** : Générer un lien de partage sécurisé

**Historique** : Afficher l'historique des modifications

**Commentaires** : Ajouter des commentaires sur le traitement

**Validation** : Workflow de validation par un responsable

**Notifications** : Alertes en cas de modification

**Comparaison** : Comparer deux versions du traitement

**Audit** : Journal des consultations du traitement

---

**Fin du document**

Ce document fournit toutes les informations nécessaires pour implémenter la vue d'un traitement dans n'importe quel framework frontend.
