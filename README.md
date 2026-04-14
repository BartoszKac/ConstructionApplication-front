Construction App — Mobile Frontend

A React Native mobile application for renovation planning — calculate paint coverage, browse tile options, visualize wall colors with AI, and manage project notes.


🛠️ Tech Stack

Framework: React Native (Expo ~54)
Navigation: React Navigation (Native Stack)
HTTP Client: Axios
State Management: React Context API
Local Storage: AsyncStorage
UI Components: react-native-picker-select, react-native-wheel-color-picker, react-native-chart-kit
AR / Image Processing: expo-image-picker + custom SAM AI backend
Testing: Jest


✨ Key Features

🎨 Paint Calculator — Enter room dimensions (with windows/doors subtracted), pick a color, and get real-time pricing from both Polish market scrapers and eBay global listings, with full cost analysis charts.
🧱 Tile Module — Add rectangular or triangular surface zones, choose a tile format and laying pattern (straight / brick / diamond), calculate material waste, and fetch matching products from Castorama.
📸 AR Wall Painter — Upload a room photo, tap a wall segment, and watch the AI (Meta SAM model) fill it with your chosen color in real time. Supports multi-color painting and undo.
📁 Project Notes — Organise saved products into named project folders, attach gallery photos, view full product details, and delete entries.


screenshot
<img width="1556" height="819" alt="image" src="https://github.com/user-attachments/assets/89d6494d-ba79-4264-885c-327010d627e8" />

<img width="1110" height="643" alt="image" src="https://github.com/user-attachments/assets/b0076aba-8b1e-441b-817a-bed866babc45" />

<img width="1652" height="797" alt="image" src="https://github.com/user-attachments/assets/a0ccff04-3ff4-431a-927c-5b4c3702b7c6" />

<img width="1573" height="817" alt="image" src="https://github.com/user-attachments/assets/5495c487-3a3c-43fe-9841-08143f3e0d29" />


