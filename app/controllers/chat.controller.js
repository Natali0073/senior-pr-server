const { Op } = require("sequelize");
const db = require("../models");
const index = require("../../index");
const { utils: { getPagination, getPagingData } } = require("../shared");
const Chat = db.chat;
const User = db.user;
const Message = db.message;

const excludedFromUser = ['password', 'personalKey', 'usersChats'];
const excludedFromChat = ['userIds'];

exports.chats = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  Chat.findAndCountAll({
    attributes: { exclude: excludedFromChat },
    where: {
      userIds: {
        [Op.like]: `%${req.userId}%`
      }
    },
    order: [['updatedAt', 'DESC']],
    offset: offset,
    limit: limit,
    include: {
      model: User,
      as: 'users',
      attributes: { exclude: excludedFromUser },
      where: {
        id: { [Op.ne]: req.userId }
      }
    }
  }).then(data => {
    const response = getPagingData(data, page, limit, 'chats');
    response.chats = response.chats.map(chat => mapChat(chat));
    res.status(200).send(response);
  })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.chatByReceiverId = (req, res) => {
  const id = req.query.receiverId;
  if (!id || id.length === 0) {
    return res.status(400).send({ message: "Wrong user id" });
  }

  Chat.findOrCreate({
    attributes: { exclude: excludedFromChat },
    where: {
      [Op.or]: [
        { userIds: `${req.userId},${id}` },
        { userIds: `${id},${req.userId}` }
      ]
    },
    include: {
      model: User,
      as: 'users',
      attributes: { exclude: excludedFromUser },
      where: {
        id: { [Op.eq]: id }
      }
    },
    defaults: {
      userIds: `${req.userId},${id}`
    }
  }).then(async chat => {
    if (chat[1]) {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { id: req.userId },
            { id: id }
          ]
        }
      });

      res.status(200).send(mapChat(chat[0].dataValues, users.filter((x) => x.id === id)));
      await chat[0].setUsers(users);

      // trigger socket??
      return
    }
    res.status(200).send(mapChat(chat[0]));
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.messagesByChatId = (req, res) => {
  const { lastMessageDate, size } = req.query;
  Message.findAll({
    where: {
      chatId: req.params.id,
      createdAt: {
        [Op.lt]: lastMessageDate || new Date()
      }
    },
    order: [['createdAt', 'DESC']],
    limit: +size
  }).then(messages => {
    res.status(200).send(messages);
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.saveMessage = (req, res) => {
  const chatId = req.params.id;
  Message.create({
    chatId: chatId,
    userId: req.userId,
    text: req.body.text
  })
    .then(async message => {
      const chat = await Chat.findOne({
        where: { id: chatId },
        include: {
          model: User,
          as: 'users',
          attributes: { exclude: excludedFromUser }
        }
      });
      chat.addMessage(message);
      await chat.update({ lastMessageText: req.body.text });
      var userIds = chat.userIds.split(",", 2);
      userIds.forEach(id => {
        const user = chat.users.filter(user => user.id !== id)
        index.io.emit(`chatUpdatedForUserId/${id}`, mapChat(chat, user))
      });
      index.io.emit(`newMessageInChatId/${chatId}`, message);
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const mapChat = (chat, users) => ({
  id: chat.id,
  lastMessageText: chat.lastMessageText || '',
  updatedAt: chat.updatedAt,
  name: (users || chat.users || [])[0].fullName,
  icon: (users || chat.users || [])[0].avatar,
  chatBanned: (users || chat.users || [])[0].isBanned
});