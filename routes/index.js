var express = require('express');
var router = express.Router();
var axios = require('axios');
var cheerio = require('cheerio');
var requestImageSize = require('request-image-size');
var db = require('../db/db.js')

/* GET home page. */
router.get('/', function(req, res, next) { 
  res.render('index', { title: 'Load photos', success: req.session.success, errors: req.session.errors });  
  req.session.success = null;
  req.session.errors = null;
});

router.post('/load', function (req, res) {  
  const url = req.body.url;
  console.log(url)
  const albumName = req.body.name;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('url', 'Url is required').notEmpty();
  var errors = req.validationErrors();

  if(errors){
    req.session.errors = errors;
    req.session.success = false;
    res.redirect('/');
  } else {
    getHtmlPage(url).then(htmlPage => {      
      db.createAlbum(albumName, url).then((data) => {
        const album_id = data.album_id
        const $ = cheerio.load(htmlPage);
        $('img').each(function() {
          let imageUrl = $(this).attr('src');
          parseImage(imageUrl).then((image) => {
            if(image.width >= 250 && image.height >= 250 && isImageFormatValid(image))
            {
              db.createPhoto(imageUrl, album_id)
            }
          }).catch((err) => {
            console.log(err)
          })            
        })
      })        
    }).catch((err) => {
      console.log(err)
    })

    req.session.success = true;
    res.redirect('/');
  }  
})

function isImageFormatValid(image){
  if(image.type === 'png' || image.type === 'jpg' || image.type === 'tif')
    return true
}

async function parseImage(imageUrl) {
  try {
    const size = await requestImageSize(imageUrl);
    return size
  }
  catch (err) {
    return console.error(err);
  }
}

function getHtmlPage(url) {
  return axios.get(url).then((result) => {
    return result.data;           
  })
}

module.exports = router;