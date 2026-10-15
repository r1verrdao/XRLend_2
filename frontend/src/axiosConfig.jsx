import axios from 'axios';

const getBaseURL = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (process.env.NODE_ENV === 'development') return 'http://localhost:5001';
  // If accessing directly on port 3000 (PM2 serve), route to backend port 5001
  if (typeof window !== 'undefined' && window.location.port === '3000') {
    return `http://${window.location.hostname}:5001`;
  }
  // Same address as the page also works through the load balancer
  return '';
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
});

// WO this the server returns 401.
axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem('xrlend-user');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;