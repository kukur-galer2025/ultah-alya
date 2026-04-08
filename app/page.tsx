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

// DI SINI TEMPAT HARDCODE FOTONYA!
// Pastikan file foto ada di dalam folder public/photos/ jaemin1.jpg sampai jaemin4.jpg
const polaroids = [
  { id: 1, src: "/photos/jaemin1.jpg", caption: "Sweet 21 ✨", rotate: -4, xOffset: -10, yOffset: -15 },
  { id: 2, src: "/photos/jaemin2.jpg", caption: "Happy Always 💖", rotate: 6, xOffset: 15, yOffset: 10 },
  { id: 3, src: "/photos/jaemin3.jpg", caption: "Best Girl! 🎂", rotate: -8, xOffset: -15, yOffset: 15 },
  { id: 4, src: "/photos/jaemin4.jpg", caption: "Keep Shining 🌟", rotate: 4, xOffset: 10, yOffset: -10 },
];

interface Star {
  id: number;
  width: number;
  height: number;
  left: string;
  top: string;
  duration: number;
  opacity: number;
}

interface Bread {
  id: number;
  emoji: string;
  left: string;
  top: string;
  duration: number;
  opacity: number;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [messageIndex, setMessageIndex] = useState(0);
  const [loadingLines, setLoadingLines] = useState<string[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [breads, setBreads] = useState<Bread[]>([]);
  const soundRef = useRef<Howl | null>(null);

  // Setup Stars aman untuk HP & Hydration Error
  useEffect(() => {
    const generatedStars = [...Array(25)].map((_, i) => ({
      id: i,
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setStars(generatedStars);

    // Setup Breads aman untuk HP
    const breadEmojis = ['🍞', '🥐', '🥖', '🍰', '🎂'];
    const generatedBreads = [...Array(15)].map((_, i) => ({
      id: i,
      emoji: breadEmojis[Math.floor(Math.random() * breadEmojis.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 4 + 2,
      opacity: Math.random() * 0.15 + 0.05,
    }));
    setBreads(generatedBreads);

    return () => {
      soundRef.current?.stop();
    };
  }, []);

  const fireRealisticConfetti = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 }, colors: ['#fbcfe8', '#fce7f3', '#e9d5ff', '#d8b4fe', '#ffffff'] };
    function fire(particleRatio: number, opts: object) {
      confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
    }
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const runLoadingSequence = () => {
    const steps = [
      "Menyusun kenangan indah...",
      "Mempersiapkan doa dan harapan...",
      "Menyiapkan sesuatu yang istimewa...",
      "Buat hari ultahmu, Al"
    ];
    let i = 0;
    setGameState('loading');
    const interval = setInterval(() => {
      if (i < steps.length) {
        setLoadingLines(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setGameState('typing'), 1800);
      }
    }, 1000);
  };

  const startExperience = () => {
    if (!soundRef.current) {
      // PERBAIKAN: fade: true dihapus agar tidak terjadi TypeError
      soundRef.current = new Howl({ src: ['/hbd-track.mp3'], loop: true, volume: 0.4 });
    }
    soundRef.current.play();
    runLoadingSequence();
  };

  const handleNextMessage = () => {
    confetti({ particleCount: 15, spread: 40, origin: { y: 0.7 }, colors: ['#fbcfe8', '#e9d5ff'] });
    if (messageIndex < messageSequence.length - 1) {
      setMessageIndex(prev => prev + 1);
    } else {
      setGameState('shatter');
      if (soundRef.current) soundRef.current.volume(0.8); 
      setTimeout(() => {
        setGameState('party');
        fireRealisticConfetti(); 
        setTimeout(fireRealisticConfetti, 1000);
      }, 1500);
    }
  };

  return (
    // Menggunakan min-h-[100dvh] sangat penting untuk HP
    <main className="min-h-[100dvh] w-full bg-[#11051b] text-white flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans cursor-default selection:bg-pink-500/30">
      
      {/* PREMIUM BACKGROUND: Radial Gradient + Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-[#11051b] to-[#11051b] z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none z-0 mix-blend-overlay" />

      {/* AMBIENT GLOWS */}
      <div className="pointer-events-none absolute top-0 right-0 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 z-0" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 z-0" />

      {/* BACKGROUND PARTICLES (Bintang) AMAN DARI HYDRATION ERROR */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ width: star.width, height: star.height, left: star.left, top: star.top }}
            animate={{ opacity: [0, star.opacity, 0] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* BACKGROUND PARTICLES (Roti-roti) */}
      <div className="absolute inset-0 z-0pointer-events-none">
        {breads.map((bread) => (
          <motion.div
            key={`bread-${bread.id}`}
            className="absolute"
            style={{ left: bread.left, top: bread.top, opacity: bread.opacity, fontSize: "1rem" }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: bread.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            {bread.emoji}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {/* SCENE 1: INTRO (Kalimat Manis) */}
        {gameState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            className="z-10 group flex flex-col items-center cursor-pointer p-6 md:p-12 text-center rounded-[2rem] hover:bg-white/[0.02] transition-colors duration-500"
            onClick={startExperience}
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="relative">
              <div className="absolute inset-0 bg-pink-400 blur-2xl opacity-30 transition-opacity duration-700" />
              <Gift className="w-20 h-20 md:w-32 md:h-32 text-pink-300 drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]" />
            </motion.div>
            <h1 className="mt-8 md:mt-10 text-base md:text-xl tracking-[0.2em] font-light text-pink-100 uppercase">Pintu Menuju Hari Ultahmu...</h1>
            <p className="mt-2 md:mt-3 text-pink-400/80 animate-pulse font-medium tracking-wide text-xs md:text-base">Ketuk layar untuk membuka</p>
          </motion.div>
        )}

        {/* SCENE 2: LOADING (Kalimat Puitis) */}
        {gameState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            className="z-10 w-full max-w-sm md:max-w-lg bg-white/5 border border-purple-300/10 p-8 md:p-14 rounded-[2rem] shadow-[0_0_40px_rgba(168,85,247,0.1)] backdrop-blur-md flex flex-col items-center justify-center min-h-[250px] md:min-h-[300px]"
          >
            <Stars className="w-8 h-8 md:w-10 md:h-10 text-pink-300 mb-6 md:mb-8 animate-pulse" />
            <div className="space-y-4 md:space-y-5 text-center px-2">
              {loadingLines.map((line, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-purple-100 text-sm md:text-lg font-medium tracking-wide"
                >
                  {line}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SCENE 3: TYPING SEQUENCE */}
        {gameState === 'typing' && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            className="z-10 flex flex-col items-center justify-center min-h-[300px] w-full px-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -15, scale: 0.95, filter: "blur(8px)" }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-center text-center w-full max-w-[95vw] md:max-w-3xl"
              >
                <div className="mb-6 md:mb-10 p-4 md:p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full border border-pink-500/20 backdrop-blur-md shadow-lg shadow-pink-500/5">
                  {messageSequence[messageIndex].icon}
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl LG:text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-purple-200 to-pink-200 leading-[1.3] md:leading-[1.15] tracking-tight px-4">
                  {messageSequence[messageIndex].text}
                </h2>
              </motion.div>
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={handleNextMessage}
              className="mt-12 md:mt-16 flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-all text-sm md:text-base tracking-wide"
            >
              <span>{messageIndex === messageSequence.length - 1 ? "Buka Kejutan" : "Lanjut"}</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 4: SHATTER FLASHBANG */}
        {gameState === 'shatter' && (
          <motion.div key="shatter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-[#fff5fa]">
            <motion.div animate={{ scale: [1, 80], opacity: [1, 0] }} transition={{ duration: 1.5, ease: "circIn" }} className="w-10 h-10 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_100px_rgba(255,255,255,1)]" />
          </motion.div>
        )}

        {/* SCENE 5: MAIN PARTY CARD (Sangat Mewah) */}
        {gameState === 'party' && (
          <motion.div
            key="party"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 20 }}
            className="z-10 flex flex-col items-center w-full max-w-[95vw] md:max-w-3xl"
          >
            {/* PERBAIKAN: Padding dikecilkan untuk HP p-6 */}
            <div className="bg-[#ffffff03] backdrop-blur-[30px] border border-white/10 p-6 sm:p-8 md:p-12 rounded-[2rem] w-full text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
              
              <div className="inline-block border border-purple-400/20 rounded-full px-4 py-1.5 md:px-6 md:py-2 mb-6 md:mb-8 bg-purple-500/10">
                <span className="text-pink-200 font-medium tracking-[0.1em] md:tracking-[0.2em] text-[9px] md:text-xs uppercase">9 April 2005 — 2026</span>
              </div>
              
              {/* PERBAIKAN: Ukuran font dikurangi untuk HP agar tidak kepotong */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-100 to-purple-400 mb-2 pb-2 drop-shadow-xl tracking-tight leading-none">
                Happy Birthday
              </h1>
              
              <h2 className="text-lg sm:text-xl md:text-3xl font-light text-pink-100/90 mb-8 md:mb-12 tracking-wide">
                Wahidah Alya Nur Hakimah
              </h2>
              
              <div className="space-y-4 md:space-y-6 text-purple-100/80 text-xs sm:text-sm md:text-lg font-light leading-relaxed text-center px-1 md:px-2">
                <p>
                  Selamat ulang tahun yang ke-21. Semoga di babak baru kehidupan ini, setiap langkahmu selalu diiringi kebahagiaan, kesehatan, dan keberkahan yang berlimpah.
                </p>
                <p className="font-normal text-pink-100">
                  Semangat terus kuliahnya, semoga dilancarkan acara seminarnya. Dan doa terbaik dariku, semoga kamu selalu menjadi anak yang nurut sama abah dan ummi.
                </p>
                <p>
                  Teruslah bersinar, kejar semua mimpimu, dan jadilah versi terbaik dari dirimu sendiri.
                </p>
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              onClick={() => { setGameState('gallery'); fireRealisticConfetti(); }}
              className="mt-8 md:mt-10 flex items-center gap-2 md:gap-3 bg-white/10 border border-white/20 backdrop-blur-lg text-white px-6 py-3 md:px-10 md:py-4 rounded-full font-medium shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:bg-white hover:text-[#0a0212] active:scale-95 transition-all duration-300 text-sm md:text-base"
            >
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
              <span>Buka Album Jaemin</span>
            </motion.button>
          </motion.div>
        )}

        {/* SCENE 6: DRAGGABLE POLAROIDS */}
        {gameState === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20 overflow-hidden flex items-center justify-center bg-[#0a0212]/95 backdrop-blur-xl"
          >
            <div className="absolute top-8 md:top-12 text-center w-full z-30 pointer-events-none px-4">
              <h3 className="text-xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white to-pink-200 drop-shadow-lg mb-1 md:mb-2">Kenangan Terindah... ✨</h3>
              <p className="text-purple-200/50 font-light tracking-widest text-[9px] md:text-xs uppercase">Geser foto ke mana saja</p>
            </div>

            {polaroids.map((photo, i) => (
              <motion.div
                key={photo.id}
                drag 
                // PERBAIKAN: Drag limit disesuaikan untuk HP
                dragConstraints={{ left: -80, right: 80, top: -120, bottom: 120 }}
                // touch-none WAJIB untuk HP
                className="absolute bg-[#fafafa] p-2 pb-10 md:p-3 md:pb-14 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing touch-none"
                style={{ zIndex: i }}
                whileDrag={{ scale: 1.05, zIndex: 50, rotate: 0, boxShadow: "0 30px 60px rgba(255,255,255,0.1)" }}
                initial={{ opacity: 0, y: -200, x: photo.xOffset, rotate: photo.rotate, scale: 0.8 }}
                animate={{ opacity: 1, y: photo.yOffset, x: photo.xOffset, rotate: photo.rotate, scale: 1 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* PERBAIKAN: Ukuran foto di-set lebih kecil w-[110px] di HP agar muat 4 foto dengan rapih */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} alt="Jaemin" className="w-[120px] h-[150px] sm:w-[160px] sm:h-[200px] md:w-[240px] md:h-[300px] object-cover pointer-events-none rounded-sm border border-gray-200" />
                <div className="absolute bottom-2 md:bottom-3 left-0 w-full text-center text-gray-600 font-medium font-sans text-[10px] md:text-sm pointer-events-none px-1 tracking-wide">
                  {photo.caption}
                </div>
              </motion.div>
            ))}

            <button
              onClick={() => setGameState('party')}
              className="absolute bottom-6 md:bottom-12 z-40 bg-white/5 backdrop-blur-md border border-white/10 text-white/80 font-light tracking-[0.2em] uppercase text-[9px] md:text-xs px-6 py-2.5 md:px-10 md:py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
            >
              Tutup Album
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}