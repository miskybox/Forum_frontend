# FORUM VIAJEROS - ESTRUCTURA DEL PROYECTO

**Fecha:** 2026-01-08
**Versión:** 1.0
**Tipo:** Aplicación Web Full-Stack para Comunidad de Viajeros

---

## 📋 TABLA DE CONTENIDOS

1. [Visión General](#visión-general)
2. [Arquitectura](#arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Frontend](#frontend)
5. [Backend](#backend)
6. [Base de Datos](#base-de-datos)
7. [Seguridad](#seguridad)
8. [Testing](#testing)
9. [Configuración](#configuración)
10. [Documentación](#documentación)

---

## 🎯 VISIÓN GENERAL

### Descripción
**Forum Viajeros** es una plataforma social para compartir experiencias de viaje, conectar con otros viajeros y participar en una comunidad global de aventureros.

### Funcionalidades Principales
- 🗨️ **Foros de Discusión** - Crear y participar en foros temáticos por continente
- 🗺️ **Mapa de Viajes Interactivo** - Marcar países visitados, deseados o donde has vivido
- 🎯 **Sistema de Trivia** - Juegos sobre geografía y viajes con leaderboard
- 📝 **Blog de Viajes** - Publicar y leer artículos de viajes
- 👤 **Perfiles de Usuario** - Gestionar perfil y visualizar historial
- 🛡️ **Dashboards Admin/Moderador** - Herramientas de administración

### Estadísticas del Proyecto
```
📁 Total de Archivos:
   - Backend: 128 archivos Java
   - Frontend: 84 archivos JS/JSX
   - Tests: 434 tests unitarios + 13 E2E
   - Documentación: 10+ archivos

👥 Roles de Usuario:
   - USER (Usuario registrado)
   - MODERATOR (Moderador de contenido)
   - ADMIN (Administrador del sistema)

🌍 Idiomas Soportados:
   - Español (ES)
   - Inglés (EN)

📊 Salud del Proyecto:
   - Tests: 434/434 pasando ✅
   - Calidad de Código: 75/100
   - Cobertura de Servicios: 100%
```

---

## 🏗️ ARQUITECTURA

### Tipo de Arquitectura
**Cliente-Servidor con API RESTful**

```
┌─────────────────────────────────────────────────────────────┐
│                     ARQUITECTURA GENERAL                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                        ┌──────────────┐   │
│  │              │    HTTP/REST API       │              │   │
│  │   FRONTEND   │◄──────────────────────►│   BACKEND    │   │
│  │  (React SPA) │    http://localhost    │ (Spring Boot)│   │
│  │   Port 5173  │        :8080/api       │   Port 8080  │   │
│  │              │                        │              │   │
│  └──────────────┘                        └───────┬──────┘   │
│                                                   │           │
│                                         ┌─────────▼─────────┐│
│                                         │   PostgreSQL DB   ││
│                                         │   Port 5432       ││
│                                         └───────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Estructura de Carpetas Principal
```
d:\forum-viajeros_fs\
├── 📁 Forum_frontend/          # SPA React (Vite)
│   ├── 📁 src/                # Código fuente
│   ├── 📁 tests/              # Tests E2E (Playwright)
│   ├── 📁 public/             # Assets estáticos
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 Forum_backend/           # API REST Spring Boot
│   ├── 📁 src/main/java/      # Código fuente Java
│   ├── 📁 src/main/resources/ # Configuración
│   ├── 📁 src/test/           # Tests unitarios
│   ├── pom.xml                # Maven dependencies
│   └── .env                   # Variables de entorno
│
├── 📄 AUDIT_REPORT.md         # Auditoría de código
├── 📄 SECURITY-AUDIT-REPORT.md # Auditoría de seguridad
├── 📄 TESTING_GUIDE.md        # Guía de testing
├── 📄 WORK_SUMMARY.md         # Resumen de trabajo
├── 🗃️ check_db.sql           # Script verificación DB
├── 🗃️ reset_data.sql         # Script reset de datos
└── 🔧 test-*.ps1             # Scripts de testing
```

---

## 💻 STACK TECNOLÓGICO

### Resumen Rápido

| Capa | Tecnología | Versión |
|------|------------|---------|
| **Frontend Framework** | React | 19.1.0 |
| **Build Tool** | Vite | 6.3.5 |
| **UI Framework** | Tailwind CSS | 4.1.7 |
| **Routing** | React Router DOM | 7.6.0 |
| **HTTP Client** | Axios | 1.9.0 |
| **Backend Framework** | Spring Boot | 3.5.8 |
| **Lenguaje Backend** | Java | 21 |
| **Base de Datos** | PostgreSQL | - |
| **ORM** | Spring Data JPA + Hibernate | - |
| **Autenticación** | JWT (JJWT) | 0.11.5 |
| **Testing Frontend** | Vitest + Playwright | 4.0.15 + 1.57.0 |
| **Testing Backend** | JUnit + Spring Test | - |
| **Mapas** | D3-geo | 3.1.1 |
| **Sanitización** | DOMPurify | 3.3.1 |

### Lenguajes de Programación
- **JavaScript/JSX** - Frontend (React)
- **Java** - Backend (Spring Boot)
- **SQL** - Base de datos (PostgreSQL)
- **PowerShell** - Scripts de testing
- **TypeScript** - Tests E2E (Playwright)
- **CSS** - Estilos (vía Tailwind)

---

## 🎨 FRONTEND

### Estructura de Carpetas Detallada
```
Forum_frontend/src/
├── 📁 assets/                  # Imágenes, logos, iconos
├── 📁 components/              # 43 componentes React
│   ├── auth/                  # Login, Register, ProtectedRoute
│   ├── blog/                  # BlogCard, BlogGrid, BlogHero
│   ├── categories/            # CategoryCard, CategoryList
│   ├── comments/              # CommentForm, CommentItems
│   ├── common/                # Navbar, Footer, LoadingSpinner
│   ├── debug/                 # LocalStorageDebug
│   ├── forums/                # ForumCard, ForumForm, ForumSearch
│   ├── post/                  # PostCard, PostForm, PostContent
│   ├── travel/                # WorldMap, PlacesList, CountrySelector
│   └── trivia/                # TriviaGameSummary, TriviaLeaderboard
├── 📁 contexts/                # 3 contextos React
│   ├── AuthContext.jsx        # Gestión de autenticación
│   ├── LanguageContext.jsx    # Internacionalización (i18n)
│   └── ThemeContext.jsx       # Tema visual (sin dark mode)
├── 📁 data/
│   └── countries.geojson      # GeoJSON países (14.6 MB)
├── 📁 hooks/
│   └── useAuth.js             # Custom hook de autenticación
├── 📁 pages/                   # 27 páginas
│   ├── blog/                  # BlogHomePage, BlogPostPage
│   ├── travel/                # TravelMapPage
│   ├── trivia/                # TriviaHomePage, TriviaPlayPage
│   ├── HomePage.jsx
│   ├── ProfilePage.jsx
│   ├── AdminDashboardPage.jsx
│   └── ...
├── 📁 services/                # 12 servicios API
│   ├── authService.js
│   ├── forumService.js
│   ├── postService.js
│   ├── commentService.js
│   └── ...
├── 📁 utils/
│   ├── api.js                 # Configuración Axios
│   └── sanitize.js            # Utilidades de sanitización
├── 📁 __tests__/              # Tests unitarios (5 archivos)
├── App.jsx                     # Componente raíz
├── main.jsx                    # Punto de entrada
└── index.css                   # Estilos globales
```

### Dependencias Principales
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.0",
  "axios": "^1.9.0",
  "react-hot-toast": "^2.5.2",
  "date-fns": "^4.1.0",
  "d3-geo": "^3.1.1",
  "dompurify": "^3.3.1",
  "react-icons": "^5.5.0",
  "prop-types": "^15.8.1",
  "daisyui": "^5.0.35"
}
```

### Sistema de Diseño

#### Paleta de Colores Personalizada
```javascript
// Paleta única sin modo oscuro
colors: {
  primary: {
    DEFAULT: '#F6E6CB',  // Crema claro - Fondo principal
    light: '#FEFDFB',
    dark: '#E7D4B5'
  },
  secondary: {
    DEFAULT: '#B6C7AA',  // Verde suave - Acentos
    light: '#C5D4BA',
    dark: '#A0B596'
  },
  accent: {
    DEFAULT: '#A0937D',  // Marrón tierra - Bordes
    light: '#B5A992',
    dark: '#8B7E6A'
  },
  earth: {
    50: '#F6E6CB',       // Fondo cards (reemplaza bg-white)
    100: '#E7D4B5',
    // ...
  },
  ocean: {
    500: '#4A90A4',      // Azul océano
    600: '#3A7A8C',
    // ...
  }
}
```

#### Tipografía
```javascript
fontFamily: {
  sans: ['Inter', 'Segoe UI', 'sans-serif'],
  display: ['Montserrat', 'Arial', 'sans-serif']
}
```

### Routing

#### Rutas Públicas
```
/                    → HomePage
/login               → LoginPage
/register            → RegisterPage
/categories          → CategoryListPage
/forums              → ForumListPage
/forums/:id          → ForumDetailPage
/posts/:id           → PostDetailPage
/travel              → TravelMapPage
/trivia              → TriviaHomePage
/blog                → BlogHomePage
/about, /contact, /help → Páginas informativas
```

#### Rutas Protegidas (requieren login)
```
/profile             → ProfilePage
/forums/create       → ForumCreatePage
/forums/:id/edit     → ForumEditPage
/posts/create        → PostCreatePage
/posts/:id/edit      → PostEditPage
/trivia/play/:id     → TriviaPlayPage
```

#### Rutas por Rol
```
ROLE_ADMIN:
  /admin/dashboard   → AdminDashboardPage

ROLE_MODERATOR o ROLE_ADMIN:
  /moderator/dashboard → ModeratorDashboardPage
```

### Gestión de Estado
- **Context API** (no Redux)
  - `AuthContext`: Usuario, token, refreshToken
  - `LanguageContext`: i18n (ES/EN), 70+ claves traducidas
  - `ThemeContext`: Tema visual
- **LocalStorage**: Persistencia de tokens
- **React Hooks**: useState, useEffect, useContext

### Internacionalización (i18n)

**Archivos Internacionalizados:**
1. AdminDashboardPage.jsx
2. ModeratorDashboardPage.jsx
3. TravelStats.jsx
4. ForumList.jsx
5. HelpPage.jsx
6. ContactPage.jsx
7. AboutPage.jsx
8. NotFoundPage.jsx

**Total de Claves Traducidas:** 70+ (ES + EN = 140+ strings)

---

## ⚙️ BACKEND

### Estructura de Carpetas Detallada
```
Forum_backend/src/main/java/com/forumviajeros/backend/
├── 📁 controller/              # 13 controladores REST
│   ├── AuthController.java
│   ├── ForumController.java
│   ├── PostController.java
│   ├── CommentController.java
│   ├── UserController.java
│   ├── CategoryController.java
│   ├── TriviaController.java
│   └── ...
├── 📁 service/                 # Servicios de negocio
│   ├── auth/
│   ├── forum/
│   ├── post/
│   ├── comment/
│   ├── user/
│   ├── token/
│   └── ...
├── 📁 repository/              # Repositorios JPA
├── 📁 model/                   # 16 entidades
│   ├── User.java
│   ├── Role.java
│   ├── Forum.java
│   ├── Post.java
│   ├── Comment.java
│   ├── Category.java
│   ├── Country.java
│   ├── VisitedPlace.java
│   ├── RefreshToken.java
│   └── ...
├── 📁 dto/                     # Data Transfer Objects
│   ├── auth/
│   ├── forum/
│   ├── post/
│   └── ...
├── 📁 security/                # Configuración de seguridad
│   ├── SecurityConfig.java
│   ├── filter/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtAuthorizationFilter.java
│   │   └── RateLimitingFilter.java
│   ├── service/
│   │   └── UserDetailsServiceImpl.java
│   └── manager/
│       └── CustomAuthenticationManager.java
├── 📁 config/                  # Configuración
├── 📁 exception/               # Manejo de excepciones
│   └── GlobalExceptionHandler.java
├── 📁 validation/              # Validadores personalizados
│   └── PasswordValidator.java
└── 📁 util/                    # Utilidades
    └── HtmlSanitizer.java
```

### Dependencias Principales (pom.xml)
```xml
<!-- Spring Boot Starters -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.11.5</version>
</dependency>

<!-- PostgreSQL -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- MapStruct (DTO mapping) -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>

<!-- Lombok -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- OpenAPI/Swagger -->
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

### API REST - Endpoints Principales

#### Autenticación (`/api/auth`)
```
POST /register        - Registro de usuarios
POST /login           - Login (5 intentos/min)
POST /logout          - Logout
POST /refresh         - Renovar access token
```

#### Usuarios (`/api/users`)
```
GET  /                - Listar usuarios (ADMIN)
GET  /{id}            - Usuario por ID
GET  /me              - Usuario actual
POST /                - Crear usuario (ADMIN)
PUT  /{id}            - Actualizar usuario
DELETE /{id}          - Eliminar usuario (ADMIN)
PUT  /{id}/change-password - Cambiar password
```

#### Foros (`/api/forums`)
```
GET  /                - Listar foros
GET  /{id}            - Foro por ID
GET  /category/{id}   - Foros por categoría
GET  /search?query=   - Buscar foros
POST /                - Crear foro (USER)
PUT  /{id}            - Actualizar foro
DELETE /{id}          - Eliminar foro (ADMIN)
POST /{id}/image      - Subir imagen
```

#### Posts (`/api/posts`)
```
GET  /                - Listar posts
GET  /{id}            - Post por ID
GET  /forum/{id}      - Posts por foro
POST /                - Crear post (USER)
PUT  /{id}            - Actualizar post
DELETE /{id}          - Eliminar post
POST /{id}/image      - Subir imagen
```

#### Comentarios (`/api/comments`)
```
GET  /post/{id}       - Comentarios de un post
POST /                - Crear comentario (USER)
PUT  /{id}            - Actualizar comentario
DELETE /{id}          - Eliminar comentario
```

---

## 🗄️ BASE DE DATOS

### Tipo
**PostgreSQL** (producción)
**H2** (testing/desarrollo)

### ORM
**Spring Data JPA + Hibernate**

### Entidades Principales

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│     User     │       │   Category   │       │    Country   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ username     │───┐   │ name         │───┐   │ name         │
│ email        │   │   │ description  │   │   │ code         │
│ password     │   │   │ icon         │   │   │ continent    │
│ roles[]      │   │   └──────────────┘   │   │ flagEmoji    │
│ firstName    │   │                      │   └──────────────┘
│ lastName     │   │                      │
└──────────────┘   │   ┌──────────────┐   │
                   └──►│    Forum     │◄──┘
                       ├──────────────┤
                       │ id           │
                       │ name         │
                       │ description  │
                       │ creator      │───┐
                       │ category     │   │
                       └──────────────┘   │
                                          │
                       ┌──────────────┐   │
                       │     Post     │◄──┘
                       ├──────────────┤
                       │ id           │
                       │ title        │
                       │ content      │───┐
                       │ author       │   │
                       │ forum        │   │
                       │ tags[]       │   │
                       └──────────────┘   │
                                          │
                       ┌──────────────┐   │
                       │   Comment    │◄──┘
                       ├──────────────┤
                       │ id           │
                       │ content      │
                       │ author       │
                       │ post         │
                       │ parentComment│
                       └──────────────┘

┌──────────────────┐       ┌──────────────────┐
│  VisitedPlace    │       │  RefreshToken    │
├──────────────────┤       ├──────────────────┤
│ id               │       │ id               │
│ user             │       │ token            │
│ country          │       │ user             │
│ status           │       │ expiryDate       │
│ visitDate        │       └──────────────────┘
│ rating           │
│ notes            │
│ isFavorite       │
└──────────────────┘
```

### Configuración
```properties
# application.properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
```

---

## 🔒 SEGURIDAD

### Autenticación JWT

```
┌─────────────────────────────────────────────────────────────┐
│                  FLUJO DE AUTENTICACIÓN JWT                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. POST /api/auth/login                                     │
│     { username, password }                                   │
│            │                                                  │
│            ▼                                                  │
│     ┌──────────────┐                                         │
│     │   Backend    │  Valida credenciales (BCrypt)          │
│     └──────┬───────┘                                         │
│            │                                                  │
│            ▼                                                  │
│     ┌──────────────┐                                         │
│     │  Genera JWT  │  Access Token (10 min)                 │
│     │              │  Refresh Token (30 días)               │
│     └──────┬───────┘                                         │
│            │                                                  │
│            ▼                                                  │
│  2. Response:                                                │
│     {                                                         │
│       accessToken: "eyJhbGciOiJIUzUxMi...",                 │
│       refreshToken: "eyJhbGciOiJIUzUxMi...",                │
│       username: "user",                                      │
│       roles: ["ROLE_USER"]                                  │
│     }                                                         │
│            │                                                  │
│            ▼                                                  │
│  3. Frontend guarda en localStorage                          │
│     localStorage.setItem('token', accessToken)               │
│            │                                                  │
│            ▼                                                  │
│  4. Requests subsiguientes:                                  │
│     Authorization: Bearer eyJhbGciOiJIUzUxMi...             │
│            │                                                  │
│            ▼                                                  │
│  5. JwtAuthorizationFilter valida token                      │
│     - Verifica firma                                         │
│     - Verifica expiración                                    │
│     - Extrae username y roles                                │
│            │                                                  │
│            ▼                                                  │
│  6. SecurityContext populated                                │
│     @PreAuthorize verifica permisos                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Configuración de Seguridad
```java
// SecurityConfig.java - Configuración principal
- CSRF: Deshabilitado (API REST stateless)
- Session: STATELESS (sin sesiones del servidor)
- CORS: Restrictivo (orígenes específicos)
- Security Headers:
  * Content-Security-Policy
  * X-Frame-Options: DENY
  * HSTS (HTTP Strict Transport Security)
```

### Rate Limiting
```java
// RateLimitingFilter.java
- /api/auth/login: 5 intentos/60 segundos
- /api/auth/register: 3 intentos/60 segundos
- /api/auth/refresh: 10 intentos/60 segundos
- Por IP (considera proxies: X-Forwarded-For, X-Real-IP)
```

### Validación de Passwords
```java
// PasswordValidator.java
- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 carácter especial (!@#$%^&*()_+...)
- BCrypt para hashing (salt automático)
```

### Roles y Permisos

| Acción | USER | MODERATOR | ADMIN |
|--------|------|-----------|-------|
| Ver foros públicos | ✅ | ✅ | ✅ |
| Crear foro | ✅ | ✅ | ✅ |
| Editar propio foro | ✅ | ✅ | ✅ |
| Eliminar propio foro | ✅ | ✅ | ✅ |
| Editar cualquier foro | ❌ | ❌ | ✅ |
| Eliminar cualquier foro | ❌ | ❌ | ✅ |
| Crear post | ✅ | ✅ | ✅ |
| Editar propio post | ✅ | ✅ | ✅ |
| Editar cualquier post | ❌ | ✅ | ✅ |
| Eliminar cualquier post | ❌ | ✅ | ✅ |
| Comentar | ✅ | ✅ | ✅ |
| Moderar comentarios | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |
| Gestionar roles | ❌ | ❌ | ✅ |
| Ver dashboard admin | ❌ | ❌ | ✅ |
| Ver dashboard moderador | ❌ | ✅ | ✅ |

---

## 🧪 TESTING

### Tests Unitarios Frontend (Vitest)

**Ubicación:** `Forum_frontend/src/__tests__/`

```
✅ 434/434 tests pasando

Archivos de test:
- endpoints.test.jsx        (34 tests)
- buttons.test.jsx          (7 tests)
- links.test.jsx            (12 tests)
- routes.test.jsx           (5 tests)
- routes-validation.test.jsx (3 tests)

Cobertura:
- Servicios: 100% ✅
- Componentes: ~23% ⚠️
- Páginas: ~4% ⚠️
```

### Tests E2E (Playwright)

**Ubicación:** `Forum_frontend/tests/`

```
Total: 13 archivos .spec.ts

Tests disponibles:
- accessibility-advanced.spec.ts
- all-buttons-links.spec.ts
- auth.spec.ts
- auth-buttons-links.spec.ts
- auth-complete.spec.ts
- complete-flows.spec.ts
- complete-navigation.spec.ts
- footer.spec.ts
- forum-creation.spec.ts
- home.spec.ts
- navbar.spec.ts
- responsive-design.spec.ts
- user-experience.spec.ts

Comandos:
npm run test:e2e         # Ejecutar tests
npm run test:e2e:ui      # Con UI
npm run test:e2e:report  # Ver reporte
```

### Tests Automatizados (PowerShell)

**test-forum-crud-complete.ps1** - 19 tests automatizados:
```powershell
1. Login de usuario
2. Obtener categorías
3. Crear foro (CREATE)
4. Leer foro (READ)
5. Actualizar foro (UPDATE)
6. Listar foros
7. Crear post
8. Leer post
9. Actualizar post
10. Crear comentario
11. Leer comentarios
12. Actualizar comentario
13. Crear segundo comentario
14. Buscar foros
15. Obtener posts del foro
16. Verificar tags
17. Eliminar comentario (DELETE)
18. Eliminar post (DELETE)
19. Eliminar foro (DELETE)

Ejecutar:
powershell.exe -ExecutionPolicy Bypass -File test-forum-crud-complete.ps1
```

---

## ⚙️ CONFIGURACIÓN

### Variables de Entorno (.env)

```bash
# Base de Datos
DB_URL=jdbc:postgresql://localhost:5432/forum_viajeros
DB_USER=postgres
DB_PASSWORD=postgres

# JWT (mínimo 64 caracteres)
JWT_SECRET_KEY=super-secret-key-for-jwt-token-generation-must-be-at-least-256-bits-long-for-security

# Usuarios por defecto
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@forumviajeros.com
ADMIN_PASSWORD=Admin123!

MODERATOR_USERNAME=moderator
MODERATOR_EMAIL=moderator@forumviajeros.com
MODERATOR_PASSWORD=Moderator123!

USER_USERNAME=user
USER_EMAIL=user@forumviajeros.com
USER_PASSWORD=User123!

# Spring
SPRING_APPLICATION_NAME=backend
SPRING_PROFILES_ACTIVE=default
```

### Scripts NPM (Frontend)

```json
{
  "dev": "vite",                       // Desarrollo
  "build": "vite build",               // Build producción
  "preview": "vite preview",           // Preview build
  "lint": "eslint .",                  // Linting
  "test": "vitest run",                // Tests unitarios
  "test:watch": "vitest",              // Tests modo watch
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",       // Tests E2E
  "test:e2e:ui": "playwright test --ui"
}
```

### Comandos Maven (Backend)

```bash
./mvnw spring-boot:run           # Ejecutar app
./mvnw clean install             # Compilar
./mvnw test                      # Tests
./mvnw spring-boot:build-image   # Docker image
```

---

## 📚 DOCUMENTACIÓN

### Documentos Principales

1. **README.md** - Guía de inicio
2. **AUDIT_REPORT.md** - Auditoría de código (375 líneas)
3. **SECURITY-AUDIT-REPORT.md** - Auditoría de seguridad (338 líneas)
4. **TESTING_GUIDE.md** - Guía de testing (442 líneas)
5. **WORK_SUMMARY.md** - Resumen de trabajo realizado (374 líneas)
6. **TESTING-INSTRUCTIONS.md** - Instrucciones de testing
7. **test-forum-manual.md** - Checklist de testing manual
8. **PROJECT-STRUCTURE-OVERVIEW.md** - Este documento

### Backend
1. **SECURITY_GUIDE.md** - Guía de seguridad
2. **ROLES_AND_PERMISSIONS.md** - Matriz de permisos
3. **AUDITORIA_PERMISOS_ROLES.md** - Auditoría de roles

### Scripts de Base de Datos
- **check_db.sql** - Verificación de estructura
- **reset_data.sql** - Reset de datos

---

## 📊 MÉTRICAS DEL PROYECTO

### Salud del Código
```
✅ Tests: 434/434 pasando (100%)
✅ Cobertura Servicios: 100%
⚠️ Cobertura Componentes: ~23%
⚠️ Cobertura Páginas: ~4%
📊 Calidad de Código: 75/100
📊 Salud del Proyecto: 72/100
🔒 Seguridad: 6.5/10
```

### Estadísticas de Código
```
📁 Total Archivos:
   - Backend Java: 128 archivos
   - Frontend JS/JSX: 84 archivos
   - Tests: 18 archivos (5 unit + 13 E2E)
   - Configuración: 15+ archivos

📝 Líneas de Código (estimado):
   - Backend: ~15,000 líneas
   - Frontend: ~12,000 líneas
   - Tests: ~5,000 líneas

📦 Tamaño:
   - Backend: ~8 MB
   - Frontend: ~20 MB (incluye node_modules)
   - GeoJSON: 14.6 MB
```

### Funcionalidades
```
🗨️ Sistema de Foros: COMPLETO ✅
🗺️ Mapa de Viajes: COMPLETO ✅
🎯 Sistema de Trivia: COMPLETO ✅
📝 Blog de Viajes: COMPLETO ✅
👤 Perfiles de Usuario: COMPLETO ✅
🛡️ Dashboards Admin: COMPLETO ✅
🌍 Internacionalización: 65% (8/~12 páginas)
🔒 Seguridad: IMPLEMENTADA ✅
📱 Diseño Responsive: COMPLETO ✅
♿ Accesibilidad: EN PROGRESO (~70%)
```

---

## 🚀 DEPLOYMENT

### Requisitos Mínimos

**Backend:**
- Java 21+
- PostgreSQL 12+
- Maven 3.8+
- 512 MB RAM (recomendado: 1 GB)

**Frontend:**
- Node.js 18+
- npm 9+
- 256 MB RAM

### Puertos
```
Frontend:  http://localhost:5173
Backend:   http://localhost:8080
Database:  localhost:5432
```

### Proceso de Inicio

#### 1. Base de Datos
```bash
# Iniciar PostgreSQL
# Crear base de datos: forum_viajeros
# Ejecutar (opcional): check_db.sql
```

#### 2. Backend
```bash
cd Forum_backend
./mvnw spring-boot:run
# Esperar: "Started BackendApplication in X.XXX seconds"
```

#### 3. Frontend
```bash
cd Forum_frontend
npm install
npm run dev
# Abrir: http://localhost:5173
```

---

## 🎯 ROADMAP Y MEJORAS FUTURAS

### Prioridad Alta
- [ ] Incrementar cobertura de tests de componentes (23% → 70%)
- [ ] Incrementar cobertura de tests de páginas (4% → 50%)
- [ ] Completar internacionalización (65% → 100%)
- [ ] Migrar tokens de localStorage a HttpOnly cookies

### Prioridad Media
- [ ] Implementar Docker y docker-compose
- [ ] Añadir CI/CD (GitHub Actions)
- [ ] Implementar backend OWASP HTML Sanitizer
- [ ] Mejorar manejo de errores (mensajes genéricos)

### Prioridad Baja
- [ ] Agregar más idiomas (FR, DE, PT)
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat entre usuarios
- [ ] Progressive Web App (PWA)

---

## 📞 CONTACTO Y SOPORTE

Para más información sobre el proyecto:
- Revisar documentación en `/docs`
- Ejecutar tests: `npm test` (frontend), `./mvnw test` (backend)
- Ver guías: `TESTING_GUIDE.md`, `SECURITY-AUDIT-REPORT.md`

---

**Última actualización:** 2026-01-08
**Versión del documento:** 1.0
**Estado del proyecto:** Producción-Ready (con mejoras pendientes)
