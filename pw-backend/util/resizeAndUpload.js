const axios = require("axios");
const sharp = require("sharp");
const fs = require("fs");

async function resizeAndUpload(imageUrl) {
  const workerUrl = "https://worker_prijswatch.pandabutcher.workers.dev";

  try {
    console.log("Fetching image from URL");
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

const headers = {
  "Content-Type": "image/webp",
  "X-Custom-Auth-Key": process.env.AUTH_SECRET_KEY, // Replace this with your actual secret value
};

const response = await axios.post(workerUrl, imageBuffer, {
  responseType: "text",
  headers: headers,
});
return response.data;
  } catch (error) {
    console.error("Error processing image:", error.message);
    console.error("Error details:", error.response?.data);
    return null;
  }
}

module.exports = resizeAndUpload;