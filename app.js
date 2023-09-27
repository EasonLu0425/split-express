const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.send("This is split express");
});

app.listen(port, () => {
  console.log(`The web is on localhost:${port}`);
});
