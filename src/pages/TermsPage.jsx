import { Link } from 'react-router-dom'

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Link to="/" className="text-primary-600 hover:text-primary-800 mb-6 inline-block">
            ← Volver al inicio
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Términos y Condiciones
          </h1>
          
          <div className="prose max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-8">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Aceptación de los términos
              </h2>
              <p>
                Al acceder y usar ForumViajeros, aceptas cumplir con estos términos y condiciones. 
                Si no estás de acuerdo, no debes usar la plataforma.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Uso de la plataforma
              </h2>
              <p className="mb-4">Te comprometes a:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Proporcionar información veraz y actualizada</li>
                <li>No publicar contenido ofensivo, ilegal o que viole derechos de terceros</li>
                <li>Respetar a otros usuarios y sus opiniones</li>
                <li>No usar la plataforma para fines comerciales no autorizados</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Contenido del usuario
              </h2>
              <p className="mb-4">
                Eres responsable del contenido que publicas. Retienes los derechos sobre tu contenido, 
                pero nos otorgas una licencia para mostrarlo en la plataforma.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Prohibiciones
              </h2>
              <p className="mb-4">Está prohibido:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Publicar contenido que infrinja derechos de autor</li>
                <li>Harassment, acoso o comportamiento abusivo</li>
                <li>Spam o contenido promocional no autorizado</li>
                <li>Intentar acceder a áreas restringidas del sistema</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Modificaciones
              </h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                Los cambios entrarán en vigor al publicarse en la plataforma.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage

