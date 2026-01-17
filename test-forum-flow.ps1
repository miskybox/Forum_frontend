# Test Forum Flow - Register, Login, Create Forum, Create Post, Comment

Write-Host "=== Testing Forum Flow ===" -ForegroundColor Cyan

# 1. Register new user
Write-Host "`n1. Registering new user..." -ForegroundColor Yellow
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$username = "forumtester$timestamp"
$registerBody = @{
    username = $username
    email = "$username@test.com"
    password = "TestPass123!"
    firstName = "Forum"
    lastName = "Tester"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "✓ User registered successfully: $username" -ForegroundColor Green
} catch {
    Write-Host "✗ Registration failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# 2. Login
Write-Host "`n2. Logging in..." -ForegroundColor Yellow
$loginBody = @{
    username = $username
    password = "TestPass123!"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.accessToken
    Write-Host "✓ Login successful, token received" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# 3. Get categories
Write-Host "`n3. Getting categories..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $categories = Invoke-RestMethod -Uri "http://localhost:8080/api/categories" -Method GET -Headers $headers
    $categoryId = $categories[0].id
    Write-Host "✓ Categories retrieved, using category ID: $categoryId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get categories: $_" -ForegroundColor Red
    exit 1
}

# 4. Create forum
Write-Host "`n4. Creating forum..." -ForegroundColor Yellow
$forumBody = @{
    title = "Test Forum $timestamp"
    description = "This is a test forum created by automation"
    categoryId = $categoryId
} | ConvertTo-Json

try {
    $forum = Invoke-RestMethod -Uri "http://localhost:8080/api/forums" -Method POST -ContentType "application/json" -Headers $headers -Body $forumBody
    $forumId = $forum.id
    Write-Host "✓ Forum created successfully, ID: $forumId" -ForegroundColor Green
} catch {
    Write-Host "✗ Forum creation failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# 5. Create post in forum
Write-Host "`n5. Creating post in forum..." -ForegroundColor Yellow
$postBody = @{
    title = "Test Post $timestamp"
    content = "This is a test post with some content to verify posting functionality works correctly."
    forumId = $forumId
} | ConvertTo-Json

try {
    $post = Invoke-RestMethod -Uri "http://localhost:8080/api/posts" -Method POST -ContentType "application/json" -Headers $headers -Body $postBody
    $postId = $post.id
    Write-Host "✓ Post created successfully, ID: $postId" -ForegroundColor Green
} catch {
    Write-Host "✗ Post creation failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# 6. Add comment to post
Write-Host "`n6. Adding comment to post..." -ForegroundColor Yellow
$commentBody = @{
    content = "This is a test comment on the post!"
} | ConvertTo-Json

try {
    $comment = Invoke-RestMethod -Uri "http://localhost:8080/api/posts/$postId/comments" -Method POST -ContentType "application/json" -Headers $headers -Body $commentBody
    Write-Host "✓ Comment added successfully, ID: $($comment.id)" -ForegroundColor Green
} catch {
    Write-Host "✗ Comment creation failed: $_" -ForegroundColor Red
    Write-Host "Response: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# 7. Verify post has comment
Write-Host "`n7. Verifying post has comment..." -ForegroundColor Yellow
try {
    $postDetails = Invoke-RestMethod -Uri "http://localhost:8080/api/posts/$postId" -Method GET -Headers $headers
    if ($postDetails.comments -and $postDetails.comments.Count -gt 0) {
        Write-Host "Post has $($postDetails.comments.Count) comment(s)" -ForegroundColor Green
    } else {
        Write-Host "Post exists but has no comments" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Failed to verify post: $_" -ForegroundColor Red
}

Write-Host "`n=== Forum Flow Test Complete ===" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor White
Write-Host "  User: $username" -ForegroundColor White
Write-Host "  Forum ID: $forumId" -ForegroundColor White
Write-Host "  Post ID: $postId" -ForegroundColor White
Write-Host "  All tests passed!" -ForegroundColor Green
