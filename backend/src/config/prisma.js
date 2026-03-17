const { PrismaClient } = require('@prisma/client');

// Mantenemos una única instancia de Prisma Client durante el ciclo de vida de la aplicación
const prisma = new PrismaClient();

module.exports = prisma;
