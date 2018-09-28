const GET_URL = 'http://localhost:3000/api/';

const getRequest = async (id) => {
    try {
        return await axios.get(GET_URL + id);
    } catch (error) {        
        return undefined;
    }
}

module.exports = {
    getRequest: getRequest
};