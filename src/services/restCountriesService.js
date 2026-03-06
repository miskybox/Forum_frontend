/**
 * Servicio para conectar con la API gratuita RestCountries
 * https://restcountries.com/
 * 
 * Esta API proporciona información detallada sobre todos los países del mundo
 * Incluye fallback offline cuando la API no está disponible
 */

import { fallbackCountries } from '../data/fallbackCountries'

const API_BASE_URL = 'https://restcountries.com/v3.1'

// URLs alternativas de la API (mirrors y versiones alternativas)
const FALLBACK_URLS = [
  'https://restcountries.com/v3.1',
  'https://restcountries.eu/rest/v2' // Versión anterior que podría estar disponible
]

// Cache para almacenar los países y evitar múltiples llamadas
let countriesCache = null
let cacheTimestamp = null
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutos (aumentado)

// Flag para evitar múltiples intentos simultáneos
let isFetching = false
let fetchPromise = null

/**
 * Obtener todos los países con información básica
 * Incluye fallback offline si la API falla
 * Con reintentos automáticos y mejor manejo de errores
 */
export const getAllCountries = async () => {
  // Verificar si tenemos cache válido
  if (countriesCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    if (import.meta.env.DEV) console.log('📦 Usando países del cache')
    return countriesCache
  }

  // Si ya estamos haciendo fetch, esperar a que termine
  if (isFetching && fetchPromise) {
    if (import.meta.env.DEV) console.log('⏳ Esperando fetch en progreso...')
    return fetchPromise
  }

  isFetching = true
  
  fetchPromise = (async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos timeout (reducido)

      const response = await fetch(
        `${API_BASE_URL}/all?fields=name,capital,flags,currencies,languages,population,area,region,subregion,cca2,cca3,borders,timezones,latlng,translations`,
        {
          signal: controller.signal,
          mode: 'cors',
          cache: 'default'
        }
      )
      clearTimeout(timeoutId)

      if (!response.ok) throw new Error('Error fetching countries')
      
      const data = await response.json()
      
      // Guardar en cache
      countriesCache = data
      cacheTimestamp = Date.now()
      
      if (import.meta.env.DEV) console.log('✅ Países cargados desde API:', data.length)
      return data
    } catch (error) {
      if (import.meta.env.DEV) console.warn('⚠️ RestCountries API no disponible:', error.message)
      
      // Si tenemos cache aunque esté expirado, usarlo
      if (countriesCache && countriesCache.length > 0) {
        if (import.meta.env.DEV) console.log('📦 Usando cache expirado como fallback')
        return countriesCache
      }
      
      // Usar datos offline de fallback - transformados al formato de la API
      if (import.meta.env.DEV) console.log('🔌 Usando datos offline de fallback (40+ países)')
      const transformedFallback = transformFallbackData(fallbackCountries)
      countriesCache = transformedFallback
      cacheTimestamp = Date.now()
      return transformedFallback
    } finally {
      isFetching = false
      fetchPromise = null
    }
  })()

  return fetchPromise
}

/**
 * Transforma los datos de fallback al formato esperado por la API
 */
const transformFallbackData = (fallbackData) => {
  return fallbackData.map(country => ({
    ...country,
    // Asegurar que los campos críticos existen
    name: country.name || { common: 'Unknown', official: 'Unknown' },
    capital: country.capital || [],
    flags: country.flags || { svg: '', png: '' },
    currencies: country.currencies || {},
    languages: country.languages || {},
    population: country.population || 0,
    area: country.area || 0,
    region: country.region || 'Unknown',
    subregion: country.subregion || '',
    cca2: country.cca2 || 'XX',
    cca3: country.cca3 || 'XXX'
  }))
}

/**
 * Obtener país por código ISO
 */
export const getCountryByCode = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alpha/${code}`)
    if (!response.ok) throw new Error('Country not found')
    const data = await response.json()
    return data[0]
  } catch (error) {
    if (import.meta.env.DEV) console.error('RestCountries API error:', error)
    return null
  }
}

/**
 * Obtener países por región
 */
export const getCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${API_BASE_URL}/region/${region}`)
    if (!response.ok) throw new Error('Region not found')
    return await response.json()
  } catch (error) {
    if (import.meta.env.DEV) console.error('RestCountries API error:', error)
    return []
  }
}

/**
 * Buscar países por nombre
 */
export const searchCountries = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/name/${name}`)
    if (!response.ok) throw new Error('No countries found')
    return await response.json()
  } catch (error) {
    if (import.meta.env.DEV) console.error('RestCountries API error:', error)
    return []
  }
}

/**
 * Generar preguntas de trivia dinámicamente usando la API
 * Con mejor manejo de errores y fallback
 */
export const generateTriviaQuestions = async (count = 10, usedQuestionIds = []) => {
  try {
    const countries = await getAllCountries()
    
    if (!countries || countries.length === 0) {
      if (import.meta.env.DEV) console.warn('⚠️ No se pudieron cargar países para trivia')
      return []
    }

    if (import.meta.env.DEV) console.log(`🎮 Generando ${count} preguntas de trivia con ${countries.length} países`)
    
    const questions = []
    const questionTypes = ['capital', 'flag', 'currency', 'language', 'population', 'region', 'area']
    const usedCombinations = new Set(usedQuestionIds)

    // Filtrar países con datos completos (más permisivo para fallback)
    const validCountries = countries.filter(c => 
      c.name?.common && 
      (c.capital?.length > 0 || c.flags?.svg || c.region)
    )

    let attempts = 0
    const maxAttempts = count * 10

    while (questions.length < count && attempts < maxAttempts) {
      attempts++
      
      const randomCountry = validCountries[Math.floor(Math.random() * validCountries.length)]
      const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      const questionId = `${randomCountry.cca2}-${randomType}`

      // Evitar repetir preguntas
      if (usedCombinations.has(questionId)) continue
      usedCombinations.add(questionId)

      const question = createQuestion(randomCountry, randomType, validCountries)
      if (question) {
        questions.push({ ...question, id: questionId })
      }
    }

    return questions
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error generating trivia questions:', error)
    return []
  }
}

/**
 * Generar un dato curioso sobre el país según el tipo de pregunta
 */
const generateFunFact = (country, type) => {
  const name = getSpanishName(country)
  const capital = country.capital?.[0]
  const population = country.population
  const area = country.area
  const region = getSpanishRegion(country.region)
  const languages = Object.values(country.languages || {}).map(getSpanishLanguage)
  const currencies = Object.values(country.currencies || {})
  const currency = currencies[0]

  const formatNum = (n) => {
    if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)} mil millones`
    if (n >= 1000000) return `${Math.round(n / 1000000)} millones`
    if (n >= 1000) return `${Math.round(n / 1000)} mil`
    return n?.toLocaleString('es-ES') || '?'
  }

  switch (type) {
    case 'capital':
      if (!capital) return null
      if (population) return `${name} tiene una población de ${formatNum(population)} habitantes y su capital ${capital} es el centro político y cultural del país.`
      return `${capital} es la capital de ${name}, ubicado en ${region}.`
    case 'flag':
      if (languages.length > 1) return `${name} tiene ${languages.length} idiomas oficiales: ${languages.slice(0, 3).join(', ')}.`
      if (capital) return `La capital de ${name} es ${capital}${area ? `, con una superficie de ${formatNum(area)} km²` : ''}.`
      return `${name} se encuentra en ${region}.`
    case 'currency':
      if (currency?.symbol) return `${name} usa ${getSpanishCurrency(currency.name)} (símbolo: ${currency.symbol}) como moneda oficial${population ? `, con ${formatNum(population)} habitantes` : ''}.`
      return `La moneda de ${name} es oficial en ${region}.`
    case 'language':
      if (languages.length > 1) return `${name} tiene ${languages.length} idiomas oficiales: ${languages.join(', ')}.`
      if (capital) return `En ${name}, cuya capital es ${capital}, el idioma oficial es ${languages[0] || '?'}.`
      return `${name} se encuentra en ${region}.`
    case 'population':
      if (area) return `${name} ocupa una superficie de ${formatNum(area)} km² en ${region}${capital ? `, con capital en ${capital}` : ''}.`
      return `${name} se encuentra en ${region}.`
    case 'region':
      if (capital && population) return `${name} tiene su capital en ${capital} y una población de ${formatNum(population)} personas.`
      return `${name} pertenece a ${region}${capital ? `, con capital en ${capital}` : ''}.`
    case 'area':
      if (population) return `${name} tiene ${formatNum(population)} habitantes distribuidos en su territorio de ${region}.`
      return `${name} se encuentra en ${region}${capital ? `, capital: ${capital}` : ''}.`
    default:
      return null
  }
}

