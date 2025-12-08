import { Link } from 'react-router-dom'

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contacto</h1>
        <div className="prose prose-lg">
          <p className="text-lg mb-4">
            ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para ayudarte.
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Email</h2>
              <p>contacto@forumviajeros.com</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Redes Sociales</h2>
              <p>Síguenos en nuestras redes sociales para estar al día con las últimas novedades.</p>
            </div>
          </div>
          <div className="mt-8">
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage


