import { Link } from 'react-router-dom'

const HelpPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Centro de Ayuda</h1>
        <div className="prose prose-lg">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">¿Cómo creo un foro?</h3>
                  <p>Debes estar registrado e iniciar sesión. Luego, ve a "Crear Foro" desde el menú de usuario.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">¿Cómo participo en la trivia?</h3>
                  <p>Ve a la sección de Trivia y selecciona un juego. Debes estar registrado para participar.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">¿Cómo edito mi perfil?</h3>
                  <p>Ve a tu perfil desde el menú de usuario y haz clic en "Editar Perfil".</p>
                </div>
              </div>
            </section>
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

export default HelpPage

