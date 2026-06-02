import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== "undefined"
    ? import.meta.env.VITE_API_URL
    : "http://localhost:4000";

export const axiosInstance = axios.create({
    baseURL: `${apiBaseUrl}/api/v1`,
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        const url = response.config.url;
        if (url && (
            url.includes("/cart/addCart") || 
            url.includes("/cart/removeitem") || 
            url.includes("/cart/updateCart") || 
            url.includes("/order/createOrder")
        )) {
            window.dispatchEvent(new Event("cartUpdated"));
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);