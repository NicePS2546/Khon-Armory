const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3000;
const session = require("express-session");
const validateRouter = require("./api/validate");
const registerRouter = require("./api/register");
const loginRounter = require("./api/login");
const getItem = require("./api/cart/getItems");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configure session
app.use(
  session({
    secret: "QYuJFtZ45HEawz14SZgyzu+8dF6KNwW0xx4v12LtZwo=", // change this to a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);
// Home route
app.get("/", (req, res) => {
  console.log("GET / called");
  if (!req.session.user) {
    console.log(req.session.user);
    res.redirect("/login.html");
  } else {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }
});

// Login page route
app.get("/login", (req, res) => {
  console.log("Login = ", req.session.user);
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  }
});

app.get("/session-status", (req, res) => {
  res.json({ user: req.session.user || null });
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // if using default cookie name
    res.json({ message: "Logged out successfully" });
  });
});
// เสิร์ฟไฟล์ static จากโฟลเดอร์ htdocs/myweb-node/public
app.use(express.static(path.join(__dirname, "public")));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

//API Management
app.use("/validate", validateRouter);
app.use("/register", registerRouter);
app.use("/login", loginRounter);

//cart API

//Test Purpose
// app.get("/validate", (req, res) => {
//   res.json({ test: "ok" });
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
