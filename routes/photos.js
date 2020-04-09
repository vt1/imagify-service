var express = require('express');
var router = express.Router();
var db = require('../db/db.js')

router.get('/:albumId', function(req, res) {
    const albumId = req.params.albumId;
    db.getPhotosByAlbumId(albumId).then((photos) => {
        db.getAlbumById(albumId).then((album) => {
            res.render('photos', { title: 'Photos - ' + album.name, photos: photos})     
        })
    })
});

router.post('/delete/:photoId', function(req, res) {
    var photoId = req.params.photoId;
    db.deletePhotoById(photoId).then((result) => {
        res.sendStatus(200)
    }).catch((error) => {
        console.log(error)
    })       
});

module.exports = router;