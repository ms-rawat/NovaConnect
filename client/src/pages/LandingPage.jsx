import React, { useEffect, useRef } from 'react';
import { MessageCircle, Video, Users, Zap, Shield, Globe } from 'lucide-react';
import { Particle } from '../classes/particle';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const canvasRef = useRef(null);

  // --- LIVE BACKGROUND LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

  

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000; // Density
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle(canvas));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a'); // Slate 900
      gradient.addColorStop(1, '#1e293b'); // Slate 800
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and Draw Particles
      particles.forEach((particle) => {
        particle.update(canvas);
        particle.draw(ctx);
      });

      // Connect Particles (Constellation Effect)
      connectParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    const connectParticles = () => {
      const maxDistance = 120;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 149, 237, ${1 - distance / maxDistance})`; // Fade out line
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    resizeCanvas();
    initParticles();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden font-sans text-white">
      {/* Live Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="fixed top-0 left-0 w-full h-full z-0"
      />

      {/* Content Overlay */}
      <div className="relative z-10">
        
        {/* Navbar */}
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer NovaConnectLogo">
            NovaConnect
          </div>
          <div className="space-x-4 flex items-center">
            <Link
              to="/login" 
              className="text-sm font-medium hover:text-blue-300 transition"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-full text-sm font-bold transition shadow-lg shadow-blue-500/30"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="flex flex-col items-center text-center mt-20 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 projectthoughtsTitle">
            Connect Beyond <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              The Boundaries
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10">
            Experience the next generation of social networking. 
            Seamless video feeds, intelligent connections, and real-time conversations in a universe built for you.
          </p>
          <a 
            href="/login"
            className="group relative px-8 py-4 bg-white text-slate-900 font-bold rounded-full text-lg hover:scale-105 transition duration-300 shadow-2xl shadow-white/20 inline-block"
          >
            Join the Network
            <div className="absolute inset-0 h-full w-full rounded-full group-hover:animate-ping opacity-20 bg-white"></div>
          </a>
        </header>

        {/* Features Grid */}
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700 hover:border-blue-500/50 transition duration-500 group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition">
                <Video size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Immersive Video Feed</h3>
              <p className="text-gray-400">
                Watch content come alive with our smart autoplay feeds that react to your scrolling.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700 hover:border-purple-500/50 transition duration-500 group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Connections</h3>
              <p className="text-gray-400">
                Chat instantly with friends using our lightning-fast Socket.io architecture.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-800/40 backdrop-blur-md border border-slate-700 hover:border-pink-500/50 transition duration-500 group">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 text-pink-400 group-hover:scale-110 transition">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Privacy</h3>
              <p className="text-gray-400">
                Connect securely. Our intelligent friend request system ensures you only chat with those you trust.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Developers</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700">
                <p className="text-gray-300 italic mb-4">"The autoplay feature is silky smooth, and the chat connects instantly. NovaConnect feels like the future of social feeds."</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500"></div>
                  <div>
                    <h4 className="font-bold">Alex Chen</h4>
                    <p className="text-xs text-gray-500">Full Stack Developer</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700">
                <p className="text-gray-300 italic mb-4">"Finally, a platform that balances beautiful UI with robust real-time functionality. The constellation background is a nice touch!"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-green-400 to-blue-500"></div>
                  <div>
                    <h4 className="font-bold">Sarah Miller</h4>
                    <p className="text-xs text-gray-500">UI/UX Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center text-gray-500 text-sm">
          <div className="flex justify-center gap-6 mb-4">
            <Globe size={20} className="hover:text-white cursor-pointer" />
            <MessageCircle size={20} className="hover:text-white cursor-pointer" />
            <Users size={20} className="hover:text-white cursor-pointer" />
          </div>
          <p>© 2025 NovaConnect. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default LandingPage;