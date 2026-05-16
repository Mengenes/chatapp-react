import axios, { type  AxiosRequestConfig } from "axios";


interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}


let isRefreshing = false;
let refreshQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error?: unknown) {
  refreshQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  refreshQueue = [];
}

const axiosBaseurl = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BASEURL,
  withCredentials: true,
});

axiosBaseurl.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then(() => axiosBaseurl.request(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axiosBaseurl.post("/auth/refresh");
      flushQueue();
      return axiosBaseurl.request(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosBaseurl;