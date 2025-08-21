const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");

const validateRouter = require("./api/validate");
const registerRouter = require("./api/register");
const loginRouter = require("./api/login");
const getCartItems = require("./api/cart/getItems");

const app = express();
const port = 3000;

// -------------------- Middleware --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve only static assets (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Configure session
app.use(
  session({
    secret: "QYuJFtZ45HEawz14SZgyzu+8dF6KNwW0xx4v12LtZwo=",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

// -------------------- Helper Middleware --------------------

// Protect routes that require login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// Prevent logged-in users from accessing login/register pages
function preventLoginAccess(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}

// -------------------- Routes --------------------

// Home page (protected)
app.get("/", requireLogin, (req, res) => {
  console.log("GET / called, user:", req.session.user);
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.get("/navbar", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "navbar.html"));
});
app.get("/footer", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "footer.html"));
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "register.html"));
});
app.get("/cart", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cart.html"));
});

// Login page
app.get("/login", preventLoginAccess, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Session status API
app.get("/session-status", (req, res) => {
  res.json({ user: req.session.user || null });
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// -------------------- API Routers --------------------
app.use("/validate", validateRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter); // API login (not page)

//Cart API
app.use("/cart", getCartItems);

// -------------------- Start Server --------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
