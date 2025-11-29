import Navbar from './Navbar.tsx';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function Home() {
    
    return(
        <>
            <Navbar></Navbar>
            <p>This is home</p>
        </>
    )
}

export default Home;