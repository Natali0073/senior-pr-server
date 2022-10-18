module.exports = (sequelize, Sequelize) => {
  const Chat = sequelize.define("chats", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    lastMessageText: {
      type: Sequelize.TEXT
    },
    userIds: {
      type: Sequelize.STRING
    }
  });
  return Chat;
};