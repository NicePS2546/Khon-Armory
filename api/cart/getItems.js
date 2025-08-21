const express = require("express");
const router = express.Router();
const db = require("../db");

console.log("cart get item router loaded"); // debugging
router.post("/get", async (req, res) => {
  const { id } = req.body;
  //   console.log("called cart get api u_id = ", id);
  try {
    const [data] = await db.query(
      "SELECT product_id as id,u_id, name,price,qty,img  FROM cart WHERE u_id = ? ",
      [id]
    );

    console.log(data);
    res.json({
      message: "Get Data Success",
      products: data,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to Get Data ", error: err, status: 500 });
  }
});

module.exports = router;
