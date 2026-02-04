import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'

export interface User {
  id: string
  email: string
  name: string
  role: string
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return null
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function createSession(user: User): Promise<string> {
  // Verificar se JWT_SECRET está configurado
  if (!JWT_SECRET || JWT_SECRET === 'fallback-secret-key') {
    console.error('[AUTH] ⚠️ JWT_SECRET não configurado ou usando fallback!')
    console.error('[AUTH] Configure NEXTAUTH_SECRET no ambiente!')
  }
  
  const payload = { 
    id: user.id, 
    email: user.email, 
    name: user.name, 
    role: user.role 
  }
  
  console.log('[AUTH] Creating token with payload:', {
    id: payload.id,
    email: payload.email,
    jwtSecretLength: JWT_SECRET?.length || 0,
    jwtSecretPreview: JWT_SECRET?.substring(0, 10) + '...'
  })
  
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  console.log('[AUTH] Token created:', {
    tokenLength: token.length,
    tokenPreview: token.substring(0, 30) + '...',
    expiresIn: '7d'
  })

  const cookieStore = await cookies()
  
  // Determinar se está em produção (HTTPS)
  const isProduction = process.env.NODE_ENV === 'production'
  const nextAuthUrl = process.env.NEXTAUTH_URL || ''
  const isSecure = isProduction || nextAuthUrl.startsWith('https://')
  
  // Configuração do cookie
  const cookieOptions: any = {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  }
  
  // Se houver domínio configurado, usar (útil para subdomínios)
  if (process.env.COOKIE_DOMAIN) {
    cookieOptions.domain = process.env.COOKIE_DOMAIN
  }
  
  cookieStore.set('auth-token', token, cookieOptions)

  console.log('[AUTH] ✅ Session created and cookie set:', {
    userId: user.id,
    email: user.email,
    secure: isSecure,
    production: isProduction,
    cookiePath: cookieOptions.path,
    cookieDomain: cookieOptions.domain || 'default'
  })

  return token
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    }
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}
