const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_HOST;
const client = new MongoClient(uri);
const DB_NAME = process.env.MONGODB_DB;
let dbConnection;

const connectToServer = (callback) => {
  console.log("connectToServer function called");
  client.connect((err) => {
    if (err) {
      console.error("Error connecting to MongoDB:", err);
      callback(err);
      return;
    }
    
    dbConnection = client.db(DB_NAME);
    console.log("Successfully connected to MongoDB.");
    callback();
  });
};

const getDb = () => {
  if (!dbConnection) {
    throw new Error("Attempted to use database before connection was established");
  }
  return dbConnection;
};

const findAllDocuments = async (collectionName) => {
  try {
    const db = getDb();
    return await db.collection(collectionName).find({}).toArray();
  } catch (err) {
    console.error(err);
    throw new Error("Error accessing the database with MongoDB.");
  }
};

const searchAcrossCollections = async (searchTerm) => {
    const db = getDb();
    const collections = await db.listCollections().toArray();
    const searchPromises = collections.map(collection =>
        db.collection(collection.name).find({ $text: { $search: searchTerm } }).toArray()
    );
    return (await Promise.all(searchPromises)).flat();
};

module.exports = { connectToServer, getDb, findAllDocuments, searchAcrossCollections };

