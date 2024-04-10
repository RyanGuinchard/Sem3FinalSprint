const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_HOST;
const client = new MongoClient(uri);
const DB_NAME = process.env.MONGODB_DB;

const connect = async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};

const db = (dbName = DB_NAME) => {
  try {
    return client.db(dbName);
  } catch (err) {
    console.error('Failed to get database', err);
  }
};

const close = async () => {
  try {
    await client.close();
  } catch (err) {
    console.error('Failed to close MongoDB connection', err);
  }
};

const searchAllCollections = async (searchTerm) => {
  try {
    await connect();
    const database = db();
    const collections = await database.listCollections().toArray();
    const searchPromises = collections.map(async (collection) => {
      const coll = database.collection(collection.name);
      // Create a regular expression for each word in the search term
      const searchRegexes = searchTerm.split(' ').map(word => new RegExp(word, 'i'));
      const results = await coll.find({ 
        $and: searchRegexes.map(regex => ({
          $or: [
            { class: regex }, 
            { name: regex }, 
            { quantity: regex }, 
            { type: regex }, 
            { price: regex }, 
            { strength: regex }
          ]
        }))
      }).toArray();
      return { collection: collection.name, results };
    });
    const searchResults = await Promise.all(searchPromises);
    return searchResults;
  } catch (err) {
    console.error(err);
  } finally {
    close();
  }
};

const findAllDocuments = async (collectionName) => {
  try {
    await connect();
    const cursor = db().collection(collectionName).find();
    const results = await cursor.toArray();
    return results;
  } catch (err) {
    console.error(err);
  } finally {
    close();
  }
};

module.exports = {
  connect,
  db,
  close,
  searchAllCollections,
  findAllDocuments
};