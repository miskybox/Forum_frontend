# Auditoría de Seguridad - Formularios y Campos

## Fecha: 17 de Diciembre de 2025
## Ámbito: Formularios de Foros, Posts y Comentarios

---

## Resumen Ejecutivo

### Estado General: ⚠️ **NECESITA MEJORAS DE SEGURIDAD**

**Hallazgos Críticos:**
- ❌ Sin sanitización de HTML en campos de texto
- ❌ Falta protección contra XSS (Cross-Site Scripting)
- ❌ Validación solo en frontend (falta validación backend reforzada)
- ⚠️ Sin límites de longitud máxima en algunos campos
- ⚠️ Falta Rate Limiting en formularios

**Hallazgos Positivos:**
- ✅ Validación básica de tipos de archivo (imágenes)
- ✅ Validación de tamaño de archivos (5MB máximo)
- ✅ Validación de campos requeridos
- ✅ Trim de espacios en blanco
- ✅ Prevención de duplicados en tags

---

## 1. ForumForm.jsx - Formulario de Foros

### 1.1 Vulnerabilidades Encontradas

#### ❌ **CRÍTICO: Sin Sanitización HTML/JavaScript**
```javascript
// ACTUAL (INSEGURO)
handleChange = (e) => {
  const { name, value } = e.target
  setFormData({
    ...formData,
    [name]: value  // ⚠️ Acepta cualquier contenido
  })
}
```

**Riesgo:**
- XSS (Cross-Site Scripting)
- Inyección de HTML malicioso
- Ejecución de scripts en navegadores de otros usuarios

**Ejemplo de Ataque:**
```javascript
// Un atacante podría ingresar:
title: "<script>alert('XSS')</script>"
description: "<img src=x onerror=alert('XSS')>"
```

#### ⚠️ **MEDIO: Validación de Longitud Insuficiente**
```javascript
// ACTUAL
if (formData.title.length < 5) {
  newErrors.title = 'El título debe tener al menos 5 caracteres'
}
// ⚠️ NO HAY LÍMITE MÁXIMO
```

**Riesgo:**
- DoS (Denial of Service) con campos muy largos
- Problemas de rendimiento en BD
- Buffer overflow en backend

#### ⚠️ **MEDIO: Validación de Imágenes Mejorable**
```javascript
// ACTUAL
const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
if (!validTypes.includes(file.type)) {
  // error
}
```

**Problema:**
- Solo valida MIME type (fácilmente falsificable)
- No valida extensión de archivo
- No valida contenido real del archivo (magic bytes)

### 1.2 Recomendaciones de Seguridad

#### 🔒 **1. Sanitizar Input HTML**

```javascript
import DOMPurify from 'dompurify'

const handleChange = (e) => {
  const { name, value } = e.target

  // Sanitizar contenido HTML
  const sanitizedValue = DOMPurify.sanitize(value, {
    ALLOWED_TAGS: [], // No permitir tags HTML
    ALLOWED_ATTR: []
  })

  setFormData({
    ...formData,
    [name]: sanitizedValue
  })
}
```

#### 🔒 **2. Agregar Límites de Longitud**

```javascript
const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 2000

const validateForm = () => {
  const newErrors = {}

  if (!formData.title.trim()) {
    newErrors.title = 'El título es obligatorio'
  } else if (formData.title.length < 5) {
    newErrors.title = 'El título debe tener al menos 5 caracteres'
  } else if (formData.title.length > MAX_TITLE_LENGTH) {
    newErrors.title = `El título no puede exceder ${MAX_TITLE_LENGTH} caracteres`
  }

  if (!formData.description.trim()) {
    newErrors.description = 'La descripción es obligatoria'
  } else if (formData.description.length < 10) {
    newErrors.description = 'La descripción debe tener al menos 10 caracteres'
  } else if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
    newErrors.description = `La descripción no puede exceder ${MAX_DESCRIPTION_LENGTH} caracteres`
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

#### 🔒 **3. Validación Mejorada de Imágenes**

```javascript
const validateImage = async (file) => {
  // 1. Validar extensión
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!validExtensions.includes(extension)) {
    return 'Extensión de archivo no permitida'
  }

  // 2. Validar MIME type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return 'Tipo de archivo no permitido'
  }

  // 3. Validar tamaño
  if (file.size > 5 * 1024 * 1024) {
    return 'La imagen debe ser menor a 5 MB'
  }

  // 4. Validar magic bytes (cabecera del archivo)
  const arrayBuffer = await file.slice(0, 4).arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)

  // JPEG: FF D8 FF
  // PNG: 89 50 4E 47
  // GIF: 47 49 46 38
  const isValidJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
  const isValidPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
  const isValidGIF = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46

  if (!isValidJPEG && !isValidPNG && !isValidGIF) {
    return 'El archivo no es una imagen válida'
  }

  return null // Sin errores
}

