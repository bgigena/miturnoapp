const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.deleteMany();
  await prisma.role.deleteMany();
  
  await prisma.role.create({ data: { id: 1, nombre: 'ADMIN' } });
  await prisma.role.create({ data: { id: 2, nombre: 'PROVEEDOR' } });
  await prisma.role.create({ data: { id: 3, nombre: 'CLIENTE' } });
  
  console.log('Roles re-seeded correctly: 1: ADMIN, 2: PROVEEDOR, 3: CLIENTE');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());