"use client";
import { useEffect, useState } from "react";

export function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, min: 0, seg: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - new Date().getTime();
      if (diff <= 0) return clearInterval(timer);

      setTimeLeft({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
        min: Math.floor((diff / 1000 / 60) % 60),
        seg: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center text-center py-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-white/80 backdrop-blur rounded-xl shadow-sm p-4 w-20 border border-rose-100">
          <span className="text-2xl font-bold text-rose-600 block">{value}</span>
          <span className="text-xs uppercase text-zinc-500">{unit}</span>
        </div>
      ))}
    </div>
  );
}