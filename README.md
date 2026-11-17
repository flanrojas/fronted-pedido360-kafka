# fronted-pedido360-kafka

Monitor de solo lectura de la demo Kafka de Pedidos360, hecho en **React + Vite**. Muestra lo que calcularon los consumidores de Kafka del repositorio `pedidos360_kafka` y se actualiza cada 3 segundos. No requiere login.

- **Report** (consumer group `report`): eventos procesados, pedidos, cancelados, ventas por hora, pedidos activos por estado y tiempo de entrega.
- **Audit** (consumer group `audit`): los últimos 50 eventos leídos de `pedidos.eventos`, con partición y offset.

```text
bridge/producer.js ─▶ Kafka (pedidos.eventos) ─▶ report / audit ─▶ SQLite
                                                                    │
 este monitor ──/api/monitor/*──▶ admin (pedidos360_kafka, puerto 3000) ◀┘
```

## Requisitos

- Node.js 20.19 o superior.
- El repositorio `pedidos360_kafka` corriendo: Kafka (`docker compose up -d`), `npm run admin`, `npm run report` y `npm run audit`.

## Uso

```bash
npm install
npm run dev          # http://localhost:5174
```

Para generar eventos, en `pedidos360_kafka` ejecuta `npm run producer -- 2`. Los datos aparecen en el monitor en unos segundos.

Para servir una versión compilada:

```bash
npm run build
npm run preview      # http://localhost:5174
```

## Configuración

Vite redirige las consultas a `/api` hacia el servicio admin. Por defecto apunta a `http://localhost:3000`. Para otra URL, copia `.env.example` a `.env` y cambia `VITE_API_URL`.

## Estructura

```text
src/
  main.jsx          arranque de React
  App.jsx           página: indicadores, tablas de report y auditoría
  useMonitor.js     consulta /api/monitor/kpis y /api/monitor/eventos cada 3 s
  Tabla.jsx         tabla reutilizable
  styles.css        estilos
vite.config.js      puerto 5174 y proxy de /api al admin
```
