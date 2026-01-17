# AUDITORÍA DE SEGURIDAD - FORUM VIAJEROS

**Fecha:** 2026-01-08
**Puntuación de Seguridad:** 6.5/10
**Estado:** ⚠️ REQUIERE ACCIÓN INMEDIATA

---

## RESUMEN EJECUTIVO

Se identificaron **11 vulnerabilidades** distribuidas en:
- 🔴 **4 CRÍTICAS** (requieren acción inmediata)
- 🟠 **3 ALTAS** (resolver esta semana)
- 🟡 **3 MEDIAS** (resolver este mes)
- 🟢 **1 BAJA** (mejora continua)

---

## 🔴 VULNERABILIDADES CRÍTICAS

### 1. Tokens JWT en localStorage
**Severidad:** CRÍTICA
**Archivo:** `Forum_frontend/src/contexts/AuthContext.jsx:10-11`

**Problema:**
```javascript
const [token, setToken] = useState(localStorage.getItem('token') || null)
const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null)
```

Los tokens se almacenan en localStorage, vulnerable a XSS. Si un atacante ejecuta JavaScript, puede robar tokens.

**Impacto:** Secuestro de sesión, robo de identidad

**Solución:**
- Migrar a cookies HttpOnly con flags: `HttpOnly`, `Secure`, `SameSite=Strict`
- Backend debe enviar tokens en cookies, no en response body

---

### 2. Credenciales Hardcodeadas en .env

**Severidad:** CRÍTICA
**Archivos:** `.env`, `Forum_backend/.env`

**Problema:**
```env
DB_PASSWORD=postgres
JWT_SECRET_KEY=super-secret-key-for-jwt-token-generation-must-be-at-least-256-bits-long-for-security
ADMIN_PASSWORD=Admin123!
USER_PASSWORD=User123!
```

Archivos `.env` commiteados al repositorio con credenciales reales.

**Impacto:** Acceso no autorizado a base de datos, compromiso total del sistema

**Solución URGENTE:**
```bash
# 1. Limpiar historial Git
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env Forum_backend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Generar nuevo JWT secret
openssl rand -base64 64

# 3. Cambiar TODAS las credenciales
# 4. Añadir .env a .gitignore (ya está, verificar)
# 5. Usar variables de entorno del sistema en producción
```

---

### 3. Sanitización Débil en Backend

**Severidad:** CRÍTICA
**Archivo:** `Forum_backend/src/main/java/com/forumviajeros/backend/util/HtmlSanitizer.java:10`

**Problema:**
```java
public static String stripAllTags(String input) {
    if (input == null) return null;
    return input.replaceAll("<[^>]*>", "");  // Regex vulnerable a bypass
}
```

Implementación básica vulnerable a bypass XSS.

**Impacto:** XSS en comentarios, posts, nombres de foros

**Solución:**
```xml
<!-- Añadir a pom.xml -->
<dependency>
    <groupId>com.googlecode.owasp-java-html-sanitizer</groupId>
    <artifactId>owasp-java-html-sanitizer</artifactId>
    <version>20220608.1</version>
</dependency>
```

```java
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

public class HtmlSanitizer {
    private static final PolicyFactory POLICY = Sanitizers.FORMATTING
        .and(Sanitizers.LINKS)
        .and(Sanitizers.BLOCKS);

    public static String sanitize(String input) {
        if (input == null) return null;
        return POLICY.sanitize(input);
    }
}
```

---

### 4. CSRF Deshabilitado + Tokens en localStorage

**Severidad:** CRÍTICA
**Archivo:** `Forum_backend/src/main/java/com/forumviajeros/backend/security/SecurityConfig.java:44`

**Problema:**
```java
.csrf(csrf -> csrf.disable())
```

CSRF deshabilitado mientras se usan tokens en localStorage = doble vulnerabilidad.

**Impacto:** Posible CSRF si se migra a cookies sin habilitar protección

**Solución:**
- Si tokens en cookies → Habilitar CSRF
- Si tokens en headers → Asegurar NO hay XSS (sanitización estricta)

---

## 🟠 VULNERABILIDADES ALTAS

### 5. Formularios Sin Sanitización en Frontend

**Severidad:** ALTA
**Archivos:** CommentForm.jsx, PostForm.jsx, ForumForm.jsx

**Problema:**
```javascript
// CommentForm.jsx:29 - NO sanitiza antes de enviar
const commentData = {
  content: content.trim(),  // ❌ Sin sanitización
  postId,
}
```

**Solución:**
```javascript
import { sanitizeInput } from '../../utils/sanitize'

const commentData = {
  content: sanitizeInput(content.trim(), 'BASIC'),  // ✅ Con sanitización
  postId,
}
```

---

### 6. Validación de Password Inconsistente

**Severidad:** ALTA
**Archivo:** `Forum_frontend/src/components/auth/RegisterForm.jsx:49-53`

**Problema:**
```javascript
// Frontend: solo 6 caracteres
else if (formData.password.length < 6) {
  newErrors.password = 'Debe tener mínimo 6 caracteres'
}

// Backend: 8 caracteres + complejidad
```

