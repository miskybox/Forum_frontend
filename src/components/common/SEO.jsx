/**
 * SEO component using React 19 native document metadata support.
 * React 19 automatically hoists <title>, <meta>, and <link> tags to <head>.
 */
const SITE_NAME = 'ForumViajeros'
const SITE_URL = 'https://forumviajeros.com'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`
const DEFAULT_DESCRIPTION = 'Comunidad de viajeros para compartir experiencias, consejos y rutas por todo el mundo.'

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noindex = false,
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Explora el mundo a través de experiencias`
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_ES" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </>
  )
}

export default SEO
