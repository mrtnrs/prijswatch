// productMatcher.js

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callOpenAiApi = async (prompt) => {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  return response;
};

exports.sanitizeTitleAndExtractMetadata = async (productName, scrapedProduct, Product) => {
  const prompt = `Sanitize the title to leave only the primary product model. Extract metadata such as color, storage, brand, accessories, extra games, or cases. 
  Do not include the brand in the sanitizedTitle. Store metadata separately (see examples). 
  Provide a confidence score between 0 and 1, with 1 being the highest confidence in the sanitized title and extracted metadata.
Examples of metadata are color (examples: 'red', 'green'), storage ('256GB'), brand ('Samsung', 'Apple', 'Sony'), accessories, extra games or cases...
Only respond with valid JSON. Here's an example response for the updated prompt:\n\n
If title = "Apple iPhone 13 Red 500GB", response should be: {"sanitizedTitle": "iPhone 13", "confidence": 1, "metadata": {"color": "red", "storage": "500GB", "brand": "Apple"}}\n
If title = "Samsung Galaxy S22 Green 256GB", response should be: {"sanitizedTitle": "Galaxy S22", "confidence": 1, "metadata": {"color": "green", "storage": "256GB", "brand": "Samsung"}}\nIf title = "PlayStation 5 + Hogwarts Legacy + Extra controller White", response should be: {"sanitizedTitle": "PlayStation 5", "confidence": 0.9, "metadata": {"game": "Hogwarts Legacy", "accessory": "Extra controller White", "brand": "Sony"}}\n
If title = "Nintendo Switch OLED + Pokémon Violet", response should be: {"sanitizedTitle": "Switch OLED", "confidence": 0.9, "metadata": {"game": "Pokémon Violet", "brand": "Nintendo"}}\n
If title = "PlayStation 5 Digital Edition + God of War Ragnarok + Samsung 980 Pro 2TB w/ heatsink", response should be: 
{"sanitizedTitle": "PlayStation 5 Digital Edition", "confidence": 0.8, "metadata": {"game": "God of War Ragnarok", "accessory": "Samsung 980 Pro 2TB w/ heatsink"}}\n
If title = "Nintendo Switch Rood/Blauw + Bluebuilt Travel Case", response should be: 
{"sanitizedTitle": "Switch", "confidence": 0.9, "metadata": {"color": "Rood/Blauw", "accessory": "Bluebuilt Travel Case", "brand": "Nintendo"}}\nTitle = "${productName}".\n Response:`;

  let retries = 5;
  let response;
  while (retries > 0) {
    try {
      response = await callOpenAiApi(prompt);
      break;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.error('Rate limit reached, retrying...');
        await sleep(2 * (2 ** (5 - retries) * 1000)); // Exponential back-off
        retries -= 1;
      } else {
        console.error(`Unable to call OpenAI API for product ID: ${scrapedProduct.id}`);
        await Product.update({ needsreview: true }, { where: { id: scrapedProduct.id } });
        return null;
      }
    }
  }

  const resultText = response.data.choices[0].message.content.trim();

try {
  const result = JSON.parse(resultText);
  if (result.confidence < 0.3) {
    console.error(`Low confidence for product ID: ${scrapedProduct.id}`);
    await Product.update({ needsreview: true }, { where: { id: scrapedProduct.id } });
    return null;
  }

    if (!resultText.startsWith('{')) {
    console.error(`Invalid JSON format for product ID: ${scrapedProduct.id}`);
    await Product.update({ needsreview: true }, { where: { id: scrapedProduct.id } });
    return null;
  }

  console.log(result);
  return { sanitizedTitle: result.sanitizedTitle, metadata: result.metadata };
} catch (error) {
  console.error(`Unable to parse JSON for product ID: ${scrapedProduct.id}`);
  await Product.update({ needsreview: true }, { where: { id: scrapedProduct.id } });
  return null;
}

};
