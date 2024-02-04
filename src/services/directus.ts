import axios from "axios";
import {
  BACKEND_SCHEME,
  BACKEND_DOMAIN,
  INTERNAL_BACKEND_USER_TOKEN,
  INTERNAL_BACKEND_SCHEME,
  INTERNAL_BACKEND_DOMAIN,
} from "../config";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { parseJwt } from "../util/auth";

export const baseURL = `${BACKEND_SCHEME}://api.${BACKEND_DOMAIN}`;
export const internalBaseURL = `${INTERNAL_BACKEND_SCHEME}://${INTERNAL_BACKEND_DOMAIN}`;

export const axiosConfigDefaults = {
  baseURL,
  timeout: 10000,
  withCredentials: true,
};

export const internalApi = axios.create({
  baseURL: internalBaseURL,
  headers: {
    Authorization: `Bearer ${INTERNAL_BACKEND_USER_TOKEN}`,
  },
});

const api = axios.create(axiosConfigDefaults);

api.interceptors.request.use(
  async (config) => {
    try {
      let token = await checkAuthExpireAndRefresh();
      if (!token) {
        token = localStorage.getItem("authToken");
      }

      if (!token) {
        return config;
      }

      if (!config.headers) {
        config.headers = {};
      }

      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (e) {}
    return config;
  },
  () => undefined,
  { synchronous: false }
);

export default api;

export async function refreshAuthToken() {
  try {
    const resp = await axios({
      // don't use existing client since it will want to refresh the auth token indefinately
      baseURL,
      timeout: 10000,
      withCredentials: true,
      url: "/auth/refresh",
      method: "POST",
      data: {
        mode: "cookie",
      },
    });

    const { access_token } = resp.data.data;
    window.localStorage.setItem("authToken", access_token);
    return access_token;
  } catch (e) {
    console.log("not able to refresh auth token", e);
    window.localStorage.removeItem("authToken");
  }
}

async function checkAuthExpireAndRefresh() {
  const existingToken = window.localStorage.getItem("authToken");

  if (!existingToken) {
    return;
  }

  const parsedToken = parseJwt(existingToken);

  if (!parsedToken) {
    return;
  }

  const expired = parsedToken.exp < +new Date() / 1000;

  if (!expired) {
    return existingToken;
  }

  return refreshAuthToken();
}

const httpLink = new HttpLink({
  uri: `${baseURL}/graphql`,
  credentials: "include",
});
const systemHttpLink = new HttpLink({ uri: `${baseURL}/graphql/system` });

const sessionLink = onError(() => {
  checkAuthExpireAndRefresh();
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: window.localStorage.getItem("authToken")
        ? `Bearer ${window.localStorage.getItem("authToken")}`
        : null,
    },
    withCredentials: true,
  }));

  return forward(operation);
});

export const GraphQL = new ApolloClient({
  link: concat(authMiddleware, sessionLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

export const systemGraphQL = new ApolloClient({
  link: concat(authMiddleware, sessionLink.concat(systemHttpLink)),
  cache: new InMemoryCache(),
});
