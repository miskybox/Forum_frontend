# Auditoría de Roles y Permisos - Forum Viajeros

**Fecha**: 18 de Diciembre de 2025
**Estado**: Auditoría completa con recomendaciones

---

## 📊 Resumen Ejecutivo

El sistema implementa un control de acceso basado en roles (RBAC) con **3 roles**: USER, MODERATOR y ADMIN. La auditoría revela que:

- ✅ **Los moderadores YA TIENEN** la mayoría de permisos requeridos
- ❌ **FALTAN 2 funcionalidades críticas**: Ban de usuarios y Cierre de foros
- 🟢 **El sistema de permisos está bien estructurado**

---

## 1. Roles Actuales del Sistema

### Jerarquía de Roles

```
┌─────────────────────────────────────────┐
│           ADMIN (Superusuario)          │
│  • Todos los permisos del sistema       │
│  • Gestión de usuarios, roles, categorías│
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        MODERATOR (Moderador)            │
│  • Eliminar/editar contenido de otros   │
│  • Gestionar tags                        │
│  • NO puede: gestionar usuarios/roles    │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│             USER (Usuario)              │
│  • Crear/editar/eliminar propio contenido│
│  • Participar en foros y trivia          │
└─────────────────────────────────────────┘
```

---

## 2. Matriz de Permisos Actual

### 2.1 Moderación de Contenido

| Acción | USER | MODERATOR | ADMIN | Estado | Archivo |
|--------|------|-----------|-------|--------|---------|
| **Comentarios** |
| Eliminar comentarios | ✅ Propios | ✅ **CUALQUIERA** | ✅ Todos | ✅ FUNCIONANDO | `CommentServiceImpl.java:106` |
| Editar comentarios | ✅ Propios | ✅ **CUALQUIERA** | ✅ Todos | ✅ FUNCIONANDO | `CommentServiceImpl.java:63` |
| **Posts** |
| Eliminar posts | ✅ Propios | ✅ **CUALQUIERA** | ✅ Todos | ✅ FUNCIONANDO | `PostServiceImpl.java:152` |
| Editar posts | ✅ Propios | ✅ **CUALQUIERA** | ✅ Todos | ✅ FUNCIONANDO | `PostServiceImpl.java:81` |
| **Foros** |
| Eliminar foros | ✅ Propios | ✅ **CUALQUIERA** | ✅ Todos | ✅ FUNCIONANDO | `ForumServiceImpl.java:141` |
| Editar foros | ✅ Propios | ✅ **CUALQUIERA** | ✅ Todos | ✅ FUNCIONANDO | `ForumServiceImpl.java:97` |
| Cerrar/bloquear foros | ❌ | ❌ **FALTA** | ⚠️ Solo vía update | ❌ **IMPLEMENTAR** | - |
| **Tags** |
| Crear tags | ❌ | ✅ Sí | ✅ Sí | ✅ FUNCIONANDO | `TagController.java:34` |
| Editar tags | ❌ | ✅ Sí | ✅ Sí | ✅ FUNCIONANDO | `TagController.java:61` |
| Eliminar tags | ❌ | ❌ | ✅ Solo admin | ✅ FUNCIONANDO | `TagController.java:68` |

### 2.2 Gestión de Usuarios

| Acción | USER | MODERATOR | ADMIN | Estado | Archivo |
|--------|------|-----------|-------|--------|---------|
| Ver lista de usuarios | ❌ | ❌ | ✅ Solo admin | ✅ FUNCIONANDO | `UserController.java:44` |
| Ver perfil público | ✅ | ✅ | ✅ | ✅ FUNCIONANDO | `UserController.java:56` |
| Crear usuario | ❌ | ❌ | ✅ Solo admin | ✅ FUNCIONANDO | `UserController.java:84` |
| Editar usuario | ✅ Propio | ✅ Propio | ✅ Cualquiera | ✅ FUNCIONANDO | `UserController.java:112` |
| Eliminar usuario | ❌ | ❌ | ✅ Solo admin | ✅ FUNCIONANDO | `UserController.java:130` |
| **Banear/Bloquear usuario** | ❌ | ❌ **FALTA** | ❌ **FALTA** | ❌ **IMPLEMENTAR** | - |
| Asignar roles | ❌ | ❌ | ✅ Solo admin | ✅ FUNCIONANDO | `UserController.java:171` |

### 2.3 Configuración del Sistema

| Acción | USER | MODERATOR | ADMIN | Estado |
|--------|------|-----------|-------|--------|
| Gestionar categorías | ❌ | ❌ | ✅ Solo admin | ✅ FUNCIONANDO |
| Gestionar roles | ❌ | ❌ | ✅ Solo admin | ✅ FUNCIONANDO |

