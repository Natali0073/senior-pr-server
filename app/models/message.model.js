module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define("messages", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    chatID: {
      type: Sequelize.UUID,
      allowNull: false
    },
    senderID: {
      type: Sequelize.UUID,
      allowNull: false
    },
    text: {
      type: Sequelize.STRING
    },
    date: {
      type: Sequelize.DATE
    }
  });
  return Message;
};