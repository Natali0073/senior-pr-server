const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: 'mysql',
    operatorsAliases: 0,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

sequelize.authenticate().then(() => {
  console.log("Success!");
}).catch((err) => {
  console.log(err);
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("./user.model.js")(sequelize, Sequelize);
db.chat = require("./chat.model.js")(sequelize, Sequelize);
db.message = require("./message.model.js")(sequelize, Sequelize);

db.user.hasMany(db.message);
db.message.belongsTo(db.user);

db.chat.hasMany(db.message);
db.message.belongsTo(db.chat);

db.user.belongsToMany(db.chat, { through: 'usersChats' });
db.chat.belongsToMany(db.user, { through: 'usersChats' });

sequelize.sync({ force: config.SHOULD_CLEAR });

module.exports = db;