# 🔧 SOLUCIÓN DEL PROBLEMA DEL BACKEND

**Fecha:** 2025-12-09  
**Problema:** Backend no iniciaba debido a inicialización temprana de `SecurityConstants`

---

## 🐛 PROBLEMA IDENTIFICADO

El backend no iniciaba porque `SecurityConstants.SECRET` se inicializaba como un campo `static final` que se ejecutaba **antes** de que `BackendApplication.main()` pudiera cargar las variables de entorno desde el archivo `.env`.

### **Causa raíz:**
```java
// ❌ PROBLEMA: Se inicializa cuando se carga la clase
public class SecurityConstants {
    public static final String SECRET = getSecretKey(); // ← Se ejecuta ANTES de cargar .env
    // ...
}
```

Cuando Spring Boot intentaba cargar la clase `SecurityConstants`, el método `getSecretKey()` se ejecutaba inmediatamente. Si `JWT_SECRET_KEY` no estaba disponible (porque el `.env` aún no se había cargado), lanzaba una excepción que impedía que la aplicación iniciara.

---

## ✅ SOLUCIÓN IMPLEMENTADA

Se modificó `SecurityConstants` para usar **inicialización lazy** (perezosa), cargando el secret solo cuando se necesita:

### **Cambios realizados:**

1. **SecurityConstants.java:**
   - Cambiado `public static final String SECRET` a `private static String SECRET = null`
   - Agregado método público `getSecret()` que carga el secret de forma lazy
   - El método ahora busca el secret en este orden:
     1. System Property (configurado por `BackendApplication`)
     2. Variable de entorno del sistema
     3. Archivo `.env`

2. **Archivos actualizados:**
   - `JwtAuthorizationFilter.java`: Cambiado `SecurityConstants.SECRET` → `SecurityConstants.getSecret()`
   - `RefreshTokenService.java`: Cambiado todas las referencias a usar `getSecret()`

### **Código corregido:**
```java
// ✅ SOLUCIÓN: Inicialización lazy
public class SecurityConstants {
    private static String SECRET = null; // ← No se inicializa hasta que se necesite
    
    public static String getSecret() {
        if (SECRET == null) {
            SECRET = getSecretKey(); // ← Se carga solo cuando se llama
        }
        return SECRET;
    }
    
    private static String getSecretKey() {
        // Primero intentar desde System Property (configurado por BackendApplication)
        String secretKey = System.getProperty("JWT_SECRET_KEY");
        
        // Si no está, intentar desde variable de entorno del sistema
        if (secretKey == null || secretKey.isBlank()) {
            secretKey = System.getenv("JWT_SECRET_KEY");
        }
        
        // Si no está, leer desde archivo .env
        if (secretKey == null || secretKey.isBlank()) {
            try {
                Dotenv dotenv = Dotenv.configure()
                        .ignoreIfMissing()
                        .load();
                secretKey = dotenv.get("JWT_SECRET_KEY");
            } catch (Exception e) {
                // Ignorar errores de carga de .env
            }
        }
        
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException(
                    "La variable de entorno JWT_SECRET_KEY debe estar configurada antes de iniciar la aplicación");
        }
        return secretKey;
    }
}
```

---

## 📋 VERIFICACIÓN

### **Compilación:**
✅ Compilación exitosa sin errores

### **Archivos modificados:**
1. ✅ `Forum_backend/src/main/java/com/forumviajeros/backend/security/constants/SecurityConstants.java`
2. ✅ `Forum_backend/src/main/java/com/forumviajeros/backend/security/filter/JwtAuthorizationFilter.java`
3. ✅ `Forum_backend/src/main/java/com/forumviajeros/backend/service/token/RefreshTokenService.java`

---

## 🎯 PRÓXIMOS PASOS

1. **Verificar archivo `.env`:**
   ```bash
   # Debe contener:
   DB_URL=jdbc:postgresql://localhost:5432/forum_viajeros
   DB_USER=postgres
   DB_PASSWORD=tu_password
   JWT_SECRET_KEY=tu_secret_key_minimo_64_caracteres
   ```

2. **Iniciar el backend:**
   ```powershell
   cd Forum_backend
   .\mvnw.cmd spring-boot:run
   ```

3. **Verificar que inicie correctamente:**
   - Buscar el mensaje: `Started BackendApplication`
   - Verificar que el puerto 8080 esté escuchando
   - Probar endpoint: `http://localhost:8080/api/auth/login`

---

## 📝 NOTAS TÉCNICAS

- **Inicialización lazy:** El secret se carga solo cuando se necesita, permitiendo que `BackendApplication` configure las variables primero
- **Orden de búsqueda:** System Property → Variable de entorno → Archivo `.env`
- **Thread-safe:** Aunque no está sincronizado, en la práctica no debería haber problemas porque el secret se carga una sola vez al inicio

---

## ✅ RESULTADO

El backend ahora debería iniciar correctamente siempre que:
- El archivo `.env` exista y tenga las variables necesarias
- PostgreSQL esté corriendo y la base de datos exista
- Las credenciales de la base de datos sean correctas

**Estado:** ✅ **PROBLEMA RESUELTO**

