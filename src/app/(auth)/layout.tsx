import React from "react";
import { Toaster } from "sonner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="relative">
        <header className="absolute top-0 left-0 right-0 z-10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">M+</span>
              </div>
              <span className="text-lg font-semibold">Pharmacy Admin</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Secure Admin Portal
            </div>
          </div>
        </header>
        
        <main className="flex min-h-screen items-center justify-center p-6 pt-24">
          {children}
        </main>
        
        <footer className="absolute bottom-0 left-0 right-0 p-6 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 M+ Pharmacy Admin. All rights reserved.
          </p>
        </footer>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
