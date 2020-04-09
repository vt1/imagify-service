var express = require('express');
var router = express.Router();
var db = require('../db/db.js')

/* GET albums page. */
router.get('/', function(req, res, next) {
    db.getAllAlbums().then((albums) => {
        console.log(albums)
        res.render('albums', { title: 'Albums', albums: albums });
    })    
});

module.exports = router;