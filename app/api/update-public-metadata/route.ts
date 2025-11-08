// app/api/update-public-metadata/route.ts
import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId: bodyUserId, publicMetadata } = body as { userId?: string, publicMetadata?: Record<string, any> }

    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    if (userId !== bodyUserId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (!publicMetadata || typeof publicMetadata !== 'object') return NextResponse.json({ error: 'publicMetadata inválido' }, { status: 400 })

    // validaciones
    if (publicMetadata.birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(publicMetadata.birthdate)) {
      return NextResponse.json({ error: 'birthdate inválido' }, { status: 400 })
    }
    const allowed = ['primaria','secundaria','preparatoria','universidad','posgrado','otro']
    if (publicMetadata.academic_level && !allowed.includes(publicMetadata.academic_level)) {
      return NextResponse.json({ error: 'academic_level inválido' }, { status: 400 })
    }

    const client = await clerkClient()
    const updated = await client.users.updateUser(userId, {
      publicMetadata: {
        ...(publicMetadata || {})
      }
    })

    return NextResponse.json({ ok: true, publicMetadata: updated.publicMetadata })
  } catch (err: any) {
    console.error('update-public-metadata error:', err)
    return NextResponse.json({ error: err?.message ?? 'Server error' }, { status: 500 })
  }
}
