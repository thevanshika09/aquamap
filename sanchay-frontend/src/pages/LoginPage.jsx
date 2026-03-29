import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/Dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #040d1a 0%, #061626 50%, #071e2e 100%)" }}
    >
      {/* Grid dot overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(56,189,248,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient glow blobs */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,116,144,0.2) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)" }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full rounded-2xl shadow-2xl overflow-hidden relative z-10"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(6,182,212,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top accent line */}
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)" }}
        />

        <div className="p-8">
          {/* Logo mark */}
          <div className="flex justify-center mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)", boxShadow: "0 0 24px rgba(6,182,212,0.3)" }}
            >
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5.5 1.5 2.5 4.5 2.5 8C2.5 11.5 5 14.5 8 14.5C11 14.5 13.5 11.5 13.5 8C13.5 4.5 10.5 1.5 8 1.5Z" stroke="white" strokeWidth="1.2" />
                <path d="M8 5V9M6 7H10" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h2
            className="text-3xl font-bold mb-2 text-center text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Welcome Back
          </h2>
          <p className="text-center text-sm text-slate-400 mb-8">
            Sign in to your AquaMap account
          </p>

          <form onSubmit={handleLogin}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center mb-6">
              <Link
                to="/forgot-password"
                className="text-sm transition-colors"
                style={{ color: "#67e8f9" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#67e8f9")}
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-medium mb-4 text-center">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(6,182,212,0.45)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 text-white font-semibold rounded-xl transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #06b6d4 100%)",
                boxShadow: "0 0 20px rgba(6,182,212,0.25)",
              }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Sign In"}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-4 flex justify-center"
          style={{
            background: "rgba(4,13,26,0.5)",
            borderTop: "1px solid rgba(6,182,212,0.08)",
          }}
        >
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium transition-colors"
              style={{ color: "#67e8f9" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#67e8f9")}
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Syne font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};

export default LoginPage;