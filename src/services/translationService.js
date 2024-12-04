import axios from '../axiosConfig';

const API_URL = 'http://localhost:8080/v1';

export const LANGUAGES = {
  JAPANESE: 'JAPANESE',
  RUSSIAN: 'RUSSIAN',
  ENGLISH: 'ENGLISH'
};

export const translateWord = async (word, sourceLang, targetLang) => {
  try {
    // Извлекаем код языка, если передан объект
    const sourceLanguage = sourceLang?.code || sourceLang;
    const targetLanguage = targetLang?.code || targetLang;

    const response = await axios.post(`${API_URL}/translate`, {
      text: word,
      sourceLanguage,
      targetLanguage
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
    // В случае ошибки возвращаем дефолтный список
    return [
      { code: LANGUAGES.JAPANESE, value: 'Японский' },
      { code: LANGUAGES.RUSSIAN, value: 'Русский' },
      { code: LANGUAGES.ENGLISH, value: 'Английский' }
    ];
  }
};
