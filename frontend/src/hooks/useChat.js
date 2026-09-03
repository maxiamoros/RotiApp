import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { leerProductos } from '../data/productos';
import { leerInsumos, estadoStock } from '../data/inventario';
import { leerVentas } from '../data/ventas';
import { leerPedidosKDS } from '../data/pedidosKDS';

// ─────────────────────────────────────────────────────────────
// Lee la API key desde la variable de entorno de Vite.
// En el archivo frontend/.env: VITE_GEMINI_API_KEY=AIza...
// ─────────────────────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const formatPeso = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n);

/** Construye el contexto del sistema leyendo localStorage */
function buildSystemPrompt() {
  const productos  = leerProductos();
  const insumos    = leerInsumos();
  const ventas     = leerVentas().slice(0, 20);
  const pedidosKDS = leerPedidosKDS().slice(0, 10);

  // Resumen de ventas del día
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const ventasHoy = ventas.filter(v => v.timestamp >= hoy.getTime());
  const totalHoy  = ventasHoy.reduce((s, v) => s + v.total, 0);

  // Insumos críticos
  const criticos = insumos
    .filter(i => ['critico', 'agotado', 'bajo'].includes(estadoStock(i)))
    .map(i => `${i.nombre}: ${i.stock} ${i.unidad} (mín: ${i.stockMinimo})`);

  // Top 5 productos más vendidos hoy
  const conteo = {};
  ventasHoy.forEach(v => (v.items || []).forEach(item => {
    conteo[item.nombre] = (conteo[item.nombre] || 0) + item.cantidad;
  }));
  const topHoy = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([n, c]) => `${n}: ${c} und.`)
    .join(', ');

  return `Eres "ANTI", el asistente inteligente de gestión de "Rotisería Central".
Eres experto en operaciones de rotisería: ventas, cocina, inventario y análisis de negocio.
Respondés en español rioplatense (tuteo informal pero profesional). Sés conciso y útil.
Podés dar recomendaciones, calcular métricas y hacer sugerencias operativas basadas en los datos reales.

=== DATOS EN TIEMPO REAL DEL SISTEMA ===

📋 MENÚ ACTIVO (${productos.filter(p => p.activo).length} productos):
${productos.filter(p => p.activo).map(p => `- ${p.nombre}: ${formatPeso(p.precio)} (${p.categoria})`).join('\n')}

Productos inactivos: ${productos.filter(p => !p.activo).map(p => p.nombre).join(', ') || 'ninguno'}

📦 INVENTARIO (${insumos.length} insumos):
${insumos.map(i => `- ${i.nombre}: ${i.stock} ${i.unidad} [${estadoStock(i).toUpperCase()}]`).join('\n')}

⚠️ ALERTAS DE STOCK (${criticos.length}):
${criticos.length > 0 ? criticos.join('\n') : 'Sin alertas — todo el stock está sobre el mínimo'}

💰 VENTAS DE HOY:
- Total facturado: ${formatPeso(totalHoy)}
- Cantidad de ventas: ${ventasHoy.length}
- Ticket promedio: ${ventasHoy.length > 0 ? formatPeso(totalHoy / ventasHoy.length) : formatPeso(0)}
- Más vendidos hoy: ${topHoy || 'sin ventas aún'}

🍳 PEDIDOS EN COCINA AHORA:
${pedidosKDS.filter(p => p.estado !== 'listo').map(p =>
  `- ${p.numero} [${p.estado.toUpperCase()}]: ${(p.items || []).map(i => `${i.nombre} x${i.cantidad}`).join(', ')}`
).join('\n') || 'Sin pedidos activos en cocina'}

=== FIN DE DATOS ===

Cuando el usuario pregunte sobre ventas, stock, pedidos o productos, usá estos datos para responder con precisión.
Si te preguntan algo que no está en los datos, decí que no tenés esa información disponible en este momento.
`;
}

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy **ANTI**, tu asistente de gestión 🤖\n\nPuedo ayudarte con:\n- 📊 Consultas de ventas y estadísticas\n- 📦 Estado del inventario y alertas\n- 🍳 Pedidos en cocina\n- 💡 Sugerencias operativas\n\n¿En qué puedo ayudarte?'
    }
  ]);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState(null);
  const [chatSession, setChatSession] = useState(null);

  const getOrCreateSession = () => {
    if (!API_KEY || API_KEY === 'TU_CLAVE_AQUI') {
      throw new Error('API_KEY_MISSING');
    }
    if (chatSession) return chatSession;

    const genAI    = new GoogleGenerativeAI(API_KEY);
    const model    = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: buildSystemPrompt(),
    });
    const session  = model.startChat({ history: [] });
    setChatSession(session);
    return session;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const session = getOrCreateSession();
      // Actualizamos el contexto en cada mensaje mandándolo al modelo
      const contextUpdate = `[Contexto actualizado: ${new Date().toLocaleTimeString('es-AR')}]\n`;
      const result  = await session.sendMessage(contextUpdate + userMessage);
      const text    = result.response.text();
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (err) {
      console.error('Error IA completo:', err);
      let mensajeError = `❌ **Error:** ${err.message}`;

      if (err.message === 'API_KEY_MISSING') {
        mensajeError = '⚙️ **Falta la API key**\n\nAgregá `VITE_GEMINI_API_KEY=tu_clave` en `frontend/.env` y reiniciá el servidor.';
      } else if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('400') || err.message?.includes('401') || err.message?.includes('403')) {
        mensajeError = `🔑 **API key inválida o sin permisos**\n\nVerificá que la clave sea de Google AI Studio (aistudio.google.com) y empiece con \`AIza\`.\n\n_Error técnico: ${err.message}_`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: mensajeError }]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, setInput, isLoading, error, sendMessage };
};
