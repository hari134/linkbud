const express = require('express');
const router = express.Router();
const AuthenticateToken = require('../middleware/AuthMiddleware');
const {
    EditURL
} = require('../controllers/UrlControllerAdmin');

// Middleware
router.use(express.json());
router.use(AuthenticateToken);

// API routes
router.post('/api/edit', EditURL);


module.exports = router;