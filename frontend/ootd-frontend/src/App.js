import { BrowserRouter, Routes, Route } from "react-router-dom";

import Wardrobe from "./pages/Wardrobe";
import Upload from "./pages/Upload";
import Mannequin from "./pages/Mannequin";
import History from "./pages/History";

import Navbar from "./components/Navbar";


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route 
          path="/" 
          element={<Wardrobe />} 
        />

        <Route 
          path="/upload" 
          element={<Upload />} 
        />

        <Route 
          path="/mannequin" 
          element={<Mannequin />} 
        />

        <Route 
          path="/history" 
          element={<History />} 
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;