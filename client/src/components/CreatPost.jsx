import axios from "axios";
import { useState } from "react";
import { API_BASE_URL } from "../config/StaticVars";
import { Image, LoaderIcon, Send, SendIcon, Video } from "lucide-react";
import api from "../config/api";



export const CreatePost = ({ currentUser, onPostCreated }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", currentUser._id);
    formData.append("text", text);
    if (file) formData.append("file", file);
    try {
      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      setText("");
      setFile(null);
      onPostCreated();
    } catch (error) {
      console.error("Failed to post", error);
    } finally {
      setLoading(false);
    }

  }
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex gap-4">
        <img
          src={currentUser?.avatar}
          alt="Me"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start a post..."
            className="w-full p-2 bg-gray-100 rounded-lg focus:outline-none resize-none"
            rows="3"
          />

          {file && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
              Attached: {file.name}
            </div>
          )}

          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-3 text-gray-500">
              <label className="cursor-pointer hover:text-blue-500 flex items-center gap-1">
                <Image size={20} /> Photo
                <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files[0])} />
              </label>
              <label className="cursor-pointer hover:text-blue-500 flex items-center gap-1">
                <Video size={20} /> Video
                <input type="file" accept="video/*" hidden onChange={(e) => setFile(e.target.files[0])} />
              </label>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              {loading ? <><LoaderIcon size={16} className="rotate-90 animate-spin" /></> : <><SendIcon size={16} /> Post</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}