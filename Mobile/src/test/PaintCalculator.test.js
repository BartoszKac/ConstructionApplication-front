const { calculateLocalArea, calculateTilesProject } = require("./calculations");

describe('Automatyczne testy jednostkowe logiki biznesowej', () => {
    
    // --- SEKCJA: KALKULATOR MALOWANIA (PAINT) ---
    describe('Moduł Malowania', () => {
        test('Weryfikacja algorytmu obliczania powierzchni netto (dodawanie i odejmowanie)', () => {
            const daneDodane = [{ width: "10", height: "2" }]; // 20m2
            const daneOdjete = [{ width: "1", height: "2" }];  // 2m2
            
            const wynik = calculateLocalArea(daneDodane, daneOdjete);
            
            expect(wynik).toBe("18.00");
        });

        test('Weryfikacja odporności na brak danych', () => {
            expect(calculateLocalArea([], [])).toBe("0.00");
        });
    });

    // --- SEKCJA: MODUŁ GLAZURNICZY (TILES) ---
    describe('Moduł Glazurniczy', () => {
        test('Obliczanie powierzchni mieszanej (prostokąt + skos/trójkąt)', () => {
            const areas = [
                { type: 'rect', dimA: "4", dimB: "2.5" }, // 10m2
                { type: 'tri',  dimA: "2", dimB: "3" }    // 0.5 * 2 * 3 = 3m2
            ];
            const waste = 1.15; // Zapas 15% (np. układ mijanka)

            const result = calculateTilesProject(areas, waste);

            expect(result.net).toBe("13.00");
            expect(result.gross).toBe("14.95"); // 13 * 1.15
            expect(result.wastePercent).toBe(15);
        });

        test('Poprawna obsługa polskich przecinków w wymiarach', () => {
            const areas = [{ type: 'rect', dimA: "1,5", dimB: "2,0" }]; // 1.5 * 2 = 3.00
            const result = calculateTilesProject(areas, 1.0);
            
            expect(result.net).toBe("3.00");
        });

        test('Walidacja: Zwrócenie null przy błędnych danych (liczby ujemne)', () => {
            const badAreas = [{ type: 'rect', dimA: "-5", dimB: "2" }];
            const result = calculateTilesProject(badAreas, 1.1);
            
            expect(result).toBeNull();
        });
    });
});