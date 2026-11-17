import Tabla from './Tabla.jsx'
import { useMonitor } from './useMonitor.js'

const pesos = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' })
const hora = new Intl.DateTimeFormat('es-CL', { dateStyle: 'short', timeStyle: 'medium' })
const minutos = v => (v === null || v === undefined ? '–' : `${v} min`)

function Indicador({ etiqueta, valor }) {
  return (
    <div className="tarjeta">
      <div className="etiqueta">{etiqueta}</div>
      <div className="numero">{valor}</div>
    </div>
  )
}

function Seccion({ titulo, descripcion, children }) {
  return (
    <section className="tarjeta">
      <h2>{titulo}</h2>
      <p className="sub">{descripcion}</p>
      {children}
    </section>
  )
}

export default function App() {
  const { kpis, eventos, error } = useMonitor()

  return (
    <main>
      {error && <p className="error">No se pudo actualizar ({error}). ¿Está corriendo npm run admin en pedidos360_kafka?</p>}

      {!kpis ? (
        !error && <p className="vacio">Cargando…</p>
      ) : (
        <>
          {/* Report: KPIs */}
          <div className="fila">
            <Indicador etiqueta="Eventos procesados (report)" valor={kpis.eventosProcesados} />
            <Indicador etiqueta="Pedidos" valor={kpis.pedidos} />
            <Indicador etiqueta="Tiempo de entrega promedio" valor={minutos(kpis.tiempoEntrega.promedioMinutos)} />
            <Indicador etiqueta="Cancelados" valor={kpis.cancelados} />
          </div>

          <div className="fila">
            <Seccion titulo="Ventas por hora" descripcion="Pedidos entregados, por hora UTC de entrega.">
              <Tabla
                filas={kpis.ventasPorHora}
                columnas={[
                  { titulo: 'Hora (UTC)', valor: f => f.hora.replace('T', ' ') },
                  { titulo: 'Pedidos', valor: f => f.pedidos, num: true },
                  { titulo: 'Monto', valor: f => pesos.format(f.monto), num: true }
                ]}
              />
            </Seccion>

            <Seccion titulo="Pedidos activos por estado" descripcion="Pedidos que aún no están entregados ni cancelados.">
              <Tabla
                filas={kpis.activosPorEstado}
                columnas={[
                  { titulo: 'Estado', valor: f => f.estado },
                  { titulo: 'Pedidos', valor: f => f.pedidos, num: true }
                ]}
              />
            </Seccion>

            <Seccion titulo="Tiempo de entrega" descripcion="Desde PEDIDO_CREADO hasta PEDIDO_ENTREGADO.">
              <Tabla
                filas={[
                  ['Pedidos entregados', kpis.tiempoEntrega.pedidos],
                  ['Promedio', minutos(kpis.tiempoEntrega.promedioMinutos)],
                  ['Mínimo', minutos(kpis.tiempoEntrega.minimoMinutos)],
                  ['Máximo', minutos(kpis.tiempoEntrega.maximoMinutos)]
                ]}
                columnas={[
                  { titulo: 'Medida', valor: f => f[0] },
                  { titulo: 'Valor', valor: f => f[1], num: true }
                ]}
              />
            </Seccion>
          </div>

          {/* Audit: últimos eventos */}
          <Seccion
            titulo="Auditoría: últimos eventos"
            descripcion="Cada evento leído de Kafka por el grupo audit, con su partición y offset (los más recientes primero)."
          >
            <Tabla
              filas={eventos}
              columnas={[
                { titulo: 'Recibido', valor: f => hora.format(new Date(f.recibidoEn)) },
                { titulo: 'Evento', valor: f => f.tipo },
                { titulo: 'Pedido', valor: f => f.pedidoId },
                { titulo: 'Total', valor: f => pesos.format(f.total), num: true },
                { titulo: 'Partición', valor: f => f.particion, num: true },
                { titulo: 'Offset', valor: f => f.offset, num: true }
              ]}
            />
          </Seccion>
        </>
      )}
    </main>
  )
}
