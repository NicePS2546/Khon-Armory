const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("./db");

console.log("Login router loaded"); // debugging
router.post("/submit", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ? ", [
      username,
    ]);
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (rows.length === 0) {
      return res.status(401).json({ message: "User Not Found", status: 401 });
    }

    if (passwordMatch) {
      req.session.user = {
        id: user.u_id,
        username: user.username,
      };
      req.session.save((err) => {
        if (err) console.log(err);
      });

      console.log("Session after login:", req.session); // <-- debug

      res.json({
        message: "Login Success",
        data: user,
        status: 200,
      });
    } else {
      res.json({
        message: "Password Not Match",
        status: 401,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed to Connect to Server",
      error: err,
      status: 500,
    });
  }
});

module.exports = router;
