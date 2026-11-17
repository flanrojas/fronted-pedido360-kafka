/**
 * Tabla simple.
 * columnas: [{ titulo, valor: fila => texto, num?: true }]
 */
export default function Tabla({ columnas, filas }) {
  if (filas.length === 0) return <p className="vacio">Sin datos todavía.</p>

  return (
    <table>
      <thead>
        <tr>
          {columnas.map(c => (
            <th key={c.titulo} className={c.num ? 'num' : ''}>{c.titulo}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, i) => (
          <tr key={i}>
            {columnas.map(c => (
              <td key={c.titulo} className={c.num ? 'num' : ''}>{c.valor(fila)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
