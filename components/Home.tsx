import Navbar from './Navbar.tsx';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function Home() {
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("loggedIn");
        const navigate = useNavigate();

        if(!isLoggedIn) {
            navigate('/home');
        }
    }, []) //dependency array so useEffect only runs once
    return(
        <>
            <Navbar></Navbar>
            <p>This is home</p>
        </>
    )
}

export default Home;