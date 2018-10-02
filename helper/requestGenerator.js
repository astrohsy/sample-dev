const axios = require('axios');

const interceptorGenerator = (customAxios, maxRetry, waitTime) => {
    const interceptor = async (error) => {
        const { __retryCount: retryCount = 0 } = error.config;
        error.config.__retryCount = retryCount + 1;
        error.config.__isRetryRequest = true;

        if (error.config &&
            error.response &&
            error.response.status === 400 &&
            retryCount < maxRetry) {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(customAxios.request(error.config)), waitTime);
            });
        }

        return Promise.reject(error);
    };

    return interceptor;
}

const requestGenerator = (method, url, maxRetry, waitTime) => {
    const token = "1234";
    const config = { 'Authorization': 'Bearer ' + token }

    const customAxios = axios.create({
        headers: config
    });
    const customInterceptor = interceptorGenerator(customAxios, maxRetry, waitTime);

    
    customAxios.interceptors.response.use(null, customInterceptor);

    const request = async(id) => {
        try {
            return await customAxios({
                method: method,
                url: url + '/' + id
            });
        } catch (error) {  
            return error;
        }
    }

    return request;
}

module.exports = requestGenerator;