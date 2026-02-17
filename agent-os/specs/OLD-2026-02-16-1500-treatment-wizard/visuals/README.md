# Treatment Wizard UI Screenshots

## Overview

10 screenshots were provided during the shaping conversation showing the complete wizard UI flow. These screenshots show the actual design and interaction patterns to implement.

## Screenshots Provided

### Step 1: Treatment Name
**File**: `step-1-name.png` (provided inline in conversation)

Shows:
- Treatment title text input
- Treatment type dropdown (showing "Ressources Humaines")
- Description textarea
- Progress indicator showing step 1 active
- Navigation buttons: ANNULER, COMMENCER

### Step 2: General Identification
**File**: `step-2-general-info.png` (provided inline in conversation)

Shows:
- Entity identification form (left panel)
  - Company name, number, address, postal code, city, country, phone, email
  - All fields filled with example data (Servais, BE 0412.589.401, etc.)
- DPO information toggle and form (center panel)
  - "Nous travaillons avec un DPO" toggle (enabled)
  - DPO details form
- External DPO toggle and form (right panel)
  - "Le DPO est externe à la société" toggle (disabled)
  - External entity form (grayed out)
- Note: "Les informations du responsable du traitement ne peuvent pas être modifiées"
- Navigation: PRÉCÉDENT, ENREGISTRER, PASSER, SUIVANT

### Step 3: Purposes
**File**: `step-3-purposes.png` (provided inline in conversation)

Shows:
- Question: "Pourquoi traitez-vous ces données ?"
- Search input with "Rechercher..." placeholder
- Selected purpose: "Sélection et recrutement Ⓧ" (blue tag with info icon)
- "SOUS-FINALITÉS" button (gold/yellow)
- Example purposes shown: Suivi et accompagnement du développement du personnel, Optimisation des déplacements, Pointage, Amélioration du service
- Navigation buttons

**File**: `step-3-sub-purposes-modal.png` (provided inline in conversation)

Shows:
- Modal dialog: "Sous-finalités"
- Text: "Ajoutez des sous-finalités"
- Two input fields:
  - "Nom de la sous finalité *"
  - "Description pour 'cette sous finalité' *"
- Delete icon and Add (+) icon
- ENREGISTRER button

### Step 4: Data Subject Categories
**File**: `step-4-categories.png` (provided inline in conversation)

Shows:
- Question: "Quelles sont les catégories de personnes concernées par ce traitement ?"
- Search input
- Selected category: "Candidats Ⓧ" (blue tag with info icon)
- "PRÉCISIONS" button (gold/yellow)
- Examples: Sous-traitants, Visiteurs, Actionnaires, Clients
- Navigation buttons

**File**: `step-4-precisions-modal.png` (provided inline in conversation)

Shows:
- Modal: "Précisions sur les éléments sélectionnés"
- Single text input: "Candidats"
- ENREGISTRER button

### Step 5: Data Collected
**File**: `step-5-data.png` (provided inline in conversation)

Shows three columns:

**Left**: "Quelles données personnelles collectez-vous ?"
- Search input
- Selected tags with different colors and shield icons:
  - "Nom" (blue, no icon)
  - "🛡️ Prénom" (blue, shield)
  - "🛡️ N° de téléphone privé" (yellow, shield)
  - "🛡️ Adresse privée" (yellow, shield)
  - "🛡️ Sexe" (yellow, shield)
  - "🛡️ Âge" (yellow, shield)
  - "🛡️ Expériences professionnelles" (yellow, shield)
  - "🛡️ CV" (yellow, shield)
  - "🛡️ Profil de personnalité" (yellow, shield)
  - "Connaissances linguistiques" (blue)
  - "🛡️ Éducation et formation" (yellow, shield)
  - "🛡️ Rémunérations antérieures ou prétendue" (yellow, shield)
  - "🛡️ Photo (si communication spontanée)" (yellow, shield)
  - "Evaluation et commentaires aux différentes phases du processus de recrutement" (yellow)
- Examples at bottom: Nom, Prénom, Email, Téléphone, Données financières, Photographie
- Retention period: "Durée de conservation" selector
- Text: "Durée du contrat si le candidat est sélectionné, 6"

**Middle**: "Quelles informations d'ordre économique et financier récoltez-vous ?"
- Search input
- Selected tag: "🛡️ Extrait de casier judiciaire pour certaines fonctions sensibles" (yellow, shield)
- Examples: Chiffre d'affaires, Bilan financier, Prêts en cours, Dépenses, Titulaire du compte, IBAN ou RIB, Informations fiscales
- Retention period selector

