const express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
const app = express();
var cors = require('cors')
const port = 5000;

app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())

app.get('/', (req, res) => res.send('API'));

const taskStore = {};

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
    }
});

app.get('/tasks', (req, res) => {
    const tasks = Object.keys(taskStore).map(k => taskStore[k]);
    res.send({tasks});
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
