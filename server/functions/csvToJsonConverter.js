const fs = require("fs");
const csv = require("csv-parser");

function csvToJson(filePath) {
    return new Promise((resolve, reject) => {
        const results = {};
        
        // Read and parse CSV file
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (row) => {
                // For each key in the row, populate the result object with arrays of values
                Object.keys(row).forEach((key) => {
                    if (!results[key]) {
                        results[key] = []; // Initialize array for each header
                    }
                    results[key].push(row[key]); // Push each value into the corresponding array
                });
            })
            .on("end", () => {
                resolve(results);
            })
            .on("error", (error) => {
                reject(error);
            });
    });
}

module.exports = {csvToJson};