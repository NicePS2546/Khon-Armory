// api/validate.js
const express = require("express");
const router = express.Router();
const utils = require("../utils"); // CommonJS utils

console.log("Validate router loaded"); // debugging

router.get("/", (req, res) => {
  const { str } = req.query;
  const isValid = utils.isValidString(str);
  res.json({ isValid });
});

module.exports = router;
