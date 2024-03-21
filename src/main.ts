import express from "express";
import cors from "cors";
import { Game } from "./game_engine/Game";
import { GameInstance } from "./game_engine/types";

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static('assets'))
let game: GameInstance

const title = "Go!!!"
const message = "Lets play Go!"
const size = 8
const root_url = process.env.ROOT_URL

var corsOptions = {
  origin: process.env.ORIGIN,
  optionsSuccessStatus: 200
}

app.get(`/`, cors(corsOptions), (req, res) => {
  game = new Game(size);
  const positions = game.getPositions()
  res.render("index", { title, message, size: size, positions });
  console.log("\n !! NEW GAME !!\n")
});

app.get(`/move/`, cors(corsOptions), (req, res) => {
  if(!game){
    res.render("index", { title, message: "Please start a new game!", size: 0 });
  } else {
    let {position} = req.query
    if(position && typeof position === "string"){
      const positionArray = position.split(",").map(Number)
      game.simulateClick(positionArray)
      const positions = game.getPositions()
      res.render("index", { title, message, size: size, positions, origin: process.env.ORIGIN}, (err, html) => {
        res.send({data: html})
      });
    } else {
      const positions = game.getPositions()
      res.render("index", { title, message, size: size, positions}, (err, html) => {
        res.send({data: html})
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
