import app from "./app";
import { PORT } from "./config";
import { prisma } from "./app";

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log("✅ Conexión a la base de datos establecida");

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor iniciado en el puerto ${PORT}`);
      console.log(`🚀 API disponible en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Manejo de señales de terminación
process.on("SIGINT", async () => {
  console.log("Cerrando conexiones...");
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar servidor
startServer();