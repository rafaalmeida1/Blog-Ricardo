import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret-key'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    const info = {
      hasToken: !!token,
      tokenLength: token?.length || 0,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'none',
      jwtSecretLength: JWT_SECRET?.length || 0,
      jwtSecretPreview: JWT_SECRET?.substring(0, 10) + '...',
      jwtSecretIsFallback: JWT_SECRET === 'fallback-secret-key',
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any
        info['decoded'] = {
          id: decoded.id,
          email: decoded.email,
          exp: decoded.exp,
          expired: decoded.exp ? decoded.exp < Date.now() / 1000 : false,
          now: Math.floor(Date.now() / 1000)
        }
      } catch (error: any) {
        info['decodeError'] = {
          name: error.name,
          message: error.message
        }
      }
    }
    
    return NextResponse.json(info)
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

