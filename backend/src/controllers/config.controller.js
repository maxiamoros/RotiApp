const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getConfig = async (req, res) => {
  try {
    const configs = await prisma.configuracion.findMany();
    const configObj = {};
    configs.forEach(c => {
      configObj[c.clave] = c.valor;
    });
    res.json(configObj);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Error al obtener configuracion' });
  }
};

exports.updateConfig = async (req, res) => {
  try {
    const { clave, valor } = req.body;
    
    if (!clave) return res.status(400).json({ error: 'Falta clave' });

    const updated = await prisma.configuracion.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor }
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Error al actualizar configuracion' });
  }
};

exports.batchUpdateConfig = async (req, res) => {
  try {
    const configs = req.body;
    if (!Array.isArray(configs)) return res.status(400).json({ error: 'Se esperaba un arreglo' });

    for (const conf of configs) {
      await prisma.configuracion.upsert({
        where: { clave: conf.clave },
        update: { valor: conf.valor },
        create: { clave: conf.clave, valor: conf.valor }
      });
    }

    res.json({ message: 'Configuracion actualizada' });
  } catch (error) {
    console.error('Error batch updating config:', error);
    res.status(500).json({ error: 'Error al actualizar configuracion' });
  }
};
