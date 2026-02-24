# Spécifications Fonctionnelles - Étape 5 du Formulaire de Traitement

## Document de spécifications pour développeur expérimenté

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr Frontend - Gestion des traitements RGPD  

---

## Table des matières

1. [Contexte métier et RGPD](#1-contexte-métier-et-rgpd)
2. [Vue d'ensemble de l'étape 5](#2-vue-densemble-de-létape-5)
3. [Section 1 - Données personnelles](#3-section-1---données-personnelles)
4. [Section 2 - Données financières](#4-section-2---données-financières)
5. [Section 3 - Sources des données](#5-section-3---sources-des-données)
6. [Gestion des données sensibles](#6-gestion-des-données-sensibles)
7. [Durée de conservation](#7-durée-de-conservation)
8. [Structure des données](#8-structure-des-données)
9. [Navigation et validation](#9-navigation-et-validation)
10. [Intégration API](#10-intégration-api)
11. [Règles de gestion](#11-règles-de-gestion)
12. [Internationalisation](#12-internationalisation)
13. [Accessibilité](#13-accessibilité)
14. [Cas d'usage détaillés](#14-cas-dusage-détaillés)
15. [Maquettes et wireframes](#15-maquettes-et-wireframes)

---

## 1. Contexte métier et RGPD

### 1.1 Principe de minimisation des données

**Article 5.1.c du RGPD** : Les données personnelles doivent être **adéquates, pertinentes et limitées à ce qui est nécessaire** au regard des finalités pour lesquelles elles sont traitées (principe de minimisation des données).

**Conséquences pratiques** :
- L'organisation doit identifier précisément quelles données sont collectées
- Chaque donnée doit être justifiée par une finalité
- Il ne faut collecter que les données strictement nécessaires
- Les données excessives ou non pertinentes sont interdites

### 1.2 Données personnelles

**Définition** : Toute information se rapportant à une personne physique identifiée ou identifiable.

**Exemples** :
- **Identification directe** : Nom, prénom, photo
- **Identification indirecte** : Numéro de téléphone, email, adresse IP, numéro de sécurité sociale

**Particularité** : Une personne peut être identifiée par le croisement de plusieurs données (ex: une femme, vivant à telle adresse, née tel jour).

### 1.3 Données sensibles

**Article 9 du RGPD** : Certaines catégories de données sont considérées comme **sensibles** et nécessitent une protection renforcée.

**Catégories de données sensibles** :
- Origine raciale ou ethnique
- Opinions politiques
- Convictions religieuses ou philosophiques
- Appartenance syndicale
- Données génétiques
- Données biométriques (pour identifier une personne)
- Données de santé
- Données concernant la vie sexuelle ou l'orientation sexuelle

**Interdiction de principe** : Le traitement de données sensibles est **interdit** sauf exceptions prévues par le RGPD (consentement explicite, intérêt public, etc.).

### 1.4 Données financières

Les **données financières** ne sont pas considérées comme sensibles au sens du RGPD, mais elles nécessitent une protection particulière car elles peuvent :
- Révéler la situation économique d'une personne
- Être utilisées pour des fraudes
- Être soumises à des obligations légales (secret bancaire, etc.)

**Exemples** :
- Comptes bancaires (IBAN, RIB)
- Salaires et revenus
- Dépenses et prêts
- Informations fiscales
- Données comptables

**Dans l'application Registr** : Les données financières sont **automatiquement marquées comme sensibles** pour garantir une protection maximale.

### 1.5 Durée de conservation

**Article 5.1.e du RGPD** : Les données personnelles doivent être **conservées pendant une durée n'excédant pas celle nécessaire** au regard des finalités pour lesquelles elles sont traitées.

**Obligations** :
- Définir une durée de conservation pour chaque catégorie de données
- Justifier cette durée par rapport aux finalités
- Supprimer ou anonymiser les données au-delà de cette durée
- Distinguer les archives courantes, intermédiaires et définitives

**Exemples de durées** :
- Candidatures non retenues : 2 ans maximum
- Données clients : Durée de la relation commerciale + 3 ans
- Données comptables : 10 ans (obligation légale)
- Données de santé : Variable selon le contexte

### 1.6 Sources des données

**Obligation de transparence** : L'organisation doit identifier d'où proviennent les données collectées.

**Importance** :
- Permet d'informer les personnes concernées
- Facilite l'exercice des droits (accès, rectification, effacement)
- Aide à identifier les risques de sécurité
- Nécessaire pour la conformité RGPD

**Exemples de sources** :
- Collecte directe : Formulaire en ligne, contrat signé
- Collecte indirecte : Fichiers clients, partenaires, réseaux sociaux
- Collecte automatique : Cookies, logs, trackers

---

## 2. Vue d'ensemble de l'étape 5

### 2.1 Objectif de l'étape

L'étape 5 permet de documenter **quelles données** sont collectées dans le cadre du traitement. C'est l'étape centrale du registre RGPD.

**Question posée** : "Quelles données collectez-vous ?"

### 2.2 Structure de l'étape

L'étape 5 est divisée en **3 sections distinctes**, affichées côte à côte (layout horizontal) :

```
┌─────────────────────────────────────────────────────────────────┐
│              Étape 5 - Données                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┐
│   Section 1 │  Section 2  │  Section 3  │
│             │             │             │
│   Données   │   Données   │   Sources   │
│ personnelles│ financières │ des données │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

**Caractéristiques** :
- 3 cartes de même hauteur
- Affichage en ligne (row)
- Largeur maximale totale : 1600px
- Espacement entre les cartes : 16px
- Chaque carte est indépendante

### 2.3 Titre de l'étape

**Affichage** :
```
Étape 5 - Données
```

**Position** : Centré en haut de la page

**Style** : Titre de niveau 4 (H4)

### 2.4 Layout responsive

#### Desktop (> 1200px)
- 3 colonnes côte à côte
- Largeur égale pour chaque carte
- Hauteur identique

#### Tablet (768px - 1200px)
- 3 colonnes côte à côte (réduites)
- Scroll horizontal si nécessaire

#### Mobile (< 768px)
- 1 colonne
- Cartes empilées verticalement
- Pleine largeur

---

## 3. Section 1 - Données personnelles

### 3.1 Objectif

Identifier les **données personnelles** collectées (état civil, identité, coordonnées, etc.).

**Question posée** : "Quelles données personnelles collectez-vous ?"

### 3.2 Composant de sélection

**Type** : Groupe d'options avec recherche et gestion de la sensibilité (SearchableOptionsGroupData)

**Particularité** : Chaque donnée peut être marquée comme **sensible** ou **non sensible**.

### 3.3 Options prédéfinies

Liste des 7 données personnelles standards :

1. **Nom**
   - Type : Donnée d'identification
   - Sensible par défaut : Non
   - Exemples : Nom de famille, nom de naissance

2. **Prénom**
   - Type : Donnée d'identification
   - Sensible par défaut : Non
   - Exemples : Prénom usuel, prénoms multiples

3. **Email**
   - Type : Coordonnées
   - Sensible par défaut : Non
   - Exemples : Email professionnel, personnel

4. **Téléphone**
   - Type : Coordonnées
   - Sensible par défaut : Non
   - Exemples : Mobile, fixe, professionnel

5. **Données financières**
   - Type : Référence croisée
   - Sensible par défaut : Non (mais voir section 2)
   - Note : Fait référence à la section 2

6. **Données de santé**
   - Type : Donnée sensible
   - Sensible par défaut : Non (mais devrait être marqué sensible)
   - Exemples : Dossier médical, handicap, allergies
   - **RGPD** : Donnée sensible au sens de l'article 9

7. **Photographie**
   - Type : Donnée biométrique
   - Sensible par défaut : Non
   - Note : Peut être sensible si utilisée pour identification biométrique

### 3.4 Barre de recherche / Autocomplete

**Position** : En haut de la section

**Fonctionnement** : Identique aux étapes 3 et 4

**Comportement** :
- Saisie avec autocomplétion
- Filtrage en temps réel
- Ajout de valeurs personnalisées
- Réinitialisation après sélection

### 3.5 Zone des options sélectionnées

**Affichage** : Chips colorés avec indicateurs de sensibilité

#### Apparence des chips

**Chip standard (non sensible)** :
- Couleur de fond : Bleu primaire (#37BCF8)
- Texte : Noir
- Bordure : 1px blanc semi-transparent
- Icône : Cadenas ouvert (masqué par défaut, visible au hover)

**Chip sensible** :
- Couleur de fond : Or (#DDB867)
- Texte : Noir
- Bordure : 1px or semi-transparent
- Icône : Bouclier de sécurité (visible en permanence)

#### Interactions sur les chips

**1. Hover sur le chip** :
- Affichage de l'icône de sensibilité (si non sensible)
- Affichage de l'icône de menu (3 points verticaux)

**2. Clic sur l'icône de sensibilité** :
- Bascule entre sensible/non sensible
- Changement immédiat de la couleur du chip
- Mise à jour de l'état

**3. Clic droit sur le chip (menu contextuel)** :
- Ouvre un menu avec 2 options :
  - "Marquer comme sensible" / "Marquer comme non sensible"
  - "Supprimer"

**4. Clic sur l'icône de menu (3 points)** :
- Ouvre le même menu contextuel

#### Menu contextuel

**Option 1 : Basculer la sensibilité**
- Icône : Cadenas fermé ou ouvert
- Texte : "Marquer comme sensible" ou "Marquer comme non sensible"
- Action : Inverse l'état de sensibilité

**Option 2 : Supprimer**
- Icône : Poubelle
- Texte : "Supprimer"
- Action : Retire la donnée de la sélection

### 3.6 Options populaires

**Affichage** : 7 chips aléatoires (ou toutes si moins de 7)

**Comportement** : Identique aux étapes précédentes

**Particularité** : Les options populaires ne sont pas marquées comme sensibles par défaut

### 3.7 Champ de durée de conservation

**Position** : En bas de la section (margin-top: auto)

**Type** : Champ texte simple ligne

**Label** : "Durée de conservation"

**Placeholder** : "Ex: 2 ans"

**Comportement** :
- Saisie libre
- Pas de validation stricte du format
- Sauvegarde automatique dans le formulaire
- Optionnel (peut rester vide)

**Exemples de valeurs** :
- "2 ans"
- "3 ans à compter de la fin de la relation commerciale"
- "10 ans (obligation légale)"
- "Durée du contrat + 5 ans"

**Métier** : Cette durée s'applique à **toutes les données personnelles** sélectionnées dans cette section.

### 3.8 Options personnalisées

**Source** : Paramètres de l'application (clé : `customPersonalData`)

**Format** : Tableau d'objets avec `name` et `isSensitive`

**Exemple** :
```json
[
  { "name": "Numéro de badge", "isSensitive": false },
  { "name": "Groupe sanguin", "isSensitive": true }
]
```

**Création** :
1. L'utilisateur tape une nouvelle valeur dans la recherche
2. Option "Ajouter : [nouvelle valeur]" apparaît
3. Clic → Ajout avec `isSensitive: false` par défaut
4. Sauvegarde dans les paramètres

**Conservation de l'état sensible** :
- Si l'utilisateur marque une donnée personnalisée comme sensible
- Cet état est sauvegardé dans les paramètres
- La prochaine fois qu'elle est utilisée, elle conserve cet état

---

## 4. Section 2 - Données financières

### 4.1 Objectif

Identifier les **données financières et économiques** collectées.

**Question posée** : "Quelles informations d'ordre économique et financier récoltez-vous ?"

### 4.2 Composant de sélection

**Type** : Identique à la section 1 (SearchableOptionsGroupData)

**Particularité** : **Toutes les données financières sont automatiquement considérées comme sensibles** dans l'application Registr (même si le RGPD ne les classe pas comme telles).

### 4.3 Options prédéfinies

Liste des 9 données financières standards :

1. **Comptes bancaires**
   - Type : Coordonnées bancaires
   - Exemples : Numéros de compte, relevés bancaires

2. **IBAN ou RIB**
   - Type : Identifiant bancaire
   - Exemples : IBAN international, RIB français

3. **Titulaire du compte**
   - Type : Identification bancaire
   - Exemples : Nom du titulaire, co-titulaires

4. **Salaire**
   - Type : Rémunération
   - Exemples : Salaire brut, net, primes

5. **Dépenses**
   - Type : Données financières
   - Exemples : Frais professionnels, dépenses personnelles

6. **Prêts en cours**
   - Type : Endettement
   - Exemples : Crédit immobilier, prêt à la consommation

7. **Informations fiscales**
   - Type : Données fiscales
   - Exemples : Numéro fiscal, déclarations, impôts

8. **Chiffre d'affaires**
   - Type : Données économiques
   - Exemples : CA annuel, mensuel, par activité

9. **Bilan financier**
   - Type : Données comptables
   - Exemples : Bilan comptable, compte de résultat

### 4.4 Marquage automatique comme sensible

**Règle métier** : Dans l'application Registr, toutes les données financières sont **automatiquement marquées comme sensibles**.

**Conséquence** :
- Les chips des données financières sont affichés en **or** (#DDB867)
- L'icône de bouclier est **toujours visible**
- L'utilisateur peut les démarquer comme non sensibles (mais c'est déconseillé)

**Justification** :
- Protection renforcée des données financières
- Conformité avec les bonnes pratiques de sécurité
- Évite les oublis de marquage

### 4.5 Champ de durée de conservation

**Identique à la section 1**

**Métier** : Cette durée s'applique à **toutes les données financières** sélectionnées dans cette section.

**Durées typiques** :
- Données comptables : 10 ans (obligation légale)
- Données de paie : 5 ans minimum
- Données fiscales : 6 ans (prescription fiscale)

### 4.6 Options personnalisées

**Source** : Paramètres de l'application (clé : `customEconomicInformation`)

**Format** : Identique à la section 1

**Exemples** :
- "Notes de frais"
- "Avantages en nature"
- "Stock-options"
- "Participation aux bénéfices"

---

## 5. Section 3 - Sources des données

### 5.1 Objectif

Identifier **d'où proviennent** les données collectées.

**Question posée** : "Quelle est la source des données ?"

### 5.2 Composant de sélection

**Type** : Groupe d'options avec recherche standard (SearchableOptionsGroup)

**Particularité** : Pas de gestion de la sensibilité (les sources ne sont pas sensibles)

### 5.3 Options prédéfinies

Liste des 6 sources standards :

1. **Employé**
   - Type : Source interne
   - Exemples : Formulaire RH, contrat de travail
   - Métier : Données fournies directement par l'employé

2. **Agence intérim**
   - Type : Source externe
   - Exemples : Dossier candidat transmis par l'agence
   - Métier : Données reçues d'un tiers (sous-traitant)

3. **Formulaire en ligne**
   - Type : Collecte directe
   - Exemples : Formulaire de contact, inscription, commande
   - Métier : Collecte via le site web ou une application

4. **Fichiers clients**
   - Type : Base de données interne
   - Exemples : CRM, ERP, base clients existante
   - Métier : Données déjà en possession de l'organisation

5. **Réseaux sociaux**
   - Type : Source externe publique
   - Exemples : LinkedIn, Facebook, Twitter
   - Métier : Données publiques ou partagées sur les réseaux

6. **Cookies et trackers**
   - Type : Collecte automatique
   - Exemples : Cookies de navigation, pixels de tracking
   - Métier : Collecte technique via le site web

### 5.4 Affichage des chips sélectionnés

**Apparence** :
- Couleur de fond : Bleu primaire (#37BCF8)
- Texte : Blanc
- Icône de suppression : Croix (X)
- Pas d'icône de sensibilité

**Interaction** :
- Clic sur la croix : Suppression de la source
- Pas de menu contextuel
- Pas de marquage de sensibilité

### 5.5 Bouton "Précisions"

**Position** : Sous la zone de sélection

**Style** :
- Couleur : Or (#DDB867)
- Texte : "Précisions"
- Largeur : 200px

**Action** : Ouvre une modale pour ajouter des précisions sur chaque source

### 5.6 Modale des précisions

**Titre** : "Précisions sur les éléments sélectionnés"

**Contenu** : Liste des champs texte pour chaque source sélectionnée

**Pour chaque source** :

**Champ texte multiligne** :
- Label : Nom de la source (ex: "Formulaire en ligne")
- Type : Textarea
- Lignes minimales : 1
- Lignes maximales : 4
- Placeholder : Aucun
- Valeur par défaut : Vide ou valeur précédemment saisie

**Exemples de précisions** :
- Formulaire en ligne : "Formulaire de contact sur la page 'Nous contacter' du site web"
- Employé : "Formulaire d'embauche rempli lors de la signature du contrat"
- Réseaux sociaux : "Profils LinkedIn des candidats lors du processus de recrutement"

**Boutons** :
- "Enregistrer" : Ferme la modale et sauvegarde
- "Annuler" : Ferme la modale (modifications conservées)

### 5.7 Options personnalisées

**Source** : Paramètres de l'application (clé : `customDataSources`)

**Format** : Tableau de chaînes (pas d'objet avec sensibilité)

**Exemples** :
- "Partenaires commerciaux"
- "Fournisseurs de données"
- "Bases de données publiques"
- "Enquêtes et sondages"

---

## 6. Gestion des données sensibles

### 6.1 Concept de sensibilité

Dans l'application Registr, chaque donnée personnelle ou financière peut être marquée comme **sensible** ou **non sensible**.

**Objectif** :
- Identifier les données nécessitant une protection renforcée
- Faciliter l'analyse des risques
- Documenter la conformité RGPD

### 6.2 Marquage de sensibilité

#### Méthode 1 : Clic sur l'icône

**Étapes** :
1. Survoler un chip sélectionné
2. L'icône de sensibilité apparaît (cadenas ouvert ou bouclier)
3. Cliquer sur l'icône
4. Le chip change de couleur :
   - Bleu → Or : Marqué comme sensible
   - Or → Bleu : Marqué comme non sensible

#### Méthode 2 : Menu contextuel

**Étapes** :
1. Clic droit sur un chip sélectionné
2. Menu contextuel s'ouvre
3. Cliquer sur "Marquer comme sensible" ou "Marquer comme non sensible"
4. Le chip change de couleur

#### Méthode 3 : Clic sur l'icône de menu

**Étapes** :
1. Survoler un chip sélectionné
2. L'icône de menu (3 points) apparaît
3. Cliquer sur l'icône
4. Menu contextuel s'ouvre
5. Sélectionner l'option de sensibilité

### 6.3 États visuels

#### Donnée non sensible
- Couleur de fond : Bleu (#37BCF8)
- Texte : Noir
- Icône : Cadenas ouvert (masqué, visible au hover)
- Bordure : 1px blanc semi-transparent

#### Donnée sensible
- Couleur de fond : Or (#DDB867)
- Texte : Noir
- Icône : Bouclier de sécurité (visible en permanence)
- Bordure : 1px or semi-transparent

#### Hover sur une donnée non sensible
- Icône de cadenas ouvert apparaît
- Icône de menu (3 points) apparaît
- Tooltip : "Marquer comme sensible"

#### Hover sur une donnée sensible
- Icône de bouclier reste visible
- Icône de menu (3 points) apparaît
- Tooltip : "Marquer comme non sensible"

### 6.4 Règles de marquage automatique

#### Données financières
**Règle** : Toutes les données de la section 2 sont **automatiquement marquées comme sensibles** lors de la sélection.

**Raison** : Protection renforcée des données financières

**Possibilité** : L'utilisateur peut les démarquer (mais déconseillé)

#### Données personnelles
**Règle** : Aucun marquage automatique

**Exception** : Si une donnée personnalisée a été marquée comme sensible dans les paramètres, elle conserve cet état

#### Recommandations métier

**Données à marquer comme sensibles** :
- Données de santé
- Données biométriques (si utilisées pour identification)
- Numéro de sécurité sociale
- Origine ethnique
- Opinions politiques
- Convictions religieuses
- Appartenance syndicale
- Vie sexuelle

**Données généralement non sensibles** :
- Nom, prénom
- Email professionnel
- Téléphone professionnel
- Adresse professionnelle

### 6.5 Persistance de l'état sensible

#### Pour les options prédéfinies
**Règle** : L'état sensible n'est **pas persisté** dans les paramètres

**Raison** : Chaque traitement peut avoir des besoins différents

**Conséquence** : Si l'utilisateur marque "Email" comme sensible dans un traitement, il ne le sera pas automatiquement dans un autre traitement

#### Pour les options personnalisées
**Règle** : L'état sensible **est persisté** dans les paramètres

**Raison** : Faciliter la réutilisation et éviter les oublis

**Exemple** :
1. L'utilisateur crée "Groupe sanguin" et le marque comme sensible
2. Cette donnée est sauvegardée dans les paramètres avec `isSensitive: true`
3. Dans un autre traitement, si l'utilisateur sélectionne "Groupe sanguin", elle sera automatiquement marquée comme sensible

---

## 7. Durée de conservation

### 7.1 Concept métier

La **durée de conservation** est la période pendant laquelle les données sont conservées sous une forme permettant l'identification des personnes concernées.

**Obligation RGPD** : Article 5.1.e - Limitation de la conservation

**Principe** : Les données ne doivent pas être conservées plus longtemps que nécessaire au regard des finalités.

### 7.2 Champ de durée de conservation

**Position** : En bas de chaque section (1 et 2)

**Type** : Champ texte simple ligne

**Label** :
- Section 1 : "Durée de conservation"
- Section 2 : "Durée de conservation"

**Placeholder** : "Ex: 2 ans"

**Comportement** :
- Saisie libre (pas de format imposé)
- Pas de validation stricte
- Optionnel (peut rester vide)
- Sauvegarde automatique dans le formulaire

### 7.3 Portée de la durée

**Section 1 - Données personnelles** :
- La durée s'applique à **toutes les données personnelles** sélectionnées
- Pas de durée individuelle par donnée

**Section 2 - Données financières** :
- La durée s'applique à **toutes les données financières** sélectionnées
- Pas de durée individuelle par donnée

**Raison** : Simplification de la saisie et cohérence métier (les données d'un même groupe ont généralement la même durée)

### 7.4 Formats acceptés

**Saisie libre** : L'utilisateur peut saisir la durée dans le format qu'il souhaite

**Exemples valides** :
- "2 ans"
- "3 ans à compter de la fin de la relation commerciale"
- "10 ans (obligation légale)"
- "Durée du contrat + 5 ans"
- "5 ans après le dernier contact"
- "Jusqu'à la suppression du compte"
- "Tant que le consentement est maintenu"

**Recommandation** : Être le plus précis possible et indiquer le point de départ

### 7.5 Durées légales de référence

**Données comptables** : 10 ans (obligation légale)

**Données de paie** : 5 ans minimum

**Données fiscales** : 6 ans (prescription fiscale)

**Candidatures non retenues** : 2 ans maximum (recommandation CNIL)

**Données clients** : Durée de la relation commerciale + 3 ans (prescription commerciale)

**Données de santé** : Variable selon le contexte (20 ans pour les dossiers médicaux)

**Données de connexion** : 1 an (obligation légale pour les hébergeurs)

### 7.6 Validation

**Pas de validation stricte** : Le champ accepte toute valeur textuelle

**Raison** : La durée de conservation dépend du contexte et peut être complexe à exprimer

**Amélioration possible** : Ajouter des suggestions ou un sélecteur de durées prédéfinies

---

## 8. Structure des données

### 8.1 Modèle de données - Section 1

#### Données personnelles

**Nom du champ** : `personalDataGroup`

**Type** : Objet avec données et durée

**Format** :
```json
{
  "personalDataGroup": {
    "data": {
      "name": [
        {
          "name": "Nom",
          "isSensitive": false
        },
        {
          "name": "Email",
          "isSensitive": false
        },
        {
          "name": "Données de santé",
          "isSensitive": true
        }
      ]
    },
    "conservationDuration": "3 ans à compter de la fin de la relation commerciale"
  }
}
```

**Contraintes** :
- `data.name` : Tableau d'objets
- Chaque objet : `{ name: string, isSensitive: boolean }`
- `name` : Obligatoire, chaîne non vide
- `isSensitive` : Obligatoire, booléen
- `conservationDuration` : Optionnel, chaîne

### 8.2 Modèle de données - Section 2

#### Données financières

**Nom du champ** : `financialDataGroup`

**Type** : Identique à `personalDataGroup`

**Format** :
```json
{
  "financialDataGroup": {
    "data": {
      "name": [
        {
          "name": "IBAN ou RIB",
          "isSensitive": true
        },
        {
          "name": "Salaire",
          "isSensitive": true
        }
      ]
    },
    "conservationDuration": "5 ans après la fin du contrat"
  }
}
```

**Particularité** : `isSensitive` est généralement `true` pour toutes les données financières

### 8.3 Modèle de données - Section 3

#### Sources des données

**Nom du champ** : `dataSources`

**Type** : Tableau d'objets

**Format** :
```json
{
  "dataSources": [
    {
      "name": "Formulaire en ligne",
      "additionalInformation": "Formulaire de contact sur la page 'Nous contacter' du site web"
    },
    {
      "name": "Employé",
      "additionalInformation": "Formulaire d'embauche rempli lors de la signature du contrat"
    },
    {
      "name": "Réseaux sociaux",
      "additionalInformation": ""
    }
  ]
}
```

**Contraintes** :
- Minimum : 0 éléments (optionnel)
- Maximum : Illimité
- `name` : Obligatoire, chaîne non vide
- `additionalInformation` : Optionnel, peut être vide

### 8.4 Sauvegarde dans les paramètres

#### Données personnelles personnalisées

**Clé de paramètre** : `customPersonalData`

**Type** : Tableau d'objets

**Format** :
```json
{
  "key": "customPersonalData",
  "value": [
    {
      "name": "Numéro de badge",
      "isSensitive": false
    },
    {
      "name": "Groupe sanguin",
      "isSensitive": true
    }
  ]
}
```

#### Données financières personnalisées

**Clé de paramètre** : `customEconomicInformation`

**Type** : Tableau d'objets

**Format** :
```json
{
  "key": "customEconomicInformation",
  "value": [
    {
      "name": "Notes de frais",
      "isSensitive": true
    },
    {
      "name": "Avantages en nature",
      "isSensitive": true
    }
  ]
}
```

#### Sources personnalisées

**Clé de paramètre** : `customDataSources`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customDataSources",
  "value": [
    "Partenaires commerciaux",
    "Bases de données publiques"
  ]
}
```

---

## 9. Navigation et validation

### 9.1 Validation du formulaire

#### Validation côté client

**Déclenchement** : Clic sur "Suivant"

**Règles de validation** :

**Section 1 - Données personnelles** :
- Pas de validation stricte obligatoire
- Les données peuvent être vides (selon la configuration)
- La durée de conservation est optionnelle

**Section 2 - Données financières** :
- Pas de validation stricte obligatoire
- Les données peuvent être vides
- La durée de conservation est optionnelle

**Section 3 - Sources des données** :
- Pas de validation stricte obligatoire
- Les sources peuvent être vides

**Validation recommandée** :
- Au moins une donnée (personnelle ou financière) devrait être sélectionnée
- La durée de conservation devrait être renseignée si des données sont sélectionnées

#### Validation côté serveur

**Déclenchement** : À la soumission du formulaire

**Endpoint** : `POST /api/v1/treatments/validation`

**Réponse en cas d'erreur** :
```json
[
  {
    "path": ["personalDataGroup", "data", "name"],
    "message": "Au moins une donnée personnelle ou financière est requise"
  },
  {
    "path": ["personalDataGroup", "conservationDuration"],
    "message": "La durée de conservation est requise si des données sont sélectionnées"
  }
]
```

### 9.2 Sauvegarde en brouillon

**Déclenchement** : Clic sur "Enregistrer comme brouillon"

**Comportement** :
- Pas de validation stricte
- Sauvegarde immédiate des données saisies
- Statut du traitement : "Brouillon"
- Message de confirmation

**Endpoint** : `PUT /api/v1/treatments/draft`

### 9.3 Navigation entre les étapes

**Bouton "Précédent"** : Retour à l'étape 4 (Catégories de personnes)

**Bouton "Suivant"** : Passage à l'étape 6 (Base légale)

**Bouton "Passer"** : Disponible uniquement en mode édition

---

## 10. Intégration API

### 10.1 Récupération des paramètres

#### Endpoint : GET /api/v1/settings/{key}

**Exemples** :
```
GET /api/v1/settings/customPersonalData
GET /api/v1/settings/customEconomicInformation
GET /api/v1/settings/customDataSources
```

**Réponse - Données personnelles** :
```json
{
  "key": "customPersonalData",
  "value": [
    {
      "name": "Numéro de badge",
      "isSensitive": false
    },
    {
      "name": "Groupe sanguin",
      "isSensitive": true
    }
  ]
}
```

**Réponse - Sources** :
```json
{
  "key": "customDataSources",
  "value": [
    "Partenaires commerciaux",
    "Bases de données publiques"
  ]
}
```

### 10.2 Mise à jour des paramètres

#### Endpoint : PUT /api/v1/settings

**Body - Ajout d'une donnée personnelle** :
```json
{
  "key": "customPersonalData",
  "value": [
    {
      "name": "Numéro de badge",
      "isSensitive": false
    },
    {
      "name": "Groupe sanguin",
      "isSensitive": true
    },
    {
      "name": "Numéro de permis de conduire",
      "isSensitive": false
    }
  ]
}
```

**Body - Ajout d'une source** :
```json
{
  "key": "customDataSources",
  "value": [
    "Partenaires commerciaux",
    "Bases de données publiques",
    "Enquêtes et sondages"
  ]
}
```

### 10.3 Validation du traitement

**Endpoint** : `POST /api/v1/treatments/validation`

**Body** :
```json
{
  "title": "Gestion des candidatures",
  "personalDataGroup": {
    "data": {
      "name": [
        { "name": "Nom", "isSensitive": false },
        { "name": "Prénom", "isSensitive": false },
        { "name": "Email", "isSensitive": false }
      ]
    },
    "conservationDuration": "2 ans"
  },
  "financialDataGroup": {
    "data": {
      "name": []
    },
    "conservationDuration": ""
  },
  "dataSources": [
    {
      "name": "Formulaire en ligne",
      "additionalInformation": "Formulaire de candidature sur le site web"
    }
  ]
}
```

**Réponse (succès)** :
```json
[]
```

**Réponse (erreur)** :
```json
[
  {
    "path": ["personalDataGroup", "conservationDuration"],
    "message": "La durée de conservation est requise si des données personnelles sont sélectionnées"
  }
]
```

---

## 11. Règles de gestion

### 11.1 Règles métier - Données personnelles

#### RG-DP1 : Données personnelles optionnelles

**Règle** : Les données personnelles sont optionnelles pour un brouillon, mais recommandées pour un traitement validé.

**Validation** : Pas de validation stricte en brouillon

#### RG-DP2 : Marquage de sensibilité

**Règle** : Chaque donnée personnelle peut être marquée comme sensible ou non sensible.

**Par défaut** : Non sensible (sauf si personnalisée avec état sensible)

#### RG-DP3 : Durée de conservation

**Règle** : La durée de conservation s'applique à toutes les données personnelles sélectionnées.

**Recommandation** : Renseigner la durée si des données sont sélectionnées

#### RG-DP4 : Options personnalisées

**Règle** : Les options personnalisées conservent leur état de sensibilité dans les paramètres.

**Portée** : Global (tous les traitements)

### 11.2 Règles métier - Données financières

#### RG-DF1 : Marquage automatique comme sensible

**Règle** : Toutes les données financières sont automatiquement marquées comme sensibles lors de la sélection.

**Justification** : Protection renforcée des données financières

**Exception** : L'utilisateur peut les démarquer (déconseillé)

#### RG-DF2 : Durée de conservation

**Règle** : La durée de conservation s'applique à toutes les données financières sélectionnées.

**Durées typiques** : 5 à 10 ans selon les obligations légales

#### RG-DF3 : Options personnalisées

**Règle** : Les options personnalisées sont automatiquement marquées comme sensibles.

**Raison** : Cohérence avec les données financières standards

### 11.3 Règles métier - Sources des données

#### RG-SD1 : Sources optionnelles

**Règle** : Les sources de données sont optionnelles.

**Recommandation** : Renseigner au moins une source pour la transparence

#### RG-SD2 : Précisions optionnelles

**Règle** : Les précisions sur les sources sont optionnelles.

**Utilité** : Apportent un niveau de détail supplémentaire

#### RG-SD3 : Pas de sensibilité

**Règle** : Les sources de données ne peuvent pas être marquées comme sensibles.

**Raison** : Ce sont les données elles-mêmes qui sont sensibles, pas leur source

### 11.4 Règles techniques

#### RT-1 : Fusion des options

**Règle** : Les options affichées sont la fusion de :
1. Options standards (hardcodées)
2. Options personnalisées (depuis les paramètres)

**Ordre** : Standards en premier, personnalisées ensuite

#### RT-2 : Filtrage des doublons

**Règle** : Lors de l'ajout d'une option personnalisée, vérifier qu'elle n'existe pas déjà.

**Comparaison** : Insensible à la casse, trim des espaces

#### RT-3 : Synchronisation état local / formulaire

**Règle** : Toute modification doit mettre à jour :
1. L'état local du composant (pour l'affichage)
2. L'état du formulaire (pour la sauvegarde)

#### RT-4 : Gestion des modales

**Règle** : Une seule modale ouverte à la fois (précisions des sources)

#### RT-5 : Conservation de l'état sensible

**Règle** : Lors du changement de sensibilité d'une donnée :
1. Mise à jour immédiate de l'affichage (couleur du chip)
2. Mise à jour de l'état local
3. Mise à jour du formulaire
4. Si donnée personnalisée : Mise à jour des paramètres

---

## 12. Internationalisation

### 12.1 Clés de traduction - Étape 5

**Namespace** : `treatments`

| Clé | Français | Anglais |
|-----|----------|---------|
| `steps.step5` | Étape 5 | Step 5 |
| `steps.data` | Données | Data |
| `form.data.firstQuestion` | Quelles données personnelles collectez-vous ? | What personal data do you collect? |
| `form.data.secondQuestion` | Quelles informations d'ordre économique et financier récoltez-vous ? | What economic and financial information do you collect? |
| `form.data.thirdQuestion` | Quelle est la source des données ? | What is the source of the data? |
| `form.data.conservationDuration` | Durée de conservation | Retention period |
| `form.data.conservationDurationHelp` | Ex: 2 ans | E.g.: 2 years |
| `form.showPrecisions` | Précisions | Additional Details |
| `form.precisionDetails` | Précisions sur les éléments sélectionnés | Details on Selected Items |

### 12.2 Options standards - Données personnelles

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.data.personalDataOptions.name` | Nom | Last Name |
| `form.data.personalDataOptions.firstName` | Prénom | First Name |
| `form.data.personalDataOptions.email` | Email | Email |
| `form.data.personalDataOptions.phoneNumber` | Téléphone | Phone Number |
| `form.data.personalDataOptions.financialData` | Données financières | Financial Data |
| `form.data.personalDataOptions.healthData` | Données de santé | Health Data |
| `form.data.personalDataOptions.photograph` | Photographie | Photograph |

### 12.3 Options standards - Données financières

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.data.financialDataOptions.bankAccount` | Comptes bancaires | Bank Accounts |
| `form.data.financialDataOptions.IBANorRIB` | IBAN ou RIB | IBAN or Account Number |
| `form.data.financialDataOptions.accountHolder` | Titulaire du compte | Account Holder |
| `form.data.financialDataOptions.salary` | Salaire | Salary |
| `form.data.financialDataOptions.outcomes` | Dépenses | Expenses |
| `form.data.financialDataOptions.ongoingLoans` | Prêts en cours | Ongoing Loans |
| `form.data.financialDataOptions.taxInformation` | Informations fiscales | Tax Information |
| `form.data.financialDataOptions.turnover` | Chiffre d'affaires | Turnover |
| `form.data.financialDataOptions.financialStatement` | Bilan financier | Financial Statement |

### 12.4 Clés communes

**Namespace** : `common`

| Clé | Français | Anglais |
|-----|----------|---------|
| `common:search` | Rechercher | Search |
| `common:popular` | Populaire | Popular |
| `common:add` | Ajouter | Add |
| `common:save` | Enregistrer | Save |
| `common:cancel` | Annuler | Cancel |
| `common:delete` | Supprimer | Delete |
| `common:markAsSensitive` | Marquer comme sensible | Mark as Sensitive |
| `common:markAsNotSensitive` | Marquer comme non sensible | Mark as Not Sensitive |

---

## 13. Accessibilité

### 13.1 Navigation au clavier

#### Champ de recherche
- Tab : Focus sur le champ
- Flèches haut/bas : Navigation dans les suggestions
- Entrée : Sélection de la suggestion ou ajout de la valeur
- Échap : Fermeture de la liste déroulante

#### Chips des options
- Tab : Navigation entre les chips
- Entrée ou Espace : Sélection/Désélection de l'option

#### Chips sélectionnés
- Tab : Navigation entre les chips
- Entrée ou Espace : Ouverture du menu contextuel
- Flèches haut/bas : Navigation dans le menu
- Entrée : Sélection de l'option du menu
- Échap : Fermeture du menu

#### Champ de durée de conservation
- Tab : Focus sur le champ
- Saisie normale

#### Modale des précisions
- Tab : Navigation entre les champs
- Échap : Fermeture de la modale

### 13.2 Lecteurs d'écran

#### Attributs ARIA

**Champ de recherche** :
- `role="combobox"`
- `aria-expanded="true/false"`
- `aria-autocomplete="list"`
- `aria-controls="liste-options"`

**Chips cliquables** :
- `role="button"`
- `tabindex="0"`
- `aria-label="[Nom de la donnée]"`

**Menu contextuel** :
- `role="menu"`
- `aria-labelledby="menu-title"`

**Options du menu** :
- `role="menuitem"`
- `aria-label="Marquer comme sensible"` ou `"Supprimer"`

**Icône de sensibilité** :
- `aria-label="Donnée sensible"` ou `"Donnée non sensible"`
- Tooltip au hover

#### Annonces vocales

**Ajout d'une donnée** :
- Annonce : "[Nom de la donnée] ajoutée"

**Marquage comme sensible** :
- Annonce : "[Nom de la donnée] marquée comme sensible"

**Marquage comme non sensible** :
- Annonce : "[Nom de la donnée] marquée comme non sensible"

**Suppression** :
- Annonce : "[Nom de la donnée] supprimée"

### 13.3 Contraste et visibilité

#### Ratios de contraste (WCAG AA)

**Texte normal** : Minimum 4.5:1
- Texte noir sur fond bleu : ✅ Conforme
- Texte noir sur fond or : ✅ Conforme

**Icônes** : Minimum 3:1
- Icône de bouclier sur fond or : ✅ Conforme
- Icône de cadenas sur fond bleu : ✅ Conforme

#### États de focus

**Tous les éléments interactifs** :
- Outline : 2px solid bleu primaire
- Offset : 2px
- Visible en permanence au focus

### 13.4 Responsive design

#### Desktop (> 1200px)
- 3 colonnes côte à côte
- Largeur égale : 33% chacune
- Hauteur identique

#### Tablet (768px - 1200px)
- 3 colonnes côte à côte (réduites)
- Largeur : 30% chacune
- Scroll horizontal si nécessaire

#### Mobile (< 768px)
- 1 colonne
- Cartes empilées verticalement
- Largeur : 100%
- Section 1 en premier
- Section 2 en deuxième
- Section 3 en troisième

---

## 14. Cas d'usage détaillés

### 14.1 Cas d'usage 1 : Traitement RH - Gestion des paies

**Contexte** : Une entreprise documente son traitement de gestion des paies.

**Section 1 - Données personnelles** :

1. L'utilisateur arrive sur l'étape 5
2. Il sélectionne les données personnelles :
   - "Nom" (non sensible)
   - "Prénom" (non sensible)
   - "Email" (non sensible)
3. Il tape "Numéro de sécurité sociale" dans la recherche
4. Option "Ajouter : Numéro de sécurité sociale" apparaît
5. Il clique dessus → Ajout avec état non sensible
6. Il survole le chip "Numéro de sécurité sociale"
7. Il clique sur l'icône de cadenas
8. Le chip devient or → Marqué comme sensible
9. Il remplit la durée de conservation : "5 ans après la fin du contrat"

**Section 2 - Données financières** :

1. Il sélectionne :
   - "Salaire" (automatiquement sensible)
   - "IBAN ou RIB" (automatiquement sensible)
   - "Informations fiscales" (automatiquement sensible)
2. Tous les chips sont affichés en or
3. Il remplit la durée : "10 ans (obligation légale)"

**Section 3 - Sources des données** :

1. Il sélectionne :
   - "Employé"
   - "Fichiers clients"
2. Il clique sur "Précisions"
3. Il remplit :
   - Employé : "Formulaire d'embauche et contrat de travail"
   - Fichiers clients : "Système RH interne"
4. Il clique sur "Enregistrer"
5. Il clique sur "Suivant" → Passage à l'étape 6

### 14.2 Cas d'usage 2 : Traitement Marketing - Newsletter

**Contexte** : Une entreprise documente son traitement de newsletter.

**Section 1 - Données personnelles** :

1. L'utilisateur sélectionne :
   - "Nom" (non sensible)
   - "Prénom" (non sensible)
   - "Email" (non sensible)
2. Il tape "Préférences marketing" dans la recherche
3. Il ajoute cette donnée personnalisée (non sensible)
4. Il remplit la durée : "3 ans après le dernier contact"

**Section 2 - Données financières** :

1. Il ne sélectionne aucune donnée financière
2. Il laisse la durée vide

**Section 3 - Sources des données** :

1. Il sélectionne :
   - "Formulaire en ligne"
   - "Réseaux sociaux"
2. Il clique sur "Précisions"
3. Il remplit :
   - Formulaire en ligne : "Formulaire d'inscription à la newsletter sur la page d'accueil"
   - Réseaux sociaux : "Profils LinkedIn pour les contacts B2B"
4. Il clique sur "Enregistrer"
5. Il clique sur "Suivant"

### 14.3 Cas d'usage 3 : Traitement Santé - Dossiers médicaux

**Contexte** : Un cabinet médical documente son traitement de dossiers patients.

**Section 1 - Données personnelles** :

1. L'utilisateur sélectionne :
   - "Nom" (non sensible)
   - "Prénom" (non sensible)
   - "Données de santé" (non sensible par défaut)
2. Il survole "Données de santé"
3. Il clique sur l'icône de cadenas → Marqué comme sensible (or)
4. Il tape "Groupe sanguin" dans la recherche
5. Il ajoute cette donnée personnalisée
6. Il la marque immédiatement comme sensible (clic droit → menu)
7. Il tape "Allergies" et l'ajoute
8. Il la marque comme sensible
9. Il remplit la durée : "20 ans après le dernier acte médical"

**Section 2 - Données financières** :

1. Il sélectionne :
   - "Informations fiscales" (pour les remboursements)
2. Automatiquement marqué comme sensible
3. Il remplit la durée : "10 ans"

**Section 3 - Sources des données** :

1. Il sélectionne :
   - "Employé" (le patient lui-même)
2. Il tape "Laboratoires d'analyses" dans la recherche
3. Il ajoute cette source personnalisée
4. Il clique sur "Précisions"
5. Il remplit :
   - Employé : "Questionnaire médical rempli par le patient"
   - Laboratoires d'analyses : "Résultats d'analyses transmis par les laboratoires partenaires"
6. Il clique sur "Enregistrer"
7. Il clique sur "Suivant"

### 14.4 Cas d'usage 4 : Modification d'un traitement existant

**Contexte** : Un utilisateur veut ajouter des données à un traitement existant.

**Section 1 - Données personnelles** :

1. L'utilisateur ouvre un traitement existant en mode édition
2. Il arrive sur l'étape 5
3. Les données déjà sélectionnées apparaissent :
   - "Nom" (non sensible)
   - "Email" (non sensible)
4. Il veut ajouter "Téléphone"
5. Il clique sur "Téléphone" dans les options disponibles
6. Le chip "Téléphone" apparaît dans les sélectionnés
7. Il veut retirer "Email"
8. Il fait clic droit sur "Email" → "Supprimer"
9. Le chip "Email" disparaît
10. Il modifie la durée : "5 ans" → "3 ans"

**Section 2 et 3** : Pas de modification

11. Il clique sur "Suivant"

### 14.5 Cas d'usage 5 : Gestion des erreurs

**Contexte** : L'utilisateur essaie de valider sans remplir les champs obligatoires.

**Scénario** :

1. L'utilisateur arrive sur l'étape 5
2. Il ne sélectionne aucune donnée
3. Il clique sur "Suivant"
4. Validation côté serveur déclenche une erreur
5. Message d'erreur s'affiche : "Au moins une donnée personnelle ou financière est requise"
6. L'utilisateur sélectionne "Nom" dans la section 1
7. Il clique sur "Suivant"
8. Nouvelle erreur : "La durée de conservation est requise si des données sont sélectionnées"
9. Il remplit la durée : "3 ans"
10. Il clique sur "Suivant"
11. Validation réussie → Passage à l'étape 6

---

## 15. Maquettes et wireframes

### 15.1 Vue d'ensemble de l'étape 5

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                    Étape 5 - Données                                            │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────┬────────────────────────────┬────────────────────────────┐
│                            │                            │                            │
│  Section 1                 │  Section 2                 │  Section 3                 │
│  Données personnelles      │  Données financières       │  Sources des données       │
│                            │                            │                            │
│  ┌──────────────────────┐  │  ┌──────────────────────┐  │  ┌──────────────────────┐  │
│  │ 🔍 Rechercher...  ▼  │  │  │ 🔍 Rechercher...  ▼  │  │  │ 🔍 Rechercher...  ▼  │  │
│  └──────────────────────┘  │  └──────────────────────┘  │  └──────────────────────┘  │
│                            │                            │                            │
│  ┌──────────────────────┐  │  ┌──────────────────────┐  │  ┌──────────────────────┐  │
│  │ Sélectionnés :       │  │  │ Sélectionnés :       │  │  │ Sélectionnés :       │  │
│  │                      │  │  │                      │  │  │                      │  │
│  │ [Nom ⋮] [Email ⋮]   │  │  │ [Salaire 🛡 ⋮]       │  │  │ [Employé ✕]         │  │
│  │ [Santé 🛡 ⋮]         │  │  │ [IBAN 🛡 ⋮]          │  │  │ [Formulaire ✕]      │  │
│  │                      │  │  │                      │  │  │                      │  │
│  └──────────────────────┘  │  └──────────────────────┘  │  └──────────────────────┘  │
│                            │                            │                            │
│  Populaire                 │  Populaire                 │  Populaire                 │
│                            │                            │                            │
│  [Prénom] [Téléphone]      │  [Dépenses] [Prêts]        │  [Agence] [Réseaux]        │
│  [Photo] [Données fin.]    │  [Chiffre d'affaires]      │  [Cookies] [Fichiers]      │
│                            │                            │                            │
│  ┌──────────────────────┐  │  ┌──────────────────────┐  │  ┌──────────────────────┐  │
│  │ Durée de conservation│  │  │ Durée de conservation│  │  │                      │  │
│  │ 3 ans                │  │  │ 10 ans               │  │  │  [Précisions]        │  │
│  └──────────────────────┘  │  └──────────────────────┘  │  │                      │  │
│                            │                            │  └──────────────────────┘  │
└────────────────────────────┴────────────────────────────┴────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│  [ ← Précédent ]  [ Enregistrer comme brouillon ]  [ Suivant → ]                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 15.2 Section 1 - Détail des chips

```
┌─────────────────────────────────────────────────────────────┐
│  Sélectionnés :                                             │
│                                                             │
│  ┌────────────────────┐  ┌────────────────────┐            │
│  │ Nom            ⋮   │  │ Email          ⋮   │            │
│  │ (bleu)             │  │ (bleu)             │            │
│  └────────────────────┘  └────────────────────┘            │
│                                                             │
│  ┌────────────────────────────┐                            │
│  │ Données de santé  🛡  ⋮   │                            │
│  │ (or - sensible)            │                            │
│  └────────────────────────────┘                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Légende :
- Bleu : Donnée non sensible
- Or : Donnée sensible
- 🛡 : Icône de bouclier (donnée sensible)
- ⋮ : Icône de menu (3 points verticaux)
```

### 15.3 Menu contextuel

```
                    ┌─────────────────────────────────┐
                    │  🔒 Marquer comme sensible      │
                    ├─────────────────────────────────┤
                    │  🗑  Supprimer                  │
                    └─────────────────────────────────┘

Ou (si déjà sensible) :

                    ┌─────────────────────────────────┐
                    │  🔓 Marquer comme non sensible  │
                    ├─────────────────────────────────┤
                    │  🗑  Supprimer                  │
                    └─────────────────────────────────┘
```

### 15.4 Modale des précisions (Section 3)

```
                    ┌───────────────────────────────────────────┐
                    │  Précisions sur les éléments           ✕  │
                    │  sélectionnés                             │
                    ├───────────────────────────────────────────┤
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Employé                             │ │
                    │  │ Formulaire d'embauche et contrat    │ │
                    │  │ de travail signé lors de l'entrée   │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Formulaire en ligne                 │ │
                    │  │ Formulaire de candidature sur le    │ │
                    │  │ site web (page Carrières)           │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Réseaux sociaux                     │ │
                    │  │ Profils LinkedIn des candidats      │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │                                           │
                    │  [ Annuler ]           [ Enregistrer ]    │
                    └───────────────────────────────────────────┘
```

### 15.5 États de hover

```
Chip non sensible (hover) :

┌────────────────────────┐
│ 🔓 Nom            ⋮    │  ← Icône de cadenas ouvert apparaît
│ (bleu)                 │
└────────────────────────┘

Chip sensible (hover) :

┌────────────────────────┐
│ 🛡 Données santé   ⋮   │  ← Icône de bouclier toujours visible
│ (or)                   │
└────────────────────────┘
```

---

## 16. Spécifications techniques d'intégration

### 16.1 Format des requêtes HTTP

#### Récupération des paramètres - Données personnelles

**Requête** :
```http
GET /api/v1/settings/customPersonalData HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Accept: application/json
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customPersonalData",
  "value": [
    {
      "name": "Numéro de badge",
      "isSensitive": false
    },
    {
      "name": "Groupe sanguin",
      "isSensitive": true
    }
  ]
}
```

#### Mise à jour des paramètres - Données financières

**Requête** :
```http
PUT /api/v1/settings HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "customEconomicInformation",
  "value": [
    {
      "name": "Notes de frais",
      "isSensitive": true
    },
    {
      "name": "Avantages en nature",
      "isSensitive": true
    },
    {
      "name": "Stock-options",
      "isSensitive": true
    }
  ]
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customEconomicInformation",
  "value": [
    {
      "name": "Notes de frais",
      "isSensitive": true
    },
    {
      "name": "Avantages en nature",
      "isSensitive": true
    },
    {
      "name": "Stock-options",
      "isSensitive": true
    }
  ]
}
```

#### Sauvegarde en brouillon

**Requête** :
```http
PUT /api/v1/treatments/draft HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Gestion des candidatures",
  "personalDataGroup": {
    "data": {
      "name": [
        { "name": "Nom", "isSensitive": false },
        { "name": "Prénom", "isSensitive": false },
        { "name": "Email", "isSensitive": false }
      ]
    },
    "conservationDuration": "2 ans"
  },
  "financialDataGroup": {
    "data": {
      "name": []
    },
    "conservationDuration": ""
  },
  "dataSources": [
    {
      "name": "Formulaire en ligne",
      "additionalInformation": "Formulaire de candidature sur le site web"
    }
  ]
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
  "updateDate": "2026-02-18T15:20:00Z",
  "order": 1,
  "data": {
    "title": "Gestion des candidatures",
    "personalDataGroup": { ... },
    "financialDataGroup": { ... },
    "dataSources": [ ... ],
    ...
  }
}
```

---

## 17. Règles de validation détaillées

### 17.1 Validation des données personnelles

**Champ `personalDataGroup.data.name`** :
- Type : Tableau d'objets
- Minimum : 0 éléments (brouillon) ou 1 élément (validation)
- Chaque objet : `{ name: string, isSensitive: boolean }`
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `isSensitive` : Obligatoire, booléen

**Champ `personalDataGroup.conservationDuration`** :
- Type : Chaîne
- Optionnel (brouillon)
- Recommandé si des données sont sélectionnées (validation)
- Max 500 caractères

**Messages d'erreur** :
- Aucune donnée (validation) : "Au moins une donnée personnelle ou financière est requise"
- Durée vide (validation) : "La durée de conservation est recommandée si des données sont sélectionnées"
- Nom trop long : "Le nom de la donnée ne peut pas dépasser 200 caractères"

### 17.2 Validation des données financières

**Champ `financialDataGroup.data.name`** :
- Type : Identique à `personalDataGroup.data.name`
- Minimum : 0 éléments

**Champ `financialDataGroup.conservationDuration`** :
- Type : Identique à `personalDataGroup.conservationDuration`

**Particularité** : Les données financières doivent généralement avoir `isSensitive: true`

### 17.3 Validation des sources

**Champ `dataSources`** :
- Type : Tableau d'objets
- Minimum : 0 éléments
- Maximum : Illimité (recommandé : 20 max)

**Validation d'un objet `DataSource`** :
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `additionalInformation` : Optionnel, max 2000 caractères

**Messages d'erreur** :
- `name` vide : "Le nom de la source est obligatoire"
- Trop long : "Le nom ne peut pas dépasser 200 caractères"
- `additionalInformation` trop long : "Les précisions ne peuvent pas dépasser 2000 caractères"

---

## 18. Considérations de performance

### 18.1 Chargement des options

**Problème** : Si des milliers d'options personnalisées existent

**Solutions** :
1. Pagination des options (charger par lots de 50)
2. Recherche côté serveur pour les grandes listes
3. Virtualisation de la liste des chips

### 18.2 Gestion de la sensibilité

**Problème** : Changement de sensibilité peut être lent si beaucoup de données

**Solutions** :
1. Debounce des mises à jour (300ms)
2. Optimistic updates (mise à jour immédiate de l'UI)
3. Batch des requêtes de mise à jour des paramètres

### 18.3 Synchronisation des états

**Problème** : Synchronisation entre état local, formulaire et paramètres

**Solutions** :
1. Utiliser un gestionnaire d'état centralisé
2. Memoization des calculs coûteux
3. Éviter les re-renders inutiles

---

## 19. Sécurité et confidentialité

### 19.1 Validation des entrées

**Côté client** :
- Trim des espaces
- Limitation de la longueur
- Échappement des caractères spéciaux

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
- Création d'une donnée personnalisée
- Marquage/démarquage comme sensible
- Modification d'un traitement

---

## 20. Annexes

### 20.1 Exemples de traitements réels

#### Exemple 1 : Gestion des candidatures

**Données personnelles** :
- Nom, Prénom, Email, Téléphone (non sensibles)
- CV, Lettre de motivation (non sensibles)
- Durée : "2 ans"

**Données financières** : Aucune

**Sources** :
- Formulaire en ligne : "Formulaire de candidature sur la page Carrières"
- Email : "Candidatures spontanées reçues par email"

#### Exemple 2 : Dossiers médicaux

**Données personnelles** :
- Nom, Prénom (non sensibles)
- Données de santé, Groupe sanguin, Allergies (sensibles)
- Durée : "20 ans après le dernier acte médical"

**Données financières** :
- Informations fiscales (sensible)
- Durée : "10 ans"

**Sources** :
- Employé : "Questionnaire médical rempli par le patient"
- Laboratoires d'analyses : "Résultats transmis par les laboratoires partenaires"

### 20.2 Glossaire technique

**Chip** : Élément visuel compact représentant une valeur sélectionnée

**Menu contextuel** : Menu qui s'affiche au clic droit ou au clic sur une icône

**Sensibilité** : Propriété indiquant si une donnée nécessite une protection renforcée

**Durée de conservation** : Période pendant laquelle les données sont conservées

**Source de données** : Origine de la collecte des données

---

**Fin du document**

Ce document fournit toutes les informations nécessaires pour implémenter l'étape 5 du formulaire de traitement dans n'importe quel framework frontend.
