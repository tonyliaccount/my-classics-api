const express = require('express');
const router = express.Router();
const axios = require('axios').default;

// Import wrapper for file system
const storage = require("../utils/storage-wrapper.js");

//get single inventory info
router.get('/', async (req, res) => {

    /* 
    // These are the real calls - need some sort of caching mechanism
    
    const gutendexResponse = await axios.get("https://gutendex.com/books/");
    res.status(200);
    res.send(gutendexResponse.data); */

    res.status(200);
    res.send(storage.getBooks());
});

module.exports = router;
