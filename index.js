const express = require('express');
const session = require("express-session");
const passport = require('passport');
const multer = require('multer');
require('./auth');

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Uploads will be stored in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route for rendering the image upload form
app.get('/upload', isLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

// Route for handling image uploads
app.post('/upload', isLoggedIn, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // You can now save the file information (e.g., file.path) to a database or perform other actions.
    res.send('File uploaded successfully!');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home.html');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile']})
);

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure',
    })
);

app.get('/auth/failure', (req, res) => {
    res.send('Something Went Wrong...'); 
});

app.get('/protected', isLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/protected.html');
});

app.get('/user-data', isLoggedIn, (req, res) => {
    res.json({ displayName: req.user.displayName });
});

app.get("/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  });

app.listen(5000, () => console.log('listening on 5000'));