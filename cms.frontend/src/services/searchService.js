import axiosClient from '../api/axiosClient';

const searchService = {
    getSearchResults: (keyword) => {
        return axiosClient.get(`/products/search?q=${keyword}`);
    }
};
export default searchService;