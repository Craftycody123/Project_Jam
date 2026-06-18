import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

// Wardrobe pages
import Wardrobe from "./pages/Wardrobe";
import Upload from "./pages/Upload";
import Mannequin from "./pages/Mannequin";
import History from "./pages/History";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/wardrobe" element={
          <ProtectedRoute><Wardrobe /></ProtectedRoute>
        } />
        <Route path="/upload" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        } />
        <Route path="/mannequin" element={
          <ProtectedRoute><Mannequin /></ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute><History /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;