/**
 * Crear una pregunta de trivia
 */
const createQuestion = (country, type, allCountries) => {
  const countryName = getSpanishName(country)

  switch (type) {
    case 'capital':
      if (!country.capital?.[0]) return null
      return {
        type: 'CAPITAL',
        question: `¿Cuál es la capital de ${countryName}?`,
        correctAnswer: country.capital[0],
        options: shuffleArray([
          country.capital[0],
          ...getRandomCapitals(allCountries, country.cca2, 3, [country.capital[0]])
        ]),
        countryCode: country.cca2,
        difficulty: 1,
        funFact: generateFunFact(country, 'capital')
      }

    case 'flag':
      return {
        type: 'FLAG',
        question: `¿A qué país pertenece esta bandera?`,
        flagUrl: country.flags.svg || country.flags.png,
        correctAnswer: countryName,
        options: shuffleArray([
          countryName,
          ...getRandomCountryNames(allCountries, country.cca2, 3, [countryName])
        ]),
        countryCode: country.cca2,
        difficulty: 2,
        funFact: generateFunFact(country, 'flag')
      }

    case 'currency': {
      const currencies = Object.values(country.currencies || {})
      if (currencies.length === 0) return null
      const currency = currencies[0]
      const currencyES = getSpanishCurrency(currency.name)
      return {
        type: 'CURRENCY',
        question: `¿Cuál es la moneda oficial de ${countryName}?`,
        correctAnswer: currencyES,
        options: shuffleArray([
          currencyES,
          ...getRandomCurrencies(allCountries, country.cca2, 3, [currencyES])
        ]),
        countryCode: country.cca2,
        difficulty: 2,
        funFact: generateFunFact(country, 'currency')
      }
    }

    case 'language': {
      const languages = Object.values(country.languages || {})
      if (languages.length === 0) return null
      const langES = getSpanishLanguage(languages[0])
      return {
        type: 'LANGUAGE',
        question: `¿Cuál es uno de los idiomas oficiales de ${countryName}?`,
        correctAnswer: langES,
        options: shuffleArray([
          langES,
          ...getRandomLanguages(allCountries, country.cca2, 3, [langES])
        ]),
        countryCode: country.cca2,
        difficulty: 2,
        funFact: generateFunFact(country, 'language')
      }
    }

    case 'population': {
      const population = country.population
      const populationRanges = getPopulationRanges(population)
      return {
        type: 'POPULATION',
        question: `¿Cuál es aproximadamente la población de ${countryName}?`,
        correctAnswer: populationRanges.correct,
        options: shuffleArray(populationRanges.all),
        countryCode: country.cca2,
        difficulty: 3,
        funFact: generateFunFact(country, 'population')
      }
    }

    case 'region': {
      const regionES = getSpanishRegion(country.region)
      return {
        type: 'CONTINENT',
        question: `¿En qué continente se encuentra ${countryName}?`,
        correctAnswer: regionES,
        options: shuffleArray([
          regionES,
          ...getOtherRegions(country.region)
        ]).slice(0, 4),
        countryCode: country.cca2,
        difficulty: 1,
        funFact: generateFunFact(country, 'region')
      }
    }

    case 'area': {
      const area = country.area
      const areaRanges = getAreaRanges(area)
      return {
        type: 'AREA',
        question: `¿Cuál es aproximadamente el área de ${countryName}?`,
        correctAnswer: areaRanges.correct,
        options: shuffleArray(areaRanges.all),
        countryCode: country.cca2,
        difficulty: 3,
        funFact: generateFunFact(country, 'area')
      }
    }

    default:
      return null
  }
}

