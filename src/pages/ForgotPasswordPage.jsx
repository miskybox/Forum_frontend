import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error(t('auth.passwordReset.emailLabel'))
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      setEmailSent(true)
      toast.success(t('auth.passwordReset.checkEmailDescription'))
    } catch (error) {
      // Por seguridad, mostramos el mismo mensaje aunque falle
      // para no revelar si el email existe o no
      setEmailSent(true)
      toast.success(t('auth.passwordReset.checkEmailDescription'))
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="py-8 sm:py-12 relative overflow-hidden">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="max-w-md mx-auto">
            <div className="card border-ocean-600 animate-slide-in">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-darkest mb-4">
                  {t('auth.passwordReset.checkEmail')}
                </h2>
                <p className="text-text-dark mb-6">
                  {t('auth.passwordReset.checkEmailDescription')}
                </p>
                <p className="text-sm text-text-muted mb-6">
                  {t('auth.passwordReset.linkExpiry')}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setEmailSent(false)
                      setEmail('')
                    }}
                    className="btn btn-outline w-full"
                  >
                    {t('auth.passwordReset.tryAnotherEmail')}
                  </button>
                  <Link
                    to="/login"
                    className="btn btn-primary w-full inline-block text-center"
                  >
                    {t('auth.passwordReset.backToLogin')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-text-darkest tracking-normal mb-2">
              {t('auth.passwordReset.title')}
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-accent-dark to-transparent mb-2"></div>
            <p className="text-sm text-text-dark">
              {t('auth.passwordReset.subtitle')}
            </p>
          </div>

          {/* Formulario */}
          <div className="card border-ocean-600 animate-slide-in relative z-50">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-dark mb-2"
                >
                  {t('auth.passwordReset.emailLabel')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.passwordReset.emailPlaceholder')}
                  className="w-full px-4 py-3 bg-midnight border border-ocean-700 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t('auth.passwordReset.sending')}</span>
                  </>
                ) : (
                  <span>{t('auth.passwordReset.sendButton')}</span>
                )}
              </button>
            </form>
          </div>

          {/* Link para volver */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm font-bold text-text-dark hover:text-accent-dark transition-colors inline-flex items-center space-x-2"
            >
              <span>←</span>
              <span>{t('auth.passwordReset.backToLogin')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
