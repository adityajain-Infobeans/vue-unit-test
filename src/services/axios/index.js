import axios from 'axios';

export function userLogin(credentials) {
    return axios.post('/login', credentials);
}
