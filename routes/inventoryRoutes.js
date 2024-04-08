const express = require('express');
const router = express.Router();
const pgDal = require("../services/inventoryPG.dal")

router.get('/', (req, res) => {
    const isLoggedIn = req.cookies.username ? true : false;
    res.render('index', { isLoggedIn });
});

router.get('/preroll', (req, res) => {
    
});

module.exports = router;