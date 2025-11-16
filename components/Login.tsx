function Login() {
    return  (
        <div className="wrapper">
            <div className="card">
                <i className="fa-solid fa-film"></i>
                <p>Movie Master</p>
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
                </form>
            </div>
        </div>
    )
}

export default Login 