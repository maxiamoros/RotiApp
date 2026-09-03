require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.usuario.findUnique({
    where: { username: 'admin' },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        rol: 'GERENTE',
      },
    });
    console.log('✅ Usuario Administrador raíz creado con éxito.');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Rol: GERENTE');
  } else {
    console.log('ℹ️ El usuario administrador ya existe.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
