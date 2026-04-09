'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';
import { Stars, Gift, Camera, ChevronRight, Sparkles, BookOpen, Users } from 'lucide-react';

type GameState = 'intro' | 'loading' | 'typing' | 'shatter' | 'party' | 'gallery';

const messageSequence = [
  { text: "Hai Wahidah Alya...", icon: <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-pink-300" /> },
  { text: "Lagi sibuk nggak?", icon: <Stars className="w-10 h-10 md:w-16 md:h-16 text-purple-300" /> },
  { text: "Coba liat tanggal hari ini...", icon: <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-pink-400" /> },
  { text: "Iya, 9 April 2026.", icon: <Stars className="w-10 h-10 md:w-16 md:h-16 text-purple-400" /> },
  { text: "Ada yang sedang dirayakan hari ini.", icon: <Sparkles className="w-10 h-10 md:w-16 md:h-16 text-pink-300" /> },
  { text: "Momen spesial untukmu yang ke-21.", icon: <Stars className="w-10 h-10 md:w-16 md:h-16 text-pink-400" /> },
  { text: "Semangat terus ya kuliahnya, semoga lancar seminarnya.", icon: <BookOpen className="w-10 h-10 md:w-16 md:h-16 text-purple-300" /> },
  { text: "Dan doa terbaik dariku, semoga kamu selalu menjadi kebanggaan keluarga.", icon: <Users className="w-10 h-10 md:w-16 md:h-16 text-pink-300" /> },
  { text: "Sudah siap untuk membuka hadiahmu?", icon: <Gift className="w-10 h-10 md:w-16 md:h-16 text-pink-400" /> }
];

const polaroids = [
  { id: 1, src: "/photos/jaemin1.jpg", caption: "Sweet 21 ✨", rotate: -4, xOffset: -10, yOffset: -15 },
  { id: 2, src: "/photos/jaemin2.jpg", caption: "Happy Always 💖", rotate: 6, xOffset: 15, yOffset: 10 },
  { id: 3, src: "/photos/jaemin3.jpg", caption: "Best Girl! 🎂", rotate: -8, xOffset: -15, yOffset: 15 },
  { id: 4, src: "/photos/jaemin4.jpg", caption: "Keep Shining 🌟", rotate: 4, xOffset: 10, yOffset: -10 },
];

interface Particle {
  id: number;
  content: string | null;
  width?: number;
  height?: number;
  left: string;
  top: string;
  duration: number;
  opacity: number;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [messageIndex, setMessageIndex] = useState(0);
  const [loadingLines, setLoadingLines] = useState<string[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const soundRef = useRef<Howl | null>(null);

  // Menggabungkan stars & breads menjadi satu state agar lebih ringan
  useEffect(() => {
    const breadEmojis = ['🍞', '🥐', '🥖', '🍰', '🎂'];
    const generatedParticles: Particle[] = [];
    
    // Generate 15 Stars
    for (let i = 0; i < 15; i++) {
      generatedParticles.push({
        id: i,
        content: null, // null berarti bintang putih
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }
    
    // Generate 8 Breads (Dibatasi agar tidak berat di HP)
    for (let i = 15; i < 23; i++) {
      generatedParticles.push({
        id: i,
        content: breadEmojis[Math.floor(Math.random() * breadEmojis.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: Math.random() * 4 + 3,
        opacity: Math.random() * 0.15 + 0.1,
      });
    }
    
    setParticles(generatedParticles);

    return () => {
      soundRef.current?.stop();
    };
  }, []);

  const fireRealisticConfetti = () => {
    // Jumlah confetti diturunkan jadi 100 agar HP tidak freeze
    const count = 100;
    const defaults = { origin: { y: 0.7 }, colors: ['#fbcfe8', '#fce7f3', '#e9d5ff', '#ffffff'], disableForReducedMotion: true };
    function fire(particleRatio: number, opts: object) {
      confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
    }
    fire(0.25, { spread: 26, startVelocity: 45 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  };

  const runLoadingSequence = () => {
    const steps = [
      "Menyusun kenangan indah...",
      "Mempersiapkan doa dan harapan...",
      "Menyiapkan sesuatu yang istimewa...",
      "Buat hari ultahmu, Al."
    ];
    let i = 0;
    setGameState('loading');
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadingLines(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setGameState('typing'), 1500);
      }
    }, 900);
  };

  const startExperience = () => {
    if (!soundRef.current) {
      soundRef.current = new Howl({ src: ['/hbd-track.mp3'], loop: true, volume: 0.4 });
    }
    soundRef.current.play();
    runLoadingSequence();
  };

  const handleNextMessage = () => {
    // Mini confetti saat ganti pesan
    confetti({ particleCount: 10, spread: 40, origin: { y: 0.7 }, colors: ['#fbcfe8', '#e9d5ff'] });
    if (messageIndex < messageSequence.length - 1) {
      setMessageIndex(prev => prev + 1);
    } else {
      setGameState('shatter');
      if (soundRef.current) soundRef.current.volume(0.8); 
      setTimeout(() => {
        setGameState('party');
        fireRealisticConfetti(); 
      }, 1000); 
    }
  };

  return (
    // PERBAIKAN UTAMA LAYOUT: Menggunakan 'fixed inset-0' dan 'overscroll-none'
    <main className="fixed inset-0 w-full h-full bg-[#11051b] text-white overflow-hidden font-sans select-none overscroll-none touch-none">
      
      {/* Background Gradient Sederhana (Sangat ringan untuk GPU) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-[#11051b] to-[#11051b] z-0 pointer-events-none" />

      {/* PARTIKEL LAYER (Satu Layer Saja) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => {
          if (!p.content) {
            // Render Star
            return (
              <motion.div
                key={`p-${p.id}`}
                className="absolute bg-white rounded-full transform-gpu"
                style={{ width: p.width, height: p.height, left: p.left, top: p.top, willChange: "opacity" }}
                animate={{ opacity: [0, p.opacity, 0] }}
                transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
              />
            );
          } else {
            // Render Bread
            return (
              <motion.div
                key={`p-${p.id}`}
                className="absolute transform-gpu"
                style={{ left: p.left, top: p.top, opacity: p.opacity, fontSize: "1.2rem", willChange: "transform" }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: p.duration, repeat: Infinity, ease: "linear" }}
              >
                {p.content}
              </motion.div>
            );
          }
        })}
      </div>

      {/* CONTAINER KONTEN (Ditengahkan di dalam layar fixed) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-8 z-10 pointer-events-auto">
        <AnimatePresence mode="wait">
          
          {gameState === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center cursor-pointer p-6 text-center rounded-[2rem] active:scale-95 transition-transform"
              onClick={startExperience}
            >
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="relative transform-gpu">
                <Gift className="w-20 h-20 md:w-32 md:h-32 text-pink-300 drop-shadow-md" />
              </motion.div>
              <h1 className="mt-8 text-base md:text-xl tracking-[0.2em] font-medium text-pink-100 uppercase">Pintu Menuju Hari Ultahmu...</h1>
              <p className="mt-3 text-pink-400 animate-pulse font-medium tracking-wide text-sm md:text-base">Ketuk layar untuk membuka</p>
            </motion.div>
          )}

          {gameState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              // BACKDROP BLUR DIHAPUS -> Ganti background solid 10% opacity
              className="w-full max-w-[90vw] md:max-w-md bg-[#25103a] border border-white/10 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center min-h-[250px]"
            >
              <Stars className="w-10 h-10 text-pink-300 mb-6 animate-pulse transform-gpu" />
              <div className="space-y-4 text-center px-2">
                {loadingLines.map((line, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-purple-100 text-sm md:text-base font-medium tracking-wide"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'typing' && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center min-h-[300px] w-full"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center text-center w-full max-w-[95vw] md:max-w-2xl transform-gpu"
                >
                  <div className="mb-8 p-4 md:p-6 bg-[#25103a] rounded-full border border-pink-500/20 shadow-lg">
                    {messageSequence[messageIndex].icon}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-pink-50 leading-[1.3] tracking-tight px-4">
                    {messageSequence[messageIndex].text}
                  </h2>
                </motion.div>
              </AnimatePresence>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={handleNextMessage}
                className="mt-12 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold shadow-lg active:scale-95 transition-transform text-sm md:text-base"
              >
                <span>{messageIndex === messageSequence.length - 1 ? "Buka Kejutan" : "Lanjut"}</span>
                <ChevronRight className="w-5 h-5 text-white" />
              </motion.button>
            </motion.div>
          )}

          {/* SHATTER MENGGUNAKAN FIXED INSET-0 AGAR FULL SCREEN */}
          {gameState === 'shatter' && (
            <motion.div key="shatter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#fff5fa] flex items-center justify-center">
              <motion.div animate={{ scale: [1, 50], opacity: [1, 0] }} transition={{ duration: 1.2, ease: "circIn" }} className="w-10 h-10 bg-white rounded-full transform-gpu" />
            </motion.div>
          )}

          {gameState === 'party' && (
            <motion.div
              key="party"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center w-full max-w-[95vw] md:max-w-2xl"
            >
              {/* BACKDROP BLUR DIHAPUS -> Ganti dengan background padat */}
              <div className="bg-[#1e0a2d] border border-pink-500/20 p-6 md:p-10 rounded-[2rem] w-full text-center shadow-xl relative overflow-hidden">
                <div className="inline-block border border-purple-400/20 rounded-full px-4 py-1.5 mb-6 bg-purple-500/20">
                  <span className="text-pink-200 font-medium tracking-widest text-[10px] md:text-xs uppercase">9 April 2005 — 2026</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 pb-2 leading-none">
                  Happy Birthday
                </h1>
                
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-pink-300 mb-8 tracking-wide">
                  Wahidah Alya Nur Hakimah
                </h2>
                
                <div className="space-y-4 text-purple-100/90 text-sm md:text-base font-light leading-relaxed text-center px-1">
                  <p>
                    Selamat ulang tahun yang ke-21. Semoga di babak baru kehidupan ini, setiap langkahmu selalu diiringi kebahagiaan, kesehatan, dan keberkahan yang berlimpah.
                  </p>
                  <p className="font-medium text-pink-200">
                    Semangat terus kuliahnya, semoga dilancarkan acara seminarnya. Dan doa terbaik dariku, semoga kamu selalu menjadi anak yang nurut sama abah dan ummi.
                  </p>
                  <p>
                    Teruslah bersinar, kejar semua mimpimu, dan jadilah versi terbaik dari dirimu sendiri.
                  </p>
                </div>
              </div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => { setGameState('gallery'); fireRealisticConfetti(); }}
                className="mt-8 flex items-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-full font-bold shadow-lg active:scale-95 transition-transform text-sm md:text-base"
              >
                <Camera className="w-5 h-5" />
                <span>Buka Album Jaemin</span>
              </motion.button>
            </motion.div>
          )}

          {/* GALLERY MENGGUNAKAN FIXED INSET-0 */}
          {gameState === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 overflow-hidden flex flex-col items-center bg-[#0d0216]"
            >
              <div className="mt-8 md:mt-12 text-center z-30 pointer-events-none px-4">
                <h3 className="text-2xl md:text-3xl font-semibold text-pink-100 mb-1">Pesan dari Jaemin</h3>
                <p className="text-purple-300/80 font-medium tracking-widest text-[10px] md:text-xs uppercase">Geser foto pakai jari</p>
              </div>

              {/* Area khusus untuk geser foto agar tidak keluar layar jauh */}
              <div className="relative flex-1 w-full flex items-center justify-center">
                {polaroids.map((photo, i) => (
                  <motion.div
                    key={photo.id}
                    drag 
                    // Limit drag diperketat agar aman di layar HP
                    dragConstraints={{ left: -50, right: 50, top: -100, bottom: 100 }}
                    style={{ zIndex: i, touchAction: "none", willChange: "transform" }}
                    className="absolute bg-white p-2 pb-10 md:p-3 md:pb-12 rounded-md shadow-2xl cursor-grab active:cursor-grabbing transform-gpu"
                    whileDrag={{ scale: 1.05, zIndex: 50 }}
                    initial={{ opacity: 0, y: -200, x: photo.xOffset, rotate: photo.rotate, scale: 0.8 }}
                    animate={{ opacity: 1, y: photo.yOffset, x: photo.xOffset, rotate: photo.rotate, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.src} alt="Jaemin" className="w-[120px] h-[150px] sm:w-[150px] sm:h-[190px] md:w-[220px] md:h-[280px] object-cover pointer-events-none rounded-sm border border-gray-200" />
                    <div className="absolute bottom-2 md:bottom-3 left-0 w-full text-center text-gray-800 font-medium font-sans text-[10px] md:text-sm pointer-events-none px-1 tracking-wide">
                      {photo.caption}
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setGameState('party')}
                className="mb-8 z-40 bg-[#25103a] border border-white/20 text-pink-100 font-medium tracking-wider text-[10px] md:text-xs px-8 py-3 rounded-full active:bg-[#391a59] transition-colors"
              >
                Tutup Album
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}