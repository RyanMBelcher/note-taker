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
