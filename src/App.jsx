// Archivo: src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Footer from './components/common/Footer';
import { useTheme } from './contexts/ThemeContext';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';
// LocalStorageDebug removed - was only for development debugging
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
import PostDetailPage from './pages/PostDetailsPage';

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

// Páginas de Mensajes
import MessagesPage from './pages/messages/MessagesPage'

// Páginas de Notificaciones
import NotificationsPage from './pages/notifications/NotificationsPage';

// Páginas de Contenido/Feed
import FeedPage from './pages/feed/FeedPage';

// Página de Usuarios
import UsersPage from './pages/users/UsersPage';


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
      {/* Skip to main content link para accesibilidad */}
      <a 
        href="#main-content" 
        className="skip-to-main"
        aria-label="Saltar al contenido principal"
      >
        Saltar al contenido principal
      </a>
      <Navbar />
      <main 
        id="main-content" 
        className={`min-h-[calc(100vh-12rem)] theme-${theme}`}
        tabIndex={-1}
        aria-label="Contenido principal"
      >
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

          {/* Rutas de Feed (solo usuarios logueados - estilo Instagram) */}
          <Route path="/feed" element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          } />
          <Route path="/contenido" element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          } />

          {/* Rutas de Usuarios */}
          <Route path="/usuarios" element={<UsersPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />

          {/* Rutas de Mensajes */}
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />
          <Route path="/messages/:userId" element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          } />

          {/* Rutas de Notificaciones */}
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />

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

      {/* Toaster con accesibilidad mejorada */}
      <Toaster 
        position="top-center"
        containerAriaLabel="Notificaciones"
        toastOptions={{
          duration: 4000,
          ariaProps: {
            role: 'status',
            'aria-live': 'polite',
          },
          style: {
            background: '#0d1b2e',
            color: '#f2f6fb',
            border: '1px solid #2356a3',
            padding: '16px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#2f8a68',
              secondary: '#0d1b2e',
            },
            ariaProps: {
              role: 'status',
              'aria-live': 'polite',
            },
          },
          error: {
            iconTheme: {
              primary: '#d6453d',
              secondary: '#0d1b2e',
            },
            style: {
              border: '1px solid #d6453d',
            },
            ariaProps: {
              role: 'alert',
              'aria-live': 'assertive',
            },
          },
        }}
      />
    </>
  )
}

export default App