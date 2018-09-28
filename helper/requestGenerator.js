const axios = require('axios');

const GET_URL = 'http://localhost:3000/api/';

const interceptorGenerator = (customAxios, maxRetry, waitTime) => {
    const interceptor = async (error) => {
        const { __retryCount: retryCount = 0 } = error.config;
        error.config.__retryCount = retryCount + 1;
        error.config.__isRetryRequest = true;
        console.log(maxRetry);

        if (error.config && error.response.status === 400 && retryCount < maxRetry) {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(customAxios.request(error.config)), waitTime);
            });
        }

        return Promise.reject(error);
    };

    return interceptor;
}

const requestGenerator = (method, url, maxRetry, waitTime) => {
    const customAxios = axios.create();
    const customInterceptor = interceptorGenerator(customAxios, maxRetry, waitTime);

    customAxios.interceptors.response.use(null, customInterceptor);

    const request = async(id) => {
        try {
            return await customAxios.get(GET_URL + id);
        } catch (error) {        
            return undefined;
        }
    }

    return request;
}

module.exports = requestGenerator;