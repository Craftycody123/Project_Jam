import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B2F25] text-[#F5EFE4] hover:bg-[#C7693D] transition-colors shadow-lg text-sm font-medium tracking-wide"
      aria-label="Log out"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
