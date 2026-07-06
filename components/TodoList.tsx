"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Flame } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { cn } from "@/lib/utils";

export type Priority = "low" | "med" | "high";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
};

const XP_PER_TASK = 10;
const XP_PER_LEVEL = 100;

export default function TodoList() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("dayflow-tasks", []);
  const [xp, setXp] = useLocalStorage<number>("dayflow-xp", 0);
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState<Priority>("med");

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const currentLevelXp = xp % XP_PER_LEVEL;

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    
    setTasks([newTask, ...tasks]);
    setInputValue("");
  };

  const toggleTask = (id: string, currentlyCompleted: boolean) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    
    if (!currentlyCompleted) {
      // Just completed
      setXp(xp + XP_PER_TASK);
      
      const rect = document.getElementById(`task-${id}`)?.getBoundingClientRect();
      const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ["#00d9ff", "#ff6b35", "#ff007f"],
      });
      
      // Check level up
      if ((currentLevelXp + XP_PER_TASK) >= XP_PER_LEVEL) {
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.3 },
            colors: ["#00d9ff", "#ff6b35", "#ff007f", "#ffffff"],
            disableForReducedMotion: true,
          });
        }, 300);
      }
    } else {
      // Uncompleted (optional: remove XP? For now, let's keep it simple and just let them keep the XP to avoid feeling punished, or we can deduct it)
      setXp(Math.max(0, xp - XP_PER_TASK));
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  return (
    <div className="flex flex-col space-y-6">
      {/* XP Header */}
      <div className="bg-card-bg rounded-2xl p-4 border-2 border-white/10 shadow-card">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-neon-orange" />
            <span className="font-heading font-bold text-white tracking-wide uppercase">
              Level {level}
            </span>
          </div>
          <span className="text-xs font-bold text-white/50">
            {currentLevelXp} / {XP_PER_LEVEL} XP
          </span>
        </div>
        <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-neon-orange shadow-neon-orange rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentLevelXp / XP_PER_LEVEL) * 100}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        </div>
      </div>

      {/* Input Section */}
      <form onSubmit={handleAddTask} className="flex flex-col space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Add a new mission..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-card-bg border-2 border-white/10 rounded-xl py-4 pl-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-blue focus:shadow-neon-blue transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-neon-blue/20 text-neon-blue hover:bg-neon-blue hover:text-black hover:shadow-neon-blue rounded-lg flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-neon-blue/20 disabled:hover:text-neon-blue disabled:hover:shadow-none"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="flex space-x-2">
          {(["low", "med", "high"] as Priority[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2 transition-all",
                priority === p
                  ? p === "low" ? "border-neon-blue text-neon-blue bg-neon-blue/10"
                  : p === "med" ? "border-neon-orange text-neon-orange bg-neon-orange/10"
                  : "border-neon-magenta text-neon-magenta bg-neon-magenta/10"
                  : "border-white/5 text-white/40 hover:bg-white/5"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </form>

      {/* Filters */}
      <div className="flex space-x-2 bg-card-bg/50 p-1 rounded-xl border border-white/5">
        {(["all", "active", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all",
              filter === f ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3 pb-24">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-10"
            >
              <p className="text-white/40 font-heading text-lg">
                {filter === "done" ? "No completed missions yet." : "Clear skies! No missions pending."}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggle={() => toggleTask(task.id, task.completed)}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete }: { task: Task, onToggle: () => void, onDelete: () => void }) {
  const priorityColor = 
    task.priority === "high" ? "text-neon-magenta border-neon-magenta/30 bg-neon-magenta/5" : 
    task.priority === "med" ? "text-neon-orange border-neon-orange/30 bg-neon-orange/5" : 
    "text-neon-blue border-neon-blue/30 bg-neon-blue/5";

  return (
    <motion.div
      id={`task-${task.id}`}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "relative flex items-center p-4 rounded-xl border-2 transition-colors",
        task.completed ? "border-white/5 bg-black/20" : `bg-card-bg ${priorityColor.split(" ")[1]}`
      )}
    >
      <button 
        onClick={onToggle}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-md border-2 mr-4 flex items-center justify-center transition-all",
          task.completed 
            ? "bg-white border-white text-black" 
            : `border-current ${priorityColor.split(" ")[0]} hover:bg-current hover:text-black`
        )}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="w-4 h-4" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
      
      <div className="flex-grow min-w-0 pr-4">
        <p className={cn(
          "truncate font-medium transition-all",
          task.completed ? "text-white/30 line-through" : "text-white/90"
        )}>
          {task.text}
        </p>
      </div>

      <button
        onClick={onDelete}
        className="flex-shrink-0 text-white/20 hover:text-neon-magenta transition-colors p-2 -mr-2 rounded-lg hover:bg-neon-magenta/10"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
