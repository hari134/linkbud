const URL = require('../models/URL');


// Function to edit URL parameters
async function EditURL(req, res) {
    const { shortURL } = req.params;
    const { originalURL, expirationDate, password } = req.body; // Include any other parameters you want to edit

    try {
        // Find the corresponding URL based on the short URL
        const url = await URL.findOne({ shortURL });

        if (url) {
            // Update the URL parameters
            if (originalURL) {
                url.originalURL = originalURL;
            }
            if (expirationDate) {
                url.expirationDate = expirationDate;
            }
            if (password) {
                url.password = password;
            }

            // Save the updated URL document
            await url.save();

            res.json({ message: 'URL parameters updated successfully' });
        } else {
            res.status(404).json({ message: 'Short URL not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    EditURL,
};