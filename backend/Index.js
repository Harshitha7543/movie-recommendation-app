// Load environment variables
require('dotenv').config();

const Fastify = require('fastify');
const sqlite3 = require('sqlite3').verbose();

// Create Fastify server
const fastify = Fastify({ logger: true });

// Enable CORS (allow frontend requests)
fastify.register(require('@fastify/cors'), {
  origin: true
});

// ---------------- DATABASE SETUP ----------------

// Create / open SQLite database
const db = new sqlite3.Database('./movies.db');

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_input TEXT,
      recommended_movies TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// ---------------- ROUTES ----------------

// Health check route
fastify.get('/', async () => {
  return { message: "Backend is running" };
});

// Movie recommendation API
fastify.post('/recommend', async (request, reply) => {
  const { user_input } = request.body;

  if (!user_input) {
    return reply.status(400).send({ error: "Please provide input" });
  }

  const input = user_input.toLowerCase();
  let movies = [];

  if (input.includes("action")) {
    movies = [
      "Mad Max: Fury Road",
      "John Wick",
      "The Dark Knight",
      "Gladiator",
      "Mission Impossible"
    ];
  } else if (input.includes("romance")) {
    movies = [
      "Titanic",
      "The Notebook",
      "La La Land",
      "Pride & Prejudice",
      "Before Sunrise"
    ];
  } else if (input.includes("comedy")) {
    movies = [
      "The Hangover",
      "Superbad",
      "3 Idiots",
      "Home Alone",
      "Deadpool"
    ];
  } else {
    movies = [
      "Inception",
      "Interstellar",
      "Forrest Gump",
      "The Shawshank Redemption",
      "Fight Club"
    ];
  }

  // Save user input & recommendations
  db.run(
    "INSERT INTO recommendations (user_input, recommended_movies) VALUES (?, ?)",
    [user_input, movies.join(", ")]
  );

  reply.send({ recommended_movies: movies });
});

// ---------------- SERVER START ----------------

// Use Render / system port or fallback to 3000
const PORT = process.env.PORT || 3000;

// IMPORTANT: host 0.0.0.0 for deployment
fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`✅ Backend running on port ${PORT}`);
});

