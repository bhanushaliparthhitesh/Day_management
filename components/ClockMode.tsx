"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/useLocalStorage";

export default function ClockMode() {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [isDimmed, setIsDimmed] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [use12Hour] = useLocalStorage<boolean>("dayflow-12hr", false);
  
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dimTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Time updates
  useEffect(() => {
    if (!isActive) return;
    
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Wake lock management
  useEffect(() => {
    if (!isActive) {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      return;
    }

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake Lock error:', err);
      }
    };

    requestWakeLock();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isActive) {
        requestWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, [isActive]);

  // Interaction handlers for dimming and controls
  const handleInteraction = () => {
    if (!isActive) return;
    
    setShowControls(true);
    setIsDimmed(false);
    
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (dimTimeoutRef.current) clearTimeout(dimTimeoutRef.current);

    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    dimTimeoutRef.current = setTimeout(() => {
      if (!time) return;
      const hours = new Date().getHours();
      // Auto dim between 10 PM (22) and 6 AM (6)
      if (hours >= 22 || hours < 6) {
        setIsDimmed(true);
      }
    }, 5000);
  };

  useEffect(() => {
    if (isActive) {
      handleInteraction();
    }
  }, [isActive]);

  // Orientation auto-suggest
  const [showSuggest, setShowSuggest] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(orientation: landscape)');
    const handleOrientation = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches && !isActive) {
        setShowSuggest(true);
        setTimeout(() => setShowSuggest(false), 5000); // Hide suggest after 5s
      } else {
        setShowSuggest(false);
      }
    };
    
    mql.addEventListener('change', handleOrientation);
    
    return () => mql.removeEventListener('change', handleOrientation);
  }, [isActive]);

  if (!isActive) {
    return (
      <div className="relative">
        <button 
          onClick={() => setIsActive(true)}
          className="flex items-center justify-center p-3 rounded-xl bg-card-bg border-2 border-white/10 text-white/50 hover:text-neon-blue hover:border-neon-blue hover:shadow-neon-blue transition-all"
          title="Enter Clock Mode"
        >
          <Maximize className="w-5 h-5" />
        </button>
        
        <AnimatePresence>
          {showSuggest && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-0 top-14 w-48 bg-card-bg border-2 border-neon-orange p-3 rounded-xl shadow-lg z-20 cursor-pointer"
              onClick={() => setIsActive(true)}
            >
              <p className="text-sm font-bold text-white mb-1">Prop me up?</p>
              <p className="text-xs text-white/50">Tap to enter desk Clock Mode.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (!time) return null;

  const timeString = time.toLocaleTimeString("en-US", {
    hour12: use12Hour,
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateString = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "fixed inset-0 z-50 bg-background flex items-center justify-center transition-all duration-1000",
        isDimmed ? "brightness-50" : "brightness-100"
      )}
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-blue/10 via-background to-background" />

      <AnimatePresence>
        {showControls && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsActive(false);
            }}
            className="absolute top-6 right-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-50"
          >
            <X className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative z-10 text-center flex flex-col items-center landscape:scale-125 transition-transform duration-500">
        <motion.h1 
          layoutId="clock-time"
          className="text-[12vw] md:text-[8rem] font-heading font-bold tabular-nums tracking-tighter text-white drop-shadow-[0_0_30px_rgba(0,217,255,0.4)] leading-none mb-4"
        >
          {timeString}
        </motion.h1>
        
        <p className="text-xl md:text-3xl text-neon-blue font-heading tracking-widest uppercase font-bold drop-shadow-md">
          {dateString}
        </p>
      </div>
    </motion.div>
  );
}
