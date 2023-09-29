if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");
const router = require("./routes");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");

const app = express();
const port = 5000;

// app.get("/", (req, res) => {
//   res.send("This is split express");
// });
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
const SESSION_SECRET = "secret";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages"); // 設定 success_msg 訊息
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});
app.use(router);

app.listen(port, () => {
  console.log(`The web is on localhost:${port}`);
});
