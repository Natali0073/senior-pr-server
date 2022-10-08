module.exports = {
  HOST: process.env.DB_ENV === 'development' ? 'mysqldb' : process.env.DB_HOST,
  USER: process.env.DB_ENV === 'development' ? 'root' : process.env.MYSQLDB_USER,
  PASSWORD: process.env.MYSQLDB_ROOT_PASSWORD,
  DB: process.env.DB_IDENTIFIER,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};