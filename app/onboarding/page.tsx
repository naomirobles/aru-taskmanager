'use client'

import * as React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { registerUser } from '../actions/register_user'
import { Calendar, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react'

export default function OnboardingComponent() {
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const { user } = useUser()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await registerUser(formData)
      if (res?.message) {
        await user?.reload()
        router.push('/')
      }
      if (res?.error) {
        setError(res?.error)
      }
    } catch (err) {
      setError('Hubo un error al completar el registro')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a aru:taskmanager!
          </h1>
          <p className="text-gray-600 text-lg">
            Completa tu perfil para personalizar tu experiencia
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha de Nacimiento */}
            <div className="space-y-2">
              <label htmlFor="birthdate" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                required
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900"
              />
              <p className="text-xs text-gray-500 ml-1">
                Necesitamos tu fecha de nacimiento para personalizar tu experiencia
              </p>
            </div>

            {/* Nivel Académico */}
            <div className="space-y-2">
              <label htmlFor="academic_level" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Nivel Académico
              </label>
              <select
                id="academic_level"
                name="academic_level"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
              >
                <option value="">Selecciona tu nivel académico</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="preparatoria">Preparatoria</option>
                <option value="universidad">Universidad</option>
                <option value="posgrado">Posgrado</option>
                <option value="otro">Otro</option>
              </select>
              <p className="text-xs text-gray-500 ml-1">
                Esto nos ayuda a sugerir tareas y recomendaciones relevantes
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Completar Registro'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Tus datos están seguros y protegidos 🔒
        </p>
      </div>
    </div>
  )
}