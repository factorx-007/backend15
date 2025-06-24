require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.URI, {
  dialect: 'postgres', // Ya está incluido en tu URI, pero es buena práctica especificarlo.
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  // **MUY IMPORTANTE para Supabase:** Agrega las opciones SSL
  dialectOptions: {
    ssl: {
      require: true, // Esto es crucial para Supabase
      rejectUnauthorized: false, // Puedes cambiar a true en producción si usas un certificado CA
    },
  },
});

module.exports = {
  sequelize,
  Sequelize
};