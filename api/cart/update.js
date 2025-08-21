const express = require("express");
const router = express.Router();
const db = require("../db");

console.log("update router loaded"); // debugging
router.post("/update", async (req, res) => {
  const { product_id, id, change } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE cart SET qty = qty + ? WHERE product_id = ? AND u_id = ?",
      [change, product_id, id]
    );

    res.json({
      message: "Update Success",
      result: result,
      status: 201,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to Update ", error: err, status: 500 });
  }
});

module.exports = router;
