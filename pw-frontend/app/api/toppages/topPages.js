import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = '367325569';
const keyFilePath = './analytics.json';

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFile: keyFilePath,
});

const getTopPages = async () => {
	console.log('hello');
  // Add your date range and other settings here
  const [response] = await analyticsDataClient.runReport({
    property: 'properties/' + propertyId,
    // Add the remaining settings for dimensions, metrics, etc.
  });

   console.log('Response from Google Analytics API:', response);
  // Process the response data, filter and sort the results
  // ...

  return newObj;
};

export default async function handler(req, res) {
	console.log('hai');
  try {
  	console.log('hello');
    const topPages = await getTopPages();
    console.log('topPages: ', topPages);
    res.status(200).json(topPages);
  } catch (error) {
    console.error('Error fetching top pages:', error);
    res.status(500).json({ message: 'Error fetching top pages' });
  }
}

export async function testHandler(req, res) {
  console.log("Test route hit");
  res.status(200).json({ message: "Test route hit" });
}