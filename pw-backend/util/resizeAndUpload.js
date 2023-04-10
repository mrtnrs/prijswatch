const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");

async function resizeAndUpload(imageUrl) {
  console.log("Starting test");
  const workerUrl = "https://worker_prijswatch.pandabutcher.workers.dev";

  try {
    console.log("Fetching image from URL");
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    console.log("Image fetched");

    console.log("Resizing image using Sharp");
    const imageBuffer = await sharp(imageResponse.data)
      .resize(500, 500, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp()
      .toBuffer();
    console.log("Image resized");

const headers = {
  "Content-Type": "image/webp",
  "X-Custom-Auth-Key": process.env.AUTH_SECRET_KEY, // Replace this with your actual secret value
};

console.log("Sending image data to Worker");
const response = await axios.post(workerUrl, imageBuffer, {
  responseType: "text",
  headers: headers,
});
console.log("Image processed successfully:", response.data);
  } catch (error) {
    console.error("Error processing image:", error.message);
    console.error("Error details:", error.response?.data);
    return null;
  }
}

module.exports = resizeAndUpload;