// Archivo: src/App.jsx
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Páginas
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import CategoryListPage from './pages/CategoryListPage'
import ForumListPage from './pages/ForumListPage'
import ForumDetailPage from './pages/ForumDetailPage'
import ForumCreatePage from './pages/ForumCreatePage'
import ForumEditPage from './pages/ForumEditPage'
import PostDetailPage from './pages/PostDetailPage'
import PostCreatePage from './pages/PostCreatePage'
import PostEditPage from './pages/PostEditPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-12rem)]">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/forums" element={<ForumListPage />} />
          <Route path="/forums/category/:categoryId" element={<ForumListPage />} />
          <Route path="/forums/:id" element={<ForumDetailPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          
          {/* Rutas protegidas (requieren autenticación) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/forums/create" element={
            <ProtectedRoute>
              <ForumCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/forums/:id/edit" element={
            <ProtectedRoute>
              <ForumEditPage />
            </ProtectedRoute>
          } />
          <Route path="/forums/:forumId/posts/create" element={
            <ProtectedRoute>
              <PostCreatePage />
            </ProtectedRoute>
          } />
          <Route path="/posts/:id/edit" element={
            <ProtectedRoute>
              <PostEditPage />
            </ProtectedRoute>
          } />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </>
  )
}

export default App