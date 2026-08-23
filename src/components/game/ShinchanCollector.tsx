'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Recycle, Heart } from 'lucide-react';
import { useEco } from '../../context/EcoContext';

export const ShinchanCollector: React.FC = () => {
  const { addToast } = useEco();

  // Animation Sequence Phases:
  // 1. 'slideIn': Shinchan & Shiro stroll together from left to center waste sack
  // 2. 'bendDown': Shinchan bends down to grab the sack while Shiro waits patiently
  // 3. 'heaveShoulder': Shinchan hoists heavy sack onto shoulder
  // 4. 'carrySlideOut': Shinchan runs right to Nanako Didi & Eco Hub; Shiro gets left behind & turns back left
  // 5. 'depositSack': Shinchan stops right in front of Nanako Didi & tosses sack into Eco Hub
  // 6. 'hidden': Pause before next loop restarts from left
  const [phase, setPhase] = useState<
    'slideIn' | 'bendDown' | 'heaveShoulder' | 'carrySlideOut' | 'depositSack' | 'hidden'
  >('slideIn');

  // Shiro-specific state during carrySlideOut:
  // 'confused' (first 1.2s of Shinchan leaving) -> 'runningLeft' (runs back to left)
  const [shiroSubState, setShiroSubState] = useState<'normal' | 'confused' | 'runningLeft'>('normal');

  // Speech bubble states
  const [showShinchanSpeech, setShowShinchanSpeech] = useState(false);
  const [shinchanSpeechText, setShinchanSpeechText] = useState('Indore Campus Cleanliness Patrol! ♻️');
  const [shinchanClickCount, setShinchanClickCount] = useState(0);

  const [showShiroSpeech, setShowShiroSpeech] = useState(false);
  const [shiroSpeechText, setShiroSpeechText] = useState('Bow-wow! 🐾');
  const [shiroClickCount, setShiroClickCount] = useState(0);

  const [showNanakoSpeech, setShowNanakoSpeech] = useState(false);
  const [nanakoSpeechText, setNanakoSpeechText] = useState("Oh Shinchan! You're doing good work! ❤️");
  const [nanakoClickCount, setNanakoClickCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let shiroTimer: NodeJS.Timeout;
    let nanakoTimer: NodeJS.Timeout;

    if (phase === 'slideIn') {
      setShiroSubState('normal');
      setShowNanakoSpeech(false);
      // Smooth stroll from left to center (takes 6.5s)
      timer = setTimeout(() => {
        setPhase('bendDown');
      }, 6500);
    } else if (phase === 'bendDown') {
      // Bends down to grab handles (takes 1.0s)
      timer = setTimeout(() => {
        setPhase('heaveShoulder');
        setShowShinchanSpeech(true);
        setShinchanSpeechText('Heaving onto shoulder! (+10 Pts) 💥');
      }, 1000);
    } else if (phase === 'heaveShoulder') {
      // Hoists sack onto shoulder (takes 1.2s)
      timer = setTimeout(() => {
        setShowShinchanSpeech(false);
        setPhase('carrySlideOut');
      }, 1200);
    } else if (phase === 'carrySlideOut') {
      // Shiro realizes Shinchan is running away without him!
      setShiroSubState('confused');
      setShowShiroSpeech(true);
      setShiroSpeechText('Bow-wow?! Shinchan wait for me! 🐶❓');

      // After 1.3s of confusion, Shiro turns around and trots back left
      shiroTimer = setTimeout(() => {
        setShiroSubState('runningLeft');
        setShiroSpeechText('Shinchan forgot me again... 🥺🐾');
        setTimeout(() => setShowShiroSpeech(false), 2000);
      }, 1300);

      // As Shinchan reaches Nanako Didi standing at the corner (~3.5s in)
      nanakoTimer = setTimeout(() => {
        setShowNanakoSpeech(true);
        setNanakoSpeechText("Oh Shinchan! You're doing good work! ❤️");
        setShowShinchanSpeech(true);
        setShinchanSpeechText('Nanako Didi! I did it for you~ 😍💖');
      }, 3500);

      // Shinchan slides to right corner right in front of Nanako Didi (takes 6.5s)
      timer = setTimeout(() => {
        setPhase('depositSack');
      }, 6500);
    } else if (phase === 'depositSack') {
      // Deposits sack into bin right in front of Nanako Didi (takes 2.0s)
      setShowNanakoSpeech(true);
      setNanakoSpeechText('So proud of you, Shinchan! ✨♻️');
      setShowShinchanSpeech(true);
      setShinchanSpeechText('Recycled at Eco Hub! Hehe~ 🍑✨');

      timer = setTimeout(() => {
        setShowShinchanSpeech(false);
        setShowShiroSpeech(false);
        setShowNanakoSpeech(false);
        setPhase('hidden');
      }, 2000);
    } else if (phase === 'hidden') {
      setShiroSubState('normal');
      setShowNanakoSpeech(false);
      // Waits 3.5s before looping again from left
      timer = setTimeout(() => {
        setPhase('slideIn');
      }, 3500);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(shiroTimer);
      clearTimeout(nanakoTimer);
    };
  }, [phase]);

  const handleShinchanClick = () => {
    setShinchanClickCount((prev) => prev + 1);
    setShowShinchanSpeech(true);
    const quotes = [
      'Nanako Didi is watching, I must clean Indore super fast! 😍✨',
      'Ooh! Carrying heavy trash for Indore Campus is fun~ 🍑✨',
      'Action Kamen Eco-Power Activated! ⚡',
      'Squid Game Guard Shinchan on Duty! ⭕',
      'Oops! Did I leave Shiro behind again? Hehe~ 🐕',
    ];
    setShinchanSpeechText(quotes[shinchanClickCount % quotes.length]);
    addToast('🦹 Shinchan cleaned a campus waste spot! +10 Eco Points.', 'success');
    setTimeout(() => setShowShinchanSpeech(false), 3000);
  };

  const handleShiroClick = () => {
    setShiroClickCount((prev) => prev + 1);
    setShowShiroSpeech(true);
    const quotes = [
      'Bow-wow! (Shiro: I found discarded plastic!) 🐾♻️',
      'Woof woof! Shinchan always forgets me when he sees Nanako Didi! 🥺',
      'Shiro rolls into a fluffy cotton ball! ⚪✨',
      'Bow! Clean campus guard dog on duty! 🐶⭐',
    ];
    setShiroSpeechText(quotes[shiroClickCount % quotes.length]);
    addToast('🐶 Shiro fetched recyclable waste! +5 Eco Points.', 'success');
    setTimeout(() => setShowShiroSpeech(false), 3000);
  };

  const handleNanakoClick = () => {
    setNanakoClickCount((prev) => prev + 1);
    setShowNanakoSpeech(true);
    const quotes = [
      "Oh Shinchan! You're doing good work! ❤️",
      'Thank you for keeping our Indore campus so clean and green! 🌸✨',
      'Shinchan is our smartest little Eco-Champion! 💖',
      'Every bit of recycled waste helps our environment! ♻️🌿',
    ];
    setNanakoSpeechText(quotes[nanakoClickCount % quotes.length]);
    addToast('🌸 Nanako Didi cheered for the Eco Patrol! +15 Eco Points.', 'success');
    setTimeout(() => setShowNanakoSpeech(false), 3000);
  };

  // Whether the garbage bag in the center floor is still on the ground
  const isBagOnFloor = phase === 'slideIn' || phase === 'bendDown';
  // Whether Shinchan is carrying the sack on his shoulder
  const isCarryingOnShoulder = phase === 'heaveShoulder' || phase === 'carrySlideOut';

  return (
    <div className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-40 overflow-hidden select-none">
      {/* Floor baseline guide */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#03E5B7]/30 to-transparent border-t border-[#03E5B7]/20" />

      {/* Center Floor Waste Material Sack (Visible before Shinchan hoists it) */}
      <AnimatePresence>
        {isBagOnFloor && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.2, opacity: 0, y: -15 }}
            transition={{ type: 'spring', damping: 18 }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#FF007A]/20 text-[#FF007A] border border-[#FF007A]/40 mb-1 animate-pulse tracking-wider">
              WASTE MATERIAL
            </span>
            {/* Waste Material Sack SVG on Floor */}
            <svg width="48" height="46" viewBox="0 0 50 48" fill="none">
              <path
                d="M12 40C8 38 6 30 9 20C12 10 20 8 25 8C30 8 38 10 41 20C44 30 42 38 38 40C34 42 16 42 12 40Z"
                fill="#1E293B"
                stroke="#03E5B7"
                strokeWidth="2.5"
              />
              <path d="M22 8L20 2M28 8L30 2" stroke="#FF007A" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="25" cy="8" r="3.5" fill="#FF007A" />
              {/* Recyclable Logo */}
              <circle cx="25" cy="24" r="8" fill="#03E5B7" fillOpacity="0.15" stroke="#03E5B7" strokeWidth="1.5" strokeDasharray="3 2" />
              <path d="M25 19L27.5 23H22.5L25 19ZM21 26L23.5 29H18.5L21 26ZM29 26L31.5 29H26.5L29 26Z" fill="#03E5B7" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* RIGHT CORNER: ECO HUB RECYCLING BOX (LEFT) & NANAKO DIDI AT THE END (RIGHT) */}
      {/* ============================================================ */}
      <div className="absolute bottom-1 right-2 sm:right-4 flex items-end gap-2.5 pointer-events-auto z-35">
        {/* 1. Eco Hub Recycling Box (Where Shinchan deposits the waste) */}
        <div className="p-2.5 mb-2 rounded-2xl bg-[#0D0F17] border border-[#03E5B7]/60 flex items-center gap-2 shadow-[0_0_20px_rgba(3,229,183,0.25)]">
          <Recycle className="w-5 h-5 text-[#03E5B7] animate-spin" style={{ animationDuration: '6s' }} />
          <div className="font-mono text-[10px] text-[#03E5B7] font-bold hidden sm:block">
            ECO HUB RECYCLING
          </div>
        </div>

        {/* 2. Nanako Didi Standing at the FAR RIGHT END of the Box */}
        <div className="relative flex flex-col items-center cursor-pointer" onClick={handleNanakoClick}>
          {/* Nanako Didi Speech Bubble */}
          <AnimatePresence>
            {showNanakoSpeech && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: -8 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-12 -left-28 bg-[#0D0F17]/95 border-2 border-[#EC4899] text-[#FDF2F8] text-[11px] font-bold font-mono px-3.5 py-1.5 rounded-2xl shadow-[0_0_25px_rgba(236,72,153,0.6)] whitespace-nowrap z-50 flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 text-[#EC4899] fill-[#EC4899] animate-pulse" />
                <span>{nanakoSpeechText}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nanako Didi SVG Artwork (TALL & BEAUTIFULLY PROPORTIONED AT THE END OF BOX) */}
          <motion.div
            animate={{
              y: [0, -3, 0, -3, 0],
              rotate: [0, 0.8, 0, -0.8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3.5,
              ease: 'easeInOut',
            }}
            className="relative filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)] hover:brightness-110 transition-all"
          >
            {/* Height 168px - tall adult standing at the end of the recycling box */}
            <svg width="88" height="168" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* 1. Hair Background Layer (Dark Forest Green Long Hair) */}
              <path
                d="M48 16 C30 16 20 30 20 62 C20 100 28 125 30 148 C38 132 36 102 40 82 C44 70 50 64 52 58 C58 64 64 82 66 104 C68 128 72 138 76 128 C79 104 82 62 78 38 C74 16 62 16 48 16 Z"
                fill="#1B3828"
                stroke="#0E2015"
                strokeWidth="2.5"
              />

              {/* 2. Legs & Shoes */}
              {/* Left Leg */}
              <path d="M42 118 L38 180 C38 184 36 188 33 190" stroke="#FCE7D6" strokeWidth="6.5" strokeLinecap="round" />
              <ellipse cx="32" cy="192" rx="8" ry="4" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1.5" />

              {/* Right Leg */}
              <path d="M54 118 L56 180 C56 184 58 188 61 190" stroke="#FCE7D6" strokeWidth="6.5" strokeLinecap="round" />
              <ellipse cx="62" cy="192" rx="8" ry="4" fill="#60A5FA" stroke="#1E3A8A" strokeWidth="1.5" />

              {/* 3. Cream / Ivory Mini Skirt */}
              <path
                d="M36 78 L30 120 C42 122 58 122 70 120 L64 78 Z"
                fill="#FEF9C3"
                stroke="#1A1A24"
                strokeWidth="2.8"
              />
              {/* Skirt pleat subtle crease */}
              <path d="M50 80 L50 121" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* 4. Pink V-Neck Sweater Torso */}
              <path
                d="M37 46 C32 50 33 64 36 79 C46 81 56 81 65 79 C67 64 68 50 63 46 C58 48 44 48 37 46 Z"
                fill="#F4A6B8"
                stroke="#1A1A24"
                strokeWidth="2.8"
              />

              {/* V-Neck Collar */}
              <path d="M44 47 L49 55 L54 47" fill="#FCE7D6" stroke="#1A1A24" strokeWidth="2" />

              {/* 5. Left Arm (Gently resting at hip) */}
              <path d="M37 48 L28 72 L31 88" stroke="#F4A6B8" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="32" cy="90" r="3.5" fill="#FCE7D6" stroke="#1A1A24" strokeWidth="1.5" />

              {/* 6. Right Arm (Raised Cheering / Waving Pose towards Shinchan) */}
              <path d="M63 48 L73 70 L82 94" stroke="#F4A6B8" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Right Hand Waving */}
              <path d="M82 94 L87 101 M83 96 L90 99" stroke="#FCE7D6" strokeWidth="3" strokeLinecap="round" />
              <circle cx="85" cy="97" r="3.6" fill="#FCE7D6" stroke="#1A1A24" strokeWidth="1.4" />

              {/* 7. Slender Neck & Head */}
              <rect x="46" y="38" width="7" height="10" fill="#FCE7D6" stroke="#1A1A24" strokeWidth="1.5" />
              {/* Face Shape */}
              <path
                d="M37 24 C35 36 37 48 49 48 C61 48 63 36 61 24 C57 21 41 21 37 24 Z"
                fill="#FCE7D6"
                stroke="#1A1A24"
                strokeWidth="2.2"
              />

              {/* 8. Forehead Bangs Fringe */}
              <path
                d="M37 24 C44 29 55 29 61 24 C60 20 56 16 49 16 C42 16 38 20 37 24 Z"
                fill="#1B3828"
              />
              <path d="M41 21 L41 28 M45 21 L45 30 M49 21 L49 30 M53 21 L53 30 M57 21 L57 28" stroke="#1B3828" strokeWidth="1.8" strokeLinecap="round" />

              {/* 9. Beautiful Eyes & Smile */}
              {/* Left Eyebrow & Eye */}
              <path d="M40 27 C42 24 45 25 46 27" fill="none" stroke="#1A1A24" strokeWidth="1.6" strokeLinecap="round" />
              <ellipse cx="43" cy="31" rx="2.2" ry="3.2" fill="#1A1A24" />
              <circle cx="43.6" cy="30" r="0.9" fill="#FFFFFF" />
              {/* Left Eyelash */}
              <path d="M40.5 29.5 L39 29" stroke="#1A1A24" strokeWidth="1.6" strokeLinecap="round" />

              {/* Right Eyebrow & Eye */}
              <path d="M52 27 C53 25 56 24 58 27" fill="none" stroke="#1A1A24" strokeWidth="1.6" strokeLinecap="round" />
              <ellipse cx="55" cy="31" rx="2.2" ry="3.2" fill="#1A1A24" />
              <circle cx="55.6" cy="30" r="0.9" fill="#FFFFFF" />
              {/* Right Eyelash */}
              <path d="M57.5 29.5 L59 29" stroke="#1A1A24" strokeWidth="1.6" strokeLinecap="round" />

              {/* Rosy Cheeks */}
              <ellipse cx="39" cy="36" rx="2.8" ry="1.5" fill="#F43F5E" fillOpacity="0.5" />
              <ellipse cx="59" cy="36" rx="2.8" ry="1.5" fill="#F43F5E" fillOpacity="0.5" />

              {/* Gentle Smile */}
              <path d="M46 38 C48 40 50 40 52 38" fill="none" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SHIRO (DOG) MOVING CONTAINER */}
      {/* ============================================================ */}
      <motion.div
        key={phase === 'hidden' ? 'shiro-hidden' : 'shiro-active'}
        className="absolute bottom-2 pointer-events-auto cursor-pointer z-30"
        initial={{ left: phase === 'hidden' ? '-220px' : '-220px' }}
        animate={{
          left:
            phase === 'slideIn'
              ? 'calc(50% - 135px)'
              : phase === 'bendDown' || phase === 'heaveShoulder'
              ? 'calc(50% - 135px)'
              : phase === 'carrySlideOut'
              ? shiroSubState === 'runningLeft'
                ? '-160px'
                : 'calc(50% - 135px)'
              : phase === 'depositSack' || phase === 'hidden'
              ? '-160px'
              : '-220px',
        }}
        transition={{
          duration:
            phase === 'slideIn'
              ? 6.5
              : phase === 'carrySlideOut'
              ? shiroSubState === 'runningLeft'
                ? 4.5
                : 0.1
              : 0.2,
          ease: 'linear',
        }}
        onClick={handleShiroClick}
      >
        {/* Shiro Speech Bubble */}
        <AnimatePresence>
          {showShiroSpeech && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: -8 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-10 -left-6 bg-[#0D0F17]/95 border border-[#03E5B7] text-[#03E5B7] text-[10px] font-bold font-mono px-2.5 py-1 rounded-xl shadow-[0_0_15px_rgba(3,229,183,0.4)] whitespace-nowrap z-50 flex items-center gap-1.5"
            >
              <span>{shiroSpeechText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shiro Confusion Question Mark Symbol */}
        {shiroSubState === 'confused' && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: 1, y: -6 }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="absolute -top-6 right-2 text-yellow-300 font-black text-xs bg-black/70 px-1.5 py-0.5 rounded-full border border-yellow-400/60 shadow-[0_0_10px_rgba(234,179,8,0.5)] flex items-center gap-0.5"
          >
            <span>❓</span>
          </motion.div>
        )}

        {/* Shiro Body & Posture Container (Flips horizontally when running left) */}
        <motion.div
          animate={{
            scaleX: shiroSubState === 'runningLeft' ? -1 : 1,
            y:
              phase === 'slideIn' || (phase === 'carrySlideOut' && shiroSubState === 'runningLeft')
                ? [0, -3, 0, -3, 0] // Happy doggy trot bobbing
                : shiroSubState === 'confused'
                ? [0, -2, 0]
                : 0,
            rotate:
              phase === 'slideIn' || (phase === 'carrySlideOut' && shiroSubState === 'runningLeft')
                ? [-2, 2, -2, 2, -2]
                : shiroSubState === 'confused'
                ? [-6, 6, -6]
                : 0,
          }}
          transition={{
            scaleX: { duration: 0.25 },
            y: {
              repeat:
                phase === 'slideIn' || (phase === 'carrySlideOut' && shiroSubState === 'runningLeft')
                  ? Infinity
                  : 0,
              duration: 0.45,
              ease: 'easeInOut',
            },
            rotate: {
              repeat:
                phase === 'slideIn' || (phase === 'carrySlideOut' && shiroSubState === 'runningLeft')
                  ? Infinity
                  : 0,
              duration: 0.45,
              ease: 'easeInOut',
            },
          }}
          className="relative w-20 h-20 flex flex-col items-center justify-end"
        >
          {/* SVG ARTWORK: AUTHENTIC SHIRO (SHINCHAN'S WHITE DOG) */}
          <svg width="78" height="72" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {/* 1. Wagging Curled Tail */}
            <motion.path
              animate={{
                rotate:
                  phase === 'slideIn' || (phase === 'carrySlideOut' && shiroSubState === 'runningLeft')
                    ? [-12, 12, -12]
                    : [0, 6, 0],
              }}
              transition={{ repeat: Infinity, duration: 0.35 }}
              style={{ transformOrigin: '32px 58px' }}
              d="M30 60 C20 52 18 40 25 44 C28 46 29 55 33 60"
              fill="#FFFFFF"
              stroke="#1A1A24"
              strokeWidth="2.8"
              strokeLinecap="round"
            />

            {/* 2. Fluffy Dog Body */}
            <path
              d="M32 64 C28 54 36 46 48 46 C60 46 68 53 66 64 C64 72 34 72 32 64 Z"
              fill="#FFFFFF"
              stroke="#1A1A24"
              strokeWidth="2.8"
            />

            {/* 3. Little White Paws / Running Legs */}
            <path d="M35 64 L33 75 C33 77 38 77 38 75 L39 65" fill="#FFFFFF" stroke="#1A1A24" strokeWidth="2.4" />
            <path d="M43 65 L43 75 C43 77 48 77 48 75 L48 65" fill="#FFFFFF" stroke="#1A1A24" strokeWidth="2.4" />
            <path d="M53 65 L54 75 C54 77 59 77 59 75 L58 65" fill="#FFFFFF" stroke="#1A1A24" strokeWidth="2.4" />
            <path d="M62 64 L64 74 C64 76 69 76 69 74 L66 64" fill="#FFFFFF" stroke="#1A1A24" strokeWidth="2.4" />

            {/* 4. Vibrant Red Collar & Yellow Tag */}
            <path
              d="M44 46 C48 48 56 48 62 46"
              stroke="#EF4444"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="53" cy="49" r="2.2" fill="#FBBF24" stroke="#1A1A24" strokeWidth="1" />

            {/* 5. Shiro's Floppy Ears */}
            <motion.path
              animate={{
                rotate:
                  phase === 'slideIn' || (phase === 'carrySlideOut' && shiroSubState === 'runningLeft')
                    ? [-8, 6, -8]
                    : 0,
              }}
              transition={{ repeat: Infinity, duration: 0.45 }}
              style={{ transformOrigin: '28px 24px' }}
              d="M27 24 C14 20 8 26 11 33 C13 37 22 35 27 28"
              fill="#FFFFFF"
              stroke="#1A1A24"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            <motion.path
              animate={{
                rotate:
                  phase === 'slideIn' || (phase === 'carrySlideOut' && shiroSubState === 'runningLeft')
                    ? [8, -6, 8]
                    : shiroSubState === 'confused'
                    ? [12, 18, 12]
                    : 0,
              }}
              transition={{ repeat: Infinity, duration: 0.45 }}
              style={{ transformOrigin: '70px 18px' }}
              d="M68 18 C78 9 88 12 87 18 C86 24 76 26 69 22"
              fill="#FFFFFF"
              stroke="#1A1A24"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />

            {/* 6. Shiro's Iconic Cotton-Ball Shaped Head */}
            <path
              d="M24 28 C22 14 36 8 53 8 C70 8 82 17 80 28 C78 39 65 46 48 46 C33 46 25 39 24 28 Z"
              fill="#FFFFFF"
              stroke="#1A1A24"
              strokeWidth="2.8"
            />

            {/* 7. Cute Facial Features */}
            <path d="M36 21 C39 19 44 20 46 22" fill="none" stroke="#1A1A24" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M58 16 C64 12 70 17 68 23" fill="none" stroke="#1A1A24" strokeWidth="2.5" strokeLinecap="round" />

            {/* Beady Black Eyes */}
            <ellipse cx="42" cy="28" rx="2.5" ry="3.2" fill="#1A1A24" />
            <circle cx="43" cy="27" r="0.9" fill="#FFFFFF" />
            <ellipse cx="64" cy="27" rx="2.5" ry="3.2" fill="#1A1A24" />
            <circle cx="65" cy="26" r="0.9" fill="#FFFFFF" />

            {/* Cheek Blushes */}
            <ellipse cx="32" cy="33" rx="3.2" ry="1.6" fill="#F43F5E" fillOpacity="0.45" />
            <ellipse cx="71" cy="32" rx="3.2" ry="1.6" fill="#F43F5E" fillOpacity="0.45" />

            {/* Shiro Open Cute Mouth & Pink Tongue */}
            <path d="M52 33 C56 33 60 36 58 38 C55 40 51 38 52 33 Z" fill="#1A1A24" />
            <ellipse cx="55" cy="36" rx="2" ry="1.2" fill="#F43F5E" />

            {/* Sweat Drop (when left behind) */}
            {shiroSubState === 'confused' && (
              <path
                d="M74 10 C74 10 78 14 78 17 C78 19 76 21 74 21 C72 21 70 19 70 17 C70 14 74 10 74 10 Z"
                fill="#38BDF8"
                stroke="#0284C7"
                strokeWidth="1"
              />
            )}
          </svg>
        </motion.div>
      </motion.div>

      {/* ============================================================ */}
      {/* SHINCHAN MOVING CONTAINER (Stops directly in front of Nanako Didi) */}
      {/* ============================================================ */}
      <motion.div
        key={phase === 'hidden' ? 'hidden-key' : 'active-key'}
        className="absolute bottom-2 pointer-events-auto cursor-pointer z-35"
        initial={{ left: phase === 'hidden' ? '-140px' : '-140px' }}
        animate={{
          left:
            phase === 'slideIn'
              ? 'calc(50% - 62px)'
              : phase === 'bendDown' || phase === 'heaveShoulder'
              ? 'calc(50% - 62px)'
              : phase === 'carrySlideOut'
              ? 'calc(100% - 310px)'
              : phase === 'depositSack'
              ? 'calc(100% - 285px)'
              : 'calc(100% + 140px)',
        }}
        transition={{
          duration:
            phase === 'slideIn'
              ? 6.5
              : phase === 'carrySlideOut'
              ? 6.5
              : phase === 'depositSack'
              ? 1.5
              : 0.1,
          ease: 'linear',
        }}
        onClick={handleShinchanClick}
      >
        {/* Speech Bubble */}
        <AnimatePresence>
          {showShinchanSpeech && (
            <motion.div
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: -10 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-12 -left-12 bg-[#0D0F17]/95 border-2 border-[#FF007A] text-white text-[11px] font-bold font-mono px-3.5 py-1.5 rounded-2xl shadow-[0_0_20px_rgba(255,0,122,0.5)] whitespace-nowrap z-50 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-[#FFC700] animate-bounce" />
              <span>{shinchanSpeechText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Posture Container - Subtle smooth stride bobbing */}
        <motion.div
          animate={{
            y:
              phase === 'slideIn' || phase === 'carrySlideOut'
                ? [0, -2, 0, -2, 0]
                : phase === 'bendDown'
                ? [0, 8]
                : phase === 'heaveShoulder'
                ? [8, -3, 0]
                : 0,
            rotate:
              phase === 'slideIn'
                ? [-1, 1, -1, 1, -1]
                : phase === 'carrySlideOut'
                ? [1, 2.5, 1, 2.5, 1] // Forward lean with weight on shoulder
                : phase === 'bendDown'
                ? [0, 10]
                : 0,
          }}
          transition={{
            repeat: phase === 'slideIn' || phase === 'carrySlideOut' ? Infinity : 0,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="relative w-28 h-28 flex flex-col items-center"
        >
          {/* SVG ARTWORK: AUTHENTIC SHINCHAN FACE IN SQUID GAME JUMPSUIT */}
          <svg width="105" height="105" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 1. HEAVY WASTE MATERIAL SACK ON SHOULDER */}
            {isCarryingOnShoulder && (
              <g className="filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
                <path
                  d="M62 48 C55 30 65 14 85 15 C102 16 112 30 108 50 C104 68 85 75 70 70 C60 66 58 56 62 48 Z"
                  fill="#1E293B"
                  stroke="#03E5B7"
                  strokeWidth="2.5"
                />
                <path d="M60 48 L52 42 M60 52 L54 58" stroke="#FF007A" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="60" cy="50" r="3.5" fill="#FF007A" />
                <circle cx="88" cy="42" r="7" fill="#03E5B7" fillOpacity="0.2" stroke="#03E5B7" strokeWidth="1.2" />
                <path d="M88 38L90 41H86L88 38ZM85 43L87 45H83L85 43ZM91 43L93 45H89L91 43Z" fill="#03E5B7" />
              </g>
            )}

            {/* 2. SQUID GAME PINK HOODIE (Back layer framing head) */}
            <circle cx="50" cy="45" r="32" fill="#FF007A" stroke="#1A1A24" strokeWidth="3" />

            {/* 3. SHINCHAN'S AUTHENTIC FACE */}
            <path
              d="M24 45 C20 36 26 25 45 24 C64 23 76 34 76 46 C76 56 70 65 52 66 C32 67 25 58 24 45 Z"
              fill="#FDE047"
              fillOpacity="0.35"
              stroke="#1A1A24"
              strokeWidth="2.5"
            />
            <path
              d="M26 44 C22 37 28 26 46 25 C63 24 74 34 74 46 C74 55 68 64 52 65 C33 66 27 57 26 44 Z"
              fill="#FAD2B8"
            />

            <path
              d="M32 28 C40 22 58 22 66 28 C64 26 56 24 46 25 C38 26 34 27 32 28 Z"
              fill="#1A1A24"
            />

            {/* Thick Wavy Eyebrows */}
            <path d="M30 32 C34 27 42 27 46 31" fill="none" stroke="#1A1A24" strokeWidth="5" strokeLinecap="round" />
            <path d="M54 31 C58 27 66 27 70 32" fill="none" stroke="#1A1A24" strokeWidth="5" strokeLinecap="round" />

            {/* Big Eyes with highlights */}
            <ellipse cx="38" cy="40" rx="4.5" ry="5.5" fill="#1A1A24" />
            <circle cx="39.5" cy="38.5" r="1.8" fill="#FFFFFF" />
            <ellipse cx="62" cy="40" rx="4.5" ry="5.5" fill="#1A1A24" />
            <circle cx="63.5" cy="38.5" r="1.8" fill="#FFFFFF" />

            {/* Rosy Cheek Blushes */}
            <ellipse cx="29" cy="48" rx="3.5" ry="2" fill="#F43F5E" fillOpacity="0.6" />
            <ellipse cx="71" cy="48" rx="3.5" ry="2" fill="#F43F5E" fillOpacity="0.6" />

            {/* Mischievous Smile */}
            <path d="M44 51 C48 57 54 57 58 51" fill="#E11D48" stroke="#1A1A24" strokeWidth="2.5" strokeLinecap="round" />

            {/* 4. PINK JUMPSUIT BODY */}
            <path
              d="M30 68 C24 68 20 74 22 88 C24 94 36 96 50 96 C64 96 76 94 78 88 C80 74 76 68 70 68 Z"
              fill="#FF007A"
              stroke="#1A1A24"
              strokeWidth="3"
            />

            <rect x="47" y="68" width="6" height="24" fill="#1A1A24" />
            <rect x="27" y="84" width="46" height="5" rx="2" fill="#1A1A24" />

            <path
              d="M26 88 C34 94 42 94 50 90 C58 94 66 94 74 88 C74 96 26 96 26 88 Z"
              fill="#FF007A"
              stroke="#1A1A24"
              strokeWidth="2.5"
            />

            {/* 5. ARMS & BLACK GLOVES */}
            {phase === 'bendDown' ? (
              <g>
                <path d="M30 72 L24 94" stroke="#FF007A" strokeWidth="9" strokeLinecap="round" />
                <circle cx="24" cy="96" r="6" fill="#1A1A24" />
              </g>
            ) : isCarryingOnShoulder ? (
              <g>
                <path d="M28 70 C18 74 14 82 16 90" fill="none" stroke="#FF007A" strokeWidth="9" strokeLinecap="round" />
                <circle cx="17" cy="92" r="6" fill="#1A1A24" />
                <ellipse cx="21" cy="86" rx="3" ry="4.5" fill="#FF007A" />
              </g>
            ) : (
              <g>
                <path d="M28 70 C18 66 12 56 10 50" fill="none" stroke="#FF007A" strokeWidth="9" strokeLinecap="round" />
                <circle cx="10" cy="48" r="6.5" fill="#1A1A24" />
                <ellipse cx="15" cy="54" rx="3" ry="5" fill="#FF007A" transform="rotate(-30 15 54)" />
              </g>
            )}

            {phase === 'bendDown' ? (
              <g>
                <path d="M70 72 L76 94" stroke="#FF007A" strokeWidth="9" strokeLinecap="round" />
                <circle cx="76" cy="96" r="6" fill="#1A1A24" />
              </g>
            ) : isCarryingOnShoulder ? (
              <g>
                <path d="M70 70 C80 64 78 50 64 46" fill="none" stroke="#FF007A" strokeWidth="9" strokeLinecap="round" />
                <circle cx="62" cy="46" r="7" fill="#1A1A24" />
                <ellipse cx="68" cy="52" rx="3.5" ry="5" fill="#FF007A" transform="rotate(-25 68 52)" />
              </g>
            ) : (
              <g>
                <path d="M72 70 C82 66 88 56 90 50" fill="none" stroke="#FF007A" strokeWidth="9" strokeLinecap="round" />
                <circle cx="90" cy="48" r="6.5" fill="#1A1A24" />
                <ellipse cx="85" cy="54" rx="3" ry="5" fill="#FF007A" transform="rotate(30 85 54)" />
              </g>
            )}

            {/* 6. LEGS & BLACK SHOES */}
            <g>
              <ellipse cx="38" cy="100" rx="7" ry="4" fill="#FF007A" stroke="#1A1A24" strokeWidth="2" />
              <ellipse cx="37" cy="105" rx="10" ry="5" fill="#1A1A24" />
              <ellipse cx="37" cy="108" rx="8" ry="1.8" fill="#FFFFFF" />
            </g>

            <g>
              <ellipse cx="62" cy="100" rx="7" ry="4" fill="#FF007A" stroke="#1A1A24" strokeWidth="2" />
              <ellipse cx="63" cy="105" rx="10" ry="5" fill="#1A1A24" />
              <ellipse cx="63" cy="108" rx="8" ry="1.8" fill="#FFFFFF" />
            </g>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};



