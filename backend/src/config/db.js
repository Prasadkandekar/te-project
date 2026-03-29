const { PrismaClient } = require('@prisma/client');

// Create a singleton instance
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
    errorFormat: 'minimal',
  });
} else {
  // In development, use a global variable to prevent multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['warn', 'error'],
      errorFormat: 'pretty',
    });
  }
  prisma = global.prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => { 
  await prisma.$disconnect(); 
});

process.on('SIGINT', async () => { 
  await prisma.$disconnect(); 
  process.exit(0); 
});

process.on('SIGTERM', async () => { 
  await prisma.$disconnect(); 
  process.exit(0); 
});

module.exports = prisma;
