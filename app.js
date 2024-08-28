const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const { default: mongoose } = require("mongoose");
const books = require("./book-data").books;
const app = express();

const Book = require("dotenv").config;
mongoose.connect(`${mongodb}`);
// Set the view engine to pug
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Allow us to do our puts and deletes
app.use(methodOverride("_method"));
// Define routes here
app.get("/", async function (req, res) {
  res.render("books", { books });
  const books = await Book.find();
  res.render("books", { books });
});

app.post("/", async function (req, res) {
  await Book.create(req.body);
  res.redirect("/");
});
app.get("/new", function (req, res) {
  res.render("new-book");
});
app.get("/:id", function (req, res) {
  const isbn = req.params.id;
  const book = books.find((book) => book.isbn === isbn);
  res.render("book-details", { book });
});
app.get("/new", function (req, res) {
  res.render("new-book");
});
app.delete(":/id", async function (req, res) {
  await Book.deleteOne({ isbn: req.params.id });

  res.redirect("/");
});
app.get("edit/:id", function (req, res) {
  const isbn = req.params.id;
  const book = books.find((book) => book.isbn === isbn);
  res.render("edit-book", { book });
});
app.get("/:id", async function (req, res) {
  const isbn = req.params.id;
  const book = await Book.find({ isbn: isbn });
  res.render("book-details", { book });
});

app.put("/:id", async function (req, res) {
  const isbn = req.params.id;
  await Book.findOneAndUpdate({ isbn: isbn }, req.body());
  res.redirect("/");
});
// Start the server
app.listen(3000, () => console.log("Server running on port 3000"));
