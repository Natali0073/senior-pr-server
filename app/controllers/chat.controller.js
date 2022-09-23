const { Op } = require("sequelize");
const db = require("../models");
const Chat = db.chat;
const Message = db.message;

exports.chats = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  Chat.findAndCountAll({
    where: {
      userIDs: {
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
};

exports.chatByUserId = (req, res) => {
  const id = req.query.id;
  if (!id || id.length === 0) {
    return res.status(400).send({ message: "Wrong user id" });
  }

  Chat.findOrCreate({
    where: {
      [Op.or]: [
        { userIDs: `${req.userId}, ${id}` },
        { userIDs: `${id}, ${req.userId}` }
      ]
    },
    defaults: {
      userIDs: `${req.userId}, ${id}`,
      updatedAt: new Date()
    }
  }).then(chat => {
    res.status(200).send(chat);
  })
};

exports.messagesByChatId = (req, res) => {
  const { lastMessageDate, size, id } = req.query;
  Message.findAll({
    where: {
      chatID: id,
      date: {
        [Op.lt]: lastMessageDate ?? new Date()
      }
    },
    order: [['date', 'DESC']],
    limit: size 
  }).then(messages => {
    res.status(200).send(messages);
  })
};

exports.saveMessage = (req, res) => {
  const { chatID, text } = req.body;
  Message.create({
    chatID: chatID,
    senderID: req.userId,
    text: text,
    date: new Date()
  })
    .then(message => {
      console.log(message);
      // TODO: trig socket
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
