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

exports.sanitizeTitleAndExtractMetadata = async (productName, categoryId, scrapedProduct, Product) => {

  let prompt;


    // category = phones
  if(categoryId === "phones") {
    prompt = `Sanitize the title to leave only the primary product model. Extract metadata such as color, storage, brand, accessories or cases. 
  Do not include the brand in the sanitizedTitle. Store metadata separately (see examples). 
  Provide a confidence score between 0 and 1, with 1 being the highest confidence in the sanitized title and extracted metadata.
Examples of metadata are color (examples: 'red', 'green', 'zwart'), storage ('256GB'), brand ('Samsung', 'Apple', 'Sony'), accessories or cases...
Only respond with valid JSON. Here's an example response for the updated prompt:\n\n
If title = "Samsung Galaxy S23 Ultra 512GB Zwart 5G", response should be: {"sanitizedTitle": "Galaxy S23 Ultra", "confidence": 1, "metadata": {"kleur": "Zwart", "opslag": "512GB", "merk": "Samsung", "netwerk": "5G"}}\n
If title = "OnePlus Nord 2T 5G - 128GB - Gray Shadow", response should be: {"sanitizedTitle": "Nord 2T", "confidence": 1, "metadata": {"kleur": "Gray Shadow", "opslag": "128GB", "merk": "OnePlus", "netwerk": "5G"}}\nIf title = "APPLE iPhone 14 Pro Max 5G 128 GB Space Black (MQ9P3ZD/A)", response should be: {"sanitizedTitle": "iPhone 14 Pro Max", "confidence": 1, "metadata": {"kleur": "Space Black", "opslag": "128GB", "merk": "Apple", "netwerk": "5G", "vendor id" : "MQ9P3ZD/A"}}\n
If title = "Sony Xperia T zwart", response should be: {"sanitizedTitle": "Xperia T", "confidence": 1, "metadata": {"kleur": "zwart", "merk": "Sony"}}\n
If title = "Samsung Galaxy S23 Plus 256GB Groen 5G + Clear View Book Case Groen", response should be: 
{"sanitizedTitle": "Galaxy S23 Plus", "confidence": 1, "metadata": {"kleur": "Groen", "opslag": "256GB", "merk": "Samsung", "netwerk": "5G", "accessoire": "Clear View Book Case Groen"}}\n
If title = "Huawei P30 - 128GB - Twilight Blauw (Aurora)", response should be: 
{"sanitizedTitle": "P30", "confidence": 1, "metadata": {"kleur": "Twilight Blauw (Aurora)", "opslag": "128GB", "merk": "Huawei"}}\nTitle = "${productName}".\n Response:`;

  } else if (categoryId === "25d4ff3d-30d7-495d-b5bf-84cfd6b9a1c9") {
    // category = gaming
      prompt = `Sanitize the title to leave only the primary product model. Extract metadata such as color, storage, brand, accessories or cases. 
  Do not include the brand in the sanitizedTitle. Store metadata separately (see examples). 
  Provide a confidence score between 0 and 1, with 1 being the highest confidence in the sanitized title and extracted metadata.
Examples of metadata are color (examples: 'red', 'green'), storage ('256GB'), brand ('Samsung', 'Apple', 'Sony'), accessories or cases...
Only respond with valid JSON. Here's an example response for the updated prompt:\n\n
If title = "Apple iPhone 13 Red 500GB", response should be: {"sanitizedTitle": "iPhone 13", "confidence": 1, "metadata": {"color": "red", "storage": "500GB", "brand": "Apple"}}\n
If title = "Samsung Galaxy S22 Green 256GB", response should be: {"sanitizedTitle": "Galaxy S22", "confidence": 1, "metadata": {"color": "green", "storage": "256GB", "brand": "Samsung"}}\nIf title = "PlayStation 5 + Hogwarts Legacy + Extra controller White", response should be: {"sanitizedTitle": "PlayStation 5", "confidence": 0.9, "metadata": {"game": "Hogwarts Legacy", "accessory": "Extra controller White", "brand": "Sony"}}\n
If title = "Nintendo Switch OLED + Pokémon Violet", response should be: {"sanitizedTitle": "Switch OLED", "confidence": 0.9, "metadata": {"game": "Pokémon Violet", "brand": "Nintendo"}}\n
If title = "PlayStation 5 Digital Edition + God of War Ragnarok + Samsung 980 Pro 2TB w/ heatsink", response should be: 
{"sanitizedTitle": "PlayStation 5 Digital Edition", "confidence": 0.8, "metadata": {"game": "God of War Ragnarok", "accessory": "Samsung 980 Pro 2TB w/ heatsink"}}\n
If title = "Nintendo Switch Rood/Blauw + Bluebuilt Travel Case", response should be: 
{"sanitizedTitle": "Switch", "confidence": 0.9, "metadata": {"color": "Rood/Blauw", "accessory": "Bluebuilt Travel Case", "brand": "Nintendo"}}\nTitle = "${productName}".\n Response:`;

  } else if (categoryId === "114b9201-567c-49b9-90ed-1b22a4e31c98") {
    // category = bluetooth speakers
    prompt = `Sanitize the title to leave only the primary product model. Extract metadata such as color, storage, brand, accessories or cases. 
  Do not include the brand in the sanitizedTitle. Store metadata separately (see examples). 
  Provide a confidence score between 0 and 1, with 1 being the highest confidence in the sanitized title and extracted metadata.
Examples of metadata are color (examples: 'red', 'green', 'zwart'), storage ('256GB'), brand ('Samsung', 'Apple', 'Sony'), accessories or cases...
Only respond with valid JSON. Here's an example response for the updated prompt:\n\n
If title = "JBL luidspreker bluetooth GO 3 blauw", response should be: {"sanitizedTitle": "GO 3", "confidence": 1, "metadata": {"kleur": "blauw", "merk": "JBL", "extra": "luidspreker bluetooth"}}\n
If title = "MARSHALL Draagbare luidspreker Emberton Bluetooth Zwart (00192607)", response should be: {"sanitizedTitle": "Emberton", "confidence": 1, "metadata": {"kleur": "Zwart", "merk": "Marshall", "extra": "Bluetooth", "vendor id": "00192607"}}\nIf title = "Google Nest Mini - Smart Speaker / Grijs / Nederlandstalig", response should be: {"sanitizedTitle": "Nest Mini", "confidence": 1, "metadata": {"kleur": "Grijs", "merk": "Google", "taal": "Nederlandstalig", "extra" : "Smart Speaker"}}\n
If title = "Sonos Roam SL Zwart + Wireless charger", response should be: {"sanitizedTitle": "Roam SL", "confidence": 1, "metadata": {"kleur": "zwart", "merk": "Sonos", "accessoire": "Wireless charger"}}\n
If title = "House of Marley Bag of Riddim II Draadloze Bluetooth Speaker met Draagtas - AUX", response should be: 
{"sanitizedTitle": "Bag of Riddim II", "confidence": 1, "metadata": {"merk": "House of Marley", "accessoire": "Draagtas", "extra": "AUX"}}\n
If title = "Sonos Move Zwart + Sonos One SL Zwart", response should be: 
{"sanitizedTitle": "Move", "confidence": 1, "metadata": {"merk": "Sonos", "extra": "Sonos One SL Zwart"}}\n
If title = "Marshall luidspreker bluetooth Willen Black and Brass", response should be: 
{"sanitizedTitle": "Willen", "confidence": 1, "metadata": {"merk": "Marshall", "kleur": "Black and Brass", "extra": "luidspreker bluetooth"}}\n
If title = "Xiaomi Mi luidspreker bluetooth Portable blauw", response should be: 
{"sanitizedTitle": "Mi", "confidence": 1, "metadata": {"merk": "Xiaomi", "kleur": "blauw", "extra": "luidspreker bluetooth Portable"}}\n
If title = "FRESH N REBEL Draagbare luidspreker Rockbox Bold XS Dreamy Lilac (1RB5100DL)", response should be: 
{"sanitizedTitle": "Rockbox Bold XS", "confidence": 1, "metadata": {"merk": "FRESH N REBEL", "kleur": "Dreamy Lilac", "extra": "Draagbare luidspreker", "vendor id": "1RB5100DL"}}\nTitle = "${productName}".\n Response:`;

  } else {
    // catch-all
        prompt = `Sanitize the title to leave only the primary product model. Extract metadata such as color, storage, brand, accessories or cases. 
  Do not include the brand in the sanitizedTitle. Store metadata separately (see examples). 
  Provide a confidence score between 0 and 1, with 1 being the highest confidence in the sanitized title and extracted metadata.
Examples of metadata are color (examples: 'red', 'green', 'zwart'), storage ('256GB'), brand ('Samsung', 'Apple', 'Sony'), accessories or cases...
Only respond with valid JSON. Here's an example response for the updated prompt:\n\n
If title = "Samsung Galaxy S23 Ultra 512GB Zwart 5G", response should be: {"sanitizedTitle": "Galaxy S23 Ultra", "confidence": 1, "metadata": {"kleur": "Zwart", "opslag": "512GB", "merk": "Samsung", "netwerk": "5G"}}\n
If title = "OnePlus Nord 2T 5G - 128GB - Gray Shadow", response should be: {"sanitizedTitle": "Nord 2T", "confidence": 1, "metadata": {"kleur": "Gray Shadow", "opslag": "128GB", "merk": "OnePlus", "netwerk": "5G"}}\nIf title = "APPLE iPhone 14 Pro Max 5G 128 GB Space Black (MQ9P3ZD/A)", response should be: {"sanitizedTitle": "iPhone 14 Pro Max", "confidence": 1, "metadata": {"kleur": "Space Black", "opslag": "128GB", "merk": "Apple", "netwerk": "5G", "vendor id" : "MQ9P3ZD/A"}}\n
If title = "Sonos Roam SL Zwart + Wireless charger", response should be: {"sanitizedTitle": "Roam SL", "confidence": 1, "metadata": {"kleur": "zwart", "merk": "Sonos", "accessoire": "Wireless charger"}}\n
If title = "PlayStation 5 Digital Edition + God of War Ragnarok + Samsung 980 Pro 2TB w/ heatsink", response should be: 
{"sanitizedTitle": "PlayStation 5 Digital Edition", "confidence": 0.8, "metadata": {"game": "God of War Ragnarok", "accessory": "Samsung 980 Pro 2TB w/ heatsink"}}\n
If title = "Huawei P30 - 128GB - Twilight Blauw (Aurora)", response should be: 
{"sanitizedTitle": "P30", "confidence": 1, "metadata": {"kleur": "Twilight Blauw (Aurora)", "opslag": "128GB", "merk": "Huawei"}}\nTitle = "${productName}".\n Response:`;

  }

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
