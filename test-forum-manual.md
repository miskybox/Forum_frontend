# Prueba Manual de Funcionalidad de Foros

## Estado de los Servidores

✅ **Frontend:** http://localhost:5173
✅ **Backend:** http://localhost:8080 (iniciando...)

---

## Plan de Pruebas Manuales

### 1. Login y Autenticación
- [ ] Abrir http://localhost:5173
- [ ] Click en "Login" en la navbar
- [ ] Usar credenciales: admin / Admin123!
- [ ] Verificar redirección a home
- [ ] Verificar que aparece username en navbar

### 2. Navegación a Foros
- [ ] Click en "Foros" en la navbar
- [ ] Verificar que se muestra la lista de foros
- [ ] Verificar textos en español (idioma por defecto)
- [ ] Cambiar idioma a inglés
- [ ] Verificar que los textos cambian a inglés
- [ ] Verificar colores: bg-earth-50 (no bg-white)

### 3. Crear Nuevo Foro
- [ ] Click en "CREAR FORO" (botón verde)
- [ ] Completar formulario:
  - Título: "Test Forum - Manual Testing"
  - Descripción: "Forum created for manual testing"
  - Categoría: Seleccionar una categoría
- [ ] Click en "Crear"
- [ ] Verificar redirección al foro creado
- [ ] Verificar que el foro aparece en la lista

### 4. Buscar Foros
- [ ] En la lista de foros, usar barra de búsqueda
- [ ] Buscar "Test"
- [ ] Verificar que aparece el foro creado
- [ ] Limpiar búsqueda
- [ ] Verificar que vuelven a aparecer todos los foros

### 5. Crear Post en el Foro
- [ ] Entrar al foro "Test Forum"
- [ ] Click en "CREAR POST" o botón similar
- [ ] Completar formulario:
  - Título: "Test Post - Comment Testing"
  - Contenido: "Este post es para probar comentarios"
- [ ] Click en "Publicar"
- [ ] Verificar que el post se muestra
- [ ] Verificar colores: bg-earth-50

### 6. Comentar en Post
- [ ] Abrir el post creado
- [ ] Scroll hasta sección de comentarios
- [ ] Escribir comentario: "Este es un comentario de prueba"
- [ ] Click en "Comentar" o "Enviar"
- [ ] Verificar que el comentario aparece
- [ ] Verificar que muestra username correcto
- [ ] Verificar colores del comentario: bg-earth-50

### 7. Responder Comentario (si está implementado)
- [ ] Click en "Responder" en un comentario
- [ ] Escribir respuesta
- [ ] Verificar que se muestra correctamente

### 8. Editar Post (si eres el autor)
- [ ] En el post creado, buscar botón "Editar"
- [ ] Click en "Editar"
- [ ] Modificar título o contenido
- [ ] Guardar cambios
- [ ] Verificar que los cambios se reflejan
- [ ] Verificar colores del formulario: bg-earth-50

### 9. Tags/Etiquetas (si está implementado)
- [ ] Verificar si hay sistema de tags
- [ ] Agregar tags al post
- [ ] Verificar que se muestran correctamente

### 10. Verificación de Internacionalización
- [ ] Cambiar idioma a inglés (botón con bandera)
- [ ] Verificar traducciones en:
  - Lista de foros
  - Botones
  - Mensajes de error
  - Formularios
- [ ] Cambiar de vuelta a español
- [ ] Verificar que todo vuelve a español

### 11. Verificación de Paleta de Colores
- [ ] Inspeccionar elementos en DevTools (F12)
- [ ] Verificar que NO hay clases `bg-white`
- [ ] Verificar que se usa `bg-earth-50`
- [ ] Verificar que NO hay clases `dark:`
- [ ] Verificar colores de la paleta personalizada

### 12. Pruebas de Estados Vacíos
- [ ] Buscar texto que no existe
- [ ] Verificar mensaje "No se encontraron resultados"
- [ ] Verificar botón "VER TODOS"
- [ ] Verificar que textos están internacionalizados

---

## Checklist de Verificación Visual

### Colores Correctos (Paleta Personalizada)
- [ ] bg-earth-50 en cards y formularios
- [ ] bg-ocean-500 en botones primarios
- [ ] Sin bg-white en ningún lugar
- [ ] Sin clases dark: en ningún lugar

### Internacionalización
- [ ] Todos los textos en ForumList están traducidos
- [ ] Botones en español/inglés según idioma seleccionado
- [ ] Mensajes de error traducidos
- [ ] Placeholders traducidos

### Funcionalidad
- [ ] Login funciona correctamente
- [ ] Crear foro funciona
- [ ] Crear post funciona
- [ ] Comentarios funcionan
- [ ] Edición funciona (si tienes permisos)
- [ ] Búsqueda funciona

---

## Comandos para Verificar Backend

```bash
# Verificar que el backend está corriendo
netstat -ano | findstr :8080

# Ver logs del backend
# (Mirar la consola donde se inició mvnw.cmd spring-boot:run)
```

## URLs Útiles

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health (si está habilitado)

---

## Resultado Esperado

✅ Todas las funcionalidades funcionan correctamente
✅ No hay errores en consola del navegador
✅ No hay errores en logs del backend
✅ Internacionalización funciona en español e inglés
✅ Colores de la paleta personalizada se aplican correctamente
✅ No hay clases bg-white ni dark: en el código renderizado
