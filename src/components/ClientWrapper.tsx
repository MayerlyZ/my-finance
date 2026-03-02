'use client';

import { useState, useEffect } from 'react';
import WelcomeScreen, { getUserName } from './WelcomeScreen';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = getUserName();
    setUserName(stored || '');
    setChecked(true);
  }, []);

  // Not checked yet — render nothing to avoid flash
  if (!checked) return null;

  // No name saved — show welcome screen
  if (!userName) {
    return <WelcomeScreen onEnter={(name) => setUserName(name)} />;
  }

  return (
    <>
      {/* Pass userName via data attribute so pages can read it */}
      <div data-username={userName} style={{ display: 'contents' }}>
        {children}
      </div>
    </>
  );
}