const handleImageChange = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const error = await validateImage(file)
  if (error) {
    setErrors({ ...errors, image: error })
    return
  }

  // Continuar con el procesamiento...
}
```

#### 🔒 **4. Protección CSRF**

```javascript
// Agregar token CSRF en formularios
const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) return

  setIsSubmitting(true)

  try {
    // Obtener CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content

    let response
    const config = {
      headers: {
        'X-CSRF-Token': csrfToken
      }
    }

    if (isEdit) {
      response = await forumService.updateForum(initialData.id, formData, config)
    } else {
      response = await forumService.createForum(formData, config)
    }

    // ...
  } catch (error) {
    // ...
  }
}
```

---

## 2. PostForm.jsx - Formulario de Posts

### 2.1 Vulnerabilidades Encontradas

#### ❌ **CRÍTICO: Sin Sanitización de Contenido**

```javascript
// ACTUAL (INSEGURO)
const handleChange = (e) => {
  const { name, value } = e.target
  setFormData(prev => ({
    ...prev,
    [name]: value  // ⚠️ Sin sanitización
  }))
}
```

**Riesgo:** XSS en título y contenido del post

#### ❌ **CRÍTICO: Tags Sin Validación**

```javascript
// ACTUAL (INSEGURO)
const handleAddTag = () => {
  if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]  // ⚠️ Sin sanitización
    }))
  }
}
```

**Riesgo:**
- XSS a través de tags
- Tags con caracteres especiales maliciosos
- Tags extremadamente largos

#### ⚠️ **MEDIO: Sin Límite de Tags**

```javascript
// No hay límite en cantidad de tags
tags: [...prev.tags, tagInput.trim()]
```

**Riesgo:**
- DoS con miles de tags
- Problemas de rendimiento

### 2.2 Recomendaciones de Seguridad

#### 🔒 **1. Sanitizar Todo el Contenido**

```javascript
import DOMPurify from 'dompurify'

const handleChange = (e) => {
  const { name, value } = e.target

  let sanitizedValue = value

  // Para contenido de post, permitir algunos tags seguros
  if (name === 'content') {
    sanitizedValue = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'target']
    })
  } else {
    // Para título, no permitir HTML
    sanitizedValue = DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
  }

  setFormData(prev => ({
    ...prev,
    [name]: sanitizedValue
  }))
}
```

#### 🔒 **2. Validar Tags Correctamente**

```javascript
const MAX_TAGS = 10
const MAX_TAG_LENGTH = 30
const TAG_PATTERN = /^[a-zA-Z0-9\s\-_áéíóúñ]+$/

const handleAddTag = () => {
  const trimmedTag = tagInput.trim()

  // Validaciones
  if (!trimmedTag) {
    toast.error('El tag no puede estar vacío')
    return
  }

  if (formData.tags.length >= MAX_TAGS) {
    toast.error(`Máximo ${MAX_TAGS} tags permitidos`)
    return
  }

  if (trimmedTag.length > MAX_TAG_LENGTH) {
    toast.error(`El tag no puede exceder ${MAX_TAG_LENGTH} caracteres`)
    return
  }

  if (!TAG_PATTERN.test(trimmedTag)) {
    toast.error('El tag solo puede contener letras, números, guiones y espacios')
    return
  }

  if (formData.tags.includes(trimmedTag)) {
    toast.error('Este tag ya existe')
    return
  }

  // Sanitizar tag
  const sanitizedTag = DOMPurify.sanitize(trimmedTag, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })

  setFormData(prev => ({
    ...prev,
    tags: [...prev.tags, sanitizedTag]
  }))

  setTagInput('')
}
```

#### 🔒 **3. Agregar Límites de Longitud**

```javascript
const MAX_TITLE_LENGTH = 200
const MAX_CONTENT_LENGTH = 50000

