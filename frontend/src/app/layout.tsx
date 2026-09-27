import React from 'react';
import { Toaster } from 'sonner';

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {children}
      <Toaster position="top-right" richColors closeButton theme="dark" />
    </div>
  );
};
