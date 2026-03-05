const ImageKit = require("imagekit");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });


const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = imagekit;
