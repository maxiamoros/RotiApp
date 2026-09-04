const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const cBebidas = await prisma.categoria.findFirst({ where: { nombre: 'Bebidas' } });
  const cPostres = await prisma.categoria.findFirst({ where: { nombre: 'Postres' } });
  
  const cBEBIDAS = await prisma.categoria.findFirst({ where: { nombre: 'BEBIDAS' } });
  const cPOSTRES = await prisma.categoria.findFirst({ where: { nombre: 'POSTRES' } });
  
  if (cBebidas && cBEBIDAS) {
    await prisma.producto.updateMany({
      where: { categoriaId: cBEBIDAS.id },
      data: { categoriaId: cBebidas.id }
    });
    // Delete duplicate category BEBIDAS
    await prisma.categoria.delete({ where: { id: cBEBIDAS.id } });
  }

  if (cPostres && cPOSTRES) {
    await prisma.producto.updateMany({
      where: { categoriaId: cPOSTRES.id },
      data: { categoriaId: cPostres.id }
    });
    // Delete duplicate category POSTRES
    await prisma.categoria.delete({ where: { id: cPOSTRES.id } });
  }

  console.log('Fixed categories and deleted duplicates');
}

run().catch(console.error).finally(()=>prisma.$disconnect());
