import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import userService from '../services/userService'
import ForumList from '../components/forums/ForumList'
import PostList from '../components/post/PostList'

/**
 * ProfilePage con tema Tech
 */
const ProfilePage = () => {
  const { currentUser, isAuthenticated } = useAuth()
  
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
      <div className="theme-tech min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🤖</div>
          <p className="text-tech-neon font-retro text-sm uppercase tracking-wider">
            CARGANDO PERFIL...
          </p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return (
      <div className="theme-tech min-h-screen py-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="card border-tech-red text-center py-12 max-w-md mx-auto">
            <div className="text-5xl mb-4">🔒</div>
            <p className="text-tech-neon font-retro text-sm uppercase tracking-wider mb-6">
              DEBES INICIAR SESIÓN
            </p>
            <a href="/login" className="btn btn-primary text-tech-dark border-tech-neon">
              <span className="flex items-center space-x-2">
                <span>👽</span>
                <span>INICIAR SESIÓN</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="theme-tech min-h-screen py-8 relative overflow-hidden">
      {/* Efectos de fondo tech */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {['🤖', '⚡', '🔴', '💻'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Cabecera del perfil */}
          <div className="card border-tech-neon mb-8 animate-fade-in">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-tech-dark border-4 border-tech-neon flex items-center justify-center text-tech-neon text-4xl">
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
                  <h1 className="text-2xl md:text-3xl font-display text-tech-neon neon-text mb-1 uppercase">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-tech-silver font-retro text-sm mb-2 opacity-80">
                    @{profileData.username}
                  </p>
                  {profileData.bio && (
                    <p className="text-tech-silver font-retro text-xs opacity-70">
                      {profileData.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Pestañas */}
          <div className="mb-6">
            <div className="border-b-2 border-tech-neon/30">
              <nav className="flex -mb-px">
                {[
                  { id: 'profile', label: 'PERFIL', icon: '👤' },
                  { id: 'password', label: 'CONTRASEÑA', icon: '🔒' },
                  { id: 'forums', label: 'FOROS', icon: '🏺' },
                  { id: 'posts', label: 'PUBLICACIONES', icon: '📝' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`py-4 px-6 text-xs font-retro uppercase tracking-wider transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-4 border-tech-neon text-tech-neon'
                        : 'text-tech-silver hover:text-tech-neon hover:border-tech-neon/50'
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
          <div className="card border-tech-neon">
            <div className="p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-display text-tech-neon neon-text mb-4 uppercase">
                      INFORMACIÓN PERSONAL
                    </h2>
                    
                    {/* Imagen de perfil */}
                    <div>
                      <label htmlFor="profileImage" className="block text-sm font-retro text-tech-neon uppercase tracking-wider mb-2">
                        IMAGEN DE PERFIL
                      </label>
                      
                      <div className="mt-1 flex items-center">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-tech-dark border-2 border-tech-neon flex items-center justify-center text-tech-neon text-xl mr-4">
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
                          className="btn btn-outline text-tech-neon border-tech-neon px-4 py-2 cursor-pointer"
                        >
                          CAMBIAR
                        </label>
                      </div>
                      
                      {errors.profileImage && (
                        <p className="mt-2 text-sm font-retro text-tech-red">{errors.profileImage}</p>
                      )}
                    </div>
                    
                    {/* Grid de campos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'firstName', label: 'NOMBRE', required: true },
                        { id: 'lastName', label: 'APELLIDO', required: true },
                        { id: 'username', label: 'USUARIO', required: true },
                        { id: 'email', label: 'EMAIL', required: true, type: 'email' },
                      ].map(field => (
                        <div key={field.id}>
                          <label htmlFor={field.id} className="block text-sm font-retro text-tech-neon uppercase tracking-wider mb-2">
                            {field.label} {field.required && <span className="text-tech-red">*</span>}
                          </label>
                          <input
                            id={field.id}
                            name={field.id}
                            type={field.type || 'text'}
                            autoComplete={field.id === 'email' ? 'email' : field.id}
                            required={field.required}
                            className={`input w-full ${errors[field.id] ? 'border-tech-red' : 'border-tech-neon'}`}
                            value={profileData[field.id]}
                            onChange={handleProfileChange}
                            disabled={isSubmitting}
                          />
                          {errors[field.id] && (
                            <p className="mt-2 text-sm font-retro text-tech-red">{errors[field.id]}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="block text-sm font-retro text-tech-neon uppercase tracking-wider mb-2">
                        BIOGRAFÍA
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        className="input w-full border-tech-neon"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        placeholder="Cuéntanos sobre ti..."
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary text-tech-dark border-tech-neon"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center space-x-2">
                          <span className="animate-spin">⚡</span>
                          <span>GUARDANDO...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <span>💾</span>
                          <span>GUARDAR</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'password' && (
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-display text-tech-neon neon-text mb-4 uppercase">
                      CAMBIAR CONTRASEÑA
                    </h2>
                    
                    {[
                      { id: 'currentPassword', label: 'CONTRASEÑA ACTUAL' },
                      { id: 'newPassword', label: 'NUEVA CONTRASEÑA' },
                      { id: 'confirmPassword', label: 'CONFIRMAR CONTRASEÑA' },
                    ].map(field => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-retro text-tech-neon uppercase tracking-wider mb-2">
                          {field.label} <span className="text-tech-red">*</span>
                        </label>
                        <input
                          id={field.id}
                          name={field.id}
                          type="password"
                          autoComplete={field.id === 'currentPassword' ? 'current-password' : 'new-password'}
                          required
                          className={`input w-full ${errors[field.id] ? 'border-tech-red' : 'border-tech-neon'}`}
                          value={passwordData[field.id]}
                          onChange={handlePasswordChange}
                          disabled={isSubmitting}
                        />
                        {errors[field.id] && (
                          <p className="mt-2 text-sm font-retro text-tech-red">{errors[field.id]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="btn btn-primary text-tech-dark border-tech-neon"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center space-x-2">
                          <span className="animate-spin">⚡</span>
                          <span>GUARDANDO...</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2">
                          <span>🔐</span>
                          <span>CAMBIAR</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
              
              {activeTab === 'forums' && (
                <div>
                  <h2 className="text-xl font-display text-tech-neon neon-text mb-4 uppercase">
                    MIS FOROS
                  </h2>
                  <ForumList />
                </div>
              )}
              
              {activeTab === 'posts' && (
                <div>
                  <h2 className="text-xl font-display text-tech-neon neon-text mb-4 uppercase">
                    MIS PUBLICACIONES
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
