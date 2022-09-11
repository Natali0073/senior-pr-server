const { authJwt, multerMiddleware } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/users", [authJwt.verifyTokenCookies], controller.users);
  app.get(
    "/api/users/:id",
    [authJwt.verifyTokenCookies],
    controller.userById
  );
  app.put('/api/user-update',
    [authJwt.verifyTokenCookies,
    multerMiddleware.upload.single("avatar")],
    controller.updatePersonalInfo),

    app.get("/api/current-user", [authJwt.verifyTokenCookies], controller.currentUser);
};