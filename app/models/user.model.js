module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    fullName: {
      type: Sequelize.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
      set(value) {
        throw new Error('Do not try to set the `fullName` value!');
      }
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    avatar: {
      type: Sequelize.STRING
    },
    avatarFileName: {
      type: Sequelize.VIRTUAL,
      get() {
        const result = this.avatar?.substring(this.avatar?.lastIndexOf('/') + 1);
        return result ? result : undefined;
      },
      set(value) {
        throw new Error('Do not try to set the `avatarFileName` value!');
      }
    },
    role: {
      type: Sequelize.STRING
    },
    isBanned: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    personalKey: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return User;
};