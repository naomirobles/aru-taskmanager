'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function ProfilePublicMetadataEditor({ initial }: { initial?: { birthdate?: string, academic_level?: string } }) {
  const { user } = useUser()
  const router = useRouter()

  const initialBirthdate = initial?.birthdate ?? (user?.publicMetadata?.birthdate ?? '')
  const initialAcademic = initial?.academic_level ?? (user?.publicMetadata?.academic_level ?? '')

  const [birthdate, setBirthdate] = useState<string>(String(initialBirthdate || ''))
  const [academicLevel, setAcademicLevel] = useState<string>(String(initialAcademic || ''))

  const [isLoading, setIsLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!initial) {
      setBirthdate(String(user?.publicMetadata?.birthdate ?? ''))
      setAcademicLevel(String(user?.publicMetadata?.academic_level ?? ''))
    }
  }, [user?.publicMetadata?.birthdate, user?.publicMetadata?.academic_level, initial])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMsg(null)

    try {
      const res = await fetch('/api/update-public-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          publicMetadata: {
            birthdate,
            academic_level: academicLevel
          }
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error desconocido')

      try { await user?.reload() } catch (e) { /* no crítico */ }

      setMsg('Guardado correctamente.')
    } catch (err: any) {
      setMsg('Error: ' + (err?.message ?? 'Error al guardar'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* ... inputs idénticos ... */}
      <div className="space-y-2">
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
        <input
          id="birthdate"
          name="birthdate"
          type="date"
          required
          max={new Date().toISOString().split('T')[0]}
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="academic_level" className="block text-sm font-medium text-gray-700">Nivel Académico</label>
        <select
          id="academic_level"
          name="academic_level"
          required
          value={academicLevel}
          onChange={(e) => setAcademicLevel(e.target.value)}
          className="w-full px-3 py-2 border rounded-md bg-white"
        >
          <option value="">Selecciona tu nivel académico</option>
          <option value="primaria">Primaria</option>
          <option value="secundaria">Secundaria</option>
          <option value="preparatoria">Preparatoria</option>
          <option value="universidad">Universidad</option>
          <option value="posgrado">Posgrado</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 bg-indigo-600 text-white disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {msg && <p className="text-sm mt-2">{msg}</p>}
    </form>
  )
}
