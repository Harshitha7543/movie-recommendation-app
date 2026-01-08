require('dotenv').config();

const Fastify = require('fastify');
const sqlite3 = require('sqlite3').verbose();

const fastify = Fastify({ logger: true });

// Enable CORS
fastify.register(require('@fastify/cors'), {
  origin: true
});

// SQLite Database
const db = new sqlite3.Database('./movies.db');
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

// Health check route
fastify.get('/', async () => {
  return { message: "Backend is running" };
});

// Movie recommendation API (FREE logic)
fastify.post('/recommend', async (request, reply) => {
  const { user_input } = request.body;

  if (!user_input) {
    return reply.send({ error: "Please provide input" });
  }

  let movies = [];
  const input = user_input.toLowerCase();

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

  // Save to database
  db.run(
    "INSERT INTO recommendations (user_input, recommended_movies) VALUES (?, ?)",
    [user_input, movies.join(", ")]
  );

  reply.send({ recommended_movies: movies });
});

// Start server
fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("✅ Backend running at http://localhost:5000");
});
