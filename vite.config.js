import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Las consultas a /api se redirigen al servicio admin de pedidos360_kafka,
// que entrega los resultados de los consumidores report y audit.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000'
  const proxy = { '/api': apiUrl }

  return {
    plugins: [react()],
    server: { port: 5174, proxy },
    preview: { port: 5174, proxy }
  }
})
