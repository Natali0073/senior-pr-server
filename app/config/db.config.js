module.exports = {
  HOST: process.env.DB_ENV === 'development' ? 'localhost' : process.env.DB_HOST,
  USER: "nataliamakarchuk",
  PASSWORD: "password",
  DB: process.env.DB_ENV === 'development' ? 'api' : process.env.DB_IDENTIFIER,
  dialect: "mysql",
  // dialect: "postgres",
  // port: 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};