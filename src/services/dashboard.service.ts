import axios from 'axios';
import { } from '../types/dashboard.types';
import { User } from '../types/auth.types';

class DashboardService {
    async getTasks(user: User) {
        try {
            const response = await axios.post('/getTasks', user);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response ? error.response.data : error.message);
        }
    }

    async createTask(user: User) {
        try {
            const response = await axios.post('/getTasks', user);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response ? error.response.data : error.message);
        }
    }
}

export const authService = new DashboardService();
