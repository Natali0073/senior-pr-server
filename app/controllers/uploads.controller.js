const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.uploadFile = async (req, folderName, res, next) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${folderName}/${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult;
};

exports.deleteFile = async (folderName, fileName) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${folderName}/${fileName}`
  };

  const deleteResult = await s3.deleteObject(params).promise();
  return deleteResult;
};