import axios from 'axios';

import { getUserSession } from './cognito/UserPool';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_PATH,
});

api.interceptors.request.use(async (config) => {
  let token = null;

  try {
    const session = await getUserSession();

    token = session.getIdToken().getJwtToken();
  } catch (e) {
    // No user, no token
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const handleAPIError = (error: any) => {
  return error;
};
