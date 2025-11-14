import { Link } from 'react-router-dom'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Link to="/" className="text-primary-600 hover:text-primary-800 mb-6 inline-block">
            ← Volver al inicio
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Política de Privacidad
          </h1>
          
          <div className="prose max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Información que recopilamos
              </h2>
              <p className="mb-4">
                ForumViajeros recopila información que nos proporcionas directamente cuando te registras, 
                creas contenido o interactúas con la plataforma.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Nombre de usuario y correo electrónico</li>
                <li>Contenido que publicas (foros, posts, comentarios)</li>
                <li>Información de perfil que compartes voluntariamente</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Uso de la información
              </h2>
              <p className="mb-4">
                Utilizamos tu información para:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Gestionar tu cuenta y autenticación</li>
                <li>Comunicarnos contigo sobre la plataforma</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Protección de datos
              </h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información 
                personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Tus derechos
              </h2>
              <p className="mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar información incorrecta</li>
                <li>Solicitar la eliminación de tu cuenta</li>
                <li>Oponerte al procesamiento de tus datos</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Contacto
              </h2>
              <p>
                Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través 
                de tu perfil en la plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage

