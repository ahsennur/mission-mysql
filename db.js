// const mysql = require('mysql2/promise');
const typeorm = require('typeorm');

const EntitySchema = require('typeorm').EntitySchema;

const db = {host:'localhost', user: 'root', password: 'root', database: 'task-mysql-db'};

class Task{
    constructor(id, detail){
        this.id = id;
        this.detail = detail;
    }
}

const taskSchema = new EntitySchema({
    name: "Task",
    target: Task,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        detail: {
            type: "varchar",
            default: "default detail"
        }
    }
});

const getconnection = async () => {
    return await typeorm.createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "root",
        database: "task-mysql-db",
        logging: false,
        synchronize: true,
        entities: [
            taskSchema
        ]
    })
};

const addTask = async (detail) => {
    const connection = await getconnection();
    const task = new Task();
    task.detail = detail;
    const taskRepo = connection.getRepository(Task);
    // add new task
    const res = await taskRepo.save(task);
    console.log('saved', res);

    // return new list, todo
    const allTasks = await taskRepo.find();
    connection.close();
    return allTasks;

};

const getTasks = async () => {
    const connection = await getconnection();
    const taskRepo = connection.getRepository(Task);

    //get all tasks 
    const tasks = await taskRepo.find();
    connection.close();
    return tasks;
};

const updateTask = async (id, detail) => {
    const connection = await getconnection();
    const taskRepo = connection.getRepository(Task);

    const task = await taskRepo.findOne({id});
    task.detail = detail;
    await taskRepo.save(task);
    console.log(task)
    connection.close();
    return task;
};

const deleteTask = async (id) => {
    const connection = await getconnection();
    const taskRepo = connection.getRepository(Task);

    //get all tasks 
    const task = await taskRepo.findOne({id});
    await taskRepo.remove(task);
    connection.close();
    return task;
};

module.exports = {
    addTask,
    getTasks,
    updateTask,
    deleteTask

}

// async function example2 () {
//     const mysql = require('mysql2/promise');
//     const pool = mysql.createPool({host:'localhost', user: 'root', password: 'root', database: 'test'});
//     // execute in parallel, next console.log in 3 seconds
//     await Promise.all([pool.query('select sleep(2)'), pool.query('select sleep(3)')]);
//     console.log('3 seconds after');
//     await pool.end();
//   }
//   example2()



// //promise wrapper version
// async function main() {
//     // get the client
//     const mysql = require('mysql2/promise');
//     // create the connection
//     const connection = await mysql.createConnection({host:'localhost', user: 'root', password: 'root', database: 'test'});
//     // query database
//     const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `col` = ?', ['Morty']);

//     console.log(rows, fields)
//   }

//   main()

// //using bluebird as promise
// // get the client
// const mysql = require('mysql2/promise');

// // get the promise implementation, we will use bluebird
// const bluebird = require('bluebird');

// // create the connection, specify bluebird as Promise
// const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'test', Promise: bluebird});

// // query database
// const [rows, fields] = await connection.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14]);

// //without promise wrapper
// // get the client
// const mysql = require('mysql2');

// // create the connection to database
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'test'
// });

// // // simple query
// // connection.query(
// //   'SELECT * FROM `table` WHERE `name` = "Page" AND `age` > 45',
// //   function(err, results, fields) {
// //     console.log(results); // results contains rows returned by server
// //     console.log(fields); // fields contains extra meta data about results, if available
// //   }
// // );

// // // with placeholder
// // connection.query(
// //   'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
// //   ['Page', 45],
// //   function(err, results) {
// //     console.log(results);
// //   }
// // );

// // execute will internally call prepare and query
// connection.execute(
//     'SELECT * FROM `table` WHERE `name` = ? AND `age` > ?',
//     ['Rick C-137', 53],
//     function(err, results, fields) {
//       console.log(results); // results contains rows returned by server
//       console.log(fields); // fields contains extra meta data about results, if available
  
//       // If you execute same statement again, it will be picked from a LRU cache
//       // which will save query preparation time and give better performance
//     }
//   );