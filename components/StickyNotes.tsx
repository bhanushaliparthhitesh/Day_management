"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn } from "@/lib/utils";

export type NoteColor = "blue" | "orange" | "magenta" | "gray";

export type Note = {
  id: string;
  text: string;
  color: NoteColor;
  rotation: number;
};

const colors: Record<NoteColor, { bg: string, border: string, text: string }> = {
  blue: { bg: "bg-neon-blue/20", border: "border-neon-blue/50", text: "text-neon-blue" },
  orange: { bg: "bg-neon-orange/20", border: "border-neon-orange/50", text: "text-neon-orange" },
  magenta: { bg: "bg-neon-magenta/20", border: "border-neon-magenta/50", text: "text-neon-magenta" },
  gray: { bg: "bg-white/10", border: "border-white/20", text: "text-white" },
};

export default function StickyNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("dayflow-notes", []);

  const addNote = () => {
    const colorKeys: NoteColor[] = ["blue", "orange", "magenta", "gray"];
    const randomColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
    const randomRotation = Math.random() * 6 - 3; // -3 to +3 degrees

    const newNote: Note = {
      id: crypto.randomUUID(),
      text: "",
      color: randomColor,
      rotation: randomRotation,
    };
    setNotes([newNote, ...notes]);
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const updateNoteColor = (id: string, color: NoteColor) => {
    setNotes(notes.map(n => n.id === id ? { ...n, color } : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="relative pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">
          Mind Dump
        </h2>
        <button
          onClick={addNote}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-card-bg border-2 border-white/20 text-white hover:border-neon-blue hover:text-neon-blue hover:shadow-neon-blue transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <AnimatePresence>
          {notes.map((note) => (
            <NoteItem 
              key={note.id} 
              note={note} 
              onUpdateText={(txt) => updateNoteText(note.id, txt)}
              onUpdateColor={(c) => updateNoteColor(note.id, c)}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {notes.length === 0 && (
        <div className="text-center py-10 opacity-50">
          <p className="font-heading">No notes yet. Add one!</p>
        </div>
      )}
    </div>
  );
}

function NoteItem({ 
  note, 
  onUpdateText, 
  onUpdateColor, 
  onDelete 
}: { 
  note: Note; 
  onUpdateText: (txt: string) => void;
  onUpdateColor: (c: NoteColor) => void;
  onDelete: () => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, rotate: note.rotation }}
      animate={{ 
        opacity: 1, 
        scale: isFocused ? 1.05 : 1, 
        rotate: isFocused ? 0 : note.rotation,
        zIndex: isFocused ? 50 : 1
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "relative flex flex-col rounded-xl border-2 p-3 transition-colors shadow-card",
        colors[note.color].bg,
        colors[note.color].border,
        isFocused ? "shadow-lg" : ""
      )}
    >
      <button 
        onClick={onDelete}
        className="absolute -top-2 -right-2 w-6 h-6 bg-black rounded-full border-2 border-white/20 flex items-center justify-center text-white/50 hover:text-neon-magenta hover:border-neon-magenta transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>

      <textarea
        value={note.text}
        onChange={(e) => onUpdateText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type something..."
        className={cn(
          "w-full flex-grow bg-transparent resize-none focus:outline-none min-h-[100px] text-sm font-medium placeholder:text-white/30",
          "text-white"
        )}
      />

      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="flex space-x-2 mt-2 pt-2 border-t border-white/10"
          >
            {(["blue", "orange", "magenta", "gray"] as NoteColor[]).map((c) => (
              <button
                key={c}
                onMouseDown={(e) => { e.preventDefault(); onUpdateColor(c); }} // prevent blur
                className={cn(
                  "w-5 h-5 rounded-full border-2 transition-transform hover:scale-110",
                  note.color === c ? "border-white" : "border-transparent",
                  colors[c].bg.replace("/20", "") // Hack to get full color for dots if we had defined them, but we can just use fixed classes:
                )}
                style={{
                  backgroundColor: c === 'blue' ? '#00d9ff' : c === 'orange' ? '#ff6b35' : c === 'magenta' ? '#ff007f' : '#ffffff40'
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
