import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>OOTD AI</h2>

      {isAuthenticated ? (
        <div style={styles.links}>
          <Link to="/wardrobe" style={styles.link}>
            Wardrobe
          </Link>

          <Link to="/upload" style={styles.link}>
            Upload
          </Link>

          <Link to="/mannequin" style={styles.link}>
            Mannequin
          </Link>

          <Link to="/history" style={styles.link}>
            History
          </Link>

          <Link to="/profile" style={styles.link}>
            {user?.name || "Profile"}
          </Link>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <div style={styles.links}>
          <Link to="/login" style={styles.link}>
            Login
          </Link>

          <Link to="/signup" style={styles.link}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}



const styles={

nav:{

display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"15px 30px",
background:"#111",
color:"white"

},


logo:{

margin:0

},


links:{

display:"flex",
gap:"20px"

},


link:{

color:"white",
textDecoration:"none",
fontWeight:"bold"

}

};
