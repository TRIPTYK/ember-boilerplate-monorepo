# Spécifications Fonctionnelles - Étape 7 du Formulaire de Traitement

## Document de spécifications pour développeur expérimenté

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr Frontend - Gestion des traitements RGPD  

---

## Table des matières

1. [Contexte métier et RGPD](#1-contexte-métier-et-rgpd)
2. [Vue d'ensemble de l'étape 7](#2-vue-densemble-de-létape-7)
3. [Section 1 - Accès aux données](#3-section-1---accès-aux-données)
4. [Section 2 - Partage avec des tiers](#4-section-2---partage-avec-des-tiers)
5. [Section 3 - Transferts hors UE](#5-section-3---transferts-hors-ue)
6. [Modale des précisions](#6-modale-des-précisions)
7. [Structure des données](#7-structure-des-données)
8. [Navigation et validation](#8-navigation-et-validation)
9. [Intégration API](#9-intégration-api)
10. [Règles de gestion](#10-règles-de-gestion)
11. [Internationalisation](#11-internationalisation)
12. [Accessibilité](#12-accessibilité)
13. [Cas d'usage détaillés](#13-cas-dusage-détaillés)
14. [Maquettes et wireframes](#14-maquettes-et-wireframes)
15. [Annexes](#15-annexes)

---

## 1. Contexte métier et RGPD

### 1.1 Principe de transparence et information

**Article 5.1.a du RGPD** : Les données personnelles doivent être traitées de manière **licite, loyale et transparente** au regard de la personne concernée.

**Obligation d'information** : L'organisation doit informer les personnes concernées :
- De l'identité du responsable du traitement
- Des finalités du traitement
- Des destinataires ou catégories de destinataires des données
- De l'existence de transferts vers des pays tiers

**Article 13 et 14 du RGPD** : Informations à fournir lors de la collecte de données.

### 1.2 Destinataires des données

**Définition** : Personne physique ou morale, autorité publique, service ou tout autre organisme qui reçoit communication de données personnelles.

**Types de destinataires** :
- **Destinataires internes** : Employés, services de l'organisation ayant accès aux données
- **Destinataires externes** : Sous-traitants, partenaires, autorités publiques

**Obligation** : Identifier précisément qui a accès aux données et pourquoi.

### 1.3 Sous-traitants

**Article 28 du RGPD** : Un sous-traitant est une personne physique ou morale qui traite des données personnelles **pour le compte** du responsable du traitement.

**Exemples** :
- Hébergeur de données
- Prestataire de services informatiques
- Agence marketing
- Centre d'appels externalisé
- Service de paie externalisé

**Obligations** :
- Contrat de sous-traitance obligatoire
- Le sous-traitant doit garantir la sécurité des données
- Le responsable du traitement reste responsable de la conformité

### 1.4 Transferts hors Union Européenne

**Principe** : Les données personnelles bénéficient d'un niveau de protection élevé dans l'UE. Les transferts vers des pays tiers doivent garantir un niveau de protection **équivalent**.

**Article 44 à 50 du RGPD** : Encadrement des transferts internationaux

**Conditions** :
1. **Décision d'adéquation** : La Commission européenne reconnaît que le pays offre un niveau de protection adéquat
2. **Garanties appropriées** : Clauses contractuelles types, règles d'entreprise contraignantes, codes de conduite
3. **Dérogations** : Consentement explicite, nécessité contractuelle, intérêt public

**Pays avec décision d'adéquation** (exemples) :
- Suisse
- Royaume-Uni
- Canada (partiellement)
- Japon
- Nouvelle-Zélande
- Israël

**Pays sans décision d'adéquation** (exemples) :
- États-Unis (nécessite des garanties - Data Privacy Framework)
- Chine
- Inde
- Russie
- Brésil

**Risques** :
- Accès par les autorités du pays tiers
- Législation de surveillance de masse
- Absence de recours effectifs
- Niveau de protection insuffisant

**Documentation obligatoire** :
- Nom du destinataire
- Pays de destination
- Garanties mises en place (clauses contractuelles, BCR, etc.)
- Lien vers les documents (contrat, clauses, etc.)

---

## 2. Vue d'ensemble de l'étape 7

### 2.1 Objectif de l'étape

L'étape 7 permet de documenter **qui a accès aux données** et **avec qui elles sont partagées**, ainsi que les éventuels **transferts hors UE**.

**Questions posées** :
1. "Qui a accès aux données collectées ?" (Accès interne)
2. "Les données sont-elles partagées avec des tiers ?" (Partage externe)
3. "Les données sont-elles exportées hors UE ?" (Transferts internationaux)

### 2.2 Structure de l'étape

L'étape 7 est divisée en **3 sections distinctes**, affichées côte à côte (layout horizontal) :

```
┌─────────────────────────────────────────────────────────────────┐
│              Étape 7 - Partage des données                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┐
│   Section 1 │  Section 2  │  Section 3  │
│             │             │             │
│   Accès aux │   Partage   │  Transferts │
│   données   │   avec des  │   hors UE   │
│             │   tiers     │             │
└─────────────┴─────────────┴─────────────┘
```

**Caractéristiques** :
- 3 cartes de même hauteur
- Affichage en ligne (row)
- Largeur maximale totale : 1600px
- Espacement entre les cartes : 16px
- Hauteur minimale : 700px (pour garantir l'alignement)

### 2.3 Titre de l'étape

**Affichage** :
```
Étape 7 - Partage des données
```

**Position** : Centré en haut de la page

**Style** : Titre de niveau 4 (H4)

### 2.4 Layout responsive

#### Desktop (> 1200px)
- 3 colonnes côte à côte
- Largeur égale pour chaque carte
- Hauteur identique (700px minimum)

#### Tablet (768px - 1200px)
- 3 colonnes côte à côte (réduites)
- Scroll horizontal si nécessaire

#### Mobile (< 768px)
- 1 colonne
- Cartes empilées verticalement
- Pleine largeur

---

## 3. Section 1 - Accès aux données

### 3.1 Objectif métier

Identifier **qui**, au sein de l'organisation, a accès aux données collectées.

**Question posée** : "Qui a accès aux données collectées ?"

**Importance** :
- Principe de limitation de l'accès (need to know)
- Traçabilité des accès
- Gestion des habilitations
- Responsabilisation des acteurs

### 3.2 Composant de sélection

**Type** : Groupe d'options avec recherche (SearchableOptionsGroup)

**Fonctionnement** : Identique aux étapes 3, 4 et 6

**Particularités** :
- Pas de gestion de la sensibilité
- Bouton "Précisions" pour ajouter des détails

### 3.3 Options prédéfinies

Liste des 6 types d'accès standards :

1. **Employés**
   - Type : Accès interne général
   - Exemples : Tous les employés, employés d'un service spécifique
   - Métier : Personnel ayant besoin d'accéder aux données pour leur travail

2. **Administrateurs**
   - Type : Accès privilégié
   - Exemples : Administrateurs système, administrateurs applicatifs
   - Métier : Personnel ayant des droits étendus sur les systèmes

3. **Gestionnaires**
   - Type : Accès de gestion
   - Exemples : Managers, responsables de service
   - Métier : Personnel encadrant ayant besoin d'accéder aux données de leur équipe

4. **Fournisseurs externes**
   - Type : Accès sous-traitant
   - Exemples : Prestataires informatiques, agences
   - Métier : Sous-traitants traitant les données pour le compte de l'organisation

5. **Équipe technique**
   - Type : Accès technique
   - Exemples : Développeurs, support technique, DevOps
   - Métier : Personnel technique ayant besoin d'accéder aux données pour maintenance

6. **Service client**
   - Type : Accès support
   - Exemples : Conseillers clientèle, support téléphonique
   - Métier : Personnel en contact avec les clients

### 3.4 Barre de recherche / Autocomplete

**Position** : En haut de la section

**Fonctionnement** : Identique aux étapes précédentes

**Comportement** :
- Saisie avec autocomplétion
- Filtrage en temps réel
- Ajout de valeurs personnalisées
- Réinitialisation après sélection

### 3.5 Zone des options sélectionnées

**Affichage** : Chips colorés en bleu

**Caractéristiques** :
- Couleur de fond : Bleu primaire (#37BCF8)
- Texte : Blanc
- Icône de suppression : Croix (X)
- Bordure arrondie : 7px

**Interaction** :
- Clic sur l'icône X → Retire l'accès de la sélection

### 3.6 Options populaires

**Affichage** : 4 options aléatoires

**Comportement** : Standard

### 3.7 Bouton "Précisions"

**Position** : En bas de la section (margin-top: auto)

**Style** :
- Couleur : Or (#DDB867)
- Texte : "Précisions"
- Largeur : 200px

**Action** : Ouvre une modale pour ajouter des précisions sur chaque type d'accès

**Disponibilité** : Toujours visible (même si aucune option sélectionnée)

### 3.8 Options personnalisées

**Source** : Paramètres de l'application (clé : `customDataAccess`)

**Format** : Tableau de chaînes

**Exemples** :
- "Direction générale"
- "Équipe juridique"
- "Auditeurs externes"
- "Commissaires aux comptes"
- "Consultants"

---

## 4. Section 2 - Partage avec des tiers

### 4.1 Objectif métier

Identifier avec **quels tiers externes** les données sont partagées.

**Question posée** : "Les données sont-elles partagées avec des tiers ?"

**Distinction avec la section 1** :
- **Section 1** : Qui a accès aux données **au sein de l'organisation**
- **Section 2** : Avec qui les données sont **partagées en dehors de l'organisation**

**Importance** :
- Obligation d'information des personnes concernées
- Gestion des contrats de sous-traitance
- Traçabilité des flux de données
- Responsabilité en cas de violation

### 4.2 Composant de sélection

**Type** : Groupe d'options avec recherche (SearchableOptionsGroup)

**Fonctionnement** : Identique à la section 1

### 4.3 Options prédéfinies

Liste des 6 types de tiers standards :

1. **Partenaires**
   - Type : Partenaires commerciaux
   - Exemples : Partenaires de distribution, partenaires technologiques
   - Métier : Organisations avec lesquelles existe un partenariat commercial ou technique

2. **Fournisseurs**
   - Type : Sous-traitants et prestataires
   - Exemples : Hébergeur, service de paie, agence marketing
   - Métier : Prestataires traitant les données pour le compte de l'organisation

3. **Régulateurs**
   - Type : Autorités de contrôle
   - Exemples : CNIL, URSSAF, administration fiscale, DGCCRF
   - Métier : Autorités publiques ayant un droit d'accès légal

4. **Filiales**
   - Type : Groupe d'entreprises
   - Exemples : Filiales du groupe, société mère
   - Métier : Entités juridiques liées partageant des données

5. **Administration publique**
   - Type : Services publics
   - Exemples : Préfecture, tribunal, police, services sociaux
   - Métier : Administrations ayant un droit d'accès légal ou réglementaire

6. **Clients**
   - Type : Destinataires finaux
   - Exemples : Clients B2B, clients finaux
   - Métier : Personnes ou organisations recevant les données dans le cadre du service

### 4.4 Bouton "Précisions"

**Position** : En bas de la section

**Style** : Identique à la section 1

**Action** : Ouvre une modale pour ajouter des précisions sur chaque type de partage

### 4.5 Options personnalisées

**Source** : Paramètres de l'application (clé : `customSharedData`)

**Format** : Tableau de chaînes

**Exemples** :
- "Assurances"
- "Banques"
- "Avocats"
- "Experts-comptables"
- "Organismes de certification"

---

## 5. Section 3 - Transferts hors UE

### 5.1 Objectif métier

Documenter les **transferts de données personnelles vers des pays situés en dehors de l'Union Européenne**.

**Question posée** : "Les données sont-elles exportées hors UE ?"

**Importance critique** :
- Les transferts hors UE sont **strictement encadrés** par le RGPD
- Nécessitent des **garanties appropriées**
- Doivent être **documentés précisément**
- Font l'objet d'un contrôle renforcé de la CNIL

### 5.2 Switch principal

**Type** : Interrupteur (Switch) avec label

**Label** : "Les données sont exportées hors UE"

**Position** : En haut de la section

**État par défaut** : Désactivé (false)

**Comportement** :
- Clic sur le switch → Bascule entre activé/désactivé
- Si activé → Affichage du formulaire de destinataire
- Si désactivé → Masquage du formulaire de destinataire

**Style** :
- Switch standard
- Label à droite du switch
- Alignement horizontal

### 5.3 Formulaire de destinataire hors UE

**Affichage conditionnel** : Visible uniquement si le switch est activé

**Type** : Carte avec 4 champs texte

**Style de la carte** :
- Fond : Transparent
- Bordure : Aucune ou subtile
- Padding : 16px
- Marge supérieure : 16px

#### Champ 1 : Nom du destinataire

**Label** : "Nom du destinataire"

**Type** : Champ texte multiligne

**Caractéristiques** :
- Lignes minimales : 1
- Lignes maximales : 4
- Largeur : 100%
- Obligatoire : Oui (si transfert hors UE activé)
- Placeholder : Aucun

**Exemples de valeurs** :
- "Amazon Web Services (AWS)"
- "Google Cloud Platform"
- "Microsoft Azure"
- "Salesforce Inc."
- "Filiale américaine - XYZ Corp"

**Style** :
- Bordure : Dorée (#DDB867)
- Texte : Blanc
- Label : Blanc

#### Champ 2 : Pays du destinataire

**Label** : "Pays du destinataire"

**Type** : Champ texte multiligne

**Caractéristiques** :
- Lignes minimales : 1
- Lignes maximales : 4
- Largeur : 100%
- Obligatoire : Oui (si transfert hors UE activé)
- Placeholder : Aucun

**Exemples de valeurs** :
- "États-Unis"
- "Royaume-Uni"
- "Suisse"
- "Canada"
- "Singapour"

**Style** : Identique au champ 1

**Note** : Le champ accepte du texte libre (pas de liste déroulante de pays)

#### Champ 3 : Types de garanties

**Label** : "Types de garanties"

**Type** : Champ texte multiligne

**Caractéristiques** :
- Lignes minimales : 1
- Lignes maximales : 4
- Largeur : 100%
- Obligatoire : Oui (si transfert hors UE activé)
- Placeholder : Aucun

**Exemples de valeurs** :
- "Clauses contractuelles types de la Commission européenne"
- "Règles d'entreprise contraignantes (BCR)"
- "Décision d'adéquation de la Commission européenne"
- "Certification (Privacy Shield, etc.)"
- "Code de conduite approuvé"
- "Mécanisme de certification approuvé"

**Métier** : Les garanties sont les mécanismes juridiques qui assurent un niveau de protection adéquat des données dans le pays tiers.

**Style** : Identique aux champs précédents

#### Champ 4 : Lien vers le document

**Label** : "Lien vers le document"

**Type** : Champ texte multiligne

**Caractéristiques** :
- Lignes minimales : 1
- Lignes maximales : 4
- Largeur : 100%
- Obligatoire : Non
- Placeholder : Aucun

**Exemples de valeurs** :
- "https://aws.amazon.com/fr/compliance/gdpr-center/"
- "https://cloud.google.com/privacy/gdpr"
- "Contrat de sous-traitance signé le 15/01/2026 - Réf: CST-2026-001"
- "Clauses contractuelles types - Document interne REF-CCT-2026"

**Métier** : Permet de référencer les documents prouvant les garanties mises en place.

**Style** : Identique aux champs précédents

### 5.4 Titre de la section

**Texte** : "Données hors UE"

**Position** : En haut de la section

**Style** : Titre de niveau 6 (H6)

### 5.5 Sous-titre

**Texte** : "Informations sur le destinataire"

**Position** : Au-dessus des champs (si switch activé)

**Style** : Sous-titre

**Affichage conditionnel** : Visible uniquement si le switch est activé

---

## 6. Modale des précisions

### 6.1 Modale pour l'accès aux données (Section 1)

**Déclencheur** : Clic sur le bouton "Précisions" de la section 1

**Titre** : "Détails de l'accès aux données"

**Dimensions** :
- Largeur : 90% de l'écran (max 800px)
- Hauteur maximale : 70% de la hauteur de l'écran
- Scroll vertical si contenu déborde

**Style** :
- Fond : Noir foncé (#111827)
- Bordure arrondie : 19px
- Padding : 24px
- Overlay semi-transparent

**Contenu** : Liste des champs texte pour chaque type d'accès sélectionné

#### Champs de précisions

**Génération automatique** : Un champ texte pour chaque option sélectionnée dans la section 1

**Pour chaque type d'accès** :

**Champ texte multiligne** :
- Label : Nom du type d'accès (ex: "Employés")
- Type : Textarea
- Lignes minimales : 1
- Lignes maximales : 40
- Largeur : 100%
- Placeholder : "Ex: Accès aux serveurs internes"
- Valeur par défaut : Vide ou valeur précédemment saisie
- Style : Bordure dorée (#DDB867)

**Exemples de précisions** :
- Employés : "Employés du service RH ayant accès au système de gestion des paies"
- Administrateurs : "Administrateurs système ayant accès complet aux bases de données"
- Service client : "Conseillers clientèle ayant accès en lecture seule aux données clients"

**Layout** :
- Un champ par ligne
- Espacement vertical : 16px
- Scroll si plus de 5-6 types d'accès

#### Boutons de la modale

**Bouton "Enregistrer"** :
- Position : En bas à droite
- Action : Ferme la modale et sauvegarde les précisions

**Bouton "Annuler"** :
- Position : En bas à gauche
- Action : Ferme la modale (modifications conservées)

**Clic en dehors** : Ferme la modale

### 6.2 Modale pour le partage avec des tiers (Section 2)

**Déclencheur** : Clic sur le bouton "Précisions" de la section 2

**Titre** : "Détails du partage des données"

**Fonctionnement** : Identique à la modale de la section 1

**Contenu** : Liste des champs texte pour chaque type de partage sélectionné

**Exemples de précisions** :
- Partenaires : "Partenaires commerciaux pour la co-commercialisation de produits - Contrat de partenariat signé"
- Fournisseurs : "Hébergeur AWS pour le stockage des données - Contrat de sous-traitance en place"
- Régulateurs : "URSSAF pour les déclarations sociales mensuelles"

### 6.3 Gestion des modales

**Règle** : Une seule modale ouverte à la fois

**États** :
- `showDataAccessDetails` : Modale de la section 1
- `showSharedDataDetails` : Modale de la section 2

**Logique** :
- Si section 1 ouverte : Section 2 fermée
- Si section 2 ouverte : Section 1 fermée

---

## 7. Structure des données

### 7.1 Modèle de données - Accès aux données

**Nom du champ** : `dataAccess`

**Type** : Tableau d'objets

**Format** :
```json
{
  "dataAccess": [
    {
      "name": "Employés",
      "additionalInformation": "Employés du service RH ayant accès au système de gestion des paies"
    },
    {
      "name": "Administrateurs",
      "additionalInformation": "Administrateurs système ayant accès complet aux bases de données"
    },
    {
      "name": "Service client",
      "additionalInformation": ""
    }
  ]
}
```

**Contraintes** :
- Minimum : 0 éléments (optionnel)
- Maximum : Illimité (recommandé : 15 max)
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `additionalInformation` : Optionnel, max 2000 caractères

### 7.2 Modèle de données - Partage avec des tiers

**Nom du champ** : `sharedData`

**Type** : Tableau d'objets

**Format** :
```json
{
  "sharedData": [
    {
      "name": "Fournisseurs",
      "additionalInformation": "Hébergeur AWS pour le stockage des données - Contrat de sous-traitance en place"
    },
    {
      "name": "Régulateurs",
      "additionalInformation": "URSSAF pour les déclarations sociales mensuelles"
    }
  ]
}
```

**Contraintes** : Identiques à `dataAccess`

### 7.3 Modèle de données - Transferts hors UE

#### Champ booléen

**Nom du champ** : `areDataExportedOutsideEU`

**Type** : Booléen

**Format** :
```json
{
  "areDataExportedOutsideEU": true
}
```

**Valeurs possibles** :
- `true` : Les données sont exportées hors UE
- `false` : Les données restent dans l'UE

**Par défaut** : `false`

#### Objet destinataire

**Nom du champ** : `recipient`

**Type** : Objet

**Format** :
```json
{
  "recipient": {
    "fullName": "Amazon Web Services (AWS)",
    "country": "États-Unis",
    "guaranteeTypes": "Clauses contractuelles types de la Commission européenne",
    "linkToDoc": "https://aws.amazon.com/fr/compliance/gdpr-center/"
  }
}
```

**Contraintes** :
- `fullName` : Obligatoire si `areDataExportedOutsideEU = true`, max 500 caractères
- `country` : Obligatoire si `areDataExportedOutsideEU = true`, max 200 caractères
- `guaranteeTypes` : Obligatoire si `areDataExportedOutsideEU = true`, max 1000 caractères
- `linkToDoc` : Optionnel, max 2000 caractères

**Valeur par défaut** : Objet vide si `areDataExportedOutsideEU = false`

### 7.4 Sauvegarde dans les paramètres

#### Accès personnalisés

**Clé de paramètre** : `customDataAccess`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customDataAccess",
  "value": [
    "Direction générale",
    "Équipe juridique",
    "Auditeurs externes"
  ]
}
```

#### Partages personnalisés

**Clé de paramètre** : `customSharedData`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customSharedData",
  "value": [
    "Assurances",
    "Banques",
    "Avocats"
  ]
}
```

---

## 8. Navigation et validation

### 8.1 Validation du formulaire

#### Validation côté client

**Déclenchement** : Clic sur "Suivant"

**Règles de validation** :

**Section 1 - Accès aux données** :
- Pas de validation stricte obligatoire
- Les accès peuvent être vides

**Section 2 - Partage avec des tiers** :
- Pas de validation stricte obligatoire
- Les partages peuvent être vides

**Section 3 - Transferts hors UE** :
- Si `areDataExportedOutsideEU = true` :
  - `recipient.fullName` : Obligatoire
  - `recipient.country` : Obligatoire
  - `recipient.guaranteeTypes` : Obligatoire
  - `recipient.linkToDoc` : Optionnel
- Si `areDataExportedOutsideEU = false` :
  - Aucun champ obligatoire

**Messages d'erreur** :
- "Le nom du destinataire est obligatoire si les données sont exportées hors UE"
- "Le pays du destinataire est obligatoire si les données sont exportées hors UE"
- "Les types de garanties sont obligatoires si les données sont exportées hors UE"

#### Validation côté serveur

**Déclenchement** : À la soumission du formulaire

**Endpoint** : `POST /api/v1/treatments/validation`

**Réponse en cas d'erreur** :
```json
[
  {
    "path": ["recipient", "fullName"],
    "message": "Le nom du destinataire est obligatoire si les données sont exportées hors UE"
  },
  {
    "path": ["recipient", "country"],
    "message": "Le pays du destinataire est obligatoire si les données sont exportées hors UE"
  }
]
```

### 8.2 Sauvegarde en brouillon

**Déclenchement** : Clic sur "Enregistrer comme brouillon"

**Comportement** :
- Pas de validation stricte
- Sauvegarde immédiate des données saisies
- Statut du traitement : "Brouillon"

**Endpoint** : `PUT /api/v1/treatments/draft`

### 8.3 Navigation entre les étapes

**Bouton "Précédent"** : Retour à l'étape 6 (Base légale)

**Bouton "Suivant"** : Passage à l'étape 8 (Mesures de sécurité)

**Bouton "Passer"** : Disponible uniquement en mode édition

---

## 9. Intégration API

### 9.1 Récupération des paramètres

#### Endpoint : GET /api/v1/settings/{key}

**Exemples** :
```
GET /api/v1/settings/customDataAccess
GET /api/v1/settings/customSharedData
```

**Réponse - Accès personnalisés** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customDataAccess",
  "value": [
    "Direction générale",
    "Équipe juridique",
    "Auditeurs externes"
  ]
}
```

**Réponse - Partages personnalisés** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customSharedData",
  "value": [
    "Assurances",
    "Banques",
    "Avocats"
  ]
}
```

### 9.2 Mise à jour des paramètres

#### Endpoint : PUT /api/v1/settings

**Requête - Ajout d'un accès personnalisé** :
```http
PUT /api/v1/settings HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "customDataAccess",
  "value": [
    "Direction générale",
    "Équipe juridique",
    "Auditeurs externes",
    "Consultants externes"
  ]
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customDataAccess",
  "value": [
    "Direction générale",
    "Équipe juridique",
    "Auditeurs externes",
    "Consultants externes"
  ]
}
```

### 9.3 Sauvegarde du traitement

#### Endpoint : PUT /api/v1/treatments/draft

**Requête** :
```http
PUT /api/v1/treatments/draft HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Gestion des candidatures",
  "dataAccess": [
    {
      "name": "Employés",
      "additionalInformation": "Employés du service RH"
    },
    {
      "name": "Service client",
      "additionalInformation": ""
    }
  ],
  "sharedData": [
    {
      "name": "Fournisseurs",
      "additionalInformation": "Hébergeur AWS"
    }
  ],
  "areDataExportedOutsideEU": true,
  "recipient": {
    "fullName": "Amazon Web Services (AWS)",
    "country": "États-Unis",
    "guaranteeTypes": "Clauses contractuelles types de la Commission européenne",
    "linkToDoc": "https://aws.amazon.com/fr/compliance/gdpr-center/"
  }
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "draft",
  "creationDate": "2026-02-18T10:30:00Z",
  "updateDate": "2026-02-18T16:15:00Z",
  "order": 1,
  "data": {
    "title": "Gestion des candidatures",
    "dataAccess": [ ... ],
    "sharedData": [ ... ],
    "areDataExportedOutsideEU": true,
    "recipient": { ... },
    ...
  }
}
```

---

## 10. Règles de gestion

### 10.1 Règles métier - Accès aux données

#### RG-AD1 : Accès optionnels

**Règle** : Les types d'accès sont optionnels pour un brouillon.

**Recommandation** : Documenter au moins un type d'accès pour un traitement validé.

#### RG-AD2 : Précisions optionnelles

**Règle** : Les précisions sur les accès sont optionnelles.

**Utilité** : Apportent un niveau de détail supplémentaire pour la documentation.

#### RG-AD3 : Principe du moindre privilège

**Règle métier** : Seules les personnes ayant besoin d'accéder aux données pour leur travail doivent y avoir accès.

**Documentation** : Préciser le périmètre d'accès (lecture seule, modification, suppression).

#### RG-AD4 : Traçabilité des accès

**Recommandation** : Documenter précisément qui a accès et pourquoi.

**Exemples** :
- "Employés du service RH uniquement"
- "Administrateurs système pour la maintenance"
- "Service client en lecture seule"

### 10.2 Règles métier - Partage avec des tiers

#### RG-PT1 : Partages optionnels

**Règle** : Les partages avec des tiers sont optionnels.

**Attention** : Si des données sont partagées, cela doit être documenté.

#### RG-PT2 : Distinction sous-traitant / destinataire

**Règle métier** :
- **Sous-traitant** : Traite les données **pour le compte** du responsable du traitement
- **Destinataire** : Reçoit les données pour **ses propres finalités**

**Conséquence** :
- Sous-traitant : Contrat de sous-traitance obligatoire (article 28 RGPD)
- Destinataire : Information des personnes concernées obligatoire

**Documentation** : Préciser le statut (sous-traitant ou destinataire).

#### RG-PT3 : Contrats de sous-traitance

**Règle métier** : Tout sous-traitant doit avoir un contrat de sous-traitance conforme au RGPD.

**Clauses obligatoires** :
- Objet, durée, nature et finalité du traitement
- Type de données et catégories de personnes concernées
- Obligations et droits du responsable du traitement
- Mesures de sécurité
- Sous-traitance ultérieure
- Assistance au responsable du traitement

**Documentation** : Référencer le contrat dans les précisions.

### 10.3 Règles métier - Transferts hors UE

#### RG-TUE1 : Activation conditionnelle

**Règle** : Les champs de destinataire ne sont affichés que si le switch est activé.

**Raison** : Éviter la saisie de données inutiles si pas de transfert.

#### RG-TUE2 : Champs obligatoires

**Règle** : Si `areDataExportedOutsideEU = true`, les champs suivants sont obligatoires :
- `recipient.fullName`
- `recipient.country`
- `recipient.guaranteeTypes`

**Validation** : Bloque la validation si un champ obligatoire est vide.

#### RG-TUE3 : Garanties appropriées

**Règle métier** : Les transferts hors UE nécessitent des garanties appropriées.

**Types de garanties** :
1. **Décision d'adéquation** : Le pays offre un niveau de protection adéquat (ex: Suisse, Royaume-Uni)
2. **Clauses contractuelles types** : Contrat standard approuvé par la Commission européenne
3. **Règles d'entreprise contraignantes (BCR)** : Règles internes au groupe approuvées par les autorités
4. **Certification** : Mécanisme de certification approuvé (ex: Privacy Shield - obsolète)
5. **Code de conduite** : Code approuvé par une autorité de contrôle

**Documentation** : Préciser le type de garantie et référencer le document.

#### RG-TUE4 : Pays avec décision d'adéquation

**Règle** : Si le pays bénéficie d'une décision d'adéquation, le mentionner dans les garanties.

**Exemples** :
- Suisse : "Décision d'adéquation de la Commission européenne"
- Royaume-Uni : "Décision d'adéquation de la Commission européenne"
- Japon : "Décision d'adéquation de la Commission européenne"

#### RG-TUE5 : Lien vers le document

**Règle** : Le lien vers le document est optionnel mais fortement recommandé.

**Utilité** : Facilite l'audit et la vérification de la conformité.

**Exemples** :
- URL publique (ex: page GDPR du fournisseur)
- Référence interne (ex: "Contrat CST-2026-001")

### 10.4 Règles techniques

#### RT-1 : Synchronisation du switch

**Règle** : Le changement d'état du switch doit :
1. Mettre à jour l'état local `areDataExportedOutsideEU`
2. Mettre à jour le formulaire
3. Afficher/masquer le formulaire de destinataire

#### RT-2 : Réinitialisation des champs

**Règle** : Si le switch est désactivé, les champs de destinataire sont conservés en mémoire.

**Raison** : Éviter la perte de données si l'utilisateur désactive puis réactive le switch.

#### RT-3 : Validation conditionnelle

**Règle** : La validation des champs de destinataire ne s'applique que si le switch est activé.

**Implémentation** : Validation conditionnelle basée sur `areDataExportedOutsideEU`.

#### RT-4 : Masquage automatique des modales

**Règle** : Si toutes les options d'une section sont retirées, la modale de précisions est automatiquement fermée.

**Raison** : Éviter d'afficher une modale vide.

---

## 11. Internationalisation

### 11.1 Clés de traduction - Étape 7

**Namespace** : `treatments`

| Clé | Français | Anglais |
|-----|----------|---------|
| `steps.step7` | Étape 7 | Step 7 |
| `steps.sharedData` | Partage des données | Data Sharing |
| `form.sharedData.dataAccess.title` | Accès aux données | Data Access |
| `form.sharedData.sharedWith.title` | Partage des données avec des tiers | Data Sharing with Third Parties |
| `form.sharedData.exportedOutsideEU` | Données hors UE | Data Outside EU |
| `form.sharedData.checkBoxOutsideEU` | Les données sont exportées hors UE | Data is exported outside the EU |
| `form.sharedData.recipientInfo` | Informations sur le destinataire | Recipient Information |
| `form.sharedData.recipientName` | Nom du destinataire | Recipient Name |
| `form.sharedData.recipientCountry` | Pays du destinataire | Recipient Country |
| `form.sharedData.guaranteeTypes` | Types de garanties | Types of Guarantees |
| `form.sharedData.linkToDoc` | Lien vers le document | Link to Document |
| `form.sharedData.dataAccessDetails` | Détails de l'accès aux données | Data Access Details |
| `form.sharedData.sharedDataDetails` | Détails du partage des données | Data Sharing Details |
| `form.showPrecisions` | Précisions | Additional Details |
| `form.precisionDetailsPlaceholder` | Ex: Accès aux serveurs internes | E.g.: Access to internal servers |

### 11.2 Options standards - Accès aux données

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.shared.dataAccessOptions.Employés` | Employés | Employees |
| `form.shared.dataAccessOptions.Administrateurs` | Administrateurs | Administrators |
| `form.shared.dataAccessOptions.Gestionnaires` | Gestionnaires | Managers |
| `form.shared.dataAccessOptions.Fournisseurs externes` | Fournisseurs externes | External Suppliers |
| `form.shared.dataAccessOptions.Equipe technique` | Équipe technique | Technical Team |
| `form.shared.dataAccessOptions.Service client` | Service client | Customer Service |

### 11.3 Options standards - Partage avec des tiers

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.shared.sharedDataOptions.Partenaires` | Partenaires | Partners |
| `form.shared.sharedDataOptions.Fournisseurs` | Fournisseurs | Suppliers |
| `form.shared.sharedDataOptions.Régulateurs` | Régulateurs | Regulators |
| `form.shared.sharedDataOptions.Subsidiaries` | Filiales | Subsidiaries |
| `form.shared.sharedDataOptions.Public Administration` | Administration publique | Public Administration |
| `form.shared.sharedDataOptions.Customers` | Clients | Customers |

### 11.4 Clés communes

**Namespace** : `common`

| Clé | Français | Anglais |
|-----|----------|---------|
| `common:search` | Rechercher | Search |
| `common:popular` | Populaire | Popular |
| `common:add` | Ajouter | Add |
| `common:save` | Enregistrer | Save |
| `common:cancel` | Annuler | Cancel |

---

## 12. Accessibilité

### 12.1 Navigation au clavier

#### Sections 1 et 2 (Accès et Partage)

**Champ de recherche** :
- Tab : Focus sur le champ
- Flèches haut/bas : Navigation dans les suggestions
- Entrée : Sélection ou ajout
- Échap : Fermeture de la liste

**Chips** :
- Tab : Navigation entre les chips
- Entrée ou Espace : Sélection/Désélection

**Bouton "Précisions"** :
- Tab : Focus sur le bouton
- Entrée ou Espace : Ouverture de la modale

**Modale** :
- Tab : Navigation entre les champs
- Échap : Fermeture de la modale

#### Section 3 (Transferts hors UE)

**Switch** :
- Tab : Focus sur le switch
- Espace : Activation/Désactivation

**Champs texte** :
- Tab : Navigation entre les champs
- Saisie normale

### 12.2 Lecteurs d'écran

#### Attributs ARIA

**Switch** :
- `role="switch"`
- `aria-checked="true/false"`
- `aria-label="Les données sont exportées hors UE"`

**Champs de destinataire** :
- `aria-required="true"` (si switch activé)
- `aria-invalid="true"` (si erreur de validation)
- `aria-describedby="error-message"` (si erreur)

**Modale** :
- `role="dialog"`
- `aria-labelledby="titre-modale"`
- `aria-modal="true"`

#### Annonces vocales

**Activation du switch** :
- Annonce : "Transferts hors UE activés. Formulaire de destinataire affiché."

**Désactivation du switch** :
- Annonce : "Transferts hors UE désactivés. Formulaire de destinataire masqué."

**Ajout d'un accès** :
- Annonce : "[Nom de l'accès] ajouté"

**Ajout d'un partage** :
- Annonce : "[Nom du partage] ajouté"

### 12.3 Contraste et visibilité

#### Ratios de contraste (WCAG AA)

**Texte normal** : Minimum 4.5:1
- Texte blanc sur fond sombre : ✅ Conforme
- Texte noir sur fond bleu : ✅ Conforme

**Switch** :
- Contraste entre les états activé/désactivé : ✅ Conforme

**Bordures** :
- Bordure dorée sur fond sombre : ✅ Conforme

#### États de focus

**Tous les éléments interactifs** :
- Outline : 2px solid bleu primaire
- Offset : 2px

### 12.4 Responsive design

#### Desktop (> 1200px)
- 3 colonnes côte à côte
- Largeur égale : 33% chacune
- Hauteur minimale : 700px

#### Tablet (768px - 1200px)
- 3 colonnes côte à côte (réduites)
- Scroll horizontal si nécessaire

#### Mobile (< 768px)
- 1 colonne
- Cartes empilées verticalement
- Section 1 en premier
- Section 2 en deuxième
- Section 3 en troisième

---

## 13. Cas d'usage détaillés

### 13.1 Cas d'usage 1 : Traitement RH sans transfert hors UE

**Contexte** : Une entreprise française documente son traitement de gestion des paies.

**Section 1 - Accès aux données** :

1. L'utilisateur arrive sur l'étape 7
2. Il sélectionne les types d'accès :
   - "Employés"
   - "Gestionnaires"
   - "Administrateurs"
3. Il clique sur "Précisions"
4. La modale s'ouvre avec 3 champs
5. Il remplit :
   - Employés : "Employés du service RH ayant accès au système de paie"
   - Gestionnaires : "Responsables RH et direction générale"
   - Administrateurs : "Administrateurs système pour la maintenance technique"
6. Il clique sur "Enregistrer"
7. La modale se ferme

**Section 2 - Partage avec des tiers** :

1. Il sélectionne :
   - "Régulateurs"
   - "Fournisseurs"
2. Il clique sur "Précisions"
3. Il remplit :
   - Régulateurs : "URSSAF pour les déclarations sociales mensuelles"
   - Fournisseurs : "Expert-comptable externe pour la gestion comptable"
4. Il clique sur "Enregistrer"

**Section 3 - Transferts hors UE** :

1. Le switch est désactivé (pas de transfert hors UE)
2. Aucun champ n'est affiché
3. Il clique sur "Suivant" → Passage à l'étape 8

### 13.2 Cas d'usage 2 : E-commerce avec hébergement AWS

**Contexte** : Une boutique en ligne hébergée sur AWS (États-Unis).

**Section 1 - Accès aux données** :

1. L'utilisateur sélectionne :
   - "Employés"
   - "Service client"
   - "Équipe technique"
2. Il clique sur "Précisions"
3. Il remplit :
   - Employés : "Équipe commerciale et logistique"
   - Service client : "Conseillers clientèle en lecture seule"
   - Équipe technique : "Développeurs et DevOps pour la maintenance"
4. Il clique sur "Enregistrer"

**Section 2 - Partage avec des tiers** :

1. Il sélectionne :
   - "Fournisseurs"
2. Il clique sur "Précisions"
3. Il remplit :
   - Fournisseurs : "AWS pour l'hébergement, Stripe pour les paiements, SendGrid pour les emails"
4. Il clique sur "Enregistrer"

**Section 3 - Transferts hors UE** :

1. Il active le switch → Formulaire de destinataire s'affiche
2. Il remplit les champs :
   - Nom : "Amazon Web Services (AWS)"
   - Pays : "États-Unis"
   - Garanties : "Clauses contractuelles types de la Commission européenne + Data Privacy Framework"
   - Lien : "https://aws.amazon.com/fr/compliance/gdpr-center/"
3. Il clique sur "Suivant" → Passage à l'étape 8

### 13.3 Cas d'usage 3 : Application SaaS avec sous-traitants multiples

**Contexte** : Une application SaaS utilise plusieurs sous-traitants.

**Section 1 - Accès aux données** :

1. L'utilisateur sélectionne :
   - "Employés"
   - "Administrateurs"
   - "Équipe technique"
2. Pas de précisions ajoutées

**Section 2 - Partage avec des tiers** :

1. Il sélectionne :
   - "Fournisseurs"
2. Il clique sur "Précisions"
3. Il remplit :
   - Fournisseurs : "Sous-traitants : 1) OVH (hébergement France), 2) Mailjet (emails France), 3) Intercom (support USA), 4) Stripe (paiements USA). Contrats de sous-traitance en place pour tous."
4. Il clique sur "Enregistrer"

**Section 3 - Transferts hors UE** :

1. Il active le switch (Intercom et Stripe sont aux USA)
2. Il remplit :
   - Nom : "Intercom Inc. et Stripe Inc."
   - Pays : "États-Unis"
   - Garanties : "Clauses contractuelles types pour les deux sous-traitants"
   - Lien : "Contrats de sous-traitance - Réf: CST-INT-2026 et CST-STR-2026"
3. Il clique sur "Suivant"

### 13.4 Cas d'usage 4 : Modification du statut de transfert

**Contexte** : Une entreprise change d'hébergeur (USA → France).

**Section 3 - Transferts hors UE** :

1. L'utilisateur ouvre un traitement existant en mode édition
2. Il arrive sur l'étape 7
3. Le switch est activé (ancien hébergeur USA)
4. Les champs affichent :
   - Nom : "Amazon Web Services (AWS)"
   - Pays : "États-Unis"
   - Garanties : "Clauses contractuelles types"
   - Lien : "https://aws.amazon.com/..."
5. L'entreprise a migré vers OVH (France)
6. Il désactive le switch
7. Le formulaire de destinataire disparaît
8. Les données sont conservées en mémoire (au cas où)
9. Il clique sur "Suivant"

**Métier** : Les données de l'ancien destinataire sont conservées pour l'historique, mais le champ `areDataExportedOutsideEU` est défini sur `false`.

### 13.5 Cas d'usage 5 : Ajout d'accès personnalisés

**Contexte** : Une entreprise a des acteurs spécifiques non couverts par les options standards.

**Section 1 - Accès aux données** :

1. L'utilisateur arrive sur l'étape 7
2. Il ne trouve pas "Auditeurs externes" dans les options
3. Il tape "Auditeurs externes" dans la recherche
4. Option "Ajouter : Auditeurs externes" apparaît
5. Il clique dessus → Ajout et sélection
6. Il tape "Commissaires aux comptes"
7. Il ajoute cette nouvelle option
8. Il clique sur "Précisions"
9. Il remplit :
   - Auditeurs externes : "Cabinets d'audit mandatés pour les audits annuels"
   - Commissaires aux comptes : "CAC désigné par l'assemblée générale"
10. Il clique sur "Enregistrer"
11. Il clique sur "Suivant"

### 13.6 Cas d'usage 6 : Gestion des erreurs

**Contexte** : L'utilisateur active le transfert hors UE mais ne remplit pas les champs.

**Section 3 - Transferts hors UE** :

1. L'utilisateur active le switch
2. Le formulaire de destinataire s'affiche
3. Il ne remplit aucun champ
4. Il clique sur "Suivant"
5. Validation côté serveur déclenche des erreurs :
   - "Le nom du destinataire est obligatoire"
   - "Le pays du destinataire est obligatoire"
   - "Les types de garanties sont obligatoires"
6. Les messages d'erreur s'affichent sous chaque champ
7. L'utilisateur remplit les champs obligatoires
8. Il clique sur "Suivant"
9. Validation réussie → Passage à l'étape 8

---

## 14. Maquettes et wireframes

### 14.1 Vue d'ensemble de l'étape 7

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                Étape 7 - Partage des données                                    │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────┬────────────────────────────┬────────────────────────────┐
│                            │                            │                            │
│  Section 1                 │  Section 2                 │  Section 3                 │
│  Accès aux données         │  Partage avec des tiers    │  Transferts hors UE        │
│                            │                            │                            │
│  ┌──────────────────────┐  │  ┌──────────────────────┐  │  ┌──────────────────────┐  │
│  │ 🔍 Rechercher...  ▼  │  │  │ 🔍 Rechercher...  ▼  │  │  │ Données hors UE      │  │
│  └──────────────────────┘  │  └──────────────────────┘  │  │                      │  │
│                            │                            │  │ ☐ Les données sont   │  │
│  ┌──────────────────────┐  │  ┌──────────────────────┐  │  │   exportées hors UE  │  │
│  │ Sélectionnés :       │  │  │ Sélectionnés :       │  │  │                      │  │
│  │                      │  │  │                      │  │  └──────────────────────┘  │
│  │ [Employés ✕]        │  │  │ [Fournisseurs ✕]    │  │                            │
│  │ [Service client ✕]  │  │  │ [Régulateurs ✕]     │  │                            │
│  │                      │  │  │                      │  │                            │
│  └──────────────────────┘  │  └──────────────────────┘  │                            │
│                            │                            │                            │
│  Populaire                 │  Populaire                 │                            │
│                            │                            │                            │
│  [Administrateurs]         │  [Partenaires]             │                            │
│  [Gestionnaires]           │  [Filiales]                │                            │
│  [Équipe technique]        │  [Administration]          │                            │
│  [Fournisseurs ext.]       │  [Clients]                 │                            │
│                            │                            │                            │
│  ┌─────────────────────┐  │  ┌─────────────────────┐  │                            │
│  │   Précisions        │  │  │   Précisions        │  │                            │
│  └─────────────────────┘  │  └─────────────────────┘  │                            │
│                            │                            │                            │
└────────────────────────────┴────────────────────────────┴────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  [ ← Précédent ]  [ Enregistrer comme brouillon ]  [ Suivant → ]                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 14.2 Section 3 avec transfert hors UE activé

```
┌────────────────────────────┐
│  Section 3                 │
│  Transferts hors UE        │
│                            │
│  ┌──────────────────────┐  │
│  │ Données hors UE      │  │
│  │                      │  │
│  │ ☑ Les données sont   │  │
│  │   exportées hors UE  │  │
│  └──────────────────────┘  │
│                            │
│  ┌──────────────────────┐  │
│  │ Informations sur le  │  │
│  │ destinataire         │  │
│  │                      │  │
│  │ ┌──────────────────┐ │  │
│  │ │ Nom du           │ │  │
│  │ │ destinataire     │ │  │
│  │ │ AWS              │ │  │
│  │ └──────────────────┘ │  │
│  │                      │  │
│  │ ┌──────────────────┐ │  │
│  │ │ Pays du          │ │  │
│  │ │ destinataire     │ │  │
│  │ │ États-Unis       │ │  │
│  │ └──────────────────┘ │  │
│  │                      │  │
│  │ ┌──────────────────┐ │  │
│  │ │ Types de         │ │  │
│  │ │ garanties        │ │  │
│  │ │ Clauses...       │ │  │
│  │ └──────────────────┘ │  │
│  │                      │  │
│  │ ┌──────────────────┐ │  │
│  │ │ Lien vers le     │ │  │
│  │ │ document         │ │  │
│  │ │ https://aws...   │ │  │
│  │ └──────────────────┘ │  │
│  └──────────────────────┘  │
│                            │
└────────────────────────────┘
```

### 14.3 Modale des précisions - Accès aux données

```
                    ┌───────────────────────────────────────────┐
                    │  Détails de l'accès aux données        ✕  │
                    ├───────────────────────────────────────────┤
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Employés                            │ │
                    │  │ Employés du service RH ayant accès  │ │
                    │  │ au système de gestion des paies     │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Service client                      │ │
                    │  │ Conseillers clientèle en lecture    │ │
                    │  │ seule pour le support               │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Administrateurs                     │ │
                    │  │ Administrateurs système pour la     │ │
                    │  │ maintenance technique               │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │                                           │
                    │  [ Annuler ]           [ Enregistrer ]    │
                    └───────────────────────────────────────────┘
```

### 14.4 Modale des précisions - Partage avec des tiers

```
                    ┌───────────────────────────────────────────┐
                    │  Détails du partage des données        ✕  │
                    ├───────────────────────────────────────────┤
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Fournisseurs                        │ │
                    │  │ Hébergeur AWS pour le stockage des  │ │
                    │  │ données - Contrat de sous-traitance │ │
                    │  │ en place (Réf: CST-AWS-2026)        │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Régulateurs                         │ │
                    │  │ URSSAF pour les déclarations        │ │
                    │  │ sociales mensuelles                 │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │                                           │
                    │  [ Annuler ]           [ Enregistrer ]    │
                    └───────────────────────────────────────────┘
```

---

## 15. Annexes

### 15.1 Distinction accès interne vs partage externe

| Critère | Accès interne (Section 1) | Partage externe (Section 2) |
|---------|---------------------------|----------------------------|
| **Qui** | Employés, services de l'organisation | Tiers, sous-traitants, partenaires |
| **Relation** | Lien de subordination | Contrat de sous-traitance ou partenariat |
| **Responsabilité** | Responsable du traitement | Responsable du traitement (si sous-traitant) ou co-responsable |
| **Documentation** | Liste des services ayant accès | Contrats de sous-traitance obligatoires |
| **Exemples** | Service RH, IT, Direction | Hébergeur, agence marketing, expert-comptable |

### 15.2 Types de garanties pour les transferts hors UE

#### 1. Décision d'adéquation

**Description** : La Commission européenne reconnaît que le pays offre un niveau de protection adéquat.

**Pays concernés** (liste non exhaustive) :
- Andorre
- Argentine
- Canada (organisations commerciales)
- Îles Féroé
- Guernesey
- Israël
- Île de Man
- Japon
- Jersey
- Nouvelle-Zélande
- Corée du Sud
- Suisse
- Royaume-Uni
- Uruguay

**Avantage** : Aucune garantie supplémentaire nécessaire

**Documentation** : Mentionner la décision d'adéquation

#### 2. Clauses contractuelles types (CCT)

**Description** : Contrat standard approuvé par la Commission européenne.

**Types** :
- Responsable → Responsable
- Responsable → Sous-traitant
- Sous-traitant → Sous-traitant
- Sous-traitant → Responsable

**Utilisation** : La plus courante pour les transferts vers les USA

**Documentation** : Référencer le contrat signé avec les CCT

**Lien** : https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_fr

#### 3. Règles d'entreprise contraignantes (BCR)

**Description** : Règles internes à un groupe d'entreprises approuvées par les autorités de protection des données.

**Utilisation** : Pour les groupes internationaux

**Avantage** : Facilite les transferts intra-groupe

**Contrainte** : Procédure d'approbation longue et complexe

**Documentation** : Référencer les BCR approuvées

#### 4. Data Privacy Framework (DPF)

**Description** : Mécanisme pour les transferts UE-USA (successeur du Privacy Shield invalidé en 2020).

**Statut** : Adopté en 2023

**Utilisation** : Pour les entreprises américaines certifiées DPF

**Vérification** : Consulter la liste des entreprises certifiées sur le site du Département du Commerce américain

**Documentation** : Mentionner la certification DPF + clauses contractuelles types

**Lien** : https://www.dataprivacyframework.gov/

#### 5. Consentement explicite

**Description** : La personne concernée consent explicitement au transfert après avoir été informée des risques.

**Conditions** :
- Consentement libre, spécifique, éclairé, univoque
- Information sur les risques du transfert
- Pas de garanties appropriées disponibles

**Utilisation** : Dérogation exceptionnelle

**Attention** : Ne peut pas être utilisé pour des transferts répétés ou massifs

#### 6. Autres dérogations

**Nécessité contractuelle** : Le transfert est nécessaire à l'exécution d'un contrat

**Intérêt public** : Le transfert est nécessaire pour des motifs d'intérêt public

**Intérêts vitaux** : Le transfert est nécessaire pour protéger la vie

**Utilisation** : Dérogations exceptionnelles et limitées

### 15.3 Exemples de destinataires hors UE courants

#### Hébergeurs cloud

| Fournisseur | Pays | Garanties recommandées |
|-------------|------|------------------------|
| Amazon Web Services (AWS) | États-Unis | CCT + DPF |
| Microsoft Azure | États-Unis | CCT + DPF |
| Google Cloud Platform | États-Unis | CCT + DPF |
| Oracle Cloud | États-Unis | CCT + DPF |
| Alibaba Cloud | Chine | CCT |

#### Services SaaS

| Fournisseur | Pays | Garanties recommandées |
|-------------|------|------------------------|
| Salesforce | États-Unis | CCT + DPF |
| HubSpot | États-Unis | CCT + DPF |
| Zendesk | États-Unis | CCT + DPF |
| Intercom | États-Unis | CCT + DPF |
| Mailchimp | États-Unis | CCT + DPF |

#### Services de paiement

| Fournisseur | Pays | Garanties recommandées |
|-------------|------|------------------------|
| Stripe | États-Unis | CCT + DPF |
| PayPal | États-Unis | CCT + DPF |
| Square | États-Unis | CCT + DPF |

#### Outils analytics

| Fournisseur | Pays | Garanties recommandées |
|-------------|------|------------------------|
| Google Analytics | États-Unis | CCT + DPF (ou alternative UE) |
| Mixpanel | États-Unis | CCT + DPF |
| Amplitude | États-Unis | CCT + DPF |

**Recommandation** : Privilégier les alternatives européennes quand c'est possible (OVH, Scaleway, Matomo, etc.).

### 15.4 Checklist de conformité pour les transferts hors UE

**Avant d'activer le transfert hors UE** :

☐ **Identifier le pays de destination**
   - Vérifier s'il bénéficie d'une décision d'adéquation

☐ **Choisir les garanties appropriées**
   - CCT, BCR, DPF, certification, etc.

☐ **Signer les documents nécessaires**
   - Contrat de sous-traitance avec CCT
   - Annexes et documents complémentaires

☐ **Informer les personnes concernées**
   - Mentionner le transfert dans la politique de confidentialité
   - Indiquer le pays et les garanties

☐ **Évaluer les risques**
   - Législation du pays tiers (surveillance, accès gouvernemental)
   - Niveau de protection des données
   - Recours disponibles

☐ **Documenter le transfert**
   - Nom du destinataire
   - Pays
   - Garanties
   - Lien vers les documents

☐ **Mettre à jour le registre des traitements**
   - Documenter dans l'étape 7 du formulaire

☐ **Réviser régulièrement**
   - Vérifier que les garanties sont toujours valides
   - Suivre l'actualité juridique (décisions de justice, nouvelles réglementations)

### 15.5 Glossaire RGPD

**Destinataire** : Personne physique ou morale, autorité publique, service ou tout autre organisme qui reçoit communication de données personnelles.

**Sous-traitant** : Personne physique ou morale qui traite des données personnelles pour le compte du responsable du traitement.

**Responsable du traitement** : Personne physique ou morale qui détermine les finalités et les moyens du traitement.

**Co-responsables** : Deux responsables du traitement ou plus qui déterminent conjointement les finalités et les moyens du traitement.

**Transfert de données** : Transmission de données personnelles vers un pays situé en dehors de l'Union Européenne ou de l'Espace Économique Européen.

**Pays tiers** : Pays situé en dehors de l'Union Européenne et de l'Espace Économique Européen.

**Décision d'adéquation** : Décision de la Commission européenne reconnaissant qu'un pays tiers assure un niveau de protection adéquat.

**Clauses contractuelles types (CCT)** : Contrat standard approuvé par la Commission européenne pour encadrer les transferts de données vers des pays tiers.

**Règles d'entreprise contraignantes (BCR)** : Règles internes à un groupe d'entreprises approuvées par les autorités de protection des données pour encadrer les transferts intra-groupe.

**Data Privacy Framework (DPF)** : Mécanisme pour les transferts UE-USA adopté en 2023 (successeur du Privacy Shield).

**Garanties appropriées** : Mécanismes juridiques assurant un niveau de protection adéquat des données dans un pays tiers.

**Espace Économique Européen (EEE)** : Union Européenne + Islande, Liechtenstein, Norvège.

### 15.6 Références légales

**Textes principaux** :
- **RGPD** : Règlement (UE) 2016/679 du 27 avril 2016
- **Article 44 à 50** : Transferts de données vers des pays tiers
- **Article 28** : Sous-traitants
- **Article 13 et 14** : Information des personnes concernées

**Ressources CNIL** :
- Transferts hors UE : https://www.cnil.fr/fr/transferts-de-donnees-hors-ue
- Clauses contractuelles types : https://www.cnil.fr/fr/les-clauses-contractuelles-types
- Sous-traitance : https://www.cnil.fr/fr/sous-traitance

**Ressources Commission européenne** :
- Décisions d'adéquation : https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_fr
- Clauses contractuelles types : https://ec.europa.eu/info/law/law-topic/data-protection/international-dimension-data-protection/standard-contractual-clauses-scc_fr

**Data Privacy Framework** :
- Site officiel : https://www.dataprivacyframework.gov/
- Liste des entreprises certifiées : https://www.dataprivacyframework.gov/list

### 15.7 Conseils pratiques

#### Pour documenter les accès internes

✅ **Être précis** : "Employés du service RH" plutôt que "Employés"

✅ **Indiquer le niveau d'accès** : Lecture seule, modification, suppression

✅ **Justifier l'accès** : Expliquer pourquoi cet accès est nécessaire

✅ **Limiter les accès** : Principe du moindre privilège (need to know)

✅ **Tracer les accès** : Logs d'accès, habilitations formelles

#### Pour documenter les partages externes

✅ **Identifier précisément le tiers** : Nom complet, raison sociale

✅ **Préciser le rôle** : Sous-traitant ou destinataire

✅ **Référencer les contrats** : Contrat de sous-traitance, DPA (Data Processing Agreement)

✅ **Indiquer la finalité** : Pourquoi les données sont partagées

✅ **Lister les données partagées** : Quelles données exactement

#### Pour documenter les transferts hors UE

✅ **Vérifier la décision d'adéquation** : Consulter le site de la Commission européenne

✅ **Choisir les garanties appropriées** : CCT, BCR, DPF selon le cas

✅ **Signer les documents** : Ne pas se contenter de mentions dans les CGU

✅ **Informer les personnes** : Mentionner le transfert dans la politique de confidentialité

✅ **Évaluer les risques** : Législation du pays, accès gouvernemental, recours

✅ **Documenter précisément** : Nom, pays, garanties, lien vers les documents

✅ **Réviser régulièrement** : Suivre l'actualité juridique (arrêts Schrems, nouvelles décisions)

#### Erreurs fréquentes à éviter

❌ **Oublier de documenter les sous-traitants** : Tous les sous-traitants doivent être listés

❌ **Confondre accès interne et partage externe** : Bien distinguer les deux

❌ **Utiliser des services USA sans garanties** : CCT obligatoires

❌ **Ne pas informer les personnes** : Obligation de transparence

❌ **Oublier les sous-traitants de sous-traitants** : Sous-traitance ultérieure doit être documentée

❌ **Utiliser l'intérêt légitime pour justifier un transfert** : L'intérêt légitime n'est pas une garantie appropriée

### 15.8 Exemples de formulations

#### Précisions sur les accès internes

**Employés** :
- "Employés du service RH ayant accès au système de gestion des paies (10 personnes)"
- "Personnel commercial ayant accès au CRM en lecture seule"
- "Équipe comptabilité pour la gestion des factures"

**Administrateurs** :
- "Administrateurs système ayant accès complet aux bases de données pour la maintenance technique"
- "Administrateurs applicatifs pour la gestion des droits utilisateurs"

**Service client** :
- "Conseillers clientèle ayant accès en lecture seule aux données clients pour le support téléphonique"
- "Équipe support niveau 2 avec accès étendu pour la résolution de problèmes complexes"

#### Précisions sur les partages externes

**Fournisseurs** :
- "OVH pour l'hébergement des données en France - Contrat de sous-traitance signé le 15/01/2026 (Réf: CST-OVH-2026)"
- "SendGrid pour l'envoi des emails transactionnels - DPA en place"
- "Expert-comptable externe pour la gestion comptable - Contrat de prestation avec clause de confidentialité"

**Régulateurs** :
- "URSSAF pour les déclarations sociales mensuelles (DSN)"
- "Administration fiscale pour les déclarations de TVA et impôts sur les sociétés"
- "CNIL en cas de contrôle ou de violation de données"

**Partenaires** :
- "Partenaires de distribution pour la co-commercialisation de produits - Accord de partenariat avec clause de protection des données"
- "Partenaires technologiques pour l'intégration API - Contrat de partenariat avec DPA"

#### Garanties pour les transferts hors UE

**Clauses contractuelles types** :
- "Clauses contractuelles types de la Commission européenne (module 2 : Responsable → Sous-traitant) signées le 20/01/2026"
- "Standard Contractual Clauses (SCC) 2021 en place avec annexes complétées"

**Data Privacy Framework** :
- "Data Privacy Framework - Entreprise certifiée (vérification : https://www.dataprivacyframework.gov/)"
- "DPF + Clauses contractuelles types pour une protection renforcée"

**Décision d'adéquation** :
- "Décision d'adéquation de la Commission européenne pour la Suisse (2000/518/CE)"
- "Décision d'adéquation pour le Royaume-Uni (2021/1772)"

---

## 16. Spécifications techniques d'intégration

### 16.1 Format des requêtes HTTP

#### Validation du traitement avec transfert hors UE

**Requête** :
```http
POST /api/v1/treatments/validation HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Application SaaS",
  "dataAccess": [
    {
      "name": "Employés",
      "additionalInformation": "Équipe technique"
    }
  ],
  "sharedData": [
    {
      "name": "Fournisseurs",
      "additionalInformation": "Hébergeur AWS"
    }
  ],
  "areDataExportedOutsideEU": true,
  "recipient": {
    "fullName": "Amazon Web Services (AWS)",
    "country": "États-Unis",
    "guaranteeTypes": "Clauses contractuelles types + Data Privacy Framework",
    "linkToDoc": "https://aws.amazon.com/fr/compliance/gdpr-center/"
  }
}
```

**Réponse (succès)** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

[]
```

**Réponse (erreur - champs manquants)** :
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

[
  {
    "path": ["recipient", "fullName"],
    "message": "Le nom du destinataire est obligatoire si les données sont exportées hors UE"
  },
  {
    "path": ["recipient", "guaranteeTypes"],
    "message": "Les types de garanties sont obligatoires si les données sont exportées hors UE"
  }
]
```

#### Validation sans transfert hors UE

**Requête** :
```http
POST /api/v1/treatments/validation HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Gestion des paies",
  "dataAccess": [
    {
      "name": "Employés",
      "additionalInformation": "Service RH"
    }
  ],
  "sharedData": [
    {
      "name": "Régulateurs",
      "additionalInformation": "URSSAF"
    }
  ],
  "areDataExportedOutsideEU": false,
  "recipient": {
    "fullName": "",
    "country": "",
    "guaranteeTypes": "",
    "linkToDoc": ""
  }
}
```

**Réponse (succès)** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

[]
```

---

## 17. Règles de validation détaillées

### 17.1 Validation des accès aux données

**Champ `dataAccess`** :
- Type : Tableau d'objets
- Minimum : 0 éléments
- Maximum : Illimité (recommandé : 15 max)
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `additionalInformation` : Optionnel, max 2000 caractères

**Messages d'erreur** :
- `name` vide : "Le nom du type d'accès est obligatoire"
- Trop long : "Le nom ne peut pas dépasser 200 caractères"

### 17.2 Validation du partage avec des tiers

**Champ `sharedData`** :
- Type : Identique à `dataAccess`
- Contraintes : Identiques

**Messages d'erreur** : Identiques à `dataAccess`

### 17.3 Validation des transferts hors UE

**Champ `areDataExportedOutsideEU`** :
- Type : Booléen
- Obligatoire : Oui
- Valeur par défaut : `false`

**Champ `recipient`** (si `areDataExportedOutsideEU = true`) :

**`recipient.fullName`** :
- Obligatoire : Oui
- Type : Chaîne
- Max : 500 caractères
- Message d'erreur : "Le nom du destinataire est obligatoire si les données sont exportées hors UE"

**`recipient.country`** :
- Obligatoire : Oui
- Type : Chaîne
- Max : 200 caractères
- Message d'erreur : "Le pays du destinataire est obligatoire si les données sont exportées hors UE"

**`recipient.guaranteeTypes`** :
- Obligatoire : Oui
- Type : Chaîne
- Max : 1000 caractères
- Message d'erreur : "Les types de garanties sont obligatoires si les données sont exportées hors UE"

**`recipient.linkToDoc`** :
- Obligatoire : Non
- Type : Chaîne
- Max : 2000 caractères
- Validation : Format URL valide (optionnel)

### 17.4 Validation globale

**Cohérence avec les sections précédentes** :

**Vérification 1** : Si des données sont collectées (étape 5), documenter qui y a accès (étape 7, section 1)

**Vérification 2** : Si des sous-traitants sont mentionnés, vérifier qu'ils sont listés dans la section 2

**Vérification 3** : Si un hébergeur hors UE est utilisé, vérifier que le transfert est documenté dans la section 3

---

## 18. Considérations de performance

### 18.1 Chargement des options

**Problème** : Si des centaines d'options personnalisées existent

**Solutions** :
1. Pagination des options (charger par lots)
2. Recherche côté serveur
3. Virtualisation de la liste

### 18.2 Gestion des modales

**Problème** : Deux modales distinctes (accès et partage)

**Solution** : Une seule modale ouverte à la fois

**Implémentation** : États booléens séparés

### 18.3 Synchronisation des états

**Problème** : Synchronisation entre état local, formulaire et paramètres

**Solutions** :
1. Memoization des calculs
2. Éviter les re-renders inutiles
3. Debounce des mises à jour

---

## 19. Sécurité et confidentialité

### 19.1 Validation des entrées

**Côté client** :
- Trim des espaces
- Limitation de la longueur
- Validation du format URL (pour linkToDoc)

**Côté serveur** :
- Validation stricte des types
- Sanitisation des entrées
- Protection contre l'injection

### 19.2 Autorisations

**Lecture** : Utilisateur authentifié

**Écriture** : Utilisateur avec rôle approprié

**Paramètres** : Seuls les administrateurs peuvent supprimer des options

### 19.3 Audit

**Logs** :
- Activation/désactivation des transferts hors UE
- Modification des destinataires hors UE
- Ajout d'accès ou de partages personnalisés

**Informations loggées** :
- Utilisateur
- Date et heure
- Action effectuée
- Données avant/après

---

## 20. Tests et qualité

### 20.1 Tests fonctionnels - Section 1

#### Test 1 : Sélection d'un type d'accès
- Ouvrir l'étape 7
- Cliquer sur "Employés"
- Vérifier l'ajout à la sélection

#### Test 2 : Ajout de précisions
- Sélectionner "Employés"
- Cliquer sur "Précisions"
- Vérifier l'ouverture de la modale
- Remplir le champ
- Cliquer sur "Enregistrer"
- Vérifier la sauvegarde

#### Test 3 : Création d'un accès personnalisé
- Taper "Auditeurs externes"
- Cliquer sur "Ajouter : Auditeurs externes"
- Vérifier l'ajout et la sauvegarde dans les paramètres

### 20.2 Tests fonctionnels - Section 2

**Tests identiques à la section 1**

### 20.3 Tests fonctionnels - Section 3

#### Test 1 : Activation du switch
- Désactiver le switch (état initial)
- Vérifier que le formulaire est masqué
- Activer le switch
- Vérifier que le formulaire s'affiche

#### Test 2 : Remplissage des champs obligatoires
- Activer le switch
- Remplir les 3 champs obligatoires
- Cliquer sur "Suivant"
- Vérifier le passage à l'étape 8

#### Test 3 : Validation des champs obligatoires
- Activer le switch
- Ne pas remplir les champs
- Cliquer sur "Suivant"
- Vérifier l'affichage des erreurs

#### Test 4 : Désactivation après remplissage
- Activer le switch
- Remplir les champs
- Désactiver le switch
- Vérifier que les données sont conservées en mémoire
- Réactiver le switch
- Vérifier que les champs sont pré-remplis

### 20.4 Tests de non-régression

#### Test NR-1 : Compatibilité avec les données existantes
- Ouvrir un traitement créé avec une ancienne version
- Vérifier que les accès s'affichent correctement
- Vérifier que les partages s'affichent correctement
- Vérifier que le transfert hors UE s'affiche correctement

### 20.5 Tests d'accessibilité

#### Test A-1 : Navigation au clavier
- Naviguer dans l'étape 7 uniquement au clavier
- Vérifier que tous les éléments sont accessibles
- Vérifier les états de focus

#### Test A-2 : Lecteur d'écran
- Utiliser un lecteur d'écran
- Vérifier que toutes les informations sont annoncées
- Vérifier que les actions sont compréhensibles

---

**Fin du document**

Ce document fournit toutes les informations nécessaires pour implémenter l'étape 7 du formulaire de traitement dans n'importe quel framework frontend.
