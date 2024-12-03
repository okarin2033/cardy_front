import axios from '../axiosConfig';

const API_URL = 'http://localhost:8080/v1';

export const LANGUAGES = {
  JAPANESE: 'JAPANESE',
  RUSSIAN: 'RUSSIAN',
  ENGLISH: 'ENGLISH'
};

export const translateWord = async (word, targetLang, sourceLang = null) => {
  try {
    const response = await axios.post(`${API_URL}/translate`, {
      text: word,
      targetLanguage: targetLang,
      sourceLanguage: sourceLang
    });
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

export const getSupportedLanguages = async () => {
  try {
    const response = await axios.get(`${API_URL}/enums/languages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    // В случае ошибки возвращаем дефолтный список в том же формате
    return [
      { code: LANGUAGES.JAPANESE, value: 'Japanese' },
      { code: LANGUAGES.RUSSIAN, value: 'Russian' },
      { code: LANGUAGES.ENGLISH, value: 'English' }
    ];
  }
};
