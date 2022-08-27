const express = require('express');
const router = express.Router();
const axios = require('axios').default;

// Import wrapper for file system
const storage = require("../utils/storage-wrapper.js"); 
const utils = require("./../utils/utils.js");

const resultLookup = {};

//get list of books based on specific queries
router.get('/', async (req, res) => {

    const queryString = req.query ? new URLSearchParams(req.query).toString() : '';

    // Cache the response as gutendex is pretty slow.
    let gutendexData = null;
    if (queryString in resultLookup === false) {
        console.log(`${queryString} - New result required.`)

        const gutendexResponse = await axios.get(`https://gutendex.com/books?${queryString}`);
        resultLookup[queryString] = gutendexResponse.data;

        // Santize it first - no point in returning a book if it doesn't have an ebook associated with it
        const santizedResponse = resultLookup[queryString];

        santizedResponse.next = santizedResponse.next !== null ? santizedResponse.next.substring(santizedResponse.next.indexOf('books') + 6) : null;
        santizedResponse.previous = santizedResponse.previous !== null ? santizedResponse.previous.substring(santizedResponse.previous.indexOf('books') + 6): null;
        
        if (!req.query.page) {
            santizedResponse.page = 1;
        } else {
            santizedResponse.page = parseInt(req.query.page);
        }
        
        santizedResponse.results = santizedResponse.results.filter( (book) => {
            return 'application/epub+zip' in book.formats;
        });
    }

    res.status(200);
    res.send(resultLookup[queryString]);
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
