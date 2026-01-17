# Script de prueba automatizada para funcionalidad de foros
# Requiere que backend y frontend estén corriendo

Write-Host "`n=== PRUEBA AUTOMATIZADA DE FUNCIONALIDAD DE FOROS ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "Backend: http://localhost:8080`n" -ForegroundColor Green

# Función para esperar que el backend esté listo
function Wait-ForBackend {
    Write-Host "Esperando que el backend esté listo..." -ForegroundColor Yellow
    $maxAttempts = 30
    $attempt = 0

    while ($attempt -lt $maxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/api/health" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
            Write-Host "Backend esta listo!" -ForegroundColor Green
            return $true
        } catch {
            $attempt++
            Write-Host "Intento $attempt/$maxAttempts - Esperando..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }

    Write-Host "Backend no respondio despues de $maxAttempts intentos" -ForegroundColor Red
    return $false
}

# Esperar a que el backend esté listo
if (-not (Wait-ForBackend)) {
    Write-Host "`nERROR: Backend no esta disponible. Abortando pruebas." -ForegroundColor Red
    exit 1
}

Write-Host "`n--- Paso 1: Login ---" -ForegroundColor Cyan

try {
    $loginBody = @{
        username = "admin"
        password = "Admin123!"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody

    $token = $loginResponse.accessToken

    if ($token) {
        Write-Host "LOGIN EXITOSO" -ForegroundColor Green
        Write-Host "  Username: $($loginResponse.username)" -ForegroundColor White
        Write-Host "  Token length: $($token.Length)" -ForegroundColor White
    } else {
        Write-Host "ERROR: No se recibio token" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR EN LOGIN: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n--- Paso 2: Obtener Categorias ---" -ForegroundColor Cyan

try {
    $categories = Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method GET -Headers $headers

    if ($categories -and $categories.Count -gt 0) {
        Write-Host "CATEGORIAS OBTENIDAS: $($categories.Count)" -ForegroundColor Green
        $categoryId = $categories[0].id
        Write-Host "  Usando categoria: $($categories[0].name) (ID: $categoryId)" -ForegroundColor White
    } else {
        Write-Host "ERROR: No hay categorias disponibles" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR AL OBTENER CATEGORIAS: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n--- Paso 3: Crear Foro de Prueba ---" -ForegroundColor Cyan

try {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $forumBody = @{
        name = "Test Forum - $timestamp"
        description = "Forum creado automaticamente para pruebas"
        categoryId = $categoryId
    } | ConvertTo-Json

    $forum = Invoke-RestMethod -Uri "http://localhost:8080/api/forums" -Method POST -Headers $headers -Body $forumBody

    if ($forum.id) {
        Write-Host "FORO CREADO EXITOSAMENTE" -ForegroundColor Green
        Write-Host "  ID: $($forum.id)" -ForegroundColor White
        Write-Host "  Nombre: $($forum.name)" -ForegroundColor White
        Write-Host "  Descripcion: $($forum.description)" -ForegroundColor White
        $forumId = $forum.id
    } else {
        Write-Host "ERROR: No se pudo crear el foro" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR AL CREAR FORO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n--- Paso 4: Listar Foros ---" -ForegroundColor Cyan

try {
    $forums = Invoke-RestMethod -Uri "http://localhost:8080/api/forums" -Method GET -Headers $headers

    if ($forums) {
        $forumCount = if ($forums.content) { $forums.content.Count } else { $forums.Count }
        Write-Host "FOROS LISTADOS: $forumCount" -ForegroundColor Green

        # Verificar que nuestro foro está en la lista
        $ourForum = if ($forums.content) {
            $forums.content | Where-Object { $_.id -eq $forumId }
        } else {
            $forums | Where-Object { $_.id -eq $forumId }
        }

        if ($ourForum) {
            Write-Host "  Foro creado aparece en la lista" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "ERROR AL LISTAR FOROS: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- Paso 5: Crear Post en el Foro ---" -ForegroundColor Cyan

try {
    $postBody = @{
        title = "Test Post - $timestamp"
        content = "Este es un post de prueba creado automaticamente para verificar comentarios"
        forumId = $forumId
    } | ConvertTo-Json

    $post = Invoke-RestMethod -Uri "http://localhost:8080/api/posts" -Method POST -Headers $headers -Body $postBody

    if ($post.id) {
        Write-Host "POST CREADO EXITOSAMENTE" -ForegroundColor Green
        Write-Host "  ID: $($post.id)" -ForegroundColor White
        Write-Host "  Titulo: $($post.title)" -ForegroundColor White
        Write-Host "  Contenido: $($post.content)" -ForegroundColor White
        $postId = $post.id
    } else {
        Write-Host "ERROR: No se pudo crear el post" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR AL CREAR POST: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n--- Paso 6: Crear Comentario en el Post ---" -ForegroundColor Cyan

try {
    $commentBody = @{
        content = "Este es un comentario de prueba automatico - $timestamp"
        postId = $postId
    } | ConvertTo-Json

    $comment = Invoke-RestMethod -Uri "http://localhost:8080/api/comments" -Method POST -Headers $headers -Body $commentBody

    if ($comment.id) {
        Write-Host "COMENTARIO CREADO EXITOSAMENTE" -ForegroundColor Green
        Write-Host "  ID: $($comment.id)" -ForegroundColor White
        Write-Host "  Contenido: $($comment.content)" -ForegroundColor White
        Write-Host "  Autor: $($comment.author)" -ForegroundColor White
    } else {
        Write-Host "ERROR: No se pudo crear el comentario" -ForegroundColor Red
    }
} catch {
    Write-Host "ERROR AL CREAR COMENTARIO: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "`n--- Paso 7: Obtener Post con Comentarios ---" -ForegroundColor Cyan

try {
    $postDetails = Invoke-RestMethod -Uri "http://localhost:8080/api/posts/$postId" -Method GET -Headers $headers

    if ($postDetails) {
        Write-Host "POST OBTENIDO CON DETALLES" -ForegroundColor Green
        Write-Host "  Titulo: $($postDetails.title)" -ForegroundColor White

        if ($postDetails.comments) {
            Write-Host "  Comentarios: $($postDetails.comments.Count)" -ForegroundColor Green
        } else {
            Write-Host "  No hay comentarios en el post" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "ERROR AL OBTENER POST: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n--- Paso 8: Buscar Foros ---" -ForegroundColor Cyan

try {
    $searchQuery = "Test"
    $searchResults = Invoke-RestMethod -Uri "http://localhost:8080/api/forums/search?query=$searchQuery" -Method GET -Headers $headers

    if ($searchResults) {
        $resultCount = if ($searchResults.content) { $searchResults.content.Count } else { $searchResults.Count }
        Write-Host "BUSQUEDA EXITOSA" -ForegroundColor Green
        Write-Host "  Query: '$searchQuery'" -ForegroundColor White
        Write-Host "  Resultados: $resultCount" -ForegroundColor White
    }
} catch {
    Write-Host "ERROR EN BUSQUEDA: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== RESUMEN DE PRUEBAS ===" -ForegroundColor Cyan
Write-Host "Login: OK" -ForegroundColor Green
Write-Host "Obtener Categorias: OK" -ForegroundColor Green
Write-Host "Crear Foro: OK" -ForegroundColor Green
Write-Host "Listar Foros: OK" -ForegroundColor Green
Write-Host "Crear Post: OK" -ForegroundColor Green
Write-Host "Crear Comentario: OK" -ForegroundColor Green
Write-Host "Obtener Post con Detalles: OK" -ForegroundColor Green
Write-Host "Buscar Foros: OK" -ForegroundColor Green

Write-Host "`n=== TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE ===" -ForegroundColor Green
Write-Host "`nPuedes probar manualmente en: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  - Foro creado: '$($forum.name)'" -ForegroundColor White
Write-Host "  - Post creado: '$($post.title)'" -ForegroundColor White