// Traducción de regiones al español
const REGION_ES = {
  'Africa': 'África',
  'Americas': 'América',
  'Asia': 'Asia',
  'Europe': 'Europa',
  'Oceania': 'Oceanía',
  'Antarctic': 'Antártica'
}

// Traducción de idiomas al español (los más comunes de la API)
const LANGUAGE_ES = {
  'Spanish': 'Español', 'English': 'Inglés', 'French': 'Francés',
  'German': 'Alemán', 'Portuguese': 'Portugués', 'Italian': 'Italiano',
  'Arabic': 'Árabe', 'Chinese': 'Chino', 'Russian': 'Ruso',
  'Japanese': 'Japonés', 'Korean': 'Coreano', 'Hindi': 'Hindi',
  'Dutch': 'Neerlandés', 'Polish': 'Polaco', 'Turkish': 'Turco',
  'Swedish': 'Sueco', 'Norwegian': 'Noruego', 'Danish': 'Danés',
  'Finnish': 'Finlandés', 'Greek': 'Griego', 'Hungarian': 'Húngaro',
  'Czech': 'Checo', 'Romanian': 'Rumano', 'Ukrainian': 'Ucraniano',
  'Hebrew': 'Hebreo', 'Swahili': 'Suajili', 'Malay': 'Malayo',
  'Thai': 'Tailandés', 'Vietnamese': 'Vietnamita', 'Indonesian': 'Indonesio',
  'Urdu': 'Urdu', 'Bengali': 'Bengalí', 'Tagalog': 'Tagalo',
  'Persian': 'Persa', 'Catalan': 'Catalán', 'Basque': 'Vasco',
  'Galician': 'Gallego', 'Serbian': 'Serbio', 'Croatian': 'Croata',
  'Slovak': 'Eslovaco', 'Slovenian': 'Esloveno', 'Bulgarian': 'Búlgaro',
  'Estonian': 'Estonio', 'Latvian': 'Letón', 'Lithuanian': 'Lituano',
  'Albanian': 'Albanés', 'Macedonian': 'Macedonio', 'Bosnian': 'Bosnio',
  'Maltese': 'Maltés', 'Icelandic': 'Islandés', 'Welsh': 'Galés',
  'Irish': 'Irlandés', 'Luxembourgish': 'Luxemburgués'
}

// Traducción de monedas al español
const CURRENCY_ES = {
  'Euro': 'Euro', 'United States dollar': 'Dólar estadounidense',
  'Pound sterling': 'Libra esterlina', 'Japanese yen': 'Yen japonés',
  'Swiss franc': 'Franco suizo', 'Canadian dollar': 'Dólar canadiense',
  'Australian dollar': 'Dólar australiano', 'Chinese yuan': 'Yuan chino',
  'Swedish krona': 'Corona sueca', 'Norwegian krone': 'Corona noruega',
  'Danish krone': 'Corona danesa', 'Brazilian real': 'Real brasileño',
  'Mexican peso': 'Peso mexicano', 'Argentine peso': 'Peso argentino',
  'Chilean peso': 'Peso chileno', 'Colombian peso': 'Peso colombiano',
  'Russian ruble': 'Rublo ruso', 'Indian rupee': 'Rupia india',
  'South Korean won': 'Won surcoreano', 'Turkish lira': 'Lira turca',
  'New Zealand dollar': 'Dólar neozelandés', 'Singapore dollar': 'Dólar singapurense',
  'South African rand': 'Rand sudafricano', 'Egyptian pound': 'Libra egipcia',
  'Saudi riyal': 'Riyal saudí', 'United Arab Emirates dirham': 'Dírham emiratí',
  'Czech koruna': 'Corona checa', 'Hungarian forint': 'Forinto húngaro',
  'Polish złoty': 'Esloti polaco', 'Romanian leu': 'Leu rumano',
  'Ukrainian hryvnia': 'Grivna ucraniana', 'Israeli new shekel': 'Séquel israelí',
  'Thai baht': 'Baht tailandés', 'Malaysian ringgit': 'Ringgit malayo',
  'Indonesian rupiah': 'Rupia indonesia', 'Philippine peso': 'Peso filipino',
  'Vietnamese đồng': 'Dong vietnamita', 'Pakistani rupee': 'Rupia pakistaní'
}

