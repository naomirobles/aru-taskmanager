'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export const registerUser = async (formData: FormData) => {
  const { userId } = await auth()

  if (!userId) {
    return { error: 'No hay usuario autenticado' }
  }

  try {
    // Obtener datos del formulario
    const birthdate = formData.get('birthdate') as string
    const academicLevel = formData.get('academic_level') as string

    if (!birthdate || !academicLevel) {
      return { error: 'Todos los campos son obligatorios' }
    }

    // Obtener información del usuario de Clerk
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)

    // Crear o actualizar usuario en la base de datos
    const user = await db.user.upsert({
      where: {
        clerkUserId: userId,
      },
      update: {
        birthdate: new Date(birthdate),
        academic_level: academicLevel,
        updated_at: new Date(),
      },
      create: {
        clerkUserId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        imageUrl: clerkUser.imageUrl || null,
        birthdate: new Date(birthdate),
        academic_level: academicLevel,
      },
    })

    // Actualizar metadata en Clerk para marcar onboarding como completo
    await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })

    return { 
      message: 'Usuario registrado exitosamente',
      user 
    }
  } catch (err) {
    console.error('Error al completar el onboarding:', err)
    return { 
      error: 'Hubo un error al guardar tus datos. Por favor intenta de nuevo.' 
    }
  }
}
