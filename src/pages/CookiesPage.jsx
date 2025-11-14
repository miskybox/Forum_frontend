import { Link } from 'react-router-dom'

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Link to="/" className="text-primary-600 hover:text-primary-800 mb-6 inline-block">
            ← Volver al inicio
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Política de Cookies
          </h1>
          
          <div className="prose max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¿Qué son las cookies?
              </h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando 
                visitas un sitio web. ForumViajeros utiliza cookies para mejorar tu experiencia.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Tipos de cookies que utilizamos
              </h2>
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Cookies esenciales
                </h3>
                <p className="mb-4">
                  Necesarias para el funcionamiento básico de la plataforma, incluyendo la autenticación 
                  y seguridad. Estas cookies no se pueden desactivar.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Cookies de preferencias
                </h3>
                <p>
                  Almacenan tus preferencias de usuario, como el idioma o configuración de la cuenta.
                </p>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Gestión de cookies
              </h2>
              <p>
                Puedes gestionar o eliminar cookies a través de la configuración de tu navegador. 
                Ten en cuenta que desactivar ciertas cookies puede afectar la funcionalidad de la plataforma.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Más información
              </h2>
              <p>
                Para más información sobre cómo gestionamos las cookies, consulta nuestra 
                <Link to="/privacy" className="text-primary-600 hover:underline mx-1">
                  Política de Privacidad
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookiesPage

