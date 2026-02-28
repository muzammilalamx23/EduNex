import axios from 'axios';

// API detection: In development (port 5173), use external proxy. In production, use relative /api
const API_BASE_URL = window.location.port === '5173'
    ? `http://${window.location.hostname}:5000/api`
    : '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle 401 (unauthorized) globally
// Redirects to /auth, UNLESS the user is already on a public page.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const publicPages = ['/', '/auth', '/courses', '/course-detail'];
            const isOnPublicPage = publicPages.some(
                (page) => window.location.pathname === page || window.location.pathname.startsWith(page)
            );

            if (!isOnPublicPage) {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
