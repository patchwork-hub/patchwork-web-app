import { searchQuery } from "@/services/search/searchQuery";
import { getToken } from "@/stores/auth";
import { DEFAULT_API_URL } from "@/utils/constant";
import { ensureHttp } from "@/utils/helper/helper";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL}`;

const http = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const userOriginInstance = Cookies.get("domain") ?? DEFAULT_API_URL;
    const token = getToken();
    // Check if removeBearerToken is explicitly true
    const removeToken = config.params?.removeBearerToken === true;

    // Set Authorization header based on token and removeToken flag
    if (token && token.length > 0 && !removeToken) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.Authorization = ""; // Clear the header if no token or removeToken is true
    }

    // Check if isDynamicDomain is explicitly true and domain_name is provided
    if (config.params?.isDynamicDomain === true && config.params?.domain_name) {
      config.baseURL = ensureHttp(config.params.domain_name);
      // Remove used params
      delete config.params.isDynamicDomain;
      delete config.params.domain_name;
    }
    // Fallback to userOriginInstance if not dynamic and different from baseURL
    else if (userOriginInstance !== baseURL) {
      config.baseURL = ensureHttp(userOriginInstance);
    }

    // Check if different_origin is true and url is provided - this code is for status actions
    if (config.params?.differentOrigin === true && config.params?.url) {
      const searchResults = await searchQuery({
        query: config.params.url,
        type: "statuses",
      });
      const searchedStatus = searchResults?.statuses?.find(
        (status) => status.url === config.params.url
      );
      if (searchedStatus) {
        const statusPattern = /\/api\/v1\/statuses\/[^/]+/;
        if (config.url && statusPattern.test(config.url)) {
          config.url = config.url.replace(
            statusPattern,
            `/api/v1/statuses/${searchedStatus.id}`
          );
        } else if (config.data?.in_reply_to_id) {
          config.data.in_reply_to_id = searchedStatus.id;
        }
      }
      // Remove used params
      config.params.differentOrigin = false;
      config.params.url = "";
    }

    // Optionally, remove removeBearerToken if it exists
    if (config.params?.removeBearerToken !== undefined) {
      delete config.params.removeBearerToken;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    if (!response.data) {
      return Promise.reject(new Error("No data in response"));
    }
    return response;
  },
  (error: AxiosError) => Promise.reject(error)
);

export const setAutoLogoutInterceptor = (handleLogout: () => void) => {
  const id = http.interceptors.response.use(
    (response: AxiosResponse) => {
      if (!response.data) {
        return Promise.reject(new Error("No data in response"));
      }
      return response;
    },
    (error: AxiosError) => {
      if (
        error.response?.status === 401 &&
        error.config?.url !== "/oauth/token"
      ) {
        handleLogout();
      }
      return Promise.reject(error);
    }
  );
  return () => http.interceptors.response.eject(id);
};

export default http;
