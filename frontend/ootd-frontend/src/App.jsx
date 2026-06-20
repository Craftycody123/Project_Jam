import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Wardrobe from "./pages/Wardrobe";
import OutfitBuilder from "./pages/OutfitBuilder";
import Upload from "./pages/Upload";
import Mannequin from "./pages/Mannequin";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/wardrobe"
          element={
            <ProtectedRoute>
              <Wardrobe />
            </ProtectedRoute>
          }
        />
        <Route path="/outfitbuilder" element={<ProtectedRoute><OutfitBuilder /></ProtectedRoute>} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
            path="/OutfitBuilder"
            element={
              <ProtectedRoute>
                <OutfitBuilder />
              </ProtectedRoute>
            }
        />

        <Route
          path="/mannequin"
          element={
            <ProtectedRoute>
              <Mannequin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}