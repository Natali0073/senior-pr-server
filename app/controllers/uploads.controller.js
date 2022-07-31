const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

exports.uploadAvatar = (req, res) => {
  console.log(2222, req.file);
  uploadFile(req.file, 'users-avatars', res);
};

exports.uploadFiles = (req, res) => {
  console.log(req.files);
};

const uploadFile = (file, folderName, res) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${folderName}/${file.filename}_${file.originalname}`,
    Body: file.buffer
  };

  s3.upload(params, function (err, data) {
    if (err) {
      return res.status(400).send({ message: err });
    }
    return res.status(200).send({ message: data.Location });
  });
};