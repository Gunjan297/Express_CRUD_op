import "dotenv/config";
import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let teaData = [];
let nextId = 1;

const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

//add a new tea
app.post("/teas", (req, res) => {
  logger.warn("A post request was made to add a tea");
  const { name, price } = req.body;
  const newTea = { id: nextId++, name, price };
  teaData.push(newTea);
  res.status(201).send(newTea);
});

//get all tea
app.get("/teas", (req, res) => {
  res.status(200).send(teaData);
});

//to get a tea with given id
app.get("/teas/:id", (req, res) => {
  const tea = teaData.find((p) => p.id === parseInt(req.params.id)); //anything that come from params is a string

  if (!tea) {
    res.status(404).send("Tea not found");
  }
  res.status(200).send(tea);
});

//update the tea
app.put("/teas/:id", (req, res) => {
  const tea = teaData.find((p) => p.id === parseInt(req.params.id));
  if (!tea) {
    res.status(404).send("Tea not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send(tea);
});

//delete the tea
app.delete("/teas/:id", (req, res) => {
  const index = teaData.findIndex((p) => p.id === parseInt(req.params.id));
  if (index === -1) {
    res.status(404).send("Tea Not found");
  }
  teaData.splice(index, 1);
  res.status(200).send("deleted");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}...`);
});