**Impacto:** Confusión del usuario, experiencia inconsistente

**Solución:**
```javascript
const validatePassword = (password) => {
  if (password.length < 8) return 'Mínimo 8 caracteres'
  if (!/[A-Z]/.test(password)) return 'Debe contener una mayúscula'
  if (!/[a-z]/.test(password)) return 'Debe contener una minúscula'
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password))
    return 'Debe contener un carácter especial'
  return null
}
```

---

### 7. Mensajes de Error Exponen Detalles

**Severidad:** ALTA
**Archivo:** `Forum_backend/src/main/java/com/forumviajeros/backend/exception/GlobalExceptionHandler.java:88-95`

**Problema:**
```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorDetails> handleGlobalException(Exception exception, ...) {
    ErrorDetails errorDetails = new ErrorDetails(
        new Date(),
        exception.getMessage(),  // ⚠️ Expone detalles internos
        webRequest.getDescription(false)
    );
    return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

**Impacto:** Information disclosure, ayuda a atacantes

**Solución:**
```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorDetails> handleGlobalException(Exception exception, ...) {
    logger.error("Error no controlado: ", exception);  // Log interno

    ErrorDetails errorDetails = new ErrorDetails(
        new Date(),
        "Ha ocurrido un error interno. Por favor, contacte al administrador.",
        webRequest.getDescription(false)
    );
    return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

---

## 🟡 VULNERABILIDADES MEDIAS

### 8. Enumeración de Usuarios en Login

**Severidad:** MEDIA
**Archivo:** `CustomAuthenticationManager.java:32-38`

**Problema:** Mensajes diferentes para "usuario no encontrado" vs "contraseña incorrecta"

**Solución:** Usar mensaje genérico "Credenciales inválidas"

---

### 9. Validación de File Upload Solo por Content-Type

**Severidad:** MEDIA
**Archivo:** `LocalStorageService.java:169-174`

**Problema:** Solo valida Content-Type, no magic bytes

**Solución:** Añadir validación de firma del archivo (magic bytes)

---

### 10. Renderizado de Contenido Sin Sanitización Explícita

**Severidad:** MEDIA
**Archivo:** `PostContent.jsx:60-63`

**Problema:** React escapa por defecto, pero falta validación explícita

**Solución:** Verificar sanitización end-to-end

---

## ✅ HALLAZGOS POSITIVOS

### Excelente Implementación de:

✅ **Autenticación JWT** con refresh tokens y rotación
✅ **Autorización** basada en roles con `@PreAuthorize`
✅ **Rate Limiting** (login: 5/min, register: 3/min)
✅ **Security Headers** (CSP, X-Frame-Options, HSTS)
✅ **Validación Backend** robusta con Jakarta Validation
✅ **Prevención de Path Traversal** en uploads
✅ **CORS** correctamente configurado
✅ **BCrypt** para hash de passwords
✅ **NO uso de** `dangerouslySetInnerHTML`, `eval()`, `innerHTML`
✅ **Queries SQL** con parámetros (previene SQL injection)

---

## PLAN DE ACCIÓN

### 📅 INMEDIATO (Hoy):
1. ✅ Añadir sanitización a CommentForm.jsx
2. ✅ Añadir sanitización a PostForm.jsx
3. ✅ Añadir sanitización a ForumForm.jsx
4. ✅ Arreglar validación de password en RegisterForm.jsx
5. ⚠️ Documentar proceso de limpieza de .env del historial Git

### 📅 ESTA SEMANA:
6. Implementar OWASP Java HTML Sanitizer en backend
7. Arreglar mensajes de error genéricos
8. Migrar tokens a HttpOnly cookies (investigación)
9. Tests de seguridad automatizados

### 📅 ESTE MES:
10. Implementar validación de magic bytes
11. Habilitar CSRF si se migra a cookies
12. Auditoría de logs y monitoring
13. Documentación de deployment seguro

---

## MÉTRICAS DE SEGURIDAD

| Categoría | Puntuación |
|-----------|------------|
| **Autenticación** | 7/10 |
| **Autorización** | 9/10 |
| **Sanitización de Inputs** | 4/10 ⚠️ |
| **Gestión de Secrets** | 2/10 🔴 |
| **File Uploads** | 7/10 |
| **Error Handling** | 5/10 |
| **CSRF/XSS Protection** | 5/10 |
| **SQL Injection** | 10/10 ✅ |

**PUNTUACIÓN GLOBAL: 6.5/10**

Con las correcciones implementadas → **8.5/10**

---

## NOTAS FINALES

- El proyecto tiene una **base sólida** de seguridad
- Las vulnerabilidades críticas son **corregibles**
- La arquitectura es **correcta** (separación frontend/backend)
- Falta **sanitización consistente** en frontend
- **URGENTE:** Limpiar credenciales del repositorio

**Recomendación:** Implementar las correcciones CRÍTICAS antes de deployment a producción.
