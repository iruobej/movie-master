type Props = {
  open: boolean;
  onClose: () => void;
};

function Navbar({ open, onClose }: Props) {
  return (
    <nav className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-header">
        <i className="fa-solid fa-film"></i>
        <h1>Movie Master</h1>
        
        <button type="button" className="icon-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul>
        <li>Search</li>
        <li>Watchlist</li>
        <li>Logout</li>
      </ul>
    </nav>
  );
}

export default Navbar;
