import axios from 'axios';


export const setUserSession = (token: string) => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const removeUserSession = () => {
  delete axios.defaults.headers.common['Authorization'];
  window.localStorage.removeItem('persist:root');
};

const ApiClient = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(async (request:any) => {
    const access_token = '';

    if (access_token) {
      request.headers['Authorization'] = `Bearer ${access_token}`;
    } else {
      delete request.headers['Authorization'];
    }
    return request;
  });

  instance.interceptors.response.use(
    async (response:any) => {
      return response;
    },
    (error:any) => {
      if (error.message === 'Network Error') {
      }
      if (error.response && error.response.status === 401) {
        delete axios.defaults.headers.common['Authorization'];
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export default ApiClient();