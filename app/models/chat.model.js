module.exports = (sequelize, Sequelize) => {
  const Chat = sequelize.define("chats", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    lastUpdate: {
      type: Sequelize.DATE
    },
    userIDs: {
      type: Sequelize.STRING
    }
  });
  return Chat;
};