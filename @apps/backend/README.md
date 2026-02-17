# portal_backend

## Overview

This is the backend service for the Portal application. It is built using Fastify and TypeScript.
Don't forget to use turborepo for commands.

## Table of Contents

- [portal_backend](#portalbackend)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Architecture](#architecture)
  - [Installation](#installation)
  - [Scripts](#scripts)
  - [Décisions techniques](#décisions-techniques)

## Architecture

Architecture à Layer.
Les noms métiers sont en FRANCAIS. Pour l'instant ce sera une sorte de franglais. à voir si ça fonctionne bien. Par example "AjouterRessourceUseCase".

## Installation

To install the dependencies, run:

```bash
pnpm install
```

## Scripts

- `start`: Start the application.
- `dev`: Start the application in development mode with watch.
- `test`: Run the tests using Vitest.
- `build`: Build the application using Vite.
- `lint`: Run all linting scripts.
- `lint:js`: Lint JavaScript files.
- `lint:fix`: Fix linting issues in JavaScript files.
- `lint:types`: Type-check the project using TypeScript.

## Décisions techniques

- Abstractions: DB
- Pas d'abstraction la présentation
