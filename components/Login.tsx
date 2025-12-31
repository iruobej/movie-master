import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, type SyntheticEvent} from "react"
import type { User } from '../types/User.ts'; //must import types in this format

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [seeText, setSeeText] = useState(false);
    const [seeCText, setSeeCText] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
            document.body.classList.remove("login", "home");
            document.body.classList.add("login");
    }, []) //empty d.array mean it will only execute once with no refreshes
    

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault(); //stopping page refresh, which would clear inputs
        setError("");

        // Getting users from localStorage
        const stored = localStorage.getItem("users");

        if(!stored) {
            setError("No accounts found. Please sign up first.");
            return;
        }

        //converting strings in localStorage to JS objects, inside an array
        const users: User[] = JSON.parse(stored);

        const foundUser = users.find(
            (u) => u.username === username && u.password === password
        );

        //If found, log in
        if (foundUser) {
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("currentUser", JSON.stringify(foundUser));
            navigate("/home");
        } else {
            setError("Invalid username or password");
        }
    };
    return  (
        <div className="wrapper">
            <div className="card">
                <i className="fa-solid fa-film fa-2x"></i>
                <h2>Movie Master</h2>
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        placeholder="Username" 
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="password-block">
                        <input 
                            type={seeText? "text" : "password"}
                            placeholder="Password" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="button"  onClick={() => setSeeText(prev => !prev)}><i className={seeText ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i></button> {/*type=button stops form from auto submitting*/}
                    </div>
                    <button type="submit" className="loginBtn">Login</button>
                    <p style={{color: "#fff"}}>Dont have an account? <Link to="/signup">Sign Up</Link> </p>
                    {error && <p style={{color:"red"}}>{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default Login 