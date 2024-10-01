import axios from '../utils/request';

export const $login = async (params) => {
  try {
    const response = await axios.post('/auth/login', params);
    
    if (response.status === 200) {
      console.log('Login successful:', response.data);
      return response.data;
    } else {
      // Handle unexpected status codes
      console.warn('Unexpected status code:', response.status);
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          console.error('Login failed: Unauthorized');
          throw new Error('Unauthorized access. Please check your credentials.');
        case 500:
          console.error('Login failed: Internal Server Error');
          throw new Error('Server error. Please try again later.');
        default:
          console.error('Login failed:', error.response.status, error.response.data);
          throw new Error('An error occurred during login. Please try again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Login failed: No response received', error.request);
      throw new Error('No response from server. Please check your internet connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Login error:', error.message);
      throw error;
    }
  }
};
