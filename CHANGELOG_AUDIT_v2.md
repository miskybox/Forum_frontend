# Changelog - Auditoria Pre-Deploy v2.0.0

**Fecha:** 2026-02-12  
**Rama:** feature/fix-app  
**Tipo:** Auditoria de seguridad, limpieza y documentacion

---

## Resumen

Auditoria completa del proyecto antes de deploy. Incluye correccion de problemas de seguridad, eliminacion de archivos innecesarios (~170 archivos), y nueva documentacion.

---

## Correcciones de Seguridad

### console.log sin guardia DEV (CRITICO)
- **src/services/authService.js**: 8 sentencias `console.log/error/warn` en el metodo `login()` ahora protegidas con `import.meta.env.DEV`. Antes exponían datos de autenticacion (status, tokens, URLs internas) en produccion.
- **src/services/restCountriesService.js**: 12 sentencias `console.*` protegidas con guardia DEV.
- **src/pages/trivia/TriviaHomePage.jsx**: 5 sentencias `console.*` protegidas.
- **src/pages/trivia/TriviaPlayPage.jsx**: 3 sentencias `console.*` protegidas.

**Total: 28 console.log/error/warn corregidos** que antes llegaban a produccion.

---

## Archivos Eliminados

### Directorio duplicado (151 archivos)
- `Forum_frontend/` — Copia completa del frontend dentro de si mismo (rastreado por git)

### Directorio fantasma
- `Forum_backend/` — Directorio vacio accidental dentro del frontend

### Build output
- `target/` — Directorio Maven que no deberia existir en un proyecto frontend (4 archivos .lst rastreados por git)

### Archivos temporales
- 6 archivos `tmpclaude-*` en backend y frontend
- `nul` — Artefacto de Windows

---

## Archivos Creados

### .env.example (Frontend)
- Template de variables de entorno para el frontend
- Documenta `VITE_API_BASE_URL` como variable requerida

---

## Hallazgos Documentados (Pendientes)

Estos problemas fueron identificados pero NO corregidos (requieren decision del desarrollador):

| Prioridad | Problema |
|-----------|---------|
| CRITICA | Fallback password `"Moderator123!"` hardcodeado en BackendApplication.java |
| CRITICA | `application-prod.properties` no define `cors.allowed-origins` (cae a localhost) |
| ALTA | Passwords debiles en .env (`Admin123!`, `User123!`, `Moderator123!`) |
| MEDIA | `api.js` fallback a `localhost:8080` si falta VITE_API_BASE_URL |
| MEDIA | URL de RestCountries API hardcodeada |

---

## Archivos Modificados

```
M  src/services/authService.js          (guardia DEV en login)
M  src/services/restCountriesService.js (guardia DEV en 12 console.*)
M  src/pages/trivia/TriviaHomePage.jsx  (guardia DEV en 5 console.*)
M  src/pages/trivia/TriviaPlayPage.jsx  (guardia DEV en 3 console.*)
A  .env.example                         (template variables frontend)
D  Forum_frontend/                      (directorio duplicado ~151 archivos)
D  Forum_backend/                       (directorio fantasma vacio)
D  target/                              (build output Maven)
```
