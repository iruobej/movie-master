import { Link, useNavigate } from 'react-router-dom'

type Props = {
  open: boolean;
  onClose: () => void;
};

function Navbar({ open, onClose }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // remove user data
    localStorage.removeItem("currentUser");


    // close sidebar
    onClose();

    // redirect to login page
    navigate("/");
  };


  return (
    <nav className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <i className="fa-solid fa-film"></i>
        <Link className="homeBtn" to={`/home`}>Movie Master</Link>
        <button type="button" className="icon-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/watchlist">Watchlist</Link></li>
        <li><Link to="/moviebot">Moviebot</Link></li>
      </ul>

      <button className="logOut" onClick={handleLogout}>Log Out</button>
    </nav>
  );
}

export default Navbar;
