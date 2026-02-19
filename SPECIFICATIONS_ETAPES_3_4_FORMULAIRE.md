# Spécifications Fonctionnelles - Étapes 3 et 4 du Formulaire de Traitement

## Document de spécifications pour développeur expérimenté

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr Frontend - Gestion des traitements RGPD  

---

## Table des matières

1. [Contexte métier et RGPD](#1-contexte-métier-et-rgpd)
2. [Vue d'ensemble du formulaire](#2-vue-densemble-du-formulaire)
3. [Étape 3 - Finalités du traitement](#3-étape-3---finalités-du-traitement)
4. [Étape 4 - Catégories de personnes concernées](#4-étape-4---catégories-de-personnes-concernées)
5. [Structure des données](#5-structure-des-données)
6. [Navigation et validation](#6-navigation-et-validation)
7. [Intégration API](#7-intégration-api)
8. [Règles de gestion](#8-règles-de-gestion)
9. [Internationalisation](#9-internationalisation)
10. [Accessibilité](#10-accessibilité)

---

## 1. Contexte métier et RGPD

### 1.1 Qu'est-ce qu'un traitement de données personnelles ?

Un **traitement de données personnelles** est une opération, ou ensemble d'opérations, portant sur des données personnelles, quel que soit le procédé utilisé :
- Collecte
- Enregistrement
- Organisation
- Conservation
- Adaptation
- Modification
- Extraction
- Consultation
- Utilisation
- Communication par transmission ou diffusion
- Toute autre forme de mise à disposition
- Rapprochement

**Exemples concrets** :
- Gestion des paies des employés
- Tenue du registre des sous-traitants
- Gestion des ressources humaines
- Gestion de la relation client (CRM)
- Newsletter marketing
- Système de candidatures en ligne

### 1.2 Obligation légale

Selon le **RGPD (Règlement Général sur la Protection des Données)**, toute organisation traitant des données personnelles doit :
- Tenir un **registre des traitements** à jour
- Documenter chaque traitement avec précision
- Identifier les finalités de chaque traitement
- Identifier les catégories de personnes concernées

### 1.3 Principe de finalité

**Article 5.1.b du RGPD** : Les données personnelles doivent être collectées pour des **finalités déterminées, explicites et légitimes**, et ne pas être traitées ultérieurement d'une manière incompatible avec ces finalités.

**Conséquences pratiques** :
- Chaque traitement doit avoir un objectif clair et défini
- Les données ne peuvent être utilisées que pour cet objectif
- Toute nouvelle utilisation nécessite une nouvelle base légale

### 1.4 Identification des personnes concernées

Le RGPD impose d'identifier précisément **qui** est concerné par le traitement :
- Clients
- Employés
- Prospects
- Fournisseurs
- Etc.

Cette identification permet de :
- Déterminer les droits applicables (droit d'accès, de rectification, d'effacement, etc.)
- Évaluer les risques pour les personnes
- Définir les mesures de sécurité appropriées

---

## 2. Vue d'ensemble du formulaire

### 2.1 Concept général

Le formulaire de création/modification de traitement est un **wizard multi-étapes** (8 étapes au total). Ce document se concentre sur les **étapes 3 et 4**.

### 2.2 Progression du formulaire

```
Étape 1 : Titre du traitement
Étape 2 : Informations générales (responsable, DPO, type)
→ Étape 3 : Finalités du traitement ← FOCUS
→ Étape 4 : Catégories de personnes concernées ← FOCUS
Étape 5 : Données collectées
Étape 6 : Base légale
Étape 7 : Partage des données
Étape 8 : Mesures de sécurité
```

### 2.3 Navigation entre les étapes

Chaque étape dispose de **4 actions de navigation** :

1. **Précédent** : Retour à l'étape précédente
   - Sauvegarde automatique des valeurs saisies
   - Pas de validation requise
   - Toujours disponible (sauf étape 1)

2. **Suivant** : Passage à l'étape suivante
   - Déclenche la validation du formulaire
   - Sauvegarde les données si validation réussie
   - Bloqué si erreurs de validation

3. **Passer** : Ignorer l'étape actuelle
   - Disponible uniquement si le traitement est déjà validé (mode édition)
   - Permet de sauter une étape sans modification
   - Pas de validation requise

4. **Enregistrer comme brouillon** : Sauvegarde intermédiaire
   - Disponible à tout moment
   - Pas de validation stricte
   - Permet de reprendre plus tard
   - Change le statut en "Brouillon"

### 2.4 Layout commun

Toutes les étapes partagent le même layout :

**En-tête** :
- Numéro de l'étape (ex: "Étape 3")
- Titre de l'étape (ex: "Finalité(s) du traitement")
- Centré horizontalement

**Corps** :
- Carte principale centrée
- Largeur maximale : 800px (étapes 3 et 4)
- Padding : 24px
- Fond semi-transparent avec effet de flou (glassmorphism)
- Bordure arrondie

**Pied de page** :
- Barre de navigation avec les 4 boutons
- Position fixe en bas de l'écran
- Toujours visible

---

## 3. Étape 3 - Finalités du traitement

### 3.1 Objectif métier

Cette étape permet de définir **pourquoi** l'organisation traite les données personnelles. C'est l'élément central de la conformité RGPD.

**Question posée** : "Pourquoi traitez-vous ces données ?"

### 3.2 Composants de l'interface

#### 3.2.1 Titre de l'étape

**Affichage** :
```
Étape 3 - Finalité(s) du traitement
```

**Position** : Centré en haut de la page

**Style** : Titre de niveau 4 (H4)

#### 3.2.2 Carte principale

**Contenu** : Zone de sélection des finalités

**Dimensions** :
- Largeur maximale : 800px
- Largeur : 100% (responsive)
- Centré horizontalement

#### 3.2.3 Composant de sélection des finalités

**Type** : Groupe d'options avec recherche (SearchableOptionsGroup)

**Fonctionnalités** :

##### A. Barre de recherche / Autocomplete

**Position** : En haut du composant

**Comportement** :
- Champ de saisie avec autocomplétion
- Affiche les suggestions en temps réel
- Filtrage des options selon la saisie
- Permet la saisie de valeurs personnalisées

**Interactions** :
1. L'utilisateur tape dans le champ
2. Les options disponibles sont filtrées en temps réel
3. Une liste déroulante s'affiche avec les correspondances
4. L'utilisateur peut :
   - Cliquer sur une option suggérée → Ajout immédiat
   - Appuyer sur Entrée → Ajout de la valeur saisie (si valeurs personnalisées autorisées)
   - Continuer à taper pour affiner

**Valeurs personnalisées** :
- Si la valeur saisie n'existe pas dans les options
- ET que `allowCustomValues = true`
- ALORS afficher une option spéciale : "Ajouter : [valeur saisie]"
- Au clic : Ajoute la valeur personnalisée

**Réinitialisation** :
- Le champ se vide après chaque sélection
- Focus automatique pour faciliter l'ajout multiple

##### B. Zone des options sélectionnées

**Position** : Sous la barre de recherche

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
- Clic sur l'icône X → Retire la finalité de la sélection
- Mise à jour immédiate de l'affichage

**Layout** :
- Disposition en ligne avec retour à la ligne automatique (flex wrap)
- Espacement entre les chips : 12px
- Fond légèrement différent pour distinguer la zone

##### C. Options populaires

**Position** : Sous la zone de sélection

**Titre** : "Populaire" (optionnel, peut être masqué)

**Comportement** :
- Affiche 4 options prédéfinies aléatoirement
- Sélection aléatoire fixée au premier rendu (pas de changement au re-render)
- Si moins de 4 options disponibles : Affiche toutes les options

**Affichage des chips** :
- Couleur de fond : Gris foncé
- Texte : Gris clair
- Bordure : 1px gris semi-transparent
- Bordure arrondie : 7px
- Hover : Changement de couleur vers bleu

**Interaction** :
- Clic sur un chip → Ajoute la finalité à la sélection
- Le chip disparaît des options disponibles
- Apparaît dans la zone des sélectionnés

**Accessibilité** :
- Tabulation : Navigation au clavier
- Entrée/Espace : Sélection de l'option

##### D. Toutes les options disponibles

**Affichage** : Si la recherche est active, affiche les résultats filtrés

**Comportement** : Identique aux options populaires

**Filtrage** :
- Recherche insensible à la casse
- Recherche sur le texte complet
- Mise à jour en temps réel

### 3.3 Options prédéfinies (finalités standards)

Liste des 9 finalités standards proposées par défaut :

1. **Collecte de données**
   - Métier : Recueil initial des informations
   - Exemples : Formulaire d'inscription, questionnaire

2. **Gestion des utilisateurs**
   - Métier : Administration des comptes utilisateurs
   - Exemples : Création de compte, gestion des profils, authentification

3. **Marketing**
   - Métier : Actions commerciales et promotionnelles
   - Exemples : Newsletter, publicité ciblée, campagnes email

4. **Analyse**
   - Métier : Études statistiques et analytiques
   - Exemples : Analytics web, études de comportement, KPI

5. **Conformité légale**
   - Métier : Respect des obligations légales et réglementaires
   - Exemples : Déclarations fiscales, obligations comptables, archivage légal

6. **Amélioration du service**
   - Métier : Optimisation de l'expérience utilisateur
   - Exemples : Tests A/B, feedback utilisateur, développement produit

7. **Support client**
   - Métier : Assistance et service après-vente
   - Exemples : Tickets de support, hotline, chat en ligne

8. **Recherche**
   - Métier : Études et recherches internes
   - Exemples : R&D, études de marché, innovation

9. **Sécurité**
   - Métier : Protection des systèmes et des données
   - Exemples : Détection de fraude, logs de sécurité, surveillance

### 3.4 Options personnalisées

**Source** : Paramètres de l'application (clé : `customReasons`)

**Fonctionnement** :
- L'utilisateur peut créer ses propres finalités
- Ces finalités sont sauvegardées dans les paramètres
- Elles apparaissent dans la liste des options disponibles
- Elles sont réutilisables pour tous les traitements

**Création** :
1. L'utilisateur tape une nouvelle valeur dans la recherche
2. Si la valeur n'existe pas : Option "Ajouter : [nouvelle valeur]" apparaît
3. Clic sur cette option → Ajout aux paramètres + sélection immédiate

**Persistance** :
- Sauvegarde dans la base de données (table settings)
- Disponible pour tous les traitements futurs
- Partagée entre tous les utilisateurs de l'organisation

### 3.5 Sous-finalités (détails supplémentaires)

#### Concept métier

Les **sous-finalités** permettent de préciser et détailler les finalités principales. Elles offrent un niveau de granularité supplémentaire pour documenter précisément le traitement.

**Exemple** :
- Finalité principale : "Gestion des utilisateurs"
- Sous-finalité 1 : "Création et gestion des comptes clients" → Description détaillée
- Sous-finalité 2 : "Authentification et contrôle d'accès" → Description détaillée
- Sous-finalité 3 : "Gestion des préférences utilisateur" → Description détaillée

#### Accès aux sous-finalités

**Déclencheur** : Bouton "Sous-finalités"

**Position** : Sous la zone de sélection des finalités principales

**Style du bouton** :
- Couleur de fond : Or (#DDB867)
- Texte : Noir foncé (#10172A)
- Bordure : Noir foncé
- Largeur : 200px
- Hover : Fond blanc, bordure blanche

**Action** : Ouvre une modale

#### Modale des sous-finalités

**Titre** : "Sous-finalités"

**Dimensions** :
- Largeur : 90% de l'écran (max 800px)
- Hauteur maximale : 70% de la hauteur de l'écran
- Scroll vertical si contenu déborde

**Style** :
- Fond : Noir foncé (#111827) avec effet de flou (backdrop blur)
- Bordure arrondie : 19px
- Padding : 40px
- Overlay semi-transparent derrière

**Contenu** : Formulaire de gestion des sous-finalités

#### Formulaire des sous-finalités

##### Liste des sous-finalités existantes

**Affichage** : Liste verticale des sous-finalités déjà créées

**Pour chaque sous-finalité** :

**Champ 1 - Nom (label du champ texte)** :
- Affiché comme label du champ de description
- Non modifiable directement
- Exemple : "Création et gestion des comptes clients"

**Champ 2 - Description (textarea)** :
- Type : Champ texte multiligne
- Lignes minimales : 1
- Lignes maximales : 40
- Redimensionnement vertical : Autorisé
- Placeholder : "Description pour [nom de la sous-finalité]"
- Label : Nom de la sous-finalité
- Largeur : 100%
- Obligatoire : Oui

**Bouton de suppression** :
- Icône : Poubelle ou croix
- Position : À droite du champ de description
- Style : Bouton circulaire avec bordure
- Taille : 40x40px
- Action : Supprime la sous-finalité de la liste

**Layout** :
- Disposition horizontale : [Champ de description] [Bouton supprimer]
- Espacement : 8px entre les éléments
- Marge entre les sous-finalités : 16px

##### Ajout d'une nouvelle sous-finalité

**État initial** : Bouton "Ajouter une sous-finalité"

**Style du bouton** :
- Couleur : Or (#DDB867)
- Texte : Noir foncé
- Icône : Plus (+)
- Largeur : 300px
- Position : En bas de la liste

**Au clic sur le bouton** :

Le bouton disparaît et est remplacé par un formulaire d'ajout :

**Champ 1 - Nom de la sous-finalité** :
- Type : Champ texte simple ligne
- Label : "Nom de la sous-finalité"
- Placeholder : "Entrez le nom de la sous finalité"
- Obligatoire : Oui
- Largeur : 100%
- Style : Bordure dorée (#DDB867)

**Champ 2 - Description** :
- Type : Champ texte multiligne
- Label : "Description pour [nom saisi]" (dynamique)
- Placeholder : "Décrivez la sous finalité [nom saisi]"
- Lignes minimales : 3
- Lignes maximales : 40
- Obligatoire : Oui
- Largeur : 100%
- Style : Bordure dorée (#DDB867)

**Boutons d'action** :
- Position : À droite des champs

**Bouton Annuler** :
- Icône : Croix
- Style : Bouton circulaire 40x40px
- Action : Ferme le formulaire d'ajout, réinitialise les champs, réaffiche le bouton "Ajouter"

**Bouton Valider** :
- Icône : Plus (+)
- Style : Bouton circulaire 40x40px
- Action : 
  1. Vérifie que les deux champs sont remplis
  2. Ajoute la sous-finalité à la liste
  3. Réinitialise les champs
  4. Ferme le formulaire d'ajout
  5. Réaffiche le bouton "Ajouter"

**Validation** :
- Les deux champs doivent être remplis (trim des espaces)
- Si un champ est vide : Bouton "Valider" désactivé

##### Fermeture de la modale

**Bouton "Enregistrer"** :
- Position : En bas à droite de la modale
- Action : Ferme la modale et sauvegarde les sous-finalités dans le formulaire principal

**Bouton "Annuler"** :
- Position : En bas à gauche de la modale
- Action : Ferme la modale sans sauvegarder (les modifications sont quand même conservées)

**Clic en dehors** : Ferme la modale

### 3.6 Flux utilisateur complet - Étape 3

**Scénario 1 : Sélection de finalités standards**

1. L'utilisateur arrive sur l'étape 3
2. Il voit les 4 options populaires affichées
3. Il clique sur "Marketing" → Le chip devient bleu et apparaît dans la zone de sélection
4. Il clique sur "Gestion des utilisateurs" → Ajout à la sélection
5. Il clique sur "Suivant" → Validation et passage à l'étape 4

**Scénario 2 : Recherche et ajout d'une finalité**

1. L'utilisateur tape "Support" dans la recherche
2. L'option "Support client" apparaît dans les suggestions
3. Il clique dessus → Ajout à la sélection
4. Le champ de recherche se vide automatiquement

**Scénario 3 : Création d'une finalité personnalisée**

1. L'utilisateur tape "Gestion des formations internes"
2. Cette valeur n'existe pas dans les options
3. Une option "Ajouter : Gestion des formations internes" apparaît
4. Il clique dessus
5. La valeur est ajoutée aux paramètres de l'application
6. La valeur est sélectionnée immédiatement
7. Elle sera disponible pour les prochains traitements

**Scénario 4 : Ajout de sous-finalités**

1. L'utilisateur a sélectionné "Gestion des utilisateurs"
2. Il clique sur le bouton "Sous-finalités"
3. Une modale s'ouvre
4. Il clique sur "Ajouter une sous-finalité"
5. Il remplit :
   - Nom : "Création de comptes"
   - Description : "Permet aux nouveaux utilisateurs de créer un compte avec email et mot de passe"
6. Il clique sur le bouton Valider (icône +)
7. La sous-finalité apparaît dans la liste
8. Il répète pour ajouter d'autres sous-finalités
9. Il clique sur "Enregistrer" pour fermer la modale

**Scénario 5 : Modification d'une sous-finalité existante**

1. L'utilisateur ouvre la modale des sous-finalités
2. Il voit les sous-finalités déjà créées
3. Il modifie le texte de description d'une sous-finalité
4. Il clique sur "Enregistrer"
5. Les modifications sont sauvegardées

**Scénario 6 : Suppression d'une sous-finalité**

1. L'utilisateur ouvre la modale des sous-finalités
2. Il clique sur l'icône de suppression d'une sous-finalité
3. La sous-finalité disparaît immédiatement de la liste
4. Il clique sur "Enregistrer"

**Scénario 7 : Retrait d'une finalité sélectionnée**

1. L'utilisateur a sélectionné "Marketing"
2. Il clique sur l'icône X du chip "Marketing"
3. Le chip disparaît de la zone de sélection
4. L'option "Marketing" réapparaît dans les options disponibles

---

## 4. Étape 4 - Catégories de personnes concernées

### 4.1 Objectif métier

Cette étape permet d'identifier **qui** est concerné par le traitement de données. C'est essentiel pour :
- Déterminer les droits applicables (RGPD)
- Évaluer les risques
- Définir les mesures de protection appropriées
- Informer correctement les personnes concernées

**Question posée** : "Quelles sont les catégories de personnes concernées par ce traitement ?"

### 4.2 Composants de l'interface

#### 4.2.1 Titre de l'étape

**Affichage** :
```
Étape 4 - Catégories de personnes concernées
```

**Position** : Centré en haut de la page

**Style** : Titre de niveau 4 (H4)

#### 4.2.2 Carte principale

**Contenu** : Zone de sélection des catégories

**Dimensions** :
- Largeur maximale : 800px
- Largeur : 100% (responsive)
- Centré horizontalement

#### 4.2.3 Composant de sélection des catégories

**Type** : Groupe d'options avec recherche (SearchableOptionsGroup)

**Fonctionnalités** : Identiques à l'étape 3 (voir section 3.2.3)

### 4.3 Options prédéfinies (catégories standards)

Liste des 10 catégories standards proposées par défaut :

1. **Clients**
   - Métier : Personnes ayant acheté ou souscrit à un service
   - Exemples : Clients actifs, anciens clients
   - Droits : Accès, rectification, effacement, portabilité

2. **Employés**
   - Métier : Salariés de l'organisation
   - Exemples : CDI, CDD, stagiaires, alternants
   - Droits : Accès, rectification, limitation
   - Attention : Données sensibles possibles (santé, syndicat)

3. **Fournisseurs**
   - Métier : Entreprises ou personnes fournissant des biens/services
   - Exemples : Prestataires, sous-traitants
   - Droits : Accès, rectification

4. **Partenaires**
   - Métier : Organisations avec lesquelles existe un partenariat
   - Exemples : Partenaires commerciaux, partenaires techniques
   - Droits : Accès, rectification

5. **Prospects**
   - Métier : Personnes potentiellement intéressées par les services
   - Exemples : Leads, contacts commerciaux
   - Droits : Accès, rectification, effacement, opposition
   - Attention : Consentement souvent nécessaire pour le marketing

6. **Candidats**
   - Métier : Personnes postulant à un emploi
   - Exemples : Candidats en cours, candidats refusés
   - Droits : Accès, rectification, effacement
   - Attention : Durée de conservation limitée (généralement 2 ans)

7. **Visiteurs**
   - Métier : Personnes visitant les locaux ou le site web
   - Exemples : Visiteurs web, visiteurs physiques
   - Droits : Accès, rectification, effacement
   - Attention : Cookies et traceurs nécessitent un consentement

8. **Sous-traitants**
   - Métier : Entreprises traitant des données pour le compte de l'organisation
   - Exemples : Prestataires informatiques, agences
   - Droits : Accès, rectification

9. **Actionnaires**
   - Métier : Détenteurs de parts de l'entreprise
   - Exemples : Actionnaires majoritaires, minoritaires
   - Droits : Accès, rectification

10. **Formulaire de contact**
    - Métier : Personnes ayant rempli un formulaire de contact
    - Exemples : Demandes d'information, demandes de devis
    - Droits : Accès, rectification, effacement

### 4.4 Options personnalisées

**Source** : Paramètres de l'application (clé : `customCategories`)

**Fonctionnement** : Identique aux finalités personnalisées (voir section 3.4)

**Exemples de catégories personnalisées** :
- "Membres de l'association"
- "Bénévoles"
- "Patients"
- "Étudiants"
- "Participants aux événements"
- "Abonnés newsletter"

### 4.5 Précisions sur les catégories (informations additionnelles)

#### Concept métier

Pour chaque catégorie sélectionnée, l'utilisateur peut ajouter des **précisions** pour documenter plus finement le traitement.

**Utilité** :
- Préciser le contexte de la catégorie
- Ajouter des informations sur les sous-groupes
- Documenter les particularités

**Exemples** :
- Catégorie : "Clients" → Précision : "Uniquement les clients ayant souscrit à l'offre Premium"
- Catégorie : "Employés" → Précision : "Personnel du service RH et direction générale"
- Catégorie : "Visiteurs" → Précision : "Visiteurs du site web ayant accepté les cookies analytiques"

#### Accès aux précisions

**Déclencheur** : Bouton "Précisions"

**Position** : Sous la zone de sélection des catégories

**Style du bouton** :
- Identique au bouton "Sous-finalités" de l'étape 3
- Couleur : Or (#DDB867)
- Largeur : 200px

**Action** : Ouvre une modale

#### Modale des précisions

**Titre** : "Précisions sur les éléments sélectionnés"

**Dimensions** :
- Largeur : 90% de l'écran (max 800px)
- Hauteur maximale : 70% de la hauteur de l'écran
- Scroll vertical si contenu déborde

**Style** :
- Fond : Noir foncé (#111827)
- Bordure arrondie : 19px
- Padding : 24px
- Overlay semi-transparent

**Contenu** : Liste des champs de précisions

##### Champs de précisions

**Génération automatique** :
- Un champ texte est créé pour **chaque catégorie sélectionnée**
- L'ordre correspond à l'ordre de sélection

**Pour chaque catégorie** :

**Champ texte multiligne** :
- Label : Nom de la catégorie (ex: "Clients")
- Type : Textarea
- Lignes minimales : 1
- Lignes maximales : 4
- Largeur : 100%
- Placeholder : Aucun (optionnel)
- Valeur par défaut : Vide ou valeur précédemment saisie
- Style : Bordure dorée (#DDB867)

**Comportement** :
- Saisie libre
- Pas de limite de caractères (raisonnable)
- Sauvegarde automatique dans le formulaire
- Optionnel (peut rester vide)

**Layout** :
- Un champ par ligne
- Espacement vertical : 16px
- Scroll si plus de 5-6 catégories

##### Fermeture de la modale

**Bouton "Enregistrer"** :
- Position : En bas à droite
- Action : Ferme la modale et sauvegarde les précisions

**Bouton "Annuler"** :
- Position : En bas à gauche
- Action : Ferme la modale (les modifications sont conservées)

**Clic en dehors** : Ferme la modale

### 4.6 Flux utilisateur complet - Étape 4

**Scénario 1 : Sélection simple de catégories**

1. L'utilisateur arrive sur l'étape 4
2. Il voit les options populaires (4 catégories aléatoires)
3. Il clique sur "Clients" → Ajout à la sélection
4. Il clique sur "Employés" → Ajout à la sélection
5. Il clique sur "Suivant" → Passage à l'étape 5

**Scénario 2 : Recherche d'une catégorie**

1. L'utilisateur tape "Candidats" dans la recherche
2. L'option "Candidats" apparaît
3. Il clique dessus → Ajout à la sélection
4. Le champ se vide automatiquement

**Scénario 3 : Création d'une catégorie personnalisée**

1. L'utilisateur tape "Bénévoles" dans la recherche
2. Cette catégorie n'existe pas
3. Une option "Ajouter : Bénévoles" apparaît
4. Il clique dessus
5. "Bénévoles" est ajouté aux paramètres et à la sélection

**Scénario 4 : Ajout de précisions**

1. L'utilisateur a sélectionné "Clients" et "Prospects"
2. Il clique sur le bouton "Précisions"
3. Une modale s'ouvre avec 2 champs :
   - Champ 1 : Label "Clients"
   - Champ 2 : Label "Prospects"
4. Il remplit :
   - Clients : "Clients ayant effectué au moins un achat dans les 12 derniers mois"
   - Prospects : "Contacts commerciaux ayant manifesté un intérêt pour nos services"
5. Il clique sur "Enregistrer"
6. La modale se ferme

**Scénario 5 : Modification de précisions existantes**

1. L'utilisateur revient sur l'étape 4 (mode édition)
2. Les catégories sont déjà sélectionnées
3. Il clique sur "Précisions"
4. Les champs affichent les précisions précédemment saisies
5. Il modifie le texte
6. Il clique sur "Enregistrer"

**Scénario 6 : Retrait d'une catégorie avec précisions**

1. L'utilisateur a sélectionné "Clients" avec une précision
2. Il clique sur l'icône X du chip "Clients"
3. Le chip disparaît
4. Si l'utilisateur rouvre les précisions : Le champ "Clients" n'apparaît plus
5. La précision est conservée en mémoire (si l'utilisateur re-sélectionne "Clients", la précision réapparaît)

---

## 5. Structure des données

### 5.1 Modèle de données - Étape 3

#### Finalités principales

**Nom du champ** : `reasons`

**Type** : Tableau de chaînes de caractères

**Format** :
```
reasons: string[]
```

**Exemple** :
```json
{
  "reasons": [
    "Gestion des utilisateurs",
    "Marketing",
    "Support client"
  ]
}
```

**Contraintes** :
- Minimum : 0 éléments (optionnel selon la validation)
- Maximum : Illimité
- Valeurs : Chaînes non vides après trim
- Unicité : Pas de doublons

#### Sous-finalités

**Nom du champ** : `subReasons`

**Type** : Tableau d'objets

**Format** :
```
subReasons: Array<{
  name: string;
  moreInfo: string;
}>
```

**Exemple** :
```json
{
  "subReasons": [
    {
      "name": "Création de comptes",
      "moreInfo": "Permet aux nouveaux utilisateurs de créer un compte avec email et mot de passe. Inclut la validation de l'email et la gestion des mots de passe sécurisés."
    },
    {
      "name": "Gestion des profils",
      "moreInfo": "Permet aux utilisateurs de modifier leurs informations personnelles, préférences et paramètres de confidentialité."
    }
  ]
}
```

**Contraintes** :
- Minimum : 0 éléments (optionnel)
- Maximum : Illimité
- `name` : Obligatoire, chaîne non vide
- `moreInfo` : Obligatoire, chaîne non vide
- Pas de doublons sur le champ `name`

### 5.2 Modèle de données - Étape 4

#### Catégories de personnes

**Nom du champ** : `subjectCategories`

**Type** : Tableau d'objets

**Format** :
```
subjectCategories: Array<{
  name: string;
  additionalInformation: string;
}>
```

**Exemple** :
```json
{
  "subjectCategories": [
    {
      "name": "Clients",
      "additionalInformation": "Clients ayant effectué au moins un achat dans les 12 derniers mois"
    },
    {
      "name": "Prospects",
      "additionalInformation": "Contacts commerciaux ayant manifesté un intérêt pour nos services via le formulaire de contact ou lors d'événements"
    },
    {
      "name": "Employés",
      "additionalInformation": ""
    }
  ]
}
```

**Contraintes** :
- Minimum : 0 éléments (optionnel selon la validation)
- Maximum : Illimité
- `name` : Obligatoire, chaîne non vide
- `additionalInformation` : Optionnel, peut être vide
- Pas de doublons sur le champ `name`

### 5.3 Sauvegarde dans les paramètres

#### Finalités personnalisées

**Clé de paramètre** : `customReasons`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customReasons",
  "value": [
    "Gestion des formations internes",
    "Suivi des projets clients",
    "Gestion des événements"
  ]
}
```

**Portée** : Global (tous les utilisateurs de l'organisation)

**Utilisation** : Ces valeurs sont fusionnées avec les options standards pour afficher toutes les options disponibles

#### Catégories personnalisées

**Clé de paramètre** : `customCategories`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customCategories",
  "value": [
    "Bénévoles",
    "Membres de l'association",
    "Participants aux événements"
  ]
}
```

**Portée** : Global (tous les utilisateurs de l'organisation)

---

## 6. Navigation et validation

### 6.1 Validation du formulaire

#### Validation côté client

**Déclenchement** : Clic sur "Suivant"

**Règles de validation** :

**Étape 3** :
- Pas de validation stricte obligatoire
- Les finalités peuvent être vides (selon la configuration)
- Les sous-finalités sont optionnelles

**Étape 4** :
- Pas de validation stricte obligatoire
- Les catégories peuvent être vides (selon la configuration)
- Les précisions sont optionnelles

**Affichage des erreurs** :
- Message d'erreur sous le champ concerné
- Couleur rouge
- Taille de police réduite
- Empêche la navigation vers l'étape suivante

#### Validation côté serveur

**Déclenchement** : À la soumission du formulaire

**Endpoint** : `POST /api/v1/treatments/validation`

**Payload** : Données complètes du traitement (toutes les étapes)

**Réponse en cas d'erreur** :
```json
[
  {
    "path": ["reasons"],
    "message": "Au moins une finalité est requise"
  },
  {
    "path": ["subjectCategories"],
    "message": "Au moins une catégorie de personne est requise"
  }
]
```

**Gestion** :
- Les erreurs sont affichées sur les champs concernés
- L'utilisateur est redirigé vers l'étape contenant l'erreur
- Le formulaire reste en mode brouillon

### 6.2 Sauvegarde en brouillon

**Déclenchement** : Clic sur "Enregistrer comme brouillon"

**Comportement** :
- Pas de validation stricte
- Sauvegarde immédiate des données saisies
- Statut du traitement : "Brouillon"
- Message de confirmation : "Traitement sauvegardé en brouillon avec succès"

**Endpoint** : `PUT /api/v1/treatments/draft`

**Payload** : Données partielles du traitement

**Utilité métier** :
- Permet de travailler progressivement sur un traitement
- Évite de perdre les données en cas de fermeture accidentelle
- Permet de reprendre plus tard

### 6.3 Navigation entre les étapes

#### Bouton "Précédent"

**Action** :
1. Sauvegarde les valeurs actuelles du formulaire (pas de validation)
2. Retour à l'étape précédente
3. Les données saisies sont conservées

**Disponibilité** :
- Toujours disponible sauf à l'étape 1

#### Bouton "Suivant"

**Action** :
1. Déclenche la validation du formulaire
2. Si validation OK : Sauvegarde et passage à l'étape suivante
3. Si validation KO : Affichage des erreurs, reste sur l'étape

**Disponibilité** :
- Toujours disponible
- Peut être désactivé pendant la validation (état de chargement)

#### Bouton "Passer"

**Action** :
1. Ignore l'étape actuelle sans modification
2. Passage direct à l'étape suivante
3. Pas de sauvegarde des modifications

**Disponibilité** :
- Uniquement si le traitement est déjà validé (mode édition)
- Pas disponible en mode création

**Utilité** :
- Permet de naviguer rapidement dans un traitement existant
- Évite de devoir valider des étapes non modifiées

---

## 7. Intégration API

### 7.1 Récupération des paramètres

#### Endpoint : GET /api/v1/settings/{key}

**Méthode** : GET

**Path parameter** : `key` (nom du paramètre)

**Exemples** :
```
GET /api/v1/settings/customReasons
GET /api/v1/settings/customCategories
```

**Réponse** :
```json
{
  "key": "customReasons",
  "value": [
    "Gestion des formations internes",
    "Suivi des projets clients"
  ]
}
```

**Utilisation** :
- Chargement au montage du composant
- Fusion avec les options standards
- Affichage dans la liste des options disponibles

### 7.2 Mise à jour des paramètres

#### Endpoint : PUT /api/v1/settings

**Méthode** : PUT

**Headers** :
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body** :
```json
{
  "key": "customReasons",
  "value": [
    "Gestion des formations internes",
    "Suivi des projets clients",
    "Gestion des événements"
  ]
}
```

**Réponse** :
```json
{
  "key": "customReasons",
  "value": [
    "Gestion des formations internes",
    "Suivi des projets clients",
    "Gestion des événements"
  ]
}
```

**Déclenchement** :
- Automatique lors de l'ajout d'une valeur personnalisée
- L'utilisateur n'a pas besoin de sauvegarder manuellement

**Logique** :
1. Vérifier si la valeur existe déjà dans les options standards
2. Vérifier si la valeur existe déjà dans les options personnalisées
3. Si nouvelle : Ajouter au tableau existant
4. Envoyer la requête de mise à jour

### 7.3 Validation du traitement

#### Endpoint : POST /api/v1/treatments/validation

**Méthode** : POST

**Headers** :
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body** : Données complètes ou partielles du traitement

**Exemple** :
```json
{
  "title": "Gestion des candidatures",
  "treatmentType": "RH",
  "reasons": ["Recrutement", "Gestion administrative"],
  "subReasons": [
    {
      "name": "Tri des CV",
      "moreInfo": "Analyse et sélection des candidatures reçues"
    }
  ],
  "subjectCategories": [
    {
      "name": "Candidats",
      "additionalInformation": "Candidats ayant postulé via le site web"
    }
  ]
}
```

**Réponse en cas de succès** :
```json
[]
```

**Réponse en cas d'erreur** :
```json
[
  {
    "path": ["reasons"],
    "message": "Au moins une finalité est requise pour valider le traitement"
  }
]
```

**Utilisation** :
- Validation avant passage à l'étape suivante
- Validation avant finalisation du traitement
- Pas de validation pour les brouillons

### 7.4 Sauvegarde en brouillon

#### Endpoint : PUT /api/v1/treatments/draft

**Méthode** : PUT

**Headers** :
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Body** : Données partielles du traitement

**Exemple** :
```json
{
  "id": "uuid-du-traitement",
  "title": "Gestion des candidatures",
  "reasons": ["Recrutement"],
  "subReasons": [],
  "subjectCategories": []
}
```

**Réponse** : Traitement complet sauvegardé

**Comportement** :
- Pas de validation stricte
- Accepte les données incomplètes
- Statut automatiquement défini sur "draft"
- Crée un nouveau traitement si `id` absent
- Met à jour le traitement existant si `id` présent

---

## 8. Règles de gestion

### 8.1 Règles métier - Finalités

#### RG-F1 : Finalités obligatoires

**Règle** : Un traitement doit avoir au moins une finalité pour être validé (statut "validé").

**Exception** : Un brouillon peut n'avoir aucune finalité.

**Justification RGPD** : Article 5.1.b - Principe de finalité

#### RG-F2 : Finalités explicites

**Règle** : Les finalités doivent être claires et compréhensibles.

**Recommandation** : Utiliser des termes simples et précis.

**Exemples** :
- ✅ Bon : "Gestion des candidatures pour le recrutement"
- ❌ Mauvais : "Données RH"

#### RG-F3 : Sous-finalités optionnelles

**Règle** : Les sous-finalités sont toujours optionnelles.

**Utilité** : Apportent un niveau de détail supplémentaire pour la documentation.

#### RG-F4 : Sous-finalités complètes

**Règle** : Si une sous-finalité est créée, elle doit avoir un nom ET une description.

**Validation** : Les deux champs sont obligatoires.

#### RG-F5 : Unicité des finalités

**Règle** : Une finalité ne peut être sélectionnée qu'une seule fois.

**Comportement** : Si l'utilisateur clique sur une finalité déjà sélectionnée, elle est retirée (toggle).

#### RG-F6 : Persistance des finalités personnalisées

**Règle** : Les finalités personnalisées créées sont sauvegardées dans les paramètres.

**Portée** : Disponibles pour tous les traitements et tous les utilisateurs de l'organisation.

**Suppression** : Via l'interface de gestion des paramètres uniquement.

### 8.2 Règles métier - Catégories de personnes

#### RG-C1 : Catégories obligatoires

**Règle** : Un traitement doit identifier au moins une catégorie de personnes pour être validé.

**Exception** : Un brouillon peut n'avoir aucune catégorie.

**Justification RGPD** : Obligation d'identifier les personnes concernées.

#### RG-C2 : Précisions optionnelles

**Règle** : Les précisions sur les catégories sont toujours optionnelles.

**Utilité** : Permettent de documenter plus finement le périmètre du traitement.

#### RG-C3 : Unicité des catégories

**Règle** : Une catégorie ne peut être sélectionnée qu'une seule fois.

**Comportement** : Toggle au clic.

#### RG-C4 : Persistance des catégories personnalisées

**Règle** : Identique à RG-F6 pour les finalités.

#### RG-C5 : Conservation des précisions

**Règle** : Si une catégorie est retirée puis re-sélectionnée, sa précision est conservée.

**Implémentation** : Les précisions sont stockées dans un état local qui n'est pas effacé lors du retrait.

### 8.3 Règles techniques

#### RT-1 : Ordre de fusion des options

**Règle** : Les options affichées sont la fusion de :
1. Options standards (hardcodées)
2. Options personnalisées (depuis les paramètres)

**Ordre d'affichage** :
1. Options standards en premier
2. Options personnalisées ensuite
3. Tri alphabétique optionnel

#### RT-2 : Filtrage des doublons

**Règle** : Lors de l'ajout d'une valeur personnalisée, vérifier qu'elle n'existe pas déjà.

**Comparaison** :
- Insensible à la casse
- Trim des espaces avant et après
- Normalisation des caractères accentués (optionnel)

**Exemple** :
```
"Marketing" === "marketing" === " Marketing " → Doublon détecté
```

#### RT-3 : Synchronisation état local / formulaire

**Règle** : Toute modification doit mettre à jour :
1. L'état local du composant (pour l'affichage)
2. L'état du formulaire (pour la sauvegarde)

**Exemple** : Ajout d'une sous-finalité
1. Mise à jour de `activeSubReasons` (état local)
2. Mise à jour de `form.values.subReasons` (formulaire)

#### RT-4 : Gestion des modales

**Règle** : Une seule modale ouverte à la fois.

**État** : Variable booléenne pour chaque modale.

**Fermeture** :
- Bouton "Enregistrer"
- Bouton "Annuler"
- Clic sur l'overlay (en dehors de la modale)
- Touche Échap (optionnel)

#### RT-5 : Réinitialisation des champs

**Règle** : Après ajout d'une sous-finalité ou validation, les champs de saisie doivent être vidés.

**Implémentation** : Réinitialisation des variables d'état.

---

## 9. Internationalisation

### 9.1 Langues supportées

- **Français (FR)** : Langue par défaut
- **Anglais (EN)** : Langue secondaire

### 9.2 Clés de traduction - Étape 3

**Namespace** : `treatments`

**Clés principales** :

| Clé | Français | Anglais |
|-----|----------|---------|
| `steps.step3` | Étape 3 | Step 3 |
| `steps.purpose` | Finalité(s) du traitement | Treatment Purpose(s) |
| `form.secondQuestion` | Pourquoi traitez-vous ces données ? | Why do you process this data? |
| `form.purpose.showSubPurposes` | Sous-finalités | Sub-purposes |
| `form.subGoalTitle` | Sous-finalités | Sub-purposes |
| `form.subGoals` | Ajoutez des sous-finalités | Add sub-purposes |
| `form.subGoalSingle` | Ajoutez une sous-finalité | Add a sub-purpose |

**Options standards** :

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.purpose.reasonOptions.dataCollection` | Collecte de données | Data Collection |
| `form.purpose.reasonOptions.userManagement` | Gestion des utilisateurs | User Management |
| `form.purpose.reasonOptions.marketing` | Marketing | Marketing |
| `form.purpose.reasonOptions.analytics` | Analyses | Analytics |
| `form.purpose.reasonOptions.legalCompliance` | Conformité légale | Legal Compliance |
| `form.purpose.reasonOptions.serviceImprovement` | Amélioration du service | Service Improvement |
| `form.purpose.reasonOptions.customerSupport` | Support client | Customer Support |
| `form.purpose.reasonOptions.research` | Recherche | Research |
| `form.purpose.reasonOptions.security` | Sécurité | Security |

### 9.3 Clés de traduction - Étape 4

**Namespace** : `treatments`

**Clés principales** :

| Clé | Français | Anglais |
|-----|----------|---------|
| `steps.step4` | Étape 4 | Step 4 |
| `steps.categories` | Catégories de personnes concernées | Categories of Data Subjects |
| `form.categories.question` | Quelles sont les catégories de personnes concernées par ce traitement ? | Which categories of people are affected by this processing? |
| `form.showPrecisions` | Précisions | Additional Details |
| `form.precisionDetails` | Précisions sur les éléments sélectionnés | Details on Selected Items |

**Options standards** :

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.data.categoryOptions.clients` | Clients | Clients |
| `form.data.categoryOptions.employees` | Employés | Employees |
| `form.data.categoryOptions.suppliers` | Fournisseurs | Suppliers |
| `form.data.categoryOptions.partners` | Partenaires | Partners |
| `form.data.categoryOptions.prospects` | Prospects | Prospects |
| `form.data.categoryOptions.candidates` | Candidats | Candidates |
| `form.data.categoryOptions.visitors` | Visiteurs | Visitors |
| `form.data.categoryOptions.subcontractors` | Sous-traitants | Subcontractors |
| `form.data.categoryOptions.shareholders` | Actionnaires | Shareholders |

**Namespace** : `common`

| Clé | Français | Anglais |
|-----|----------|---------|
| `common:search` | Rechercher | Search |
| `common:popular` | Populaire | Popular |
| `common:add` | Ajouter | Add |
| `common:cancel` | Annuler | Cancel |
| `common:save` | Enregistrer | Save |
| `common:delete` | Supprimer | Delete |
| `common:all` | Tous | All |
| `common:none` | Aucun | None |

### 9.4 Traduction dynamique

**Options personnalisées** : Non traduites (affichées telles quelles)

**Raison** : Créées par l'utilisateur dans sa langue

**Amélioration possible** : Système de traduction pour les options personnalisées

---

## 10. Accessibilité

### 10.1 Navigation au clavier

#### Étape 3 - Finalités

**Champ de recherche** :
- Tab : Focus sur le champ
- Flèches haut/bas : Navigation dans les suggestions
- Entrée : Sélection de la suggestion ou ajout de la valeur saisie
- Échap : Fermeture de la liste déroulante

**Chips des options** :
- Tab : Navigation entre les chips
- Entrée ou Espace : Sélection/Désélection de l'option

**Chips sélectionnés** :
- Tab : Navigation entre les chips
- Entrée ou Espace : Retrait de la sélection (clic sur X)

**Bouton "Sous-finalités"** :
- Tab : Focus sur le bouton
- Entrée ou Espace : Ouverture de la modale

**Modale des sous-finalités** :
- Tab : Navigation entre les champs
- Échap : Fermeture de la modale
- Focus automatique sur le premier champ à l'ouverture

#### Étape 4 - Catégories

**Navigation identique à l'étape 3**

### 10.2 Lecteurs d'écran

#### Attributs ARIA

**Champ de recherche** :
- `role="combobox"`
- `aria-expanded="true/false"` (selon l'état de la liste)
- `aria-autocomplete="list"`
- `aria-controls="liste-options"`

**Chips cliquables** :
- `role="button"`
- `aria-pressed="true/false"` (selon l'état de sélection)
- `tabindex="0"`

**Boutons d'action** :
- `aria-label="Ajouter une sous-finalité"`
- `aria-label="Supprimer la sous-finalité"`
- `aria-label="Annuler"`

**Modale** :
- `role="dialog"`
- `aria-labelledby="titre-modale"`
- `aria-modal="true"`
- Focus trap : Le focus reste dans la modale tant qu'elle est ouverte

#### Annonces vocales

**Ajout d'une finalité** :
- Annonce : "[Nom de la finalité] ajoutée"

**Retrait d'une finalité** :
- Annonce : "[Nom de la finalité] retirée"

**Ajout d'une sous-finalité** :
- Annonce : "Sous-finalité [nom] ajoutée"

**Suppression d'une sous-finalité** :
- Annonce : "Sous-finalité [nom] supprimée"

### 10.3 Contraste et visibilité

#### Ratios de contraste (WCAG AA)

**Texte normal** : Minimum 4.5:1
- Texte blanc sur fond sombre : ✅ Conforme

**Texte large** : Minimum 3:1
- Titres et labels : ✅ Conforme

**Éléments interactifs** : Minimum 3:1
- Bordures des chips : ✅ Conforme
- Bordures des champs : ✅ Conforme

#### États de focus

**Tous les éléments interactifs** doivent avoir un état de focus visible :
- Outline : 2px solid bleu primaire
- Offset : 2px
- Bordure arrondie : Selon l'élément

**Exemple** :
```
Chip au focus : Bordure bleue épaisse + outline
Bouton au focus : Outline bleu
Champ texte au focus : Bordure bleue
```

### 10.4 Responsive design

#### Mobile (< 600px)

**Étape 3** :
- Barre de recherche : Largeur 100%
- Chips : Largeur 100% ou auto (selon le contenu)
- Options populaires : 2 par ligne
- Bouton "Sous-finalités" : Largeur 100%

**Modale des sous-finalités** :
- Largeur : 95% de l'écran
- Padding réduit : 20px
- Champs texte : Largeur 100%
- Boutons d'action : Empilés verticalement

**Étape 4** :
- Identique à l'étape 3

#### Tablet (600px - 960px)

**Étape 3 et 4** :
- Barre de recherche : Largeur 100%
- Chips : Auto width
- Options populaires : 3-4 par ligne
- Bouton : Largeur auto

**Modale** :
- Largeur : 90% de l'écran
- Padding : 30px

#### Desktop (> 960px)

**Étape 3 et 4** :
- Affichage optimal
- Largeur maximale : 800px
- Centré horizontalement

**Modale** :
- Largeur : 800px max
- Centré

---

## 11. Cas d'usage détaillés

### 11.1 Cas d'usage 1 : Création d'un traitement RH

**Contexte** : Une entreprise veut créer un traitement pour la gestion des candidatures.

**Étape 3 - Finalités** :

1. L'utilisateur arrive sur l'étape 3
2. Il voit les options populaires : "Gestion des utilisateurs", "Marketing", "Analyse", "Sécurité"
3. Aucune ne correspond exactement
4. Il tape "Recrutement" dans la recherche
5. L'option "Ajouter : Recrutement" apparaît
6. Il clique dessus → "Recrutement" est ajouté et sélectionné
7. Il clique sur "Sous-finalités"
8. Il ajoute 3 sous-finalités :
   - Nom : "Tri des CV" / Description : "Analyse et sélection des candidatures reçues par email et via le site web"
   - Nom : "Entretiens" / Description : "Organisation et suivi des entretiens de recrutement avec les candidats sélectionnés"
   - Nom : "Onboarding" / Description : "Intégration des nouveaux employés avec formation et suivi des premiers jours"
9. Il clique sur "Enregistrer" pour fermer la modale
10. Il clique sur "Suivant"

**Étape 4 - Catégories** :

1. L'utilisateur arrive sur l'étape 4
2. Il voit les options populaires incluant "Candidats"
3. Il clique sur "Candidats" → Ajout à la sélection
4. Il clique également sur "Employés" (pour l'onboarding)
5. Il clique sur "Précisions"
6. Il remplit :
   - Candidats : "Personnes ayant postulé à une offre d'emploi via notre site web ou par email. Conservation des données 2 ans maximum."
   - Employés : "Nouveaux employés en période d'essai et titularisés"
7. Il clique sur "Enregistrer"
8. Il clique sur "Suivant" → Passage à l'étape 5

### 11.2 Cas d'usage 2 : Traitement marketing avec newsletter

**Contexte** : Une entreprise veut documenter son traitement de newsletter marketing.

**Étape 3 - Finalités** :

1. L'utilisateur arrive sur l'étape 3
2. Il clique sur "Marketing" dans les options populaires
3. Il tape "Communication" dans la recherche
4. L'option "Ajouter : Communication" apparaît
5. Il clique dessus
6. Il a maintenant 2 finalités sélectionnées : "Marketing" et "Communication"
7. Il clique sur "Sous-finalités"
8. Il ajoute 2 sous-finalités :
   - Nom : "Newsletter hebdomadaire" / Description : "Envoi d'une newsletter chaque lundi avec les actualités et promotions"
   - Nom : "Offres promotionnelles" / Description : "Envoi ponctuel d'offres spéciales et codes promo"
9. Il clique sur "Enregistrer"
10. Il clique sur "Suivant"

**Étape 4 - Catégories** :

1. L'utilisateur arrive sur l'étape 4
2. Il sélectionne "Clients" et "Prospects"
3. Il clique sur "Précisions"
4. Il remplit :
   - Clients : "Clients ayant consenti à recevoir nos communications marketing"
   - Prospects : "Contacts ayant rempli le formulaire d'inscription à la newsletter"
5. Il clique sur "Enregistrer"
6. Il clique sur "Suivant"

### 11.3 Cas d'usage 3 : Modification d'un traitement existant

**Contexte** : Un utilisateur veut modifier les finalités d'un traitement déjà validé.

**Étape 3 - Finalités** :

1. L'utilisateur ouvre un traitement existant en mode édition
2. Il arrive sur l'étape 3
3. Les finalités déjà sélectionnées apparaissent : "Support client", "Gestion des utilisateurs"
4. Il veut ajouter "Analyse"
5. Il clique sur "Analyse" dans les options disponibles
6. Il veut retirer "Support client"
7. Il clique sur l'icône X du chip "Support client"
8. Il a maintenant : "Gestion des utilisateurs" et "Analyse"
9. Il clique sur "Suivant" (ou "Passer" s'il ne veut pas modifier)

**Étape 4 - Catégories** :

1. L'utilisateur arrive sur l'étape 4
2. Les catégories existantes sont affichées : "Clients"
3. Il veut ajouter "Employés"
4. Il clique sur "Employés"
5. Il clique sur "Précisions"
6. Il voit le champ "Clients" avec la précision existante
7. Il voit le nouveau champ "Employés" vide
8. Il remplit le champ "Employés" : "Personnel du service support"
9. Il clique sur "Enregistrer"
10. Il clique sur "Suivant"

### 11.4 Cas d'usage 4 : Sauvegarde en brouillon

**Contexte** : Un utilisateur commence à créer un traitement mais doit s'interrompre.

**Étape 3 - Finalités** :

1. L'utilisateur arrive sur l'étape 3
2. Il sélectionne "Marketing" et "Analyse"
3. Il commence à ajouter une sous-finalité mais ne la termine pas
4. Il doit partir en réunion
5. Il clique sur "Enregistrer comme brouillon"
6. Message de confirmation : "Traitement sauvegardé en brouillon avec succès"
7. Il peut fermer l'application

**Reprise plus tard** :

1. L'utilisateur revient sur l'application
2. Il ouvre le traitement en brouillon
3. Il retrouve ses finalités sélectionnées : "Marketing" et "Analyse"
4. Les sous-finalités incomplètes ne sont pas sauvegardées (validation requise)
5. Il peut continuer où il s'était arrêté

---

## 12. Maquettes et wireframes

### 12.1 Étape 3 - Finalités

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              Étape 3 - Finalité(s) du traitement                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Pourquoi traitez-vous ces données ?                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🔍 Rechercher...                                      ▼   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Sélectionnés :                                            │ │
│  │                                                           │ │
│  │  [ Marketing ✕ ]  [ Gestion des utilisateurs ✕ ]        │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Populaire                                                      │
│                                                                 │
│  [ Collecte de données ]  [ Analyse ]                          │
│  [ Support client ]  [ Sécurité ]                              │
│                                                                 │
│  ┌─────────────────────┐                                       │
│  │  Sous-finalités     │                                       │
│  └─────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [ ← Précédent ]  [ Enregistrer comme brouillon ]  [ Suivant → ]│
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 Modale des sous-finalités

```
                    ┌─────────────────────────────────────┐
                    │  Sous-finalités                  ✕  │
                    ├─────────────────────────────────────┤
                    │                                     │
                    │  Ajoutez des sous-finalités         │
                    │                                     │
                    │  ┌─────────────────────────────┐   │
                    │  │ Création de comptes         │ 🗑 │
                    │  │ Permet aux nouveaux...      │   │
                    │  │ ...utilisateurs de créer... │   │
                    │  └─────────────────────────────┘   │
                    │                                     │
                    │  ┌─────────────────────────────┐   │
                    │  │ Gestion des profils         │ 🗑 │
                    │  │ Permet aux utilisateurs...  │   │
                    │  └─────────────────────────────┘   │
                    │                                     │
                    │  ┌───────────────────────────────┐ │
                    │  │ Ajouter une sous-finalité  + │ │
                    │  └───────────────────────────────┘ │
                    │                                     │
                    │                                     │
                    │  [ Annuler ]      [ Enregistrer ]   │
                    └─────────────────────────────────────┘
```

### 12.3 Formulaire d'ajout de sous-finalité

```
┌─────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Nom de la sous-finalité                               │ │
│  │ Authentification multi-facteurs                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Description pour "Authentification multi-facteurs"    │ │
│  │ Mise en place d'une authentification à deux facteurs  │ │
│  │ pour sécuriser l'accès aux comptes utilisateurs...    │ │
│  │                                                        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│                                            [ ✕ ]  [ ✓ ]     │
└─────────────────────────────────────────────────────────────┘
```

### 12.4 Étape 4 - Catégories

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│         Étape 4 - Catégories de personnes concernées            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Quelles sont les catégories de personnes concernées           │
│  par ce traitement ?                                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🔍 Rechercher...                                      ▼   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Sélectionnés :                                            │ │
│  │                                                           │ │
│  │  [ Clients ✕ ]  [ Prospects ✕ ]  [ Employés ✕ ]         │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Populaire                                                      │
│                                                                 │
│  [ Fournisseurs ]  [ Partenaires ]                             │
│  [ Candidats ]  [ Visiteurs ]                                  │
│                                                                 │
│  ┌─────────────────────┐                                       │
│  │    Précisions       │                                       │
│  └─────────────────────┘                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [ ← Précédent ]  [ Enregistrer comme brouillon ]  [ Suivant → ]│
└─────────────────────────────────────────────────────────────────┘
```

### 12.5 Modale des précisions

```
                    ┌─────────────────────────────────────┐
                    │  Précisions sur les éléments     ✕  │
                    │  sélectionnés                       │
                    ├─────────────────────────────────────┤
                    │                                     │
                    │  ┌─────────────────────────────┐   │
                    │  │ Clients                     │   │
                    │  │ Clients ayant effectué...   │   │
                    │  │ ...au moins un achat...     │   │
                    │  └─────────────────────────────┘   │
                    │                                     │
                    │  ┌─────────────────────────────┐   │
                    │  │ Prospects                   │   │
                    │  │ Contacts commerciaux...     │   │
                    │  └─────────────────────────────┘   │
                    │                                     │
                    │  ┌─────────────────────────────┐   │
                    │  │ Employés                    │   │
                    │  │                             │   │
                    │  └─────────────────────────────┘   │
                    │                                     │
                    │                                     │
                    │  [ Annuler ]      [ Enregistrer ]   │
                    └─────────────────────────────────────┘
```

---

## 13. Spécifications techniques d'intégration

### 13.1 Format des requêtes HTTP

#### Récupération des paramètres

**Requête** :
```http
GET /api/v1/settings/customReasons HTTP/1.1
Host: api.registr.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customReasons",
  "value": [
    "Gestion des formations internes",
    "Suivi des projets clients"
  ]
}
```

#### Mise à jour des paramètres

**Requête** :
```http
PUT /api/v1/settings HTTP/1.1
Host: api.registr.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "key": "customReasons",
  "value": [
    "Gestion des formations internes",
    "Suivi des projets clients",
    "Gestion des événements"
  ]
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customReasons",
  "value": [
    "Gestion des formations internes",
    "Suivi des projets clients",
    "Gestion des événements"
  ]
}
```

#### Validation du traitement

**Requête** :
```http
POST /api/v1/treatments/validation HTTP/1.1
Host: api.registr.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Gestion des candidatures",
  "treatmentType": "RH",
  "reasons": ["Recrutement"],
  "subReasons": [
    {
      "name": "Tri des CV",
      "moreInfo": "Analyse et sélection des candidatures reçues"
    }
  ],
  "subjectCategories": [
    {
      "name": "Candidats",
      "additionalInformation": "Personnes ayant postulé via le site web"
    }
  ]
}
```

**Réponse (succès)** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

[]
```

**Réponse (erreur)** :
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

[
  {
    "path": ["reasons"],
    "message": "Au moins une finalité est requise pour valider le traitement"
  }
]
```

#### Sauvegarde en brouillon

**Requête** :
```http
PUT /api/v1/treatments/draft HTTP/1.1
Host: api.registr.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Gestion des candidatures",
  "reasons": ["Recrutement"],
  "subReasons": [],
  "subjectCategories": [
    {
      "name": "Candidats",
      "additionalInformation": ""
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
  "updateDate": "2026-02-18T14:45:00Z",
  "order": 1,
  "data": {
    "title": "Gestion des candidatures",
    "reasons": ["Recrutement"],
    "subReasons": [],
    "subjectCategories": [
      {
        "name": "Candidats",
        "additionalInformation": ""
      }
    ],
    ...
  }
}
```

### 13.2 Gestion du cache

#### Stratégie de cache

**Paramètres** :
- Cache côté client : Oui
- Durée : 5 minutes
- Invalidation : Manuelle après mise à jour

**Clés de cache** :
- `settings:customReasons` → Finalités personnalisées
- `settings:customCategories` → Catégories personnalisées

**Invalidation** :
- Après ajout d'une valeur personnalisée
- Après mise à jour des paramètres
- Après déconnexion/reconnexion

#### Optimistic updates

**Non implémenté** : Les mises à jour ne sont pas optimistes

**Raison** : Les paramètres sont partagés entre utilisateurs, risque de conflit

**Amélioration possible** : Optimistic update avec rollback en cas d'erreur

---

## 14. Règles de validation détaillées

### 14.1 Validation des finalités

#### Validation au niveau du champ

**Champ `reasons`** :
- Type : Tableau de chaînes
- Minimum : 0 éléments (brouillon) ou 1 élément (validation)
- Maximum : Illimité (recommandé : 10 max)
- Format : Chaînes non vides après trim
- Unicité : Pas de doublons

**Messages d'erreur** :
- Vide (validation) : "Au moins une finalité est requise pour valider le traitement"
- Doublon : "Cette finalité est déjà sélectionnée"

#### Validation des sous-finalités

**Champ `subReasons`** :
- Type : Tableau d'objets
- Minimum : 0 éléments
- Maximum : Illimité (recommandé : 20 max)

**Validation d'un objet `SubReason`** :
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `moreInfo` : Obligatoire, chaîne non vide, max 2000 caractères
- Unicité sur `name` : Pas de doublons

**Messages d'erreur** :
- `name` vide : "Le nom de la sous-finalité est obligatoire"
- `moreInfo` vide : "La description de la sous-finalité est obligatoire"
- Doublon : "Une sous-finalité avec ce nom existe déjà"
- Trop long : "Le nom ne peut pas dépasser 200 caractères"

### 14.2 Validation des catégories

#### Validation au niveau du champ

**Champ `subjectCategories`** :
- Type : Tableau d'objets
- Minimum : 0 éléments (brouillon) ou 1 élément (validation)
- Maximum : Illimité (recommandé : 15 max)

**Messages d'erreur** :
- Vide (validation) : "Au moins une catégorie de personne est requise pour valider le traitement"
- Doublon : "Cette catégorie est déjà sélectionnée"

#### Validation d'un objet `DataSource`

**Champ `subjectCategories[i]`** :
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `additionalInformation` : Optionnel, max 2000 caractères
- Unicité sur `name` : Pas de doublons

**Messages d'erreur** :
- `name` vide : "Le nom de la catégorie est obligatoire"
- Trop long : "Le nom ne peut pas dépasser 200 caractères"
- `additionalInformation` trop long : "Les précisions ne peuvent pas dépasser 2000 caractères"

### 14.3 Validation globale du traitement

**Déclenchement** : Clic sur "Suivant" à la dernière étape (étape 8)

**Règles globales** :
1. Toutes les étapes obligatoires doivent être complétées
2. Toutes les validations de champs doivent passer
3. Le traitement doit avoir un titre
4. Le traitement doit avoir au moins une finalité
5. Le traitement doit avoir au moins une catégorie de personne
6. Le traitement doit avoir au moins une base légale (étape 6)

**En cas d'erreur** :
- Affichage d'un résumé des erreurs
- Redirection vers la première étape contenant une erreur
- Mise en évidence des champs en erreur

---

## 15. Considérations de performance

### 15.1 Chargement des options

**Problème** : Si des milliers d'options personnalisées existent

**Solutions** :

1. **Pagination des options** :
   - Charger les 50 premières options
   - Charger plus au scroll

2. **Recherche côté serveur** :
   - Envoyer la requête de recherche au backend
   - Retourner uniquement les résultats pertinents

3. **Virtualisation** :
   - Afficher uniquement les options visibles
   - Utiliser une librairie de virtualisation

### 15.2 Optimisation de la recherche

**Problème** : Filtrage en temps réel peut être lent avec beaucoup d'options

**Solutions** :

1. **Debounce** :
   - Attendre 300ms après la dernière frappe
   - Évite les re-renders inutiles

2. **Memoization** :
   - Mémoriser les résultats de filtrage
   - Recalculer uniquement si les options ou la recherche changent

3. **Index de recherche** :
   - Créer un index de recherche optimisé
   - Utiliser une librairie comme Fuse.js pour la recherche floue

### 15.3 Gestion de la modale

**Problème** : Rendu de la modale peut être coûteux

**Solutions** :

1. **Lazy loading** :
   - Ne monter le composant que quand la modale est ouverte
   - Démonter au close (optionnel)

2. **Virtualisation des champs** :
   - Si plus de 20 catégories avec précisions
   - Afficher uniquement les champs visibles

---

## 16. Sécurité et confidentialité

### 16.1 Validation des entrées

**Côté client** :
- Trim des espaces
- Limitation de la longueur
- Échappement des caractères spéciaux (si affichage HTML)

**Côté serveur** :
- Validation stricte des types
- Limitation de la longueur
- Sanitisation des entrées
- Protection contre l'injection SQL/NoSQL
- Protection contre les XSS

### 16.2 Autorisations

**Lecture** :
- L'utilisateur doit être authentifié
- L'utilisateur doit appartenir à l'organisation

**Écriture** :
- L'utilisateur doit avoir le rôle approprié
- Vérification des permissions sur chaque mutation

**Paramètres** :
- Seuls les administrateurs peuvent supprimer des options personnalisées
- Tous les utilisateurs peuvent en ajouter

### 16.3 Audit et traçabilité

**Logs** :
- Création d'une finalité personnalisée
- Création d'une catégorie personnalisée
- Modification d'un traitement
- Sauvegarde en brouillon

**Informations loggées** :
- Utilisateur (ID et nom)
- Date et heure
- Action effectuée
- Données avant/après (pour les modifications)

---

## 17. Tests et qualité

### 17.1 Tests fonctionnels - Étape 3

#### Test 1 : Sélection d'une finalité standard
- Ouvrir l'étape 3
- Cliquer sur "Marketing"
- Vérifier que "Marketing" apparaît dans les sélectionnés
- Vérifier que "Marketing" disparaît des options disponibles

#### Test 2 : Recherche d'une finalité
- Taper "Support" dans la recherche
- Vérifier que "Support client" apparaît dans les suggestions
- Cliquer sur "Support client"
- Vérifier l'ajout à la sélection

#### Test 3 : Création d'une finalité personnalisée
- Taper "Nouvelle finalité test" dans la recherche
- Vérifier que "Ajouter : Nouvelle finalité test" apparaît
- Cliquer dessus
- Vérifier l'ajout à la sélection
- Vérifier la sauvegarde dans les paramètres (requête API)

#### Test 4 : Retrait d'une finalité
- Sélectionner "Marketing"
- Cliquer sur l'icône X
- Vérifier le retrait de la sélection
- Vérifier que "Marketing" réapparaît dans les options

#### Test 5 : Ajout d'une sous-finalité
- Cliquer sur "Sous-finalités"
- Vérifier l'ouverture de la modale
- Cliquer sur "Ajouter une sous-finalité"
- Remplir les champs
- Cliquer sur Valider
- Vérifier l'ajout à la liste
- Vérifier la réinitialisation des champs

#### Test 6 : Suppression d'une sous-finalité
- Ouvrir la modale des sous-finalités
- Cliquer sur l'icône de suppression
- Vérifier la disparition de la sous-finalité

#### Test 7 : Modification d'une sous-finalité
- Ouvrir la modale des sous-finalités
- Modifier le texte d'une description
- Cliquer sur "Enregistrer"
- Fermer et rouvrir la modale
- Vérifier que la modification est conservée

#### Test 8 : Navigation
- Sélectionner des finalités
- Cliquer sur "Suivant"
- Vérifier le passage à l'étape 4
- Cliquer sur "Précédent"
- Vérifier le retour à l'étape 3
- Vérifier que les finalités sont conservées

#### Test 9 : Sauvegarde en brouillon
- Sélectionner des finalités
- Cliquer sur "Enregistrer comme brouillon"
- Vérifier le message de confirmation
- Vérifier la requête API
- Fermer et rouvrir le traitement
- Vérifier que les finalités sont conservées

### 17.2 Tests fonctionnels - Étape 4

**Tests identiques à l'étape 3**, en remplaçant :
- "Finalités" par "Catégories"
- "Sous-finalités" par "Précisions"

### 17.3 Tests de non-régression

#### Test NR-1 : Compatibilité avec les données existantes
- Ouvrir un traitement créé avec une ancienne version
- Vérifier que les finalités s'affichent correctement
- Vérifier que les catégories s'affichent correctement

#### Test NR-2 : Migration des données
- Si le format des données change
- Vérifier la migration automatique
- Vérifier qu'aucune donnée n'est perdue

### 17.4 Tests de performance

#### Test P-1 : Chargement avec 1000 options
- Créer 1000 finalités personnalisées
- Ouvrir l'étape 3
- Mesurer le temps de chargement (< 2 secondes attendu)
- Vérifier la fluidité de la recherche

#### Test P-2 : Sélection de 100 finalités
- Sélectionner 100 finalités
- Vérifier l'affichage (pas de lag)
- Vérifier la sauvegarde (< 3 secondes)

### 17.5 Tests d'accessibilité

#### Test A-1 : Navigation au clavier
- Naviguer dans l'étape 3 uniquement au clavier
- Vérifier que tous les éléments sont accessibles
- Vérifier les états de focus

#### Test A-2 : Lecteur d'écran
- Utiliser un lecteur d'écran (NVDA, JAWS, VoiceOver)
- Vérifier que toutes les informations sont annoncées
- Vérifier que les actions sont compréhensibles

#### Test A-3 : Contraste
- Vérifier les ratios de contraste avec un outil (axe DevTools)
- Vérifier la conformité WCAG AA

---

## 18. Maintenance et évolution

### 18.1 Ajout d'une nouvelle option standard

**Étape 3 - Ajouter une finalité** :

1. Modifier la liste `reasonOptions` dans le code
2. Ajouter la traduction dans `/public/locales/fr/treatments.json`
3. Ajouter la traduction dans `/public/locales/en/treatments.json`
4. Tester l'affichage
5. Déployer

**Exemple** :
```javascript
const reasonOptions = [
  'Collecte de données',
  'Gestion des utilisateurs',
  'Marketing',
  'Analyse',
  'Conformité légale',
  'Amélioration du service',
  'Support client',
  'Recherche',
  'Sécurité',
  'Formation', // ← Nouvelle option
];
```

**Traduction** :
```json
{
  "form": {
    "purpose": {
      "reasonOptions": {
        "training": "Formation"
      }
    }
  }
}
```

### 18.2 Modification du comportement

**Exemple** : Rendre les finalités obligatoires dès le brouillon

**Modifications** :
1. Ajouter la validation dans le validateur du formulaire
2. Afficher un message d'erreur si vide
3. Désactiver le bouton "Enregistrer comme brouillon" si vide
4. Mettre à jour la documentation

### 18.3 Ajout d'une nouvelle fonctionnalité

**Exemple** : Ajouter une description longue pour chaque finalité

**Modifications** :

1. **Modèle de données** :
```json
{
  "reasons": [
    {
      "name": "Marketing",
      "description": "Envoi de communications commerciales..."
    }
  ]
}
```

2. **Interface** :
- Ajouter un bouton "Descriptions" (similaire à "Sous-finalités")
- Modale avec champs texte pour chaque finalité

3. **API** :
- Adapter les endpoints pour accepter le nouveau format
- Migration des données existantes

4. **Tests** :
- Tests unitaires sur le nouveau format
- Tests d'intégration
- Tests de migration

---

## 19. Annexes

### 19.1 Exemples de traitements réels

#### Exemple 1 : Newsletter marketing

**Étape 3** :
- Finalités : "Marketing", "Communication"
- Sous-finalités :
  - "Newsletter hebdomadaire" : "Envoi chaque lundi d'une newsletter avec actualités et promotions"
  - "Offres flash" : "Envoi ponctuel d'offres limitées dans le temps"

**Étape 4** :
- Catégories : "Clients", "Prospects"
- Précisions :
  - Clients : "Clients ayant consenti à recevoir nos communications"
  - Prospects : "Contacts inscrits via le formulaire newsletter"

#### Exemple 2 : Gestion des paies

**Étape 3** :
- Finalités : "Conformité légale", "Gestion des utilisateurs"
- Sous-finalités :
  - "Calcul des salaires" : "Calcul mensuel des salaires bruts et nets selon les contrats"
  - "Déclarations sociales" : "Génération et envoi des déclarations URSSAF et autres organismes"
  - "Bulletins de paie" : "Édition et archivage des bulletins de paie électroniques"

**Étape 4** :
- Catégories : "Employés"
- Précisions :
  - Employés : "Tous les salariés de l'entreprise (CDI, CDD, stagiaires, alternants)"

#### Exemple 3 : Gestion des candidatures

**Étape 3** :
- Finalités : "Recrutement" (personnalisée)
- Sous-finalités :
  - "Réception des candidatures" : "Collecte des CV et lettres de motivation via le site web et par email"
  - "Tri et présélection" : "Analyse des candidatures et sélection des profils correspondants"
  - "Entretiens" : "Organisation et suivi des entretiens avec les candidats retenus"
  - "Décision finale" : "Validation du recrutement et notification des candidats"

**Étape 4** :
- Catégories : "Candidats", "Employés"
- Précisions :
  - Candidats : "Personnes ayant postulé à une offre d'emploi. Conservation 2 ans maximum."
  - Employés : "Nouveaux employés recrutés, pour l'onboarding"

### 19.2 Glossaire technique

**Autocomplete** : Composant de saisie avec suggestions automatiques basées sur la saisie de l'utilisateur.

**Chip** : Élément visuel compact représentant une valeur sélectionnée, généralement avec une icône de suppression.

**Dropdown** : Liste déroulante d'options qui s'affiche sous un champ de saisie.

**Glassmorphism** : Effet de design avec fond semi-transparent et flou (backdrop blur).

**Modal / Modale** : Fenêtre contextuelle qui s'affiche par-dessus le contenu principal et nécessite une action de l'utilisateur.

**Overlay** : Couche semi-transparente affichée derrière une modale pour masquer le contenu principal.

**Placeholder** : Texte d'exemple affiché dans un champ vide pour guider l'utilisateur.

**Toggle** : Interaction qui bascule entre deux états (activé/désactivé, sélectionné/non sélectionné).

**Tooltip** : Infobulle qui s'affiche au survol d'un élément pour donner des informations supplémentaires.

**Trim** : Suppression des espaces en début et fin de chaîne de caractères.

**Wizard** : Interface guidée en plusieurs étapes pour accomplir une tâche complexe.

### 19.3 Références RGPD

**RGPD** : Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016

**Articles pertinents** :
- Article 5 : Principes relatifs au traitement des données personnelles
- Article 6 : Licéité du traitement
- Article 9 : Traitement portant sur des catégories particulières de données
- Article 30 : Registre des activités de traitement

**Ressources** :
- Site de la CNIL : https://www.cnil.fr
- Guide du registre : https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement
- Modèles de registre : https://www.cnil.fr/fr/modeles-de-registre

### 19.4 Contact et support

**Pour toute question sur les spécifications** :
- Se référer au document DESCRIPTION.md
- Consulter le code source dans `src/features/treatments/`
- Contacter l'équipe de développement

**Pour les questions métier RGPD** :
- Consulter le DPO de l'organisation
- Se référer aux guides de la CNIL
- Consulter un juriste spécialisé

---

## 20. Changelog du document

**Version 1.0** - 18 février 2026
- Création initiale du document
- Spécifications complètes des étapes 3 et 4
- Ajout des cas d'usage et exemples
- Ajout des maquettes wireframes

---

**Fin du document**

Ce document fournit toutes les informations nécessaires pour implémenter les étapes 3 et 4 du formulaire de traitement dans n'importe quel framework frontend (Vue.js, Angular, Svelte, etc.).
