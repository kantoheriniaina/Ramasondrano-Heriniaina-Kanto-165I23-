# 📘 Projet de Gestion CRUD - Frontend Next.js | Backend .NET Core | PostgreSQL | Docker

> Réalisé par **Ramasondrano Heriniaina Kanto**  
> Matricule : **165I23**  
> Parcours : **DA2I - EMIT Fianarantsoa**  
> Année académique : **2024 - 2025**

---

## 📌 Objectif du projet

Ce projet a pour objectif de démontrer la conception et le développement d’une **application de gestion CRUD (Create, Read, Update, Delete)** en utilisant un stack moderne basé sur :

- **Next.js** pour l’interface utilisateur,
- **.NET Core Web API** pour le backend,
- **PostgreSQL** pour la base de données relationnelle,
- Et **Docker** pour l’orchestration des services.

L'application permet de **gérer dynamiquement des enregistrements de données** (ex: utilisateurs, employés, missions, etc.) de manière efficace, avec une interface responsive et intuitive.

---

## ⚙️ Technologies utilisées

| Composant       | Technologie / Outil                                 |
|-----------------|------------------------------------------------------|
| 🧠 Frontend     | [Next.js](https://nextjs.org/), Tailwind CSS, Heroicons, MUI DataTable |
| ⚙️ Backend      | [.NET Core Web API](https://dotnet.microsoft.com/)   |
| 🗄️ Base de données | [PostgreSQL](https://www.postgresql.org/)          |
| 📦 Conteneurisation | [Docker](https://www.docker.com/), Docker Compose |
| 🔧 Admin DB     | [pgAdmin](https://www.pgadmin.org/)                 |

---

## 🗂️ Structure du projet

```bash
.
├── .idea/                   # Fichiers de configuration IDE
├── front/                  # Application Next.js (interface utilisateur)
├── WebApplication1/        # API .NET Core (couche backend)
├── docker-compose/         # Fichiers pour la conteneurisation PostgreSQL et pgAdmin
├── Image du projet/        # Captures d’écran de l’application
├── WebApplication1.sln     # Solution Visual Studio .NET
├── global.json             # Spécification de version .NET
├── .dockerignore           # Exclusions Docker