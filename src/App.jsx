// Archivo: src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Footer from './components/common/Footer';
import { useTheme } from './contexts/ThemeContext';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';
import "./index.css";

// Páginas principales
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CategoryListPage from './pages/CategoryListPage';
import ForumListPage from './pages/ForumListPage';
import ForumDetailPage from './pages/ForumDetailsPage';
import ForumCreatePage from './pages/ForumCreatePage';
import ForumEditPage from './pages/ForumEditPage';
import PostCreatePage from './pages/PostCreatePage';
import PostEditPage from './pages/PostEditPage';
import PostDetailPage from './pages/PostDeatilsPage';

// Páginas de Mapa de Viajes
import TravelMapPage from './pages/travel/TravelMapPage';

// Páginas de Trivia
import TriviaHomePage from './pages/trivia/TriviaHomePage';
import TriviaPlayPage from './pages/trivia/TriviaPlayPage';
import TriviaLeaderboardPage from './pages/trivia/TriviaLeaderboardPage';
import TriviaInfinitePage from './pages/trivia/TriviaInfinitePage';

// Dashboards
import AdminDashboardPage from './pages/AdminDashboardPage';
import ModeratorDashboardPage from './pages/ModeratorDashboardPage';

// Páginas de Blog
import BlogHomePage from './pages/blog/BlogHomePage';
import BlogPostPage from './pages/blog/BlogPostPage';
import BlogCategoryPage from './pages/blog/BlogCategoryPage';
import BlogSearchPage from './pages/blog/BlogSearchPage';

// Páginas de Información
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';


function App() {
  const { theme } = useTheme();

  // Aplicar tema al body
  React.useEffect(() => {
    document.body.className = `theme-${theme}`;
    return () => {
      document.body.className = '';
    };
  }, [theme]);

  return (
    <>
      <Navbar />
      <main className={`min-h-[calc(100vh-12rem)] theme-${theme}`}>
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
          
          {/* Rutas de Mapa de Viajes */}
          <Route path="/travel" element={<TravelMapPage />} />
          
          {/* Rutas de Trivia */}
          <Route path="/trivia" element={<TriviaHomePage />} />
          <Route path="/trivia/play/:gameId" element={
            <ProtectedRoute>
              <TriviaPlayPage />
            </ProtectedRoute>
          } />
          <Route path="/trivia/leaderboard" element={<TriviaLeaderboardPage />} />
          <Route path="/trivia/infinite" element={
            <ProtectedRoute>
              <TriviaInfinitePage />
            </ProtectedRoute>
          } />
          
          {/* Rutas de Blog */}
          <Route path="/blog" element={<BlogHomePage />} />
          <Route path="/blog/search" element={<BlogSearchPage />} />
          <Route path="/blog/category/:slug" element={<BlogCategoryPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          
          {/* Rutas de Información */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          
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
          
          {/* Dashboards */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRoles={['ROLE_ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/moderator/dashboard" element={
            <ProtectedRoute requiredRoles={['ROLE_MODERATOR', 'ROLE_ADMIN']}>
              <ModeratorDashboardPage />
            </ProtectedRoute>
          } />
          
          {/* Ruta 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid #00ffff',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#1a1a2e',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4444',
              secondary: '#1a1a2e',
            },
            style: {
              border: '1px solid #ff4444',
            },
          },
        }}
      />
    </>
  )
}

export default App