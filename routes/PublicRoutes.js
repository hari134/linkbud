const express = require('express');
const router = express.Router();
const {
    ShortenURL,
    RedirectToOriginal,
    CheckShortURLExists
} = require('../controllers/UrlControllerClient');

const {
    Login,
    Register
} = require('../controllers/Auth');
const path = require('path');


// Middleware
router.use(express.json());
router.use(express.static('public')); // Serve static files (like CSS)

// API routes
router.post('/api/shorten', ShortenURL);

router.get('/:shortURL', RedirectToOriginal);

router.get('/api/check/:shortURL', CheckShortURLExists);

router.post('/api/login', Login);

router.post('/api/register', Register);

router.get('/', (req, res) => {
    // Render the HTML template and send it as the response
    res.sendFile(path.join(__dirname, '../public/shorten.html'));
});


module.exports = router;