const express = require('express');
const app = express();
const spicedPg = require('spiced-pg');
const db = spicedPg(process.env.DATABASE_URL || require('./secrets').DATABASE_URL);
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const bodyParser = require('body-parser');
const knox = require('knox');
const fs = require('fs');
var favicon = require('serve-favicon')

app.use(favicon(path.join(__dirname, 'public', 'fireball.svg')))

let secrets;

if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets.json');
}

const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'spicedling'
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: { filesize: 2097152 }
});


app.post('/uploadImage', uploader.single('file'), function(req, res) {
    if (req.file) {
        const { username, title, description } = req.body;

            const s3Request = client.put(req.file.filename, {
                'Content-Type': req.file.mimetype,
                'Content-Length': req.file.size,
                'x-amz-acl': 'public-read'
            });
            const readStream = fs.createReadStream(req.file.path);
            readStream.pipe(s3Request);

            s3Request.on('response', s3Response => {
                const wasSuccessful = s3Response.statusCode == 200;
                const q = 'INSERT INTO images (image, username, title, description) VALUES ($1, $2, $3, $4)'
                const params = [req.file.filename, username, title, description]

                db.query(q, params)
                .then(() => {
                    console.log(req.file.filename, wasSuccessful);
                    res.json({ success: wasSuccessful });
                })
                .catch((err) => {
                    console.log(err);
                    res.json({ success: false });
                })
            });
    } else {
        res.json({ success: false });
    }
})

app.get('/comments/:imageId', function(req,res) {
    const q = "SELECT * FROM comments WHERE image_id = $1"
    const params = [req.params.imageId]

    db.query(q, params)
    .then((results) => {
        res.json({comments: results.rows})
    })
    .catch((e) => console.log(e) )

})

app.post('/uploadComment', (req,res) => {
    const q = 'INSERT INTO comments (image_id, username, content) VALUES ($1, $2, $3)'
    const params = [req.body.imageId, req.body.username, req.body.content]

    db.query(q, params)
    .then(() => res.json({ success: true}) )
    .catch((e) => console.log(e) )

})

app.get('/images', function(req, res) {
    const q = 'SELECT * FROM images;'

    db.query(q)
    .then((results) => res.json({ images: results.rows }) )
    .catch((e) => console.log(e) )

});

app.get('/image/:id', function(req, res) {
    var imageId = req.params.id
    const q = 'SELECT * FROM images WHERE id = $1'
    const params = [imageId]

    db.query(q, params)
    .then((results) => {
        res.json({ image: results.rows[0]})
    })
})


app.set('port', process.env.PORT || 8080)
app.listen(app.get('port'), () => {
    console.log(`I'm listening on port ${app.get('port')}`)
});
