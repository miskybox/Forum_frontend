/**
 * ForumBgPreviewPage — Página temporal para verificar accesibilidad de texto
 * con imagen de fondo en tarjetas y cabecera de foro.
 *
 * URL: /forum-preview
 * Puedes eliminar esta página y su ruta en App.jsx cuando ya no la necesites.
 */
import whaleImg from '../assets/whale-patagonia-argentina-by_sigu.jpg'

const MOCK_FORUM = {
  id: 'preview',
  title: 'Argentina — Patagonia y Ballenas',
  description: 'Ballenas francas australes en la Península Valdés, glaciares del Calafate y la magia de la Patagonia infinita. Comparte tus experiencias y consejos.',
  imageUrl: whaleImg,
  postCount: 24,
  viewCount: 312,
  creator: { username: 'viajero_demo' },
  createdAt: new Date().toISOString(),
  tags: [{ id: 1, name: 'América' }, { id: 2, name: 'Naturaleza' }],
  category: { name: 'América del Sur' },
}

const ForumBgPreviewPage = () => {
  return (
    <div className="min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-3xl space-y-10">

        <h1 className="text-2xl font-bold text-text uppercase tracking-wide text-center">
          Preview — Accesibilidad de texto con fondo
        </h1>

        {/* ── ForumCard cover ── */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-text-light uppercase tracking-widest">
            ForumCard — vista lista
          </h2>
          <div className="card overflow-hidden max-w-xl">
            {/* Cover */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={MOCK_FORUM.imageUrl}
                alt={MOCK_FORUM.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">
                  {MOCK_FORUM.title.toUpperCase()}
                </h3>
                <div className="flex gap-1.5">
                  {MOCK_FORUM.tags.map(tag => (
                    <span key={tag.id} className="inline-flex items-center px-2 py-0.5 bg-aqua/20 border border-aqua text-aqua font-medium text-xs uppercase rounded">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="px-5 py-3">
              <p className="text-text-light text-sm line-clamp-2">{MOCK_FORUM.description}</p>
            </div>
          </div>
        </section>

        {/* ── ForumDetails header ── */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-text-light uppercase tracking-widest">
            ForumDetailsPage — cabecera de foro
          </h2>
          <div className="card border-golden overflow-hidden">
            <div className="relative">
              <div className="h-48 relative overflow-hidden">
                <img
                  src={MOCK_FORUM.imageUrl}
                  alt={MOCK_FORUM.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />
              </div>
              <div className="px-6 py-6 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight to-transparent">
                <h1 className="text-3xl md:text-4xl font-bold text-golden mb-3 tracking-wide">
                  {MOCK_FORUM.title}
                </h1>
                <div className="inline-block px-4 py-2 bg-aqua/20 border-2 border-aqua text-aqua font-bold text-xs uppercase tracking-normal rounded">
                  {MOCK_FORUM.category.name}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t-2 border-golden/30">
              <p className="text-light-soft text-base leading-relaxed">
                {MOCK_FORUM.description}
              </p>
            </div>
          </div>
        </section>

        {/* ── Contrast notes ── */}
        <section className="card p-5 border-golden/40 space-y-3 text-sm text-text-light">
          <h2 className="text-base font-bold text-text uppercase tracking-wide">
            Notas de accesibilidad a revisar
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Título blanco sobre gradiente oscuro — comprueba contraste ≥ 4.5:1</li>
            <li>Tags <code className="text-aqua">text-aqua</code> sobre fondo semi-transparente</li>
            <li>Título <code className="text-golden">text-golden</code> sobre <code>from-midnight</code> en cabecera</li>
            <li>Descripción <code>text-light-soft</code> sobre fondo de tarjeta</li>
          </ul>
          <p className="text-xs text-text-lighter mt-2">
            Herramienta recomendada: <strong>WebAIM Contrast Checker</strong> o DevTools → Accessibility tab
          </p>
        </section>

      </div>
    </div>
  )
}

export default ForumBgPreviewPage
