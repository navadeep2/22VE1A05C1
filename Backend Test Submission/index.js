const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

let n = 1;
const links = [];

// Function to generate shortcodes
function generate_code() {
    return 'abcd' + n++;
}

// Create short URL
app.post('/shorturls', (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    let code = shortcode;

    if (code) {
        if (links.some(link => link.code === code)) {
            return res.status(409).json({ error: 'Shortcode already exists.' });
        }
    } else {
        do {
            code = generate_code();
        } while (links.some(link => link.code === code));
    }

    const expiry = Date.now() + validity * 60 * 1000;
    links.push({ code, url, expiry });

    res.json({
        shortLink: `http://${req.hostname}:${PORT}/${code}`,
        expiry: new Date(expiry).toISOString()
    });
});

// Open short URL (redirect to original)
app.get('/:code', (req, res) => {
    const { code } = req.params;
    const link = links.find(link => link.code === code);

    if (!link) {
        return res.status(404).send('Short URL not found.');
    }

    if (Date.now() > link.expiry) {
        return res.status(410).send('Short URL has expired.');
    }

    res.redirect(link.url);
});

// Retrieve all short URLs
app.get('/shorturls', (req, res) => {
    res.json(links);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
