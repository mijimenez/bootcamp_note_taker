const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");


// Sets up the Express App
// =============================================================
const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Reservation POST (DATA)
// =============================================================
const notes = [];


// Routes
// =============================================================
// Basic route that sends the user first to the Home Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route that sends the user to the view notes/AJAX Page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// Displays all notes
app.get("/api/notes", function(req, res) {
    return res.json(notes);
});


// Create new notes - takes in JSON input
app.post("/api/notes", function(req, res) {
// req.body hosts is equal to the JSON post sent from the user
    // This works because of our body parsing middleware
    const newNote = req.body;

    // Using a RegEx Pattern to remove spaces from newNote
    // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
    newNote.routeName = newNote.name.replace(/\s+/g, "").toLowerCase();

    console.log(newNote);

    notes.push(newNote);

    res.json(newNote);
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });