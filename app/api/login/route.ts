import { NextRequest, NextResponse } from 'next/server'
import { login, createSession } from '@/lib/auth-simple'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    console.log('[LOGIN API] Attempting login for:', email)

    const user = await login(email, password)
    
    if (!user) {
      console.warn('[LOGIN API] Invalid credentials for:', email)
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    console.log('[LOGIN API] User authenticated:', user.email)

    // Criar sessão e obter token
    const token = await createSession(user)

    // Criar resposta com cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

    // Garantir que o cookie seja definido na resposta (mesma lógica do createSession)
    const isProduction = process.env.NODE_ENV === 'production'
    const nextAuthUrl = process.env.NEXTAUTH_URL || ''
    const isSecure = isProduction || nextAuthUrl.startsWith('https://')
    
    const cookieOptions: any = {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax' as const,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    }
    
    if (process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN
    }
    
    response.cookies.set('auth-token', token, cookieOptions)

    console.log('[LOGIN API] Session cookie set, secure:', isSecure)

    return response
  } catch (error) {
    console.error('[LOGIN API] Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
