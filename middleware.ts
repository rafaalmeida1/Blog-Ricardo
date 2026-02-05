import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key-change-me'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteger apenas rotas admin (exceto login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      
      // Verificar se o payload tem os campos necessários
      if (!payload.id || !payload.email) {
        throw new Error('Token inválido: payload incompleto')
      }
      
      // Token válido, permitir acesso
      return NextResponse.next()
    } catch (error) {
      // Token inválido ou expirado, redirecionar para login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
