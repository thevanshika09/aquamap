import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Camera, Mail, User, Wallet, Ticket, Star, LogOut, Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
    updateProfile,
    isUpdatingProfile,
  } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editError, setEditError] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setSelectedImg(URL.createObjectURL(file));
      const compressedFile = await compressImage(file);
      const base64Image = await convertToBase64(compressedFile);
      const success = await updateProfile({ profilePic: base64Image });
      if (!success) throw new Error("Backend update failed");
      setSelectedImg(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setSelectedImg(null);
      alert("Failed to save image. Please try again.");
    }
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const compressImage = async (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX = 400;
          let w = img.width, h = img.height;
          if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
          else { if (h > MAX) { w *= MAX / h; h = MAX; } }
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => resolve(new File([blob], file.name, { type: "image/jpeg" })),
            "image/jpeg", 0.7
          );
        };
      };
    });

  const handleEditProfile = () => { setEditedName(user?.name || ""); setIsEditing(true); };
  const handleSaveProfile = async () => {
    try {
      setEditError(null);
      await updateProfile({ name: editedName });
      setIsEditing(false);
    } catch (error) {
      setEditError(error.message || "Failed to update profile");
    }
  };
  const handleCancelEdit = () => { setIsEditing(false); setEditedName(user?.name || ""); setEditError(null); };
  const handleLogout = async () => {
    try { await logout(); navigate("/dashboard"); }
    catch (error) { console.error("Logout error:", error); }
  };

  if (!isAuthenticated || isLoading || !user) {
    return (
      <div
        className="h-screen flex items-center justify-center text-base"
        style={{ background: "linear-gradient(160deg, #040d1a 0%, #061626 50%, #071e2e 100%)", color: "#67e8f9" }}
      >
        Loading profile...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
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
      {/* Glow blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(14,116,144,0.18) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(3,105,161,0.15) 0%, transparent 70%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto relative z-10 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(6,182,212,0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top accent line */}
        <div className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)" }} />

        <div className="p-8 space-y-10">

          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1
                className="text-3xl font-bold text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Welcome, {user?.name?.split(" ")[0] || "User"}!
              </h1>
              <p className="text-sm" style={{ color: "rgba(103,232,249,0.7)" }}>
                Manage your AquaMap profile and account
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditProfile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(6,182,212,0.08)",
                  border: "1px solid rgba(6,182,212,0.2)",
                  color: "#67e8f9",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(6,182,212,0.15)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(6,182,212,0.08)"}
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className="p-1 rounded-full"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
              >
                <img
                  src={user?.profilePic || selectedImg || "/avatar.png"}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover"
                  style={{ border: "3px solid #040d1a" }}
                  onError={(e) => { e.target.src = "/avatar.png"; }}
                />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-all"
                style={{
                  background: "linear-gradient(135deg, #0284c7, #06b6d4)",
                  boxShadow: "0 0 12px rgba(6,182,212,0.4)",
                  opacity: isUpdatingProfile ? 0.5 : 1,
                  pointerEvents: isUpdatingProfile ? "none" : "auto",
                }}
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs mt-3" style={{ color: "rgba(148,163,184,0.6)" }}>
              {isUpdatingProfile ? "Uploading..." : "Click the camera to change avatar"}
            </p>
          </div>

          {/* Info fields */}
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <p className="text-xs font-medium tracking-widest uppercase mb-2 flex items-center gap-2"
                style={{ color: "rgba(103,232,249,0.6)" }}>
                <User className="w-3.5 h-3.5" /> Full Name
              </p>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none transition-all"
                    style={{
                      background: "rgba(6,182,212,0.06)",
                      border: "1px solid rgba(6,182,212,0.3)",
                    }}
                    onFocus={(e) => e.target.style.border = "1px solid rgba(6,182,212,0.6)"}
                    onBlur={(e) => e.target.style.border = "1px solid rgba(6,182,212,0.3)"}
                  />
                  {editError && <p className="text-red-400 text-xs">{editError}</p>}
                </div>
              ) : (
                <p
                  className="px-4 py-2.5 rounded-xl text-sm text-white"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}
                >
                  {user?.name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium tracking-widest uppercase mb-2 flex items-center gap-2"
                style={{ color: "rgba(103,232,249,0.6)" }}>
                <Mail className="w-3.5 h-3.5" /> Email
              </p>
              <p
                className="px-4 py-2.5 rounded-xl text-sm text-white"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(6,182,212,0.1)" }}
              >
                {user?.email}
              </p>
            </div>
          </div>

          {/* Edit actions */}
          {isEditing && (
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(148,163,184,0.2)",
                  color: "rgba(148,163,184,0.8)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isUpdatingProfile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #0284c7, #06b6d4)",
                  boxShadow: "0 0 16px rgba(6,182,212,0.3)",
                }}
              >
                <Save className="w-4 h-4" />
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Wallet className="w-5 h-5" style={{ color: "#38bdf8" }} />, label: "Wallet", value: `₹${user.wallet || 0}` },
              { icon: <Ticket className="w-5 h-5" style={{ color: "#38bdf8" }} />, label: "Coupons", value: user.coupons?.length || 0 },
              { icon: <Star className="w-5 h-5" style={{ color: "#38bdf8" }} />, label: "AquaPoints", value: user.sakhiPoints || 0 },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="p-5 rounded-2xl text-center transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(6,182,212,0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(6,182,212,0.35)";
                  e.currentTarget.style.background = "rgba(6,182,212,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(6,182,212,0.12)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }}
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(103,232,249,0.6)" }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Account info */}
          <div
            className="p-6 rounded-2xl space-y-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(6,182,212,0.1)",
            }}
          >
            <h2 className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#67e8f9" }}>
              Account Information
            </h2>
            <div
              className="h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)" }}
            />
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Member Since</span>
              <span className="text-white">{user.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Account Status</span>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.25)",
                  color: "#67e8f9",
                }}
              >
                Active
              </span>
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-center pb-2">
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "rgba(252,165,165,0.9)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)" }} />
      </motion.div>

      {/* Syne font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};

export default ProfilePage;