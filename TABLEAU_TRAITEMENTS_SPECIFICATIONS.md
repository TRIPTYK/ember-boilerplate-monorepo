# Spécifications Techniques - Tableau des Traitements

## Table des matières

1. [Vue d'ensemble et contexte métier](#1-vue-densemble-et-contexte-métier)
2. [Architecture et structure des données](#2-architecture-et-structure-des-données)
3. [Fonctionnalités du tableau](#3-fonctionnalités-du-tableau)
4. [Aspects techniques d'implémentation](#4-aspects-techniques-dimplémentation)
5. [Intégration avec le backend](#5-intégration-avec-le-backend)
6. [Gestion d'état et cache](#6-gestion-détat-et-cache)
7. [Internationalisation](#7-internationalisation)
8. [Accessibilité et UX](#8-accessibilité-et-ux)

---

## 1. Vue d'ensemble et contexte métier

### 1.1 Contexte RGPD

Le tableau des traitements est au cœur de l'application **Registr Frontend**, qui permet aux organisations de gérer leur conformité RGPD. Un **traitement de données personnelles** représente toute opération effectuée sur des données personnelles (collecte, stockage, utilisation, partage, suppression).

### 1.2 Objectif du tableau

Le tableau des traitements permet de :
- **Visualiser** l'ensemble des traitements de données personnelles de l'organisation
- **Gérer** le cycle de vie des traitements (brouillon, validé, archivé)
- **Organiser** les traitements par ordre de priorité via drag & drop
- **Filtrer** les traitements par type et statut
- **Identifier rapidement** les traitements contenant des données sensibles
- **Accéder** aux actions de consultation, modification et archivage

### 1.3 Utilisateurs cibles

- **Délégués à la Protection des Données (DPO)**
- **Responsables de la conformité RGPD**
- **Responsables de traitement**
- **Équipes juridiques et de sécurité**

---

## 2. Architecture et structure des données

### 2.1 Modèle de données principal

#### Treatment (Interface principale)

```typescript
interface Treatment {
  id: string;                    // Identifiant unique
  updateDate: string;            // Date de dernière modification (ISO 8601)
  creationDate: string;          // Date de création (ISO 8601)
  status: TreatmentStatus;       // Statut du traitement
  isOverDueDate?: boolean;       // Indicateur de dépassement de date
  order: number;                 // Ordre d'affichage (pour drag & drop)
  data: TreatmentData;           // Données détaillées du traitement
}
```

#### TreatmentStatus (Enum)

```typescript
enum TreatmentStatus {
  DRAFT = 'draft',           // Brouillon - en cours de création
  VALIDATED = 'validated',   // Validé - traitement finalisé
  ARCHIVED = 'archived',     // Archivé - traitement désactivé
}
```

#### TreatmentData (Données détaillées)

```typescript
interface TreatmentData {
  // Informations générales
  title: string;                    // Titre du traitement
  description?: string;             // Description détaillée
  treatmentType: string;            // Type de traitement (personnalisable)
  reasons: string[];                // Finalités principales
  creationDate: string;             // Date de création
  
  // Responsable du traitement
  responsible?: {
    fullName: string;               // Nom complet du responsable
    entityNumber?: string;          // Numéro d'entité
    address: Address;               // Adresse complète
  };
  
  // Délégué à la Protection des Données
  hasDPO: boolean;                  // Présence d'un DPO
  hasExternalDPO: boolean;          // DPO externe ou interne
  DPO?: {
    fullName: string;
    address: Address;
  };
  
  // Finalités détaillées
  subReasons: SubReasons;           // Sous-finalités personnalisées
  
  // Données collectées
  personalDataGroup?: {
    data: { name: SensitiveDataType[] };
    conservationDuration: string;
  };
  financialDataGroup?: {
    data: { name: SensitiveDataType[] };
    conservationDuration: string;
  };
  
  // Sources et catégories
  dataSources?: DataSource[];       // Sources de collecte
  subjectCategories?: DataSource[]; // Catégories de personnes concernées
  
  // Partage et accès
  dataAccess?: DataSource[];        // Qui a accès aux données
  sharedData?: DataSource[];        // Avec qui les données sont partagées
  
  // Transferts internationaux
  areDataExportedOutsideEU: boolean;
  recipient?: Recipient;            // Destinataire hors UE
  
  // Sécurité et conformité
  securitySetup?: SecurityMeasure[];
  legalBase?: LegalBase[];          // Bases légales du traitement
  externalOrganizationDPO?: Contact;
}
```

#### SensitiveDataType (Données sensibles)

```typescript
type SensitiveDataType = {
  name: string;           // Nom de la donnée
  isSensitive: boolean;   // Marqueur de sensibilité
};
```

### 2.2 Hiérarchie des composants

```
TreatmentsTable (Composant parent)
  └── DraggableTreatmentsTable (Composant de présentation)
      ├── Filtres et contrôles
      │   ├── Select (Filtre par type)
      │   ├── Chip (Affichage du filtre actif)
      │   └── Switch (Inclure les archivés)
      ├── DndContext (Contexte drag & drop)
      │   └── SortableContext
      │       └── Table (MUI)
      │           ├── TableHead (En-têtes de colonnes)
      │           └── TableBody
      │               └── DraggableRow (Ligne draggable)
      │                   ├── Cellule drag handle
      │                   ├── Cellule numéro
      │                   ├── Cellule titre
      │                   ├── Cellule type (éditable inline)
      │                   ├── Cellule finalités
      │                   ├── Cellule statut
      │                   ├── Cellule données sensibles
      │                   ├── Cellule dates
      │                   ├── Cellule responsable
      │                   └── Cellule actions
      └── DragOverlay (Overlay pendant le drag)
```

---

## 3. Fonctionnalités du tableau

### 3.1 Affichage et colonnes

Le tableau affiche les traitements sous forme de lignes avec les colonnes suivantes :

#### Colonne 1 : Drag Handle (Poignée de déplacement)
- **Type** : Icône interactive
- **Icône** : `DragIndicatorIcon`
- **Fonction** : Permet de saisir la ligne pour la réorganiser
- **Comportement** :
  - Curseur `grab` au survol
  - Curseur `grabbing` pendant le drag
  - Largeur fixe : 40px

#### Colonne 2 : Numéro d'ordre
- **Type** : Numérique
- **Contenu** : Index de la ligne (1, 2, 3, ...)
- **Style** : Texte centré, gras, couleur secondaire
- **Largeur** : 20px
- **Métier** : Représente l'ordre de priorité des traitements

#### Colonne 3 : Titre du traitement
- **Type** : Texte
- **Contenu** : `treatment.data.title`
- **Comportement** :
  - Texte tronqué avec ellipsis si trop long
  - Largeur max : 250px
  - Tooltip au survol affichant le titre complet
- **Métier** : Nom descriptif du traitement (ex: "Gestion des candidatures", "Newsletter marketing")

#### Colonne 4 : Type de traitement
- **Type** : Chip éditable inline
- **Contenu** : `treatment.data.treatmentType`
- **Comportement** :
  - Affichage par défaut : Chip avec le type ou "Aucun"
  - Clic sur le chip : Transformation en Select
  - Select :
    - Options : Types personnalisés depuis les paramètres
    - Auto-focus à l'ouverture
    - Sauvegarde automatique au changement
    - Fermeture au blur
  - Stop propagation du clic pour éviter l'édition du traitement
- **Métier** : Catégorisation des traitements (ex: "RH", "Marketing", "Commercial", "IT")
- **API** : Mutation `useUpdateTreatmentType` avec invalidation du cache

#### Colonne 5 : Finalités
- **Type** : Texte
- **Contenu** : `treatment.data.reasons` (jointure avec ", ")
- **Comportement** :
  - Texte tronqué avec ellipsis
  - Largeur max : 180px
  - Tooltip au survol affichant toutes les finalités
- **Métier** : Objectifs du traitement (ex: "Gestion des utilisateurs, Analyse statistique")

#### Colonne 6 : Statut
- **Type** : Chip coloré
- **Contenu** : Statut traduit
- **Couleurs** :
  - `validated` : Vert (success)
  - `draft` : Orange (warning)
  - `archived` : Gris (default)
  - Si `isOverDueDate` : Rouge (error) - prioritaire
- **Variante** :
  - `archived` : outlined
  - Autres : filled
- **Métier** :
  - **Brouillon** : Traitement en cours de création, incomplet
  - **Validé** : Traitement finalisé et conforme
  - **Archivé** : Traitement désactivé mais conservé pour l'historique
  - **En retard** : Traitement nécessitant une révision urgente

#### Colonne 7 : Données sensibles
- **Type** : Icône
- **Contenu** : Indicateur visuel
- **Logique de détection** :
  ```typescript
  const hasSensitiveData = () => {
    const personalDataHasSensitive = 
      treatment.data.personalDataGroup?.data.name.some(item => item.isSensitive) || false;
    
    const financialDataHasSensitive = 
      treatment.data.financialDataGroup?.data.name.some(item => item.isSensitive) || false;
    
    return personalDataHasSensitive || financialDataHasSensitive;
  };
  ```
- **Affichage** :
  - Données sensibles présentes : `CheckCircleIcon` rouge (error)
  - Pas de données sensibles : `CancelIcon` vert (success)
- **Métier** : 
  - **Données sensibles** : Données révélant l'origine raciale/ethnique, opinions politiques, convictions religieuses, appartenance syndicale, données génétiques, biométriques, santé, vie sexuelle
  - **Importance** : Ces données nécessitent des mesures de protection renforcées selon le RGPD

#### Colonne 8 : Date de création
- **Type** : Date
- **Contenu** : `treatment.creationDate`
- **Format** : `dd/mm/yyyy` (locale fr-FR)
- **Métier** : Date de création initiale du traitement dans le registre

#### Colonne 9 : Dernière mise à jour
- **Type** : Date
- **Contenu** : `treatment.updateDate`
- **Format** : `dd/mm/yyyy` (locale fr-FR)
- **Métier** : Date de dernière modification (utile pour le suivi et les audits)

#### Colonne 10 : Responsable
- **Type** : Texte
- **Contenu** : `treatment.data.responsible?.fullName`
- **Comportement** :
  - Texte tronqué avec ellipsis
  - Largeur max : 120px
  - Tooltip au survol
- **Métier** : Responsable du traitement (personne physique ou morale qui détermine les finalités et moyens du traitement)

#### Colonne 11 : Actions
- **Type** : Groupe de boutons d'action
- **Contenu** : 3 boutons avec icônes

##### Action 1 : Visualiser
- **Icône** : `VisibilityIcon`
- **Tooltip** : "Visualiser"
- **Fonction** : Ouvre la vue détaillée en lecture seule
- **Navigation** : `/dashboard/treatments/view/$id`
- **Stop propagation** : Oui

##### Action 2 : Modifier
- **Icône** : `EditIcon`
- **Tooltip** : "Modifier"
- **Fonction** : Ouvre le formulaire d'édition
- **Navigation** : `/dashboard/treatments/$id`
- **Stop propagation** : Oui

##### Action 3 : Archiver/Désarchiver
- **Icône** : 
  - `ArchiveIcon` si non archivé
  - `UnarchiveIcon` si archivé
- **Tooltip** : 
  - "Archiver" si non archivé
  - "Désarchiver" si archivé
- **Fonction** : Bascule le statut d'archivage
- **API** : 
  - `onArchive(treatment.id)` → POST `/api/v1/treatments/${id}/archive`
  - `onUnarchive(treatment.id)` → POST `/api/v1/treatments/${id}/unarchive`
- **Stop propagation** : Oui
- **Métier** : Permet de désactiver un traitement sans le supprimer (conservation de l'historique)

### 3.2 Comportement des lignes

#### Interaction au clic
- **Clic sur la ligne** : Ouvre le formulaire d'édition du traitement
- **Navigation** : `/dashboard/treatments/$id`
- **Exception** : Les clics sur les actions, le drag handle et le type ne déclenchent pas cette navigation

#### Styles au survol
- **Hover** : Changement de `backgroundColor` vers `action.hover`
- **Curseur** : 
  - `pointer` par défaut
  - `grabbing` pendant le drag

#### État pendant le drag
- **Opacité** : 0.5
- **Transform** : Appliquée par @dnd-kit
- **Transition** : Smooth transition fournie par la librairie

### 3.3 Filtrage et recherche

#### Filtre par type de traitement

**Composant** : `Select` (MUI)

**Emplacement** : En haut à gauche du tableau

**Options** :
- "Tous" (valeur vide) : Affiche tous les traitements
- Types personnalisés depuis `customTreatmentTypes` (paramètres)

**Comportement** :
```typescript
const filteredData = treatments.filter((treatment) => {
  if (!treatmentTypeFilter) return true;
  return treatment.data.treatmentType === treatmentTypeFilter;
});
```

**Affichage du filtre actif** :
- Si un filtre est appliqué : Affichage d'un `Chip` avec le nom du type
- Le Chip possède une icône de suppression pour réinitialiser le filtre
- Style : outlined, couleur primary, taille small

**Source des types** :
- Récupérés via `useGetOneSetting('customTreatmentTypes')`
- Types personnalisables par l'utilisateur dans les paramètres
- Exemples : "RH", "Marketing", "Ventes", "IT", "Juridique", "Finance"

#### Switch "Inclure les archivés"

**Composant** : `Switch` (MUI) avec `FormControlLabel`

**Emplacement** : À droite du filtre par type

**État** : `includeArchived` (boolean)

**Comportement** :
- Activé : Charge les traitements incluant les archivés
- Désactivé : Charge uniquement les traitements actifs (draft + validated)

**API** :
```typescript
const { data } = useGetTreatments({
  page: 1,
  pageSize: 1000,
  includeArchived,
});
```

**Métier** : Permet de consulter l'historique des traitements archivés sans encombrer la vue principale

### 3.4 Réorganisation par drag & drop

#### Technologie utilisée

**Librairie** : `@dnd-kit/core` et `@dnd-kit/sortable`

**Stratégie** : `verticalListSortingStrategy`

**Capteur** : `PointerSensor` avec contrainte de distance

```typescript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Évite les déclenchements accidentels
    },
  })
);
```

#### Flux de drag & drop

**1. Début du drag** (`handleDragStart`)
```typescript
const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id as string);
};
```
- Stockage de l'ID du traitement en cours de déplacement
- Utilisé pour afficher le `DragOverlay`

**2. Fin du drag** (`handleDragEnd`)
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  setActiveId(null);

  if (over && active.id !== over.id) {
    const oldIndex = treatments.findIndex((treatment) => treatment.id === active.id);
    const newIndex = treatments.findIndex((treatment) => treatment.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      // Réorganisation locale
      const newOrder = [...treatments];
      const [movedTreatment] = newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, movedTreatment);

      // Extraction des IDs dans le nouvel ordre
      const treatmentIds = newOrder.map((treatment) => treatment.id);
      
      // Sauvegarde sur le serveur
      updateOrderMutation.mutate({ treatmentIds });
    }
  }
};
```

**3. Overlay pendant le drag**
```typescript
<DragOverlay>
  {activeId ? (
    <Box sx={{ /* styles */ }}>
      <Typography variant="body2">
        {sortedData.find((t) => t.id === activeId)?.data.title}
      </Typography>
    </Box>
  ) : null}
</DragOverlay>
```
- Affiche le titre du traitement en cours de déplacement
- Suit le curseur pendant le drag

#### API de sauvegarde de l'ordre

**Hook** : `useUpdateTreatmentOrder`

**Endpoint** : `POST /api/v1/treatments/update-order`

**Payload** :
```typescript
{
  treatmentIds: string[] // Liste ordonnée des IDs
}
```

**Comportement** :
- Mutation asynchrone avec TanStack Query
- Invalidation du cache `['treatment']` en cas de succès
- Gestion d'erreur avec logs console

**Métier** : 
- L'ordre permet de prioriser les traitements
- Utile pour mettre en avant les traitements critiques ou en cours de révision
- L'ordre est persisté et partagé entre les utilisateurs

#### Contraintes importantes

**Ordre des données** :
- Le backend doit retourner les traitements dans l'ordre défini par le champ `order`
- Le frontend ne trie PAS les données après réception
- Raison : Éviter les conflits entre le tri local et le drag & drop

```typescript
// ❌ Ne PAS faire de tri côté frontend
const sortedData = [...filteredData].sort((a, b) => a.order - b.order);

// ✅ Utiliser directement les données du backend
const sortedData = [...filteredData];
```

### 3.5 Édition inline du type de traitement

#### Comportement

**État par défaut** : Affichage en Chip

**Déclenchement de l'édition** : Clic sur le Chip

**Mode édition** :
1. Le Chip se transforme en Select
2. Le Select reçoit automatiquement le focus
3. Les options sont chargées depuis les paramètres
4. L'utilisateur sélectionne un nouveau type
5. Au changement : Sauvegarde automatique via API
6. Au blur : Retour à l'affichage Chip

#### Gestion d'état local

```typescript
const [isEditingType, setIsEditingType] = useState(false);
```

#### Mutation API

**Hook** : `useUpdateTreatmentType`

**Endpoint** : `PUT /api/v1/treatments`

**Payload** :
```typescript
{
  id: string,
  treatmentType: string,
  treatmentData: TreatmentData
}
```

**Fonction** :
```typescript
const handleTypeChange = async (newType: string) => {
  await updateTypeMutation.mutateAsync({
    id: treatment.id,
    treatmentType: newType,
    treatmentData: treatment.data,
  });
  setIsEditingType(false);
};
```

#### Stop propagation

**Important** : Le clic sur le Chip et le Select doit stopper la propagation pour éviter de déclencher l'édition complète du traitement.

```typescript
onClick={(e) => {
  e.stopPropagation();
  setIsEditingType(true);
}}
```

#### Métier

- Permet une catégorisation rapide sans ouvrir le formulaire complet
- Utile pour trier et organiser de nombreux traitements
- Les types sont personnalisables dans les paramètres de l'application

### 3.6 Gestion des états de chargement et d'erreur

#### État de chargement

**Affichage** :
```typescript
{isLoading && (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
    <Typography>{t('common:loading')}</Typography>
  </Box>
)}
```

**Position** : En bas du tableau

**Métier** : Feedback utilisateur pendant le chargement des données

#### État d'erreur

**Composant** : `Alert` (MUI) avec severity="error"

**Affichage** :
```typescript
if (isError) {
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      {error?.message || 'Unknown error'}
    </Alert>
  );
}
```

**Position** : Remplace le tableau complet

**Métier** : Informe l'utilisateur en cas de problème de connexion ou d'erreur serveur

---

## 4. Aspects techniques d'implémentation

### 4.1 Stack technologique

- **React** : 19
- **TypeScript** : Typage strict
- **Material-UI** : v6 (composants Table, Chip, Select, IconButton, etc.)
- **@dnd-kit** : Drag & drop
- **TanStack Router** : Navigation
- **TanStack Query** : Gestion des requêtes et cache
- **react-i18next** : Internationalisation

### 4.2 Hooks personnalisés

#### useGetTreatments

**Fichier** : `src/features/treatments/hooks/useTreatments.ts`

**Signature** :
```typescript
export const useGetTreatments = (params: GetTreatmentsParams) => {
  return useQuery({
    queryKey: ['treatment', params],
    queryFn: () => getTreatments(params),
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
```

**Paramètres** :
```typescript
type GetTreatmentsParams = {
  page: number;
  pageSize: number;
  sort?: string;
  order?: 'asc' | 'desc' | null;
  search?: string;
  includeArchived?: boolean;
};
```

**Retour** :
```typescript
type GetTreatmentsResponse = {
  data: Treatment[];
  meta: {
    total: number;
  };
};
```

**Configuration** :
- Pas de retry automatique
- Pas de refetch automatique
- Cache géré par TanStack Query

#### useArchiveTreatment

**Signature** :
```typescript
export const useArchiveTreatment = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: archiveTreatment,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['treatment'] });
    },
  });
};
```

**Fonction** :
```typescript
export const archiveTreatment = async (id: string): Promise<Treatment> => {
  return baseFetch(`/api/v1/treatments/${id}/archive`, {
    method: 'POST',
  }).then((response) => response.json());
};
```

**Invalidation du cache** : Toutes les requêtes avec la clé `['treatment']`

#### useUnarchiveTreatment

**Similaire à `useArchiveTreatment`** avec endpoint différent :
```typescript
POST /api/v1/treatments/${id}/unarchive
```

#### useUpdateTreatmentType

**Signature** :
```typescript
export const useUpdateTreatmentType = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: updateTreatmentType,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['treatment'] });
    },
  });
};
```

**Fonction** :
```typescript
export const updateTreatmentType = async (params: {
  id: string;
  treatmentType: string;
  treatmentData: TreatmentData;
}): Promise<TreatmentData> => {
  return baseFetch('/api/v1/treatments', {
    body: JSON.stringify({
      ...params.treatmentData,
      id: params.id,
      treatmentType: params.treatmentType,
    }),
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
  }).then((response) => response.json());
};
```

#### useUpdateTreatmentOrder

**Fichier** : `src/features/treatments/hooks/useUpdateTreatmentOrder.ts`

**Signature** :
```typescript
export const useUpdateTreatmentOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateTreatmentOrderParams) => {
      const response = await baseFetch('/api/v1/treatments/update-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to update treatment order: ${response.status}`);
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment'] });
    },
    onError: (error) => {
      console.error('❌ Mutation error:', error);
    },
  });
};
```

#### useGetOneSetting

**Utilisation** : Récupération des types de traitement personnalisés

```typescript
const { data: treatmentTypesData } = useGetOneSetting('customTreatmentTypes');
```

**Retour** :
```typescript
{
  value: string[] // Liste des types personnalisés
}
```

### 4.3 Composants

#### TreatmentsTable (Composant conteneur)

**Fichier** : `src/features/treatments/components/TreatmentsTable.tsx`

**Responsabilités** :
- Gestion de l'état local (filtres, includeArchived)
- Récupération des données via hooks
- Gestion des mutations (archive, unarchive)
- Navigation vers les pages de détail/édition
- Gestion des erreurs

**Props** : Aucune (composant autonome)

**Code clé** :
```typescript
export function TreatmentsTable() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [includeArchived, setIncludeArchived] = useState(false);
  const [treatmentTypeFilter, setTreatmentTypeFilter] = useState<string>('');

  const { data: treatmentTypesData } = useGetOneSetting('customTreatmentTypes');

  const { data, isLoading, isError, error } = useGetTreatments({
    page: 1,
    pageSize: 1000,
    includeArchived,
  });

  const archiveTreatment = useArchiveTreatment();
  const unarchiveTreatment = useUnarchiveTreatment();

  // Handlers...

  return (
    <DraggableTreatmentsTable
      treatments={data?.data || []}
      isLoading={isLoading}
      onView={handleView}
      onEdit={handleEdit}
      onArchive={handleArchive}
      onUnarchive={handleUnarchive}
      treatmentTypeFilter={treatmentTypeFilter}
      setTreatmentTypeFilter={setTreatmentTypeFilter}
      includeArchived={includeArchived}
      setIncludeArchived={setIncludeArchived}
      treatmentTypesData={treatmentTypesData}
      t={t}
    />
  );
}
```

#### DraggableTreatmentsTable (Composant de présentation)

**Fichier** : `src/features/treatments/components/DraggableTreatmentsTable.tsx`

**Responsabilités** :
- Affichage du tableau
- Gestion du drag & drop
- Filtrage local des données
- Rendu des contrôles (filtres, switch)

**Props** :
```typescript
interface DraggableTreatmentsTableProps {
  treatments: Treatment[];
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => Promise<void>;
  onUnarchive: (id: string) => Promise<void>;
  treatmentTypeFilter: string;
  setTreatmentTypeFilter: (value: string) => void;
  includeArchived: boolean;
  setIncludeArchived: (value: boolean) => void;
  treatmentTypesData?: { value: string[] };
  t: (key: string, options?: Record<string, unknown>) => string;
}
```

**Structure** :
```typescript
export function DraggableTreatmentsTable({ ... }: DraggableTreatmentsTableProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const updateOrderMutation = useUpdateTreatmentOrder();

  const sensors = useSensors(/* ... */);

  const handleDragStart = (event: DragStartEvent) => { /* ... */ };
  const handleDragEnd = (event: DragEndEvent) => { /* ... */ };

  const filteredData = treatments.filter(/* ... */);
  const sortedData = [...filteredData];

  return (
    <Card>
      <CardContent>
        {/* Filtres */}
        <Box>
          <FormControl>
            <Select>{/* Types */}</Select>
          </FormControl>
          <FormControlLabel>
            <Switch>{/* Inclure archivés */}</Switch>
          </FormControlLabel>
        </Box>

        {/* Tableau avec drag & drop */}
        <DndContext>
          <SortableContext>
            <Table>
              <TableHead>{/* En-têtes */}</TableHead>
              <TableBody>
                {sortedData.map((treatment, index) => (
                  <DraggableRow key={treatment.id} {...} />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
          <DragOverlay>{/* Overlay */}</DragOverlay>
        </DndContext>

        {/* État de chargement */}
        {isLoading && <Box>{/* Loading */}</Box>}
      </CardContent>
    </Card>
  );
}
```

#### DraggableRow (Composant de ligne)

**Fichier** : Même fichier que `DraggableTreatmentsTable`

**Responsabilités** :
- Affichage d'une ligne de traitement
- Gestion du drag & drop pour cette ligne
- Édition inline du type
- Détection des données sensibles
- Formatage des dates
- Rendu des actions

**Props** :
```typescript
interface DraggableRowProps {
  treatment: Treatment;
  index: number;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => Promise<void>;
  onUnarchive: (id: string) => Promise<void>;
  treatmentTypesData?: { value: string[] };
  t: (key: string, options?: Record<string, unknown>) => string;
}
```

**Hooks utilisés** :
```typescript
const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
  id: treatment.id,
});
```

**Fonctions utilitaires** :
```typescript
const hasSensitiveData = () => { /* ... */ };
const formatDate = (dateString: string) => { /* ... */ };
const getStatusColor = (status: string, isOverdue: boolean) => { /* ... */ };
const getStatusLabel = (status: string) => { /* ... */ };
```

### 4.4 Styles et thème

#### Thème MUI personnalisé

**Dark mode** : Activé par défaut

**Couleurs principales** :
- Primary : Bleu (`#37BCF8`)
- Secondary : Or (`#DDB867`)
- Error : Rouge (pour données sensibles et retards)
- Success : Vert (pour absence de données sensibles)
- Warning : Orange (pour brouillons)

#### Styles du tableau

**Card** :
```typescript
sx={{
  border: 'none',
  backgroundColor: 'transparent'
}}
```

**TableCell** :
- Font size : `0.8rem` (compact)
- Padding réduit pour optimiser l'espace

**Hover effects** :
```typescript
'&:hover': {
  backgroundColor: 'action.hover',
}
```

**Drag handle** :
```typescript
sx={{
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing',
  },
}}
```

#### Responsive design

**Breakpoints** : Utilisation des breakpoints MUI

**Adaptations** :
- Réduction de la taille des polices sur mobile
- Ajustement des largeurs de colonnes
- Scroll horizontal si nécessaire

---

## 5. Intégration avec le backend

### 5.1 Endpoints API

#### GET /api/v1/treatments

**Méthode** : GET

**Query params** :
- `page` : Numéro de page (1-indexed)
- `size` : Nombre d'éléments par page
- `includeArchived` : `true` pour inclure les archivés

**Exemple** :
```
GET /api/v1/treatments?page=1&size=1000&includeArchived=true
```

**Réponse** :
```json
{
  "data": [
    {
      "id": "uuid",
      "updateDate": "2024-02-18T10:30:00Z",
      "creationDate": "2024-01-15T08:00:00Z",
      "status": "validated",
      "isOverDueDate": false,
      "order": 1,
      "data": {
        "title": "Gestion des candidatures",
        "treatmentType": "RH",
        "reasons": ["Recrutement", "Gestion administrative"],
        ...
      }
    },
    ...
  ],
  "meta": {
    "total": 42
  }
}
```

**Important** : Les traitements doivent être retournés dans l'ordre défini par le champ `order` (tri côté backend).

#### POST /api/v1/treatments/{id}/archive

**Méthode** : POST

**Path param** : `id` (UUID du traitement)

**Body** : Aucun

**Réponse** :
```json
{
  "id": "uuid",
  "status": "archived",
  ...
}
```

**Effet** : Change le statut du traitement en `archived`

#### POST /api/v1/treatments/{id}/unarchive

**Méthode** : POST

**Path param** : `id` (UUID du traitement)

**Body** : Aucun

**Réponse** :
```json
{
  "id": "uuid",
  "status": "validated",
  ...
}
```

**Effet** : Change le statut du traitement en `validated`

#### PUT /api/v1/treatments

**Méthode** : PUT

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "id": "uuid",
  "treatmentType": "Marketing",
  "title": "...",
  "description": "...",
  ...
}
```

**Réponse** : Traitement mis à jour complet

**Utilisation** : Mise à jour du type de traitement (et potentiellement d'autres champs)

#### POST /api/v1/treatments/update-order

**Méthode** : POST

**Headers** :
```
Content-Type: application/json
```

**Body** :
```json
{
  "treatmentIds": [
    "uuid-1",
    "uuid-2",
    "uuid-3",
    ...
  ]
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Treatment order updated successfully"
}
```

**Effet** : Met à jour le champ `order` de chaque traitement selon l'ordre dans le tableau

**Logique backend** :
```typescript
treatmentIds.forEach((id, index) => {
  updateTreatment(id, { order: index });
});
```

### 5.2 Authentification

**Méthode** : JWT (JSON Web Token)

**Headers** :
```
Authorization: Bearer <token>
```

**Gestion** : Via `react-auth-kit`

**Fonction utilitaire** : `baseFetch` (wrapper autour de `fetch` avec gestion automatique du token)

### 5.3 Gestion des erreurs

**Codes HTTP** :
- `200` : Succès
- `400` : Erreur de validation
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

**Gestion côté frontend** :
```typescript
if (!response.ok) {
  const errorText = await response.text();
  console.error('❌ Error response:', errorText);
  throw new Error(`Failed to update treatment order: ${response.status}`);
}
```

**Affichage à l'utilisateur** :
- Alert MUI avec severity="error"
- Message d'erreur traduit si possible
- Fallback sur le message d'erreur brut

---

## 6. Gestion d'état et cache

### 6.1 TanStack Query (React Query)

**Version** : Compatible React 19

**Configuration globale** :
- Cache time : Défaut (5 minutes)
- Stale time : Défaut (0)
- Retry : Désactivé pour les requêtes de traitements
- Refetch on window focus : Désactivé

### 6.2 Query keys

**Structure** :
```typescript
['treatment', params] // Liste des traitements
['treatment', id]     // Traitement individuel
```

**Invalidation** :
```typescript
client.invalidateQueries({ queryKey: ['treatment'] });
```

**Effet** : Invalide toutes les requêtes commençant par `['treatment']`

### 6.3 Optimistic updates

**Non implémenté actuellement** pour le tableau

**Raison** : Les mutations sont rapides et l'invalidation du cache suffit

**Amélioration possible** :
```typescript
onMutate: async (newData) => {
  await queryClient.cancelQueries({ queryKey: ['treatment'] });
  const previousData = queryClient.getQueryData(['treatment']);
  queryClient.setQueryData(['treatment'], (old) => {
    // Mise à jour optimiste
  });
  return { previousData };
},
onError: (err, newData, context) => {
  queryClient.setQueryData(['treatment'], context.previousData);
},
```

### 6.4 État local

**États gérés localement** :
- `includeArchived` : Filtre d'affichage des archivés
- `treatmentTypeFilter` : Filtre par type
- `activeId` : ID du traitement en cours de drag
- `isEditingType` : Mode édition du type (par ligne)

**Raison** : Ces états sont spécifiques à la vue et ne nécessitent pas de persistance

---

## 7. Internationalisation

### 7.1 Configuration

**Librairie** : `react-i18next`

**Langues supportées** : FR (français), EN (anglais)

**Fichiers de traduction** : `/public/locales/{lang}/`

### 7.2 Namespaces

**treatments** : Traductions spécifiques aux traitements
```json
{
  "columns": {
    "title": "Titre",
    "treatmentType": "Type de traitement",
    "reasons": "Finalités",
    "status": "Statut",
    "sensitiveData": "Données sensibles",
    "creationDate": "Date de création",
    "updateDate": "Dernière mise à jour",
    "responsible": "Responsable"
  },
  "status": {
    "draft": "Brouillon",
    "validated": "Validé",
    "archived": "Archivé"
  },
  "actions": {
    "view": "Visualiser",
    "edit": "Modifier",
    "archive": "Archiver",
    "unarchive": "Désarchiver"
  },
  "showArchived": "Afficher les archivés"
}
```

**common** : Traductions communes
```json
{
  "loading": "Chargement...",
  "all": "Tous",
  "none": "Aucun",
  "add": "Ajouter",
  "cancel": "Annuler"
}
```

### 7.3 Utilisation

**Hook** :
```typescript
const { t } = useTranslation();
```

**Traduction simple** :
```typescript
t('treatments:columns.title')
```

**Traduction avec fallback** :
```typescript
t('common:none', { defaultValue: 'Aucun' })
```

**Traduction dynamique** :
```typescript
t(`treatments:status.${status}`)
```

### 7.4 Formatage des dates

**Locale** : `fr-FR` (hardcodé actuellement)

**Format** : `dd/mm/yyyy`

**Code** :
```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR');
};
```

**Amélioration possible** : Utiliser la locale de i18next

```typescript
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(i18n.language);
};
```

---

## 8. Accessibilité et UX

### 8.1 Accessibilité (a11y)

#### Attributs ARIA

**Drag handle** :
```typescript
<IconButton
  size="small"
  {...attributes}
  {...listeners}
  aria-label="Réorganiser le traitement"
