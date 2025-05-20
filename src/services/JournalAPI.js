import axios from 'axios';

const API_URL = 'https://6826495c397e48c91315a0b1.mockapi.io/api/Journal';

export const getJournals = () => axios.get(API_URL);
export const addJournal = (data) => axios.post(API_URL, data);
export const updateJournal = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteJournal = (id) => axios.delete(`${API_URL}/${id}`);