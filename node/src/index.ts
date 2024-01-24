import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("server up and running");
});

app.get("/hi", (req, res) => {
  res.send("hey!");
});

app.listen(3000, () => {
  console.log("server running!");
});
