import Navbar from '../components/Navbar.tsx';
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import type { User } from '../types/User.ts';
import MovieCard from '../components/MovieCard.tsx';


function Home() {
    const navigate = useNavigate(); //hooks shouldnt be inside of other hooks. useNavigate only needs to be called once

    const [user, setUser] = useState<User | null> (null);
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<Movie[]>([])

    const [genreIds, setGenreIds] = useState<number[]>([]);
    const [recommended, setRecommended] = useState<Movie[]>([])

    //Using latest watchlist entry to recommend movies
    const sample_movie =
    user && user.watchlist && user.watchlist.length > 0
      ? user.watchlist[user.watchlist.length - 1]
      : null;

    type Movie = {
        id: number;
        title: string;
        poster_path: string;
    }

    const token = import.meta.env.VITE_TMDB_TOKEN;

    useEffect(() => {
        document.body.classList.remove("login", "home");
        document.body.classList.add("home");

        //Protecting the page
        const isLoggedIn = localStorage.getItem("loggedIn");

        if(!isLoggedIn) {
            navigate('/login');
        }

        //Loading current user from login
        const storedUser = localStorage.getItem("currentUser");
        if (!storedUser) {
            navigate("/login")
            return; //stopping the rest of the effect from running
        }

        //Converting JSON string back to object to store in state
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        //calling trending movies from api
        fetch(
            `https://api.themoviedb.org/3/trending/movie/day?language=en-US`, 
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        )
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []));
    }, []) //dependency array so useEffect only runs once


    //finding recommended movies for the user
    useEffect (() => {
        if (!sample_movie) return;

        fetch(
            `https://api.themoviedb.org/3/movie/${sample_movie}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => res.json())
            .then((data) => {
                const ids = data.genres.map((g: { id: number }) => g.id);
                setGenreIds(ids);
            })
    }, [sample_movie]) //effect must rerun when sample_movie is available

    //when genreIds updates, fetch movie recommendations
    useEffect (() => {
        if (genreIds.length === 0) return;

        fetch(
            `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIds.join(",")}&sort_by=popularity.desc`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            )
            .then((res) => res.json())
            .then((data) => setRecommended(data.results ?? []));
    }, [genreIds]);

    if (!user) return <p>Loading</p>;

    const filteredArray = recommended.filter(
        (movie) => !user.watchlist.includes(movie.id) &&
        movie.id !== sample_movie
    );

    //Randomising recommended movies so they arent grouped by genre
    const newArray = [...filteredArray].sort(() => Math.random() - 0.5);

    return(
        <>
            <button
                type="button"
                className="hamburger"
                onClick={() => setOpen(true)}
            >
                <i className="fa-solid fa-bars" style={{color: "#3f98e0"}}></i>
            </button>
            <Navbar open={open} onClose={() => setOpen(false)}/>
            {user && <h1>Welcome back, {user.firstname}</h1>}
            <h2>Trending movies</h2>
            <ul className="scrollable home">
                {results.map((m) => 
                    <MovieCard {...m}/>
                )}
            </ul>
            <h2>Movies you might like</h2>
            <ul className="scrollable">
                {newArray.map((m) => 
                    <MovieCard {...m}/>
                )}
            </ul>
        </>
    )
}

export default Home;