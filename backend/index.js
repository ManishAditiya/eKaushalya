const express = require('express');

const {ObjectId} = require('mongodb');
const { connectDB, getDB, getDB2 } = require('./db');

const cors = require('cors');
const router = express.Router();
const bcrypt = require('bcrypt');



const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

connectDB().then(() => {

    const db = getDB();
    const users = db.collection('users');
    const practiceQuestions = db.collection('practiceQuestions');
    const questions = db.collection('questions');

    app.post('/api/users', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await users.insertOne({ username, email, password:hashedPassword });
            const user = {
                id: result.insertedId.toString(),
                username,
                email
            };
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    


    app.get('/api/users', async (req, res) => {
        try {
            const allUsers = await users.find().toArray();
            const mapped = allUsers.map(u => ({
                id: u._id.toString(),
                username: u.username,
                email: u.email,
                password: u.password // Add this line
            }));
            res.json(mapped);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });


    

    
    app.post('/api/users/signin', async (req, res) => {
  const { username, password } = req.body;
  console.log(users);
  const user = await users.findOne({ username });
  if (!user) {
    return res.json({ success: false, message: 'User does not exist' });
  }
  
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false, message: 'Username or password is incorrect.' });
  }
});


    app.get('/api/practice-questions/:language', async (req, res) => {
        const db2 = getDB2();
        const practiceQuestionsCollection = db2.collection('questions');
        const language = req.params.language;
        try {
            const questionsList = await practiceQuestionsCollection.find({ language }).limit(10).toArray();
            res.json(questionsList);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    
    const { MongoClient } = require('mongodb');



    

   





    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
});


