import { Link, useNavigate } from "react-router-dom"
import { useState, type SyntheticEvent} from "react"

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault(); //stopping page refresh, which would clear inputs

        if (username == "ji" && password == "pass") {
            setError("");
            navigate('/home')
        } else {
            setError("Invalid username or password");
        }
    }
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
                    <input 
                        type="text"
                        placeholder="Password" 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="loginBtn">Login</button>
                    <p style={{color: "#fff"}}>Dont have an account? <Link to="/signup">Sign Up</Link> </p>
                    {error && <p style={{color:"red"}}>{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default Login 