# Settings Page — Shaping Notes

## Scope

Page admin `/dashboard/settings` pour gérer les options personnalisées du wizard de traitement, et les informations de l'entreprise (entité responsable + DPO).

## Décisions

- **2 onglets** : Paramètres (CRUD) et Entreprise (formulaire organisation)
- **Settings** : données aplaties côté client, pagination client-side (PAGE_SIZE=25)
- **Settings** : mutations via `SettingService.create/update/delete` + `findAll` après chaque mutation
- **Company** : endpoint unique `/api/v1/company` (GET + PATCH)
- **Company** : 3 sections visuelles (Entité / DPO interne / DPO externe), un seul bouton Enregistrer global
- **DPO interne et externe peuvent coexister** — flags `hasDPO` et `hasExternalDPO`
- **Import/Export** : hors scope (reporté)

## Context

- Spec fonctionnelle originale : `references/SPECIFICATIONS_PAGE_PARAMETRES.md`
- Service settings existant : `@libs/treatment-front/src/services/setting.ts`
- Mocks settings existants : `@libs/treatment-front/src/http-mocks/settings.ts`

## Changement vs. itération précédente

- Ancien `DpoForm` mélangeait identité DPO et adresse (un seul bloc)
- Remplacé par `CompanyForm` structuré (Entité + DPO interne + DPO externe) avec schéma `CompanyType`