// Obtener nombre del país en español
const getSpanishName = (country) =>
  country.translations?.spa?.common || country.name.common

// Obtener nombre de idioma en español
const getSpanishLanguage = (lang) => LANGUAGE_ES[lang] || lang

// Obtener nombre de moneda en español
const getSpanishCurrency = (name) => CURRENCY_ES[name] || name

// Obtener región en español
const getSpanishRegion = (region) => REGION_ES[region] || region

// Funciones auxiliares
const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const getRandomCapitals = (countries, excludeCode, count, excludeValues = []) => {
  const capitals = countries
    .filter(c => c.cca2 !== excludeCode && c.capital?.[0])
    .map(c => c.capital[0])
    .filter(v => !excludeValues.includes(v))
  return [...new Set(shuffleArray(capitals))].slice(0, count)
}

const getRandomCountryNames = (countries, excludeCode, count, excludeValues = []) => {
  const names = countries
    .filter(c => c.cca2 !== excludeCode)
    .map(c => getSpanishName(c))
    .filter(v => !excludeValues.includes(v))
  return [...new Set(shuffleArray(names))].slice(0, count)
}

const getRandomCurrencies = (countries, excludeCode, count, excludeValues = []) => {
  const currencies = countries
    .filter(c => c.cca2 !== excludeCode && c.currencies)
    .flatMap(c => Object.values(c.currencies).map(cur => getSpanishCurrency(cur.name)))
    .filter(v => !excludeValues.includes(v))
  return [...new Set(shuffleArray(currencies))].slice(0, count)
}

const getRandomLanguages = (countries, excludeCode, count, excludeValues = []) => {
  const languages = countries
    .filter(c => c.cca2 !== excludeCode && c.languages)
    .flatMap(c => Object.values(c.languages).map(getSpanishLanguage))
    .filter(v => !excludeValues.includes(v))
  return [...new Set(shuffleArray(languages))].slice(0, count)
}

const getOtherRegions = (currentRegion) => {
  const allRegions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic']
  return allRegions.filter(r => r !== currentRegion).map(r => REGION_ES[r] || r)
}

const getPopulationRanges = (population) => {
  const formatPopulation = (num) => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} mil millones`
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} millones`
    if (num >= 1000) return `${(num / 1000).toFixed(0)} mil`
    return num.toString()
  }

  const correct = formatPopulation(population)
  const variations = [
    population * 0.1,
    population * 0.5,
    population * 2,
    population * 5
  ]

  return {
    correct,
    all: [correct, ...variations.map(formatPopulation)]
  }
}

const getAreaRanges = (area) => {
  const formatArea = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)} millones km²`
    if (num >= 1000) return `${(num / 1000).toFixed(0)} mil km²`
    return `${num.toFixed(0)} km²`
  }

  const correct = formatArea(area)
  const variations = [
    area * 0.2,
    area * 0.5,
    area * 2,
    area * 4
  ]

  return {
    correct,
    all: [correct, ...variations.map(formatArea)]
  }
}

export default {
  getAllCountries,
  getCountryByCode,
  getCountriesByRegion,
  searchCountries,
  generateTriviaQuestions
}