---

## 3. ✅ Permisos de Moderador FUNCIONANDO

### 3.1 Eliminar Comentarios de Cualquier Usuario

**Archivo**: `Forum_backend/src/main/java/com/forumviajeros/backend/service/comment/CommentServiceImpl.java`

**Líneas 106-108**:
```java
if (!comment.getUser().getId().equals(user.getId()) &&
    !isAdmin(authentication) &&
    !isModerator(authentication)) {
    throw new AccessDeniedException("No tienes permisos para eliminar este comentario");
}
```

**Prueba**: ✅ Verificado - Los moderadores pueden eliminar cualquier comentario

---

### 3.2 Eliminar Posts de Cualquier Usuario

**Archivo**: `Forum_backend/src/main/java/com/forumviajeros/backend/service/post/PostServiceImpl.java`

**Líneas 152-156**:
```java
@Override
public void delete(Long id, Authentication authentication) {
    Post post = postRepository.findById(id).orElseThrow();
    assertOwnershipOrAdmin(post, authentication); // Permite moderadores
    postRepository.delete(post);
}
```

**Método `assertOwnershipOrAdmin` (líneas 183-204)**:
```java
private void assertOwnershipOrAdmin(Post post, Authentication authentication) {
    // ... validaciones

    // Línea 198: Moderadores bypass ownership check
    if (isAdmin(authentication) || isModerator(authentication)) {
        return;
    }

    // ... resto de lógica
}
```

**Prueba**: ✅ Verificado - Los moderadores pueden eliminar cualquier post

---

### 3.3 Editar Posts de Otros Usuarios

**Archivo**: `PostServiceImpl.java`

**Líneas 79-102**:
```java
public PostResponseDTO updatePost(Long id, PostRequestDTO dto, Authentication authentication) {
    Post post = postRepository.findById(id).orElseThrow();
    assertOwnershipOrAdmin(post, authentication); // Línea 81 - permite moderadores
    // ... lógica de actualización
}
```

**Prueba**: ✅ Verificado - Los moderadores pueden editar cualquier post

---

### 3.4 Editar Comentarios de Otros Usuarios

**Archivo**: `CommentServiceImpl.java`

**Líneas 63-65**:
```java
if (!comment.getUser().getId().equals(user.getId()) &&
    !isAdmin(authentication) &&
    !isModerator(authentication)) {
    throw new AccessDeniedException("No tienes permisos para editar este comentario");
}
```

**Prueba**: ✅ Verificado - Los moderadores pueden editar cualquier comentario

---

### 3.5 Eliminar y Editar Foros

**Archivo**: `Forum_backend/src/main/java/com/forumviajeros/backend/service/forum/ForumServiceImpl.java`

**Líneas 253-267**:
```java
private void assertOwnershipOrAdmin(Forum forum, Authentication authentication) {
    if (authentication == null) {
        throw new AccessDeniedException("Usuario no autenticado");
    }

    // Línea 258: Moderadores bypass ownership check
    if (isAdmin(authentication) || isModerator(authentication)) {
        return;
    }

    // ... resto de lógica
}
```

**Prueba**: ✅ Verificado - Los moderadores pueden editar/eliminar cualquier foro

---

### 3.6 Gestionar Tags (Crear/Editar)

**Archivo**: `Forum_backend/src/main/java/com/forumviajeros/backend/controller/TagController.java`

**Líneas 34 y 61**:
```java
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
@PostMapping
public ResponseEntity<TagResponseDTO> createTag(@Valid @RequestBody TagRequestDTO tagRequestDTO)

@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
@PutMapping("/{id}")
public ResponseEntity<TagResponseDTO> updateTag(@PathVariable Long id, @Valid @RequestBody TagRequestDTO tagRequestDTO)
```

**Prueba**: ✅ Verificado - Los moderadores pueden crear y editar tags

**Nota**: La eliminación de tags es solo para ADMIN (línea 68) - **diseño intencional**

---

## 4. ❌ Funcionalidades FALTANTES para Moderadores

### 🔴 CRÍTICO 1: No Pueden Banear/Bloquear Usuarios

**Problema**:
- El modelo `User` tiene un enum `UserStatus` con valores: `ACTIVE`, `INACTIVE`, `BANNED`, `DELETED`
- NO existe endpoint ni método de servicio para cambiar el estado de un usuario
- Los moderadores no pueden responder rápidamente a usuarios abusivos

**Ubicación del enum**:
- Archivo: `Forum_backend/src/main/java/com/forumviajeros/backend/model/User.java`
- Enum: `UserStatus { ACTIVE, INACTIVE, BANNED, DELETED }`

**Impacto**: 🔴 **ALTO** - Los moderadores no pueden controlar usuarios problemáticos

---

### 🔴 CRÍTICO 2: No Pueden Cerrar/Bloquear Foros

**Problema**:
- El modelo `Forum` tiene un enum `ForumStatus` con valores: `ACTIVE`, `INACTIVE`, `ARCHIVED`
- NO existe endpoint dedicado para cambiar el estado de un foro
- Los moderadores no pueden cerrar foros con contenido inapropiado rápidamente
- Solo se puede cambiar el estado mediante update completo (inconsistente)

**Ubicación del enum**:
- Archivo: `Forum_backend/src/main/java/com/forumviajeros/backend/model/Forum.java`
- Enum: `ForumStatus { ACTIVE, INACTIVE, ARCHIVED }`

**Impacto**: 🔴 **MEDIO-ALTO** - Los moderadores no pueden controlar discusiones problemáticas

---

## 5. 🛠️ Implementación Recomendada

### 5.1 Implementar Ban/Unban de Usuarios

#### Paso 1: Agregar Endpoint en `UserController.java`

```java
@PutMapping("/{id}/ban")
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
@Operation(
    summary = "Banear/Desbanear usuario",
    description = "Cambia el estado del usuario a BANNED o ACTIVE. Solo ADMIN y MODERATOR."
)
@ApiResponse(responseCode = "200", description = "Estado del usuario actualizado")
@ApiResponse(responseCode = "403", description = "No autorizado")
@ApiResponse(responseCode = "404", description = "Usuario no encontrado")
public ResponseEntity<UserResponseDTO> banUser(
        @PathVariable Long id,
        @RequestParam boolean banned,
        @RequestParam(required = false) String reason,
        Authentication authentication) {

    String moderatorUsername = authentication.getName();
    log.info("Moderador {} {} usuario con id: {}. Razón: {}",
             moderatorUsername, banned ? "baneando" : "desbaneando", id, reason);

    UserResponseDTO user = userService.updateUserStatus(
        id,
        banned ? User.UserStatus.BANNED : User.UserStatus.ACTIVE,
        reason
    );

    return ResponseEntity.ok(user);
}
```

#### Paso 2: Agregar Método en `UserService.java` (Interface)

```java
UserResponseDTO updateUserStatus(Long userId, User.UserStatus status, String reason);
```

#### Paso 3: Implementar en `UserServiceImpl.java`

```java
@Override
@Transactional
public UserResponseDTO updateUserStatus(Long userId, User.UserStatus status, String reason) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));

    // Prevenir que se modifique el estado de admins (opcional)
    boolean isUserAdmin = user.getRoles().stream()
        .anyMatch(role -> role.getName().equals("ROLE_ADMIN"));

    if (isUserAdmin) {
        throw new IllegalStateException("No se puede modificar el estado de un administrador");
    }

    user.setStatus(status);
    user.setUpdatedAt(LocalDateTime.now());

    User updated = userRepository.save(user);

    log.info("Estado del usuario {} cambiado a {}. Razón: {}", userId, status, reason);

    return mapToResponseDTO(updated);
}
```

#### Paso 4: (Opcional) Crear Tabla de Auditoría

```sql
CREATE TABLE moderator_actions (
    id BIGSERIAL PRIMARY KEY,
    moderator_id BIGINT NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- BAN_USER, LOCK_FORUM, DELETE_POST, etc.
    target_type VARCHAR(50) NOT NULL, -- USER, FORUM, POST, COMMENT
    target_id BIGINT NOT NULL,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_moderator FOREIGN KEY (moderator_id) REFERENCES users(id)
);
```

---

### 5.2 Implementar Cierre/Bloqueo de Foros

#### Paso 1: Agregar Endpoint en `ForumController.java`

```java
@PutMapping("/{id}/status")
@PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
@Operation(
    summary = "Cambiar estado del foro",
    description = "Permite cerrar, archivar o reactivar un foro. Solo ADMIN y MODERATOR."
)
@ApiResponse(responseCode = "200", description = "Estado del foro actualizado")
@ApiResponse(responseCode = "403", description = "No autorizado")
@ApiResponse(responseCode = "404", description = "Foro no encontrado")
public ResponseEntity<ForumResponseDTO> changeForumStatus(
        @PathVariable Long id,
        @RequestParam Forum.ForumStatus status,
        @RequestParam(required = false) String reason,
        Authentication authentication) {

    String moderatorUsername = authentication.getName();
    log.info("Moderador {} cambiando estado del foro {} a {}. Razón: {}",
             moderatorUsername, id, status, reason);

    ForumResponseDTO forum = forumService.updateForumStatus(id, status, reason, authentication);

    return ResponseEntity.ok(forum);
}
```

