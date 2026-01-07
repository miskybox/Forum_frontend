# Testing Guide

## Prerequisites

1. **Backend** must be running on `http://localhost:8080`
   ```bash
   cd Forum_backend
   ./mvnw.cmd spring-boot:run
   ```

2. **Frontend** must be running on `http://localhost:5173`
   ```bash
   cd Forum_frontend
   npm run dev
   ```

## Automated Tests

### 1. Forum Functionality Test

Tests the complete forum flow: register → login → create forum → create post → add comment

```powershell
powershell -ExecutionPolicy Bypass -File test-forum-flow.ps1
```

**What it tests:**
- User registration with strong password (8+ chars, upper, lower, special)
- User login and token retrieval
- Category listing
- Forum creation
- Post creation in forum
- Comment creation on post
- Comment verification

### 2. Map Functionality Test

Tests adding countries to user's travel map

```powershell
powershell -ExecutionPolicy Bypass -File test-map-functionality.ps1
```

**What it tests:**
- Adding countries with different statuses (VISITED, WISHLIST, LIVED)
- Updating existing countries
- Retrieving user's travel places
- Different ratings and notes

**Note:** This test requires a valid access token. Get it from:
1. Login at `http://localhost:5173/login`
2. Click "Debug Storage" button (bottom right)
3. Copy the access token

## Manual Testing Checklist

### Registration & Login

- [ ] Navigate to `http://localhost:5173/register`
- [ ] Fill all required fields
- [ ] Password field shows hint: "Debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas y un símbolo especial" (Spanish) or "Must have at least 8 characters, including uppercase, lowercase and a special symbol" (English)
- [ ] Try weak password (e.g., "test123") - should show validation error
- [ ] Use strong password (e.g., "TestPass123!")
- [ ] After successful registration, should redirect to `/login`
- [ ] Login with created credentials
- [ ] Should redirect to home page after login

### Forums

#### Create Forum
- [ ] Navigate to "Forums" page
- [ ] Click "Create New Forum" button
- [ ] Fill in:
  - Title (e.g., "Travel Tips for Japan")
  - Description (e.g., "Share your experiences and tips for traveling in Japan")
  - Select a continent/category
- [ ] Optional: Upload forum image
- [ ] Click "Create Forum" button
- [ ] Should see success message and navigate to new forum

#### Create Post
- [ ] Open a forum
- [ ] Click "New Post" or "Create Post" button
- [ ] Fill in:
  - Title (e.g., "Best time to visit Tokyo")
  - Content (e.g., "I recommend visiting in spring...")
- [ ] Click "Create Post" button
- [ ] Should see post in forum list

#### Add Comment
- [ ] Open a post
- [ ] Scroll to comments section
- [ ] Type comment in text area
- [ ] Click "Add Comment" button
- [ ] Should see comment appear below
- [ ] Comment should show your username and timestamp

#### Add Tags (if available)
- [ ] When creating/editing post, look for tags field
- [ ] Add relevant tags (e.g., "tips", "tokyo", "spring")
- [ ] Save post
- [ ] Verify tags appear on post card

### Travel Map

#### Add Country to Map
- [ ] Navigate to "My Map" page (`/my-map`)
- [ ] Click on a country on the map
- [ ] Modal should appear with country form
- [ ] Fill in:
  - Status (VISITED, WISHLIST, LIVED, LIVING)
  - Notes (optional)
  - Rating (1-5 stars, optional for WISHLIST)
- [ ] Click "Save" button
- [ ] Country should change color on map based on status

#### View Country Details
- [ ] Click on a country you've added
- [ ] Should show modal with saved information
- [ ] Can edit or delete the country

#### Legend
- [ ] Verify legend in top-right corner
- [ ] Text should be readable (cream-100 color)
- [ ] Should show:
  - ✅ Visitado (Visited)
  - ⭐ Quiero ir (Wishlist)
  - 🏠 He vivido (Lived)
  - 📍 Vivo aquí (Living)

### Accessibility Checks

#### Language Switching
- [ ] Click language selector in navbar
- [ ] Switch between Spanish (ES) and English (EN)
- [ ] All UI elements should translate
- [ ] Form hints and placeholders should translate
- [ ] Error messages should translate

#### Password Fields
- [ ] Verify password hint appears in correct language
- [ ] Spanish: "Debe tener mínimo 8 caracteres..."
- [ ] English: "Must have at least 8 characters..."
- [ ] Verify confirm password hint appears in correct language
- [ ] Spanish: "Repite la contraseña..."
- [ ] English: "Repeat the password..."

#### Show/Hide Password Buttons
- [ ] Click eye icon to show password
- [ ] Password should become visible
- [ ] Aria-label should say "Ocultar contraseña" (ES) or "Hide password" (EN)
- [ ] Click again to hide
- [ ] Aria-label should say "Mostrar contraseña" (ES) or "Show password" (EN)

### LocalStorage Debug Tool (Development Only)

- [ ] Should see "Debug Storage" button in bottom-right corner
- [ ] Click to open debug panel
- [ ] Should show:
  - Token presence (YES/NO)
  - Token length
  - Token preview (first 50 chars)
  - Refresh token info
- [ ] Can clear tokens with "Clear Tokens" button
- [ ] Panel updates every second

## Expected Test Results

### All 434 Tests Should Pass

```bash
cd Forum_frontend
npm test -- --run
```

**Expected output:**
```
Test Files  25 passed (25)
Tests       434 passed (434)
```

### Key Test Files:
- `LoginForm.test.jsx` - 10 tests
- `RegisterForm.test.jsx` - 13 tests
- `LocalStorageDebug.test.jsx` - 11 tests

## Troubleshooting

### Backend not starting
- Check if PostgreSQL is running
- Verify `application.properties` database connection
- Check for port 8080 conflicts: `netstat -ano | findstr :8080`

### Frontend not starting
- Run `npm install` if dependencies missing
- Check for port 5173 conflicts: `netstat -ano | findstr :5173`
- Clear `node_modules` and reinstall if issues persist

### Tests failing
- Run `npm install` to ensure dependencies are up to date
- Check that LanguageContext provider is properly set up
- Verify test-utils.jsx has TestWrapper with LanguageProvider

### Token issues
- Use LocalStorageDebug tool to verify token storage
- Check browser console for authentication errors
- Verify token is being sent in Authorization header

## Recent Changes

### Accessibility Improvements
- Fixed map legend text color (now `cream-100` for better contrast)
- Added missing i18n translations for password hints
- All form labels and hints now properly translated

### Test Improvements
- Migrated RegisterForm tests to use `renderWithProviders`
- Fixed LoginForm tests to use correct password placeholder
- All 434 tests passing

### New Features
- LocalStorageDebug component for development debugging
- Real-time token monitoring
- Token clear functionality
