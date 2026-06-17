import { Link } from "react-router-dom";

export default function Navbar() {

  return (

    <nav style={styles.nav}>

      <h2 style={styles.logo}>
        OOTD AI
      </h2>


      <div style={styles.links}>

        <Link to="/" style={styles.link}>
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


      </div>


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
