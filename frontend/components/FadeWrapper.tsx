// frontend/components/FadeWrapper.tsx
'use client';

import { useEffect, useState } from 'react';

export default function FadeWrapper({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={show ? 'fade-enter-active' : 'fade-enter'}>
      {children}
    </div>
  );
}
