import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';
import { Rocket } from 'lucide-react'; // Using an icon for the logo

const Login = () => {
    const navigate = useNavigate();
    const { login, user: currentUser } = useAuthStore();

    useEffect(() => {
        if (currentUser) navigate('/app/feed');
    }, [currentUser, navigate]);

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken();

            const res = await api.post(`/auth/google`, { token });
            login(res.data);
            navigate("/app/feed");
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    }

    if (currentUser) return null;

    return (
        <div className="min-h-screen flex">
            {/* Left Pane */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 items-center justify-center text-white p-12">
                <div className="text-center">
                    <Rocket size={80} className="mx-auto mb-4" />
                    <h1 className="text-5xl font-bold mb-4 NovaConnectLogo">NovaConnect</h1>
                    <p className="text-xl">Connect, Share, and Grow your Professional Network.</p>
                </div>
            </div>

            {/* Right Pane */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-100 p-8">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-2xl text-center">
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-600 mb-8">Sign in to continue to your account.</p>
                    
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6 bg-white rounded-full p-1" alt="Google" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;