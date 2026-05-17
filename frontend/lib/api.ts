import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api',
});

// Attach the Firebase ID token to every request automatically
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
