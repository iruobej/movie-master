import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from '../components/Navbar.tsx';
import type { User } from '../types/User.ts';

// Describe the shape of ONE movie returned by TMDB
// (TMDB returns many fields, but we only list what we use)
type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
};

function Movie() {
  // Reads the `id` from the URL
  // Example URL: /movie/550 → id === "550"
  const { id } = useParams();

  // TMDB API Read Access Token from your .env file
  const token = import.meta.env.VITE_TMDB_TOKEN;

  // State to store the fetched movie details
  // Starts as null because we haven't loaded anything yet
  const [movie, setMovie] = useState<Movie | null>(null);

  // Optional: store an error message if something goes wrong
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);

  // This effect runs when the component loads
  // and whenever the `id` changes


  const addToWatchlist = () => {
    if(!movie) return; //to protect against 'what in the case movie is null?' error
    const storedUser = localStorage.getItem("currentUser"); //pulling logged in user (as JSON string) from localStorage
    if (!storedUser) {
        // not logged in (or missing user)
        return;
    }

    const currentUser = JSON.parse(storedUser) as User; //Converting JSON str (from lS) into an instance of the User object

    // ensure watchlist exists (safety for old accounts)
    const watchlist = currentUser.watchlist ?? [];

    // Avoiding duplicates
    if (!watchlist.includes(movie.id)) {
        currentUser.watchlist = [...watchlist, movie.id];

        // Updating currentUser in local Storage
        localStorage.setItem("currentUser", JSON.stringify(currentUser));

        // Updating the users "database" (only the current user)
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]") as User[];
        const updatedUsers = storedUsers.map((u) =>
        u.username === currentUser.username ? currentUser : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        alert(`\'${movie.title}\' has been added to watchlist!`);
    } else {
        alert(`Error: \'${movie.title}\' has already been added to watchlist.`);
    }
    
};

  useEffect(() => {
    // Safety check: if there is no id in the URL, do nothing
    if (!id) return;

    // Call TMDB's "movie details" endpoint using the id
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        // TMDB requires the token in the Authorization header
        Authorization: `Bearer ${token}`,
      },
    })
      // Convert the response (text) into JavaScript data
      .then((res) => {
        // If the request failed, throw an error
        if (!res.ok) {
          throw new Error("Failed to load movie details");
        }
        return res.json();
      })
      // Save the movie data into state
      // This triggers a re-render so the UI updates
      .then((data) => setMovie(data))
      // Catch and store any errors
      .catch((err) => setError(err.message));
  }, [id, token]);

  // If an error occurred, show it
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // While the movie is still loading, show a placeholder
  if (!movie) {
    return <p>Loading…</p>;
  }

  // Once the movie data is loaded, render it
  return (
    <div style={{ padding: 12 }}>
      {/* Movie title */}

        {/* Hamburger button to open the sidebar */}
            <button
                type="button"
                className="hamburger"
                onClick={() => setOpen(true)}
            >
                <i className="fa-solid fa-bars" style={{ color: "#3f98e0" }}></i>
            </button>

            {/* Sidebar nav */}
            <Navbar open={open} onClose={() => setOpen(false)} />

      <h1>{movie.title}</h1>

      {/* Movie poster (only render if it exists) */}
      {movie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
          style={{ width: 200, borderRadius: 10 }}
        />
      )}

      {/* Movie description */}
      <p>{movie.overview}</p>

      {/* Extra movie info */}
      <p>
        Release date: {movie.release_date || "Unknown"} <br />
        Rating: {movie.vote_average ?? "N/A"}
      </p>
      {movie && <button className="button" style={{margin : '0 auto'}} onClick={addToWatchlist}>Add To Watchlist</button>} 
    </div>
  );
}

export default Movie;
