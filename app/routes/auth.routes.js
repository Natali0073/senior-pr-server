const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/register", [verifySignUp.checkDuplicateEmail], controller.register
  );

  app.post("/api/auth/login", controller.login);

  app.post("/api/auth/login-google", controller.loginWithGoogle);

  app.post("/api/auth/logout", [authJwt.verifyTokenCookies], controller.logout);

  app.post("/api/auth/reset-password", [authJwt.verifyResetPasswordToken], controller.resetPassword);

  app.post("/api/auth/change-password", [authJwt.verifyTokenCookies], controller.changePassword);
};