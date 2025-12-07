# 🧪 Guía de Pruebas Manuales - Forum Viajeros
**Última actualización:** 2025-12-07

---

## 🚀 Servidores Necesarios

Asegúrate de que ambos servidores estén ejecutándose:

```bash
# Terminal 1 - Backend
cd Forum_backend
./mvnw.cmd spring-boot:run

# Terminal 2 - Frontend
cd Forum_backend/Forum_frontend
npm run dev
```

**Verificar:**
- ✅ Backend: http://localhost:8080
- ✅ Frontend: http://localhost:5173
- ✅ PostgreSQL: localhost:5432 (forum_viajeros)

---

## 📋 Checklist de Pruebas Manuales

### 1️⃣ Autenticación (10-15 min)

**A. Registro de Usuario**
1. Abrir http://localhost:5173
2. Click en "Registrarse" o "Unirse ahora"
3. Completar formulario:
   - Username: `test_user_` + timestamp
   - Email: `test@example.com`
   - Password: `Test1234!`
   - Confirmar password
4. Click "Registrarse"

**Resultado Esperado:**
- ✅ Registro exitoso
- ✅ Toast notification de éxito
- ✅ Redirección a página principal
- ✅ Usuario autenticado (ver navbar)

**B. Login**
1. Cerrar sesión (si estás logueado)
2. Click en "Iniciar Sesión"
3. Ingresar credenciales:
   - Username: usuario creado anteriormente
   - Password: `Test1234!`
4. Click "Iniciar Sesión"

**Resultado Esperado:**
- ✅ Login exitoso
- ✅ Toast notification de bienvenida
- ✅ Redirección a home
- ✅ Navbar muestra usuario autenticado

**C. Validaciones de Formularios**
1. Ir a login/registro
2. Dejar campos vacíos y enviar
3. Ingresar contraseñas que no coinciden (registro)
4. Ingresar credenciales inválidas (login)

**Resultado Esperado:**
- ✅ Mensajes de error claros por cada campo
- ✅ Mensajes en español
- ✅ Campos con borde rojo en error
- ✅ Error "Usuario o contraseña incorrectos" en login fallido

---

### 2️⃣ Foros (10-15 min)

**A. Ver Foros**
1. Click en "Foros" en navbar
2. Observar lista de foros (puede estar vacía)

**B. Crear Foro**
1. Click en "Crear Foro" (requiere login)
2. Completar formulario:
   - Título: "Mi viaje a Japón"
   - Descripción: "Consejos para viajar a Tokio y Kioto"
   - Categoría: Seleccionar "Asia"
   - Tags: "viajes, japón, asia"
3. Click "Crear"

**Resultado Esperado:**
- ✅ Foro creado exitosamente
- ✅ Aparece en la lista de foros
- ✅ Se puede ver el detalle del foro
- ✅ Usuario es el autor

**C. UTF-8 Test**
1. Crear otro foro con caracteres especiales:
   - Título: "Viajes por España"
   - Descripción: "Descubre ciudades como Málaga, Cádiz y Coruña"
2. Verificar que acentos y ñ se muestran correctamente

**Resultado Esperado:**
- ✅ Caracteres especiales se guardan y muestran correctamente
- ✅ Sin errores de encoding

---

### 3️⃣ Categorías (5 min)

**A. Ver Categorías**
1. Click en "Continentes" o "Categorías" en navbar
2. Verificar que aparecen 8 categorías:
   - General
   - Europa
   - Asia
   - América del Norte
   - América del Sur
   - África
   - Oceanía
   - Antártida

**Resultado Esperado:**
- ✅ 8 categorías visibles
- ✅ Cada una con su descripción
- ✅ Cards o lista bien formateada

---

### 4️⃣ Mapa de Viajes (15-20 min)

**A. Acceder al Mapa**
1. Login (si no estás autenticado)
2. Click en "Mi Mapa" o "Travel Map" en navbar

**Resultado Esperado:**
- ✅ Página del mapa carga
- ✅ Se muestra un mapa mundial (SVG con D3-geo)
- ✅ Estadísticas iniciales:
  - Países visitados: 0
  - Nivel viajero: "🏠 Soñador"
  - Porcentaje mundo: 0%

**B. Verificar que hay Países en la DB**

