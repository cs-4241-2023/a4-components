const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASS;
const host = process.env.MONGODB_HOST;
const db_name = process.env.MONGODB_DB_NAME;

const uri = `mongodb+srv://${user}:${password}@${host}/test?retryWrites=true&w=majority`;

class StorageService {
    constructor() {
        this.client = new MongoClient(uri);
        this.client.connect().catch(err => {
            console.error('Failed to connect to MongoDB', err);
        });
    }

    async createUser(username, hashedPassword) {
        const db = this.client.db(db_name);
        const result = await db.collection('users').insertOne({ username, hashedPassword });
        if (!result.insertedId) {
            throw new Error('User creation failed');
        }
        return {
            _id: result.insertedId,
            username,
            hashedPassword,
        };
    }

    async findUserByUsername(username) {
        const db = this.client.db(db_name);
        const user = await db.collection('users').findOne({ username });
        return user;
    }

    async findUserById(id) {
        const db = this.client.db(db_name);
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        return user;
    }

    async createTask(taskData) {
        const db = this.client.db(db_name);
        const result = await db.collection('tasks').insertOne(taskData);

        const newTask = await db.collection('tasks').findOne({ _id: result.insertedId });
        return newTask
    }

    async getTasks(userId) {
        const db = this.client.db(db_name);
        const tasks = await db.collection('tasks').find({ userId: new ObjectId(userId) }).toArray();
        return tasks;
    }

    async updateTask(taskId, taskData) {
        const db = this.client.db(db_name);
        await db.collection('tasks').updateOne({ _id: new ObjectId(taskId) }, { $set: taskData });
        const updatedTask = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
        return updatedTask;
    }

    async deleteTask(taskId) {
        const db = this.client.db(db_name);
        const result = await db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
        return result.deletedCount; // This will be 1 if the deletion was successful, and 0 otherwise.
    }
}

module.exports = { storageService: new StorageService() };
