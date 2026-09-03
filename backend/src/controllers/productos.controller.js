const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        categoria: true,
        receta: {
          include: {
            insumo: true
          }
        }
      }
    });
    // Formatear para que el frontend lo reciba de forma compatible
    const formateados = productos.map(p => ({
      ...p,
      categoriaNombre: p.categoria?.nombre || 'Sin Categoria',
      emoji: p.categoria?.emoji || '🍔', // O usar otra lógica
    }));
    res.json(formateados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

const createProducto = async (req, res) => {
  try {
    const { nombre, precio, imagenUrl, categoriaId, receta } = req.body;
    
    // receta debe ser un array de { insumoId, cantidad }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio: parseFloat(precio),
        imagenUrl,
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
        receta: receta ? {
          create: receta.map(r => ({
            insumoId: parseInt(r.insumoId),
            cantidad: parseFloat(r.cantidad)
          }))
        } : undefined
      },
      include: {
        categoria: true,
        receta: {
          include: { insumo: true }
        }
      }
    });
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, imagenUrl, categoriaId, receta } = req.body;

    // Primero actualizamos los datos básicos y borramos receta antigua si se envía una nueva
    const productoActualizado = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        precio: parseFloat(precio),
        imagenUrl,
        categoriaId: categoriaId ? parseInt(categoriaId) : null,
        // Si mandamos receta, recreamos las relaciones
        ...(receta && {
          receta: {
            deleteMany: {}, // Borramos las anteriores
            create: receta.map(r => ({
              insumoId: parseInt(r.insumoId),
              cantidad: parseFloat(r.cantidad)
            }))
          }
        })
      },
      include: {
        categoria: true,
        receta: {
          include: { insumo: true }
        }
      }
    });

    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.producto.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};

module.exports = {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto
};