Opción 1 - Via API (navegador):
```
http://localhost:8080/api/countries
```
Debería retornar JSON con 30 países.

Opción 2 - Via curl:
```bash
curl http://localhost:8080/api/countries | grep -c '"isoCode"'
# Debería mostrar: 30
```

**Resultado Esperado:**
- ✅ 30 países en la base de datos
- ✅ Cada país tiene: isoCode, name, capital, continent, currency, etc.

**C. Agregar País Visitado**
1. En el mapa, click en "Agregar lugar visitado"
2. Seleccionar país (ej: España)
3. Opcional: agregar ciudad (ej: Madrid)
4. Año de visita: 2024
5. Estado: "Visitado"
6. Notas: "Viaje increíble"
7. Click "Guardar"

**Resultado Esperado:**
- ✅ Lugar agregado exitosamente
- ✅ País cambia de color en el mapa
- ✅ Estadísticas se actualizan:
  - Países visitados: 1
  - Nivel viajero actualizado
  - Porcentaje aumenta

**D. Ver Estadísticas**
1. Observar panel de estadísticas
2. Verificar que muestra:
   - Países visitados
   - Ciudades visitadas
   - Continentes visitados
   - Nivel de viajero
   - Porcentaje del mundo

**Resultado Esperado:**
- ✅ Estadísticas coherentes
- ✅ Nivel de viajero correcto según cantidad
- ✅ Cálculo de porcentajes funciona

---

### 5️⃣ Trivia Geográfica (15-20 min)

**A. Acceder a Trivia**
1. Login (si no estás autenticado)
2. Click en "Trivia" en navbar

**Resultado Esperado:**
- ✅ Página de trivia carga
- ✅ Se muestran los modos de juego:
  - Partida Rápida (QUICK)
  - Modo Infinito (PRACTICE)
  - Desafío Diario (DAILY)
  - Duelo (DUEL)
  - Desafío de Dificultad (CHALLENGE)

**B. Verificar que hay Preguntas en la DB**

Via curl:
```bash
TOKEN="tu_token_jwt"
curl -X POST http://localhost:8080/api/trivia/games \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gameMode":"QUICK","difficulty":3,"totalQuestions":10}'
```

**Resultado Esperado:**
- ✅ Se crea un juego exitosamente
- ✅ Se retornan 10 preguntas aleatorias
- ✅ Cada pregunta tiene:
  - Texto de pregunta
  - Respuesta correcta
  - 3 opciones incorrectas
  - Tipo (CAPITAL, FLAG, CURRENCY, CONTINENT)

**C. Jugar Partida Rápida**
1. Click en "Partida Rápida"
2. Seleccionar dificultad (1-5)
3. Click "Comenzar"
4. Responder las 10 preguntas:
   - Verificar que hay 4 tipos de preguntas
   - Capital: "¿Cuál es la capital de...?"
   - Bandera: "¿A qué país pertenece esta bandera?"
   - Moneda: "¿Cuál es la moneda oficial de...?"
   - Continente: "¿En qué continente se encuentra...?"
5. Completar el juego

**Resultado Esperado:**
- ✅ 10 preguntas aleatorias
- ✅ Mix de 4 tipos diferentes
- ✅ Opciones múltiples (4 opciones)
- ✅ Feedback al seleccionar respuesta
- ✅ Puntuación final correcta
- ✅ Porcentaje de acierto calculado

**D. Ver Leaderboard**
1. Al finalizar juego, ver ranking
2. O navegar a sección "Leaderboard"

**Resultado Esperado:**
- ✅ Se muestra tabla de mejores puntuaciones
- ✅ Incluye tu puntuación reciente
- ✅ Ordenado por puntos (mayor a menor)

---

### 6️⃣ Navegación y UI (10 min)

**A. Navegación General**
1. Probar todos los links del navbar
2. Probar links del footer
3. Probar botón "Volver" o breadcrumbs
4. Probar navegación móvil (menú hamburguesa)

**Resultado Esperado:**
- ✅ Todos los links funcionan
- ✅ No hay errores 404 (excepto /blog si no está implementado)
- ✅ Navegación fluida
- ✅ Menú móvil funciona

