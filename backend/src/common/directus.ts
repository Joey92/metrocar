import axios from 'axios';
import { DIRECTUS_URL, DIRECTUS_USER_TOKEN } from './config';

export const directus = axios.create({
  baseURL: DIRECTUS_URL,
  headers: {
    Authorization: `Bearer ${DIRECTUS_USER_TOKEN}`,
  },
});

export default directus;
