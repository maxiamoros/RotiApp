const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateChatResponse = async (mensaje) => {
  try {
    // Obtener contexto de la base de datos
    const productos = await prisma.producto.findMany();
    const insumos = await prisma.insumo.findMany();
    const pedidos = await prisma.pedido.findMany({
      orderBy: { fecha: 'desc' },
      take: 5
    });

    const context = `
      Eres el Asistente Virtual de 'Rotisería Central'. Utiliza la siguiente información de la base de datos para responder a las preguntas del usuario.
      
      Productos (Menú y Precios):
      ${JSON.stringify(productos, null, 2)}
      
      Insumos (Stock Actual):
      ${JSON.stringify(insumos, null, 2)}
      
      Últimas ventas (Pedidos recientes):
      ${JSON.stringify(pedidos, null, 2)}
      
      Por favor, sé amable y profesional. Responde de forma concisa.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    const result = await model.generateContent([context, mensaje]);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error en el servicio de chat Gemini:', error);
    throw new Error(error.message);
  }
};

module.exports = {
  generateChatResponse
};
