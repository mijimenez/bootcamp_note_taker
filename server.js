const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



// HTML Routes
// =============================================================
// Basic route that sends the user first to the Home Page
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route that sends the user to the view notes/AJAX Page
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});


// API Routes
// =============================================================
// API route that reads the json file with notes
app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        data = JSON.parse(data);
        // console.log(data)
        return res.json(data);
    });
});
  
// API route that allows user to add new note, updates json data and displays on browser
app.post("/api/notes", function(req, res) {
    const newNote = req.body;

    // Read and push new note to json data
    readFileAsync("./db/db.json", "utf8").then(function(data) { 
        data = JSON.parse(data);
        data.push(newNote);
        data[data.length - 1].id = data.length - 1;
        // Update and write the json data with new notes
        writeFileAsync("./db/db.json", JSON.stringify(data));
        res.json(data);
        console.log("Note succesfully created!");
    });
});

// API route that allows user to delete a note and updates json data
app.delete("/api/notes/:id", function(req, res) {
    const selectedNoteId = req.params.id;
    // console.log(selectedNoteId);
    // Read and remove new note to json data
    readFileAsync("./db/db.json", "utf8").then(function(data) {
        // Turn data object into string, splice selected Note by id to remove from array and reset index.
        data = JSON.parse(data);
        data.splice(selectedNoteId, 1);
        for (var i = 0; i < data.length; i++) {
            data[i].id = i;
        }
        // Update the json data with removed notes
        writeFileAsync("./db/db.json", JSON.stringify(data));
        res.json(data);
        console.log("Note succesfully removed!");
    });
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });