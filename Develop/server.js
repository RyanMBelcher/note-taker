const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const uuid = require('./helper/helper');

const PORT = 3001;
// const jsonData = require('./Develop/db/db.json');

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));



// HTML routes
// returns notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// returns index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

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