const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  // Delete the items
  const deleted = await prisma.producto.deleteMany({
    where: {
      nombre: {
        in: [
          '1/2 Pollo al Horno C/ papas',
          '1/2 Pollo al Horno Solo',
          'Pollo al Horno C/ papas',
          'Pollo al Horno Solo',
          'Pollo al Horno C/ papas o ensalada',
          '1/2 Pollo al Horno C/ papas o ensalada'
        ]
      }
    }
  });
  console.log('Deleted products:', deleted.count);
  
  // List categories to see what they are named
  const c = await prisma.categoria.findMany();
  console.log('Categories:', c);
  
  // Clean up emoji for all categories
  await prisma.categoria.updateMany({
    data: {
      emoji: ''
    }
  });
  console.log('Cleared emojis from categories');
}

run().catch(console.error).finally(()=>prisma.$disconnect());
