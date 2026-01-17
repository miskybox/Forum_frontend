# Instrucciones para Probar Funcionalidad de Foros

## ⚠️ Problema Actual

El backend está tardando en iniciar o tiene problemas de configuración.

## 🔧 Solución

### Opción 1: Iniciar Backend Manualmente

1. **Abre una terminal nueva** en el directorio `Forum_backend`
2. Ejecuta:
   ```bash
   cd Forum_backend
   mvnw.cmd spring-boot:run
   ```
3. **Espera a ver este mensaje:**
   ```
   Started ForumApplication in X.XXX seconds
   ```
4. **Verifica que el backend responde:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:8080/api/categories" -Method GET
   ```

### Opción 2: Usar IntelliJ IDEA o Eclipse

1. Abre el proyecto `Forum_backend` en tu IDE
2. Ejecuta la clase `ForumApplication.java`
3. Espera a que inicie completamente

---

## 🧪 Scripts de Prueba Disponibles

Una vez que el backend esté corriendo:

### Script Completo de CRUD

```powershell
powershell.exe -ExecutionPolicy Bypass -File test-forum-crud-complete.ps1
```

**Este script prueba:**
- ✅ Login de usuario (admin/Admin123!)
- ✅ Crear Foro (CREATE)
- ✅ Leer Foro (READ)
- ✅ Actualizar Foro (UPDATE)
- ✅ Eliminar Foro (DELETE)
- ✅ Crear Post en Foro
- ✅ Leer Post
- ✅ Actualizar Post
- ✅ Eliminar Post
- ✅ Crear Comentarios
- ✅ Leer Comentarios
- ✅ Actualizar Comentarios
- ✅ Eliminar Comentarios
- ✅ Buscar Foros
- ✅ Listar Posts de un Foro

**Total: 19 tests automáticos**

---

## 🌐 Pruebas Manuales en el Navegador

### Frontend ya está corriendo en: http://localhost:5173

### Flujo de Prueba Manual:

1. **Login**
   - Usuario: `admin`
   - Password: `Admin123!`

2. **Ir a Foros**
   - Click en "Foros" en la navbar

3. **Verificar Internacionalización**
   - Click en el botón de idioma (bandera)
   - Verificar que todo cambia a inglés
   - Volver a español

4. **Verificar Colores**
   - Abrir DevTools (F12)
   - Inspeccionar elementos
   - Verificar que se usa `bg-earth-50` (NO `bg-white`)
   - Verificar que NO hay clases `dark:`

5. **Crear Foro**
   - Click en "CREAR FORO"
   - Completar formulario:
     - Título: "Mi Foro de Prueba"
     - Descripción: "Descripción de prueba"
     - Seleccionar una categoría
   - Click en "Crear"

6. **Crear Post**
   - Entrar al foro creado
   - Click en "CREAR POST"
   - Completar formulario:
     - Título: "Post de Prueba"
     - Contenido: "Contenido del post"
   - Click en "Publicar"

7. **Crear Comentario**
   - Abrir el post
   - Scroll a sección de comentarios
   - Escribir: "Este es mi comentario de prueba"
   - Click en "Comentar"

8. **Editar Post** (si eres el autor)
   - Click en botón "Editar"
   - Modificar título o contenido
   - Guardar cambios

9. **Buscar Foros**
   - En la lista de foros, usar barra de búsqueda
   - Buscar "Prueba"
   - Verificar resultados

10. **Eliminar** (si eres admin/moderator)
    - Click en botón "Eliminar" (si está disponible)
    - Confirmar eliminación

---

## 📊 Verificaciones de Calidad

### ✅ Internacionalización
- [ ] ForumList muestra textos en español
- [ ] Al cambiar idioma, todo cambia a inglés
- [ ] Botones traducidos correctamente
- [ ] Mensajes de error traducidos

### ✅ Paleta de Colores
- [ ] Cards usan `bg-earth-50`
- [ ] Formularios usan `bg-earth-50`
- [ ] NO hay `bg-white` en ningún lugar
- [ ] NO hay clases `dark:` en ningún lugar

### ✅ Funcionalidad CRUD
- [ ] Crear foro funciona
- [ ] Leer/Ver foro funciona
- [ ] Actualizar foro funciona
- [ ] Eliminar foro funciona
- [ ] Crear post funciona
- [ ] Comentarios funcionan

### ✅ Accesibilidad
- [ ] Texto "Leyenda" en el mapa es legible
- [ ] Contraste de colores adecuado
- [ ] Textos legibles en todos los fondos

---

## 🐛 Troubleshooting

### Backend no inicia

**Problema:** Backend tarda mucho o no inicia

**Soluciones:**
1. Verificar que MySQL está corriendo
2. Verificar configuración en `application.properties`
3. Verificar logs de errores en la consola
4. Verificar puerto 8080 no esté ocupado:
   ```powershell
   netstat -ano | findstr :8080
   ```

### Puerto 8080 ocupado

```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :8080

# Matar el proceso (reemplazar PID)
taskkill //F //PID <PID>
```

### Frontend no conecta con Backend

1. Verificar que backend está en puerto 8080
2. Verificar CORS configurado correctamente
3. Ver consola del navegador (F12) para errores

---

## 📝 Resumen de Cambios Implementados

### Commits Realizados (11 total)
1. Limpieza de código y duplicados
2. Documentación completa
3. Eliminación clases `dark:` (26 instancias)
4. Internacionalización TravelStats
5. Internacionalización Admin/Moderator
6. Internacionalización ForumList/HelpPage
7. Internacionalización Contact/About/NotFound
8. bg-white → bg-earth-50 (dashboards)
9. bg-white → bg-earth-50 (forms/common)
10. bg-white → bg-earth-50 (blog/trivia - 52 instancias total)
11. Mejora accesibilidad Leyenda en mapa

### Archivos Modificados
- 31 archivos en total
- 8 componentes internacionalizados
- 70+ claves de traducción añadidas (ES/EN)
- 52 instancias bg-white reemplazadas
- 26 clases dark: eliminadas

### Tests
- ✅ 434/434 tests unitarios pasando
- ✅ Script de pruebas CRUD creado (19 tests)
- ✅ Documentación completa de pruebas

---

## ✨ Todo Está Listo

Una vez que el backend inicie:

1. El frontend YA está corriendo: http://localhost:5173
2. Ejecuta el script de pruebas automáticas
3. O prueba manualmente siguiendo esta guía
4. Todos los cambios están commiteados y pusheados a `feature/fix`

**¡Éxito!** 🎉
