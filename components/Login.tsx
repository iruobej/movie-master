import { Link } from "react-router-dom"
function Login() {
    return  (
        <div className="wrapper">
            <div className="card">
                <i className="fa-solid fa-film fa-2x"></i>
                <h2>Movie Master</h2>
                <h3>Login</h3>
                <form action="/">
                    <input 
                        type="text"
                        placeholder="Username" 
                    />
                    <input 
                        type="text"
                        placeholder="Password" 
                    />
                    <button type="submit" className="loginBtn">Login</button>
                    <p style={{color: "#fff"}}>Dont have an account? <Link to="/signup">Sign Up</Link> </p>
                </form>
            </div>
        </div>
    )
}

export default Login 