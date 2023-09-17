const URL = require('../models/URL');
const shortid = require('shortid'); // For generating short URLs
require('dotenv').config();

const { createClient } = require('redis');

const SHORT_URL_BASE = "https://linkbud.onrender.com/";


// Create a Redis client
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
      host: process.env.REDIS_URI,
      port: 17969
  }
});

async function connectToRedis() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
}

// Call the function to connect to Redis
connectToRedis();

// Handle Redis errors
redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});

// Function to shorten a URL
async function ShortenURL(req, res) {
  const { originalURL } = req.body;
  let existingShortURL;
  try {
    // Check if the original URL already exists in the Redis cache
    const cachedShortURL = await redisClient.get(originalURL);
    console.log(cachedShortURL)
    if (cachedShortURL) {
      console.log(cachedShortURL);
      // If it exists in the cache, return the cached shortened URL
      res.json({ originalURL, shortURL: SHORT_URL_BASE + cachedShortURL });
    } else {
      // Check if the original URL already exists in the database
      const existingURL = await URL.findOne({ originalURL });

      if (existingURL) {
        // If it exists in the database, cache the shortened URL and return it
        await redisClient.set(originalURL, existingURL.shortURL);
        res.json({ originalURL, shortURL: SHORT_URL_BASE + existingURL.shortURL });
      } else {
        let shortURL;

        // Generate a unique short URL
        do {
          shortURL = generateShortURL();
          existingShortURL = await URL.findOne({ shortURL });
        } while (existingShortURL);

        // Create a new URL document and save it to the database
        const url = new URL({ originalURL, shortURL });
        await url.save();

        // Cache the shortened URL and return it
        await redisClient.set(originalURL, shortURL);
        res.json({ originalURL, shortURL: SHORT_URL_BASE + shortURL });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Function to redirect to the original URL
async function RedirectToOriginal(req, res) {
  const { shortURL } = req.params;

  try {
    // Check if the short URL exists in the Redis cache
    const originalURL = await redisClient.get(shortURL);

    if (originalURL) {
      // If it exists in the cache, redirect to the original URL
      res.redirect(originalURL);
    } else {
      // If not found in the cache, retrieve it from the database
      const url = await URL.findOne({ shortURL });

      if (url) {
        // Check if the URL has an expiration date
        if (url.expirationDate && url.expirationDate <= new Date()) {
          // URL has expired, return an error
          res.status(400).json({ message: 'Short URL has expired' });
        } else {
          // Cache the original URL in Redis and redirect
          await redisClient.set(shortURL, url.originalURL);
          res.redirect(url.originalURL);
        }
      } else {
        res.status(404).json({ message: 'Short URL not found' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Function to check if given short url is available
async function CheckShortURLExists(req, res) {
  const { shortURL } = req.params;
  try {
    // Check if the short URL exists in the Redis cache
    const exists = await redisClient.exists(shortURL);

    if (exists) {
      // Return short URL already taken message
      res.status(404).json({ message: `${shortURL} is already taken` });
    } else {
      // Check if the short URL exists in the database
      const url = await URL.findOne({ shortURL });

      if (url) {
        // Cache the short URL existence in Redis
        await redisClient.set(shortURL, '1');
        res.status(200).json({ message: `${shortURL} is available` });
      } else {
        res.status(200).json({ message: `${shortURL} is available` });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}


// Helper function to generate a short URL
function generateShortURL() {
  const shortID = shortid.generate();
  return shortID;
}

// Helper function to check if orginalURL exists
async function checkOriginalURLExists(url) {
  const foundUrl = await URL.findOne({ originalURL: url });
  if (!foundUrl) return false;
  else return true;
}

// Helper function to check if shortURL exists
async function checkShortURLExists(shortURL) {
  const foundUrl = await URL.findOne({ shortURL });
  if (!foundUrl) return false;
  else return true;
}

module.exports = { ShortenURL, RedirectToOriginal, CheckShortURLExists };
