if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("./config/passport");
const routes = require("./routes");
const httpProxy = require("http-proxy");
const app = express();
const port = 5000;
const SESSION_SECRET = "secret";
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/swSocket/",
});
io.attach(server);
const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
  },
});
const socket = require("./helpers/socket-helper")(io);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(
//   session({
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false,
//     },
//   })
// );
app.use(sessionMiddleware);
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages"); // 設定 success_msg 訊息
  res.locals.error_messages = req.flash("error_messages");
  res.locals.user = req.user;
  next();
});

app.use(routes);

httpProxy
  .createProxyServer({
    target: "http://localhost:3000",
    ws: true,
  })
  .listen(80);

server.listen(port, () => {
  console.log(`The web is on localhost:${port}`);
});

module.exports = app;
