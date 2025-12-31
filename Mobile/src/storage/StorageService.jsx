import AsyncStorage from '@react-native-async-storage/async-storage';

// ... wewnątrz komponentu MyNoteView ...

// 1. FUNKCJA ZAPISYWANIA (Storage)
const saveFolders = async (foldersToSave) => {
  try {
    // AsyncStorage przechowuje TYLKO stringi, więc musimy zamienić tablicę na tekst JSON
    const jsonValue = JSON.stringify(foldersToSave);
    await AsyncStorage.setItem('@my_folders', jsonValue);
  } catch (e) {
    console.error("Błąd zapisu!", e);
  }
};

// 2. FUNKCJA ODCZYTYWANIA (Load)
const loadFolders = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@my_folders');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Błąd odczytu!", e);
  }
};

export { saveFolders, loadFolders };