import React, { useState } from "react";
import PostModal from "./PostModal";
import { useNavigate } from "react-router-dom";

function BottomNav({ fetchPosts }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 flex justify-around p-3">
        <button onClick={() => navigate("/communitypage")} className="text-white">🏠</button>
        <button onClick={() => setIsOpen(true)} className="text-white">➕</button>
        <button onClick={() => navigate("/profilepagecom")} className="text-white">👤</button>
      </div>
      <PostModal isOpen={isOpen} onClose={() => setIsOpen(false)} fetchPosts={fetchPosts} />
    </>
  );
}

export default BottomNav;
