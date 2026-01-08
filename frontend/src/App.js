import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);

  const recommend = async () => {
    if (!input) return;

    const res = await fetch("http://localhost:5000/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_input: input })
    });

    const data = await res.json();
    setMovies(data.recommended_movies);
  };

  return (
    <div className="page">
      <div className="card">
        <h1>🎬 Movie Recommender</h1>
        <p>Tell us what kind of movie you like</p>

        <input
          type="text"
          placeholder="Example: action, romance, comedy..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={recommend}>Get Recommendations</button>

        <div className="movies">
          {movies.map((movie, index) => (
            <div className="movie-card" key={index}>
              🎥 {movie}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
