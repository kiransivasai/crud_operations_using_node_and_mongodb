require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Item = require("./models/items");
const app = express();

app.use(express.urlencoded({ extended: true }));
const mongodb = process.env.MONGODB_URL;
mongoose
  .connect(mongodb)
  .then(() => {
    console.log("Connected");
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/get-items");
});

app.get("/get-items", (req, res) => {
  Item.find()
    .then((result) => {
      res.render("index", { items: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/get-item/:id", (req, res) => {
  Item.findById(req.params.id)
    .then((result) => {
      res.render("item-detail", { item: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/add-item", (req, res) => {
  res.render("add-item");
});

app.post("/items", (req, res) => {
  const item = Item(req.body);
  item
    .save()
    .then(() => {
      res.redirect("/get-items");
    })
    .catch((err) => {
      console.log(err);
    });
});
app.delete("/items/:id", (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json({ redirect: "/get-items" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.put("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body).then((result) => {
    res.json({ msg: "Updated Successfully" });
  });
});

app.use((req, res) => {
  res.render("error");
});
