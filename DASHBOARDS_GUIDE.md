# Guía de Dashboards - Forum Viajeros

## 📊 Dashboards Disponibles

### 1. Dashboard de Administrador
**Ruta**: `/admin/dashboard`  
**Acceso**: Solo usuarios con rol `ROLE_ADMIN`

#### Funcionalidades
- **Estadísticas Generales**:
  - Total de usuarios registrados
  - Total de foros creados
  - Total de posts publicados
  - Total de categorías

- **Gestión de Usuarios**:
  - Lista de usuarios recientes
  - Ver roles de cada usuario
  - Eliminar usuarios

- **Vista de Contenido**:
  - Foros recientes
  - Navegación rápida a foros

#### Características
- Diseño responsive
- Tarjetas de estadísticas con iconos
- Tabla de usuarios con acciones
- Lista de foros recientes

### 2. Dashboard de Moderador
**Ruta**: `/moderator/dashboard`  
**Acceso**: Usuarios con rol `ROLE_MODERATOR` o `ROLE_ADMIN`

#### Funcionalidades
- **Estadísticas de Contenido**:
  - Total de foros
  - Total de posts
  - Total de comentarios
  - Contenido pendiente de moderación

- **Moderación de Foros**:
  - Lista de foros recientes
  - Editar cualquier foro
  - Eliminar cualquier foro

- **Moderación de Posts**:
  - Lista de posts recientes
  - Editar cualquier post
  - Eliminar cualquier post

#### Características
- Diseño responsive
- Acciones rápidas de moderación
- Vista de contenido reciente
- Navegación directa a edición

## 🔐 Control de Acceso

### Protección de Rutas
Los dashboards están protegidos usando `ProtectedRoute` con `requiredRoles`:

```jsx
<Route path="/admin/dashboard" element={
  <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
    <AdminDashboardPage />
  </ProtectedRoute>
} />
```

### Verificación en Componentes
Cada dashboard verifica los permisos antes de cargar:

```jsx
useEffect(() => {
  if (!currentUser || !hasRole('ROLE_ADMIN')) {
    navigate('/')
    return
  }
  loadDashboardData()
}, [currentUser, hasRole, navigate])
```

## 🎨 Diseño

### Tarjetas de Estadísticas
- Iconos representativos
- Colores temáticos por tipo de dato
- Números grandes y legibles
- Diseño responsive

### Tablas y Listas
- Diseño limpio y organizado
- Acciones rápidas (Editar/Eliminar)
- Navegación directa al contenido
- Hover effects para mejor UX

## 📱 Responsive Design

Los dashboards están optimizados para:
- **Desktop**: Grid de 4 columnas para estadísticas
- **Tablet**: Grid de 2 columnas
- **Mobile**: Grid de 1 columna

## 🚀 Acceso Rápido

### Desde el Navbar
Los enlaces a los dashboards aparecen en el menú de usuario:
- **Panel Moderador**: Visible para `ROLE_MODERATOR` y `ROLE_ADMIN`
- **Panel Admin**: Visible solo para `ROLE_ADMIN`

### Navegación Directa
- `/admin/dashboard` - Dashboard de administrador
- `/moderator/dashboard` - Dashboard de moderador

## 🔄 Actualización de Datos

Los dashboards cargan datos automáticamente al montarse y pueden actualizarse:
- Al eliminar usuarios (Admin)
- Al eliminar foros/posts (Moderador)
- Mediante botón de refrescar (futuro)

## 📝 Notas de Implementación

### Servicios Utilizados
- `userService.getAllUsers()` - Lista de usuarios
- `forumService.getAllForums()` - Lista de foros
- `postService.getAllPosts()` - Lista de posts
- `categoryService.getAllCategories()` - Lista de categorías

### Manejo de Errores
- Try-catch en todas las llamadas
- Mensajes de error con `toast`
- Fallbacks para datos faltantes

### Optimización
- Carga paralela de datos con `Promise.all`
- Paginación para listas grandes
- Límite de elementos mostrados (10 usuarios, 5 foros/posts)

