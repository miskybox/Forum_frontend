// Archivo: src/pages/ForumCreatePage.jsx
import { Link } from 'react-router-dom'
import ForumForm from '../components/forums/ForumForm'

const ForumCreatePage = () => {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary-500 mb-2">
                Crear Nuevo Foro
              </h1>
              <p className="text-light-soft text-base sm:text-lg">
                Crea un espacio para compartir experiencias sobre un destino o tema de viaje
              </p>
            </div>

            <Link
              to="/forums"
              className="inline-flex items-center gap-2 px-4 py-2 text-primary-400 hover:text-primary-300 font-medium transition-colors border-2 border-primary-600 hover:border-primary-500 rounded-lg"
            >
              <span>←</span>
              <span>Volver a los foros</span>
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="card max-w-4xl">
          <ForumForm />
        </div>

        {/* Tips Card */}
        <div className="card max-w-4xl mt-6 border-secondary-600">
          <h3 className="text-xl font-display font-bold text-secondary-500 mb-4">
            💡 Consejos para crear un buen foro
          </h3>
          <ul className="space-y-3 text-light-soft">
            <li className="flex items-start gap-3">
              <span className="text-primary-500 text-xl">✓</span>
              <span>
                <strong className="text-primary-400">Título descriptivo:</strong> Usa un título claro que indique el tema o destino
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 text-xl">✓</span>
              <span>
                <strong className="text-primary-400">Descripción completa:</strong> Explica de qué tratará el foro y qué tipo de contenido se compartirá
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 text-xl">✓</span>
              <span>
                <strong className="text-primary-400">Categoría apropiada:</strong> Selecciona la categoría que mejor represente el tema
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-500 text-xl">✓</span>
              <span>
                <strong className="text-primary-400">Sé específico:</strong> Los foros específicos generan mejores discusiones que los muy generales
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ForumCreatePage