>
  <DragIndicatorIcon />
</IconButton>
```

**Actions** :
```typescript
<Tooltip title={t('treatments:actions.view')}>
  <IconButton aria-label="Visualiser le traitement">
    <VisibilityIcon />
  </IconButton>
</Tooltip>
```

**Toggle group** :
```typescript
<ToggleButtonGroup
  aria-label={t('treatments:columns.treatmentType')}
>
```

#### Navigation au clavier

**Drag & drop** : Supporté par @dnd-kit (utilisation des flèches + espace)

**Tableau** : Navigation standard avec Tab

**Select** : Navigation avec flèches haut/bas

**Actions** : Accessibles via Tab + Enter/Space

#### Contraste et lisibilité

**Couleurs** : Respect des ratios WCAG AA
- Texte sur fond sombre : Blanc ou couleurs claires
- Icônes : Taille minimum 24px
- Focus : Outline visible

**Taille de police** : Minimum 0.8rem (12.8px)

### 8.2 Expérience utilisateur (UX)

#### Feedback visuel

**Hover** :
- Changement de couleur de fond
- Changement de curseur (pointer, grab, grabbing)
- Icônes avec effet hover

**Drag** :
- Opacité réduite de l'élément source
- Overlay suivant le curseur
- Transition smooth

**Loading** :
- Message de chargement centré
- Pas de skeleton loader (amélioration possible)

**Erreur** :
- Alert rouge avec message clair
- Remplacement du tableau complet

#### Tooltips

**Utilisation** : Sur tous les éléments tronqués et actions

**Placement** : `top` par défaut

**Contenu** :
- Texte complet pour les cellules tronquées
- Label de l'action pour les boutons

**Exemples** :
```typescript
<Tooltip title={treatment.data.title} placement="top">
  <Typography>{/* Texte tronqué */}</Typography>
</Tooltip>
```

#### Prévention des erreurs

**Confirmation** : Aucune confirmation pour l'archivage (action réversible)

**Stop propagation** : Évite les clics accidentels sur les actions

**Distance d'activation du drag** : 8px pour éviter les déclenchements involontaires

#### Performance

**Pagination** : Chargement de 1000 traitements max
- Raison : Drag & drop nécessite tous les éléments
- Amélioration possible : Pagination virtuelle

**Memoization** : Non implémentée
- Amélioration possible : `useMemo` pour le filtrage

**Debounce** : Non implémenté (pas de recherche textuelle)

#### Responsive

**Mobile** :
- Scroll horizontal du tableau
- Réduction de la taille des polices
- Actions groupées

**Tablet** :
- Affichage optimisé
- Toutes les colonnes visibles

**Desktop** :
- Affichage complet
- Largeurs de colonnes optimales

---

## 9. Points d'attention pour l'implémentation

### 9.1 Ordre des données

**CRITIQUE** : Le backend DOIT retourner les traitements triés par le champ `order` (ASC).

**Raison** : Le drag & drop modifie l'ordre localement puis le sauvegarde. Si le frontend trie après réception, cela crée des conflits.

**Code backend attendu** :
```typescript
const treatments = await db.treatments.findMany({
  where: { /* filters */ },
  orderBy: { order: 'asc' },
});
```

### 9.2 Invalidation du cache

**Toutes les mutations** doivent invalider le cache `['treatment']` :
- Archive
- Unarchive
- Update type
- Update order
- Update treatment

**Raison** : Garantir la cohérence des données affichées

### 9.3 Gestion des données sensibles

**Logique de détection** : Parcourt `personalDataGroup` ET `financialDataGroup`

**Important** : Si d'autres groupes de données sont ajoutés (ex: `nirDataGroup`), la fonction `hasSensitiveData` doit être mise à jour.

### 9.4 Performance avec de nombreux traitements

**Limite actuelle** : 1000 traitements chargés

**Si dépassement** :
- Implémenter une pagination virtuelle
- Limiter le drag & drop à la page courante
- Ajouter une recherche textuelle avec debounce

### 9.5 Sécurité

**Validation côté backend** : Toutes les mutations doivent être validées

**Autorisations** : Vérifier que l'utilisateur a le droit de :
- Consulter les traitements
- Modifier les traitements
- Archiver les traitements
- Réorganiser les traitements

**Injection** : Sanitiser les entrées utilisateur (notamment pour la recherche future)

### 9.6 Tests

**Tests unitaires** :
- Fonction `hasSensitiveData`
- Fonction `formatDate`
- Fonction `getStatusColor`
- Fonction `getStatusLabel`
- Logique de filtrage

**Tests d'intégration** :
- Chargement des traitements
- Filtrage par type
- Toggle archivés
- Drag & drop
- Édition inline du type
- Actions (view, edit, archive, unarchive)

**Tests e2e** :
- Parcours complet utilisateur
- Vérification de la persistance de l'ordre
- Vérification de l'archivage

---

## 10. Améliorations futures possibles

### 10.1 Recherche textuelle

**Fonctionnalité** : Barre de recherche pour filtrer par titre, responsable, finalités

**Implémentation** :
```typescript
const [searchQuery, setSearchQuery] = useState('');

