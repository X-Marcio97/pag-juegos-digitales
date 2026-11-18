'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  variant?: 'header' | 'floating' | 'topbar';
  className?: string;
}

export default function ThemeToggle({
  variant = 'header',
  className = '',
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, config } = useTheme();

  if (variant === 'topbar') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[11px] font-extrabold transition-all duration-300 ${className}`}
        role="group"
        aria-label="Selector de tema visual"
      >
        <span className="text-[10px] uppercase tracking-wider text-white/90 flex items-center gap-1">
          <span>🎨</span>
          <span className="hidden sm:inline">Temática:</span>
        </span>
        <div className="flex items-center bg-black/40 rounded-full p-0.5">
          <button
            type="button"
            onClick={() => setTheme('vice')}
            aria-pressed={theme === 'vice'}
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all duration-200 ${
              theme === 'vice'
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-sm shadow-rose-500/50 scale-105'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Vice
          </button>
          <button
            type="button"
            onClick={() => setTheme('cyan')}
            aria-pressed={theme === 'cyan'}
            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all duration-200 ${
              theme === 'cyan'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-sm shadow-cyan-400/50 scale-105'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Cyan
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'floating') {
    return (
      <div
        className={`fixed bottom-5 left-5 z-40 flex items-center transition-all duration-300 ${className}`}
      >
        <div className="relative group">
          {/* Subtle Ambient Glow behind the pill */}
          <div
            className={`absolute -inset-1 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300 ${
              theme === 'vice'
                ? 'bg-gradient-to-r from-rose-500 via-purple-500 to-rose-500 animate-pulse'
                : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 animate-pulse'
            }`}
          />

          <div className="relative flex items-center gap-2 bg-[#101014]/95 border border-lineaFuerte px-3 py-2 rounded-full shadow-2xl backdrop-blur-md">
            <span className="text-base select-none">🎨</span>
            <div className="flex flex-col text-left pr-1">
              <span className="text-[9px] font-black tracking-widest uppercase text-muted leading-tight">
                Estilo en vivo
              </span>
              <span
                className={`text-[11px] font-black uppercase tracking-wider leading-none transition-colors ${
                  theme === 'vice' ? 'text-rose-400' : 'text-cyan-400'
                }`}
              >
                {config.name}
              </span>
            </div>

            {/* Switch Pills */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-full border border-linea">
              <button
                type="button"
                onClick={() => setTheme('vice')}
                title="Activar estética GTA VI Vice City Magenta Neon"
                aria-label="Activar estética GTA VI Vice City Magenta Neon"
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
                  theme === 'vice'
                    ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/40 scale-105'
                    : 'text-muted hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block animate-ping" />
                Vice Pink
              </button>

              <button
                type="button"
                onClick={() => setTheme('cyan')}
                title="Activar estética Arcade Electric Cyan"
                aria-label="Activar estética Arcade Electric Cyan"
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1 ${
                  theme === 'cyan'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-md shadow-cyan-400/40 scale-105'
                    : 'text-muted hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 inline-block animate-ping" />
                Neon Blue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: 'header' variant (sleek pill button for Header navbar)
  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-panel2/90 border border-linea hover:border-lineaFuerte p-1 rounded-xl transition-all duration-300 shadow-sm ${className}`}
      role="group"
      aria-label="Selector de temática Intergames"
    >
      <button
        type="button"
        onClick={toggleTheme}
        className="px-2 py-1 flex items-center gap-1.5 text-textoSuave hover:text-white transition group focus:outline-none"
        title={`Cambiar estética actual (${config.name}). Clic para alternar.`}
        aria-label={`Cambiar estética. Actual: ${config.name}`}
      >
        <span className="text-xs group-hover:rotate-12 transition-transform select-none">
          🎨
        </span>
        <span className="hidden md:inline text-[10px] font-extrabold uppercase tracking-wider text-muted group-hover:text-textoSuave transition">
          Tema:
        </span>
      </button>

      <div className="flex items-center gap-1 bg-fondo/80 p-0.5 rounded-lg border border-linea">
        <button
          type="button"
          onClick={() => setTheme('vice')}
          aria-pressed={theme === 'vice'}
          title="Temática GTA VI Vice City Neon (Magenta &amp; Violeta)"
          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
            theme === 'vice'
              ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/30 scale-[1.02]'
              : 'text-muted hover:text-white'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              theme === 'vice' ? 'bg-white shadow-sm' : 'bg-rose-500'
            }`}
          />
          <span className="truncate">Vice Neon</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('cyan')}
          aria-pressed={theme === 'cyan'}
          title="Temática Arcade Neon Blue (Cyan Eléctrico &amp; Azul)"
          className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
            theme === 'cyan'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-[1.02]'
              : 'text-muted hover:text-white'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              theme === 'cyan' ? 'bg-white shadow-sm' : 'bg-cyan-400'
            }`}
          />
          <span className="truncate">Cyan Arcade</span>
        </button>
      </div>
    </div>
  );
}
