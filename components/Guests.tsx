'use client';

import React from 'react';
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Clock, Grid3X3, Calendar, Target, Search, Sparkles, Rocket, Palette, Sprout, ArrowRight } from 'lucide-react';
import Link from "next/link"; // Assuming Link might be used for internal navigation, though not explicitly in current template
import ThemeToggle from "./ThemeToggle";

export function Guest() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#312d40] transition-colors duration-200">
      {/* Navbar - Simplified for Guests component, assuming main Header is separate */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-[#8b7dd8] to-[#9d8de8] dark:from-[#312d40] dark:to-[#312d40] shadow-lg z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 text-white text-2xl font-semibold">
              <Clock className="w-8 h-8" />
              <span>aru:taskmanager</span>
            </div>
            <div className="flex gap-3">
              <ThemeToggle />
              <SignInButton mode="modal" forceRedirectUrl="/calendar">
                <button className="px-6 py-2 rounded-lg bg-white/20 text-white border-2 border-white font-medium hover:bg-white hover:text-[#8b7dd8] transition-all duration-300">
                  Iniciar Sesión
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/calendar">
                <button className="px-6 py-2 rounded-lg bg-white text-[#8b7dd8] font-medium hover:bg-gray-50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  Registrarse
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#8b7dd8] to-[#b8ace8] dark:bg-[#290b9c] dark:bg-none text-white overflow-hidden">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Organiza tu vida con inteligencia
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95 animate-fade-in-up animation-delay-200">
            aru:taskmanager te ayuda a gestionar tus tareas de manera eficiente con una interfaz intuitiva, vistas personalizables y recomendaciones inteligentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <SignUpButton mode="modal" forceRedirectUrl="/calendar">
              <button className="px-10 py-4 bg-white text-[#8b7dd8] rounded-lg text-lg font-medium hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Comenzar Gratis
              </button>
            </SignUpButton>
            {/* The original "Ver Demo" button is not directly mapped to Clerk functionality.
                Keeping it as a placeholder or removing it based on actual app logic.
                For now, I'll replace it with a more direct sign-in option.
            */}
            <SignInButton mode="modal" forceRedirectUrl="/calendar">
              <button className="px-10 py-4 bg-white/20 text-white border-2 border-white rounded-lg text-lg font-medium hover:bg-white hover:text-[#8b7dd8] transition-all duration-300">
                Ya tengo cuenta
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#312d40] transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
            Características Principales
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16">
            Todo lo que necesitas para mantener tus proyectos en orden
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#ffc5d0] to-[#ffb3c1] rounded-xl flex items-center justify-center text-3xl mb-6">
                <Grid3X3 className="w-8 h-8 text-pink-600" /> {/* Changed emoji to Lucide icon */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Vista de Lista Organizada</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Visualiza todas tus tareas organizadas por categorías con colores distintivos. Filtra y busca fácilmente lo que necesitas.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#fff9c4] to-[#fff176] rounded-xl flex items-center justify-center text-3xl mb-6">
                <Calendar className="w-8 h-8 text-yellow-600" /> {/* Changed emoji to Lucide icon */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Calendario Inteligente</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Planifica tus tareas con nuestra vista de calendario mensual. Visualiza fechas de inicio y fin con claridad.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#b3e5fc] to-[#81d4fa] rounded-xl flex items-center justify-center text-3xl mb-6">
                <Target className="w-8 h-8 text-cyan-600" /> {/* Changed emoji to Lucide icon */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Categorías Personalizables</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Crea categorías ilimitadas y personaliza los colores para organizar tus tareas según tus necesidades.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#e1bee7] to-[#ce93d8] rounded-xl flex items-center justify-center text-3xl mb-6">
                <Sparkles className="w-8 h-8 text-purple-600" /> {/* Changed emoji to Lucide icon */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recomendaciones IA</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Recibe sugerencias inteligentes para optimizar tu productividad y completar tus tareas de manera eficiente.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#c8e6c9] to-[#a5d6a7] rounded-xl flex items-center justify-center text-3xl mb-6">
                <Search className="w-8 h-8 text-green-600" /> {/* Changed emoji to Lucide icon */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Búsqueda Avanzada</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Encuentra cualquier tarea al instante con nuestra potente función de búsqueda con filtros inteligentes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#d1c4e9] to-[#b39ddb] rounded-xl flex items-center justify-center text-3xl mb-6">
                <Sparkles className="w-8 h-8 text-indigo-600" /> {/* Changed emoji to Lucide icon */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Interfaz Intuitiva</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Diseño moderno y limpio que hace que la gestión de tareas sea simple y agradable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#312d40] transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Sobre aru:taskmanager
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Nacimos con la misión de simplificar la gestión de tareas y proyectos para personas y equipos. Creemos que la productividad no tiene que ser complicada.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Nuestra plataforma combina un diseño intuitivo con características poderosas, permitiéndote concentrarte en lo que realmente importa: completar tus objetivos.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Ya sea que estés gestionando proyectos personales, coordinando equipos o simplemente organizando tu día a día, aru:taskmanager se adapta a tu flujo de trabajo.
              </p>
            </div>

            <div className="relative h-96 bg-gradient-to-br from-[#8b7dd8] to-[#b8ace8] rounded-3xl overflow-hidden">
              {/* Floating Cards */}
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 animate-float">
                <div className="bg-white p-6 rounded-xl shadow-xl">
                  <div className="text-sm font-semibold text-[#7f3d47] mb-1 bg-gradient-to-br from-[#ffc5d0] to-[#ffb3c1] px-3 py-1 rounded-md inline-block">
                    Categoría 1
                  </div>
                  <div className="text-xs text-gray-600 mt-2">4 tareas</div>
                </div>
              </div>

              <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 animate-float animation-delay-500">
                <div className="bg-white p-6 rounded-xl shadow-xl">
                  <div className="text-sm font-semibold text-[#7f6f00] mb-1 bg-gradient-to-br from-[#fff9c4] to-[#fff176] px-3 py-1 rounded-md inline-block">
                    Categoría 2
                  </div>
                  <div className="text-xs text-gray-600 mt-2">2 tareas</div>
                </div>
              </div>

              <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 translate-y-1/2 animate-float animation-delay-1000">
                <div className="bg-white p-6 rounded-xl shadow-xl">
                  <div className="text-sm font-semibold text-[#2d5f7f] mb-1 bg-gradient-to-br from-[#b3e5fc] to-[#81d4fa] px-3 py-1 rounded-md inline-block">
                    Categoría 3
                  </div>
                  <div className="text-xs text-gray-600 mt-2">3 tareas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#312d40] transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">
            Nuestros Objetivos
          </h2>
          <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16">
            Comprometidos con tu productividad y éxito
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#e1bee7] to-[#ce93d8] rounded-xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-purple-700" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Maximizar Productividad</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Ayudarte a lograr más en menos tiempo con herramientas inteligentes y flujos de trabajo optimizados.
              </p>
            </div>

            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#b3e5fc] to-[#81d4fa] rounded-xl flex items-center justify-center mb-6">
                <Palette className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Experiencia Excepcional</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Crear una interfaz hermosa y funcional que haga que gestionar tareas sea un placer, no una carga.
              </p>
            </div>

            <div className="group bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b7dd8] to-[#b8ace8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="w-16 h-16 bg-gradient-to-br from-[#c8e6c9] to-[#a5d6a7] rounded-xl flex items-center justify-center mb-6">
                <Sprout className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Crecimiento Continuo</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Evolucionar constantemente con nuevas características basadas en las necesidades de nuestros usuarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#8b7dd8] to-[#b8ace8] dark:bg-[#290b9c] dark:bg-none text-white overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para transformar tu productividad?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Únete a miles de usuarios que ya organizan su vida con aru:taskmanager
          </p>
          <SignUpButton mode="modal" forceRedirectUrl="/calendar">
            <button className="px-10 py-4 bg-white text-[#8b7dd8] rounded-lg text-lg font-medium hover:bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              Crear Cuenta Gratis
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#b8ace8]">aru:taskmanager</h3>
              <p className="text-gray-400">
                La forma inteligente de gestionar tus tareas y proyectos.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#b8ace8]">Producto</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Características</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Precios</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Actualizaciones</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#b8ace8]">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Carreras</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#b8ace8]">Soporte</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Documentación</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-[#b8ace8] transition-colors">Estado del Sistema</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 aru:taskmanager. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}