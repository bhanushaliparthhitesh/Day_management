"use client";

import { useEffect, useState } from "react";
import { Clock as ClockIcon, CheckSquare, StickyNote } from "lucide-react";
import Clock from "@/components/Clock";
import TodoList from "@/components/TodoList";
import StickyNotes from "@/components/StickyNotes";
import ClockMode from "@/components/ClockMode";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeSection, setActiveSection] = useState("clock");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Simple intersection observer for scroll spy
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });

    const sections = document.querySelectorAll("section[id]");
    sections.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Skeleton/Fade-in on mount
  if (!mounted) {
    return <div className="min-h-screen bg-background opacity-0 transition-opacity duration-1000" />;
  }

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-1000 selection:bg-neon-magenta/30 selection:text-white">
      
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-12">
        
        {/* Header Actions */}
        <div className="flex justify-end">
          <ClockMode />
        </div>

        {/* Sections */}
        <section id="clock" className="scroll-mt-8">
          <Clock />
        </section>

        <section id="tasks" className="scroll-mt-8 pt-4">
          <TodoList />
        </section>

        <section id="notes" className="scroll-mt-8 pt-4">
          <StickyNotes />
        </section>

      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card-bg/90 backdrop-blur-md border-2 border-white/10 p-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-40 flex space-x-2">
        <NavButton 
          icon={<ClockIcon className="w-5 h-5" />} 
          label="Time" 
          active={activeSection === "clock"} 
          onClick={() => scrollTo("clock")}
          colorClass="hover:text-neon-blue hover:bg-neon-blue/10 active:bg-neon-blue/20"
          activeClass="text-neon-blue bg-neon-blue/10 shadow-[inset_0_0_10px_rgba(0,217,255,0.2)] border-neon-blue/30"
        />
        <NavButton 
          icon={<CheckSquare className="w-5 h-5" />} 
          label="Missions" 
          active={activeSection === "tasks"} 
          onClick={() => scrollTo("tasks")}
          colorClass="hover:text-neon-orange hover:bg-neon-orange/10 active:bg-neon-orange/20"
          activeClass="text-neon-orange bg-neon-orange/10 shadow-[inset_0_0_10px_rgba(255,107,53,0.2)] border-neon-orange/30"
        />
        <NavButton 
          icon={<StickyNote className="w-5 h-5" />} 
          label="Notes" 
          active={activeSection === "notes"} 
          onClick={() => scrollTo("notes")}
          colorClass="hover:text-neon-magenta hover:bg-neon-magenta/10 active:bg-neon-magenta/20"
          activeClass="text-neon-magenta bg-neon-magenta/10 shadow-[inset_0_0_10px_rgba(255,0,127,0.2)] border-neon-magenta/30"
        />
      </nav>
      
    </div>
  );
}

function NavButton({ 
  icon, 
  label, 
  active, 
  onClick,
  colorClass,
  activeClass
}: { 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  colorClass: string,
  activeClass: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-20 py-2 rounded-xl transition-all border border-transparent",
        active ? activeClass : `text-white/40 ${colorClass}`
      )}
    >
      {icon}
      <span className="text-[10px] font-bold tracking-widest uppercase mt-1">
        {label}
      </span>
    </button>
  );
}
