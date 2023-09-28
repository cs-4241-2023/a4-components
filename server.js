import express from  'express'
import ViteExpress from 'vite-express'
import 'dotenv/config'
import {MongoClient, ObjectId} from 'mongodb'

const app = express();

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}`;
const client = new MongoClient( uri );

let task_collection = null;

async function run() {
    await client.connect();
    task_collection = await client.db("todo_db").collection("tasks");
}

app.use( (req, res, next) => {
    if(task_collection !== null) {
      next()
    }else{
      res.status(503).send()
    }
});

app.get('/getTasks/', async (req, res) => {
    const tasks = await task_collection.find({ user: "" }).toArray();
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
});

app.post('/submitTasks', (req, res) => {
    let dataString = '';
  
    req.on('data', function(data) {
      dataString += data;
    });
  
    req.on('end', async function() {
      let info = JSON.parse(dataString);
  
      const currentDate = new Date();
      const objDate = new Date(info.dueDate);
      if (currentDate <= objDate) {
        const timeDifferenceInMilliseconds = objDate - currentDate;
        const daysDifference = Math.ceil(timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24));
  
        info.daysRemaining = daysDifference > 1 ? `${daysDifference} days` : "1 day";
      }
      else {
        info.daysRemaining = "Overdue";
      }
  
      const result = await task_collection.insertOne(info);
      console.log(info);
  
      res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
      res.end('Submit Success');
    });
  
});

app.post('/deleteTask', (req, res) => {
    let dataString = '';
  
    req.on( 'data', function(data) {
        dataString += data;
    })
  
    req.on('end', async function() {
      let info = JSON.parse(dataString);
      const result = await task_collection.deleteOne({
        _id: new ObjectId(info._id)
      });
  
      res.writeHead(200, "OK", {'Content-Type': 'text/plain' });
      res.end('Delete Success');
    })
});

run();
ViteExpress.listen(app, 3000 );