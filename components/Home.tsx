import Navbar from './Navbar.tsx';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types/User.ts';


function Home() {
    const navigate = useNavigate(); //hooks shouldnt be inside of other hooks. useNavigate only needs to be called once

    const [user, setUser] = useState<User | null> (null);
    const [open, setOpen] = useState(false);

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

    }, []) //dependency array so useEffect only runs once

    const token = import.meta.env.VITE_TMDB_TOKEN;
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
            <h2>Movies you would like</h2>
        </>
    )
}

export default Home;