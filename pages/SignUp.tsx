import { Link } from "react-router-dom"
import { useState, useEffect, type SyntheticEvent} from "react"  
function SignUp() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [watchlist, setWatchList] = useState<number[]>([]); //to hold the ids of saved movies
    const [errors, setErrors] = useState<string[]>([])
    const [seeText, setSeeText] = useState(false);
    const [seeCText, setSeeCText] = useState(false);

    useEffect(() => {
        document.body.classList.remove("login", "home");
        document.body.classList.add("login");
    }, [])

    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        const errorList: string[] = [];
        if (firstname.length <= 1) {
            errorList.push("First name must be longer than one character");
        } 
        if (lastname.length <= 1) {
            errorList.push("Last name must be longer than one character");
        } 
        if (!email.includes("@") || !email.includes(".com")) {
            errorList.push("invalid email");
        } 
        if (password.length <= 8) {
            errorList.push("Password must be longer than 8 characters");
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            errorList.push("Password must include at least one special character");
        }
        if (!/[A-Z]/.test(password)) {
            errorList.push("Password must include at least one capital character");
        }
        if (password != cpassword) {
            errorList.push("Passwords do not match");
        }
        setErrors(errorList); //tells React to re-render so we don't need to use useEffect

        if (errorList.length > 0) {
            return;
        }

        //Saving user
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const newUser = {
            firstname,
            lastname,
            email,
            username,
            password,
            watchlist
        };

        storedUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(storedUsers));
        alert("Account created! You can now log in.");
    }


    return  (
        <div className="wrapper">
            <div className="card">
                <i className="fa-solid fa-film fa-2x"></i>
                <h2>Movie Master</h2>
                <h3>Sign Up</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        placeholder="First Name" 
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                    <input 
                        type="text"
                        placeholder="Last Name" 
                        onChange={(e) => setLastname(e.target.value)}
                    />
                    <input 
                        type="email"
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)}
                    />
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
                        <button onClick={() => setSeeText(prev => !prev)}><i className={seeText ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i></button>
                    </div>
                    <div className="password-block">
                        <input 
                            type={seeCText? "text" : "password"}
                            placeholder="Confirm Password" 
                            onChange={(e) => setCpassword(e.target.value)}
                        />
                        <button type="button" onClick={() => setSeeCText(prev => !prev)}><i className={seeCText ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i></button>
                    </div>
                    <button type="submit" className="button">Sign Up</button>
                    <p style={{color: "#fff"}}>Already have an account? <Link to="/">Login</Link> </p>
                    {errors && <ul style={{color: "red", textAlign: "left"}}>
                        {errors.map((err, index) => (
                            <li key={index}>{err}</li>
                        ))}
                    </ul>}
                    {!errors.length && <p>Signed Up!</p>}
                </form>
            </div>
        </div>
    )
}

export default SignUp