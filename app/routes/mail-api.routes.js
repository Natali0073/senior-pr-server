const express = require("express");
const router = express.Router();
const sendMailMethod = require("../controllers/send-mail.controller");

// Post request to send an email
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/sendmail", async (req, res) => {
    try {
      const result = await sendMailMethod(req.body);

      // send the response
      res.json({
        status: true,
        payload: result,
      });
    } catch (error) {
      console.error(error.message);
      res.json({
        status: false,
        payload: "Something went wrong in Sendmail Route.",
      });
    }
  })
};