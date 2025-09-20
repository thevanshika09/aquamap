import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Camera, Mail, User, Wallet, Ticket, Star, LogOut, Edit, Save, X } from "lucide-react";
import FloatingShape from "../components/FloatingShape";

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
    // 1. Show loading state immediately
    setSelectedImg(URL.createObjectURL(file)); // Temporary local preview

    // 2. Compress image if needed (optional)
    const compressedFile = await compressImage(file); // Use the compression function from earlier

    // 3. Convert to Base64
    const base64Image = await convertToBase64(compressedFile);

    // 4. Update backend
    const success = await updateProfile({ profilePic: base64Image });
    
    if (!success) {
      throw new Error("Backend update failed");
    }

    // 5. Only update local state if backend succeeds
    setSelectedImg(null); // Clear temp URL
  } catch (error) {
    console.error("Upload failed:", error);
    setSelectedImg(null); // Remove failed upload
    alert("Failed to save image. Please try again.");
  }
};

// Helper function
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg', quality: 0.7 })),
          'image/jpeg',
          0.7
        );
      };
    };
  });
};

  const handleEditProfile = () => {
    setEditedName(user?.name || "");
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      setEditError(null);
      await updateProfile({ name: editedName });
      setIsEditing(false);
    } catch (error) {
      setEditError(error.message || "Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(user?.name || "");
    setEditError(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/dashboard");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isAuthenticated || isLoading || !user) {
    return (
      <div className="h-screen pt-32 flex items-center justify-center text-lg text-emerald-800">
        Loading profile...
      </div>
    );
  }

  return (
    
    
    <div className="min-h-screen pt-5 pb-5 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-emerald-100">
      
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-10 border border-emerald-200">
        <div className="flex justify-between items-start">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-800">
              Welcome, {user?.name || "User"}!
            </h1>
            <p className="text-emerald-600">Manage your profile, wallet and Sakhi points</p>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEditProfile}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : null}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center">
  <div className="relative">
    {/* Replace the existing img tag with this one */}
    <img
  src={user?.profilePic || selectedImg || "/avatar.png"}
  alt="Profile"
  className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500 shadow-lg"
  onError={(e) => {
    e.target.src = "/avatar.png"; // Fallback if image fails to load
  }}
/>
    <label
      htmlFor="avatar-upload"
      className={`absolute bottom-0 right-0 bg-emerald-600 hover:bg-emerald-700 p-2 rounded-full cursor-pointer transition-all ${
        isUpdatingProfile ? "opacity-50 pointer-events-none" : ""
      }`}
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
  <p className="text-sm text-emerald-600 mt-2">
    {isUpdatingProfile ? "Uploading..." : "Click the camera to change avatar"}
  </p>
</div>

        {/* Info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-emerald-600 flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </p>
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="mt-1 w-full px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {editError && <p className="text-red-500 text-sm">{editError}</p>}
              </div>
            ) : (
              <p className="mt-1 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
                {user?.name || "Not provided"}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-emerald-600 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </p>
            <p className="mt-1 px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
              {user?.email}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={isUpdatingProfile}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center shadow">
            <Wallet className="mx-auto mb-2 w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-600">Wallet</p>
            <p className="text-xl font-bold text-emerald-800">₹{user.wallet || 0}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center shadow">
            <Ticket className="mx-auto mb-2 w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-600">Coupons</p>
            <p className="text-xl font-bold text-emerald-800">{user.coupons?.length || 0}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center shadow">
            <Star className="mx-auto mb-2 w-5 h-5 text-emerald-600" />
            <p className="text-sm text-emerald-600">Sakhi Points</p>
            <p className="text-xl font-bold text-emerald-800">{user.sakhiPoints || 0}</p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 space-y-4">
          <h2 className="text-lg font-semibold text-emerald-800">Account Information</h2>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">Member Since</span>
            <span className="text-emerald-800">{user.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">Account Status</span>
            <span className="text-emerald-600 font-medium">Active</span>
          </div>
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shadow-md"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;