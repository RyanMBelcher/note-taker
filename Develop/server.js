const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid = require('uuid');
const PORT = process.env.PORT || 3001;
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

// API routes
// reads db.json file and returns all saved notes as json
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// receives a new note to save on the request body, add to db.json file, and then return
// note to client. Each note will need a unique id.
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note.`);

    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid.v4(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log('READFILE: ', JSON.parse(data));
            }


            const notes = JSON.parse(data);

            notes.push(newNote);

            fs.writeFile('./db/db.json', JSON.stringify(notes, null, '\t'), (err) =>
                err
                    ? console.err(err)
                    : console.log(`Note has been written to JSON file`)
            )
        });
        const response = {
            status: 'success',
            body: newNote,
        }
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;

    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(JSON.parse(data));
        }

        const notes = JSON.parse(data);

        const filteredNotes = notes.filter(note => {
            return id !== note.id
        })
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes, null, '\t'), (err) =>
            err
                ? console.err(err)
                : console.log(`Note has been written to JSON file`)
        )
        res.sendFile(path.join(__dirname, 'public/index.html'))
    })
});


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`)
});

// TODO: GIVEN a note-taking application
// TODO: WHEN I open the Note Taker
// TODO: THEN I am presented with a landing page with a link to a notes page
// TODO: WHEN I click on the link to the notes page
// TODO: THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// TODO: WHEN I enter a new note title and the note’s text
// TODO: THEN a Save icon appears in the navigation at the top of the page
// TODO: WHEN I click on the Save icon
// TODO: THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// TODO: WHEN I click on an existing note in the list in the left-hand column
// TODO: THEN that note appears in the right-hand column
// TODO: WHEN I click on the Write icon in the navigation at the top of the page
// TODO: THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column