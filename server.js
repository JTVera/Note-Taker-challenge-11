const express = require('express');
const path = require('path')
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
let notes = require('./db/db.json')

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/')));

app.get('/notes', (req, res)=>
res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/api/notes', (req, res) =>{
    fs.readFile('./db/db.json', 'utf-8', (err, data)=>{
        if (err){
            console.log(err)
            return;
        }
        res.json(notes);
        console.log('GET request successful!')
    });
});

app.post('/api/notes', (req, res)=>{

const {title, text} = req.body
var noteID = notes.length + 1;

if(text && title){
    const userNote = {
        id: noteID,
        title,
        text,
    }

notes.push(userNote)

const stringifyNote = JSON.stringify(notes)

res.json(notes)
fs.writeFile('./db/db.json', stringifyNote, (err)=>{
    if (err){
        console.log(err)
    }
    console.log("Note Added!");
});
}});

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes);
    res.json(true);
});

const deleteNote = (noteID) =>{
    for(let i = 0; i< notes.length; i++){
        let note = notes[i]
        if(note.id == noteID){
            notes.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notes));
                break;
        }
    }
};

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
 });   

 app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);