import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthData } from './authContext';

export const AxiosInstance = axios.create({
  baseURL: 'https://backend-zavrsni-rad-mirta.herokuapp.com/',
  
});

AxiosInstance.interceptors.request.use(async (request) => {
  const token = await getAuthData();

  if (request.headers) {
    request.headers['Authorization'] = 'Bearer ' + token;
  }
  return request;
});

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw error;
  }
);

const getAuthData = async () => {
  const data = await AsyncStorage.getItem('@AuthData');
  if (data) {
    const authData: AuthData = JSON.parse(data);
    return authData.token;
  } else {
    return '';
  }
};
