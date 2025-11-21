import { Trash2, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

export const PostCard = ({ post, currentUser, OnDelete }) => {
  const videoRef = useRef(null);
  console.log(post)
  console.log(currentUser)
  const { ref, inView } = useInView({ threshold: 0.5 });
  const navigate = useNavigate();
  useEffect(() => {
    if (post?.mediaType !== "video" || !videoRef.current) return;

    if (inView) {
      videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
    } else {
      videoRef.current?.pause();
    }
  }, [inView, post?.mediaType]);

  const handleChatClick = async () => {
    if (post?.user._id === currentUser._id) return; // post.id refers tothe user id

    const postOwnerId = post.user._id;
    const isFriend = currentUser.friends?.includes(postOwnerId);

    if (isFriend) {
      // TODO: Implement logic to open a chat window with post.user
      try { 
        // Navigate to the messaging page, passing the recipient in the state
        navigate(`/app/messaging`, { state: { recipient: post.user } });
      } catch (error) {
        console.error('Error opening chat:', error);
      }
    } else {
      // If not friends, send a friend request
      try {
        await api.post('/friend-requests', { recipientId: postOwnerId });
        alert(`Friend request sent to ${post.user.name}!`);
      } catch (error) {
        console.error('Error sending friend request:', error);
        alert(error.response?.data?.message || 'Could not send friend request.');
      }
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden mb-4'>
      <div className='p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img
            src={post?.user?.avatar || "https://placehold.co/40"}
            alt="user avatar"
            className='w-10 h-10 rounded-full object-cover'
          />
          <div>
            <h3 className='font-semibold text-gray-800'>{post?.user?.name}</h3>
            <p className='text-xs text-gray-500'>{new Date(post?.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {currentUser?._id === post?.user?._id && (
          <button onClick={OnDelete}>
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {post?.text && (
        <div className="px-4 pb-2">
          <p className='text-gray-700'>{post.text}</p>
        </div>
      )}

      {post?.mediaUrl && post?.mediaType === 'image' && (
        <img src={post.mediaUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
      )}

      {post?.mediaUrl && post?.mediaType === 'video' && (
        <div ref={ref} className="w-full bg-black">
          <video
            ref={videoRef}
            src={post.mediaUrl}
            className="w-full max-h-[500px] object-contain"
            loop
            muted // Muted is often required for autoplay by browsers
            controls
          />
        </div>
      )}

      <div className="p-4 border-t border-gray-100 flex items-center gap-4">
        {post?.user._id !== currentUser?._id ? (
          <button
            onClick={handleChatClick}
            className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition"
          >
            <MessageCircle size={20} />
            <span className="font-medium">Chat / Connect</span>
          </button>
        ) : (
          <span className="text-gray-400 text-sm italic">Your Post</span>
        )}
      </div>
    </div>
  )
}
