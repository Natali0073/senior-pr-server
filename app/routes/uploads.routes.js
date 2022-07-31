const { multerMiddleware } = require("../middleware");
const controller = require("../controllers/uploads.controller");
const multer = require('multer');

module.exports = function (app) {
  app.use(function (error, req, res, next) {

    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
    // if (error instanceof multer.MulterError) {
    //   if (error.code === "LIMIT_FILE_SIZE") {
    //     return res.status(400).json({ message: "File is too large" });
    //   }
    // }
  });
  app.post("/api/set-avatar", [multerMiddleware.upload.single("image")], controller.uploadAvatar);
  app.post("/api/upload-files", [multerMiddleware.upload.array("files", 5)], controller.uploadFiles);
};