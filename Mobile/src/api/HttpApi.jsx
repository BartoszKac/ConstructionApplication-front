import axios from 'axios';


// Ustawiamy IP Twojego komputera, które telefon widzi przez kabel
const BASE_IP = '192.168.1.37'; 
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
    const endpoint = toStringEndpoint(endpointName);
    const URL = `${GATEWAY_URL}${endpoint}`;

    try {
        const headers = {};

        if (endpointName === "INITPAINT") {
            headers['Content-Type'] = 'multipart/form-data';
        } else {
            headers['Content-Type'] = 'application/json';
        }

        if (token && globalToken) {
            headers['Authorization'] = `Bearer ${globalToken}`;
        }
        const timeoutValue = endpointName === "INITPAINT" ? 60000 
                           : endpointName === "TILES" ? 30000 
                           : 15000;

        const response = await axios.post(URL, data, { 
            headers,
            timeout: timeoutValue 
        });

        if (["PAINT", "AREA", "TILES"].includes(endpointName)) {
            console.log(`--- 📊 ODPOWIEDŹ PRZEZ GATEWAY: ${endpointName} ---`);
            if (response.data && response.data.data) {
                console.log(`Otrzymano elementów: ${response.data.data.length}`);
            }
        }

        if ((endpointName === "LOGIN" || endpointName === "REGISTER") && response.data.token) {
            setGlobalToken(response.data.token);
        }

        return response.data;

    } catch (error) {
        console.log(`--- 🛑 BŁĄD KOMUNIKACJI Z BRAMKĄ (${endpointName}) 🛑 ---`);
        if (error.response) {
            console.log("Status błędu:", error.response.status);
            console.log("Dane błędu:", error.response.data);
        } else {
            console.log("Nie można połączyć się z Gatewayem:", error.message);
        }
        throw error;
    }
}

export default ApiPost;