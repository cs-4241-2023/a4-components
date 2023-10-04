import axios from 'axios';
import { LoginData, RegisterData } from '../types/auth.types';

class AuthService {
    async login(data: LoginData) {
        try {
            const response = await axios.post('/login', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response ? error.response.data : error.message);
        }
    }

    async register(data: RegisterData) {
        try {
            const response = await axios.post('/register', data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response ? error.response.data : error.message);
        }
    }
}

export const authService = new AuthService();
