const express = require('express');
const router = express.Router();
const axios = require('axios').default;

// Import wrapper for file system
const storage = require("../utils/storage-wrapper.js"); 
const utils = require("./../utils/utils.js");

//get list of books based on specific queries
router.get('/', async (req, res) => {

    const queryString = req.query ? new URLSearchParams(req.query).toString() : '';

    const gutendexResponse = await axios.get(`https://gutendex.com/books?${queryString}`);

    // Santize it first - no point in returning a book if it doesn't have an ebook associated with it

    const santizedResponse = gutendexResponse.data;

    santizedResponse.next = santizedResponse.next !== null ? santizedResponse.next.substring(santizedResponse.next.indexOf('books') + 6) : null;
    santizedResponse.previous = santizedResponse.previous !== null ? santizedResponse.previous.substring(santizedResponse.previous.indexOf('books') + 6): null;
    
    const prevParams = new URLSearchParams(santizedResponse.previous);
    santizedResponse.page = prevParams.get('page') ? parseInt(prevParams.get('page')) + 1 : 1;
    
    santizedResponse.results = santizedResponse.results.filter( (book) => {
        return 'application/epub+zip' in book.formats;
    });

    res.status(200);
    res.send(santizedResponse);
});

//get information regarding a particular book, and make its epub file avaliable
router.get('/:id', async (req, res) => {
    
    try {
        const gutendexResponse = await axios.get(`https://gutendex.com/books/${req.params.id}`);
        
        const formats = gutendexResponse?.data?.formats;
        if (formats) {
            const epubLink = formats['application/epub+zip'];
            
            const callback = (fileLocation) => {
                console.log(fileLocation);

                if (fileLocation) {
                    res.status(200);
                    res.send(`epubs/${req.params.id}.epub`)
                } else {
                    res.status(404);
                }
            }

            utils.downloadFile(epubLink, `./public/epubs/${req.params.id}.epub`, callback);
        }
    }
    catch (err) {
        console.log(err);
        res.status(404);
    }
});

module.exports = router;
