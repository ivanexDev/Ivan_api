const mongoose = require("mongoose");
const createError = require("http-errors");

const connectToDatabase = async () => {
  const connectionString = process.env.DB_STRING;

  try {
    await mongoose.connect(connectionString);

    console.info("Base de datos conectada correctamente.");
  } catch (error) {
    throw createError(500, "Error al conectar a la base de datos.");
  }
};

module.exports = { connectToDatabase };
