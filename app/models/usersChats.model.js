module.exports = (sequelize, Sequelize) => {
  const UsersChats = sequelize.define("usersChats", {
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    chatId: {
      type: Sequelize.UUID,
      references: {
        model: 'chats',
        key: 'id'
      }
    }
  });
  return UsersChats;
};