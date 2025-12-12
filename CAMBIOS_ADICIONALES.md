# CAMBIOS ADICIONALES - TRIVIA Y MAPA
**Fecha:** 2025-12-09
**Versión:** 1.2.0

---

## 📋 RESUMEN DE CAMBIOS ADICIONALES

Se corrigieron problemas críticos en el sistema de trivia y mejoras importantes en el mapa de viajes.

---

## 🎮 CAMBIOS EN TRIVIA

### 1. TriviaPlayPage.jsx - Problema de Bloqueo Resuelto

#### ✅ Problema: Pregunta y Resultado Mostrados Simultáneamente

**Síntoma:** Después de responder, se mostraba la pregunta Y el resultado al mismo tiempo, causando confusión y bloqueo de la interfaz.

**Causa Raíz:** La lógica condicional no estaba priorizando correctamente qué mostrar.

**Solución:**
```javascript
// ANTES: Ambos componentes podían renderizarse
<div>
  {result && <TriviaResult result={result} onNext={handleNext} />}
  {currentQuestion && <TriviaQuestion question={currentQuestion} onAnswer={handleAnswer} />}
</div>

// DESPUÉS: Solo uno se muestra a la vez
{result ? (
  // Mostrar SOLO el resultado cuando hay uno
  <TriviaResult
    result={result}
    onNext={handleNext}
    isLastQuestion={!result.hasNextQuestion}
  />
) : currentQuestion ? (
  // Mostrar SOLO la pregunta cuando no hay resultado
  <TriviaQuestion
    question={currentQuestion}
    onAnswer={handleAnswer}
  />
) : (
  <div>Cargando pregunta...</div>
)}
```

**Beneficios:**
- ✅ Solo se muestra una pantalla a la vez
- ✅ Transición clara entre pregunta → resultado → siguiente pregunta
- ✅ No hay confusión visual
- ✅ El botón "Siguiente pregunta" funciona correctamente

#### ✅ Problema: Preguntas Repetidas en la Misma Partida

**Estado:** Este problema es del **backend**, no del frontend. El backend debe asegurar que no se envíen preguntas duplicadas en la misma partida.

**Verificación Necesaria:**
El servicio `TriviaService.java` en el backend debe:
1. Mantener un registro de preguntas ya mostradas por partida
2. Filtrar preguntas duplicadas al obtener la siguiente pregunta
3. Verificar que hay suficientes preguntas únicas disponibles

**Recomendación:**
```java
// Pseudo-código para el backend
public TriviaQuestion getNextQuestion(Long gameId) {
    TriviaGame game = gameRepository.findById(gameId);
    List<Long> usedQuestionIds = game.getAnsweredQuestions()
        .stream()
        .map(Answer::getQuestionId)
        .collect(Collectors.toList());

    // Obtener pregunta que NO esté en usedQuestionIds
    return questionRepository.findRandomQuestionNotIn(usedQuestionIds);
}
```

---

## 🗺️ CAMBIOS EN MAPA DE VIAJES

### 2. AddPlaceModal.jsx - Mejoras en Formulario

#### ✅ Fecha de Visita Ahora es Opcional

**Problema:** No estaba claro que la fecha era opcional y no había forma fácil de quitarla.

**Solución Implementada:**

```jsx
// Label actualizado
<label>
  FECHA DE VISITA (OPCIONAL)
</label>

// Campo con botón para quitar
<div className="flex gap-2">
  <input
    type="date"
    value={formData.visitDate}
    onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
    max={new Date().toISOString().split('T')[0]}  // No permite fechas futuras
    className="input w-full border-jungle-gold"
    placeholder="Selecciona una fecha"
  />
  {formData.visitDate && (
    <button
      type="button"
      onClick={() => setFormData({ ...formData, visitDate: '' })}
      className="btn btn-outline text-jungle-gold border-jungle-gold px-4"
      title="Quitar fecha"
    >
      ✕
    </button>
  )}
</div>

// Texto explicativo
<p className="text-jungle-leaf/60 text-xs mt-1 font-retro">
  Puedes dejar este campo vacío si no recuerdas la fecha exacta
</p>
```

