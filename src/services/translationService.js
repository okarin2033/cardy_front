import axios from 'axios';

const API_URL = 'http://localhost:8080/v1';

export const translateWord = async (word, language) => {
  try {
    const response = await axios.get(`${API_URL}/translate`, {
      params: {
        text: word,
        sourceLang: 'JAPANESE',
        targetLang: language
      }
    });
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    return null;
  }
};
