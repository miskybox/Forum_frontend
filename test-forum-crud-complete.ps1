# Script completo de pruebas CRUD para Foros
# Prueba: Login, Crear Foro, Crear Post, Comentar, Tags, Editar, Eliminar

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "PRUEBA COMPLETA DE CRUD - FOROS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Configuración
$baseUrl = "http://localhost:8080/api"
$testResults = @{
    Passed = 0
    Failed = 0
    Tests = @()
}

# Función para esperar que el backend esté listo
function Wait-ForBackend {
    Write-Host "Esperando que el backend esté listo..." -ForegroundColor Yellow
    $maxAttempts = 60
    $attempt = 0

    while ($attempt -lt $maxAttempts) {
        try {
            $null = Invoke-WebRequest -Uri "$baseUrl/categories" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
            Write-Host "Backend esta listo!" -ForegroundColor Green
            return $true
        } catch {
            $attempt++
            if ($attempt % 10 -eq 0) {
                Write-Host "Esperando... intento $attempt/$maxAttempts" -ForegroundColor Gray
            }
            Start-Sleep -Seconds 2
        }
    }

    Write-Host "Backend no respondio despues de $maxAttempts intentos" -ForegroundColor Red
    return $false
}

function Test-Step {
    param(
        [string]$Name,
        [scriptblock]$Action,
        [string]$SuccessMessage
    )

    Write-Host "`n--- TEST: $Name ---" -ForegroundColor Cyan

    try {
        $result = & $Action
        Write-Host "PASS: $SuccessMessage" -ForegroundColor Green
        $testResults.Passed++
        $testResults.Tests += @{ Name = $Name; Status = "PASS"; Message = $SuccessMessage }
        return $result
    } catch {
        Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
        $testResults.Failed++
        $testResults.Tests += @{ Name = $Name; Status = "FAIL"; Message = $_.Exception.Message }
        throw
    }
}

