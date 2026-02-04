import { useState, useEffect } from 'react';
import type { User } from '../types/User.ts';
import Navbar from '../components/Navbar.tsx';
import MovieCard from '../components/MovieCard.tsx';
import type { MoviePreview } from '../types/MoviePreview.tsx';
import { Link } from 'react-router-dom';

function Watchlist () {
    // Controls whether the sidebar (navbar) is open or closed
    const [open, setOpen] = useState(false);
    const token = import.meta.env.VITE_TMDB_TOKEN;

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        document.body.classList.remove("login", "home");
        document.body.classList.add("home");

        // Load logged-in user
        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) return;

        setUser(JSON.parse(storedUser));
    }, []);
    
    //Storing every movie loaded from api request
    const [movies, setMovies] = useState<MoviePreview[]>([]);

    useEffect(() => {
        if (!user) return;

        const ids = user.watchlist ?? [];

        //for every id make an api request using that id
        Promise.all(
            ids.map((id) =>
                fetch(`https://api.themoviedb.org/3/movie/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((res) => res.json())
                    .then((data) => ({
                        id: data.id,
                        title: data.title,
                        poster_path: data.poster_path,
                    }))
            )
        ).then((movieList) => setMovies(movieList));
    }, [user, token]);
    
    //add it to the watchlist
    //in the return, map every movie object to a row in the list

    if (!user) return null;

    return (
        <div style={{ padding: '10' }}>
            <div className="header">
                <button
                    type="button"
                    className="hamburger"
                    onClick={() => setOpen(true)}
                >
                    <i className="fa-solid fa-bars" style={{ color: "#3f98e0" }}></i>
                </button>

                {/* Sidebar nav */}
                <Navbar open={open} onClose={() => setOpen(false)} />
                <h1>Your Watchlist</h1>
            </div>

            <h3>View your saved movies here</h3>

            <ul className="scrollable">
                {movies.length === 0 ? (
                    <li>No movies saved yet</li>
                ) : (
                    movies.map((m) => (
                        <li key={m.id}>
                            <MovieCard {...m}/>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Watchlist;
