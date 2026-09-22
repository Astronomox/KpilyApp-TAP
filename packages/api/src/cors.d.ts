declare module 'cors' {
  import type { RequestHandler } from 'express'

  interface CorsOptions {
    origin?: boolean | string | string[] | ((origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => void)
    methods?: string | string[]
    allowedHeaders?: string | string[]
    exposedHeaders?: string | string[]
    credentials?: boolean
    maxAge?: number
    preflightContinue?: boolean
    optionsSuccessStatus?: number
  }

  const cors: (options?: CorsOptions) => RequestHandler
  export default cors
}