# Esperar backend
if (-not (Wait-ForBackend)) {
    Write-Host "`nERROR: Backend no disponible. Abortando." -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "INICIANDO PRUEBAS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Variables globales para el flujo
$global:token = $null
$global:username = $null
$global:categoryId = $null
$global:forumId = $null
$global:postId = $null
$global:commentId = $null
$global:tagIds = @()

# TEST 1: Login
$loginResult = Test-Step -Name "1. Login de Usuario" -Action {
    $loginBody = @{
        username = "admin"
        password = "Admin123!"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $loginBody

    if (-not $response.accessToken) {
        throw "No se recibio token de acceso"
    }

    $global:token = $response.accessToken
    $global:username = $response.username

    return $response
} -SuccessMessage "Usuario logueado: $($global:username)"

$headers = @{
    "Authorization" = "Bearer $global:token"
    "Content-Type" = "application/json"
}

# TEST 2: Obtener Categorías
$categoryResult = Test-Step -Name "2. Obtener Categorias" -Action {
    $response = Invoke-RestMethod -Uri "$baseUrl/categories" -Method GET -Headers $headers

    if (-not $response -or $response.Count -eq 0) {
        throw "No hay categorias disponibles"
    }

    $global:categoryId = $response[0].id

    return $response
} -SuccessMessage "Categorias obtenidas: $($categoryResult.Count), Usando: $($global:categoryId)"

# TEST 3: Crear Foro
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$forumResult = Test-Step -Name "3. Crear Foro" -Action {
    $forumBody = @{
        name = "Test CRUD Forum - $timestamp"
        description = "Forum de prueba para validar operaciones CRUD completas"
        categoryId = $global:categoryId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/forums" -Method POST -Headers $headers -Body $forumBody

    if (-not $response.id) {
        throw "El foro no se creo correctamente"
    }

    $global:forumId = $response.id

    return $response
} -SuccessMessage "Foro creado - ID: $($global:forumId), Nombre: '$($forumResult.name)'"

# TEST 4: Leer Foro (GET)
$readForumResult = Test-Step -Name "4. Leer Foro Creado" -Action {
    $response = Invoke-RestMethod -Uri "$baseUrl/forums/$global:forumId" -Method GET -Headers $headers

    if ($response.id -ne $global:forumId) {
        throw "El foro obtenido no coincide"
    }

    return $response
} -SuccessMessage "Foro leido correctamente: '$($readForumResult.name)'"

# TEST 5: Actualizar Foro (UPDATE)
$updateForumResult = Test-Step -Name "5. Actualizar Foro" -Action {
    $updateBody = @{
        name = "Test CRUD Forum - UPDATED - $timestamp"
        description = "Descripcion actualizada para pruebas CRUD"
        categoryId = $global:categoryId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/forums/$global:forumId" -Method PUT -Headers $headers -Body $updateBody

    if (-not $response.name.Contains("UPDATED")) {
        throw "El foro no se actualizo correctamente"
    }

    return $response
} -SuccessMessage "Foro actualizado: '$($updateForumResult.name)'"

# TEST 6: Listar todos los Foros
$listForumsResult = Test-Step -Name "6. Listar Foros" -Action {
    $response = Invoke-RestMethod -Uri "$baseUrl/forums" -Method GET -Headers $headers

    $forumCount = if ($response.content) { $response.content.Count } else { $response.Count }

    if ($forumCount -eq 0) {
        throw "No se encontraron foros"
    }

    return $forumCount
} -SuccessMessage "Foros listados: $listForumsResult foros encontrados"

# TEST 7: Crear Post en el Foro
$postResult = Test-Step -Name "7. Crear Post en Foro" -Action {
    $postBody = @{
        title = "Test Post CRUD - $timestamp"
        content = "Contenido del post para probar operaciones CRUD y comentarios"
        forumId = $global:forumId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/posts" -Method POST -Headers $headers -Body $postBody

    if (-not $response.id) {
        throw "El post no se creo correctamente"
    }

    $global:postId = $response.id

    return $response
} -SuccessMessage "Post creado - ID: $($global:postId), Titulo: '$($postResult.title)'"

# TEST 8: Leer Post
$readPostResult = Test-Step -Name "8. Leer Post Creado" -Action {
    $response = Invoke-RestMethod -Uri "$baseUrl/posts/$global:postId" -Method GET -Headers $headers

    if ($response.id -ne $global:postId) {
        throw "El post obtenido no coincide"
    }

    return $response
} -SuccessMessage "Post leido: '$($readPostResult.title)'"

# TEST 9: Actualizar Post
$updatePostResult = Test-Step -Name "9. Actualizar Post" -Action {
    $updateBody = @{
        title = "Test Post CRUD - UPDATED - $timestamp"
        content = "Contenido actualizado del post"
        forumId = $global:forumId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/posts/$global:postId" -Method PUT -Headers $headers -Body $updateBody

    if (-not $response.title.Contains("UPDATED")) {
        throw "El post no se actualizo correctamente"
    }

    return $response
} -SuccessMessage "Post actualizado: '$($updatePostResult.title)'"

# TEST 10: Crear Comentario
$commentResult = Test-Step -Name "10. Crear Comentario en Post" -Action {
    $commentBody = @{
        content = "Comentario de prueba CRUD - $timestamp"
        postId = $global:postId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/comments" -Method POST -Headers $headers -Body $commentBody

    if (-not $response.id) {
        throw "El comentario no se creo correctamente"
    }

    $global:commentId = $response.id

    return $response
} -SuccessMessage "Comentario creado - ID: $($global:commentId)"

# TEST 11: Leer Comentarios del Post
$readCommentsResult = Test-Step -Name "11. Leer Comentarios del Post" -Action {
    $response = Invoke-RestMethod -Uri "$baseUrl/posts/$global:postId" -Method GET -Headers $headers

    if (-not $response.comments -or $response.comments.Count -eq 0) {
        throw "No se encontraron comentarios en el post"
    }

    return $response.comments.Count
} -SuccessMessage "Comentarios leidos: $readCommentsResult comentario(s)"

# TEST 12: Actualizar Comentario
$updateCommentResult = Test-Step -Name "12. Actualizar Comentario" -Action {
    $updateBody = @{
        content = "Comentario ACTUALIZADO - $timestamp"
        postId = $global:postId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/comments/$global:commentId" -Method PUT -Headers $headers -Body $updateBody

    if (-not $response.content.Contains("ACTUALIZADO")) {
        throw "El comentario no se actualizo correctamente"
    }

    return $response
} -SuccessMessage "Comentario actualizado correctamente"

# TEST 13: Crear segundo comentario
$comment2Result = Test-Step -Name "13. Crear Segundo Comentario" -Action {
    $commentBody = @{
        content = "Segundo comentario para validar multiples comentarios - $timestamp"
        postId = $global:postId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/comments" -Method POST -Headers $headers -Body $commentBody

    if (-not $response.id) {
        throw "El segundo comentario no se creo"
    }

    return $response
} -SuccessMessage "Segundo comentario creado - ID: $($comment2Result.id)"

# TEST 14: Buscar Foros
$searchResult = Test-Step -Name "14. Buscar Foros (Search)" -Action {
    $searchQuery = "CRUD"
    $response = Invoke-RestMethod -Uri "$baseUrl/forums/search?query=$searchQuery" -Method GET -Headers $headers

    $resultCount = if ($response.content) { $response.content.Count } else { $response.Count }

    if ($resultCount -eq 0) {
        throw "La busqueda no retorno resultados"
    }

    return $resultCount
} -SuccessMessage "Busqueda exitosa: $searchResult resultado(s) para 'CRUD'"

# TEST 15: Obtener Posts del Foro
$forumPostsResult = Test-Step -Name "15. Obtener Posts del Foro" -Action {
    $response = Invoke-RestMethod -Uri "$baseUrl/forums/$global:forumId/posts" -Method GET -Headers $headers

    $postCount = if ($response.content) { $response.content.Count } else { $response.Count }

    if ($postCount -eq 0) {
        throw "No se encontraron posts en el foro"
    }

    return $postCount
} -SuccessMessage "Posts del foro obtenidos: $forumPostsResult post(s)"

# TEST 16: Tags - Verificar si existen tags disponibles
$tagsResult = Test-Step -Name "16. Verificar Tags Disponibles" -Action {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/tags" -Method GET -Headers $headers -ErrorAction SilentlyContinue
        return $response
    } catch {
        # Si no existe el endpoint de tags, retornar mensaje
        Write-Host "  Endpoint de tags no disponible o no implementado" -ForegroundColor Yellow
        return @()
    }
} -SuccessMessage "Tags verificados (puede no estar implementado)"

# TEST 17: Eliminar Comentario
$deleteCommentResult = Test-Step -Name "17. Eliminar Comentario (DELETE)" -Action {
    $null = Invoke-RestMethod -Uri "$baseUrl/comments/$global:commentId" -Method DELETE -Headers $headers

    # Verificar que ya no existe
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/comments/$global:commentId" -Method GET -Headers $headers -ErrorAction Stop
        throw "El comentario aun existe despues de eliminarlo"
    } catch {
        # Si da error 404, es correcto
        if ($_.Exception.Response.StatusCode -eq 404 -or $_.Exception.Message -like "*404*") {
            return $true
        }
        throw
    }
} -SuccessMessage "Comentario eliminado correctamente"

# TEST 18: Eliminar Post
$deletePostResult = Test-Step -Name "18. Eliminar Post (DELETE)" -Action {
    $null = Invoke-RestMethod -Uri "$baseUrl/posts/$global:postId" -Method DELETE -Headers $headers

    # Verificar que ya no existe
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/posts/$global:postId" -Method GET -Headers $headers -ErrorAction Stop
        throw "El post aun existe despues de eliminarlo"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404 -or $_.Exception.Message -like "*404*") {
            return $true
        }
        throw
    }
} -SuccessMessage "Post eliminado correctamente"

# TEST 19: Eliminar Foro
$deleteForumResult = Test-Step -Name "19. Eliminar Foro (DELETE)" -Action {
    $null = Invoke-RestMethod -Uri "$baseUrl/forums/$global:forumId" -Method DELETE -Headers $headers

    # Verificar que ya no existe
    try {
        $null = Invoke-RestMethod -Uri "$baseUrl/forums/$global:forumId" -Method GET -Headers $headers -ErrorAction Stop
        throw "El foro aun existe despues de eliminarlo"
    } catch {
        if ($_.Exception.Response.StatusCode -eq 404 -or $_.Exception.Message -like "*404*") {
            return $true
        }
        throw
    }
} -SuccessMessage "Foro eliminado correctamente"

# Resumen Final
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$totalTests = $testResults.Passed + $testResults.Failed
$passRate = if ($totalTests -gt 0) { [math]::Round(($testResults.Passed / $totalTests) * 100, 2) } else { 0 }

Write-Host "Total de Tests: $totalTests" -ForegroundColor White
Write-Host "Pasados: $($testResults.Passed)" -ForegroundColor Green
Write-Host "Fallados: $($testResults.Failed)" -ForegroundColor Red
Write-Host "Tasa de Exito: $passRate%" -ForegroundColor $(if ($passRate -eq 100) { "Green" } else { "Yellow" })

Write-Host "`n--- Detalle de Tests ---`n" -ForegroundColor Cyan

foreach ($test in $testResults.Tests) {
    $color = if ($test.Status -eq "PASS") { "Green" } else { "Red" }
    $symbol = if ($test.Status -eq "PASS") { "[PASS]" } else { "[FAIL]" }
    Write-Host "$symbol $($test.Name)" -ForegroundColor $color
    Write-Host "   $($test.Message)" -ForegroundColor Gray
}

if ($testResults.Failed -eq 0) {
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "TODAS LAS PRUEBAS PASARON" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "ALGUNAS PRUEBAS FALLARON" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    exit 1
}
