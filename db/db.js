var pgp = require('pg-promise')();
var connectionString = process.env.DATABASE_URL
/*
var connectionString = {
    host: '*****',
    port: 5432,
    database: '*****',
    user: '******',
    password: '****',    
}
*/
var db = pgp(connectionString);

function createAlbum(name, resource_url) {
    return db.one('INSERT INTO albums(name, resource_url) VALUES($1, $2) RETURNING album_id', [name, resource_url])
        .then((data) => {
            return data                        
        })
        .catch((error) => {
            console.log("error insert: " + error)
        })
}

function createPhoto(url, album_id) {
    db.none('INSERT INTO photos(url, album_id) VALUES($1, $2)', [url, album_id])
        .then(() => {
            console.log("Create photo succesfully")
        })
        .catch((error) => {
            console.log("error create photo" + error)
        })
}

function getAllAlbums() {
    return db.any('SELECT * FROM albums')
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.log(error)
        })
}

function getPhotosByAlbumId(id) {
    return db.any("SELECT * FROM photos WHERE album_id = $1", id)
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.log(error)
        })
}

function getAlbumById(id) {
    return db.one("SELECT * FROM albums WHERE album_id = $1", id)
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.log(error)
        })
}

function deletePhotoById(id) {
    return db.result("DELETE FROM photos WHERE photo_id = $1", id)
        .then(result => {
            console.log(result.rowCount);
            return result;
        })
        .catch(error => {
            console.log(error);
        })
}

module.exports = {
    createAlbum: createAlbum,
    createPhoto: createPhoto,
    getAllAlbums: getAllAlbums,
    getPhotosByAlbumId: getPhotosByAlbumId,
    getAlbumById: getAlbumById,
    deletePhotoById: deletePhotoById
}