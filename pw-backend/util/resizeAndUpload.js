const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");

async function resizeAndUpload(imageUrl, productName) {
  const workerUrl = `https://worker_prijswatch.pandabutcher.workers.dev?productname=${encodeURIComponent(productName)}`;

  try {
    console.log(`Downloading image from: ${imageUrl}`);
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = await sharp(imageResponse.data)
      .resize(500, 500, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp()
      .toBuffer();

       console.log(`Resized image buffer length: ${imageBuffer.length}`);

const headers = {
  "Content-Type": "image/webp",
  "X-Custom-Auth-Key": process.env.AUTH_SECRET_KEY,
};

const response = await axios.post(workerUrl, imageBuffer, {
  responseType: "text",
  headers: headers,
});

console.log(`Image uploaded to Cloudflare, response data: ${response.data}`);
return response.data;
  } catch (error) {
    console.error("Error processing image:", error.message);
    console.error("Error details:", error.response?.data);
    return null;
  }
}

module.exports = resizeAndUpload;