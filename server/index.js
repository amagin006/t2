const express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
const app = express();
var cors = require('cors');
var fs = require('fs');
const port = 5000;

var data = fs.readFileSync('todo.json')
var todos = JSON.parse(data);



app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => res.send('API'));

const taskStore = todos;

app.post('/tasks', (req, res) => {
    const {id, label, isCompleted} = req.body;
    if (
        typeof id !== 'string' ||
        typeof label !== 'string' ||
        typeof isCompleted !== 'boolean'
    ) {
        return res.status(400).send({error: 'missing required keys'});
    } else {
        taskStore[id] = {id, label, isCompleted};
        res.send(taskStore[id]);
        var data = JSON.stringify(taskStore, null, 2)

        fs.writeFileSync('todo.json', data, (err) => {
            console.log(err);
            res.send('success')
        })
    } 
})

app.put('/tasks', (req, res) => {
    const {id, label, isCompleted} = req.body;
    if (
        typeof id !== 'string' ||
        typeof label !== 'string' ||
        typeof isCompleted !== 'boolean'
    ) {
        return res.status(400).send({error: 'missing required keys'});
    } else {
        taskStore[id] = {id, label, isCompleted};
        res.send(taskStore[id]);
        var data = JSON.stringify(taskStore, null, 2)

        fs.writeFileSync('todo.json', data, (err) => {
            console.log(err);
            res.send('success')
        })
    }
});

app.get('/tasks', (req, res) => {
    const tasks = Object.keys(taskStore).map(k => taskStore[k]);
    res.send({tasks});
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
