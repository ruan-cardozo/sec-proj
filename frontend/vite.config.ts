import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const securityHeaders = () => {
  return {
    name: 'security-headers',
    configureServer(server: { middlewares: { use: (arg0: (req: any, res: any, next: any) => void) => void; }; }) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000 http://localhost:5173 blob:; frame-src 'self' http://localhost:3000 http://localhost:5173 blob:; object-src 'self'; img-src 'self' data:; media-src 'self'; font-src 'self'; frame-ancestors 'self' http://localhost:3000 http://localhost:5173 blob:; form-action 'self'; base-uri 'self';");
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'ALLOW-FROM http://localhost:3000 http://localhost:5173 blob:');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    securityHeaders()
  ],
})