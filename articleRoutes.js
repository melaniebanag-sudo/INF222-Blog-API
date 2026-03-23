const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// On passe "db" à notre contrôleur
module.exports = (db) => {
    router.post('/', (req, res) => articleController.createArticle(db, req, res));
    return router;
};
