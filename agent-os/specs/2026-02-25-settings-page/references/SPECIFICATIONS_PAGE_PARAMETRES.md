# Spécifications Fonctionnelles - Page de Gestion des Paramètres

## Document de spécifications pour développeur expérimenté

**Version** : 1.0  
**Date** : 18 février 2026  
**Application** : Registr Frontend - Gestion des traitements RGPD  

---

## Table des matières

1. [Contexte métier](#1-contexte-métier)
2. [Vue d'ensemble de la page](#2-vue-densemble-de-la-page)
3. [Navigation et onglets](#3-navigation-et-onglets)
4. [Tableau des paramètres](#4-tableau-des-paramètres)
5. [Filtrage par type](#5-filtrage-par-type)
6. [Pagination](#6-pagination)
7. [Actions sur les paramètres](#7-actions-sur-les-paramètres)
8. [Formulaire de création/modification](#8-formulaire-de-créationmodification)
9. [Suppression d'un paramètre](#9-suppression-dun-paramètre)
10. [Import/Export](#10-importexport)
11. [Structure des données](#11-structure-des-données)
12. [Intégration API](#12-intégration-api)
13. [Règles de gestion](#13-règles-de-gestion)
14. [Internationalisation](#14-internationalisation)
15. [Accessibilité](#15-accessibilité)
16. [Cas d'usage détaillés](#16-cas-dusage-détaillés)
17. [Maquettes et wireframes](#17-maquettes-et-wireframes)
18. [Annexes](#18-annexes)

---

## 1. Contexte métier

### 1.1 Qu'est-ce que la page de paramètres ?

La page de **paramètres** (settings) permet aux administrateurs de gérer les **options personnalisées** de l'application.

**URL** : `/dashboard/settings`

**Accès** : Réservé aux administrateurs

**Objectif** : Centraliser la gestion de toutes les options personnalisées créées par les utilisateurs (finalités, catégories, mesures de sécurité, etc.).

### 1.2 Différence avec l'ajout inline

**Ajout inline** (dans les formulaires) :
- Ajout rapide d'une option pendant la création d'un traitement
- Pas de vue d'ensemble des options existantes
- Pas de modification ou suppression

**Page de paramètres** :
- Vue d'ensemble de tous les paramètres
- CRUD complet (Create, Read, Update, Delete)
- Filtrage et pagination
- Import/Export

### 1.3 Utilité pour l'organisation

**Centralisation** : Tous les paramètres au même endroit

**Maintenance** : Modification et suppression faciles

**Cohérence** : Éviter les doublons et les incohérences

**Audit** : Voir tous les paramètres créés

**Migration** : Export/Import pour transférer les paramètres entre environnements

---

## 2. Vue d'ensemble de la page

### 2.1 Structure générale

La page est divisée en **deux onglets** :
1. **Paramètres** : Gestion des options personnalisées
2. **Entreprise** : Informations de l'entreprise (DPO, responsable, etc.)

**Composant principal** : `SettingsPage.tsx`

**Fichier** : `packages/registr_frontend/src/features/settings/pages/SettingsPage.tsx`

### 2.2 Layout de la page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [ Paramètres ]  [ Entreprise ]                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [ + Paramètre ]                                                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Filtre : [Type ▼]  [Catégorie de personne ✕]             │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Type              │ Nom                        │ Actions  │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Finalité          │ Intérêt légitime           │ ✏️ 🗑️   │ │
│  │ Catégorie         │ Candidats                  │ ✏️ 🗑️   │ │
│  │ Mesure            │ Certification ISO 27001    │ ✏️ 🗑️   │ │
│  │ ...               │ ...                        │ ...      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [ 1 ] [ 2 ] [ 3 ] ... [ 10 ]                                   │
│                                                                 │
│  [ ⬇ Importer ]  [ ⬆ Exporter ]                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.3 Responsive design

#### Desktop (> 960px)
- Table complète avec toutes les colonnes
- Boutons côte à côte

#### Tablet (600px - 960px)
- Table avec colonnes réduites
- Boutons côte à côte

#### Mobile (< 600px)
- Table avec scroll horizontal
- Boutons empilés verticalement

---

## 3. Navigation et onglets

### 3.1 Barre de navigation

**Composant** : `SettingNavBar.tsx`

**Fichier** : `packages/registr_frontend/src/features/settings/components/SettingNavBar.tsx`

**Deux onglets** :
1. **Paramètres** : Gestion des options personnalisées
2. **Entreprise** : Informations de l'entreprise

**État** : `isParameter` (booléen)
- `true` : Onglet "Paramètres" actif
- `false` : Onglet "Entreprise" actif

**Changement d'onglet** :
```typescript
const [isParameter, setIsParameter] = useState(true);
```

### 3.2 Affichage conditionnel

**Onglet Paramètres** :
```typescript
{isParameter ? (
  <SettingsTable />
) : (
  <CompanyForm />
)}
```

**Onglet Entreprise** : Affiche le formulaire de l'entreprise (hors scope de ce document)

---

## 4. Tableau des paramètres

### 4.1 Composant

**Composant** : `SettingsTable.tsx`

**Fichier** : `packages/registr_frontend/src/features/settings/components/SettingsTable.tsx`

### 4.2 Colonnes du tableau

| Colonne | Description | Largeur |
|---------|-------------|---------|
| **Type** | Type de paramètre (ex: Finalité, Catégorie, Mesure) | Auto |
| **Nom** | Nom du paramètre (ex: "Certification ISO 27001") | Flexible |
| **Actions** | Boutons Modifier et Supprimer | Fixe (80px) |

### 4.3 Affichage des données

**Hook** : `useSettings`

**Fichier** : `packages/registr_frontend/src/features/settings/hooks/getSettings.ts`

**Paramètres** :
- `page` : Numéro de la page (1, 2, 3, ...)
- `pageSize` : Nombre d'éléments par page (25)
- `key` : Filtre par type (optionnel)

**Code** :
```typescript
const { data, isLoading } = useSettings({
  page,
  pageSize,
  key: typeFilter || undefined,
});

const settings = data?.data || [];
const totalCount = data?.meta.total || 0;
```

### 4.4 États d'affichage

#### État de chargement

**Condition** : `isLoading = true`

**Affichage** :
```
┌───────────────────────────────────────┐
│ Type    │ Nom         │ Actions       │
├───────────────────────────────────────┤
│         Chargement...                 │
└───────────────────────────────────────┘
```

#### État vide

**Condition** : `settings.length = 0` et `isLoading = false`

**Affichage** :
```
┌───────────────────────────────────────┐
│ Type    │ Nom         │ Actions       │
├───────────────────────────────────────┤
│         Aucune donnée                 │
└───────────────────────────────────────┘
```

#### État avec données

**Condition** : `settings.length > 0`

**Affichage** : Liste des paramètres avec actions

### 4.5 Style des lignes

**Hover** : Fond gris clair (`action.hover`)

**Cursor** : Pointer (main)

**Clic sur la ligne** : Ouvre le formulaire de modification

**Padding** : Réduit (`paddingY: 1`)

### 4.6 Affichage du type

**Style** :
- Couleur : Primaire (bleu #37BCF8)
- Poids : Bold
- Tooltip : Affiche le type complet au survol

**Traduction** : `t('settings:settingType.${setting.key}')`

**Exemples** :
- `customReasons` → "Finalité du traitement"
- `customCategories` → "Catégorie de personne"
- `customMeasures` → "Mesure de sécurité"

### 4.7 Affichage du nom

**Style** :
- Taille : Body2
- Overflow : Ellipsis (...)
- Largeur max : 300px
- Tooltip : Affiche le nom complet au survol

**Exemple** : "Certification ISO 27001 pour la sécurité..." (tronqué)

---

## 5. Filtrage par type

### 5.1 Composant de filtre

**Type** : Liste déroulante (Select)

**Position** : Au-dessus du tableau

**Label** : "Type"

**Options** :
- "Tous" (valeur vide)
- "Finalité du traitement"
- "Catégorie de personne"
- "Donnée Personnelle"
- "Information économique"
- "Source de données"
- "Base légale"
- "Donnée collectée"
- "Mesure de sécurité"
- "Type de traitement"

**État** : `typeFilter` (string)

**Code** :
```typescript
const [typeFilter, setTypeFilter] = useState<string>('');

const availableTypes = Object.values(KeysEnum);
```

### 5.2 Comportement du filtre

**Changement de filtre** :
```typescript
onChange={(e) => {
  setTypeFilter(e.target.value);
  setPage(1); // Retour à la page 1
}}
```

**Effet** : Recharge les données avec le filtre appliqué

**API** : `GET /api/v1/settings/all/?page=1&size=25&key=customMeasures`

### 5.3 Chip de filtre actif

**Condition d'affichage** : Si `typeFilter` n'est pas vide

**Affichage** :
```
[Type ▼]  [Mesure de sécurité ✕]
```

**Style** :
- Couleur : Primaire
- Variante : Outlined
- Taille : Small

**Action** : Clic sur la croix → Réinitialise le filtre

**Code** :
```typescript
{typeFilter && (
  <Chip
    label={t(`settings:settingType.${typeFilter}`)}
    onDelete={() => {
      setTypeFilter('');
      setPage(1);
    }}
    size="small"
    color="primary"
    variant="outlined"
  />
)}
```

---

## 6. Pagination

### 6.1 Composant de pagination

**Type** : Pagination Material-UI

**Position** : En bas du tableau

**Condition d'affichage** : Si `totalPages > 1`

**Style** :
- Couleur : Primaire
- Boutons : Première page, Dernière page

### 6.2 Calcul de la pagination

**Code** :
```typescript
const totalCount = data?.meta.total || 0;
const totalPages = Math.ceil(totalCount / pageSize);
```

**Exemple** :
- Total : 73 paramètres
- Taille de page : 25
- Nombre de pages : 3

### 6.3 Changement de page

**Code** :
```typescript
const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
  setPage(value);
};
```

**Effet** : Recharge les données pour la page sélectionnée

**API** : `GET /api/v1/settings/all/?page=2&size=25`

### 6.4 Affichage

```
┌─────────────────────────────────────────┐
│  [ ⏮ ] [ 1 ] [ 2 ] [ 3 ] ... [ 10 ] [ ⏭ ] │
└─────────────────────────────────────────┘
```

**Boutons** :
- ⏮ : Première page
- ⏭ : Dernière page
- 1, 2, 3 : Numéros de page
- ... : Ellipsis si trop de pages

---

## 7. Actions sur les paramètres

### 7.1 Vue d'ensemble

**Deux actions disponibles** :
1. **Modifier** : Icône crayon (✏️)
2. **Supprimer** : Icône poubelle (🗑️)

**Position** : Colonne "Actions" à droite du tableau

### 7.2 Bouton Modifier

**Icône** : `EditIcon`

**Tooltip** : "Editer"

**Style** :
- Taille : Small
- Hover : Fond secondaire (or), texte noir

**Action** : Ouvre le formulaire de modification en modale

**Code** :
```typescript
const handleEditClick = (settingToEdit: SettingType) => {
  const settingKey = settingToEdit.key as keyof typeof KeysEnum;
  setSetting({ ...settingToEdit, key: KeysEnum[settingKey] });
  setIsDeleteModal(false);
  openDialog();
};
```

**Propagation** : `e.stopPropagation()` pour éviter le clic sur la ligne

### 7.3 Bouton Supprimer

**Icône** : `DeleteIcon`

**Tooltip** : "Supprimer"

**Style** :
- Taille : Small
- Hover : Fond secondaire (or), texte noir

**Action** : Ouvre la modale de confirmation de suppression

**Code** :
```typescript
const handleDeleteClick = (settingToDelete: SettingType) => {
  const settingKey = settingToDelete.key as keyof typeof KeysEnum;
  setSetting({ ...settingToDelete, key: KeysEnum[settingKey] });
  setIsDeleteModal(true);
  openDialog();
};
```

**Propagation** : `e.stopPropagation()` pour éviter le clic sur la ligne

### 7.4 Clic sur la ligne

**Action** : Ouvre le formulaire de modification (même que le bouton Modifier)

**Code** :
```typescript
onClick={() => {
  handleEditClick(setting);
}}
```

**Utilité** : Facilite l'accès à la modification (zone cliquable plus grande)

---

## 8. Formulaire de création/modification

### 8.1 Composant

**Composant** : `SettingForm.tsx`

**Fichier** : `packages/registr_frontend/src/features/settings/components/SettingForm.tsx`

**Deux modes** :
1. **Création** : `setting` est vide ou undefined
2. **Modification** : `setting` contient les données existantes

### 8.2 Affichage en modale

**Type** : Dialog Material-UI

**Déclencheur** : Clic sur "Paramètre" ou sur une ligne du tableau

**Style** :
- Fond : Semi-transparent avec blur
- Bordure : Arrondie (19px)
- Padding : 40px

**Code** :
```typescript
<Dialog
  open={openAddDialog}
  onClose={() => closeDialog}
  PaperProps={{
    className: 'cardShadow',
    style: {
      backdropFilter: 'blur(3px)',
      backgroundColor: 'rgba(10, 17, 35, 0.70)',
      padding: '40px',
      borderRadius: '19px',
    },
  }}
>
```

### 8.3 Titre de la modale

**Texte** : "Paramètre"

**Traduction** : `t('settings:formName')`

### 8.4 Champs du formulaire

#### Champ 1 : Type

**Label** : "Type"

**Type** : Liste déroulante (Select)

**Options** : Tous les types de paramètres (KeysEnum)

**Valeur par défaut** :
- Création : `customCategories`
- Modification : Type du paramètre existant

**Traduction** : `t('settings:settingType.${key}')`

**Code** :
```typescript
<Select
  value={field.state.value}
  onChange={(e) => field.handleChange(e.target.value as KeysEnum)}
>
  {Object.values(KeysEnum).map((key) => (
    <MenuItem key={key} value={key}>
      {t(`settings:settingType.${key}`)}
    </MenuItem>
  ))}
</Select>
```

#### Champ 2 : Nom

**Label** : "Nom"

**Type** : Champ texte (TextField)

**Valeur par défaut** :
- Création : Vide
- Modification : Nom du paramètre existant

**Validation** : Minimum 2 caractères

**Message d'erreur** : "Un nom est requis"

**Code** :
```typescript
<TextField
  fullWidth
  label={t('settings:form.name.label')}
  value={field.state.value}
  onChange={(e) => field.handleChange(e.target.value)}
  error={!!field.state.meta.errors?.length}
  helperText={field.state.meta.errors?.join(', ')}
/>
```

### 8.5 Validation

**Schéma Zod** : `useSettingSchema`

**Fichier** : `packages/registr_frontend/src/features/settings/schema/setting.schema.ts`

**Règles** :
- `key` : Enum (obligatoire)
- `name` : String, minimum 2 caractères (obligatoire)

**Code** :
```typescript
export const useSettingSchema = () => {
  const { t } = useTranslation(['settings']);

  return z.object({
    key: z.nativeEnum(KeysEnum),
    name: z.string().min(2, t('form.validations.name.required')),
  });
};
```

### 8.6 Soumission du formulaire

**Hooks** :
- Création : `useCreateSetting`
- Modification : `useUpdateSetting`

**Code** :
```typescript
onSubmit: async ({ value }) => {
  try {
    if (!setting?.name) {
      // Création
      await addSetting.mutateAsync(value);
    } else {
      // Modification
      await updateSetting.mutateAsync({ ...value, oldName: setting.name });
    }
    setSetting();
    closeDialog();
    notif.show(t('settings:form.parameter.success'), {
      severity: 'success',
    });
  } catch (error) {
    console.error(error);
    notif.show(t('settings:form.parameter.error'), {
      severity: 'error',
    });
  }
}
```

**Notification** :
- Succès : "Le paramètre a été enregistré avec succès"
- Erreur : "Une erreur est survenue lors de l'enregistrement"

### 8.7 Boutons de la modale

**Bouton Annuler** :
- Position : Bas gauche
- Action : Ferme la modale sans sauvegarder
- Texte : "Annuler"

**Bouton Enregistrer** :
- Position : Bas droite
- Action : Soumet le formulaire
- Texte : "Enregistrer"
- Style : Contained, fond secondaire (or)
- Type : Submit (form="settingForm")

---

## 9. Suppression d'un paramètre

### 9.1 Modale de confirmation

**Déclencheur** : Clic sur l'icône poubelle

**Affichage** : Modale avec message de confirmation

**Message** : "Êtes-vous sûr de vouloir supprimer cet élément ?"

**Traduction** : `t('common:confirmDeleteQuestion')`

### 9.2 Boutons de confirmation

**Bouton Annuler** :
- Position : Bas gauche
- Action : Ferme la modale sans supprimer
- Texte : "Annuler"

**Bouton Supprimer** :
- Position : Bas droite
- Action : Supprime le paramètre
- Texte : "Supprimer"
- Style : Contained, fond secondaire (or)

### 9.3 Suppression

**Hook** : `useDeleteSetting`

**Fichier** : `packages/registr_frontend/src/features/settings/hooks/deleteSetting.ts`

**Code** :
```typescript
const handleDeleteEl = async () => {
  try {
    await deleteSetting.mutateAsync(setting as SettingType);
    setIsDeleteModal(false);
    setSetting({ name: '', key: KeysEnum.customCategories });
    closeDialog();
  } catch (error) {
    console.error('Error deleting setting:', error);
  }
};
```

**Effet** :
- Supprime le paramètre de la base de données
- Invalide le cache React Query
- Recharge le tableau
- Ferme la modale

**API** : `DELETE /api/v1/settings/delete`

---

## 10. Import/Export

### 10.1 Boutons Import/Export

**Position** : En bas de la page, sous le tableau

**Deux boutons** :
1. **Importer** : Icône téléchargement vers le bas
2. **Exporter** : Icône téléchargement vers le haut

**Style** :
- Variante : Contained
- Classe : `export-button-custom`
- Espacement : Gap de 16px

### 10.2 Export de paramètres

**Bouton** : "Exporter"

**Icône** : `FileUploadIcon`

**Action** : Télécharge un fichier JSON avec tous les paramètres

**Fonction** : `handleExportSettingsJsonFile()`

**Fichier** : `packages/registr_frontend/src/features/settings/utils/downloadJSONfile.ts`

**Code** :
```typescript
const handleExportJson = async () => {
  try {
    handleExportSettingsJsonFile();
    notif.show(t('settings:exportSuccess'), {
      severity: 'success',
      autoHideDuration: 3000,
    });
  } catch (error) {
    console.error('Error exporting settings:', error);
    notif.show(t('settings:exportError'), {
      severity: 'error',
      autoHideDuration: 3000,
    });
  }
};
```

**Notification** :
- Succès : "Paramètres exportés avec succès"
- Erreur : "Erreur lors de l'exportation des paramètres"

**Format du fichier** : JSON (voir section Structure des données)

### 10.3 Import de paramètres

**Bouton** : "Importer"

**Icône** : `FileDownloadIcon`

**Type** : Input file masqué

**Formats acceptés** :
- `application/json`
- `text/plain`

**Code** :
```typescript
const authorizedFileTypes = ['application/json', 'text/plain'];

const handleImportJson = async (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!authorizedFileTypes.includes(file.type)) {
    notif.show(t('settings:fileTypeError'), {
      severity: 'error',
      autoHideDuration: 3000,
    });
    return;
  }

  try {
    await baseFetch('/api/v1/settings/import', {
      method: 'POST',
      body: await file.text(),
    });

    await queryClient.resetQueries();
    await queryClient.invalidateQueries({
      queryKey: ['setting'],
      refetchType: 'all',
    });
    notif.show(t('settings:importSuccess'), {
      severity: 'success',
      autoHideDuration: 3000,
    });
  } catch {
    notif.show(t('settings:importError'), {
      severity: 'error',
      autoHideDuration: 3000,
    });
    event.target.value = '';
  }
};
```

**Notifications** :
- Succès : "Paramètres importés avec succès"
- Erreur : "Erreur lors de l'importation des paramètres"
- Type invalide : "Type de fichier non autorisé. Veuillez utiliser un fichier JSON ou TXT."

**Effet** :
- Remplace tous les paramètres existants
- Réinitialise le cache React Query
- Recharge toutes les données

**API** : `POST /api/v1/settings/import`

---

## 11. Structure des données

### 11.1 Type SettingType

**Fichier** : `packages/registr_frontend/src/features/settings/types/setting.type.ts`

```typescript
export type SettingType = {
  key: string;
  name: string;
};
```

### 11.2 Type SettingFormData

**Fichier** : `packages/registr_frontend/src/features/settings/schema/setting.schema.ts`

```typescript
export type SettingFormData = {
  key: KeysEnum;
  name: string;
  oldName?: string; // Pour la modification
};
```

### 11.3 Enum KeysEnum

**Fichier** : `packages/registr_frontend/src/features/settings/schema/setting.schema.ts`

```typescript
export enum KeysEnum {
  customCategories = 'customCategories',
  customDataAccess = 'customDataAccess',
  customEconomicInformation = 'customEconomicInformation',
  customLegalBase = 'customLegalBase',
  customMeasures = 'customMeasures',
  customDataSources = 'customDataSources',
  customPersonalData = 'customPersonalData',
  customReasons = 'customReasons',
  customSharedDataAccess = 'customSharedDataAccess',
  customTreatmentTypes = 'customTreatmentTypes',
}
```

### 11.4 Réponse API (liste)

**Type** : `GetResponse`

**Fichier** : `packages/registr_frontend/src/features/settings/hooks/getSettings.ts`

```typescript
export type GetResponse = {
  data: { key: string; name: string }[];
  meta: {
    total: number;
  };
};
```

**Exemple** :
```json
{
  "data": [
    {
      "key": "customMeasures",
      "name": "Certification ISO 27001"
    },
    {
      "key": "customReasons",
      "name": "Intérêt légitime"
    },
    {
      "key": "customCategories",
      "name": "Candidats"
    }
  ],
  "meta": {
    "total": 73
  }
}
```

### 11.5 Format d'export JSON

**Structure** :
```json
{
  "settings": [
    {
      "key": "customMeasures",
      "name": "Certification ISO 27001"
    },
    {
      "key": "customMeasures",
      "name": "Surveillance 24/7"
    },
    {
      "key": "customReasons",
      "name": "Intérêt légitime"
    }
  ],
  "exportDate": "2026-02-18T10:30:00Z",
  "version": "1.0"
}
```

---

## 12. Intégration API

### 12.1 GET /api/v1/settings/all

**Description** : Récupère la liste des paramètres avec pagination et filtrage

**Paramètres** :
- `page` : Numéro de la page (1, 2, 3, ...)
- `size` : Nombre d'éléments par page (25)
- `key` : Filtre par type (optionnel)

**Requête** :
```http
GET /api/v1/settings/all/?page=1&size=25&key=customMeasures HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Accept: application/json
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": [
    {
      "key": "customMeasures",
      "name": "Certification ISO 27001"
    },
    {
      "key": "customMeasures",
      "name": "Surveillance 24/7"
    }
  ],
  "meta": {
    "total": 15
  }
}
```

### 12.2 POST /api/v1/settings/add

**Description** : Crée un nouveau paramètre

**Requête** :
```http
POST /api/v1/settings/add HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "customMeasures",
  "name": "Plan de continuité d'activité"
}
```

**Réponse** :
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "key": "customMeasures",
  "name": "Plan de continuité d'activité"
}
```

### 12.3 PATCH /api/v1/settings/update

**Description** : Met à jour un paramètre existant

**Requête** :
```http
PATCH /api/v1/settings/update HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "customMeasures",
  "name": "Plan de continuité d'activité (PCA)",
  "oldName": "Plan de continuité d'activité"
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "key": "customMeasures",
  "name": "Plan de continuité d'activité (PCA)"
}
```

### 12.4 DELETE /api/v1/settings/delete

**Description** : Supprime un paramètre

**Requête** :
```http
DELETE /api/v1/settings/delete HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "key": "customMeasures",
  "name": "Plan de continuité d'activité (PCA)"
}
```

**Réponse** :
```http
HTTP/1.1 204 No Content
```

### 12.5 POST /api/v1/settings/import

**Description** : Importe des paramètres depuis un fichier JSON

**Requête** :
```http
POST /api/v1/settings/import HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Content-Type: application/json

{
  "settings": [
    {
      "key": "customMeasures",
      "name": "Certification ISO 27001"
    },
    ...
  ]
}
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Settings imported successfully",
  "count": 25
}
```

### 12.6 GET /api/v1/settings/export

**Description** : Exporte tous les paramètres en JSON

**Requête** :
```http
GET /api/v1/settings/export HTTP/1.1
Host: api.registr.app
Authorization: Bearer <token>
Accept: application/json
```

**Réponse** :
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Disposition: attachment; filename="settings-2026-02-18.json"

{
  "settings": [...],
  "exportDate": "2026-02-18T10:30:00Z",
  "version": "1.0"
}
```

---

## 13. Règles de gestion

### 13.1 Règles de création

#### RG-C1 : Unicité du nom par type

**Règle** : Un nom de paramètre doit être unique pour un type donné.

**Exemple** : On ne peut pas avoir deux paramètres "Certification ISO 27001" de type `customMeasures`.

**Validation** : Côté backend

#### RG-C2 : Nom minimum

**Règle** : Le nom doit contenir au moins 2 caractères.

**Validation** : Côté client (Zod) et backend

#### RG-C3 : Type obligatoire

**Règle** : Le type doit être sélectionné parmi les valeurs de l'enum.

**Validation** : Côté client (Zod) et backend

### 13.2 Règles de modification

#### RG-M1 : Modification du nom uniquement

**Règle** : Seul le nom peut être modifié, pas le type.

**Raison** : Changer le type pourrait causer des incohérences dans les traitements existants.

**Note** : Le type est modifiable dans le formulaire mais devrait être désactivé en modification.

#### RG-M2 : Conservation de l'ancien nom

**Règle** : L'ancien nom (`oldName`) est envoyé au backend pour identifier le paramètre à modifier.

**Code** :
```typescript
await updateSetting.mutateAsync({ 
  key: value.key,
  name: value.name,
  oldName: setting.name 
});
```

### 13.3 Règles de suppression

#### RG-S1 : Confirmation obligatoire

**Règle** : La suppression nécessite une confirmation de l'utilisateur.

**Raison** : Éviter les suppressions accidentelles.

#### RG-S2 : Impact sur les traitements

**Règle** : La suppression d'un paramètre utilisé dans des traitements peut causer des problèmes.

**Recommandation** : Vérifier l'utilisation avant de supprimer (non implémenté actuellement).

### 13.4 Règles de pagination

#### RG-P1 : Taille de page fixe

**Règle** : La taille de page est fixée à 25 éléments.

**Raison** : Équilibre entre performance et UX.

#### RG-P2 : Retour à la page 1

**Règle** : Lors d'un changement de filtre, retour automatique à la page 1.

**Code** :
```typescript
setTypeFilter(e.target.value);
setPage(1);
```

### 13.5 Règles d'import/export

#### RG-IE1 : Format JSON uniquement

**Règle** : Seuls les fichiers JSON ou TXT sont acceptés pour l'import.

**Validation** : Côté client (type MIME)

#### RG-IE2 : Remplacement complet

**Règle** : L'import remplace tous les paramètres existants.

**Attention** : Perte des paramètres actuels si non exportés au préalable.

---

## 14. Internationalisation

### 14.1 Clés de traduction

**Namespace** : `settings`

**Fichier** : `packages/registr_frontend/public/locales/fr/settings.json`

| Clé | Français | Anglais |
|-----|----------|---------|
| `create` | Paramètre | Setting |
| `tableTitle` | Paramètres | Settings |
| `parameter` | Paramètres | Settings |
| `entity` | Entité | Entity |
| `importFile` | Importer | Import |
| `exportFile` | Exporter | Export |
| `importSuccess` | Paramètres importés avec succès | Settings imported successfully |
| `importError` | Erreur lors de l'importation des paramètres | Error importing settings |
| `exportSuccess` | Paramètres exportés avec succès | Settings exported successfully |
| `exportError` | Erreur lors de l'exportation des paramètres | Error exporting settings |
| `fileTypeError` | Type de fichier non autorisé. Veuillez utiliser un fichier JSON ou TXT. | Invalid file type. Please use a JSON or TXT file. |
| `formName` | Paramètre | Setting |

### 14.2 Colonnes du tableau

| Clé | Français | Anglais |
|-----|----------|---------|
| `columns.name` | Nom | Name |
| `columns.type` | Type | Type |

### 14.3 Types de paramètres

| Clé | Français | Anglais |
|-----|----------|---------|
| `settingType.customEconomicInformation` | Information économique | Economic Information |
| `settingType.customDataSources` | Source de données | Data Source |
| `settingType.customLegalBase` | Base légale | Legal Basis |
| `settingType.customCategories` | Catégorie de personne | Data Subject Category |
| `settingType.customDataAccess` | Donnée collectée | Collected Data |
| `settingType.customMeasures` | Mesure de sécurité | Security Measure |
| `settingType.customPersonalData` | Donnée Personnelle | Personal Data |
| `settingType.customReasons` | Finalité du traitement | Processing Purpose |
| `settingType.customSharedData` | Donnée partagée | Shared Data |
| `settingType.customSharedDataAccess` | Donnée partagée | Shared Data |
| `settingType.customTreatmentTypes` | Type de traitement | Treatment Type |

### 14.4 Formulaire

| Clé | Français | Anglais |
|-----|----------|---------|
| `form.name.label` | Nom | Name |
| `form.key.label` | Type | Type |
| `form.parameter.success` | Le paramètre a été enregistré avec succès | Setting saved successfully |
| `form.parameter.error` | Une erreur est survenue lors de l'enregistrement | An error occurred while saving |
| `form.actions.edit` | Editer | Edit |
| `form.actions.delete` | Supprimer | Delete |
| `form.validations.name.required` | Un nom est requis | A name is required |

### 14.5 Clés communes

**Namespace** : `common`

| Clé | Français | Anglais |
|-----|----------|---------|
| `common:all` | Tous | All |
| `common:loading` | Chargement... | Loading... |
| `common:noData` | Aucune donnée | No data |
| `common:save` | Enregistrer | Save |
| `common:cancel` | Annuler | Cancel |
| `common:delete` | Supprimer | Delete |
| `common:confirmDeleteQuestion` | Êtes-vous sûr de vouloir supprimer cet élément ? | Are you sure you want to delete this item? |

---

## 15. Accessibilité

### 15.1 Navigation au clavier

#### Tableau

- Tab : Navigation entre les lignes
- Entrée : Ouvre le formulaire de modification

#### Boutons d'action

- Tab : Navigation entre les boutons
- Entrée ou Espace : Exécution de l'action

#### Filtre

- Tab : Focus sur la liste déroulante
- Flèches haut/bas : Navigation dans les options
- Entrée : Sélection

#### Pagination

- Tab : Navigation entre les boutons de page
- Entrée : Changement de page

### 15.2 Lecteurs d'écran

#### Attributs ARIA

**Tableau** :
- `role="table"`
- `aria-label="Tableau des paramètres"`

**Lignes** :
- `role="row"`
- `aria-label="Type: Mesure de sécurité, Nom: Certification ISO 27001"`

**Boutons d'action** :
- `aria-label="Modifier le paramètre Certification ISO 27001"`
- `aria-label="Supprimer le paramètre Certification ISO 27001"`

**Filtre** :
- `aria-label="Filtrer par type"`

**Modale** :
- `role="dialog"`
- `aria-labelledby="dialog-title"`
- `aria-modal="true"`

#### Annonces vocales

**Chargement** :
- Annonce : "Chargement des paramètres"

**Filtre appliqué** :
- Annonce : "Filtre appliqué : Mesure de sécurité"

**Paramètre créé** :
- Annonce : "Le paramètre a été enregistré avec succès"

**Paramètre supprimé** :
- Annonce : "Le paramètre a été supprimé"

### 15.3 Contraste et visibilité

#### Ratios de contraste (WCAG AA)

**Texte normal** : Minimum 4.5:1
- Texte blanc sur fond sombre : ✅ Conforme

**Texte du type** : Minimum 3:1
- Texte bleu sur fond sombre : ✅ Conforme

**Icônes** : Minimum 3:1
- Icônes blanches sur fond sombre : ✅ Conforme

#### États de focus

**Tous les éléments interactifs** :
- Outline : 2px solid bleu primaire
- Offset : 2px

**Hover** :
- Fond : Gris clair (`action.hover`)
- Boutons : Fond secondaire (or)

### 15.4 Responsive design

#### Desktop (> 960px)
- Tableau complet
- Colonnes visibles
- Pagination horizontale

#### Tablet (600px - 960px)
- Tableau avec scroll horizontal si nécessaire
- Colonnes réduites
- Pagination horizontale

#### Mobile (< 600px)
- Tableau avec scroll horizontal
- Colonnes minimales
- Pagination verticale (optionnel)

---

## 16. Cas d'usage détaillés

### 16.1 Cas d'usage 1 : Création d'un nouveau paramètre

**Contexte** : Un administrateur veut ajouter "Conformité PCI-DSS" comme mesure de sécurité.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur "Paramètre" (bouton en haut à droite)
3. Une modale s'ouvre
4. Il sélectionne "Mesure de sécurité" dans le champ Type
5. Il saisit "Conformité PCI-DSS" dans le champ Nom
6. Il clique sur "Enregistrer"
7. Requête `POST /api/v1/settings/add`
8. Notification de succès : "Le paramètre a été enregistré avec succès"
9. La modale se ferme
10. Le tableau se recharge
11. "Conformité PCI-DSS" apparaît dans la liste

### 16.2 Cas d'usage 2 : Modification d'un paramètre

**Contexte** : Un administrateur veut renommer "ISO 27001" en "Certification ISO 27001".

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur la ligne "ISO 27001" (ou sur l'icône crayon)
3. Une modale s'ouvre avec les données existantes
4. Le champ Type affiche "Mesure de sécurité" (non modifiable)
5. Le champ Nom affiche "ISO 27001"
6. Il modifie le nom en "Certification ISO 27001"
7. Il clique sur "Enregistrer"
8. Requête `PATCH /api/v1/settings/update` avec `oldName: "ISO 27001"`
9. Notification de succès
10. La modale se ferme
11. Le tableau se recharge
12. "Certification ISO 27001" apparaît dans la liste

### 16.3 Cas d'usage 3 : Suppression d'un paramètre

**Contexte** : Un administrateur veut supprimer "Mesure obsolète".

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur l'icône poubelle à côté de "Mesure obsolète"
3. Une modale de confirmation s'ouvre
4. Message : "Êtes-vous sûr de vouloir supprimer cet élément ?"
5. Il clique sur "Supprimer"
6. Requête `DELETE /api/v1/settings/delete`
7. La modale se ferme
8. Le tableau se recharge
9. "Mesure obsolète" n'apparaît plus dans la liste

### 16.4 Cas d'usage 4 : Filtrage par type

**Contexte** : Un administrateur veut voir uniquement les mesures de sécurité.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur la liste déroulante "Type"
3. Il sélectionne "Mesure de sécurité"
4. Un chip "Mesure de sécurité ✕" apparaît
5. Le tableau se recharge avec uniquement les mesures de sécurité
6. Requête `GET /api/v1/settings/all/?page=1&size=25&key=customMeasures`
7. Seules les mesures de sécurité sont affichées

**Réinitialisation du filtre** :
8. Il clique sur la croix du chip
9. Le filtre est réinitialisé
10. Le tableau affiche tous les paramètres

### 16.5 Cas d'usage 5 : Pagination

**Contexte** : Il y a 73 paramètres, répartis sur 3 pages.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. La page 1 affiche 25 paramètres
3. La pagination affiche : [ 1 ] [ 2 ] [ 3 ]
4. Il clique sur [ 2 ]
5. Requête `GET /api/v1/settings/all/?page=2&size=25`
6. La page 2 affiche 25 paramètres (26-50)
7. Il clique sur [ 3 ]
8. La page 3 affiche 23 paramètres (51-73)

### 16.6 Cas d'usage 6 : Export de paramètres

**Contexte** : Un administrateur veut sauvegarder tous les paramètres.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur "Exporter"
3. Requête `GET /api/v1/settings/export`
4. Téléchargement d'un fichier `settings-2026-02-18.json`
5. Notification de succès : "Paramètres exportés avec succès"

### 16.7 Cas d'usage 7 : Import de paramètres

**Contexte** : Un administrateur veut restaurer des paramètres depuis un fichier.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur "Importer"
3. Une fenêtre de sélection de fichier s'ouvre
4. Il sélectionne `settings-2026-02-18.json`
5. Validation du type de fichier
6. Requête `POST /api/v1/settings/import` avec le contenu du fichier
7. Réinitialisation du cache React Query
8. Rechargement de toutes les données
9. Notification de succès : "Paramètres importés avec succès"
10. Le tableau affiche les paramètres importés

### 16.8 Cas d'usage 8 : Erreur de validation

**Contexte** : Un administrateur essaie de créer un paramètre avec un nom trop court.

**Étapes** :
1. L'utilisateur accède à `/dashboard/settings`
2. Il clique sur "Paramètre"
3. Il sélectionne "Mesure de sécurité"
4. Il saisit "A" dans le champ Nom (1 caractère)
5. Il clique sur "Enregistrer"
6. Validation Zod échoue
7. Message d'erreur sous le champ : "Un nom est requis" (min 2 caractères)
8. Le formulaire reste ouvert
9. Il corrige en saisissant "Audit"
10. Il clique sur "Enregistrer"
11. Validation réussie, paramètre créé

---

## 17. Maquettes et wireframes

### 17.1 Vue d'ensemble de la page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [ Paramètres ]  [ Entreprise ]                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                                       [ + Paramètre ]      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Filtre : [Type ▼]  [Mesure de sécurité ✕]                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Type              │ Nom                        │ Actions  │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Finalité du       │ Intérêt légitime           │ ✏️ 🗑️   │ │
│  │ traitement        │                            │          │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Catégorie de      │ Candidats                  │ ✏️ 🗑️   │ │
│  │ personne          │                            │          │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Mesure de         │ Certification ISO 27001    │ ✏️ 🗑️   │ │
│  │ sécurité          │                            │          │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ Mesure de         │ Surveillance 24/7          │ ✏️ 🗑️   │ │
│  │ sécurité          │                            │          │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │ ...               │ ...                        │ ...      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  [ ⏮ ] [ 1 ] [ 2 ] [ 3 ] ... [ 10 ] [ ⏭ ]                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  [ ⬇ Importer ]  [ ⬆ Exporter ]                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 17.2 Modale de création/modification

```
                    ┌───────────────────────────────────────────┐
                    │  Paramètre                             ✕  │
                    ├───────────────────────────────────────────┤
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Type                                │ │
                    │  │ [Mesure de sécurité ▼]              │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │  ┌─────────────────────────────────────┐ │
                    │  │ Nom                                 │ │
                    │  │ Certification ISO 27001             │ │
                    │  └─────────────────────────────────────┘ │
                    │                                           │
                    │                                           │
                    │  [ Annuler ]              [ Enregistrer ] │
                    └───────────────────────────────────────────┘
```

### 17.3 Modale de suppression

```
                    ┌───────────────────────────────────────────┐
                    │  Paramètre                             ✕  │
                    ├───────────────────────────────────────────┤
                    │                                           │
                    │  Êtes-vous sûr de vouloir supprimer       │
                    │  cet élément ?                            │
                    │                                           │
                    │                                           │
                    │  [ Annuler ]              [ Supprimer ]   │
                    └───────────────────────────────────────────┘
```

### 17.4 État de chargement

```
┌─────────────────────────────────────────────────────────────────┐
│ Type              │ Nom                        │ Actions        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     Chargement...                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 17.5 État vide

```
┌─────────────────────────────────────────────────────────────────┐
│ Type              │ Nom                        │ Actions        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                     Aucune donnée                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 18. Annexes

### 18.1 Récapitulatif des fichiers

#### Frontend

| Fichier | Description |
|---------|-------------|
| `src/features/settings/pages/SettingsPage.tsx` | Page principale |
| `src/features/settings/components/SettingsTable.tsx` | Tableau des paramètres |
| `src/features/settings/components/SettingForm.tsx` | Formulaire de création/modification |
| `src/features/settings/components/SettingNavBar.tsx` | Navigation entre onglets |
| `src/features/settings/hooks/getSettings.ts` | Hook pour récupérer les paramètres |
| `src/features/settings/hooks/addSetting.ts` | Hook pour créer un paramètre |
| `src/features/settings/hooks/updateSetting.ts` | Hook pour modifier un paramètre |
| `src/features/settings/hooks/deleteSetting.ts` | Hook pour supprimer un paramètre |
| `src/features/settings/schema/setting.schema.ts` | Schéma de validation Zod |
| `src/features/settings/types/setting.type.ts` | Types TypeScript |
| `src/features/settings/utils/downloadJSONfile.ts` | Fonction d'export JSON |

### 18.2 Tableau récapitulatif des actions

| Action | Endpoint | Méthode | Hook |
|--------|----------|---------|------|
| **Lister** | `/api/v1/settings/all` | GET | `useSettings` |
| **Créer** | `/api/v1/settings/add` | POST | `useCreateSetting` |
| **Modifier** | `/api/v1/settings/update` | PATCH | `useUpdateSetting` |
| **Supprimer** | `/api/v1/settings/delete` | DELETE | `useDeleteSetting` |
| **Exporter** | `/api/v1/settings/export` | GET | `handleExportSettingsJsonFile` |
| **Importer** | `/api/v1/settings/import` | POST | `handleImportJson` |

### 18.3 Exemples de paramètres par type

#### customReasons (Finalités)
- Intérêt légitime
- Consentement
- Obligation légale
- Exécution d'un contrat

#### customCategories (Catégories de personnes)
- Candidats
- Employés
- Clients
- Fournisseurs

#### customMeasures (Mesures de sécurité)
- Certification ISO 27001
- Surveillance 24/7
- Plan de continuité d'activité
- Conformité PCI-DSS

#### customPersonalData (Données personnelles)
- Données biométriques
- Données de localisation
- Données de santé

#### customTreatmentTypes (Types de traitement)
- RH
- Marketing
- Commercial
- Comptabilité

### 18.4 Checklist de développement

**Avant de déployer la page de paramètres** :

☐ **Affichage du tableau**
   - Colonnes : Type, Nom, Actions
   - Données chargées depuis l'API
   - États : Chargement, Vide, Avec données

☐ **Filtrage**
   - Liste déroulante des types
   - Chip de filtre actif
   - Réinitialisation du filtre

☐ **Pagination**
   - Affichage si plus d'une page
   - Changement de page fonctionnel
   - Boutons Première/Dernière page

☐ **Actions**
   - Bouton Modifier : Ouvre le formulaire
   - Bouton Supprimer : Ouvre la confirmation
   - Clic sur la ligne : Ouvre le formulaire

☐ **Formulaire**
   - Champ Type : Liste déroulante
   - Champ Nom : Validation (min 2 caractères)
   - Bouton Enregistrer : Crée ou modifie
   - Bouton Annuler : Ferme sans sauvegarder

☐ **Suppression**
   - Modale de confirmation
   - Bouton Supprimer : Supprime le paramètre
   - Bouton Annuler : Ferme sans supprimer

☐ **Import/Export**
   - Bouton Exporter : Télécharge JSON
   - Bouton Importer : Upload JSON
   - Validation du type de fichier
   - Notifications de succès/erreur

☐ **Responsive**
   - Desktop : OK
   - Tablet : OK
   - Mobile : OK

☐ **Accessibilité**
   - Navigation au clavier
   - Lecteurs d'écran
   - Contraste
   - Focus visible

☐ **Traductions**
   - Français : OK
   - Anglais : OK

☐ **Tests**
   - Création d'un paramètre
   - Modification d'un paramètre
   - Suppression d'un paramètre
   - Filtrage par type
   - Pagination
   - Import/Export

### 18.5 Bonnes pratiques

✅ **Validation** : Valider côté client (Zod) et côté serveur

✅ **Confirmation** : Demander confirmation avant suppression

✅ **Notifications** : Afficher des messages de succès/erreur

✅ **Cache** : Invalider le cache après chaque mutation

✅ **Accessibilité** : Navigation au clavier, lecteurs d'écran, contraste

✅ **Responsive** : Adapter l'affichage à tous les écrans

✅ **Traductions** : Utiliser i18next pour toutes les chaînes

✅ **Erreurs** : Gérer les erreurs avec try/catch

✅ **Performance** : Pagination pour limiter les données chargées

✅ **UX** : Hover, cursor pointer, tooltips

### 18.6 Erreurs à éviter

❌ **Pas de confirmation** : Ne pas supprimer sans confirmation

❌ **Pas de validation** : Ne pas accepter des noms vides ou trop courts

❌ **Pas de notification** : Ne pas laisser l'utilisateur sans retour

❌ **Pas d'invalidation** : Ne pas oublier d'invalider le cache après mutation

❌ **Pas de gestion d'erreur** : Ne pas ignorer les erreurs API

❌ **Pas de responsive** : Ne pas oublier les petits écrans

❌ **Texte hardcodé** : Ne pas mettre de texte en dur, utiliser i18next

❌ **Pas de pagination** : Ne pas charger tous les paramètres d'un coup

---

**Fin du document**

Ce document fournit toutes les informations nécessaires pour implémenter la page de gestion des paramètres dans n'importe quel framework frontend.
