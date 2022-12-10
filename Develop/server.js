const express = require('express');
const path = require('path');
const fs = require('fs');

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
app.get('/api/notes', (req, res) =>
    res.json(jsonData)
);

// receives a new note to save on the request body, add to db.json file, and then return
// note to client. Each note will need a unique id.
// app.post('/api/notes'(req, res) =>
//     res.json()
// );


app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});