// Archivo: src/App.jsx
import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useIdleLogout } from './hooks/useIdleLogout';
import NotFoundPage from './pages/NotFoundPage';
import { Toaster } from 'react-hot-toast';
import "./index.css";

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForumListPage from './pages/ForumListPage';
import ForumDetailPage from './pages/ForumDetailsPage';
import PostDetailPage from './pages/PostDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';

const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CategoryListPage = lazy(() => import('./pages/CategoryListPage'));
const ForumCreatePage = lazy(() => import('./pages/ForumCreatePage'));
const ForumEditPage = lazy(() => import('./pages/ForumEditPage'));
const PostCreatePage = lazy(() => import('./pages/PostCreatePage'));
const PostEditPage = lazy(() => import('./pages/PostEditPage'));
const TravelMapPage = lazy(() => import('./pages/travel/TravelMapPage'));
const TriviaHomePage = lazy(() => import('./pages/trivia/TriviaHomePage'));
const TriviaPlayPage = lazy(() => import('./pages/trivia/TriviaPlayPage'));
const TriviaLeaderboardPage = lazy(() => import('./pages/trivia/TriviaLeaderboardPage'));
const TriviaInfinitePage = lazy(() => import('./pages/trivia/TriviaInfinitePage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const ModeratorDashboardPage = lazy(() => import('./pages/ModeratorDashboardPage'));
const MessagesPage = lazy(() => import('./pages/messages/MessagesPage'));
const NotificationsPage = lazy(() => import('./pages/notifications/NotificationsPage'));
const FeedPage = lazy(() => import('./pages/feed/FeedPage'));
const UsersPage = lazy(() => import('./pages/users/UsersPage'));

function App() {
  useIdleLogout();

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
        className="min-h-[calc(100vh-12rem)]"
        tabIndex={-1}
        aria-label="Contenido principal"
      >
        <Suspense fallback={<LoadingSpinner label="Cargando" />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          
          {/* Diarios = posts with photos (no separate blog CMS) */}
          <Route path="/blog" element={<Navigate to="/feed?tab=photos" replace />} />
          <Route path="/blog/*" element={<Navigate to="/feed?tab=photos" replace />} />
          
          {/* Rutas de Información */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />

          <Route path="/feed" element={<FeedPage />} />
          <Route path="/contenido" element={<FeedPage />} />

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
        </Suspense>
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
          // Snackbar style from the palette: inverse surface, light text, level-3 shadow
          style: {
            background: '#2c322f',
            color: '#ecf2ed',
            padding: '12px 16px',
            fontSize: '14px',
            borderRadius: '0.75rem',
            boxShadow: '0 20px 32px -8px rgba(30, 36, 33, 0.16)',
            fontFamily: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#adcebe',
              secondary: '#2c322f',
            },
            ariaProps: {
              role: 'status',
              'aria-live': 'polite',
            },
          },
          error: {
            iconTheme: {
              primary: '#ffb4ab',
              secondary: '#2c322f',
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