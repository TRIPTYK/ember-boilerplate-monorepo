# Spécifications Fonctionnelles - Étape 6 du Formulaire de Traitement

## Document de spécifications pour développeur expérimenté

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr Frontend - Gestion des traitements RGPD  

---

## Table des matières

1. [Contexte métier et RGPD](#1-contexte-métier-et-rgpd)
2. [Vue d'ensemble de l'étape 6](#2-vue-densemble-de-létape-6)
3. [Les 6 bases légales du RGPD](#3-les-6-bases-légales-du-rgpd)
4. [Composant de sélection](#4-composant-de-sélection)
5. [Options personnalisées](#5-options-personnalisées)
6. [Structure des données](#6-structure-des-données)
7. [Navigation et validation](#7-navigation-et-validation)
8. [Intégration API](#8-intégration-api)
9. [Règles de gestion](#9-règles-de-gestion)
10. [Internationalisation](#10-internationalisation)
11. [Accessibilité](#11-accessibilité)
12. [Cas d'usage détaillés](#12-cas-dusage-détaillés)
13. [Maquettes et wireframes](#13-maquettes-et-wireframes)
14. [Annexes](#14-annexes)

---

## 1. Contexte métier et RGPD

### 1.1 Qu'est-ce qu'une base légale ?

La **base légale** (ou fondement juridique) est la justification légale qui autorise le traitement de données personnelles.

**Article 6 du RGPD** : Le traitement de données personnelles n'est licite que si, et dans la mesure où, au moins une des conditions suivantes est remplie.

**Principe fondamental** : **Aucun traitement de données personnelles n'est autorisé sans base légale valide**.

### 1.2 Importance de la base légale

**Obligation légale** : Identifier et documenter la base légale est une **obligation** pour toute organisation traitant des données personnelles.

**Conséquences d'une base légale incorrecte** :
- Le traitement devient illicite
- Sanctions de la CNIL (jusqu'à 4% du CA mondial)
- Obligation de cesser le traitement
- Droit d'opposition des personnes concernées

**Impact sur les droits des personnes** :
- La base légale détermine les droits applicables (accès, rectification, effacement, portabilité, opposition)
- Exemple : Si la base est le consentement, la personne peut le retirer à tout moment
- Exemple : Si la base est une obligation légale, le droit d'effacement ne s'applique pas

### 1.3 Principe de licéité

**Article 5.1.a du RGPD** : Les données personnelles doivent être traitées de manière **licite, loyale et transparente**.

**Licéité** : Le traitement doit reposer sur une base légale valide

**Loyauté** : Le traitement ne doit pas tromper les personnes concernées

**Transparence** : Les personnes doivent être informées du traitement et de sa base légale

### 1.4 Choix de la base légale

**Règle** : La base légale doit être déterminée **avant** le début du traitement.

**Impossibilité de changer** : Une fois le traitement commencé, il est très difficile de changer de base légale.

**Critères de choix** :
1. Nature de la relation avec la personne concernée
2. Finalité du traitement
3. Contexte de la collecte
4. Attentes raisonnables de la personne
5. Équilibre des intérêts en présence

**Exemple** :
- Gestion des paies → Obligation légale (Code du travail)
- Newsletter marketing → Consentement
- Gestion d'un contrat client → Exécution d'un contrat
- Vidéosurveillance → Intérêt légitime (sécurité)

---

## 2. Vue d'ensemble de l'étape 6

### 2.1 Objectif de l'étape

L'étape 6 permet d'identifier la ou les **bases légales** qui justifient le traitement de données personnelles.

**Question posée** : "Quelles sont les bases légales de ce traitement ?"

### 2.2 Structure de l'étape

L'étape 6 est composée d'**une seule section** centrée :

```
┌─────────────────────────────────────────────────────────────────┐
│              Étape 6 - Base légale                              │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │                     │
                    │   Carte unique      │
                    │   centrée           │
                    │                     │
                    │   Largeur max :     │
                    │   800px             │
                    │                     │
                    └─────────────────────┘
```

**Caractéristiques** :
- 1 carte unique
- Centrée horizontalement
- Largeur maximale : 800px
- Hauteur minimale : 55vh (viewport height)

### 2.3 Titre de l'étape

**Affichage** :
```
Étape 6 - Base légale
```

**Position** : Centré en haut de la page

**Style** : Titre de niveau 4 (H4)

### 2.4 Layout responsive

#### Desktop (> 960px)
- Carte centrée
- Largeur : 800px
- Marges latérales automatiques

#### Tablet (600px - 960px)
- Carte centrée
- Largeur : 90% de l'écran
- Marges réduites

#### Mobile (< 600px)
- Carte pleine largeur
- Largeur : 95% de l'écran
- Padding réduit

---

## 3. Les 6 bases légales du RGPD

### 3.1 Base 1 : Consentement de la personne concernée

**Article 6.1.a du RGPD**

**Définition** : La personne concernée a consenti au traitement de ses données personnelles pour une ou plusieurs finalités spécifiques.

**Conditions du consentement** :
- **Libre** : Donné sans contrainte, possibilité de refuser
- **Spécifique** : Pour une finalité déterminée
- **Éclairé** : La personne comprend à quoi elle consent
- **Univoque** : Action positive claire (case à cocher, clic, etc.)

**Caractéristiques** :
- Peut être retiré à tout moment
- Doit être aussi facile à retirer qu'à donner
- Doit être prouvable (charge de la preuve pour l'organisation)
- Ne peut pas être la condition d'un service (sauf si nécessaire)

**Exemples d'utilisation** :
- Newsletter marketing
- Cookies non essentiels
- Partage de données avec des partenaires
- Prospection commerciale

**Droits associés** :
- Droit de retirer le consentement
- Droit d'accès
- Droit de rectification
- Droit d'effacement
- Droit à la portabilité
- Droit d'opposition

**Attention** : Le consentement est la base légale la plus contraignante. À utiliser uniquement si aucune autre base ne convient.

### 3.2 Base 2 : Exécution d'un contrat

**Article 6.1.b du RGPD**

**Définition** : Le traitement est nécessaire à l'exécution d'un contrat auquel la personne concernée est partie, ou à l'exécution de mesures précontractuelles prises à la demande de celle-ci.

**Conditions** :
- Un contrat existe ou est en cours de négociation
- Le traitement est **nécessaire** pour exécuter ce contrat
- La personne concernée est partie au contrat

**Exemples d'utilisation** :
- Gestion d'une commande client
- Livraison d'un produit
- Fourniture d'un service
- Gestion d'un compte utilisateur
- Traitement d'un paiement
- Devis et mesures précontractuelles

**Données concernées** :
- Uniquement les données **strictement nécessaires** à l'exécution du contrat
- Exemple : Pour une livraison, l'adresse est nécessaire, mais pas la date de naissance

**Droits associés** :
- Droit d'accès
- Droit de rectification
- Droit à la portabilité
- **Pas de droit d'effacement** (tant que le contrat est en cours)
- **Pas de droit d'opposition** (le traitement est nécessaire)

**Attention** : Cette base ne peut être utilisée que pour les données **strictement nécessaires** au contrat. Pour d'autres finalités (marketing, amélioration du service), une autre base est requise.

### 3.3 Base 3 : Respect d'une obligation légale

**Article 6.1.c du RGPD**

**Définition** : Le traitement est nécessaire au respect d'une obligation légale à laquelle le responsable du traitement est soumis.

**Conditions** :
- Une loi ou un règlement impose le traitement
- L'obligation s'applique au responsable du traitement
- Le traitement est nécessaire pour respecter cette obligation

**Exemples d'utilisation** :
- Gestion des paies (Code du travail)
- Conservation des données comptables (10 ans - Code de commerce)
- Déclarations fiscales et sociales
- Registre du personnel
- Déclarations à l'URSSAF
- Conservation des contrats de travail
- Registre des accidents du travail

**Textes légaux fréquents** :
- Code du travail
- Code de commerce
- Code général des impôts
- Code de la sécurité sociale
- Lois sectorielles (santé, finance, etc.)

**Droits associés** :
- Droit d'accès
- Droit de rectification
- **Pas de droit d'effacement** (l'obligation légale prime)
- **Pas de droit d'opposition** (le traitement est obligatoire)

**Documentation** : Il est recommandé de préciser le texte légal exact (article de loi, décret, etc.).

### 3.4 Base 4 : Sauvegarde des intérêts vitaux

**Article 6.1.d du RGPD**

**Définition** : Le traitement est nécessaire à la sauvegarde des intérêts vitaux de la personne concernée ou d'une autre personne physique.

**Conditions** :
- Situation d'urgence vitale
- Impossibilité d'obtenir le consentement
- Le traitement est nécessaire pour protéger la vie

**Exemples d'utilisation** :
- Urgences médicales (personne inconsciente)
- Catastrophes naturelles
- Épidémies
- Recherche de personnes disparues
- Alertes sanitaires

**Caractéristiques** :
- Base légale **exceptionnelle**
- Utilisée uniquement en cas d'urgence vitale
- Temporaire (le temps de l'urgence)

**Droits associés** :
- Droit d'accès
- Droit de rectification
- Droit d'effacement (après l'urgence)

**Attention** : Cette base ne doit être utilisée que dans des situations d'urgence vitale réelle. Elle ne peut pas justifier un traitement permanent.

### 3.5 Base 5 : Mission d'intérêt public ou autorité publique

**Article 6.1.e du RGPD**

**Définition** : Le traitement est nécessaire à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique dont est investi le responsable du traitement.

**Conditions** :
- Le responsable du traitement est une autorité publique ou exerce une mission de service public
- Le traitement est nécessaire à cette mission
- La mission est prévue par un texte (loi, décret, etc.)

**Exemples d'utilisation** :
- Gestion de l'état civil (mairies)
- Délivrance de titres d'identité
- Gestion des impôts (administration fiscale)
- Justice (tribunaux)
- Enseignement public
- Services sociaux
- Police et gendarmerie

**Organismes concernés** :
- Administrations centrales et déconcentrées
- Collectivités territoriales
- Établissements publics
- Organismes de sécurité sociale
- Organismes privés exerçant une mission de service public

**Droits associés** :
- Droit d'accès
- Droit de rectification
- Droit d'opposition (sauf si le traitement est obligatoire)
- **Pas de droit d'effacement** (tant que la mission l'exige)

**Documentation** : Préciser le texte qui confère la mission d'intérêt public.

### 3.6 Base 6 : Intérêt légitime (non présente dans les options par défaut)

**Article 6.1.f du RGPD**

**Définition** : Le traitement est nécessaire aux fins des intérêts légitimes poursuivis par le responsable du traitement ou par un tiers, à moins que ne prévalent les intérêts ou les libertés et droits fondamentaux de la personne concernée.

**Conditions** :
- Un intérêt légitime existe (économique, sécurité, etc.)
- Le traitement est nécessaire pour cet intérêt
- Les intérêts de la personne ne prévalent pas (test de proportionnalité)

**Exemples d'utilisation** :
- Vidéosurveillance pour la sécurité
- Prévention de la fraude
- Gestion des impayés
- Marketing direct (clients existants)
- Sécurité informatique
- Gestion des litiges

**Test de proportionnalité** (3 étapes) :
1. **Intérêt légitime** : L'intérêt est-il réel et légitime ?
2. **Nécessité** : Le traitement est-il nécessaire pour cet intérêt ?
3. **Équilibre** : Les intérêts de la personne prévalent-ils ?

**Droits associés** :
- Droit d'accès
- Droit de rectification
- **Droit d'opposition** (la personne peut s'opposer au traitement)
- Droit d'effacement (sous conditions)

**Documentation** : Réaliser un test de proportionnalité documenté (LIA - Legitimate Interest Assessment).

**Note** : Cette base n'est pas incluse dans les options par défaut de l'application Registr, mais peut être ajoutée comme option personnalisée.

---

## 4. Composant de sélection

### 4.1 Type de composant

**Composant** : Groupe d'options avec recherche (SearchableOptionsGroup)

**Identique aux étapes 3 et 4** : Même fonctionnement que pour les finalités et catégories de personnes.

### 4.2 Barre de recherche / Autocomplete

**Position** : En haut de la section

**Fonctionnement** : Identique aux étapes précédentes

**Comportement** :
- Saisie avec autocomplétion
- Filtrage en temps réel des options
- Ajout de valeurs personnalisées
- Réinitialisation après sélection

**Placeholder** : "Rechercher"

### 4.3 Zone des options sélectionnées

**Affichage** : Chips colorés en bleu

**Caractéristiques des chips** :
- Couleur de fond : Bleu primaire (#37BCF8)
- Texte : Blanc
- Bordure : 1px blanc semi-transparent
- Ombre portée : Effet de profondeur
- Bordure arrondie : 7px
- Hauteur minimale : 32px
- Texte sur plusieurs lignes si nécessaire (wrap)

**Icône de suppression** :
- Icône : Croix (X)
- Position : À droite du texte
- Style : Cercle blanc avec bordure
- Hover : Effet de surbrillance

**Interaction** :
- Clic sur l'icône X → Retire la base légale de la sélection
- Mise à jour immédiate de l'affichage

**Layout** :
- Disposition en ligne avec retour à la ligne automatique (flex wrap)
- Espacement entre les chips : 12px
- Fond légèrement différent pour distinguer la zone

### 4.4 Options populaires

**Position** : Sous la zone de sélection

**Titre** : "Populaire" (optionnel)

**Comportement** :
- Affiche 4 options prédéfinies aléatoirement
- Sélection aléatoire fixée au premier rendu
- Si moins de 4 options disponibles : Affiche toutes les options

**Affichage des chips** :
- Couleur de fond : Gris foncé
- Texte : Gris clair
- Bordure : 1px gris semi-transparent
- Bordure arrondie : 7px
- Hover : Changement de couleur vers bleu

**Interaction** :
- Clic sur un chip → Ajoute la base légale à la sélection
- Le chip disparaît des options disponibles
- Apparaît dans la zone des sélectionnés

### 4.5 Options prédéfinies

Liste des **5 bases légales standards** proposées par défaut :

1. **Consentement de la personne concernée**
   - Base la plus courante pour le marketing
   - Nécessite une action positive claire
   - Peut être retiré à tout moment

2. **Exécution d'un contrat (ou des mesures précontractuelles)**
   - Pour la gestion des clients, commandes, livraisons
   - Données strictement nécessaires au contrat
   - Pas de droit d'opposition

3. **Respect d'une obligation légale**
   - Pour les traitements imposés par la loi
   - Exemple : paies, comptabilité, déclarations
   - Pas de droit d'effacement

4. **Sauvegarde des intérêts vitaux**
   - Uniquement pour les urgences vitales
   - Base exceptionnelle et temporaire
   - Exemple : urgences médicales

5. **Exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique**
   - Pour les autorités publiques
   - Exemple : état civil, justice, impôts
   - Nécessite un texte légal

**Note** : L'intérêt légitime (base 6) n'est pas inclus par défaut mais peut être ajouté comme option personnalisée.

### 4.6 Titre de la section

**Texte** : "Quelles sont les bases légales de ce traitement ?"

**Position** : Au-dessus de la barre de recherche

**Style** : Titre de niveau 6 (H6)

---

## 5. Options personnalisées

### 5.1 Création d'options personnalisées

**Fonctionnement** : Identique aux étapes précédentes

**Processus** :
1. L'utilisateur tape une nouvelle valeur dans la recherche
2. Si la valeur n'existe pas : Option "Ajouter : [nouvelle valeur]" apparaît
3. Clic sur cette option → Ajout aux paramètres + sélection immédiate

**Exemples de bases légales personnalisées** :
- "Intérêt légitime" (base 6 du RGPD)
- "Intérêt légitime - Prévention de la fraude"
- "Intérêt légitime - Sécurité des locaux"
- "Consentement explicite" (pour données sensibles)
- "Consentement parental" (pour les mineurs)

### 5.2 Source des options personnalisées

**Clé de paramètre** : `customLegalBase`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customLegalBase",
  "value": [
    "Intérêt légitime",
    "Intérêt légitime - Prévention de la fraude",
    "Consentement explicite"
  ]
}
```

**Portée** : Global (tous les utilisateurs de l'organisation)

**Utilisation** : Ces valeurs sont fusionnées avec les options standards

### 5.3 Cas d'usage des options personnalisées

#### Cas 1 : Ajout de l'intérêt légitime

**Raison** : L'intérêt légitime (base 6) n'est pas dans les options par défaut

**Processus** :
1. L'utilisateur tape "Intérêt légitime"
2. Option "Ajouter : Intérêt légitime" apparaît
3. Clic → Ajout et sélection
4. Disponible pour tous les traitements futurs

#### Cas 2 : Précision de l'intérêt légitime

**Raison** : Documenter précisément l'intérêt légitime poursuivi

**Exemples** :
- "Intérêt légitime - Sécurité des biens et des personnes"
- "Intérêt légitime - Prévention de la fraude"
- "Intérêt légitime - Gestion des impayés"
- "Intérêt légitime - Marketing direct (clients existants)"

#### Cas 3 : Consentement spécifique

**Raison** : Préciser le type de consentement

**Exemples** :
- "Consentement explicite" (pour données sensibles - article 9)
- "Consentement parental" (pour les mineurs de moins de 15 ans)
- "Consentement éclairé" (pour la recherche)

### 5.4 Recommandations métier

**Utiliser les options standards** : Dans la majorité des cas, les 5 bases légales standards suffisent

**Préciser si nécessaire** : Ajouter des précisions uniquement si cela apporte de la valeur

**Éviter la multiplication** : Ne pas créer trop d'options personnalisées similaires

**Documenter** : Si une base personnalisée est créée, bien documenter son utilisation

---

## 6. Structure des données

### 6.1 Modèle de données

**Nom du champ** : `legalBase`

**Type** : Tableau d'objets

**Format** :
```json
{
  "legalBase": [
    {
      "name": "Consentement de la personne concernée",
      "additionalInformation": ""
    },
    {
      "name": "Exécution d'un contrat (ou des mesures précontractuelles)",
      "additionalInformation": "Contrat de vente en ligne - CGV acceptées lors de la commande"
    }
  ]
}
```

**Contraintes** :
- Minimum : 0 éléments (brouillon) ou 1 élément (validation)
- Maximum : Illimité (mais généralement 1 à 3 bases)
- `name` : Obligatoire, chaîne non vide, max 500 caractères
- `additionalInformation` : Optionnel, max 2000 caractères

### 6.2 Champ additionalInformation

**Objectif** : Permettre d'ajouter des précisions sur la base légale

**Utilisation** : Actuellement **non implémenté** dans l'interface, mais présent dans le modèle de données

**Exemples de précisions** :
- Pour "Consentement" : "Consentement recueilli via la case à cocher lors de l'inscription"
- Pour "Obligation légale" : "Article L1234-5 du Code du travail"
- Pour "Intérêt légitime" : "Test de proportionnalité réalisé le 15/01/2026 - Voir document LIA-2026-001"

**Amélioration future** : Ajouter un bouton "Précisions" (comme pour les sources de données à l'étape 5) pour permettre de renseigner ce champ.

### 6.3 Sauvegarde dans les paramètres

**Clé de paramètre** : `customLegalBase`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customLegalBase",
  "value": [
    "Intérêt légitime",
    "Intérêt légitime - Prévention de la fraude",
    "Consentement explicite"
  ]
}
```

**Persistance** : Les bases légales personnalisées sont sauvegardées et réutilisables pour tous les traitements

---

## 7. Navigation et validation

### 7.1 Validation du formulaire

#### Validation côté client

**Déclenchement** : Clic sur "Suivant"

**Règles de validation** :

**Étape 6 - Base légale** :
- Pas de validation stricte obligatoire en brouillon
- Au moins une base légale recommandée pour un traitement validé
- Pas de limite sur le nombre de bases légales

**Validation recommandée** :
- Au moins une base légale devrait être sélectionnée
- Les bases légales doivent être cohérentes avec les finalités (étape 3)

**Affichage des erreurs** :
- Message d'erreur sous le champ concerné
- Couleur rouge
- Empêche la navigation vers l'étape suivante

#### Validation côté serveur

**Déclenchement** : À la soumission du formulaire

**Endpoint** : `POST /api/v1/treatments/validation`

**Réponse en cas d'erreur** :
```json
[
  {
    "path": ["legalBase"],
    "message": "Au moins une base légale est requise pour valider le traitement"
  }
]
```

**Gestion** :
- Les erreurs sont affichées sur le champ concerné
- L'utilisateur est redirigé vers l'étape contenant l'erreur

### 7.2 Sauvegarde en brouillon

**Déclenchement** : Clic sur "Enregistrer comme brouillon"

**Comportement** :
- Pas de validation stricte
- Sauvegarde immédiate des données saisies
- Statut du traitement : "Brouillon"
- Message de confirmation

**Endpoint** : `PUT /api/v1/treatments/draft`

**Utilité métier** :
- Permet de travailler progressivement
- Évite de perdre les données
- Permet de reprendre plus tard

### 7.3 Navigation entre les étapes

#### Bouton "Précédent"

**Action** :
1. Sauvegarde les valeurs actuelles du formulaire (pas de validation)
2. Retour à l'étape 5 (Données collectées)
3. Les bases légales sélectionnées sont conservées

**Disponibilité** : Toujours disponible

#### Bouton "Suivant"

**Action** :
1. Déclenche la validation du formulaire
2. Si validation OK : Sauvegarde et passage à l'étape 7 (Partage des données)
3. Si validation KO : Affichage des erreurs, reste sur l'étape

**Disponibilité** : Toujours disponible

#### Bouton "Passer"

**Action** :
1. Ignore l'étape actuelle sans modification
2. Passage direct à l'étape 7
3. Pas de sauvegarde des modifications

**Disponibilité** : Uniquement si le traitement est déjà validé (mode édition)

---

## 8. Intégration API

### 8.1 Récupération des paramètres

#### Endpoint : GET /api/v1/settings/customLegalBase

**Méthode** : GET

**Path parameter** : `customLegalBase`

**Requête** :
```http
GET /api/v1/settings/customLegalBase HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Accept: application/json
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customLegalBase",
  "value": [
    "Intérêt légitime",
    "Intérêt légitime - Prévention de la fraude",
    "Consentement explicite"
  ]
}
```

**Utilisation** :
- Chargement au montage du composant
- Fusion avec les options standards
- Affichage dans la liste des options disponibles

### 8.2 Mise à jour des paramètres

#### Endpoint : PUT /api/v1/settings

**Méthode** : PUT

**Headers** :
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Requête** :
```http
PUT /api/v1/settings HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "customLegalBase",
  "value": [
    "Intérêt légitime",
    "Intérêt légitime - Prévention de la fraude",
    "Consentement explicite",
    "Intérêt légitime - Sécurité des locaux"
  ]
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customLegalBase",
  "value": [
    "Intérêt légitime",
    "Intérêt légitime - Prévention de la fraude",
    "Consentement explicite",
    "Intérêt légitime - Sécurité des locaux"
  ]
}
```

**Déclenchement** :
- Automatique lors de l'ajout d'une valeur personnalisée
- L'utilisateur n'a pas besoin de sauvegarder manuellement

### 8.3 Validation du traitement

#### Endpoint : POST /api/v1/treatments/validation

**Méthode** : POST

**Body** :
```json
{
  "title": "Newsletter marketing",
  "reasons": ["Marketing", "Communication"],
  "legalBase": [
    {
      "name": "Consentement de la personne concernée",
      "additionalInformation": ""
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
    "path": ["legalBase"],
    "message": "Au moins une base légale est requise pour valider le traitement"
  }
]
```

### 8.4 Sauvegarde en brouillon

#### Endpoint : PUT /api/v1/treatments/draft

**Méthode** : PUT

**Body** :
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Newsletter marketing",
  "legalBase": [
    {
      "name": "Consentement de la personne concernée",
      "additionalInformation": ""
    }
  ]
}
```

**Réponse** : Traitement complet sauvegardé

**Comportement** :
- Pas de validation stricte
- Accepte les données incomplètes
- Statut automatiquement défini sur "draft"

---

## 9. Règles de gestion

### 9.1 Règles métier - Base légale

#### RG-BL1 : Base légale obligatoire

**Règle** : Un traitement doit avoir au moins une base légale pour être validé.

**Exception** : Un brouillon peut n'avoir aucune base légale.

**Justification RGPD** : Article 6 - Licéité du traitement

#### RG-BL2 : Bases légales multiples

**Règle** : Un traitement peut avoir plusieurs bases légales si plusieurs finalités sont poursuivies.

**Exemple** :
- Finalité 1 : Gestion du contrat → Base : Exécution d'un contrat
- Finalité 2 : Newsletter → Base : Consentement

**Recommandation** : Documenter clairement quelle base légale s'applique à quelle finalité

#### RG-BL3 : Cohérence avec les finalités

**Règle** : Les bases légales doivent être cohérentes avec les finalités déclarées à l'étape 3.

**Exemples de cohérence** :
- Finalité "Marketing" → Base "Consentement" ✅
- Finalité "Gestion des paies" → Base "Obligation légale" ✅
- Finalité "Gestion des commandes" → Base "Exécution d'un contrat" ✅

**Exemples d'incohérence** :
- Finalité "Marketing" → Base "Obligation légale" ❌
- Finalité "Newsletter" → Base "Exécution d'un contrat" ❌

#### RG-BL4 : Unicité des bases légales

**Règle** : Une base légale ne peut être sélectionnée qu'une seule fois.

**Comportement** : Si l'utilisateur clique sur une base déjà sélectionnée, elle est retirée (toggle).

#### RG-BL5 : Persistance des bases personnalisées

**Règle** : Les bases légales personnalisées créées sont sauvegardées dans les paramètres.

**Portée** : Disponibles pour tous les traitements et tous les utilisateurs de l'organisation.

**Suppression** : Via l'interface de gestion des paramètres uniquement.

### 9.2 Règles techniques

#### RT-1 : Ordre de fusion des options

**Règle** : Les options affichées sont la fusion de :
1. Options standards (5 bases légales du RGPD)
2. Options personnalisées (depuis les paramètres)

**Ordre d'affichage** :
1. Options standards en premier
2. Options personnalisées ensuite

#### RT-2 : Filtrage des doublons

**Règle** : Lors de l'ajout d'une option personnalisée, vérifier qu'elle n'existe pas déjà.

**Comparaison** :
- Insensible à la casse
- Trim des espaces avant et après

**Exemple** :
```
"Consentement" === "consentement" === " Consentement " → Doublon détecté
```

#### RT-3 : Synchronisation état local / formulaire

**Règle** : Toute modification doit mettre à jour :
1. L'état local du composant (pour l'affichage)
2. L'état du formulaire (pour la sauvegarde)

#### RT-4 : Format des données sauvegardées

**Règle** : Les bases légales sont sauvegardées sous forme d'objets avec `name` et `additionalInformation`.

**Transformation** : Lors de la sélection, transformer les chaînes en objets :
```javascript
selected.map((name) => ({
  name,
  additionalInformation: ''
}))
```

---

## 10. Internationalisation

### 10.1 Clés de traduction - Étape 6

**Namespace** : `treatments`

| Clé | Français | Anglais |
|-----|----------|---------|
| `steps.step6` | Étape 6 | Step 6 |
| `steps.legalBase` | Base légale | Legal Basis |
| `form.legalBase.title` | Quelles sont les bases légales de ce traitement ? | What are the legal bases for this processing? |
| `form.legalBase.legalBaseLabel` | Base légale | Legal Basis |
| `form.legalBase.legalBasePlaceholder` | Décrivez la base légale... | Describe the legal basis... |
| `form.legalBase.addCustomBase` | Ajouter une base légale | Add a Legal Basis |
| `form.legalBase.customBaseLabel` | Nouvelle base légale | New Legal Basis |

### 10.2 Options standards - Bases légales

**Note** : Les bases légales ne sont généralement **pas traduites** car elles font référence à des textes légaux spécifiques.

**Recommandation** : Utiliser les formulations officielles du RGPD dans chaque langue.

| Base légale (FR) | Base légale (EN) |
|------------------|------------------|
| Consentement de la personne concernée | Consent of the data subject |
| Exécution d'un contrat (ou des mesures précontractuelles) | Performance of a contract (or pre-contractual measures) |
| Respect d'une obligation légale | Compliance with a legal obligation |
| Sauvegarde des intérêts vitaux | Protection of vital interests |
| Exécution d'une mission d'intérêt public ou relevant de l'exercice de l'autorité publique | Performance of a task carried out in the public interest or in the exercise of official authority |

### 10.3 Clés communes

**Namespace** : `common`

| Clé | Français | Anglais |
|-----|----------|---------|
| `common:search` | Rechercher | Search |
| `common:popular` | Populaire | Popular |
| `common:add` | Ajouter | Add |
| `common:save` | Enregistrer | Save |
| `common:cancel` | Annuler | Cancel |

---

## 11. Accessibilité

### 11.1 Navigation au clavier

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
- Entrée ou Espace : Retrait de la sélection (clic sur X)

### 11.2 Lecteurs d'écran

#### Attributs ARIA

**Champ de recherche** :
- `role="combobox"`
- `aria-expanded="true/false"`
- `aria-autocomplete="list"`
- `aria-controls="liste-options"`

**Chips cliquables** :
- `role="button"`
- `tabindex="0"`
- `aria-label="[Nom de la base légale]"`

**Chips sélectionnés** :
- `aria-label="[Nom de la base légale] - Cliquer pour retirer"`

#### Annonces vocales

**Ajout d'une base légale** :
- Annonce : "[Nom de la base légale] ajoutée"

**Retrait d'une base légale** :
- Annonce : "[Nom de la base légale] retirée"

### 11.3 Contraste et visibilité

#### Ratios de contraste (WCAG AA)

**Texte normal** : Minimum 4.5:1
- Texte blanc sur fond bleu : ✅ Conforme

**Éléments interactifs** : Minimum 3:1
- Bordures des chips : ✅ Conforme

#### États de focus

**Tous les éléments interactifs** :
- Outline : 2px solid bleu primaire
- Offset : 2px
- Visible en permanence au focus

### 11.4 Responsive design

#### Desktop (> 960px)
- Carte centrée
- Largeur : 800px

#### Tablet (600px - 960px)
- Carte centrée
- Largeur : 90% de l'écran

#### Mobile (< 600px)
- Carte pleine largeur
- Largeur : 95% de l'écran
- Chips : Largeur 100% ou auto

---

## 12. Cas d'usage détaillés

### 12.1 Cas d'usage 1 : Newsletter marketing

**Contexte** : Une entreprise veut documenter son traitement de newsletter.

**Étape 6 - Base légale** :

1. L'utilisateur arrive sur l'étape 6
2. Il voit les 4 options populaires affichées
3. Il clique sur "Consentement de la personne concernée"
4. Le chip devient bleu et apparaît dans la zone de sélection
5. Il clique sur "Suivant" → Passage à l'étape 7

**Justification métier** :
- La newsletter marketing nécessite le consentement
- Le consentement doit être libre, spécifique, éclairé et univoque
- La personne peut se désinscrire à tout moment

### 12.2 Cas d'usage 2 : Gestion des paies

**Contexte** : Une entreprise documente son traitement de gestion des paies.

**Étape 6 - Base légale** :

1. L'utilisateur arrive sur l'étape 6
2. Il clique sur "Respect d'une obligation légale"
3. Le chip est ajouté à la sélection
4. Il clique sur "Suivant"

**Justification métier** :
- Le Code du travail impose la gestion des paies
- L'employeur a l'obligation de payer les salaires
- Les données de paie doivent être conservées 5 ans minimum

### 12.3 Cas d'usage 3 : E-commerce (bases multiples)

**Contexte** : Une boutique en ligne documente son traitement client.

**Étape 6 - Base légale** :

1. L'utilisateur arrive sur l'étape 6
2. Il sélectionne "Exécution d'un contrat (ou des mesures précontractuelles)"
   - Pour la gestion des commandes et livraisons
3. Il sélectionne également "Consentement de la personne concernée"
   - Pour la newsletter marketing (finalité distincte)
4. Il a maintenant 2 bases légales sélectionnées
5. Il clique sur "Suivant"

**Justification métier** :
- Deux finalités distinctes = deux bases légales distinctes
- Le contrat couvre la gestion de la commande
- Le consentement couvre le marketing

### 12.4 Cas d'usage 4 : Vidéosurveillance (intérêt légitime)

**Contexte** : Une entreprise documente son système de vidéosurveillance.

**Étape 6 - Base légale** :

1. L'utilisateur arrive sur l'étape 6
2. Il ne trouve pas "Intérêt légitime" dans les options
3. Il tape "Intérêt légitime" dans la recherche
4. Option "Ajouter : Intérêt légitime" apparaît
5. Il clique dessus → Ajout et sélection
6. Il veut être plus précis
7. Il retire "Intérêt légitime"
8. Il tape "Intérêt légitime - Sécurité des biens et des personnes"
9. Il ajoute cette nouvelle option personnalisée
10. Il clique sur "Suivant"

**Justification métier** :
- La vidéosurveillance repose généralement sur l'intérêt légitime
- L'intérêt : Sécurité des biens et des personnes
- Un test de proportionnalité doit être réalisé
- Les personnes doivent être informées (panneaux)

### 12.5 Cas d'usage 5 : Modification d'un traitement existant

**Contexte** : Un utilisateur veut changer la base légale d'un traitement.

**Étape 6 - Base légale** :

1. L'utilisateur ouvre un traitement existant en mode édition
2. Il arrive sur l'étape 6
3. La base légale actuelle est affichée : "Consentement de la personne concernée"
4. Il réalise que la base légale n'est pas appropriée
5. Il clique sur l'icône X du chip "Consentement"
6. Il sélectionne "Exécution d'un contrat"
7. Il clique sur "Suivant"

**Attention métier** : Changer de base légale en cours de traitement est **très délicat** et peut nécessiter de :
- Informer à nouveau les personnes concernées
- Obtenir un nouveau consentement si nécessaire
- Vérifier la compatibilité avec les finalités
- Consulter un juriste

### 12.6 Cas d'usage 6 : Gestion des erreurs

**Contexte** : L'utilisateur essaie de valider sans sélectionner de base légale.

**Étape 6 - Base légale** :

1. L'utilisateur arrive sur l'étape 6
2. Il ne sélectionne aucune base légale
3. Il clique sur "Suivant"
4. Validation côté serveur déclenche une erreur
5. Message d'erreur s'affiche : "Au moins une base légale est requise pour valider le traitement"
6. L'utilisateur sélectionne "Consentement de la personne concernée"
7. Il clique sur "Suivant"
8. Validation réussie → Passage à l'étape 7

---

## 13. Maquettes et wireframes

### 13.1 Vue d'ensemble de l'étape 6

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              Étape 6 - Base légale                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │                         │
                    │  Quelles sont les bases │
                    │  légales de ce          │
                    │  traitement ?           │
                    │                         │
                    │  ┌───────────────────┐  │
                    │  │ 🔍 Rechercher... ▼│  │
                    │  └───────────────────┘  │
                    │                         │
                    │  ┌───────────────────┐  │
                    │  │ Sélectionnés :    │  │
                    │  │                   │  │
                    │  │ [Consentement ✕] │  │
                    │  │                   │  │
                    │  └───────────────────┘  │
                    │                         │
                    │  Populaire              │
                    │                         │
                    │  [Exécution contrat]    │
                    │  [Obligation légale]    │
                    │  [Intérêts vitaux]      │
                    │  [Mission publique]     │
                    │                         │
                    └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [ ← Précédent ]  [ Enregistrer comme brouillon ]  [ Suivant → ]│
└─────────────────────────────────────────────────────────────────┘
```

### 13.2 Détail des chips sélectionnés

```
┌─────────────────────────────────────────────────────────────┐
│  Sélectionnés :                                             │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │ Consentement de la personne concernée    ✕   │          │
│  │ (bleu)                                       │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
│  ┌──────────────────────────────────────────────┐          │
│  │ Exécution d'un contrat                   ✕   │          │
│  │ (bleu)                                       │          │
│  └──────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 13.3 Options populaires

```
┌─────────────────────────────────────────────────────────────┐
│  Populaire                                                  │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────┐   │
│  │ Exécution d'un contrat   │  │ Obligation légale    │   │
│  │ (gris)                   │  │ (gris)               │   │
│  └──────────────────────────┘  └──────────────────────┘   │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────┐   │
│  │ Intérêts vitaux          │  │ Mission publique     │   │
│  │ (gris)                   │  │ (gris)               │   │
│  └──────────────────────────┘  └──────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 13.4 Ajout d'une option personnalisée

```
┌─────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🔍 Intérêt légitime                               ▼   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Suggestions :                                         │  │
│  │                                                       │  │
│  │ ➕ Ajouter : Intérêt légitime                        │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. Annexes

### 14.1 Tableau récapitulatif des bases légales

| Base légale | Exemples | Droits applicables | Particularités |
|-------------|----------|-------------------|----------------|
| **Consentement** | Newsletter, Cookies, Prospection | Accès, Rectification, Effacement, Portabilité, Opposition | Peut être retiré à tout moment |
| **Contrat** | Commandes, Livraisons, Compte client | Accès, Rectification, Portabilité | Pas d'effacement ni d'opposition |
| **Obligation légale** | Paies, Comptabilité, Déclarations | Accès, Rectification | Pas d'effacement ni d'opposition |
| **Intérêts vitaux** | Urgences médicales | Accès, Rectification, Effacement | Base exceptionnelle et temporaire |
| **Mission publique** | État civil, Justice, Impôts | Accès, Rectification, Opposition (limité) | Réservée aux autorités publiques |
| **Intérêt légitime** | Vidéosurveillance, Fraude, Impayés | Accès, Rectification, Opposition, Effacement (limité) | Test de proportionnalité requis |

### 14.2 Arbre de décision - Choix de la base légale

```
┌─────────────────────────────────────────────────────────────┐
│ Le traitement est-il imposé par une loi ou un règlement ?  │
└─────────────────────────────────────────────────────────────┘
                    │
        Oui ────────┴──────── Non
         │                    │
         ▼                    ▼
┌──────────────────┐  ┌────────────────────────────────────┐
│ Obligation légale│  │ Le traitement est-il nécessaire    │
└──────────────────┘  │ à l'exécution d'un contrat ?       │
                      └────────────────────────────────────┘
                                  │
                      Oui ────────┴──────── Non
                       │                    │
                       ▼                    ▼
              ┌─────────────────┐  ┌──────────────────────┐
              │ Exécution d'un  │  │ S'agit-il d'une      │
              │ contrat         │  │ urgence vitale ?     │
              └─────────────────┘  └──────────────────────┘
                                           │
                               Oui ────────┴──────── Non
                                │                    │
                                ▼                    ▼
                       ┌─────────────────┐  ┌──────────────┐
                       │ Sauvegarde des  │  │ Êtes-vous une│
                       │ intérêts vitaux │  │ autorité     │
                       └─────────────────┘  │ publique ?   │
                                            └──────────────┘
                                                    │
                                        Oui ────────┴──────── Non
                                         │                    │
                                         ▼                    ▼
                                ┌─────────────────┐  ┌──────────────┐
                                │ Mission d'intérêt│  │ Avez-vous un │
                                │ public          │  │ intérêt      │
                                └─────────────────┘  │ légitime ?   │
                                                     └──────────────┘
                                                             │
                                                 Oui ────────┴──────── Non
                                                  │                    │
                                                  ▼                    ▼
                                         ┌─────────────────┐  ┌──────────────┐
                                         │ Intérêt légitime│  │ Consentement │
                                         │ (+ test de      │  │              │
                                         │ proportionnalité)│  │              │
                                         └─────────────────┘  └──────────────┘
```

### 14.3 Exemples de traitements par base légale

#### Consentement
- Newsletter marketing
- Cookies non essentiels (analytics, publicité)
- Prospection commerciale par email
- Partage de données avec des partenaires
- Géolocalisation (sauf si nécessaire au service)
- Réseaux sociaux (partage de contenu)

#### Exécution d'un contrat
- Gestion des commandes en ligne
- Livraison de produits
- Création et gestion d'un compte client
- Traitement des paiements
- Service après-vente
- Gestion des abonnements

#### Obligation légale
- Gestion des paies (Code du travail)
- Conservation des données comptables (10 ans)
- Déclarations fiscales et sociales
- Registre du personnel
- Conservation des contrats de travail
- Déclarations à l'URSSAF
- Registre des accidents du travail

#### Intérêts vitaux
- Urgences médicales (personne inconsciente)
- Catastrophes naturelles
- Épidémies
- Recherche de personnes disparues
- Alertes sanitaires

#### Mission d'intérêt public
- État civil (mairies)
- Délivrance de titres d'identité
- Gestion des impôts
- Justice
- Enseignement public
- Services sociaux
- Police et gendarmerie

#### Intérêt légitime
- Vidéosurveillance (sécurité)
- Prévention de la fraude
- Gestion des impayés
- Marketing direct (clients existants)
- Sécurité informatique
- Gestion des litiges
- Contrôle d'accès aux locaux

### 14.4 Glossaire RGPD

**Base légale** : Fondement juridique qui autorise le traitement de données personnelles (article 6 du RGPD).

**Consentement** : Manifestation de volonté libre, spécifique, éclairée et univoque par laquelle la personne accepte le traitement de ses données.

**Contrat** : Accord entre deux parties créant des obligations réciproques. Le traitement doit être nécessaire à l'exécution de ce contrat.

**Obligation légale** : Obligation imposée par une loi ou un règlement à laquelle le responsable du traitement est soumis.

**Intérêts vitaux** : Intérêts essentiels pour la vie d'une personne (urgence vitale).

**Mission d'intérêt public** : Mission confiée à une autorité publique ou à un organisme exerçant une mission de service public.

**Intérêt légitime** : Intérêt poursuivi par le responsable du traitement ou un tiers, à condition qu'il ne porte pas atteinte aux droits et libertés des personnes concernées.

**Test de proportionnalité** : Analyse permettant de vérifier que l'intérêt légitime ne porte pas atteinte aux droits des personnes (aussi appelé LIA - Legitimate Interest Assessment).

**Licéité** : Caractère légal d'un traitement, reposant sur une base légale valide.

**Finalité** : Objectif pour lequel les données sont collectées et traitées.

**Responsable du traitement** : Personne physique ou morale qui détermine les finalités et les moyens du traitement.

### 14.5 Références légales

**Textes principaux** :
- **RGPD** : Règlement (UE) 2016/679 du 27 avril 2016
- **Article 6** : Licéité du traitement (bases légales)
- **Article 9** : Traitement des données sensibles (consentement explicite requis)
- **Loi Informatique et Libertés** : Loi n° 78-17 du 6 janvier 1978 modifiée

**Ressources CNIL** :
- Guide des bases légales : https://www.cnil.fr/fr/les-bases-legales
- Consentement : https://www.cnil.fr/fr/le-consentement
- Intérêt légitime : https://www.cnil.fr/fr/linteret-legitime-comme-base-legale
- Obligations légales : https://www.cnil.fr/fr/lobligation-legale

**Lignes directrices européennes** :
- EDPB (European Data Protection Board) : Guidelines on consent
- EDPB : Guidelines on legitimate interest

### 14.6 Conseils pratiques

#### Pour choisir la bonne base légale

1. **Analyser la finalité** : Pourquoi collectez-vous ces données ?
2. **Vérifier la nécessité** : Le traitement est-il vraiment nécessaire ?
3. **Examiner le contexte** : Quelle est la relation avec la personne ?
4. **Consulter les textes** : Une loi impose-t-elle ce traitement ?
5. **Évaluer les attentes** : La personne s'attend-elle à ce traitement ?
6. **Documenter** : Justifier le choix de la base légale

#### Erreurs fréquentes à éviter

❌ **Utiliser le consentement par défaut** : Le consentement n'est pas toujours la meilleure base légale

❌ **Confondre contrat et consentement** : Si le traitement est nécessaire au contrat, c'est la base "contrat" qui s'applique

❌ **Invoquer une obligation légale inexistante** : Vérifier qu'une loi impose réellement le traitement

❌ **Changer de base légale en cours de traitement** : La base légale doit être déterminée avant le début du traitement

❌ **Utiliser l'intérêt légitime sans test de proportionnalité** : L'intérêt légitime nécessite une analyse documentée

#### Bonnes pratiques

✅ **Documenter le choix** : Expliquer pourquoi cette base légale a été choisie

✅ **Informer les personnes** : Indiquer la base légale dans la politique de confidentialité

✅ **Réviser régulièrement** : Vérifier que la base légale est toujours appropriée

✅ **Former les équipes** : Sensibiliser les collaborateurs aux bases légales

✅ **Consulter un expert** : En cas de doute, consulter un juriste spécialisé RGPD

---

**Fin du document**

Ce document fournit toutes les informations nécessaires pour implémenter l'étape 6 du formulaire de traitement dans n'importe quel framework frontend.
