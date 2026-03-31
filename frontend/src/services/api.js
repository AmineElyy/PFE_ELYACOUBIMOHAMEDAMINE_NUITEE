import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/hotels',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getPlaces = async (name) => {
    const response = await api.get('/places', { params: { name } });
    return response.data;
};

export const searchRates = async (searchPayload) => {
    const response = await api.post('/search', searchPayload);
    return response.data;
};

export const getHotelDetails = async (hotelId) => {
    const response = await api.get(`/${hotelId}`); 
    return response.data;
};

export const prebookHotel = async (prebookPayload) => {
    const response = await api.post('/prebook', prebookPayload);
    return response.data;
};

export const bookHotel = async (bookPayload) => {
    const response = await api.post('/book', bookPayload);
    return response.data;
};
