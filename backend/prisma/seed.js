const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed del menú real...');

  // 1. Crear Categorías
  const categoriasBase = [
    { nombre: 'MINUTAS', emoji: '' },
    { nombre: 'MENÚ DIARIO', emoji: '' },
    { nombre: 'OTRAS OPCIONES', emoji: '' },
    { nombre: 'TARTAS', emoji: '' },
    { nombre: 'BEBIDAS', emoji: '' },
    { nombre: 'POSTRES', emoji: '' },
  ];

  const categoriasDb = {};
  for (const cat of categoriasBase) {
    const creada = await prisma.categoria.upsert({
      where: { nombre: cat.nombre },
      update: { emoji: cat.emoji },
      create: { nombre: cat.nombre, emoji: cat.emoji },
    });
    categoriasDb[creada.nombre] = creada;
  }
  console.log('✅ Categorías reales creadas/actualizadas.');

  // Imágenes genéricas
  const IMG_EMPANADAS = 'https://images.unsplash.com/photo-1626200419188-75c13e778401?auto=format&fit=crop&q=80&w=300';
  const IMG_PIZZA = 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=300';
  const IMG_MILANESA = 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=300';
  const IMG_MENU = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300';
  const IMG_POLLO = 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=300';
  const IMG_PAPAS = 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=300';
  const IMG_LECHON = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=300';
  const IMG_TARTA = 'https://images.unsplash.com/photo-1601000938259-9e92002320b2?auto=format&fit=crop&q=80&w=300';
  const IMG_BEBIDAS = 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80&w=300';
  const IMG_POSTRES = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=300';

  // 2. Crear Productos Reales
  const productosBase = [
    // MINUTAS
    { nombre: 'Empanadas Jamón y Queso (x Docena)', precio: 6000, imagenUrl: IMG_EMPANADAS, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Empanadas Pollo (x Docena)', precio: 6000, imagenUrl: IMG_EMPANADAS, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Empanadas de Osobuco (x Docena)', precio: 8000, imagenUrl: IMG_EMPANADAS, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Empanadas Carne Tradicional (x Docena)', precio: 6000, imagenUrl: IMG_EMPANADAS, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Pizza Grande Mozzarella', precio: 5000, imagenUrl: IMG_PIZZA, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Pizza Grande Especial', precio: 6000, imagenUrl: IMG_PIZZA, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Milanesas Común Individual C/ fritas', precio: 5000, imagenUrl: IMG_MILANESA, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Milanesa Napolitana individual C/ fritas', precio: 6000, imagenUrl: IMG_MILANESA, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Milanesas Común P/ Compartir c/ Fritas', precio: 9000, imagenUrl: IMG_MILANESA, categoriaId: categoriasDb['MINUTAS'].id },
    { nombre: 'Milanesas Napolitana P/ Compartir c/ Fritas', precio: 10000, imagenUrl: IMG_MILANESA, categoriaId: categoriasDb['MINUTAS'].id },

    // OTRAS OPCIONES
    { nombre: 'Pollo al Horno C/ papas o ensalada', precio: 16000, imagenUrl: IMG_POLLO, categoriaId: categoriasDb['OTRAS OPCIONES'].id },
    { nombre: 'Pollo al Horno Solo', precio: 14000, imagenUrl: IMG_POLLO, categoriaId: categoriasDb['OTRAS OPCIONES'].id },
    { nombre: '1/2 Pollo al Horno C/ papas o ensalada', precio: 9000, imagenUrl: IMG_POLLO, categoriaId: categoriasDb['OTRAS OPCIONES'].id },
    { nombre: '1/2 Pollo al Horno Solo', precio: 8000, imagenUrl: IMG_POLLO, categoriaId: categoriasDb['OTRAS OPCIONES'].id },
    { nombre: 'Porción Papas Fritas', precio: 2000, imagenUrl: IMG_PAPAS, categoriaId: categoriasDb['OTRAS OPCIONES'].id },

    // TARTAS
    { nombre: 'Tarta Verdura', precio: 3500, imagenUrl: IMG_TARTA, categoriaId: categoriasDb['TARTAS'].id },
    { nombre: 'Tarta Verdura y Pollo', precio: 3500, imagenUrl: IMG_TARTA, categoriaId: categoriasDb['TARTAS'].id },
    { nombre: 'Tarta Jamón y Queso', precio: 3500, imagenUrl: IMG_TARTA, categoriaId: categoriasDb['TARTAS'].id },

    // BEBIDAS
    { nombre: 'Gaseosa 1.5L (Coca-Cola, Sprite, Paso de los Toros)', precio: 2200, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Gaseosa 2.25L / 3L', precio: 3000, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Gaseosa 500ml (Variedades)', precio: 1200, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Aguas Saborizadas 1.5L (Aquarius / Levité)', precio: 2000, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Agua Mineral 500ml (Con y Sin gas)', precio: 900, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Agua Mineral 1.5L', precio: 1500, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Cerveza en Botella 1L (Brahma, Quilmes, Stella Artois)', precio: 2800, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Cerveza en Lata 473ml', precio: 1600, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },
    { nombre: 'Sifón de Soda 1.5L', precio: 1000, imagenUrl: IMG_BEBIDAS, categoriaId: categoriasDb['BEBIDAS'].id },

    // POSTRES
    { nombre: 'Flan Casero con Dulce de Leche', precio: 1500, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
    { nombre: 'Flan Casero Mixto (Dulce de leche y crema)', precio: 1700, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
    { nombre: 'Budín de Pan Casero', precio: 1400, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
    { nombre: 'Queso y Dulce (Vigilante - Membrillo o Batata)', precio: 1600, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
    { nombre: 'Tiramisú Casero', precio: 2000, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
    { nombre: 'Postre Chocotorta', precio: 2200, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
    { nombre: 'Mousse de Chocolate', precio: 1800, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
    { nombre: 'Helado Individual (Pinta / Vaso)', precio: 2500, imagenUrl: IMG_POSTRES, categoriaId: categoriasDb['POSTRES'].id },
  ];

  for (const prod of productosBase) {
    let dbProd = await prisma.producto.findFirst({ where: { nombre: prod.nombre } });
    if (!dbProd) {
      dbProd = await prisma.producto.create({
        data: prod,
      });
      console.log(`✅ Producto creado: ${dbProd.nombre}`);
    } else {
      // Actualizar por si cambiaron el precio o categoría
      await prisma.producto.update({
        where: { id: dbProd.id },
        data: prod,
      });
    }
  }

  console.log('✅ Seed de productos reales finalizado correctamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
