import axios from 'axios';

// Konfiguracja bazowego URL - użyj swojego lokalnego IP
// Konfiguracja bazowego URL - lokalny adres IP z WiFi
const BASE_URL = 'http://172.18.224.1:8082'; // Twój aktualny adres IP WiFi
// WAŻNE: Telefon i komputer muszą być w tej samej sieci WiFi!
function toStringEndpoint(data) {
    const ENDPOINT = {
        REGISTER: "REGISTER",
        AREA:"AREA"
    };

    if (data === ENDPOINT.REGISTER) {
        data = "/register";
    }
     if (data === ENDPOINT.AREA) {
        data = "/sendAreaSet";
    }
    return data;
}

async function ApiPost(data, endpoint) {
    try {
        endpoint = toStringEndpoint(endpoint);
        const URL = `${BASE_URL}${endpoint}`;
        console.log('=== Request Debug Info ===');
        console.log('URL:', URL);
        console.log('Endpoint:', endpoint);
        console.log('Full data:', data);
        console.log('========================');

        const response = await axios.post(URL, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Odpowiedź:', response.data);
        return response.data;
    } catch (error) {
        console.error('Szczegóły błędu:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        throw error; // Przekazujemy błąd dalej
    }
}

export default ApiPost;

