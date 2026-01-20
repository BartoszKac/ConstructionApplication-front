import axios from 'axios';

// WSKAZÓWKA DLA EXPO GO: 
// Jeśli testujesz na fizycznym telefonie, zmień '127.0.0.1' na IP swojego komputera (np. '192.168.1.15')
const BASE_IP = '127.0.0.1'; 

const JAVA_URL = `http://${BASE_IP}:8082`; 
const PYTHON_URL = `http://${BASE_IP}:8087`; 
const TILES_URL = `http://${BASE_IP}:8089`; 

let globalToken = null;

export function setGlobalToken(token) {
    globalToken = token;
}

function getBaseUrl(endpointName) {
    if (endpointName === "INITPAINT" || endpointName === "PAINT") {
        return PYTHON_URL;
    }
    if (endpointName === "TILES") {
        return TILES_URL;
    }
    return JAVA_URL;
}

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
    const baseUrl = getBaseUrl(endpointName);
    const endpoint = toStringEndpoint(endpointName);
    const URL = `${baseUrl}${endpoint}`;

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

        // Dynamiczny timeout: Scraping potrzebuje więcej czasu niż zwykły login
        const timeoutValue = endpointName === "INITPAINT" ? 60000 
                           : endpointName === "TILES" ? 30000 
                           : 15000;

        console.log(`[REQ] ${endpointName} -> ${URL}`);

        const response = await axios.post(URL, data, { 
            headers,
            timeout: timeoutValue 
        });

        // --- INSPEKCJA ---
        if (["PAINT", "AREA", "TILES"].includes(endpointName)) {
            console.log(`--- 📊 INSPEKCJA DANYCH: ${endpointName} ---`);
            if (response.data) {
                const count = Array.isArray(response.data.data) ? response.data.data.length : 0;
                console.log(`Status: ${response.data.status}, Elementów: ${count}`);
            }
        }

        if ((endpointName === "LOGIN" || endpointName === "REGISTER") && response.data.token) {
            setGlobalToken(response.data.token);
        }

        return response.data;

    } catch (error) {
        console.log(`--- 🛑 BŁĄD API: ${endpointName} 🛑 ---`);
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Treść:", error.response.data);
        } else {
            console.log("Błąd połączenia/Timeout:", error.message);
        }
        throw error;
    }
}

export default ApiPost;