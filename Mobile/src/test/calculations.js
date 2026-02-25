// Funkcja licząca metraż
const calculateLocalArea = (addRoom, deleteRoom) => {
    const addArea = addRoom.reduce(
        (acc, curr) => acc + (parseFloat(curr.width || 0) * parseFloat(curr.height || 0)), 
        0
    );
    const subArea = deleteRoom.reduce(
        (acc, curr) => acc + (parseFloat(curr.width || 0) * parseFloat(curr.height || 0)), 
        0
    );
    return (addArea - subArea).toFixed(2);
};



/**
 * Logika dla Modułu Glazurniczego
 */
const calculateTilesProject = (areas, wasteMultiplier) => {
    let totalNetArea = 0;
    let isValid = true;

    areas.forEach((area) => {
        // Obsługa różnych formatów (liczba, string z kropką, string z przecinkiem)
        const valA = String(area.dimA || "").replace(',', '.');
        const valB = String(area.dimB || "").replace(',', '.');
        
        const a = parseFloat(valA);
        const b = parseFloat(valB);

        // Walidacja inżynierska
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
            isValid = false;
        } else {
            // Wybór wzoru na podstawie typu figury
            totalNetArea += area.type === 'rect' ? (a * b) : (0.5 * a * b);
        }
    });

    if (!isValid) return null;

    const grossArea = totalNetArea * wasteMultiplier;

    return {
        net: totalNetArea.toFixed(2),
        gross: grossArea.toFixed(2),
        wastePercent: Math.round((wasteMultiplier - 1) * 100)
    };
};

// Zamiast dwóch oddzielnych linii, zrób jedną wspólną:
module.exports = { 
    calculateLocalArea, 
    calculateTilesProject 
};