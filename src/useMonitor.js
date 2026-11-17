import { useEffect, useState } from 'react'

const INTERVALO_MS = 3000

async function obtener(url) {
  const respuesta = await fetch(url)
  if (!respuesta.ok) throw new Error(`${url} respondió ${respuesta.status}`)
  return respuesta.json()
}

/**
 * Consulta cada 3 s los resultados de los consumidores:
 *  - /api/monitor/kpis    -> KPIs calculados por report
 *  - /api/monitor/eventos -> últimos eventos guardados por audit
 */
export function useMonitor() {
  const [kpis, setKpis] = useState(null)
  const [eventos, setEventos] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true

    async function actualizar() {
      try {
        const [nuevosKpis, nuevosEventos] = await Promise.all([
          obtener('/api/monitor/kpis'),
          obtener('/api/monitor/eventos')
        ])
        if (!activo) return
        setKpis(nuevosKpis)
        setEventos(nuevosEventos)
        setError(null)
      } catch (e) {
        if (activo) setError(e.message)
      }
    }

    actualizar()
    const intervalo = setInterval(actualizar, INTERVALO_MS)
    return () => {
      activo = false
      clearInterval(intervalo)
    }
  }, [])

  return { kpis, eventos, error }
}
