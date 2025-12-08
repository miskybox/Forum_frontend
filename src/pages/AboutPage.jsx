import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Acerca de Forum Viajeros</h1>
        <div className="prose prose-lg">
          <p className="text-lg mb-4">
            Forum Viajeros es una plataforma dedicada a conectar viajeros de todo el mundo,
            permitiéndoles compartir experiencias, consejos y descubrir nuevos destinos.
          </p>
          <p className="mb-4">
            Nuestra misión es crear una comunidad global de viajeros que se ayuden mutuamente
            a explorar el mundo de manera más enriquecedora y segura.
          </p>
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

export default AboutPage


