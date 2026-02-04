import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'

// Rate limiting - armazena tentativas por IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutos
const RATE_LIMIT_MAX_REQUESTS = 100 // máximo de requisições por janela
const RATE_LIMIT_MAX_FAILED_AUTH = 5 // máximo de tentativas de auth falhadas

// Limpar entradas antigas periodicamente
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key)
    }
  }
}, 5 * 60 * 1000) // a cada 5 minutos

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
}

function checkRateLimit(ip: string, isAuthAttempt: boolean = false): RateLimitResult {
  const now = Date.now()
  const key = isAuthAttempt ? `auth:${ip}` : `req:${ip}`
  const limit = isAuthAttempt ? RATE_LIMIT_MAX_FAILED_AUTH : RATE_LIMIT_MAX_REQUESTS
  
  const record = rateLimitMap.get(key)
  
  if (!record || record.resetTime < now) {
    // Nova janela
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + RATE_LIMIT_WINDOW
    }
  }
  
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime
    }
  }
  
  record.count++
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime
  }
}

function getClientIP(request: NextRequest): string {
  // Tenta pegar o IP real através de headers comuns de proxy
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fallback para o IP da conexão (pode não estar disponível no middleware)
  return request.ip || 'unknown'
}

function validateToken(token: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Validações adicionais
    if (!decoded.id || !decoded.email) {
      return { valid: false, error: 'Token inválido: payload incompleto' }
    }
    
    // Verificar se o token não expirou (jwt.verify já faz isso, mas garantimos)
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return { valid: false, error: 'Token expirado' }
    }
    
    return { valid: true, payload: decoded }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { valid: false, error: 'Token expirado' }
    }
    if (error.name === 'JsonWebTokenError') {
      return { valid: false, error: 'Token inválido' }
    }
    return { valid: false, error: 'Erro ao validar token' }
  }
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Headers de segurança
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSP básico
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // necessário para Next.js
    "style-src 'self' 'unsafe-inline'", // necessário para Tailwind
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  return response
}

function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || ''
  const pathname = request.nextUrl.pathname
  
  // Verificar user agent suspeito ou ausente
  if (!userAgent || userAgent.length < 10) {
    return true
  }
  
  // Verificar padrões suspeitos no path
  const suspiciousPatterns = [
    /\.\./, // path traversal
    /\/admin\/\.\./, // tentativa de bypass
    /[<>"']/, // caracteres perigosos
    /\/\//, // double slash
    /%2e%2e/i, // .. encoded
    /%2f/i, // / encoded
  ]
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(pathname)) {
      return true
    }
  }
  
  // Verificar métodos HTTP não permitidos
  const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']
  if (!allowedMethods.includes(request.method)) {
    return true
  }
  
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIP(request)
  
  // Adicionar headers de segurança em todas as respostas
  let response = NextResponse.next()
  response = addSecurityHeaders(response)
  
  // Verificar requisições suspeitas
  if (isSuspiciousRequest(request)) {
    console.warn(`[SECURITY] Requisição suspeita bloqueada: ${request.method} ${pathname} de IP: ${ip}`)
    return new NextResponse('Bad Request', { status: 400 })
  }
  
  // Rate limiting geral
  const rateLimit = checkRateLimit(ip, false)
  if (!rateLimit.allowed) {
    console.warn(`[RATE LIMIT] IP ${ip} excedeu limite de requisições`)
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000))
      }
    })
  }
  
  // Adicionar headers de rate limit
  response.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX_REQUESTS))
  response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
  response.headers.set('X-RateLimit-Reset', String(Math.ceil(rateLimit.resetTime / 1000)))
  
  // Proteger rotas admin (exceto login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('auth-token')?.value
    
    console.log(`[MIDDLEWARE] Checking admin route: ${pathname}, has token: ${!!token}`)
    
    if (!token) {
      console.info(`[AUTH] Tentativa de acesso sem token: ${pathname} de IP: ${ip}`)
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    // Validar token JWT
    const tokenValidation = validateToken(token)
    
    console.log(`[MIDDLEWARE] Token validation result:`, {
      valid: tokenValidation.valid,
      error: tokenValidation.error,
      hasPayload: !!tokenValidation.payload
    })
    
    if (!tokenValidation.valid) {
      console.warn(`[AUTH] Token inválido: ${tokenValidation.error} - IP: ${ip} - Path: ${pathname}`)
      console.warn(`[AUTH] JWT_SECRET configurado: ${JWT_SECRET ? 'SIM' : 'NÃO'} (${JWT_SECRET?.substring(0, 10)}...)`)
      
      // Rate limiting para tentativas de auth falhadas
      const authRateLimit = checkRateLimit(ip, true)
      if (!authRateLimit.allowed) {
        console.error(`[SECURITY] Múltiplas tentativas de auth falhadas de IP: ${ip}`)
        return new NextResponse('Too Many Authentication Attempts', { 
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((authRateLimit.resetTime - Date.now()) / 1000))
          }
        })
      }
      
      // Remover cookie inválido
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      loginUrl.searchParams.set('error', 'session_expired')
      
      response = NextResponse.redirect(loginUrl)
      response.cookies.delete('auth-token')
      return addSecurityHeaders(response)
    }
    
    // Token válido - adicionar informações do usuário aos headers (opcional, para debug)
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('X-User-ID', tokenValidation.payload?.id || 'unknown')
      response.headers.set('X-User-Email', tokenValidation.payload?.email || 'unknown')
    }
    
    console.info(`[AUTH] ✅ Acesso autorizado: ${pathname} - User: ${tokenValidation.payload?.email} - IP: ${ip}`)
  }
  
  // Proteger rotas de API admin
  if (pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }
    
    const tokenValidation = validateToken(token)
    
    if (!tokenValidation.valid) {
      const authRateLimit = checkRateLimit(ip, true)
      if (!authRateLimit.allowed) {
        return NextResponse.json(
          { error: 'Muitas tentativas de autenticação' },
          { status: 429 }
        )
      }
      
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
