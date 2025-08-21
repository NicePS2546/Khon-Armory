const express = require("express");
const router = express.Router();
const db = require("../db"); // your database connection (mysql2/promise or sqlite)

// Add to cart

console.log("add cart router loaded"); // debugging
router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // check if already exists
    const [rows] = await db.query(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (rows.length > 0) {
      // update qty
      await db.query(
        "UPDATE cart SET qty = qty + 1 WHERE user_id = ? AND product_id = ?",
        [userId, productId]
      );
    } else {
      // insert new row
      await db.query(
        "INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, 1)",
        [userId, productId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Fetch cart
router.get("/cart", async (req, res) => {
  const userId = req.query.userId;
  const [rows] = await db.query("SELECT * FROM cart WHERE user_id = ?", [
    userId,
  ]);
  res.json(rows);
});

module.exports = router;
