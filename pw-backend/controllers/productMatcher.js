// productMatcher.js

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.sanitizeTitleAndExtractMetadata = async (productName, scrapedProduct) => {
  const prompt = `Given the product title "${productName}", sanitize title to leave only product model. Extract metadata such as color, storage, and brand. Remove metadata from the title. Examples of metadata
  are color ('red', 'groen'), storage ('256GB'), brand ('Samsung', 'Apple', 'Sony'). Store metadata seperatly (see examples). Include the brand in the metadata only if you are confident about it.
  Example: if title = "Apple iPhone 13 Red 500GB", response should be: {"sanitizedTitle": "iPhone 13", "metadata": {"color": "red", "storage": "500GB", "brand": "Apple"}}\n
  Example: if title = "Samsung Galaxy S22 Groen 256GB", response should be: {"sanitizedTitle": "Galaxy S22", "metadata": {"color": "groen", "storage": "256GB", "brand": "Samsung"}}\n
  Example: if title = "PlayStation 5 + Hogwarts Legacy + Extra controller Wit", response should be: {"sanitizedTitle": "PlayStation 5", "metadata": {"game": "Hogwarts Legacy", "accessory": "Extra controller Wit", "brand": "Sony"}}\n\nResponse:\n`;

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });

  const resultText = response.data.choices[0].message.content.trim();

  try {
    const result = JSON.parse(resultText);
    return { sanitizedTitle: result.sanitizedTitle, metadata: result.metadata };
  } catch (error) {
    console.error(`Unable to parse JSON for product ID: ${scrapedProduct.id}`);
    await Product.update({ needsReview: true }, { where: { id: scrapedProduct.id } });
    return null;
  }
};
