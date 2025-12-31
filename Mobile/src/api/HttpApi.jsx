import axios from 'axios';

const BASE_URL = 'http://192.168.1.37:8085';

let globalToken = null;

function setGlobalToken(token) {
    globalToken = token;
}

function toStringEndpoint(type) {
    const ENDPOINTS = {
        REGISTER: "/register",
        AREA: "/sendAreaSet",
        LOGIN: "/login",
        INITPAINT: "/initialize",
        PAINT: "/paint"
    };

    return ENDPOINTS[type] || type;
}

async function ApiPost(data, endpointName, token = false) {
    try {
        const endpoint = toStringEndpoint(endpointName);
        const URL = `${BASE_URL}${endpoint}`;

        // 1. DYNAMICZNE USTAWIANIE NAGŁÓWKÓW
        const headers = {};

        if (endpointName === "INITPAINT") {
            // Przy wysyłaniu zdjęć (FormData) NIE ustawiamy Content-Type ręcznie,
            // Axios zrobi to sam, dodając odpowiedni "boundary"
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            headers['Content-Type'] = 'application/json';
        }

        if (token && globalToken) {
            headers['Authorization'] = `Bearer ${globalToken}`;
        }

        console.log('=== Request Debug Info ===');
        console.log('URL:', URL);
        console.log('Endpoint Name:', endpointName);
        console.log('Content-Type:', headers['Content-Type']);
        console.log('========================');

        // 2. WYKONANIE ŻĄDANIA
        const response = await axios.post(URL, data, { headers });

        if ((endpointName === "LOGIN" || endpointName === "REGISTER") && response.data.token) {
            setGlobalToken(response.data.token);
        }

        console.log('Odpowiedź sukces:', response.data);
        return response.data;

    } catch (error) {
        console.error('Szczegóły błędu:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        throw error;
    }
}

export default ApiPost;