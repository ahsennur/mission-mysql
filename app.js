const express = require('express');

const app = express();

//to be able to use typeorm?
// import "reflect-metadata";

const bodyParser = require('body-parser');

app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

const {
    addTask,
    getTasks,
    updateTask,
    deleteTask
 } = require('./db');

const port = 3000;

app.get('/', async (req, res) => {
    const tasks = await getTasks();
    res.send(tasks);
});

app.post('/', async (req, res) => {
    // const body = JSON.parse(req.body)
    // console.log(addTask(req.body.detail));
    // next();

    const tasks = await addTask(req.body.detail);
    res.send(tasks);
});

app.put('/',  async (req, res) => {
    const task = await updateTask(req.body.id, req.body.detail);
    res.send(task);
});

app.delete('/', async (req, res) => {
    const task = await deleteTask(req.body.id);
    res.send(task);
});

app.listen(port, () => {
    console.log('Server is up on the port: '+ port);
});