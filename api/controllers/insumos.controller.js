const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getInsumos = async (req, res) => {
  try {
    const insumos = await prisma.insumo.findMany();
    res.json(insumos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener insumos' });
  }
};

const createInsumo = async (req, res) => {
  try {
    const { nombre, stock, stockMinimo } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const nuevo = await prisma.insumo.create({
      data: {
        nombre,
        stock: stock || 0,
        stockMinimo: stockMinimo || 0
      }
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear insumo' });
  }
};

const updateInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, stock, stockMinimo } = req.body;
    const actualizado = await prisma.insumo.update({
      where: { id: parseInt(id) },
      data: { nombre, stock, stockMinimo }
    });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar insumo' });
  }
};

const deleteInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if it's used in recipes
    const recetasUsando = await prisma.recetaItem.count({ where: { insumoId: parseInt(id) } });
    if (recetasUsando > 0) {
      return res.status(400).json({ error: 'No se puede eliminar porque está siendo usado en recetas' });
    }
    
    await prisma.insumo.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Insumo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar insumo' });
  }
};

module.exports = {
  getInsumos,
  createInsumo,
  updateInsumo,
  deleteInsumo
};