const validateForm = () => {
  const newErrors = {}

  if (!formData.title.trim()) {
    newErrors.title = 'El título es obligatorio'
  } else if (formData.title.length > MAX_TITLE_LENGTH) {
    newErrors.title = `El título no puede exceder ${MAX_TITLE_LENGTH} caracteres`
  }

  if (!formData.content.trim()) {
    newErrors.content = 'El contenido es obligatorio'
  } else if (formData.content.length > MAX_CONTENT_LENGTH) {
    newErrors.content = `El contenido no puede exceder ${MAX_CONTENT_LENGTH} caracteres`
  }

  if (!formData.forumId) {
    newErrors.forumId = 'Debes seleccionar un foro'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

---

## 3. CommentForm.jsx - Formulario de Comentarios

### 3.1 Vulnerabilidades Encontradas

#### ❌ **CRÍTICO: Sin Sanitización de Comentarios**

```javascript
// ACTUAL (INSEGURO)
const commentData = {
  content: content.trim(),  // ⚠️ Sin sanitización
  postId,
}
```

**Riesgo:** XSS en comentarios

#### ⚠️ **MEDIO: Sin Límite de Longitud**

```javascript
// No hay validación de longitud máxima
if (!content.trim()) {
  toast.error('El comentario no puede estar vacío')
  return
}
```

**Riesgo:** Comentarios extremadamente largos

### 3.2 Recomendaciones de Seguridad

#### 🔒 **1. Sanitizar Comentarios**

```javascript
import DOMPurify from 'dompurify'

const MIN_COMMENT_LENGTH = 3
const MAX_COMMENT_LENGTH = 2000

const handleSubmit = async (e) => {
  e.preventDefault()

  const trimmedContent = content.trim()

  // Validaciones
  if (!trimmedContent) {
    toast.error('El comentario no puede estar vacío')
    return
  }

  if (trimmedContent.length < MIN_COMMENT_LENGTH) {
    toast.error(`El comentario debe tener al menos ${MIN_COMMENT_LENGTH} caracteres`)
    return
  }

  if (trimmedContent.length > MAX_COMMENT_LENGTH) {
    toast.error(`El comentario no puede exceder ${MAX_COMMENT_LENGTH} caracteres`)
    return
  }

  if (!isAuthenticated) {
    toast.error('Debes iniciar sesión para comentar')
    return
  }

  try {
    setIsSubmitting(true)

    // Sanitizar contenido
    const sanitizedContent = DOMPurify.sanitize(trimmedContent, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong'], // Solo permitir formato básico
      ALLOWED_ATTR: []
    })

    const commentData = {
      content: sanitizedContent,
      postId,
    }

    const newComment = await commentService.createComment(postId, commentData)

    setContent('')
    toast.success('Comentario publicado con éxito')

    if (onCommentAdded) {
      onCommentAdded(newComment)
    }
  } catch (error) {
    toast.error('Error al publicar el comentario')
    console.error('Error al publicar comentario:', error)
  } finally {
    setIsSubmitting(false)
  }
}
```

#### 🔒 **2. Rate Limiting en Cliente**

```javascript
import { useState, useRef } from 'react'

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canSubmit, setCanSubmit] = useState(true)
  const lastSubmitTime = useRef(0)
  const { isAuthenticated } = useAuth()

  const RATE_LIMIT_MS = 5000 // 5 segundos entre comentarios

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Rate limiting
    const now = Date.now()
    if (now - lastSubmitTime.current < RATE_LIMIT_MS) {
      const remainingSeconds = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime.current)) / 1000)
      toast.error(`Espera ${remainingSeconds} segundos antes de comentar de nuevo`)
      return
    }

    // ... resto del código de validación y envío

    lastSubmitTime.current = Date.now()
  }

  // ...
}
```

---

## 4. Recomendaciones Generales de Seguridad

### 4.1 Implementar DOMPurify en Todo el Proyecto

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### 4.2 Crear Utilidad de Sanitización Centralizada

```javascript
// src/utils/sanitize.js
import DOMPurify from 'dompurify'

export const sanitizeHTML = (dirty, options = {}) => {
  const defaultOptions = {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ...options
  }

  return DOMPurify.sanitize(dirty, defaultOptions)
}

export const sanitizeRichText = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'blockquote', 'code'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):\/\/|mailto:)/i
  })
}

export const sanitizePlainText = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  })
}
```

### 4.3 Configurar Content Security Policy (CSP)

```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               font-src 'self' data:;
               connect-src 'self' http://localhost:8080;">
```

### 4.4 Validación en Backend (Crítico)

**IMPORTANTE:** La validación en frontend NO ES SUFICIENTE. El backend DEBE:

1. ✅ Validar todos los campos recibidos
2. ✅ Sanitizar HTML/JavaScript
3. ✅ Validar longitudes máximas
4. ✅ Usar prepared statements (prevenir SQL Injection)
5. ✅ Implementar rate limiting
6. ✅ Validar permisos de usuario
7. ✅ Validar tipos de archivo en servidor
8. ✅ Escanear archivos subidos (antivirus)

---

## 5. Plan de Implementación Recomendado

### Fase 1: Urgente (Inmediato)
1. ✅ Instalar DOMPurify
2. ✅ Crear utilidad de sanitización
3. ✅ Sanitizar todos los inputs en ForumForm
4. ✅ Sanitizar todos los inputs en PostForm
5. ✅ Sanitizar comentarios en CommentForm

### Fase 2: Importante (Esta Semana)
1. ✅ Agregar límites de longitud a todos los campos
2. ✅ Mejorar validación de imágenes (magic bytes)
3. ✅ Implementar rate limiting en cliente
4. ✅ Agregar validación de tags
5. ✅ Configurar CSP headers

### Fase 3: Necesario (Próxima Semana)
1. ✅ Revisar y reforzar validación en backend
2. ✅ Implementar rate limiting en servidor
3. ✅ Agregar tests de seguridad
4. ✅ Auditoría de dependencias (npm audit)
5. ✅ Documentar políticas de seguridad

---

## 6. Checklist de Seguridad por Formulario

### ForumForm
- [ ] Sanitización HTML en título
- [ ] Sanitización HTML en descripción
- [ ] Límite máximo de caracteres (título: 200)
- [ ] Límite máximo de caracteres (descripción: 2000)
- [ ] Validación de magic bytes en imágenes
- [ ] Validación de extensión de archivo
- [ ] Token CSRF en envío
- [ ] Rate limiting

### PostForm
- [ ] Sanitización HTML en título
- [ ] Sanitización parcial en contenido (rich text)
- [ ] Límite máximo de caracteres (título: 200)
- [ ] Límite máximo de caracteres (contenido: 50000)
- [ ] Validación de tags (patrón, longitud, cantidad)
- [ ] Sanitización de tags
- [ ] Token CSRF en envío
- [ ] Rate limiting

### CommentForm
- [ ] Sanitización HTML en comentarios
- [ ] Límite mínimo de caracteres (3)
- [ ] Límite máximo de caracteres (2000)
- [ ] Rate limiting (5 segundos entre comentarios)
- [ ] Token CSRF en envío

---

## 7. Recursos y Herramientas

### Librerías Recomendadas
- **DOMPurify**: Sanitización HTML
- **validator.js**: Validación de formatos
- **helmet**: Headers de seguridad (backend)
- **express-rate-limit**: Rate limiting (backend)

### Herramientas de Testing
- **OWASP ZAP**: Testing de vulnerabilidades
- **Burp Suite**: Pentesting
- **npm audit**: Auditoría de dependencias

---

**Documento generado:** 17 de Diciembre de 2025
**Próxima revisión:** Después de implementar Fase 1
**Estado:** ⚠️ ACCIÓN REQUERIDA - Vulnerabilidades críticas detectadas
