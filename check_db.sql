-- Script de verificación rápida de la base de datos
\timing on

-- Verificar cantidad de países
SELECT 'COUNTRIES:' as tabla, COUNT(*) as cantidad FROM countries;

-- Verificar cantidad de preguntas trivia
SELECT 'TRIVIA_QUESTIONS:' as tabla, COUNT(*) as cantidad FROM trivia_questions;

-- Ver primeros 3 países (nombres solamente)
SELECT id, iso_code, name FROM countries LIMIT 3;

-- Ver primeros 3 preguntas (tipo y texto)
SELECT id, question_type, LEFT(question_text, 50) as question FROM trivia_questions LIMIT 3;

-- Verificar estadísticas de continentes
SELECT continent, COUNT(*) as paises FROM countries GROUP BY continent ORDER BY paises DESC;
