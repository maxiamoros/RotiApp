const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        _count: {
          select: { productos: true }
        }
      }
    });
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorias' });
  }
};

const createCategoria = async (req, res) => {
  try {
    const { nombre, emoji } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

    const nueva = await prisma.categoria.create({
      data: { nombre, emoji }
    });
    res.status(201).json(nueva);
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'La categoría ya existe' });
    res.status(500).json({ error: 'Error al crear categoria' });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, emoji } = req.body;
    const actualizada = await prisma.categoria.update({
      where: { id: parseInt(id) },
      data: { nombre, emoji }
    });
    res.json(actualizada);
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'El nombre ya está en uso' });
    res.status(500).json({ error: 'Error al actualizar categoria' });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if there are products
    const productosEnCategoria = await prisma.producto.count({ where: { categoriaId: parseInt(id) } });
    if (productosEnCategoria > 0) {
      return res.status(400).json({ error: 'No se puede eliminar porque tiene productos asignados' });
    }
    await prisma.categoria.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoria' });
  }
};

module.exports = {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria
};