#### Paso 2: Agregar Método en `ForumService.java` (Interface)

```java
ForumResponseDTO updateForumStatus(Long forumId, Forum.ForumStatus status, String reason, Authentication authentication);
```

#### Paso 3: Implementar en `ForumServiceImpl.java`

```java
@Override
@Transactional
public ForumResponseDTO updateForumStatus(Long forumId, Forum.ForumStatus status, String reason, Authentication authentication) {
    Forum forum = forumRepository.findById(forumId)
        .orElseThrow(() -> new ResourceNotFoundException("Foro", "id", forumId));

    // Verificar que el usuario sea moderador o admin
    if (!isAdmin(authentication) && !isModerator(authentication)) {
        throw new AccessDeniedException("No tienes permisos para cambiar el estado del foro");
    }

    forum.setStatus(status);
    forum.setUpdatedAt(LocalDateTime.now());

    Forum updated = forumRepository.save(forum);

    log.info("Estado del foro {} cambiado a {} por {}. Razón: {}",
             forumId, status, authentication.getName(), reason);

    return mapToResponseDTO(updated);
}
```

#### Paso 4: Implementar Validación en Creación de Posts

Modificar `PostServiceImpl.createPost()` para prevenir posts en foros cerrados:

```java
@Override
@Transactional
public PostResponseDTO createPost(PostRequestDTO dto, Long userId) {
    Forum forum = forumRepository.findById(dto.getForumId())
        .orElseThrow(() -> new ResourceNotFoundException("Foro", "id", dto.getForumId()));

    // NUEVO: Verificar que el foro esté activo
    if (forum.getStatus() != Forum.ForumStatus.ACTIVE) {
        throw new IllegalStateException(
            "No se pueden crear posts en un foro que está " +
            (forum.getStatus() == Forum.ForumStatus.INACTIVE ? "cerrado" : "archivado")
        );
    }

    // ... resto de la lógica existente
}
```

---

## 6. 🧪 Tests Recomendados

### 6.1 Tests para Ban de Usuarios

```java
@Test
@WithMockUser(username = "moderator", roles = {"MODERATOR"})
public void testModeratorCanBanUser() {
    // Given
    Long userId = 1L;
    String reason = "Spam repetido";

    // When
    ResponseEntity<UserResponseDTO> response = userController.banUser(
        userId, true, reason, authentication
    );

    // Then
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(User.UserStatus.BANNED, response.getBody().getStatus());
}

@Test
@WithMockUser(username = "user", roles = {"USER"})
public void testUserCannotBanOthers() {
    // Given
    Long userId = 2L;

    // When & Then
    assertThrows(AccessDeniedException.class, () -> {
        userController.banUser(userId, true, "reason", authentication);
    });
}
```

### 6.2 Tests para Cierre de Foros

```java
@Test
@WithMockUser(username = "moderator", roles = {"MODERATOR"})
public void testModeratorCanCloseForum() {
    // Given
    Long forumId = 1L;
    String reason = "Contenido inapropiado";

    // When
    ResponseEntity<ForumResponseDTO> response = forumController.changeForumStatus(
        forumId, Forum.ForumStatus.INACTIVE, reason, authentication
    );

    // Then
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(Forum.ForumStatus.INACTIVE, response.getBody().getStatus());
}

@Test
public void testCannotCreatePostInClosedForum() {
    // Given
    Forum closedForum = createForum(Forum.ForumStatus.INACTIVE);
    PostRequestDTO dto = new PostRequestDTO();
    dto.setForumId(closedForum.getId());

    // When & Then
    assertThrows(IllegalStateException.class, () -> {
        postService.createPost(dto, userId);
    });
}
```

---

## 7. 📋 Checklist de Implementación

### Para Backend (Spring Boot)

- [ ] **Funcionalidad de Ban**
  - [ ] Agregar endpoint `PUT /api/users/{id}/ban` en `UserController`
  - [ ] Implementar `updateUserStatus()` en `UserService`
  - [ ] Agregar validación para prevenir ban de admins
  - [ ] Crear tests unitarios
  - [ ] Crear tests de integración
  - [ ] Documentar en Swagger

