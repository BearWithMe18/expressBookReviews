const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User registered."});
        } else {
            return res.status(404).json({message: "User already exists."});
        }
    }
    return res.status(404).json({message: "Unable to register user." + username + password});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let bookPromise = new Promise((resolve, reject) => {
        res.send(JSON.stringify(books,null,4));
    })
    bookPromise();
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbnPromise = new Promise((resolve,reject) => {
        const isbn = parseInt(req.params.isbn);
        res.send(JSON.stringify(books[isbn]));
    });
    isbnPromise();
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorPromise = new Promise((resolve,reject) => {
    const author = req.params.author;
    let matching = [];
    for (const [key, value] of Object.entries(books)) {
        if (author == value.author){
            matching.push(value);
        }
      }
    res.send(matching);
    });
    authorPromise();
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let matching = [];
    for (const [key, value] of Object.entries(books)) {
        if (title == value.title){
            matching.push(value);
        }
      }
    res.send(matching);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = parseInt(req.params.isbn);
    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
