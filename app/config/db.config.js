module.exports = {
  HOST: "localhost",
  USER: "nataliia-makarchuk",
  PASSWORD: "password",
  DB: "api",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
