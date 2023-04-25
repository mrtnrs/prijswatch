const API_URL = '/api/search';
const SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL;

export const updateSearchIndex = async () => {
  console.log('updating search...');
  try {
    const response = await fetch(`${SERVER_URL}${API_URL}/update-index`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to update search index');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Error updating search index');
  }
};