**B. Responsive Design**
1. Abrir DevTools (F12)
2. Activar modo responsive
3. Probar en:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**Resultado Esperado:**
- ✅ Layout se adapta correctamente
- ✅ Texto legible en todos los tamaños
- ✅ Botones accesibles (mínimo 44x44px en móvil)
- ✅ No hay scroll horizontal

**C. Accesibilidad**
1. Navegar con Tab (teclado)
2. Verificar focus indicators
3. Verificar contraste de colores

**Resultado Esperado:**
- ✅ Navegación por teclado funciona
- ✅ Focus visible en elementos interactivos
- ✅ Contraste suficiente (WCAG AA mínimo)

---

## 🐛 Problemas Conocidos

### Issues Identificados en la Auditoría

1. **Endpoint `/api/countries` lento**
   - Puede tardar varios segundos en responder
   - Posible problema de serialización o consulta
   - **Workaround:** Usar paginación o cache

2. **Ruta `/blog` no implementada**
   - Links en navbar apuntan a /blog
   - Retorna 404
   - **Decisión pendiente:** Implementar o remover

3. **31 tests E2E fallando**
   - Principalmente validaciones de formularios
   - Algunos por falta de features (blog)
   - **Estado:** No bloquean funcionalidad principal

4. **Validación de formularios**
   - LoginForm funciona correctamente
   - RegisterForm pendiente de verificar en profundidad

---

## ✅ Criterios de Aceptación

Para considerar el sistema LISTO:

### Funcionalidades Principales
- ✅ Usuario puede registrarse y hacer login
- ✅ Usuario puede crear, ver y buscar foros
- ✅ Usuario puede agregar países visitados al mapa
- ✅ Estadísticas de viaje se calculan correctamente
- ✅ Usuario puede jugar trivia y ver puntuación
- ✅ Navegación funciona sin errores críticos

### Datos Iniciales
- ✅ 30 países en la base de datos
- ✅ 120 preguntas de trivia generadas
- ✅ 8 categorías de foros
- ✅ 2 roles (USER, ADMIN)

### Calidad
- ✅ No hay errores 500 en operaciones normales
- ✅ UTF-8 funciona con caracteres especiales
- ✅ Validaciones de formularios muestran mensajes claros
- ✅ UI responsive funciona en mobile/tablet/desktop

---

## 🔧 Troubleshooting

### Backend no inicia
```bash
# Verificar Java
java -version  # Debe ser 21.x

# Verificar PostgreSQL
psql -U postgres -l  # Debe mostrar forum_viajeros

# Ver logs
tail -f Forum_backend/logs/spring.log
```

### Frontend no inicia
```bash
# Reinstalar dependencias
cd Forum_backend/Forum_frontend
npm install

# Limpiar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Datos no se cargan
```bash
# Verificar en PostgreSQL
psql -U postgres -d forum_viajeros

# Ver países
SELECT COUNT(*) FROM countries;  -- Debe ser 30

# Ver preguntas trivia
SELECT COUNT(*) FROM trivia_questions;  -- Debe ser ~120

# Si están vacíos, reiniciar backend para ejecutar initializers
```

### Tests E2E fallan
```bash
# Asegurarse que backend esté ejecutándose
curl http://localhost:8080/api/categories

# Ejecutar tests con más workers
npx playwright test --workers=2

# Ver reporte HTML
npx playwright show-report
```

---

## 📊 Checklist Final

Marca cuando completes cada sección:

- [ ] 1. Autenticación (Registro + Login)
- [ ] 2. Foros (Crear + Ver)
- [ ] 3. Categorías (Ver 8 categorías)
- [ ] 4. Mapa de Viajes (Agregar país + Ver stats)
- [ ] 5. Trivia (Jugar partida + Ver leaderboard)
- [ ] 6. Navegación y UI (Responsive + Accesibilidad)

**Tiempo Estimado Total:** 60-90 minutos

---

## 🎯 Próximos Pasos Después de Testing Manual

Si todo funciona correctamente:

1. **Documentar issues encontrados** en GitHub Issues
2. **Crear tests automatizados** para flujos críticos
3. **Optimizar endpoint** `/api/countries` si es lento
4. **Decidir sobre blog:** implementar o remover links
5. **Deployment:** seguir PRE_DEPLOY_CHECKLIST.md

---

**Happy Testing! 🚀**

*Última actualización: 2025-12-07 18:35 UTC+1*
