# Spécifications Fonctionnelles - Étape 8 du Formulaire de Traitement

## Document de spécifications pour développeur expérimenté

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr Frontend - Gestion des traitements RGPD  

---

## Table des matières

1. [Contexte métier et RGPD](#1-contexte-métier-et-rgpd)
2. [Vue d'ensemble de l'étape 8](#2-vue-densemble-de-létape-8)
3. [Les 13 mesures de sécurité standards](#3-les-13-mesures-de-sécurité-standards)
4. [Composant de sélection](#4-composant-de-sélection)
5. [Modale d'information](#5-modale-dinformation)
6. [Modale des précisions](#6-modale-des-précisions)
7. [Options personnalisées](#7-options-personnalisées)
8. [Structure des données](#8-structure-des-données)
9. [Navigation et validation](#9-navigation-et-validation)
10. [Intégration API](#10-intégration-api)
11. [Règles de gestion](#11-règles-de-gestion)
12. [Internationalisation](#12-internationalisation)
13. [Accessibilité](#13-accessibilité)
14. [Cas d'usage détaillés](#14-cas-dusage-détaillés)
15. [Maquettes et wireframes](#15-maquettes-et-wireframes)
16. [Annexes](#16-annexes)

---

## 1. Contexte métier et RGPD

### 1.1 Principe de sécurité des données

**Article 5.1.f du RGPD** : Les données personnelles doivent être traitées de façon à garantir une **sécurité appropriée** des données à caractère personnel, y compris la protection contre le traitement non autorisé ou illicite et contre la perte, la destruction ou les dégâts d'origine accidentelle, à l'aide de mesures techniques ou organisationnelles appropriées (principe d'intégrité et de confidentialité).

**Article 32 du RGPD** : Sécurité du traitement

**Obligations** :
- Mettre en œuvre des mesures techniques et organisationnelles appropriées
- Garantir un niveau de sécurité adapté au risque
- Tenir compte de l'état des connaissances
- Tenir compte des coûts de mise en œuvre
- Tenir compte de la nature, de la portée, du contexte et des finalités du traitement
- Tenir compte des risques pour les droits et libertés des personnes

### 1.2 Mesures techniques et organisationnelles

**Mesures techniques** : Dispositifs technologiques de protection des données
- Chiffrement
- Pseudonymisation
- Pare-feu
- Antivirus
- Contrôle d'accès
- Sauvegardes
- Authentification forte

**Mesures organisationnelles** : Procédures et politiques de sécurité
- Formation du personnel
- Politique de sécurité
- Gestion des habilitations
- Procédures de gestion des incidents
- Audits de sécurité
- Clauses de confidentialité dans les contrats

### 1.3 Niveau de sécurité adapté au risque

**Principe** : Le niveau de sécurité doit être **proportionné au risque**.

**Facteurs de risque** :
- **Nature des données** : Données sensibles = protection renforcée
- **Volume des données** : Traitement à grande échelle = risque accru
- **Finalité du traitement** : Certaines finalités présentent plus de risques
- **Durée de conservation** : Plus la durée est longue, plus le risque est élevé
- **Destinataires** : Plus il y a de destinataires, plus le risque est élevé

**Exemples** :
- Données de santé → Chiffrement obligatoire
- Données financières → Authentification forte
- Données de mineurs → Protection renforcée
- Traitement à grande échelle → Audit régulier

### 1.4 Obligation de notification des violations

**Article 33 du RGPD** : En cas de violation de données personnelles, le responsable du traitement doit notifier la CNIL dans les **72 heures**.

**Article 34 du RGPD** : Si la violation présente un risque élevé pour les droits et libertés des personnes, le responsable doit également **informer les personnes concernées**.

**Importance des mesures de sécurité** :
- Prévenir les violations
- Réduire l'impact en cas de violation
- Démontrer la conformité RGPD
- Éviter les sanctions (jusqu'à 10M€ ou 2% du CA mondial)

### 1.5 Documentation obligatoire

**Article 32.1.d du RGPD** : Le responsable du traitement doit mettre en place un processus visant à **tester, analyser et évaluer régulièrement l'efficacité** des mesures techniques et organisationnelles pour assurer la sécurité du traitement.

**Conséquence** : Les mesures de sécurité doivent être **documentées** dans le registre des traitements.

---

## 2. Vue d'ensemble de l'étape 8

### 2.1 Objectif de l'étape

L'étape 8 est la **dernière étape** du formulaire de création/modification de traitement. Elle permet de documenter les **mesures de sécurité** mises en place pour protéger les données personnelles.

**Question posée** : "Quelles sont les mesures de sécurité que vous utilisez ?"

### 2.2 Particularité : Dernière étape

**Étape 8 = Étape finale** : Cette étape marque la fin du parcours de création/modification.

**Bouton "Suivant" remplacé par "Terminer"** :
- Au lieu de "Suivant", le bouton affiche "Terminer"
- Clic sur "Terminer" → Finalisation du traitement
- Le statut passe de "Brouillon" à "Validé"
- Redirection vers la liste des traitements ou écran de succès

### 2.3 Structure de l'étape

L'étape 8 est composée d'**une seule section** centrée :

```
┌─────────────────────────────────────────────────────────────────┐
│              Étape 8 - Mesures de sécurité                      │
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
- Padding : 24px

### 2.4 Titre de l'étape

**Affichage** :
```
Étape 8 - Mesures de sécurité
```

**Position** : Centré en haut de la page

**Style** : Titre de niveau 4 (H4)

**Particularité** : Icône d'information à côté du titre

### 2.5 Icône d'information

**Type** : Bouton icône avec InfoIcon

**Position** : À droite du titre (alignement horizontal)

**Taille** : Small (petite)

**Action** : Ouvre une modale d'information sur la sécurité des données

**Style** :
- Icône : Information (i dans un cercle)
- Couleur : Blanc ou bleu primaire
- Hover : Effet de surbrillance

### 2.6 Layout responsive

#### Desktop (> 960px)
- Carte centrée
- Largeur : 800px
- Marges latérales automatiques

#### Tablet (600px - 960px)
- Carte centrée
- Largeur : 90% de l'écran

#### Mobile (< 600px)
- Carte pleine largeur
- Largeur : 95% de l'écran
- Padding réduit

---

## 3. Les 13 mesures de sécurité standards

### 3.1 Mesure 1 : Accès contrôlé

**Catégorie** : Contrôle d'accès

**Description** : Limitation de l'accès aux données aux seules personnes autorisées.

**Exemples de mise en œuvre** :
- Système d'authentification (login/mot de passe)
- Gestion des habilitations par profil
- Principe du moindre privilège (need to know)
- Révocation des accès en cas de départ

**Métier** : Garantit que seules les personnes ayant besoin d'accéder aux données peuvent le faire.

**Niveau de risque couvert** : Accès non autorisé, fuite de données interne

### 3.2 Mesure 2 : Gestion des autorisations

**Catégorie** : Contrôle d'accès

**Description** : Système de gestion des droits et permissions.

**Exemples de mise en œuvre** :
- Matrice des droits (CRUD par rôle)
- Validation des demandes d'accès
- Revue périodique des habilitations
- Séparation des environnements (dev, prod)

**Métier** : Assure que chaque utilisateur a uniquement les droits nécessaires à son travail.

**Niveau de risque couvert** : Accès excessif, élévation de privilèges

### 3.3 Mesure 3 : Tests de sécurité

**Catégorie** : Évaluation et tests

**Description** : Tests réguliers pour identifier les vulnérabilités.

**Exemples de mise en œuvre** :
- Tests d'intrusion (pentests)
- Scans de vulnérabilités
- Revues de code sécurité
- Tests de charge et de résilience

**Métier** : Identifie les failles de sécurité avant qu'elles ne soient exploitées.

**Niveau de risque couvert** : Vulnérabilités techniques, failles de sécurité

### 3.4 Mesure 4 : Sauvegardes régulières

**Catégorie** : Disponibilité et résilience

**Description** : Copies de sauvegarde des données pour prévenir la perte.

**Exemples de mise en œuvre** :
- Sauvegardes quotidiennes automatiques
- Sauvegardes incrémentales et complètes
- Stockage sur site distant (off-site)
- Tests de restauration réguliers
- Chiffrement des sauvegardes

**Métier** : Garantit la récupération des données en cas de sinistre (incendie, cyberattaque, panne).

**Niveau de risque couvert** : Perte de données, destruction accidentelle, ransomware

### 3.5 Mesure 5 : Sécurité réseau

**Catégorie** : Sécurité infrastructure

**Description** : Protection du réseau informatique.

**Exemples de mise en œuvre** :
- Segmentation du réseau (VLAN)
- Pare-feu réseau (firewall)
- Détection d'intrusion (IDS/IPS)
- VPN pour les accès distants
- Filtrage des flux

**Métier** : Protège contre les attaques réseau et l'accès non autorisé.

**Niveau de risque couvert** : Attaques externes, intrusions, interceptions

### 3.6 Mesure 6 : Sécurité des partenaires

**Catégorie** : Sécurité de la chaîne

**Description** : Garanties de sécurité exigées des sous-traitants et partenaires.

**Exemples de mise en œuvre** :
- Clauses de sécurité dans les contrats
- Audits de sécurité des sous-traitants
- Certification ISO 27001
- Vérification des mesures de sécurité
- Responsabilité contractuelle

**Métier** : Assure que les partenaires protègent les données avec le même niveau de sécurité.

**Niveau de risque couvert** : Faille chez un sous-traitant, chaîne de sous-traitance

### 3.7 Mesure 7 : Chiffrement des données

**Catégorie** : Confidentialité

**Description** : Chiffrement des données pour les rendre illisibles sans clé.

**Exemples de mise en œuvre** :
- Chiffrement au repos (bases de données, fichiers)
- Chiffrement en transit (HTTPS, TLS)
- Chiffrement de bout en bout (E2E)
- Gestion sécurisée des clés de chiffrement
- Algorithmes robustes (AES-256, RSA)

**Métier** : Rend les données inutilisables en cas de vol ou d'accès non autorisé.

**Niveau de risque couvert** : Vol de données, interception, accès physique aux serveurs

**Recommandation RGPD** : Fortement recommandé pour les données sensibles

### 3.8 Mesure 8 : Anonymisation

**Catégorie** : Protection par conception

**Description** : Suppression irréversible des éléments d'identification.

**Exemples de mise en œuvre** :
- Suppression des identifiants directs (nom, prénom, email)
- Agrégation des données
- Généralisation (ex: âge → tranche d'âge)
- K-anonymat

**Métier** : Les données anonymisées ne sont plus des données personnelles et sortent du champ du RGPD.

**Niveau de risque couvert** : Identification des personnes, réidentification

**Attention** : L'anonymisation doit être **irréversible**. Si elle est réversible, il s'agit de pseudonymisation.

### 3.9 Mesure 9 : Pseudonymisation

**Catégorie** : Protection par conception

**Description** : Remplacement des identifiants directs par des pseudonymes.

**Exemples de mise en œuvre** :
- Remplacement des noms par des identifiants (UUID)
- Hachage des emails
- Tokenisation
- Séparation des données d'identification

**Métier** : Réduit les risques en cas de fuite, mais les données restent des données personnelles.

**Niveau de risque couvert** : Identification directe, corrélation des données

**Différence avec l'anonymisation** : La pseudonymisation est **réversible** (avec la clé), l'anonymisation est **irréversible**.

### 3.10 Mesure 10 : Audit

**Catégorie** : Contrôle et surveillance

**Description** : Vérifications régulières de la conformité et de la sécurité.

**Exemples de mise en œuvre** :
- Audits internes réguliers
- Audits externes (certification)
- Revue des logs d'accès
- Contrôle des sous-traitants
- Audits de code

**Métier** : Vérifie que les mesures de sécurité sont effectives et conformes.

**Niveau de risque couvert** : Non-conformité, dégradation des mesures de sécurité

**Fréquence recommandée** : Au moins une fois par an

### 3.11 Mesure 11 : Double authentification

**Catégorie** : Authentification

**Description** : Authentification à deux facteurs (2FA) ou multi-facteurs (MFA).

**Exemples de mise en œuvre** :
- SMS + mot de passe
- Application d'authentification (Google Authenticator, Authy)
- Clé de sécurité physique (YubiKey)
- Biométrie + mot de passe

**Métier** : Renforce la sécurité de l'authentification en combinant deux facteurs différents.

**Niveau de risque couvert** : Vol de mot de passe, phishing, accès non autorisé

**Recommandation** : Obligatoire pour les comptes administrateurs et les données sensibles

### 3.12 Mesure 12 : Pare-feu

**Catégorie** : Sécurité infrastructure

**Description** : Dispositif de filtrage des flux réseau.

**Exemples de mise en œuvre** :
- Pare-feu réseau (hardware)
- Pare-feu applicatif (WAF - Web Application Firewall)
- Règles de filtrage strictes
- Liste blanche d'adresses IP
- Blocage des ports non utilisés

**Métier** : Protège contre les attaques réseau et les accès non autorisés.

**Niveau de risque couvert** : Attaques DDoS, scans de ports, tentatives d'intrusion

### 3.13 Mesure 13 : Formation à la sécurité

**Catégorie** : Mesure organisationnelle

**Description** : Sensibilisation et formation du personnel à la sécurité et au RGPD.

**Exemples de mise en œuvre** :
- Formation initiale pour les nouveaux employés
- Formations régulières (annuelles)
- Sensibilisation au phishing
- Procédures de sécurité documentées
- Tests de sensibilisation (phishing simulé)

**Métier** : Le facteur humain est souvent la principale faille de sécurité. La formation réduit les risques d'erreur.

**Niveau de risque couvert** : Erreur humaine, phishing, ingénierie sociale, mauvaises pratiques

**Recommandation** : Formation obligatoire pour tout le personnel ayant accès aux données personnelles

---

## 4. Composant de sélection

### 4.1 Type de composant

**Composant** : Groupe d'options avec recherche (SearchableOptionsGroup)

**Identique aux étapes précédentes** : Même fonctionnement que pour les finalités, catégories, bases légales.

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
- Clic sur l'icône X → Retire la mesure de la sélection
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
- Clic sur un chip → Ajoute la mesure à la sélection
- Le chip disparaît des options disponibles
- Apparaît dans la zone des sélectionnés

### 4.5 Bouton "Précisions"

**Position** : En bas de la section

**Style** :
- Couleur : Or (#DDB867)
- Texte : "Précisions"
- Largeur : 200px
- Marge supérieure : 20px

**Action** : Ouvre une modale pour ajouter des précisions sur chaque mesure de sécurité

**Disponibilité** : Toujours visible

### 4.6 Titre de la section

**Texte** : "Quelles sont les mesures de sécurité que vous utilisez ?"

**Position** : Au-dessus de la barre de recherche

**Style** : Titre de niveau 6 (H6)

---

## 5. Modale d'information

### 5.1 Déclencheur

**Élément** : Icône d'information à côté du titre de l'étape

**Action** : Clic sur l'icône → Ouverture de la modale

### 5.2 Contenu de la modale

**Titre** : "Cadre légal"

**Contenu** : Lien vers le guide de la CNIL sur la sécurité des données personnelles

**URL** : https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles

**Affichage** :
- Soit affichage du lien cliquable
- Soit iframe intégrant la page CNIL (si autorisé)
- Soit texte explicatif sur la sécurité des données

**Recommandation** : Afficher un résumé + lien vers la ressource complète

**Exemple de contenu** :
```
La sécurité des données personnelles est une obligation du RGPD (article 32).

Le responsable du traitement doit mettre en œuvre des mesures techniques 
et organisationnelles appropriées pour garantir un niveau de sécurité 
adapté au risque.

Ces mesures peuvent inclure :
- Le chiffrement des données
- La pseudonymisation
- Les contrôles d'accès
- Les sauvegardes régulières
- La formation du personnel
- Les audits de sécurité

Pour en savoir plus, consultez le guide de la CNIL :
https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles
```

### 5.3 Boutons de la modale

**Bouton "Enregistrer" ou "Fermer"** :
- Position : En bas à droite
- Action : Ferme la modale
- Texte : "Fermer" ou "Enregistrer" (selon la traduction)

**Clic en dehors** : Ferme la modale

### 5.4 Objectif

**Pédagogique** : Informer l'utilisateur sur l'importance de la sécurité des données

**Aide à la décision** : Guider l'utilisateur dans le choix des mesures appropriées

**Conformité** : Rappeler les obligations légales

---

## 6. Modale des précisions

### 6.1 Déclencheur

**Élément** : Bouton "Précisions" en bas de la carte

**Action** : Clic sur le bouton → Ouverture de la modale

### 6.2 Titre de la modale

**Texte** : "Mesures de sécurité"

**Position** : En haut de la modale

**Style** : Titre de niveau modale

### 6.3 Contenu de la modale

**Type** : Liste des champs texte pour chaque mesure sélectionnée

**Génération automatique** : Un champ texte est créé pour **chaque mesure de sécurité sélectionnée**

**Ordre** : Correspond à l'ordre de sélection

#### Champs de précisions

**Pour chaque mesure de sécurité** :

**Champ texte multiligne** :
- Label : Nom de la mesure (ex: "Chiffrement des données")
- Type : Textarea
- Lignes minimales : 1
- Lignes maximales : 40
- Largeur : 100%
- Placeholder : "Ex: Accès aux serveurs internes"
- Valeur par défaut : Vide ou valeur précédemment saisie
- Style : Bordure dorée (#DDB867)

**Exemples de précisions** :
- Chiffrement des données : "Chiffrement AES-256 pour les données au repos, TLS 1.3 pour les données en transit"
- Double authentification : "2FA obligatoire pour tous les comptes administrateurs via Google Authenticator"
- Sauvegardes régulières : "Sauvegardes quotidiennes automatiques à 2h du matin, conservation 30 jours, stockage sur site distant"
- Formation à la sécurité : "Formation annuelle obligatoire pour tous les employés, sensibilisation au phishing trimestrielle"

**Layout** :
- Un champ par ligne
- Espacement vertical : 16px
- Scroll si plus de 5-6 mesures

### 6.4 Dimensions de la modale

**Largeur** : 90% de l'écran (max 800px)

**Hauteur maximale** : 70% de la hauteur de l'écran

**Scroll** : Vertical si contenu déborde

**Style** :
- Fond : Noir foncé (#111827)
- Bordure arrondie : 19px
- Padding : 24px
- Overlay semi-transparent

### 6.5 Boutons de la modale

**Bouton "Fermer" ou "Enregistrer"** :
- Position : En bas à droite
- Action : Ferme la modale et sauvegarde les précisions
- Texte : "Fermer" (selon la traduction)

**Bouton "Annuler"** :
- Position : En bas à gauche (optionnel)
- Action : Ferme la modale (modifications conservées)

**Clic en dehors** : Ferme la modale

---

## 7. Options personnalisées

### 7.1 Création d'options personnalisées

**Fonctionnement** : Identique aux étapes précédentes

**Processus** :
1. L'utilisateur tape une nouvelle valeur dans la recherche
2. Si la valeur n'existe pas : Option "Ajouter : [nouvelle valeur]" apparaît
3. Clic sur cette option → Ajout aux paramètres + sélection immédiate

**Exemples de mesures personnalisées** :
- "Détection d'anomalies par IA"
- "Surveillance 24/7"
- "Certification ISO 27001"
- "Conformité PCI-DSS"
- "Plan de continuité d'activité (PCA)"
- "Plan de reprise d'activité (PRA)"
- "Gestion des incidents de sécurité"
- "Politique de mots de passe forts"
- "Verrouillage automatique des sessions"
- "Journalisation des accès"

### 7.2 Source des options personnalisées

**Clé de paramètre** : `customMeasures`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customMeasures",
  "value": [
    "Détection d'anomalies par IA",
    "Surveillance 24/7",
    "Certification ISO 27001"
  ]
}
```

**Portée** : Global (tous les utilisateurs de l'organisation)

**Utilisation** : Ces valeurs sont fusionnées avec les options standards

### 7.3 Cas d'usage des options personnalisées

#### Cas 1 : Ajout d'une certification

**Raison** : Documenter une certification de sécurité

**Processus** :
1. L'utilisateur tape "Certification ISO 27001"
2. Option "Ajouter : Certification ISO 27001" apparaît
3. Clic → Ajout et sélection
4. Disponible pour tous les traitements futurs

#### Cas 2 : Ajout d'une mesure spécifique

**Raison** : Documenter une mesure propre à l'organisation

**Exemples** :
- "Politique de clean desk" (bureau propre)
- "Destruction sécurisée des documents papier"
- "Contrôle d'accès biométrique aux locaux"
- "Vidéosurveillance des salles serveurs"

---

## 8. Structure des données

### 8.1 Modèle de données

**Nom du champ** : `securitySetup`

**Type** : Tableau d'objets

**Format** :
```json
{
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
      "additionalInformation": "Sauvegardes quotidiennes automatiques, conservation 30 jours"
    }
  ]
}
```

**Contraintes** :
- Minimum : 0 éléments (optionnel selon la validation)
- Maximum : Illimité (recommandé : 20 max)
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `additionalInformation` : Optionnel, max 2000 caractères

### 8.2 Type SecurityMeasure

**Définition** :
```
SecurityMeasure = {
  name: string;
  additionalInformation: string;
}
```

**Utilisation** : Identique au type `DataSource` utilisé dans les étapes précédentes

### 8.3 Sauvegarde dans les paramètres

**Clé de paramètre** : `customMeasures`

**Type** : Tableau de chaînes

**Format** :
```json
{
  "key": "customMeasures",
  "value": [
    "Détection d'anomalies par IA",
    "Surveillance 24/7",
    "Certification ISO 27001",
    "Plan de continuité d'activité"
  ]
}
```

**Persistance** : Les mesures personnalisées sont sauvegardées et réutilisables pour tous les traitements

---

## 9. Navigation et validation

### 9.1 Validation du formulaire

#### Validation côté client

**Déclenchement** : Clic sur "Terminer"

**Règles de validation** :

**Étape 8 - Mesures de sécurité** :
- Pas de validation stricte obligatoire en brouillon
- Au moins une mesure de sécurité recommandée pour un traitement validé
- Pas de limite sur le nombre de mesures

**Validation recommandée** :
- Au moins 3-5 mesures de sécurité pour un traitement standard
- Plus de mesures pour les données sensibles
- Précisions détaillées pour les mesures critiques

**Affichage des erreurs** :
- Message d'erreur sous le champ concerné
- Couleur rouge
- Empêche la finalisation du traitement

#### Validation côté serveur

**Déclenchement** : À la soumission du formulaire

**Endpoint** : `POST /api/v1/treatments/validation`

**Réponse en cas d'erreur** :
```json
[
  {
    "path": ["securitySetup"],
    "message": "Au moins une mesure de sécurité est recommandée pour valider le traitement"
  }
]
```

**Gestion** :
- Les erreurs sont affichées sur le champ concerné
- L'utilisateur reste sur l'étape 8

### 9.2 Finalisation du traitement

**Déclenchement** : Clic sur "Terminer"

**Comportement** :
1. Validation de toutes les étapes
2. Si validation OK :
   - Sauvegarde du traitement complet
   - Changement du statut : "Brouillon" → "Validé"
   - Affichage d'un message de succès
   - Redirection vers :
     - Écran de succès (avec options : créer un nouveau traitement, retour à la liste)
     - Ou directement vers la liste des traitements
3. Si validation KO :
   - Affichage des erreurs
   - Redirection vers la première étape contenant une erreur

**Endpoint** : `PUT /api/v1/treatments`

**Différence avec le brouillon** : Le traitement est finalisé et validé, pas seulement sauvegardé

### 9.3 Sauvegarde en brouillon

**Déclenchement** : Clic sur "Enregistrer comme brouillon"

**Comportement** :
- Pas de validation stricte
- Sauvegarde immédiate des données saisies
- Statut du traitement : "Brouillon"
- Message de confirmation

**Endpoint** : `PUT /api/v1/treatments/draft`

**Utilité** : Permet de reprendre plus tard sans finaliser

### 9.4 Navigation entre les étapes

#### Bouton "Précédent"

**Action** :
1. Sauvegarde les valeurs actuelles du formulaire (pas de validation)
2. Retour à l'étape 7 (Partage des données)
3. Les mesures sélectionnées sont conservées

**Disponibilité** : Toujours disponible

#### Bouton "Terminer"

**Action** :
1. Déclenche la validation de toutes les étapes
2. Si validation OK : Finalisation et redirection
3. Si validation KO : Affichage des erreurs

**Disponibilité** : Toujours disponible

**Style** : Bouton primaire, couleur distinctive (or ou vert)

#### Bouton "Passer"

**Action** :
1. Ignore l'étape actuelle sans modification
2. Finalisation directe du traitement
3. Pas de sauvegarde des modifications de cette étape

**Disponibilité** : Uniquement si le traitement est déjà validé (mode édition)

---

## 10. Intégration API

### 10.1 Récupération des paramètres

#### Endpoint : GET /api/v1/settings/customMeasures

**Méthode** : GET

**Requête** :
```http
GET /api/v1/settings/customMeasures HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Accept: application/json
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customMeasures",
  "value": [
    "Détection d'anomalies par IA",
    "Surveillance 24/7",
    "Certification ISO 27001"
  ]
}
```

### 10.2 Mise à jour des paramètres

#### Endpoint : PUT /api/v1/settings

**Requête** :
```http
PUT /api/v1/settings HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "customMeasures",
  "value": [
    "Détection d'anomalies par IA",
    "Surveillance 24/7",
    "Certification ISO 27001",
    "Plan de continuité d'activité"
  ]
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customMeasures",
  "value": [
    "Détection d'anomalies par IA",
    "Surveillance 24/7",
    "Certification ISO 27001",
    "Plan de continuité d'activité"
  ]
}
```

### 10.3 Finalisation du traitement

#### Endpoint : PUT /api/v1/treatments

**Méthode** : PUT

**Headers** :
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Requête** :
```http
PUT /api/v1/treatments HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Gestion des candidatures",
  "treatmentType": "RH",
  "reasons": ["Recrutement"],
  "subReasons": [ ... ],
  "subjectCategories": [ ... ],
  "personalDataGroup": { ... },
  "financialDataGroup": { ... },
  "dataSources": [ ... ],
  "legalBase": [ ... ],
  "dataAccess": [ ... ],
  "sharedData": [ ... ],
  "areDataExportedOutsideEU": false,
  "securitySetup": [
    {
      "name": "Chiffrement des données",
      "additionalInformation": "Chiffrement AES-256 pour les données au repos"
    },
    {
      "name": "Double authentification",
      "additionalInformation": "2FA obligatoire pour tous les comptes administrateurs"
    },
    {
      "name": "Sauvegardes régulières",
      "additionalInformation": "Sauvegardes quotidiennes automatiques"
    }
  ]
}
```

**Réponse (succès)** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "validated",
  "creationDate": "2026-02-18T10:30:00Z",
  "updateDate": "2026-02-18T16:45:00Z",
  "order": 1,
  "data": {
    "title": "Gestion des candidatures",
    "securitySetup": [ ... ],
    ...
  }
}
```

**Réponse (erreur)** :
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

[
  {
    "path": ["securitySetup"],
    "message": "Au moins une mesure de sécurité est recommandée"
  },
  {
    "path": ["legalBase"],
    "message": "Au moins une base légale est requise"
  }
]
```

**Effet** : Le statut du traitement passe de "draft" à "validated"

---

## 11. Règles de gestion

### 11.1 Règles métier - Mesures de sécurité

#### RG-MS1 : Mesures optionnelles

**Règle** : Les mesures de sécurité sont optionnelles pour un brouillon.

**Recommandation** : Au moins 3-5 mesures pour un traitement validé.

**Justification RGPD** : Article 32 - Sécurité du traitement

#### RG-MS2 : Mesures multiples

**Règle** : Un traitement peut (et devrait) avoir plusieurs mesures de sécurité.

**Recommandation** : Combiner mesures techniques et organisationnelles.

**Exemple** :
- Technique : Chiffrement + Pare-feu + Double authentification
- Organisationnelle : Formation + Audit + Gestion des autorisations

#### RG-MS3 : Adaptation au risque

**Règle métier** : Les mesures de sécurité doivent être **adaptées au niveau de risque**.

**Facteurs de risque** :
- Données sensibles → Mesures renforcées
- Traitement à grande échelle → Mesures renforcées
- Transferts hors UE → Mesures renforcées
- Données de mineurs → Mesures renforcées

**Exemples** :
- Données de santé → Chiffrement obligatoire + Accès contrôlé + Audit
- Newsletter marketing → Mesures de base suffisantes

#### RG-MS4 : Précisions recommandées

**Règle** : Les précisions sur les mesures sont optionnelles mais fortement recommandées.

**Utilité** :
- Documenter précisément les mesures
- Faciliter les audits
- Prouver la conformité
- Aider à la maintenance

#### RG-MS5 : Révision régulière

**Règle métier** : Les mesures de sécurité doivent être **révisées régulièrement**.

**Fréquence** : Au moins une fois par an

**Raison** : Évolution des menaces, nouvelles technologies, changements organisationnels

#### RG-MS6 : Documentation des tests

**Règle** : Si "Tests de sécurité" est sélectionné, documenter les résultats dans les précisions.

**Exemple** : "Pentests réalisés en janvier 2026 par la société XYZ - Rapport disponible - Vulnérabilités corrigées"

### 11.2 Règles techniques

#### RT-1 : Ordre de fusion des options

**Règle** : Les options affichées sont la fusion de :
1. Options standards (13 mesures)
2. Options personnalisées (depuis les paramètres)

**Ordre d'affichage** : Standards en premier, personnalisées ensuite

#### RT-2 : Filtrage des doublons

**Règle** : Lors de l'ajout d'une option personnalisée, vérifier qu'elle n'existe pas déjà.

**Comparaison** : Insensible à la casse, trim des espaces

#### RT-3 : Synchronisation état local / formulaire

**Règle** : Toute modification doit mettre à jour :
1. L'état local du composant
2. L'état du formulaire

#### RT-4 : Masquage automatique de la modale

**Règle** : Si toutes les mesures sont retirées, la modale de précisions est automatiquement fermée.

**Raison** : Éviter d'afficher une modale vide

---

## 12. Internationalisation

### 12.1 Clés de traduction - Étape 8

**Namespace** : `treatments`

| Clé | Français | Anglais |
|-----|----------|---------|
| `steps.step8` | Étape 8 | Step 8 |
| `steps.security` | Mesures de sécurité | Security Measures |
| `form.security.title` | Mesures de sécurité | Security Measures |
| `form.security.question` | Quelles sont les mesures de sécurité que vous utilisez ? | What security measures do you use? |
| `form.security.measureName` | Nom de la mesure | Measure Name |
| `form.security.additionalInfo` | Informations complémentaires | Additional Information |
| `form.security.addMeasure` | Ajouter une mesure | Add a Measure |
| `form.security.modalTitle` | Cadre légal | Legal Framework |
| `form.security.modalContent` | https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles | https://www.cnil.fr/en/guide-security-personal-data |
| `form.showPrecisions` | Précisions | Additional Details |
| `form.precisionDetails` | Précisions sur les éléments sélectionnés | Details on Selected Items |
| `form.precisionDetailsPlaceholder` | Ex: Accès aux serveurs internes | E.g.: Access to internal servers |

### 12.2 Options standards - Mesures de sécurité

**Note** : Les mesures de sécurité peuvent être traduites ou laissées en français selon le contexte.

| Mesure (FR) | Mesure (EN) |
|-------------|-------------|
| Accès contrôlé | Controlled Access |
| Gestion des autorisations | Authorization Management |
| Tests de sécurité | Security Testing |
| Sauvegardes régulières | Regular Backups |
| Sécurité réseau | Network Security |
| Sécurité des partenaires | Partner Security |
| Chiffrement des données | Data Encryption |
| Anonymisation | Anonymization |
| Pseudonymisation | Pseudonymization |
| Audit | Audit |
| Double authentification | Two-Factor Authentication |
| Pare-feu | Firewall |
| Formation à la sécurité | Security Training |

### 12.3 Clés communes

**Namespace** : `common`

| Clé | Français | Anglais |
|-----|----------|---------|
| `common:search` | Rechercher | Search |
| `common:popular` | Populaire | Popular |
| `common:add` | Ajouter | Add |
| `common:save` | Enregistrer | Save |
| `common:close` | Fermer | Close |
| `common:cancel` | Annuler | Cancel |

### 12.4 Bouton de finalisation

**Namespace** : `treatments`

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.finish` | Terminer | Finish |

---

## 13. Accessibilité

### 13.1 Navigation au clavier

#### Champ de recherche
- Tab : Focus sur le champ
- Flèches haut/bas : Navigation dans les suggestions
- Entrée : Sélection ou ajout
- Échap : Fermeture de la liste

#### Chips des options
- Tab : Navigation entre les chips
- Entrée ou Espace : Sélection/Désélection

#### Chips sélectionnés
- Tab : Navigation entre les chips
- Entrée ou Espace : Retrait de la sélection

#### Bouton "Précisions"
- Tab : Focus sur le bouton
- Entrée ou Espace : Ouverture de la modale

#### Icône d'information
- Tab : Focus sur l'icône
- Entrée ou Espace : Ouverture de la modale d'information

#### Modale des précisions
- Tab : Navigation entre les champs
- Échap : Fermeture de la modale

#### Bouton "Terminer"
- Tab : Focus sur le bouton
- Entrée ou Espace : Finalisation du traitement

### 13.2 Lecteurs d'écran

#### Attributs ARIA

**Icône d'information** :
- `role="button"`
- `aria-label="Informations sur la sécurité des données"`
- `tabindex="0"`

**Champ de recherche** :
- `role="combobox"`
- `aria-expanded="true/false"`
- `aria-autocomplete="list"`

**Chips cliquables** :
- `role="button"`
- `tabindex="0"`
- `aria-label="[Nom de la mesure]"`

**Modale d'information** :
- `role="dialog"`
- `aria-labelledby="titre-modale-info"`
- `aria-modal="true"`

**Modale des précisions** :
- `role="dialog"`
- `aria-labelledby="titre-modale-precisions"`
- `aria-modal="true"`

**Bouton "Terminer"** :
- `aria-label="Terminer et valider le traitement"`

#### Annonces vocales

**Ajout d'une mesure** :
- Annonce : "[Nom de la mesure] ajoutée"

**Retrait d'une mesure** :
- Annonce : "[Nom de la mesure] retirée"

**Ouverture modale d'information** :
- Annonce : "Modale d'information sur la sécurité ouverte"

**Finalisation du traitement** :
- Annonce : "Traitement finalisé avec succès"

### 13.3 Contraste et visibilité

#### Ratios de contraste (WCAG AA)

**Texte normal** : Minimum 4.5:1
- Texte blanc sur fond sombre : ✅ Conforme
- Texte blanc sur fond bleu : ✅ Conforme

**Icône d'information** :
- Contraste minimum : 3:1
- Visible sur le fond sombre : ✅ Conforme

**Bouton "Terminer"** :
- Contraste avec le fond : ✅ Conforme
- Couleur distinctive : Or ou vert

#### États de focus

**Tous les éléments interactifs** :
- Outline : 2px solid bleu primaire
- Offset : 2px

**Icône d'information** :
- Outline circulaire au focus
- Visible en permanence

### 13.4 Responsive design

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

## 14. Cas d'usage détaillés

### 14.1 Cas d'usage 1 : Traitement RH avec données sensibles

**Contexte** : Une entreprise documente son traitement de gestion des paies (données sensibles).

**Étape 8 - Mesures de sécurité** :

1. L'utilisateur arrive sur l'étape 8 (dernière étape)
2. Il clique sur l'icône d'information pour comprendre les obligations
3. La modale d'information s'ouvre
4. Il lit les recommandations de la CNIL
5. Il ferme la modale
6. Il sélectionne les mesures de sécurité :
   - "Chiffrement des données"
   - "Accès contrôlé"
   - "Gestion des autorisations"
   - "Double authentification"
   - "Sauvegardes régulières"
   - "Audit"
   - "Formation à la sécurité"
7. Il clique sur "Précisions"
8. La modale s'ouvre avec 7 champs
9. Il remplit les précisions :
   - Chiffrement : "Chiffrement AES-256 pour les données au repos, TLS 1.3 pour les données en transit"
   - Accès contrôlé : "Accès limité aux employés du service RH (5 personnes) via authentification SSO"
   - Gestion des autorisations : "Matrice des droits par profil, revue trimestrielle des habilitations"
   - Double authentification : "2FA obligatoire pour tous les comptes administrateurs via Google Authenticator"
   - Sauvegardes : "Sauvegardes quotidiennes à 2h, conservation 30 jours, stockage OVH Strasbourg"
   - Audit : "Audit annuel par cabinet externe, dernier audit : janvier 2026"
   - Formation : "Formation annuelle obligatoire pour tous les employés RH, sensibilisation phishing trimestrielle"
10. Il clique sur "Fermer"
11. Il clique sur "Terminer"
12. Validation de toutes les étapes
13. Traitement finalisé avec statut "Validé"
14. Redirection vers l'écran de succès

### 14.2 Cas d'usage 2 : Newsletter marketing (mesures de base)

**Contexte** : Une entreprise documente son traitement de newsletter (données non sensibles).

**Étape 8 - Mesures de sécurité** :

1. L'utilisateur arrive sur l'étape 8
2. Il sélectionne les mesures de base :
   - "Chiffrement des données"
   - "Accès contrôlé"
   - "Sauvegardes régulières"
3. Il clique sur "Précisions"
4. Il remplit :
   - Chiffrement : "HTTPS pour le site web, chiffrement des emails"
   - Accès contrôlé : "Accès limité à l'équipe marketing (3 personnes)"
   - Sauvegardes : "Sauvegardes hebdomadaires de la liste d'abonnés"
5. Il clique sur "Fermer"
6. Il clique sur "Terminer"
7. Traitement finalisé

**Justification** : Données non sensibles → Mesures de sécurité de base suffisantes

### 14.3 Cas d'usage 3 : Application SaaS avec certification

**Contexte** : Une entreprise SaaS veut documenter ses mesures de sécurité avancées.

**Étape 8 - Mesures de sécurité** :

1. L'utilisateur arrive sur l'étape 8
2. Il sélectionne les mesures standards :
   - "Chiffrement des données"
   - "Double authentification"
   - "Pare-feu"
   - "Sécurité réseau"
   - "Tests de sécurité"
   - "Audit"
3. Il veut ajouter sa certification
4. Il tape "Certification ISO 27001" dans la recherche
5. Option "Ajouter : Certification ISO 27001" apparaît
6. Il clique dessus → Ajout et sélection
7. Il tape "Surveillance 24/7" et l'ajoute
8. Il tape "SOC 2 Type II" et l'ajoute
9. Il clique sur "Précisions"
10. Il remplit les précisions détaillées pour chaque mesure
11. Il clique sur "Fermer"
12. Il clique sur "Terminer"
13. Traitement finalisé

### 14.4 Cas d'usage 4 : Modification d'un traitement existant

**Contexte** : Un utilisateur veut ajouter des mesures de sécurité à un traitement existant.

**Étape 8 - Mesures de sécurité** :

1. L'utilisateur ouvre un traitement existant en mode édition
2. Il navigue jusqu'à l'étape 8
3. Les mesures déjà sélectionnées apparaissent :
   - "Chiffrement des données"
   - "Accès contrôlé"
4. Il veut ajouter "Double authentification"
5. Il clique sur "Double authentification" dans les options
6. Le chip est ajouté à la sélection
7. Il clique sur "Précisions"
8. Il voit les précisions existantes pour les 2 premières mesures
9. Il voit le nouveau champ vide pour "Double authentification"
10. Il remplit : "2FA déployée en mars 2026 pour tous les comptes"
11. Il clique sur "Fermer"
12. Il clique sur "Terminer"
13. Traitement mis à jour

### 14.5 Cas d'usage 5 : Gestion des erreurs

**Contexte** : L'utilisateur essaie de finaliser un traitement incomplet.

**Étape 8 - Mesures de sécurité** :

1. L'utilisateur arrive sur l'étape 8
2. Il sélectionne quelques mesures
3. Il clique sur "Terminer"
4. Validation côté serveur détecte des erreurs dans les étapes précédentes :
   - Étape 3 : Aucune finalité sélectionnée
   - Étape 6 : Aucune base légale sélectionnée
5. Un message d'erreur global s'affiche : "Le traitement contient des erreurs. Veuillez les corriger."
6. L'utilisateur est redirigé vers l'étape 3 (première erreur)
7. Il corrige les erreurs
8. Il navigue jusqu'à l'étape 8
9. Il clique sur "Terminer"
10. Validation réussie → Traitement finalisé

### 14.6 Cas d'usage 6 : Sauvegarde en brouillon à la dernière étape

**Contexte** : L'utilisateur n'est pas sûr de ses mesures de sécurité.

**Étape 8 - Mesures de sécurité** :

1. L'utilisateur arrive sur l'étape 8
2. Il sélectionne quelques mesures
3. Il hésite sur les précisions à ajouter
4. Il doit partir en réunion
5. Il clique sur "Enregistrer comme brouillon"
6. Message de confirmation : "Traitement sauvegardé en brouillon"
7. Il peut fermer l'application
8. Plus tard, il rouvre le traitement
9. Il retrouve ses mesures sélectionnées
10. Il ajoute les précisions
11. Il clique sur "Terminer"
12. Traitement finalisé

---

## 15. Maquettes et wireframes

### 15.1 Vue d'ensemble de l'étape 8

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│         Étape 8 - Mesures de sécurité    ⓘ                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │                         │
                    │  Quelles sont les       │
                    │  mesures de sécurité    │
                    │  que vous utilisez ?    │
                    │                         │
                    │  ┌───────────────────┐  │
                    │  │ 🔍 Rechercher... ▼│  │
                    │  └───────────────────┘  │
                    │                         │
                    │  ┌───────────────────┐  │
                    │  │ Sélectionnés :    │  │
                    │  │                   │  │
                    │  │ [Chiffrement ✕]  │  │
                    │  │ [2FA ✕]          │  │
                    │  │ [Sauvegardes ✕]  │  │
                    │  │                   │  │
                    │  └───────────────────┘  │
                    │                         │
                    │  Populaire              │
                    │                         │
                    │  [Accès contrôlé]       │
                    │  [Gestion autoris.]     │
                    │  [Pare-feu]             │
                    │  [Audit]                │
                    │                         │
                    │  ┌─────────────────┐   │
                    │  │   Précisions    │   │
                    │  └─────────────────┘   │
                    │                         │
                    └─────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  [ ← Précédent ]  [ Enregistrer comme brouillon ]  [ Terminer ] │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 Modale d'information

```
                    ┌───────────────────────────────────────────┐
                    │  Cadre légal                           ✕  │
                    ├───────────────────────────────────────────┤
                    │                                           │
                    │  La sécurité des données personnelles est │
                    │  une obligation du RGPD (article 32).    │
                    │                                           │
                    │  Le responsable du traitement doit mettre │
                    │  en œuvre des mesures techniques et       │
                    │  organisationnelles appropriées pour      │
                    │  garantir un niveau de sécurité adapté    │
                    │  au risque.                               │
                    │                                           │
                    │  Ces mesures peuvent inclure :            │
                    │  • Le chiffrement des données             │
                    │  • La pseudonymisation                    │
                    │  • Les contrôles d'accès                  │
                    │  • Les sauvegardes régulières             │
                    │  • La formation du personnel              │
                    │  • Les audits de sécurité                 │
                    │                                           │
                    │  Pour en savoir plus :                    │
                    │  🔗 Guide CNIL de la sécurité des données │
                    │                                           │
                    │                                           │
                    │                          [ Fermer ]        │
                    └───────────────────────────────────────────┘
```

### 15.3 Modale des précisions

```
                    ┌───────────────────────────────────────────┐
                    │  Mesures de sécurité                   ✕  │
                    ├───────────────────────────────────────────┤
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Chiffrement des données             │ │
                    │  │ Chiffrement AES-256 pour les        │ │
                    │  │ données au repos, TLS 1.3 pour les  │ │
                    │  │ données en transit                  │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Double authentification             │ │
                    │  │ 2FA obligatoire pour tous les       │ │
                    │  │ comptes administrateurs via Google  │ │
                    │  │ Authenticator                       │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Sauvegardes régulières              │ │
                    │  │ Sauvegardes quotidiennes à 2h,      │ │
                    │  │ conservation 30 jours, stockage OVH │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Audit                               │ │
                    │  │ Audit annuel par cabinet externe,   │ │
                    │  │ dernier audit : janvier 2026        │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │                                           │
                    │                          [ Fermer ]        │
                    └───────────────────────────────────────────┘
```

### 15.4 Écran de succès (après finalisation)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         ✅                                      │
│                                                                 │
│         LA CRÉATION DE VOTRE FLUX DE TRAITEMENT                 │
│                  EST TERMINÉE                                   │
│                                                                 │
│                                                                 │
│              ┌─────────────────────────────┐                   │
│              │  Créer un nouveau flux      │                   │
│              └─────────────────────────────┘                   │
│                                                                 │
│              ┌─────────────────────────────┐                   │
│              │  Retour à la liste          │                   │
│              └─────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 16. Annexes

### 16.1 Matrice des mesures de sécurité par type de données

| Type de données | Mesures minimales recommandées | Mesures renforcées |
|-----------------|--------------------------------|-------------------|
| **Données de santé** | Chiffrement, Accès contrôlé, 2FA, Sauvegardes, Audit | Pseudonymisation, Anonymisation, Certification HDS |
| **Données financières** | Chiffrement, Accès contrôlé, 2FA, Sauvegardes, Audit | Conformité PCI-DSS, Détection de fraude |
| **Données de mineurs** | Chiffrement, Accès contrôlé, 2FA, Sauvegardes, Formation | Contrôle parental, Modération |
| **Données RH** | Chiffrement, Accès contrôlé, 2FA, Sauvegardes, Audit, Formation | Pseudonymisation, Cloisonnement |
| **Données marketing** | Chiffrement, Accès contrôlé, Sauvegardes | 2FA, Audit |
| **Données publiques** | Sauvegardes, Accès contrôlé | Chiffrement |

### 16.2 Checklist de sécurité par catégorie

#### Contrôle d'accès

☐ **Authentification forte**
   - Mot de passe complexe (12 caractères min, majuscules, chiffres, symboles)
   - Double authentification (2FA/MFA)
   - Verrouillage après 5 tentatives échouées

☐ **Gestion des habilitations**
   - Matrice des droits par profil
   - Principe du moindre privilège
   - Revue périodique des accès (trimestrielle)
   - Révocation immédiate en cas de départ

☐ **Traçabilité**
   - Logs d'accès
   - Logs de modification
   - Conservation des logs (1 an minimum)

#### Chiffrement

☐ **Chiffrement au repos**
   - Bases de données chiffrées (AES-256)
   - Fichiers chiffrés
   - Disques durs chiffrés (BitLocker, FileVault)

☐ **Chiffrement en transit**
   - HTTPS obligatoire (TLS 1.2 minimum, TLS 1.3 recommandé)
   - VPN pour les accès distants
   - Emails chiffrés (S/MIME, PGP)

☐ **Gestion des clés**
   - Stockage sécurisé des clés (HSM, coffre-fort)
   - Rotation régulière des clés
   - Séparation des clés de chiffrement et de déchiffrement

#### Sauvegardes

☐ **Fréquence**
   - Sauvegardes quotidiennes (données critiques)
   - Sauvegardes hebdomadaires (données moins critiques)
   - Sauvegardes incrémentales + complètes

☐ **Stockage**
   - Stockage sur site distant (off-site)
   - Stockage dans un datacenter différent
   - Chiffrement des sauvegardes

☐ **Tests**
   - Tests de restauration mensuels
   - Vérification de l'intégrité des sauvegardes
   - Documentation des procédures de restauration

#### Sécurité réseau

☐ **Pare-feu**
   - Pare-feu réseau (hardware)
   - Pare-feu applicatif (WAF)
   - Règles de filtrage strictes

☐ **Segmentation**
   - VLAN pour séparer les réseaux
   - DMZ pour les serveurs publics
   - Isolation des environnements (dev, prod)

☐ **Détection**
   - IDS/IPS (détection/prévention d'intrusion)
   - Monitoring en temps réel
   - Alertes automatiques

#### Mesures organisationnelles

☐ **Politique de sécurité**
   - Politique documentée et approuvée
   - Diffusée à tous les employés
   - Mise à jour régulière

☐ **Formation**
   - Formation initiale obligatoire
   - Formations régulières (annuelles)
   - Sensibilisation au phishing
   - Tests de sensibilisation

☐ **Gestion des incidents**
   - Procédure de gestion des incidents documentée
   - Équipe de réponse aux incidents (CSIRT)
   - Tests réguliers de la procédure
   - Notification CNIL sous 72h si violation

☐ **Audits**
   - Audits internes réguliers
   - Audits externes (annuels)
   - Pentests (tests d'intrusion)
   - Revue des logs

### 16.3 Exemples de formulations de précisions

#### Chiffrement des données
- "Chiffrement AES-256 pour les bases de données, TLS 1.3 pour les communications, chiffrement de bout en bout pour les messages sensibles"
- "Chiffrement au repos via BitLocker sur tous les postes de travail, HTTPS obligatoire pour le site web"
- "Chiffrement des sauvegardes avec clés stockées dans un HSM (Hardware Security Module)"

#### Accès contrôlé
- "Accès limité aux employés du service RH (5 personnes) via authentification SSO (Single Sign-On)"
- "Contrôle d'accès basé sur les rôles (RBAC), revue trimestrielle des habilitations"
- "Accès aux données de production limité aux administrateurs système (3 personnes), tous les accès sont loggés"

#### Double authentification
- "2FA obligatoire pour tous les comptes administrateurs via Google Authenticator, déploiement progressif pour tous les utilisateurs d'ici juin 2026"
- "Authentification multi-facteurs (MFA) avec SMS + mot de passe pour les accès sensibles"
- "Clés de sécurité physiques (YubiKey) pour les comptes à privilèges"

#### Sauvegardes régulières
- "Sauvegardes quotidiennes automatiques à 2h du matin, sauvegardes incrémentales toutes les 6h, conservation 30 jours, stockage OVH Strasbourg + réplication Roubaix"
- "Sauvegardes hebdomadaires complètes, tests de restauration mensuels, dernière restauration testée : 15/02/2026"
- "Sauvegardes chiffrées stockées sur AWS S3 (région eu-west-1), conservation 90 jours"

#### Pare-feu
- "Pare-feu Fortinet FortiGate avec règles strictes, blocage de tous les ports non utilisés, liste blanche d'IP autorisées"
- "WAF (Web Application Firewall) Cloudflare pour protéger contre les attaques web (SQL injection, XSS, etc.)"
- "Pare-feu réseau + pare-feu applicatif, monitoring 24/7, alertes en temps réel"

#### Tests de sécurité
- "Pentests annuels par cabinet externe (dernier : janvier 2026), scans de vulnérabilités mensuels avec Nessus, toutes les vulnérabilités critiques corrigées sous 48h"
- "Tests d'intrusion trimestriels, revue de code sécurité avant chaque déploiement, bug bounty program actif"
- "Scans automatiques quotidiens, tests de charge mensuels, audit de sécurité annuel"

#### Audit
- "Audit annuel par cabinet externe (Ernst & Young), dernier audit : janvier 2026, toutes les recommandations implémentées"
- "Audits internes trimestriels, revue des logs d'accès mensuelle, contrôle des sous-traitants semestriel"
- "Certification ISO 27001 obtenue en 2025, audits de surveillance annuels"

#### Formation à la sécurité
- "Formation annuelle obligatoire pour tous les employés (4h), sensibilisation au phishing trimestrielle, taux de participation : 98%"
- "Formation initiale pour les nouveaux employés (2h), e-learning disponible, tests de phishing simulés mensuels"
- "Formations spécialisées pour les administrateurs système (8h/an), certifications de sécurité encouragées"

#### Pseudonymisation
- "Remplacement des noms par des UUID, séparation des données d'identification dans une base distincte"
- "Hachage SHA-256 des emails, tokenisation des numéros de téléphone"
- "Pseudonymisation automatique pour les environnements de test et de développement"

#### Anonymisation
- "Agrégation des données pour les statistiques, suppression de tous les identifiants directs et indirects"
- "K-anonymat (k=5) pour les jeux de données analytiques, vérification de la non-réidentification"
- "Anonymisation irréversible après 3 ans de conservation, processus automatisé"

#### Sécurité réseau
- "Segmentation réseau avec VLAN, DMZ pour les serveurs web, VPN obligatoire pour les accès distants"
- "IDS/IPS (Snort) pour la détection d'intrusion, monitoring réseau 24/7, alertes automatiques"
- "Filtrage des flux réseau, blocage des connexions suspectes, liste blanche d'IP"

#### Sécurité des partenaires
- "Clauses de sécurité dans tous les contrats de sous-traitance, audits annuels des sous-traitants, certification ISO 27001 exigée"
- "Vérification des mesures de sécurité avant tout partenariat, DPA (Data Processing Agreement) signé, responsabilité contractuelle"
- "Sous-traitants certifiés uniquement, audits de sécurité trimestriels, clause de notification des violations sous 24h"

#### Gestion des autorisations
- "Matrice des droits CRUD par rôle, validation des demandes d'accès par le responsable, revue trimestrielle des habilitations"
- "Séparation des environnements (dev, test, prod), accès production limité aux administrateurs, principe du moindre privilège"
- "Workflow d'approbation pour les accès sensibles, révocation automatique après 90 jours d'inactivité"

### 16.4 Normes et certifications de sécurité

#### ISO/IEC 27001

**Description** : Norme internationale pour les systèmes de management de la sécurité de l'information (SMSI).

**Domaines couverts** :
- Politique de sécurité
- Organisation de la sécurité
- Gestion des actifs
- Contrôle d'accès
- Cryptographie
- Sécurité physique
- Sécurité des opérations
- Sécurité des communications
- Gestion des incidents
- Continuité d'activité

**Certification** : Audit par organisme accrédité

**Validité** : 3 ans (avec audits de surveillance annuels)

**Intérêt RGPD** : Démontre la mise en place de mesures de sécurité appropriées

#### ISO/IEC 27701

**Description** : Extension de l'ISO 27001 pour la protection de la vie privée.

**Domaines couverts** : Spécifiques à la protection des données personnelles

**Intérêt RGPD** : Certification spécifique pour la conformité RGPD

#### SOC 2 Type II

**Description** : Audit des contrôles de sécurité d'un prestataire de services.

**Critères** :
- Sécurité
- Disponibilité
- Intégrité du traitement
- Confidentialité
- Vie privée

**Utilisation** : Principalement pour les fournisseurs SaaS

**Intérêt** : Rassure les clients sur la sécurité du service

#### PCI-DSS

**Description** : Norme de sécurité pour les données de cartes bancaires.

**Domaines couverts** :
- Réseau sécurisé
- Protection des données de titulaires de cartes
- Gestion des vulnérabilités
- Contrôle d'accès
- Monitoring
- Politique de sécurité

**Obligation** : Pour toute organisation traitant des paiements par carte

**Niveaux** : 4 niveaux selon le volume de transactions

#### HDS (Hébergement de Données de Santé)

**Description** : Certification française pour l'hébergement de données de santé.

**Obligation** : Pour tout hébergeur de données de santé en France

**Domaines couverts** :
- Sécurité physique
- Sécurité logique
- Traçabilité
- Sauvegarde
- Continuité d'activité

**Certification** : Par organisme accrédité (COFRAC)

#### CISSP, CISM, CEH

**Description** : Certifications professionnelles en sécurité informatique.

**CISSP** : Certified Information Systems Security Professional

**CISM** : Certified Information Security Manager

**CEH** : Certified Ethical Hacker

**Intérêt** : Personnel qualifié en sécurité

### 16.5 Guide de choix des mesures de sécurité

#### Étape 1 : Évaluer le risque

**Questions à se poser** :
1. Quelles données sont collectées ? (sensibles ou non)
2. Combien de personnes sont concernées ? (échelle du traitement)
3. Quels sont les impacts potentiels d'une violation ?
4. Quelles sont les menaces probables ?

**Résultat** : Niveau de risque (faible, moyen, élevé, critique)

#### Étape 2 : Choisir les mesures techniques

**Risque faible** :
- Chiffrement en transit (HTTPS)
- Sauvegardes régulières
- Accès contrôlé

**Risque moyen** :
- Chiffrement au repos + en transit
- Double authentification
- Sauvegardes quotidiennes
- Pare-feu
- Accès contrôlé

**Risque élevé** :
- Chiffrement renforcé (E2E)
- Double authentification obligatoire
- Pseudonymisation
- Sauvegardes multiples
- Pare-feu + IDS/IPS
- Tests de sécurité réguliers
- Audit annuel

**Risque critique** :
- Toutes les mesures précédentes
- Anonymisation quand possible
- Certification (ISO 27001, HDS, etc.)
- Surveillance 24/7
- Équipe de sécurité dédiée
- Plan de continuité d'activité

#### Étape 3 : Choisir les mesures organisationnelles

**Toujours recommandé** :
- Formation à la sécurité
- Politique de sécurité documentée
- Gestion des habilitations
- Clauses de confidentialité dans les contrats

**Selon le risque** :
- Audit interne/externe
- Gestion des incidents
- Plan de continuité d'activité
- Désignation d'un RSSI (Responsable Sécurité des SI)

#### Étape 4 : Documenter les mesures

**Pour chaque mesure** :
1. Nom de la mesure
2. Description détaillée de la mise en œuvre
3. Responsable de la mesure
4. Fréquence de révision
5. Date de dernière révision
6. Preuves (certificats, rapports d'audit, etc.)

### 16.6 Glossaire technique

**AES (Advanced Encryption Standard)** : Algorithme de chiffrement symétrique. AES-256 = clé de 256 bits.

**TLS (Transport Layer Security)** : Protocole de sécurisation des communications réseau (successeur de SSL).

**2FA (Two-Factor Authentication)** : Authentification à deux facteurs.

**MFA (Multi-Factor Authentication)** : Authentification multi-facteurs (plus de 2 facteurs).

**HSM (Hardware Security Module)** : Module matériel de sécurité pour la gestion des clés cryptographiques.

**IDS (Intrusion Detection System)** : Système de détection d'intrusion.

**IPS (Intrusion Prevention System)** : Système de prévention d'intrusion.

**WAF (Web Application Firewall)** : Pare-feu applicatif web.

**VLAN (Virtual Local Area Network)** : Réseau local virtuel.

**DMZ (Demilitarized Zone)** : Zone démilitarisée, réseau intermédiaire entre Internet et le réseau interne.

**VPN (Virtual Private Network)** : Réseau privé virtuel.

**SSO (Single Sign-On)** : Authentification unique.

**RBAC (Role-Based Access Control)** : Contrôle d'accès basé sur les rôles.

**PCA (Plan de Continuité d'Activité)** : Plan pour maintenir les activités en cas de sinistre.

**PRA (Plan de Reprise d'Activité)** : Plan pour reprendre les activités après un sinistre.

**CSIRT (Computer Security Incident Response Team)** : Équipe de réponse aux incidents de sécurité.

**Pentest (Penetration Test)** : Test d'intrusion pour identifier les vulnérabilités.

**K-anonymat** : Technique d'anonymisation garantissant qu'un individu ne peut être distingué de k-1 autres.

**Hachage (Hash)** : Fonction cryptographique à sens unique (SHA-256, bcrypt).

**Tokenisation** : Remplacement d'une donnée sensible par un jeton (token) non sensible.

### 16.7 Références légales et techniques

**Textes RGPD** :
- **Article 5.1.f** : Principe d'intégrité et de confidentialité
- **Article 32** : Sécurité du traitement
- **Article 33** : Notification des violations à l'autorité de contrôle
- **Article 34** : Communication des violations aux personnes concernées

**Ressources CNIL** :
- Guide de la sécurité des données personnelles : https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles
- Notification des violations : https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles
- Mesures de sécurité : https://www.cnil.fr/fr/securite-des-donnees

**Normes et certifications** :
- ISO/IEC 27001 : https://www.iso.org/isoiec-27001-information-security.html
- ISO/IEC 27701 : https://www.iso.org/standard/71670.html
- PCI-DSS : https://www.pcisecuritystandards.org/
- HDS : https://esante.gouv.fr/labels-certifications/hds

**Guides techniques** :
- ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information) : https://www.ssi.gouv.fr/
- OWASP (Open Web Application Security Project) : https://owasp.org/
- NIST (National Institute of Standards and Technology) : https://www.nist.gov/

### 16.8 Conseils pratiques

#### Pour choisir les bonnes mesures

✅ **Évaluer le risque** : Adapter les mesures au niveau de risque

✅ **Combiner technique et organisationnel** : Les deux types de mesures sont complémentaires

✅ **Privilégier la prévention** : Mieux vaut prévenir que guérir

✅ **Tester régulièrement** : Vérifier l'efficacité des mesures

✅ **Former le personnel** : Le facteur humain est critique

✅ **Documenter précisément** : Facilite les audits et prouve la conformité

✅ **Réviser régulièrement** : Adapter aux nouvelles menaces

#### Erreurs fréquentes à éviter

❌ **Sous-estimer le risque** : "Nous sommes trop petits pour être attaqués"

❌ **Négliger la formation** : Le personnel est souvent la principale faille

❌ **Chiffrement insuffisant** : Utiliser des algorithmes obsolètes (DES, MD5)

❌ **Pas de sauvegardes** : Risque de perte totale des données

❌ **Pas de tests** : Les mesures peuvent être inefficaces sans test

❌ **Oublier les sous-traitants** : Vérifier leur niveau de sécurité

❌ **Pas de plan de gestion des incidents** : Réagir dans l'urgence est inefficace

#### Bonnes pratiques

✅ **Défense en profondeur** : Multiplier les couches de sécurité

✅ **Principe du moindre privilège** : Donner uniquement les accès nécessaires

✅ **Séparation des environnements** : Dev, test, prod bien séparés

✅ **Monitoring continu** : Surveiller les accès et les anomalies

✅ **Mise à jour régulière** : Patcher les vulnérabilités rapidement

✅ **Chiffrement par défaut** : Chiffrer toutes les données sensibles

✅ **Authentification forte** : 2FA pour tous les comptes sensibles

✅ **Sauvegardes testées** : Tester régulièrement les restaurations

✅ **Documentation à jour** : Maintenir la documentation des mesures

✅ **Culture de la sécurité** : Sensibiliser tous les collaborateurs

---

## 17. Spécifications techniques d'intégration

### 17.1 Format des requêtes HTTP

#### Finalisation du traitement

**Requête** :
```http
PUT /api/v1/treatments HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Gestion des candidatures",
  "treatmentType": "RH",
  "reasons": ["Recrutement"],
  "subReasons": [ ... ],
  "subjectCategories": [ ... ],
  "personalDataGroup": { ... },
  "financialDataGroup": { ... },
  "dataSources": [ ... ],
  "legalBase": [ ... ],
  "dataAccess": [ ... ],
  "sharedData": [ ... ],
  "areDataExportedOutsideEU": false,
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
      "additionalInformation": "Sauvegardes quotidiennes automatiques"
    }
  ]
}
```

**Réponse (succès)** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "validated",
  "creationDate": "2026-02-18T10:30:00Z",
  "updateDate": "2026-02-18T16:45:00Z",
  "order": 1,
  "data": {
    "title": "Gestion des candidatures",
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
        "additionalInformation": "Sauvegardes quotidiennes automatiques"
      }
    ],
    ...
  }
}
```

**Effet** : Le statut passe de "draft" à "validated"

#### Validation avec erreurs

**Réponse (erreur)** :
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

[
  {
    "path": ["legalBase"],
    "message": "Au moins une base légale est requise pour valider le traitement"
  },
  {
    "path": ["securitySetup"],
    "message": "Au moins une mesure de sécurité est recommandée"
  }
]
```

**Gestion** :
- Afficher un message d'erreur global
- Rediriger vers la première étape contenant une erreur
- Afficher les erreurs sur les champs concernés

---

## 18. Règles de validation détaillées

### 18.1 Validation des mesures de sécurité

**Champ `securitySetup`** :
- Type : Tableau d'objets
- Minimum : 0 éléments (brouillon) ou 1 élément recommandé (validation)
- Maximum : Illimité (recommandé : 20 max)
- `name` : Obligatoire, chaîne non vide, max 200 caractères
- `additionalInformation` : Optionnel, max 2000 caractères

**Messages d'erreur** :
- Aucune mesure (validation) : "Au moins une mesure de sécurité est recommandée pour valider le traitement"
- `name` vide : "Le nom de la mesure est obligatoire"
- Trop long : "Le nom ne peut pas dépasser 200 caractères"
- `additionalInformation` trop long : "Les précisions ne peuvent pas dépasser 2000 caractères"

### 18.2 Validation globale du traitement

**Déclenchement** : Clic sur "Terminer" à l'étape 8

**Validation de toutes les étapes** :

**Étape 1 - Titre** :
- `title` : Obligatoire, chaîne non vide

**Étape 2 - Informations générales** :
- `treatmentType` : Recommandé
- `responsible` : Recommandé
- `hasDPO` : Obligatoire (booléen)

**Étape 3 - Finalités** :
- `reasons` : Au moins 1 élément

**Étape 4 - Catégories** :
- `subjectCategories` : Au moins 1 élément

**Étape 5 - Données** :
- `personalDataGroup` ou `financialDataGroup` : Au moins un groupe avec des données

**Étape 6 - Base légale** :
- `legalBase` : Au moins 1 élément

**Étape 7 - Partage** :
- Si `areDataExportedOutsideEU = true` : Champs de destinataire obligatoires

**Étape 8 - Sécurité** :
- `securitySetup` : Au moins 1 élément recommandé

**En cas d'erreur** :
- Affichage d'un résumé des erreurs
- Redirection vers la première étape contenant une erreur
- Mise en évidence des champs en erreur

---

## 19. Écran de succès

### 19.1 Affichage après finalisation

**Déclenchement** : Après la finalisation réussie du traitement

**Contenu** :

**Icône** : Coche verte (✅) ou icône de succès

**Titre** : "LA CRÉATION DE VOTRE FLUX DE TRAITEMENT EST TERMINÉE"

**Style** :
- Centré
- Texte en majuscules
- Taille de police importante
- Couleur : Blanc ou or

**Message** : Optionnel, félicitations ou confirmation

### 19.2 Actions disponibles

#### Action 1 : Créer un nouveau flux

**Bouton** : "Créer un nouveau flux"

**Style** :
- Couleur : Or (#DDB867) ou bleu primaire
- Largeur : 300px
- Centré

**Action** :
1. Réinitialise le formulaire
2. Redirige vers l'étape 1 (Titre)
3. Nouveau traitement vierge

**Utilité** : Permet de créer rapidement plusieurs traitements successivement

#### Action 2 : Retour à la liste

**Bouton** : "Retour à la liste" ou "Terminer la création du flux"

**Style** :
- Couleur : Gris ou bleu secondaire
- Largeur : 300px
- Centré

**Action** :
1. Redirige vers la liste des traitements
2. Le nouveau traitement apparaît dans la liste avec le statut "Validé"

**Utilité** : Permet de consulter le traitement créé

#### Action 3 : Précédent (optionnel)

**Bouton** : "Précédent"

**Action** : Retour à l'étape 8 (pour modification)

**Disponibilité** : Optionnelle

### 19.3 Layout de l'écran de succès

**Centrage** : Vertical et horizontal

**Fond** : Identique au reste de l'application (dark mode)

**Animation** : Optionnelle (fade in, slide up)

**Durée d'affichage** : Permanente (jusqu'à action de l'utilisateur)

---

## 20. Considérations de performance

### 20.1 Chargement des options

**Problème** : Si des centaines de mesures personnalisées existent

**Solutions** :
1. Pagination des options
2. Recherche côté serveur
3. Virtualisation de la liste

### 20.2 Validation globale

**Problème** : La validation de toutes les étapes peut être lente

**Solutions** :
1. Validation progressive (étape par étape)
2. Cache des validations précédentes
3. Indicateur de progression

### 20.3 Finalisation du traitement

**Problème** : La requête de finalisation peut être volumineuse

**Solutions** :
1. Compression des données (gzip)
2. Envoi uniquement des champs modifiés (PATCH)
3. Timeout adapté (10 secondes)

---

## 21. Tests et qualité

### 21.1 Tests fonctionnels - Étape 8

#### Test 1 : Sélection d'une mesure
- Ouvrir l'étape 8
- Cliquer sur "Chiffrement des données"
- Vérifier l'ajout à la sélection

#### Test 2 : Ajout de précisions
- Sélectionner "Chiffrement des données"
- Cliquer sur "Précisions"
- Vérifier l'ouverture de la modale
- Remplir le champ
- Cliquer sur "Fermer"
- Vérifier la sauvegarde

#### Test 3 : Création d'une mesure personnalisée
- Taper "Certification ISO 27001"
- Cliquer sur "Ajouter : Certification ISO 27001"
- Vérifier l'ajout et la sauvegarde dans les paramètres

#### Test 4 : Ouverture de la modale d'information
- Cliquer sur l'icône d'information
- Vérifier l'ouverture de la modale
- Vérifier le contenu
- Fermer la modale

#### Test 5 : Finalisation du traitement
- Sélectionner des mesures
- Cliquer sur "Terminer"
- Vérifier la validation
- Vérifier la redirection vers l'écran de succès

#### Test 6 : Gestion des erreurs
- Ne pas remplir les étapes précédentes
- Cliquer sur "Terminer"
- Vérifier l'affichage des erreurs
- Vérifier la redirection vers l'étape en erreur

### 21.2 Tests de non-régression

#### Test NR-1 : Compatibilité avec les données existantes
- Ouvrir un traitement créé avec une ancienne version
- Vérifier que les mesures s'affichent correctement

### 21.3 Tests d'accessibilité

#### Test A-1 : Navigation au clavier
- Naviguer dans l'étape 8 uniquement au clavier
- Vérifier que tous les éléments sont accessibles

#### Test A-2 : Lecteur d'écran
- Utiliser un lecteur d'écran
- Vérifier que toutes les informations sont annoncées

---

**Fin du document**

Ce document fournit toutes les informations nécessaires pour implémenter l'étape 8 du formulaire de traitement dans n'importe quel framework frontend.