**Right**: "Quelle est la source des données ?"
- Search input
- Selected tags: "Employé Ⓧ", "Agence intérim Ⓧ"
- "PRÉCISIONS" button
- Examples: Fichiers clients, Réseaux sociaux, Formulaire en ligne, Cookies et trackers

Navigation buttons shown

### Step 6: Legal Basis
**File**: `step-6-legal-basis.png` (provided inline in conversation)

Shows:
- Question: "Quelles sont les bases légales de ce traitement ?"
- Search input
- Selected tags: "Obligations (pré)contractuelles Ⓧ", "Intérêts légitimes du RT Ⓧ"
- Examples: Consentement de la personne concernée, Sauvegarde des intérêts vitaux, Exécution d'un contrat (ou des mesures précontractuelles), Respect d'une obligation légale
- Navigation buttons

### Step 7: Data Sharing
**File**: `step-7-sharing.png` (provided inline in conversation)

Shows three sections:

**Left**: "Accès aux données"
- Search input
- Selected: "Agence intérim Ⓧ"
- "PRÉCISIONS" button
- Examples: Administrateurs, Fournisseurs externes, Service client, Employés

**Middle**: "Partage des données avec des tiers"
- Search input
- "PRÉCISIONS" button
- Examples: Clients, Fournisseurs, Filiales, Administration publique

**Right**: "Données hors UE"
- Toggle: "Les données sont exportées hors UE" (disabled)

Navigation buttons shown

**File**: `step-7-access-modal.png` (provided inline in conversation)

Shows:
- Modal: "Détails de l'accès aux données"
- Single text input: "Agence intérim" with label
- Text: "Eventuellement"
- ENREGISTRER button

### Step 8: Security Measures
**File**: `step-8-security.png` (provided inline in conversation)

Shows:
- Question: "Quelles sont les mesures de sécurité que vous utilisez ?"
- Search input
- Selected tags:
  - "Limitation des accès aux seuls personnes autorisées Ⓧ"
  - "Sécurisation des moyens de stockages des données Ⓧ"
  - "Minimisation des données Ⓧ"
- "PRÉCISIONS" button
- Examples: Sécurité des partenaires, Tests de sécurité, Sécurité réseau, Accès contrôlé
- Navigation: PRÉCÉDENT, ENREGISTRER, PASSER, TERMINER (gold button)

## UI Patterns Observed

### Progress Indicator
- 8 numbered circles (1-8) in horizontal row at top
- Completed: blue checkmark ✓
- Current: blue highlight with number
- Upcoming: gray with number

### Navigation Buttons
- PRÉCÉDENT (Previous): Blue outline
- ENREGISTRER (Save): Blue outline
- PASSER (Skip): Blue outline
- SUIVANT (Next): Gold/yellow solid
- TERMINER (Finish): Gold/yellow solid (step 8 only)
- ANNULER (Cancel): Blue outline (step 1 only)
- COMMENCER (Start): Gold/yellow solid (step 1 only)

### Tag Selection Pattern
- Blue tags for selected items
- X button to remove
- Info icon (Ⓘ) for details
- Shield icon (🛡️) for sensitive data
- Yellow tags for sensitive data items

### Search Pattern
- "Rechercher..." placeholder
- Autocomplete suggestions below
- Examples shown as grayed-out tags

### Modal Pattern
- Centered dialog with dark overlay
- Close (X) button top-right
- ENREGISTRER (Save) button bottom-right
- Simple form inputs

### Color Scheme
- Dark blue background (#0A1628 approximately)
- Blue for primary actions and selected items
- Gold/yellow (#E8B05E approximately) for important CTAs
- White text
- Gray for inactive/example items

## Notes for Implementation

1. **Screenshots are inline in the conversation** - Extract them manually or reference the conversation history
2. **Dark theme throughout** - All components use dark background
3. **Consistent spacing** - Generous padding and margins
4. **Accessibility** - Good contrast, clear focus states
5. **Responsive** - Layouts adapt to content (note 3-column layout in step 5)
6. **i18n** - All text in French in screenshots, but EN translations needed
7. **Icons** - Info (Ⓘ), Shield (🛡️), Close (X), Menu (⋮) used consistently

## Reference During Implementation

When building components:
1. Match the exact visual styling (colors, spacing, typography)
2. Follow the tag selection pattern for all multi-select fields
3. Use the same modal pattern for all detail entry
4. Replicate the progress indicator exactly
5. Maintain button styling and positioning consistency

The screenshots represent the target design. Match them as closely as possible.
