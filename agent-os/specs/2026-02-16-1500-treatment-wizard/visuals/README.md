# Treatment Wizard UI Screenshots (Steps 1-2)

## Overview

3 screenshots cover the current implementation scope (steps 1-2). Additional screenshots for future steps (3-8) are archived in `archived/`.

## Screenshots

### Step 1: Treatment Name
**File**: `Step_1.jpeg`

Shows:
- Treatment title text input
- Treatment type dropdown (showing "Ressources Humaines")
- Description textarea
- Progress indicator showing step 1 active
- Navigation buttons: ANNULER, COMMENCER

### Step 2: General Identification
**File**: `Step_2.jpeg`

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

### Step 2: Parameter Configuration
**File**: `Step_2_Paramater.jpeg`

Shows additional parameter configuration details for step 2.

## UI Patterns Observed

### Progress Indicator
- 2 numbered circles (1-2) in horizontal row at top
- Completed: blue checkmark
- Current: blue highlight with number

### Navigation Buttons
- ANNULER (Cancel): Blue outline (step 1 only)
- COMMENCER (Start): Gold/yellow solid (step 1 only)
- PRÉCÉDENT (Previous): Blue outline
- ENREGISTRER (Save): Blue outline
- PASSER (Skip): Blue outline
- SUIVANT (Next) / TERMINER (Finish): Gold/yellow solid

### Color Scheme
- Dark blue background (#0A1628 approximately)
- Blue for primary actions and selected items
- Gold/yellow (#E8B05E approximately) for important CTAs
- White text
- Gray for inactive/example items

## Archived Screenshots (Steps 3-8)

The `archived/` folder contains screenshots for future wizard steps:
- Step_3.jpeg, Step_3_2.jpeg — Purposes
- Step_4.jpeg, Step_4_2.jpeg — Data Subject Categories
- Step_5.jpeg — Data Collected
- Step_6.jpeg — Legal Basis
- Step_7.jpeg, Step_7_2.jpeg — Data Sharing
- Step_8.jpeg — Security Measures
