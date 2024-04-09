const express = require('express');
const router = express.Router();
const pgDal = require("../services/inventoryPG.dal")
const mongodbUtil = require('../services/mongodbUtil');
const useMongoDB = process.env.USE_MONGO_DB === "true";

router.get('/', (req, res) => {
    const isLoggedIn = req.cookies.username ? true : false;
    res.render('index', { isLoggedIn });
});

router.get('/preroll', async (req, res) => {
    if (useMongoDB) {
        // Use MongoDB to get prerolls
        try {
            const prerolls = await mongodbUtil.findAllDocuments('preroll');
            res.json(prerolls);
        } catch (err) {
            console.error(err);
            res.status(500).send("Error accessing the database with MongoDB.");
        }
    } else {
        // Use PostgreSQL to get prerolls
        try {
            const prerolls = await pgDal.getAllFromTable('preroll');
            res.json(prerolls);
        } catch (err) {
            res.status(500).send("Error accessing the database with PostgreSQL.");
        }
    }
});
router.get('/search-all-collections', async (req, res) => {
    if (!useMongoDB) {
        // If MongoDB is not being used, send a message or redirect
        return res.status(501).send("Search across all collections is only available when using MongoDB.");
    }
    
    const searchTerm = req.query.term;
    try {
      const results = await mongodbUtil.searchAcrossCollections(searchTerm);
      res.json(results);
    } catch (err) {
      res.status(500).send("Error accessing the database.");
    }
});
module.exports = router;