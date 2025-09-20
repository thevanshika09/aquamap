import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LogOut, UserCircle } from "lucide-react";

const Navbar = () => {
  const { logout, user, isAuthenticated } = useAuthStore();

  return (
    
   <header className="bg-black/40 backdrop-blur-lg fixed top-0 w-full z-50 border-b border-gray-700 text-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
          <div className="size-9 rounded-lg bg-emerald-400/20 flex items-center justify-center">
            <UserCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-emerald-300">Sakhi</h1>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline font-medium text-emerald-300">
                Welcome, {user?.name?.split(" ")[0] || "User"}!
              </span>
              <Link to="/profile" title="Profile" className="hover:text-emerald-300">
                <UserCircle className="w-6 h-6" />
              </Link>
              {/* <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-medium transition"
              >
                Logout
              </button> */}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full border border-emerald-300 text-emerald-300 hover:bg-emerald-300 hover:text-black font-medium transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded-full bg-emerald-400 text-black hover:bg-emerald-300 font-semibold transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
