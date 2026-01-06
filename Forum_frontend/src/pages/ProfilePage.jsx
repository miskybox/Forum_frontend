import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import userService from '../services/userService'
import ForumList from '../components/forums/ForumList'
import PostList from '../components/post/PostList'
import { useLanguage } from '../contexts/LanguageContext'

// Generar partículas decorativas una sola vez
const PARTICLES = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 3,
  icon: ['🧭', '✈️', '🗺️', '🌍'][Math.floor(Math.random() * 4)],
}))

/**
 * ProfilePage con tema Adventure
 */
const ProfilePage = () => {
  const { currentUser, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  
  const [profileData, setProfileData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    bio: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  
  const imageInputRef = useRef(null)
  
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        bio: currentUser.bio || ''
      })
      
      if (currentUser.profileImage) {
        setImagePreview(currentUser.profileImage)
      }
      
      setLoading(false)
    }
  }, [currentUser])
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 2 * 1024 * 1024) {
      setErrors({
        ...errors,
        profileImage: 'La imagen debe ser menor a 2 MB'
      })
      return
    }
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        profileImage: 'El formato de imagen debe ser JPEG, PNG, GIF o WEBP'
      })
      return
    }
    
    setProfileImage(file)
    
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    
    if (errors.profileImage) {
      setErrors({
        ...errors,
        profileImage: ''
      })
    }
  }
  
  const validateProfileForm = () => {
    const newErrors = {}
    
    if (!profileData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio'
    } else if (profileData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    }
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio'
    }
    
    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio'
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Introduce un correo electrónico válido'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validatePasswordForm = () => {
    const newErrors = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'La contraseña actual es obligatoria'
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es obligatoria'
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres'
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    
    if (!validateProfileForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await userService.updateUser(currentUser.id, profileData)
      
      if (profileImage) {
        // Lógica para actualizar imagen de perfil
      }
      
      toast.success('Perfil actualizado con éxito')
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors = error.response.data.errors
        const formattedErrors = {}
        
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = backendErrors[key]
        })
        
        setErrors({
          ...errors,
          ...formattedErrors
        })
      } else {
        toast.error('Error al actualizar el perfil')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await userService.changePassword(
        currentUser.id,
        passwordData.currentPassword,
        passwordData.newPassword
      )
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      toast.success('Contraseña actualizada con éxito')
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error)
      
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('current')) {
          setErrors({
            ...errors,
            currentPassword: 'La contraseña actual es incorrecta'
          })
        } else {
          toast.error('Error al actualizar la contraseña')
        }
      } else {
        toast.error('Error al actualizar la contraseña')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🧭</div>
          <p className="text-light-muted">
            {t('profile.loading')}
          </p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="card text-center py-12 max-w-md mx-auto">
            <div className="text-5xl mb-4">🔒</div>
            <p className="text-light-muted mb-6">
              {t('profile.mustLogin')}
            </p>
            <a href="/login" className="btn btn-primary">
              <span className="flex items-center space-x-2">
                <span>🚀</span>
                <span>{t('auth.loginButton')}</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Efectos de fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute text-2xl animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.icon}
          </div>
        ))}
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Cabecera del perfil */}
          <div className="card mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-dark-lighter border-4 border-ocean-500 flex items-center justify-center text-ocean-500 text-4xl">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt={profileData.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profileData.username?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h1 className="text-2xl md:text-3xl font-bold text-ocean-500 mb-1">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-light-muted text-sm mb-2">
                    @{profileData.username}
                  </p>
                  {profileData.bio && (
                    <p className="text-light-soft text-sm">
                      {profileData.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Pestañas */}
          <div className="mb-6">
            <div className="border-b-2 border-ocean-500/30">
              <nav className="flex -mb-px">
                {[
                  { id: 'profile', label: t('profile.tabs.profile'), icon: '👤' },
                  { id: 'password', label: t('profile.tabs.password'), icon: '🔒' },
                  { id: 'forums', label: t('profile.tabs.forums'), icon: '💬' },
                  { id: 'posts', label: t('profile.tabs.posts'), icon: '📝' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`py-4 px-6 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-4 border-ocean-500 text-ocean-500'
                        : 'text-light-muted hover:text-ocean-400'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Contenido de las pestañas */}
          <div className="card">
            <div className="p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-ocean-500 mb-4">
                      {t('profile.personalInfo')}
                    </h2>
                    
                    {/* Imagen de perfil */}
                    <div>
                      <label htmlFor="profileImage" className="block text-sm font-medium text-ocean-400 mb-2">
                        {t('profile.profileImage')}
                      </label>
                      
                      <div className="mt-1 flex items-center">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-dark-lighter border-2 border-ocean-500 flex items-center justify-center text-ocean-500 text-xl mr-4">
                          {imagePreview ? (
                            <img 
                              src={imagePreview} 
                              alt={profileData.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            profileData.username?.charAt(0)?.toUpperCase() || 'U'
                          )}
                        </div>
                        
                        <input
                          id="profileImage"
                          name="profileImage"
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          className="sr-only"
                          onChange={handleImageChange}
                          disabled={isSubmitting}
                        />
                        
                        <label
                          htmlFor="profileImage"
                          className="btn btn-outline px-4 py-2 cursor-pointer"
                        >
                          {t('profile.changeImage')}
                        </label>
                      </div>
                      
                      {errors.profileImage && (
                        <p className="mt-2 text-sm text-error">{errors.profileImage}</p>
                      )}
                    </div>
                    
                    {/* Grid de campos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'firstName', label: t('profile.firstName'), required: true },
                        { id: 'lastName', label: t('profile.lastName'), required: true },
                        { id: 'username', label: t('auth.username'), required: true },
                        { id: 'email', label: t('auth.email'), required: true, type: 'email' },
                      ].map(field => (
                        <div key={field.id}>
                          <label htmlFor={field.id} className="block text-sm font-medium text-ocean-400 mb-2">
                            {field.label} {field.required && <span className="text-error">*</span>}
                          </label>
                          <input
                            id={field.id}
                            name={field.id}
                            type={field.type || 'text'}
                            autoComplete={field.id === 'email' ? 'email' : field.id}
                            required={field.required}
                            className={`input w-full ${errors[field.id] ? 'border-error' : ''}`}
                            value={profileData[field.id]}
                            onChange={handleProfileChange}
                            disabled={isSubmitting}
                          />
                          {errors[field.id] && (
                            <p className="mt-2 text-sm text-error">{errors[field.id]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-ocean-400 mb-2">
                        {t('profile.bio')}
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        className="input w-full"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        placeholder={t('profile.bioPlaceholder')}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center space-x-2">
                          <span className="animate-spin">🧭</span>
                          <span>{t('profile.updating')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <span>💾</span>
                          <span>{t('profile.updateProfile')}</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'password' && (
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-ocean-500 mb-4">
                      {t('profile.password')}
                    </h2>
                    
                    {[
                      { id: 'currentPassword', label: t('profile.currentPassword') },
                      { id: 'newPassword', label: t('profile.newPassword') },
                      { id: 'confirmPassword', label: t('profile.confirmPassword') },
                    ].map(field => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-ocean-400 mb-2">
                          {field.label} <span className="text-error">*</span>
                        </label>
                        <input
                          id={field.id}
                          name={field.id}
                          type="password"
                          autoComplete={field.id === 'currentPassword' ? 'current-password' : 'new-password'}
                          required
                          className={`input w-full ${errors[field.id] ? 'border-error' : ''}`}
                          value={passwordData[field.id]}
                          onChange={handlePasswordChange}
                          disabled={isSubmitting}
                        />
                        {errors[field.id] && (
                          <p className="mt-2 text-sm text-error">{errors[field.id]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center space-x-2">
                          <span className="animate-spin">🧭</span>
                          <span>{t('profile.updating')}</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <span>🔐</span>
                          <span>{t('profile.updatePassword')}</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'forums' && (
                <div>
                  <h2 className="text-xl font-bold text-ocean-500 mb-4">
                    {t('profile.myForums')}
                  </h2>
                  <ForumList />
                </div>
              )}
              
              {activeTab === 'posts' && (
                <div>
                  <h2 className="text-xl font-bold text-ocean-500 mb-4">
                    {t('profile.myPosts')}
                  </h2>
                  <PostList />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
