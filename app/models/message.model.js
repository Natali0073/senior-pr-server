module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("messages", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    chatId: {
      type: Sequelize.UUID,
      references: {
        model: 'chats',
        key: 'id'
      }
    },
    senderId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    text: {
      type: Sequelize.TEXT
    }
  });
  return Message;
};