const filteredData = treatments.filter((treatment) => {
  const matchesType = !treatmentTypeFilter || 
    treatment.data.treatmentType === treatmentTypeFilter;
  
  const matchesSearch = !searchQuery || 
    treatment.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    treatment.data.responsible?.fullName.toLowerCase().includes(searchQuery.toLowerCase());
  
  return matchesType && matchesSearch;
});
```

**UX** : Debounce de 300ms pour éviter trop de re-renders

### 10.2 Tri des colonnes

**Fonctionnalité** : Clic sur l'en-tête de colonne pour trier

**Attention** : Incompatible avec le drag & drop
- Solution : Désactiver le drag & drop quand un tri est actif
- Ou : Permettre le tri uniquement dans une vue séparée

### 10.3 Sélection multiple

**Fonctionnalité** : Checkbox pour sélectionner plusieurs traitements

**Actions groupées** :
- Archiver plusieurs traitements
- Changer le type de plusieurs traitements
- Exporter la sélection

### 10.4 Colonnes personnalisables

**Fonctionnalité** : Permettre à l'utilisateur de choisir les colonnes affichées

**Implémentation** :
- Menu de configuration
- Sauvegarde dans localStorage ou backend
- Drag & drop pour réorganiser les colonnes

### 10.5 Pagination virtuelle

**Fonctionnalité** : Charger uniquement les traitements visibles

**Librairie** : `@tanstack/react-virtual`

**Bénéfice** : Performance avec des milliers de traitements

**Contrainte** : Complexifie le drag & drop

### 10.6 Optimistic updates

**Fonctionnalité** : Mise à jour immédiate de l'UI avant la réponse du serveur

**Bénéfice** : Meilleure réactivité perçue

**Implémentation** : Via TanStack Query `onMutate`

### 10.7 Undo/Redo

**Fonctionnalité** : Annuler/refaire les actions (archivage, réorganisation)

**Implémentation** :
- Stack d'historique
- Snackbar avec bouton "Annuler"
- Timeout de 5 secondes

### 10.8 Export du tableau

**Fonctionnalité** : Exporter le tableau visible en CSV/Excel

**Implémentation** :
- Librairie `xlsx` ou `papaparse`
- Bouton d'export dans la toolbar
- Respect des filtres actifs

### 10.9 Vues sauvegardées

**Fonctionnalité** : Sauvegarder des configurations de filtres/tri

**Exemples** :
- "Traitements RH validés"
- "Traitements avec données sensibles"
- "Traitements en retard"

**Implémentation** :
- Menu de vues
- Sauvegarde backend
- Partage entre utilisateurs

### 10.10 Indicateurs visuels avancés

**Fonctionnalité** : Badges, icônes, couleurs pour plus d'informations

**Exemples** :
- Badge "Nouveau" pour les traitements récents
- Icône "Attention" pour les traitements nécessitant une révision
- Barre de progression pour les traitements incomplets
- Icône DPO externe/interne

---

## 11. Glossaire métier RGPD

**Traitement de données personnelles** : Toute opération effectuée sur des données personnelles, automatisée ou non (collecte, enregistrement, organisation, structuration, conservation, adaptation, modification, extraction, consultation, utilisation, communication, diffusion, mise à disposition, rapprochement, limitation, effacement, destruction).

**Responsable du traitement** : Personne physique ou morale, autorité publique, service ou autre organisme qui, seul ou conjointement avec d'autres, détermine les finalités et les moyens du traitement.

**DPO (Délégué à la Protection des Données)** : Personne chargée de veiller à la conformité RGPD de l'organisation. Obligatoire dans certains cas (autorités publiques, traitement à grande échelle de données sensibles, etc.).

**Données sensibles** : Données révélant l'origine raciale ou ethnique, les opinions politiques, les convictions religieuses ou philosophiques, l'appartenance syndicale, les données génétiques, biométriques, de santé, concernant la vie sexuelle ou l'orientation sexuelle. Ces données nécessitent une protection renforcée.

**Finalité** : Objectif pour lequel les données sont collectées et traitées. Doit être déterminée, explicite et légitime.

**Base légale** : Fondement juridique autorisant le traitement (consentement, contrat, obligation légale, intérêt vital, mission d'intérêt public, intérêt légitime).

**Durée de conservation** : Période pendant laquelle les données sont conservées sous une forme permettant l'identification des personnes concernées.

**Transfert hors UE** : Transmission de données personnelles vers un pays situé en dehors de l'Union Européenne. Nécessite des garanties appropriées.

**Registre des traitements** : Document obligatoire listant tous les traitements de données personnelles effectués par l'organisation. Doit être tenu à jour et présenté à la CNIL sur demande.

**Archivage** : Action de désactiver un traitement sans le supprimer, pour conserver l'historique et la traçabilité.

---

## 12. Conclusion

Ce document fournit une spécification complète du tableau des traitements de l'application Registr Frontend. Il couvre tous les aspects fonctionnels, techniques et métier nécessaires pour reproduire cette fonctionnalité.

**Points clés à retenir** :
1. Le tableau est au cœur de la gestion RGPD
2. Le drag & drop permet de prioriser les traitements
3. L'édition inline du type optimise le workflow
4. La détection des données sensibles est critique
5. L'ordre des données doit être géré côté backend
6. L'invalidation du cache garantit la cohérence
7. L'accessibilité et l'UX sont prioritaires

**Pour toute question ou clarification**, se référer aux fichiers sources :
- `src/features/treatments/components/TreatmentsTable.tsx`
- `src/features/treatments/components/DraggableTreatmentsTable.tsx`
- `src/features/treatments/hooks/useTreatments.ts`
- `src/features/treatments/types/treatment.ts`
