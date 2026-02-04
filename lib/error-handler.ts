// Global error handler to catch and log suspicious errors
if (typeof process !== 'undefined') {
  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    // Filter out known Next.js errors that are safe to ignore
    if (error.message.includes('NEXT_REDIRECT')) {
      return // This is a Next.js redirect, not an error
    }
    
    // Log suspicious errors
    if (
      error.message.includes('returnNaN') ||
      error.message.includes('/lrt') ||
      error.message.includes('EACCES') ||
      error.stack?.includes('returnNaN')
    ) {
      console.error('[SECURITY] Suspicious error detected:', {
        message: error.message,
        stack: error.stack?.substring(0, 500), // Limit stack trace
        timestamp: new Date().toISOString()
      })
      // Don't crash on suspicious errors, just log them
      return
    }
    
    // Log other uncaught exceptions
    console.error('[ERROR] Uncaught exception:', {
      message: error.message,
      name: error.name,
      timestamp: new Date().toISOString()
    })
  })

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    const errorMessage = reason?.message || String(reason)
    
    // Filter out known Next.js errors
    if (errorMessage.includes('NEXT_REDIRECT')) {
      return
    }
    
    // Log suspicious rejections
    if (
      errorMessage.includes('returnNaN') ||
      errorMessage.includes('/lrt') ||
      errorMessage.includes('EACCES')
    ) {
      console.error('[SECURITY] Suspicious rejection detected:', {
        reason: errorMessage.substring(0, 200),
        timestamp: new Date().toISOString()
      })
      return
    }
    
    // Log other unhandled rejections
    console.error('[ERROR] Unhandled rejection:', {
      reason: errorMessage.substring(0, 200),
      timestamp: new Date().toISOString()
    })
  })
}

// Export a function to safely handle errors
export function safeErrorHandler(error: unknown, context?: string): void {
  if (error instanceof Error) {
    // Skip logging for known safe errors
    if (error.message.includes('NEXT_REDIRECT')) {
      return
    }
    
    console.error(`[ERROR]${context ? ` [${context}]` : ''}:`, {
      message: error.message,
      name: error.name,
      timestamp: new Date().toISOString()
    })
  } else {
    console.error(`[ERROR]${context ? ` [${context}]` : ''}:`, {
      error: String(error),
      timestamp: new Date().toISOString()
    })
  }
}