**Características:**
- ✅ Label indica claramente "(OPCIONAL)"
- ✅ Botón "✕" aparece solo si hay fecha seleccionada
- ✅ Máximo es la fecha actual (no permite futuro)
- ✅ Texto explicativo debajo del campo
- ✅ Si se envía vacío, backend recibe `null`

#### ✅ Calendario Más Accesible

**Mejoras:**
1. **Max Date:** No permite seleccionar fechas futuras
   ```javascript
   max={new Date().toISOString().split('T')[0]}
   ```

2. **Placeholder:** Indica qué hacer
   ```javascript
   placeholder="Selecciona una fecha"
   ```

3. **Botón de Limpieza:** Fácil de quitar la fecha
   - Solo aparece si hay fecha seleccionada
   - Un clic la quita completamente

4. **Texto Guía:** Tranquiliza al usuario
   > "Puedes dejar este campo vacío si no recuerdas la fecha exacta"

#### ✅ Mejores Mensajes de Error

**Problema:** Los mensajes de error eran genéricos y no ayudaban a diagnosticar problemas.

**Solución:**

```javascript
// Validación mejorada
if (!selectedCountry) {
  toast.error('⚠️ Por favor, selecciona un país')
  return
}

// Logs de debugging
console.log('Enviando datos del lugar:', placeData)
console.log('Lugar agregado:', result)

// Mensajes de éxito claros
toast.success(`✅ ${selectedCountry.flagEmoji} ${selectedCountry.name} agregado a tu mapa!`)
toast.success('✅ Lugar actualizado exitosamente')

// Errores detallados
catch (error) {
  console.error('Error al guardar lugar:', error)
  console.error('Detalles del error:', {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status
  })

  const errorMessage = error.response?.data?.message ||
                      error.response?.data?.error ||
                      error.message ||
                      'Error al guardar el lugar'

  toast.error(`⚠️ ${errorMessage}`, { duration: 6000 })
}
```

**Beneficios:**
- ✅ Mensajes con emojis más amigables
- ✅ Logs en consola para debugging
- ✅ Errores específicos del backend mostrados
- ✅ Duración de toasts aumentada (6 segundos)

#### ✅ Validación de Datos Mejorada

**Cambios en el envío de datos:**

```javascript
// ANTES:
const placeData = {
  cityName: formData.cityName || null,
  rating: formData.rating || null,
  // ...
}

// DESPUÉS:
const placeData = {
  cityName: formData.cityName.trim() || null,  // Elimina espacios
  rating: formData.rating > 0 ? formData.rating : null,  // Solo si > 0
  notes: formData.notes.trim() || null,
  // ...
}
```

**Mejoras:**
- `.trim()` elimina espacios en blanco innecesarios
- Rating solo se envía si es mayor a 0
- Valores vacíos se convierten en `null` para el backend

---

## 📊 TESTING REQUERIDO

### Trivia
1. **Flujo Completo de Partida:**
   - Iniciar partida
   - Responder pregunta correcta → Ver resultado verde
   - Click en "Siguiente pregunta" → Nueva pregunta diferente
   - Responder pregunta incorrecta → Ver resultado rojo con respuesta correcta
   - Click en "Siguiente pregunta" → Nueva pregunta diferente
   - Completar todas las preguntas → Ver resumen final

2. **Verificar No Duplicados:**
   - Jugar partida completa
   - Anotar todas las preguntas que aparecen
   - Confirmar que ninguna se repite

### Mapa de Viajes
1. **Agregar País con Fecha:**
   - Abrir modal
   - Seleccionar país
   - Seleccionar fecha del calendario
   - Guardar → Verificar éxito

2. **Agregar País sin Fecha:**
   - Abrir modal
   - Seleccionar país
   - NO seleccionar fecha (dejar vacío)
   - Guardar → Verificar éxito

3. **Quitar Fecha Seleccionada:**
   - Seleccionar fecha en el calendario
   - Click en botón "✕"
   - Verificar que se limpia
   - Guardar → Verificar que se guarda sin fecha

4. **Fecha Futura Bloqueada:**
   - Intentar seleccionar fecha futura
   - Verificar que el calendario no lo permite

