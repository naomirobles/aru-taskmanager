'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Clock, Settings } from "lucide-react";

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="bg-gradient-to-r from-purple-400 to-purple-500 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo y título */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">
            aru:taskmanager
          </h1>
        </div>

        {/* Sección de usuario */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {/* Información del usuario */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full pr-3 pl-1 py-1">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
                <span className="text-white font-medium text-sm">
                  {user?.username || user?.firstName || "Usuario"}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Botones de autenticación cuando NO está logueado */}
              <SignInButton mode="modal">
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                  Iniciar Sesión
                </button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <button className="bg-white hover:bg-white/90 text-indigo-600 px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg">
                  Registrarse
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}