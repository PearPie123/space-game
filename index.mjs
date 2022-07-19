import express from "express";
import ws from "ws";
//import game from "./gameInstance";

const app = express();

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.send("/public/index.html");
});

app.listen(3000)