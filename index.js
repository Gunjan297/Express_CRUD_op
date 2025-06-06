import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let teaData = [];
let nextId = 1;

//add a new tea
app.post("/teas", (req, res) => {
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
  req.status(200).send(tea);
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
