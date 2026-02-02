import axios from 'axios';

// Ustawiamy IP Twojego komputera, które telefon widzi przez kabel
const BASE_IP = '10.228.91.183'; 
const GATEWAY_URL = `http://${BASE_IP}:8085`; 

let globalToken = null;

export function setGlobalToken(token) {
    globalToken = token;
}

// Mapowanie typów żądań na konkretne ścieżki
function toStringEndpoint(type) {
    const ENDPOINTS = {
        REGISTER: "/register",
        AREA: "/sendAreaSet",
        LOGIN: "/login",
        INITPAINT: "/initialize",
        PAINT: "/paint",
        TILES: "/tiles"
    };
    return ENDPOINTS[type] || type;
}

async function ApiPost(data, endpointName, token = false) {
    // KLUCZOWA ZMIANA: Zawsze uderzamy w jeden URL (Gateway)
    const endpoint = toStringEndpoint(endpointName);
    const URL = `${GATEWAY_URL}${endpoint}`;

    try {
        const headers = {};
        
        // Obsługa multipart dla przesyłania zdjęć do Pythona
        if (endpointName === "INITPAINT") {
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            headers['Content-Type'] = 'application/json';
        }

        if (token && globalToken) {
            headers['Authorization'] = `Bearer ${globalToken}`;
        }

        // Timeouty zostawiamy – Gateway i tak musi poczekać na mikroserwisy
        const timeoutValue = endpointName === "INITPAINT" ? 60000 
                           : endpointName === "TILES" ? 30000 
                           : 15000;

        console.log(`[FRONTEND -> GATEWAY] Akcja: ${endpointName} | Cel: ${URL}`);

        const response = await axios.post(URL, data, { 
            headers,
            timeout: timeoutValue 
        });

        // Logi pomocnicze dla Twoich analiz
        if (["PAINT", "AREA", "TILES"].includes(endpointName)) {
            console.log(`--- 📊 ODPOWIEDŹ PRZEZ GATEWAY: ${endpointName} ---`);
            if (response.data && response.data.data) {
                console.log(`Otrzymano elementów: ${response.data.data.length}`);
            }
        }

        // Automatyczne ustawianie tokena po autoryzacji
        if ((endpointName === "LOGIN" || endpointName === "REGISTER") && response.data.token) {
            setGlobalToken(response.data.token);
        }

        return response.data;

    } catch (error) {
        console.log(`--- 🛑 BŁĄD KOMUNIKACJI Z BRAMKĄ (${endpointName}) 🛑 ---`);
        if (error.response) {
            // Bramka przekazała błąd z mikroserwisu
            console.log("Status błędu:", error.response.status);
            console.log("Dane błędu:", error.response.data);
        } else {
            // Problem z połączeniem do samej Bramki
            console.log("Nie można połączyć się z Gatewayem:", error.message);
        }
        throw error;
    }
}

export default ApiPost;