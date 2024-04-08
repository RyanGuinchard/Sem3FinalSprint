const express = require('express');
const router = express.Router();
const pgDal = require("../services/inventoryPG.dal")

router.get('/', (req, res) => {
    res.render('index',);
});

router.get('/preroll', (req, res) => {
    
});

module.exports = router;