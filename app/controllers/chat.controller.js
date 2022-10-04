const { Op } = require("sequelize");
const db = require("../models");
const index = require("../../index");
const Chat = db.chat;
const Message = db.message;

exports.chats = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  Chat.findAndCountAll({
    where: {
      userIds: {
        [Op.like]: `%${req.userId}%`
      }
    },
    order: [['updatedAt', 'DESC']],
    offset: offset,
    limit: limit
  }).then(data => {
    const response = getChatsPagingData(data, page, limit);
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
    where: {
      [Op.or]: [
        { userIds: `${req.userId},${id}` },
        { userIds: `${id},${req.userId}` }
      ]
    },
    defaults: {
      userIds: `${req.userId},${id}`,
      updatedAt: new Date()
    }
  }).then(chat => {
    res.status(200).send(chat[0]);
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
      date: {
        [Op.lt]: lastMessageDate || new Date()
      }
    },
    order: [['date', 'DESC']],
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
    senderId: req.userId,
    text: req.body.text,
    date: new Date()
  })
    .then(async message => {
      const chat = await Chat.findOne({ where: { id: chatId } });
      await chat.update({ lastUpdate: new Date() });
      var userIds = chat.userIds.split(",", 2);
      userIds.forEach(id => index.io.emit(`chatUpdatedForUserId/${id}`, chat));
      index.io.emit(`newMessageInChatId/${chatId}`, message);
      res.status(200).send();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getChatsPagingData = (data, page, limit) => {
  const { count: totalItems, rows: chats } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, chats, totalPages, currentPage };
};
