const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("./db");

console.log("Register router loaded"); // debugging
router.post("/submit", async (req, res) => {
  const { username, password } = req.body;
  const saltedRound = 10;
  const hashedPassword = await bcrypt.hash(password, saltedRound);
  console.log(process.env.DB_NAME);
  try {
    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );
    res.json({
      message: "Register Success",
      insertId: result.insertId,
      status: 201,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to register ", error: err, status: 500 });
  }
});

module.exports = router;
