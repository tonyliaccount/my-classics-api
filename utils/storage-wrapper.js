const fs = require('fs');

/** @class This is a wrapper interface for interacting with the data.
 * The main purpose being to abstract away any dealing directly with 
 * filesystem by other code needing to interact with data. */
class StorageWrapper {

    /**
     * Class constructor. When instantiated, read the respective file from storage,
     * and assign defined callbacks to be run after completion of reading.
     */
    constructor() {
        fs.readFile('./test/books.json', this._handleBooks);
    }

    /**
     * Callback for defining behaviours after reading the books JSON.
     */
     _handleBooks = (err, data) => {
        if (err) {
            throw err
        }

        // If no errors, update the private variable to contain data read from file.
        this._books = JSON.parse(data);
    }

    /**
     * Getter for "inventories" variable.
     */
    getBooks() {
        return this._books;
    }
}

// Export cached singleton instead of class
module.exports = new StorageWrapper();