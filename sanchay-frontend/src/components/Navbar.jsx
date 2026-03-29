import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { UserCircle } from "lucide-react";

const Navbar = () => {
  const { logout, user, isAuthenticated } = useAuthStore();

  return (
    <header
      className="fixed top-0 w-full z-50"
      style={{
        background: "rgba(4,13,26,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(6,182,212,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1.5C5.5 1.5 2.5 4.5 2.5 8C2.5 11.5 5 14.5 8 14.5C11 14.5 13.5 11.5 13.5 8C13.5 4.5 10.5 1.5 8 1.5Z"
                stroke="white"
                strokeWidth="1.2"
              />
              <path
                d="M8 5V9M6 7H10"
                stroke="white"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ color: "#e0f2fe" }}
          >
            AquaMap
          </span>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span
                className="hidden sm:inline text-sm font-medium"
                style={{ color: "rgba(103,232,249,0.8)" }}
              >
                Welcome, {user?.name?.split(" ")[0] || "User"}
              </span>

              <Link
                to="/profile"
                title="Profile"
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all"
                style={{
                  border: "1px solid rgba(6,182,212,0.3)",
                  background: "rgba(6,182,212,0.07)",
                  color: "#67e8f9",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(6,182,212,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(6,182,212,0.07)"}
              >
                <UserCircle className="w-4 h-4" />
              </Link>

              {/* Uncomment to enable logout:
              <button
                onClick={logout}
                className="text-sm px-4 py-1.5 rounded-full font-medium transition-all"
                style={{
                  border: "1px solid rgba(239,68,68,0.3)",
                  background: "rgba(239,68,68,0.07)",
                  color: "rgba(252,165,165,0.9)",
                }}
              >
                Logout
              </button> */}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-4 py-1.5 rounded-full font-medium transition-all"
                style={{
                  border: "1px solid rgba(6,182,212,0.35)",
                  color: "#67e8f9",
                  background: "transparent",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(6,182,212,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Log In
              </Link>

              <Link
                to="/signup"
                className="text-sm px-4 py-1.5 rounded-full font-semibold text-white transition-all"
                style={{
                  background: "linear-gradient(135deg, #0284c7, #06b6d4)",
                  boxShadow: "0 0 16px rgba(6,182,212,0.28)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(6,182,212,0.48)";
                  e.currentTarget.style.transform = "scale(1.04)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(6,182,212,0.28)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
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