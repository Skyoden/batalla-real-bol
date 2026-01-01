import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuración de conexión (usarás tus credenciales de Supabase)
const supabase = createClient('TU_SUPABASE_URL', 'TU_SUPABASE_ANON_KEY');

export default function PanelGM() {
  const [jugadores, setJugadores] = useState([]);
  const [noche, setNoche] = useState(1);

  // Cargar jugadores automáticamente
  useEffect(() => {
    fetchJugadores();
  }, []);

  async function fetchJugadores() {
    const { data } = await supabase.from('jugadores').select('*, inventarios(*)');
    setJugadores(data);
  }

  // BOTÓN MAESTRO: Ejecuta Cataclismo y procesa la noche
  async function procesarNoche() {
    // 1. Ejecutar Cataclismo (Llama a la función SQL que ya creamos)
    const { data: resCataclismo } = await supabase.rpc('ejecutar_cataclismo', { p_noche: noche });
    alert(resCataclismo);

    // 2. Aquí podrías agregar la lógica de movimientos recibidos
    // Por ahora, refrescamos la lista para ver quién murió por el cataclismo
    fetchJugadores();
    setNoche(noche + 1);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h1>Batalla Real - Panel del GM</h1>
      <p>Noche Actual: {noche} (Probabilidad Cataclismo: {noche === 1 ? '10%' : noche === 2 ? '20%' : '40%+'})</p>
      
      <button 
        onClick={procesarNoche}
        style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        PROCESAR NOCHE (Cataclismo y Combates)
      </button>

      <div style={{ marginTop: '20px' }}>
        <h2>Estado de los Jugadores</h2>
        <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Bando</th>
              <th>Posición</th>
              <th>Balas</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((j) => (
              <tr key={j.id} style={{ opacity: j.esta_vivo ? 1 : 0.5, backgroundColor: j.esta_vivo ? 'transparent' : '#333' }}>
                <td>{j.nombre}</td>
                <td>{j.bando}</td>
                <td>{j.posicion_actual}</td>
                <td>{j.inventarios?.[0]?.balas || 0}</td>
                <td>{j.esta_vivo ? '✅ Vivo' : '💀 Muerto'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
