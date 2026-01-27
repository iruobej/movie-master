import { useState, useEffect } from 'react';
import type { User } from '../types/User.ts';
import Navbar from '../components/Navbar.tsx';
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

    type MoviePreview = {
        id: number;
        title: string;
        poster_path: string;
    };
    
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
        <div style={{ padding: '12' }}>
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
            <h3>View your saved movies here</h3>

            <ul>
                {movies.length === 0 ? (
                    <li>No movies saved yet</li>
                ) : (
                    movies.map((m) => (
                        <li key={m.id}>
                            <img 
                                src={`https://image.tmdb.org/t/p/w185${m.poster_path}`} 
                                alt={m.title} 
                                style={{ width: 50 }}
                            />
                            <Link to={`/movie/${m.id}`}>{m.title}</Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Watchlist;
