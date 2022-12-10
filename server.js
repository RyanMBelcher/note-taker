const express = require('express');

const PORT = 3001;
const jsonData = require('./Develop/db/db.json');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// HTML routes
app.get('/notes', (req, res) =>
    res.send()
);

app.get('*', (req, res) =>
    res.send()
);

// API routes
app.get('/api/notes', (req, res) =>
    res.json()
);

app.post('/api/notes'(req, res) =>
    res.json()
);


app.listen(PORT, () => {
    console.log(`App listening at http://localhost${PORT}`)
});