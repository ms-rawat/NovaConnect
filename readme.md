# NovaConnect

NovaConnect is a full-stack social media application that allows users to connect with friends, share posts, and chat in real-time.

## Features

*   **Google Authentication:** Users can sign up and log in using their Google account.
*   **Create and View Posts:** Users can create text, image, and video posts that appear on their feed.
*   **Real-time Chat:** Real-time chat functionality using Socket.io.
*   **Friend System:** Users can send and accept friend requests.
*   **Video Autoplay:** Videos in the feed autoplay when they are in the viewport.
*   **Online/Offline Status:** See the online status of your friends.

## Tech Stack

### Frontend

*   **Framework:** React (with Vite)
*   **Styling:** Tailwind CSS
*   **Routing:** React Router
*   **State Management:** Zustand
*   **HTTP Client:** Axios
*   **Authentication:** @react-oauth/google
*   **Real-time:** Socket.io-client
*   **Video Autoplay:** react-intersection-observer

### Backend

*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Real-time:** Socket.io
*   **File Uploads:** Cloudinary and Multer
*   **Authentication:** google-auth-library
*   **Environment Variables:** dotenv

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js installed on your machine.
*   A MongoDB Atlas account.
*   A Cloudinary account.
*   Google OAuth credentials.

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username/NovaConnect.git
    ```
2.  Install NPM packages for the server
    ```sh
    cd NovaConnect/server
    npm install
    ```
3.  Install NPM packages for the client
    ```sh
    cd ../client
    npm install
    ```
4.  Create a `.env` file in the `server` directory and add the following environment variables:
    ```
    PORT=5000
    MONGO_URI=<your_mongo_uri>
    CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
    CLOUDINARY_API_KEY=<your_cloudinary_api_key>
    CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
    GOOGLE_CLIENT_ID=<your_google_client_id>
    ```
5.  In the `client/src/firebase.js` file, replace the `firebaseConfig` with your own Firebase project configuration.

### Usage

1.  Start the server
    ```sh
    cd NovaConnect/server
    npm start
    ```
2.  Start the client
    ```sh
    cd ../client
    npm run dev
    ```
The application will be available at `http://localhost:5173`.

## Folder Structure

```
/
├── client/         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── server/         # Node/Express Backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── readme.md
```