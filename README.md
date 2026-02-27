<div align="center">
  <img src="https://github.com/user-attachments/assets/dfb32fea-09c1-4007-ad23-c2b783a1c3ee" alt="Forum Viajeros" height="120"/>

  # Forum Viajeros

  **🌐 [forumviajeros.com](https://forumviajeros.com)**

  ---
  🇬🇧 [English](#-about) &nbsp;·&nbsp; 🇪🇸 [Español](#-sobre-el-proyecto)
</div>

---

## 🇬🇧 About

A full-stack community platform for travellers: share experiences, mark visited countries on an interactive world map, compete in geography trivia and connect with fellow adventurers. Available in Spanish and English.

### 🚀 Try it live

| | |
|---|---|
| **URL** | https://forumviajeros.com |
| **Demo user** | `viajero_demo` |
| **Password** | `Demo1234!` |
| **Role** | USER |

### 👥 User Roles

| Role | Permissions |
|---|---|
| **USER** | Browse & create forums, posts and comments · Travel map · Trivia · Blog · Messaging |
| **MODERATOR** | All USER permissions · Moderate content · Manage posts and comments |
| **ADMIN** | Full access · User management · Admin dashboard · All settings |

### 🛠️ Tech Stack

```mermaid
graph LR
    subgraph FE["🌐 Frontend"]
        R["React 19"] --> V["Vite 6"]
        R --> TC["Tailwind CSS 4"]
        R --> RR["React Router 7"]
        R --> AX["Axios"]
        R --> D3["D3-geo · Maps"]
    end

    subgraph BE["⚙️ Backend"]
        SB["Spring Boot 3"] --> J["Java 21"]
        SB --> SS["Spring Security + JWT"]
        SB --> JPA["JPA / Hibernate"]
        JPA --> PG[("PostgreSQL")]
    end

    FE -- "REST API · HTTPS" --> BE
```

### ✨ Features

- **Forums** — Organized by continent · Posts, comments, tags, image upload
- **Travel Map** — Mark 195 countries as visited, wishlist or lived-in · Personal statistics
- **Geography Trivia** — 4 game modes (Quick, Challenge, Daily, Infinite) · Global leaderboard
- **Travel Blog** — Articles with categories and search
- **Private Messaging** — Direct messages between users
- **i18n** — Spanish 🇪🇸 / English 🇬🇧

---

## 🇪🇸 Sobre el proyecto

Plataforma comunitaria full-stack para viajeros: comparte experiencias, marca en un mapa interactivo los países que has visitado, compite en trivia geográfica y conecta con otros aventureros. Disponible en español e inglés.

### 🚀 Pruébalo en vivo

| | |
|---|---|
| **URL** | https://forumviajeros.com |
| **Usuario demo** | `viajero_demo` |
| **Contraseña** | `Demo1234!` |
| **Rol** | USER |

### 👥 Roles de usuario

| Rol | Permisos |
|---|---|
| **USER** | Ver y crear foros, posts y comentarios · Mapa de viajes · Trivia · Blog · Mensajería |
| **MODERATOR** | Todo lo de USER · Moderar contenido · Gestionar posts y comentarios |
| **ADMIN** | Acceso completo · Gestión de usuarios · Panel de administración · Toda la configuración |

### 🛠️ Stack tecnológico

```mermaid
graph LR
    subgraph FE["🌐 Frontend"]
        R["React 19"] --> V["Vite 6"]
        R --> TC["Tailwind CSS 4"]
        R --> RR["React Router 7"]
        R --> AX["Axios"]
        R --> D3["D3-geo · Mapas"]
    end

    subgraph BE["⚙️ Backend"]
        SB["Spring Boot 3"] --> J["Java 21"]
        SB --> SS["Spring Security + JWT"]
        SB --> JPA["JPA / Hibernate"]
        JPA --> PG[("PostgreSQL")]
    end

    FE -- "REST API · HTTPS" --> BE
```

### ✨ Funcionalidades

- **Foros** — Organizados por continente · Posts, comentarios, tags, subida de imágenes
- **Mapa de viajes** — Marca 195 países como visitado, lista de deseos o donde has vivido · Estadísticas personales
- **Trivia geográfica** — 4 modos de juego (Rápido, Desafío, Diario, Infinito) · Ranking global
- **Blog de viajes** — Artículos con categorías y búsqueda
- **Mensajería privada** — Mensajes directos entre usuarios
- **i18n** — Español 🇪🇸 / Inglés 🇬🇧

---

<div align="center">
  <sub>© 2026 Forum Viajeros · Educational project</sub>
</div>
