import { Link } from "react-router-dom"
function SignUp() {
    return  (
        <div className="wrapper">
            <div className="card">
                <i className="fa-solid fa-film fa-2x"></i>
                <h2>Movie Master</h2>
                <h3>Sign Up</h3>
                <form action="/">
                    <input 
                        type="text"
                        placeholder="First Name" 
                    />
                    <input 
                        type="text"
                        placeholder="Last Name" 
                    />
                    <input 
                        type="text"
                        placeholder="Email" 
                    />
                    <input 
                        type="text"
                        placeholder="Username" 
                    />
                    <input 
                        type="text"
                        placeholder="Password" 
                    />
                    <input 
                        type="text"
                        placeholder="Confirm Password" 
                    />
                    <button type="submit" className="loginBtn">Sign Up</button>
                    <p style={{color: "#fff"}}>Already have an account? <Link to="/">Login</Link> </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp