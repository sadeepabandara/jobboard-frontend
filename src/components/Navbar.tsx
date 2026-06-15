import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/jobs" style={styles.brand}>
        JobBoard
      </Link>
      <div>
        {token ? (
          <>
            <Link to="/jobs" style={styles.link}>
              Jobs
            </Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#1a1a2e",
    color: "white",
  },
  brand: {
    color: "white",
    textDecoration: "none",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  link: {
    color: "white",
    textDecoration: "none",
    marginRight: "1rem",
  },
  button: {
    backgroundColor: "#e94560",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;
