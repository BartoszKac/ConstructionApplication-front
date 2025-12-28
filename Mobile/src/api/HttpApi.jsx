import axios from 'axios';

// Konfiguracja bazowego URL - lokalny adres IP z WiFi
const BASE_URL = 'http://192.168.1.37:8082';

let globalToken = null;

 function setGlobalToken(token) {
    globalToken = token;
}

function toStringEndpoint(type) {
    const ENDPOINTS = {
        REGISTER: "/register",
        AREA: "/sendAreaSet",
        LOGIN: "/login"
    };

    return ENDPOINTS[type] || type;
}

/**
 * Wysyła żądanie POST.
 * @param {Object} data - Dane do wysłania (body)
 * @param {String} endpointName - Nazwa endpointu (np. "LOGIN", "AREA")
 * @param {String|null} token - (Opcjonalnie) Token JWT. Jeśli brak, zostaw puste.
 */
async function ApiPost(data, endpointName, token = false) {
    try {
        const endpoint = toStringEndpoint(endpointName);
        const URL = `${BASE_URL}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${globalToken}`;
        }
        console.log('Token:', globalToken);
        console.log('=== Request Debug Info ===');
        console.log('URL:', URL);
        console.log('Endpoint Name:', endpointName);
        console.log('Token present:', !!token); 
        console.log('Full data:', data);
        console.log('========================');

        
        const response = await axios.post(URL, data, { headers });

        if(endpointName === "LOGIN"  ||  endpointName === "REGISTER" && response.data.token ){
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