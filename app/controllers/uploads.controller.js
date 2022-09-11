const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

exports.uploadAvatar = (req, res) => {
  uploadFile(req, 'users-avatars', res);
};

exports.uploadFile = async (req, folderName, res, next) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${folderName}/${req.file.filename}_${req.file.originalname}`,
    Body: req.file.buffer
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult;
};