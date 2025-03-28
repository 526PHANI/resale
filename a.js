import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Corrected path to the JSON file
const filePath = path.join(__dirname, "src/pages/theaters.json");

// Debug the resolved file path
console.log("Resolved file path:", filePath);

// Load the JSON data
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Mapping of city name variations to standardized names
const cityMapping = {
  "Vizag": "Visakhapatnam",
  "Visakhapatnam": "Visakhapatnam",
  "Kakinada (Urban)": "Kakinada",
  "Kakinada": "Kakinada",
  "Vijaywada": "Vijayawada",
  "Vijayawada": "Vijayawada",
  "Hyderabad (Jedimetla)": "Hyderabad",
  "Hyderabad(Moosapet)": "Hyderabad",
  "Hyderabad": "Hyderabad",
  "KURNOOL": "Kurnool",
  "Kurnool": "Kurnool",
  "Guntur": "Guntur",
  "Vizianagaram": "Vizianagaram",
  "Nellore": "Nellore",
  "Rajahmundry": "Rajahmundry",
  "Tirupati": "Tirupati",
};

// Standardize city names
const standardizedData = data.map((entry) => {
  const standardizedCity = cityMapping[entry.city] || entry.city; // Use mapping if available, otherwise keep original
  return { ...entry, city: standardizedCity };
});

// Save the updated JSON back to the file
fs.writeFileSync(filePath, JSON.stringify(standardizedData, null, 2), "utf8");

console.log("City names have been standardized successfully!");