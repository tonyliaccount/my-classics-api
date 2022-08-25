const http = require('follow-redirects').https; // or 'https' for https:// URLs
const fs = require('fs');

module.exports.downloadFile = async function (fileUrl, outputLocationPath, callback) {

    // See if this file is already there
    try {
        if (fs.existsSync(outputLocationPath)) {
            console.log(`File already exists at ${outputLocationPath}.`);
            callback(outputLocationPath);
            return;
        }
    } catch (err) {
        console.error (err);
    }

    const file = fs.createWriteStream(outputLocationPath);
    const request = http.get(fileUrl, function(response) {
        response.pipe(file);
    
        // after download completed close filestream
        file.on("finish", () => {
            file.close();
            callback(outputLocationPath);
        });

        file.on('error', (err) => { // Handle errors
            fs.unlink(outputLocationPath); // delete the (partial) file and then return the error
            callback(null);
        });
    });
}