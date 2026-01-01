import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('TU_SUPABASE_URL', 'TU_SUPABASE_ANON_KEY');

export default function FormularioMovimiento() {
  const [nombre, setNombre] = useState('');
  const [accion, setAccion] = useState('mover');
  const [destino, setDestino] = useState('');

  async function enviarAccion() {
    // Esto guarda la intención del jugador en una tabla de 'acciones_nocturnas'
    const { error } = await supabase.from('acciones_nocturnas').insert([
      { nombre_jugador: nombre, tipo: accion, casilla_destino: destino.toUpperCase() }
    ]);

    if (!error) alert("Acción enviada correctamente. ¡Buena suerte!");
    else alert("Hubo un error. Revisa tu nombre.");
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Enviar Acción Nocturna</h1>
      <label>Tu Nombre:</label>
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
      
      <label>Acción:</label>
      <select value={accion} onChange={(e) => setAccion(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
        <option value="mover">Moverse</option>
        <option value="acampar">Acampar</option>
      </select>

      <label>Casilla Destino (Ej: B5):</label>
      <input type="text" value={destino} onChange={(e) => setDestino(e.target.value)} style={{ width: '100%', marginBottom: '20px' }} />

      <button onClick={enviarAccion} style={{ width: '100%', padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none' }}>
        Confirmar Acción
      </button>
    </div>
  );
}
