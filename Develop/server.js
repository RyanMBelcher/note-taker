const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// helper method for generating unique ids
const uuid = require('./helper/helper');

const PORT = 3001;


const app = express();

// middleware methods
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// HTML routes

// returns route for home page
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

// returns route for note page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content,), (err) =>
        err ? console.error(err) : console.info()
    );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */


// API routes
// reads db.json file and returns all saved notes as json
app.get('/api/notes', (req, res) => {
    res.json(`${req.method} request received to get notes`);

    console.info(`${req.method} request received to get notes`);
});

// receives a new note to save on the request body, add to db.json file, and then return
// note to client. Each note will need a unique id.
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note.`);

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid()
        };
        const noteString = JSON.stringify(newNote);

        fs.writeFile(`./db/${newNote.note}.json`, noteString, (err) =>
            err
                ? console.error(err)
                : console.log(`Note for ${newNote.note} has been written to JSON file`)
        );

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }

}
);


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`)
});