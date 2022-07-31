const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new Error('File format is incorrect'), true);
  }
}

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2000000
  }
});

const multerMiddleware = {
  upload: upload
};
module.exports = multerMiddleware;