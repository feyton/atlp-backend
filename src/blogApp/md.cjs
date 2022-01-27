//The package does not provide a default export
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();


const slug = require("mongoose-slug-generator");

module.exports = { slug, parser };
