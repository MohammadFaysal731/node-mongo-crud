const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;
// use middleware  
app.use(cors());
app.use(express.json());

// user:dbuser1
// password:QU8Skd8pZkvbMxva



const uri = "mongodb+srv://dbuser1:QU8Skd8pZkvbMxva@cluster0.zt7la.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const usersCollection = client.db('foodExpress').collection('users');
        // get users 
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })
        // 
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        // POST a User : add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('adding new user', newUser);
            const result = await usersCollection.insertOne(newUser);
            res.send(result)
        })

        // UPDATE a User
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options)
            res.send(result);
        })
        // DELETE a User 
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running My Node CRUD Server')
});
app.listen(port, () => {
    console.log('CRUD Server is running')
})
