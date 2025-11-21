

**NovaConnect**

This is project’s core document.

This architecture is designed for speed (to meet the Nov 21st deadline 1) while maintaining the code quality and specific feature requirements like the Friend System and Video Autoplay2222.

### **1\. High-Level Architecture**

We will use a **Monolithic Repository** structure (root folder containing client and server). This makes deployment (e.g., to Vercel/Render) and local development faster.

* **Frontend (Client):** React (Vite) \+ Tailwind CSS. handles the UI, Google Auth popup, and Socket.io client connection.  
* **Backend (Server):** Node/Express. Handles API routes, MongoDB connections, and the Socket.io server instance.  
* **Database:** MongoDB Atlas (Cloud).  
* **Storage:** **Cloudinary**. Since you need to upload images and videos3, storing these locally is bad practice. Cloudinary is the fastest way to handle media hosting and delivery.

* **Real-time:** Socket.io. Handles the chat messages and the "Online/Offline" status dots4444.

---

### **2\. Suggested Tech Stack & Libraries**

#### **Frontend (Client)**

* **Build Tool:** vite (Faster than Create React App).  
* **Styling:** tailwindcss, postcss, autoprefixer5.

* **Routing:** react-router-dom.  
* **State Management:** zustand (Much faster to setup than Redux for managing User/Auth state and Friend lists).  
* **HTTP Client:** axios.  
* **Auth:** @react-oauth/google (Simplest library to handle "User register using Google only" 6).

* **Real-time:** socket.io-client.  
* **Video Logic:** react-intersection-observer (Crucial for the "Autoplay behavior... when fully into viewport" requirement 7).

* **Icons:** react-icons (For the chat icon and UI elements).  
* **Notifications:** react-hot-toast (For friend request alerts).

#### **Backend (Server)**

* **Framework:** express.  
* **Database:** mongoose.  
* **Real-time:** socket.io.  
* **Cors:** cors (To allow frontend-backend communication).  
* **Env Vars:** dotenv.  
* **File Uploads:** multer (Middleware to handle file data) \+ cloudinary (SDK to send files to cloud).  
* **Auth Verification:** google-auth-library (To verify the Google token sent from frontend).

---

### **3\. Folder Structure**

This structure separates concerns cleanly, which is a requirement for the code quality review8.

Plaintext

/root  
  ├── /client                  \# React Frontend  
  │     ├── /public  
  │     ├── /src  
  │     │     ├── /assets  
  │     │     ├── /components  
  │     │     │     ├── Navbar.jsx  
  │     │     │     ├── PostCard.jsx       \# Handles Video Autoplay Logic  
  │     │     │     ├── ChatWindow.jsx  
  │     │     │     └── FriendRequest.jsx  
  │     │     ├── /context             \# AuthContext (optional if using Zustand)  
  │     │     ├── /hooks  
  │     │     │     ├── useSocket.js       \# Custom hook for socket connection  
  │     │     │     └── useChat.js  
  │     │     ├── /pages  
  │     │     │     ├── Login.jsx          \# Google Login Button  
  │     │     │     ├── Home.jsx           \# The Feed  
  │     │     │     └── Profile.jsx  
  │     │     ├── /store  
  │     │     │     └── useAuthStore.js    \# Zustand store  
  │     │     ├── App.jsx  
  │     │     └── main.jsx  
  │     ├── tailwind.config.js  
  │     └── package.json  
  │  
  ├── /server                  \# Node/Express Backend  
  │     ├── /config  
  │     │     ├── db.js            \# MongoDB Connection  
  │     │     └── cloudinary.js    \# Cloudinary Config  
  │     ├── /controllers  
  │     │     ├── authController.js  
  │     │     ├── postController.js  
  │     │     ├── userController.js  \# Handles Friend Requests  
  │     │     └── chatController.js  
  │     ├── /models  
  │     │     ├── User.js  
  │     │     ├── Post.js  
  │     │     └── Chat.js  
  │     ├── /routes  
  │     │     ├── authRoutes.js  
  │     │     ├── postRoutes.js  
  │     │     └── chatRoutes.js  
  │     ├── /socket  
  │     │     └── socketHandler.js   \# Separate socket logic from index.js  
  │     ├── .env  
  │     ├── index.js                 \# Entry point (Server \+ Socket init)  
  │     └── package.json  
  │  
  └── README.md                \# Documentation

### **4\. Key Implementation Details to Note**

A. The Post Schema (For Autoplay)  
Your Post schema needs to distinguish between images and videos to render the correct HTML tag (\<img /\> vs \<video /\>)9.  
B. The Friend Logic Controller  
You need a specific endpoint for the "Chat Trigger" requirement10:

* Endpoint: POST /api/connect  
* Logic: If friendship exists \-\> Open Chat. If not \-\> Create Notification.

C. Socket.io "Online" Map  
In server/index.js or socketHandler.js, you will need a simple object or Map to track users:

JavaScript

// Simple in-memory map for online status \[cite: 41\]  
let onlineUsers \= \[\]; 

const addNewUser \= (username, socketId) \=\> {  
  \!onlineUsers.some((user) \=\> user.username \=== username) &&  
    onlineUsers.push({ username, socketId });  
};

D. Deployment Strategy 11

* **Backend:** Deploy to **Render** (Free tier supports Node.js).  
* **Frontend:** Deploy to **Vercel** (Fast, free, handles React routing well).  
* **Database:** MongoDB Atlas (Free tier).

### **Next Step**

Would you like me to generate the **Backend Models (User, Post, Chat)** first, or do you want the **React Code for the Video Autoplay component**?