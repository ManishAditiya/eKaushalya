const {MongoClient} = require('mongodb');

let db;
let db2;

async function connectDB() {
  const client = await MongoClient.connect('mongodb://localhost:27017');
  db = client.db('Users');
  db2 = client.db('PracticeQuestions');

}

function getDB() {
  return db;
}

function getDB2() {
  return db2;
}

module.exports = { connectDB, getDB, getDB2 };