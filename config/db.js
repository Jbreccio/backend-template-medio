const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Erro na conexão com MongoDB:', err.message);
    process.exit(1); // Mata o processo
  }
};

module.exports = connectDB;
