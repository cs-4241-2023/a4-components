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
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.close();
    }

    async createUser(username, hashedPassword) {
        await this.connect();
        const db = this.client.db(db_name);
        const result = await db.collection('users').insertOne({ username, hashedPassword });
        await this.disconnect();
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
        await this.connect();
        const db = this.client.db(db_name);
        const user = await db.collection('users').findOne({ username });
        await this.disconnect();
        return user;
    }

    async findUserById(id) {
        await this.connect();
        const db = this.client.db(db_name);
        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        await this.disconnect();
        return user;
    }
}

module.exports = { storageService: new StorageService() };
