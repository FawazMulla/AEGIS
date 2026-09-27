import React from 'react';
import { Toaster } from 'sonner';

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none subtle-mesh z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
      <Toaster position="top-right" richColors closeButton theme="dark" />
    </div>
  );
};
