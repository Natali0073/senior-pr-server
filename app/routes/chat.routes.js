const { authJwt } = require("../middleware");
const controller = require("../controllers/chat.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/chats", [authJwt.verifyTokenCookies], controller.chats);
  app.get("/api/chat", [authJwt.verifyTokenCookies], controller.chatByReceiverId);
  app.get("/api/chat/:id/messages", [authJwt.verifyTokenCookies], controller.messagesByChatId);
  app.post("/api/chat/:id/send", [authJwt.verifyTokenCookies], controller.saveMessage);
};