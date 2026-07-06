"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return <div className="h-48 w-full animate-pulse bg-card-bg rounded-2xl border-2 border-white/5" />;
  }

  const hours = time.getHours();
  const getGreeting = () => {
    if (hours >= 5 && hours < 12) return "Rise and grind";
    if (hours >= 12 && hours < 17) return "Keep pushing";
    if (hours >= 17 && hours < 22) return "Final stretch";
    return "Rest up, hero";
  };

  const getDayProgress = () => {
    const totalSeconds = 24 * 60 * 60;
    const currentSeconds = hours * 3600 + time.getMinutes() * 60 + time.getSeconds();
    return Math.floor((currentSeconds / totalSeconds) * 100);
  };

  const timeString = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-card-bg border-2 border-white/10 p-6 shadow-card group">
      {/* Background glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-neon-blue/20 via-neon-magenta/20 to-neon-orange/20 opacity-0 blur-xl transition-opacity duration-1000 group-hover:opacity-100" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div>
          <p className="text-neon-blue font-heading tracking-widest text-sm uppercase font-bold">
            {dateString}
          </p>
        </div>

        <div className="relative">
          <h1 className="text-6xl md:text-7xl font-heading font-bold tabular-nums tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {timeString}
          </h1>
          {/* Subtle pulse dot */}
          <div className="absolute top-2 -right-4 w-2 h-2 rounded-full bg-neon-orange animate-pulse shadow-neon-orange" />
        </div>

        <h2 className="text-xl md:text-2xl font-bold font-heading text-white/90">
          {getGreeting()}
        </h2>

        <div className="w-full pt-4 space-y-2">
          <div className="flex justify-between text-xs text-white/50 font-bold tracking-wider uppercase">
            <span>Day Progress</span>
            <span className="text-neon-blue">{getDayProgress()}%</span>
          </div>
          <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-neon-blue to-neon-magenta rounded-full shadow-neon-blue transition-all duration-1000 ease-linear"
              style={{ width: `${getDayProgress()}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
