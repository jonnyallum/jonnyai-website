'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Mode = 'nerds' | 'public' | 'idiots';

interface ModeContextValue {
  mode: Mode;
  setMode: (m: Mode) => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: 'nerds',
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('nerds');

  useEffect(() => {
    const saved = localStorage.getItem('jai-mode') as Mode | null;
    if (saved && ['nerds', 'public', 'idiots'].includes(saved)) {
      setModeState(saved);
    }
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    localStorage.setItem('jai-mode', m);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);
