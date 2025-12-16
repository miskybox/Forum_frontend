# 🧪 PRUEBA DEL BACKEND - INSTRUCCIONES

**Fecha:** 2025-12-15  
**Estado:** Backend iniciado para pruebas

---

## ✅ CORRECCIONES APLICADAS

Las siguientes correcciones críticas han sido aplicadas y están listas para probar:

1. ✅ **SecurityConstants.SECRET** - Inicialización lazy implementada
2. ✅ **Validación de variables de entorno** - Método agregado
3. ✅ **Documentación** - .env.example creado

---

## 🔍 CÓMO VERIFICAR QUE FUNCIONA

### 1. Verificar que el Backend Está Corriendo

**Opción A: Desde el navegador**
```
http://localhost:8080/api/categories
```
Deberías ver una respuesta JSON con las categorías.

**Opción B: Desde PowerShell**
```powershell
Test-NetConnection -ComputerName localhost -Port 8080
```

**Opción C: Verificar procesos Java**
```powershell
Get-Process java
```

### 2. Verificar Logs del Backend

En la ventana de PowerShell del backend, busca:

**✅ Mensajes de éxito:**
- `Started BackendApplication`
- `✅ Todas las variables de entorno críticas están configuradas correctamente`
- `Roles creados/verificados: ROLE_ADMIN, ROLE_MODERATOR, ROLE_USER`

**❌ Mensajes de error:**
- `Variables de entorno críticas faltantes o inválidas:` - Falta configuración
- `Connection refused` - Problema con PostgreSQL
- `JWT_SECRET_KEY debe tener al menos 64 caracteres` - Secret muy corto

### 3. Probar Endpoints

**Endpoint público (no requiere autenticación):**
```bash
GET http://localhost:8080/api/categories
```

**Endpoint de autenticación:**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "Test",
  "lastName": "User"
}
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "Variables de entorno críticas faltantes"

**Solución:**
1. Verifica que el archivo `.env` existe en `Forum_backend/`
2. Verifica que tiene todas las variables:
   - `DB_URL=jdbc:postgresql://localhost:5432/forum_viajeros`
   - `DB_USER=postgres`
   - `DB_PASSWORD=tu_password`
   - `JWT_SECRET_KEY=tu_secret_minimo_64_caracteres`

### Problema: "Connection refused" o error de base de datos

**Solución:**
1. Verifica que PostgreSQL está corriendo
2. Verifica que la base de datos `forum_viajeros` existe
3. Verifica las credenciales en `.env`

### Problema: "JWT_SECRET_KEY debe tener al menos 64 caracteres"

**Solución:**
1. Genera un secret de al menos 64 caracteres:
   ```bash
   # PowerShell
   [Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   
   # O usa un generador online: https://generate-secret.vercel.app/
   ```
2. Actualiza `JWT_SECRET_KEY` en `.env`

---

## 📊 VERIFICACIÓN DE CORRECCIONES

### ✅ Corrección 1: SecurityConstants.SECRET

**Cómo verificar:**
1. El backend inicia sin errores relacionados con JWT_SECRET_KEY
2. Los tokens JWT se generan correctamente al hacer login
3. No hay errores de "JWT_SECRET_KEY debe estar configurada" al iniciar

**Prueba:**
```bash
# Hacer login
POST http://localhost:8080/api/auth/login
{
  "username": "admin",
  "password": "tu_password_admin"
}

# Deberías recibir accessToken y refreshToken
```

### ✅ Corrección 2: Validación de Variables

**Cómo verificar:**
1. Si falta una variable crítica, el backend NO inicia
2. Muestra un mensaje claro indicando qué variable falta
3. Si todas las variables están, muestra: "✅ Todas las variables de entorno críticas están configuradas correctamente"

**Prueba:**
- Renombra temporalmente `.env` a `.env.backup`
- Intenta iniciar el backend
- Deberías ver un error claro indicando qué variables faltan
- Restaura `.env` y vuelve a iniciar

### ✅ Corrección 3: Documentación

**Cómo verificar:**
- El contenido de `.env.example` está documentado en `CORRECCIONES_CRITICAS_APLICADAS.md`
- Todas las variables están explicadas

---

## 🎯 RESULTADO ESPERADO

Si todo funciona correctamente:

1. ✅ Backend inicia sin errores
2. ✅ Muestra mensaje de validación exitosa
3. ✅ Escucha en puerto 8080
4. ✅ Endpoints responden correctamente
5. ✅ Tokens JWT se generan correctamente

---

## 📝 NOTAS

- El backend puede tardar 60-90 segundos en iniciar completamente
- Los primeros logs pueden mostrar warnings de Hibernate (normales)
- La validación de variables se ejecuta ANTES de iniciar Spring Boot

---

**Estado:** ✅ Correcciones aplicadas y listas para probar