5. **Errores Claros:**
   - Intentar guardar sin país seleccionado
   - Verificar mensaje: "⚠️ Por favor, selecciona un país"

---

## 📁 ARCHIVOS MODIFICADOS

### Frontend

1. **[src/pages/trivia/TriviaPlayPage.jsx](src/pages/trivia/TriviaPlayPage.jsx)**
   - Líneas 186-203: Lógica condicional corregida (solo muestra pregunta O resultado)
   - Comentarios agregados para claridad

2. **[src/components/travel/AddPlaceModal.jsx](src/components/travel/AddPlaceModal.jsx)**
   - Líneas 29-81: handleSubmit con mejor validación y logs
   - Líneas 154-182: Campo fecha con label opcional, max date, botón limpiar
   - Mensajes de error mejorados con emojis

### Backend
- **Sin cambios en esta iteración**
- **Pendiente:** Verificar que TriviaService no envíe preguntas duplicadas

---

## 🐛 BUGS RESUELTOS

1. ✅ **Trivia se bloqueaba después de responder** → Lógica de renderizado corregida
2. ✅ **Fecha no era claramente opcional** → Label y texto explicativo agregados
3. ✅ **Calendario no accesible** → Max date, placeholder, botón limpiar
4. ✅ **Mensajes de error genéricos en mapa** → Mensajes específicos y logs
5. ✅ **Validación de datos débil** → trim() y validación mejorada

---

## ⚠️ PENDIENTES

### Preguntas Duplicadas en Trivia
**Ubicación:** Backend - TriviaService.java

**Problema:** El backend puede enviar la misma pregunta dos veces en una partida.

**Solución Recomendada:**
1. Mantener lista de IDs de preguntas ya respondidas en la entidad `TriviaGame`
2. Al obtener siguiente pregunta, filtrar las ya usadas
3. Si no hay suficientes preguntas únicas, mostrar error descriptivo

**Código Sugerido:**
```java
@Entity
public class TriviaGame {
    // ...
    @OneToMany(mappedBy = "game")
    private List<TriviaAnswer> answers;

    public List<Long> getUsedQuestionIds() {
        return answers.stream()
            .map(answer -> answer.getQuestion().getId())
            .distinct()
            .collect(Collectors.toList());
    }
}

// En TriviaService.java
public TriviaQuestionDTO getNextQuestion(Long gameId, Long userId) {
    TriviaGame game = getGameOrThrow(gameId, userId);

    // Obtener IDs de preguntas ya usadas
    List<Long> usedQuestionIds = game.getUsedQuestionIds();

    // Buscar pregunta que NO esté en la lista
    TriviaQuestion question = triviaQuestionRepository
        .findRandomQuestionNotIn(
            usedQuestionIds,
            game.getDifficulty(),
            game.getQuestionType()
        )
        .orElseThrow(() -> new BusinessException(
            "No hay más preguntas disponibles para esta configuración"
        ));

    return triviaMapper.toDTO(question);
}
```

---

## ✅ ESTADO ACTUAL

**Trivia:**
- ✅ No se bloquea después de responder
- ✅ Transición fluida pregunta → resultado → siguiente
- ⚠️ Backend debe verificar preguntas duplicadas

**Mapa:**
- ✅ Fecha claramente opcional
- ✅ Calendario accesible y restringido
- ✅ Botón para quitar fecha
- ✅ Mensajes de error claros
- ✅ Logs de debugging
- ✅ Validación de datos mejorada

**Ambos servicios corriendo:**
- Backend: http://localhost:8080
- Frontend: http://localhost:5173

---

## 🚀 PRÓXIMOS PASOS

1. **Verificar en navegador:**
   - http://localhost:5173/trivia
   - http://localhost:5173/travel

2. **Probar flujos completos:**
   - Jugar partida de trivia completa
   - Agregar varios países al mapa

3. **Si encuentras preguntas duplicadas:**
   - Reportar con capturas de pantalla
   - Modificar TriviaService.java según recomendación arriba

---

**Todos los cambios aplicados y listos para probar.** 🎉
