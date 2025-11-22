import React, { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import api from '../config/api';
import useAuthStore from '../store/useAuthStore';
import { Particle } from '../classes/particle'; // Import Particle class

const Login = () => {
    const navigate = useNavigate();
    const { login, user: currentUser } = useAuthStore();
    const canvasRef = useRef(null);

    // --- LIVE BACKGROUND LOGIC from LandingPage.jsx ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Prevent error if canvas is not rendered
        
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const initParticles = () => {
            particles = [];
            const numberOfParticles = (canvas.width * canvas.height) / 9000;
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle(canvas));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#0f172a'); // Slate 900
            gradient.addColorStop(1, '#1e293b'); // Slate 800
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => { p.update(canvas); p.draw(ctx); });
            connectParticles();
            animationFrameId = requestAnimationFrame(animate);
        };

        const connectParticles = () => {
            const maxDistance = 120;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const distance = Math.sqrt(
                        (particles[a].x - particles[b].x) ** 2 +
                        (particles[a].y - particles[b].y) ** 2
                    );
                    if (distance < maxDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(100, 149, 237, ${1 - distance / maxDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        resizeCanvas();
        initParticles();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

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
        <div className="relative w-full min-h-screen overflow-hidden font-sans text-white">
            {/* Live Canvas Background */}
            <canvas 
                ref={canvasRef} 
                className="fixed top-0 left-0 w-full h-full z-0"
            />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                {/* Navbar-like Logo */}
                <div className="absolute top-0 left-0 p-6">
                    <Link to="/" className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer NovaConnectLogo">
                        NovaConnect
                    </Link>
                </div>

                {/* Login Form Card */}
                <div className="w-full max-w-md p-8 text-center rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700 shadow-2xl shadow-blue-500/10">
                    <h2 className="text-4xl font-bold mb-2 text-white">Welcome Back</h2>
                    <p className="text-gray-300 mb-8">Sign in to join the network.</p>
                    
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white/10 hover:bg-white/20 border border-slate-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 ease-in-out transform hover:scale-105 group"
                    >
                        <img 
                            src="https://www.svgrepo.com/show/475656/google-color.svg" 
                            className="w-6 h-6 bg-white rounded-full p-0.5" 
                            alt="Google" 
                        />
                        Sign in with Google
                    </button>
                    <p className="text-xs text-slate-500 mt-6">
                        By signing in, you agree to our imaginary Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login;