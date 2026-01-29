import Navbar from '../components/Navbar.tsx';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import MovieCard from '../components/MovieCard.tsx';
import type { Movie } from '../types/Movie.ts';

function Search() {

    // Stores what the user types into the search input
    // Every keystroke updates this value
    const [query, setQuery] = useState("");

    // Token to authenticate requests to TMDB
    const token = import.meta.env.VITE_TMDB_TOKEN;

    // Controls whether the sidebar (navbar) is open or closed
    const [open, setOpen] = useState(false);

    // Stores the movie results returned from the TMDB API
    const [results, setResults] = useState<Movie[]>([]);

    // Runs ONCE when the component mounts
    // Used here to control page-level styling via body classes
    useEffect(() => {
        document.body.classList.remove("login", "home");
        document.body.classList.add("home");
    }, []);

    // Runs every time the `query` changes
    // Calling the TMDB API
    useEffect(() => {

        // Prevents sending API requests for very short input
        // (saves API calls + avoids useless searches)
        if (query.trim().length < 2) return;

        // Making a request to TMDB's "search movie" endpoint
        fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
            {
                // TMDB requires the token to be sent in the Authorization header
                headers: { Authorization: `Bearer ${token}` },
            }
        )
        // Converting the response into JavaScript data (JSON) 
        .then((res) => res.json())
        // Saving the movie results into state so React can render them
        .then((data) => setResults(data.results ?? []));

    }, [query, token]); 

    return (
        <div style={{ padding: 12 }}>
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

            <h1>Search</h1>

            <div className='searchBar'>
                <input 
                    type="text" 
                    placeholder='Search for movies, genres, etc'
                    value={query} // input value comes from state
                    onChange={(e) => setQuery(e.target.value)} // update state on typing
                />
            </div>

            {/* List of search results */}
            <ul className='list scrollable'>
                {results.map((m) => (
                    <li className='listItem' key={m.id}>
                        <MovieCard {...m}/>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Search;
