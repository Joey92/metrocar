import axios from 'axios';
import * as config from './config';

export interface NominatimResponseElement {
  lat: string;
  lon: string;
  display_name: string;
}

export const nominatimRequest = (q: string) =>
  axios.get<NominatimResponseElement[]>(`${config.NOMINATIM_URL}/search`, {
    params: { q },
  });