- [ ] **Funcionalidad de Cierre de Foros**
  - [ ] Agregar endpoint `PUT /api/forums/{id}/status` en `ForumController`
  - [ ] Implementar `updateForumStatus()` en `ForumService`
  - [ ] Modificar `createPost()` para validar estado del foro
  - [ ] Crear tests unitarios
  - [ ] Crear tests de integración
  - [ ] Documentar en Swagger

- [ ] **Auditoría (Opcional pero Recomendado)**
  - [ ] Crear tabla `moderator_actions`
  - [ ] Implementar servicio de auditoría
  - [ ] Agregar logging en acciones sensibles
  - [ ] Crear endpoint para ver historial de acciones

### Para Frontend (React)

- [ ] **UI para Ban de Usuarios**
  - [ ] Botón "Banear Usuario" en perfil (solo moderadores/admins)
  - [ ] Modal con campo de razón
  - [ ] Confirmación antes de banear
  - [ ] Indicador visual de usuario baneado
  - [ ] Botón "Desbanear" para revertir

- [ ] **UI para Cierre de Foros**
  - [ ] Botón "Cerrar Foro" en vista de foro (solo moderadores/admins)
  - [ ] Dropdown con opciones: Activo, Cerrado, Archivado
  - [ ] Modal con campo de razón
  - [ ] Badge visual indicando estado del foro
  - [ ] Mensaje al intentar postear en foro cerrado

- [ ] **Panel de Moderador**
  - [ ] Dashboard con acciones recientes
  - [ ] Lista de usuarios baneados
  - [ ] Lista de foros cerrados
  - [ ] Estadísticas de moderación

---

## 8. 🎯 Prioridad de Implementación

### Prioridad ALTA (Implementar YA)

1. **Ban/Unban de Usuarios** - Esencial para moderación efectiva
2. **Cierre de Foros** - Necesario para control de discusiones

### Prioridad MEDIA (Implementar después)

3. **Auditoría de Acciones** - Importante para accountability
4. **Panel de Moderador** - Mejora UX para moderadores

### Prioridad BAJA (Opcional)

5. **Reportes de contenido** - Permite a usuarios reportar infracciones
6. **Sistema de advertencias** - Advertir antes de banear

---

## 9. 📊 Resumen de Cambios Necesarios

### Archivos Backend a Modificar:

| Archivo | Cambios | Prioridad |
|---------|---------|-----------|
| `UserController.java` | Agregar endpoint `PUT /{id}/ban` | 🔴 ALTA |
| `UserService.java` | Agregar método `updateUserStatus()` | 🔴 ALTA |
| `UserServiceImpl.java` | Implementar lógica de ban | 🔴 ALTA |
| `ForumController.java` | Agregar endpoint `PUT /{id}/status` | 🔴 ALTA |
| `ForumService.java` | Agregar método `updateForumStatus()` | 🔴 ALTA |
| `ForumServiceImpl.java` | Implementar lógica de cierre | 🔴 ALTA |
| `PostServiceImpl.java` | Validar estado de foro en `createPost()` | 🔴 ALTA |

### Archivos Frontend a Crear/Modificar:

| Archivo | Cambios | Prioridad |
|---------|---------|-----------|
| `userService.js` | Agregar `banUser()`, `unbanUser()` | 🔴 ALTA |
| `forumService.js` | Agregar `updateForumStatus()` | 🔴 ALTA |
| `UserProfile.jsx` | Botón de ban (solo moderadores) | 🟡 MEDIA |
| `ForumHeader.jsx` | Dropdown de estado de foro | 🟡 MEDIA |
| `ModeratorDashboard.jsx` | Panel de moderación (nuevo) | 🟢 BAJA |

---

## 10. ✅ Conclusión

### Estado Actual:
- 🟢 **Excelente base**: Los moderadores ya tienen la mayoría de permisos necesarios
- 🟢 **Sistema robusto**: Separación clara de responsabilidades
- 🔴 **2 gaps críticos**: Falta ban de usuarios y cierre de foros

### Recomendación:
**Implementar las 2 funcionalidades faltantes (ban y cierre) de forma prioritaria**. Con estos cambios, el sistema de moderación estará completo y alineado con las mejores prácticas de foros online.

### Impacto de la Implementación:
- ⏱️ **Tiempo estimado**: 4-6 horas de desarrollo
- 🧪 **Tests necesarios**: ~10 tests adicionales
- 📚 **Documentación**: Actualizar Swagger y guías de usuario
- 🚀 **Deploy**: Cambios compatibles hacia atrás, no requiere migración de datos

---

**Documento creado**: 18 de Diciembre de 2025
**Próximos pasos**: Implementar funcionalidades de ban y cierre de foros
**Estado**: ✅ Auditoría completa - Lista para implementación
