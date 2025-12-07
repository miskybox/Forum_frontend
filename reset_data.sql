-- Script para limpiar y reload completo de datos de países y trivia
-- ADVERTENCIA: Esto borrará todos los datos de visited_places, trivia_scores, trivia_games, etc.

BEGIN;

-- Borrar en orden de dependencias
DELETE FROM trivia_answers;
DELETE FROM trivia_scores;
DELETE FROM trivia_games;
DELETE FROM trivia_questions;
DELETE FROM visited_places;
DELETE FROM countries;

-- Verificar que están vacías
SELECT 'COUNTRIES AFTER DELETE:' as status, COUNT(*) as count FROM countries;
SELECT 'TRIVIA_QUESTIONS AFTER DELETE:' as status, COUNT(*) as count FROM trivia_questions;

COMMIT;

-- Mensaje final
SELECT 'Tablas limpiadas. Reinicia el backend para cargar los 30 países y 120 preguntas.' as mensaje;
