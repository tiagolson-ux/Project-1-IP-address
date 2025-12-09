// ===============================
// 1. CONNECT TO THE HTML ELEMENTS
// ===============================
//
// speaking notes
// These lines connect my JavaScript to the HTML elements
// so I can read user input and update text on the page.

const ipInput = document.getElementById("ip-input");
const ipForm = document.getElementById("ip-form");

const infoIp = document.getElementById("info-ip");
const infoLocation = document.getElementById("info-location");
const infoTimezone = document.getElementById("info-timezone");
const infoIsp = document.getElementById("info-isp");

console.log("DOM elements selected.");


// ===============================
// 2. MAP VARIABLES
// ===============================
//
// Speaking notes:
// The map variable will hold the Leaflet map instance.
// The marker variable will hold the pin on the map.

let map;    // Leaflet map
let marker; // Leaflet marker

console.log("Map variables declared.");


// ===============================
// 3. API CONFIGURATION (IPIFY)
// ===============================
//
// Speaking notes:
// Store my API key and the base URL for the IPify Geo API.
// The key is required for authentication.

const IPIFY_API_KEY = "at_siSBDQRbyRddjWRShO6tGpdAyBSo3";
const IPIFY_BASE_URL = "https://geo.ipify.org/api/v2/country,city";

console.log("API config ready.");


// -------------------------------------------------------------
// Helper function: buildApiUrl
// -------------------------------------------------------------
//
// Speaking notes:
// This builds the URL I call with fetch().
// If user typed an IP address, use ipAddress param.
// Otherwise, treat it as a domain.

function buildApiUrl(ipOrDomain) {
  const url = new URL(IPIFY_BASE_URL);
  url.searchParams.set("apiKey", IPIFY_API_KEY);

  if (ipOrDomain) {
    // Simple IPv4 check: numbers separated by dots
    const looksLikeIpV4 = /^\d+\.\d+\.\d+\.\d+$/.test(ipOrDomain);
    if (looksLikeIpV4) {
      url.searchParams.set("ipAddress", ipOrDomain);
    } else {
      url.searchParams.set("domain", ipOrDomain);
    }
  }

  return url.toString();
}

console.log("buildApiUrl function defined.");


// ===============================
// 4. INITIALIZE OR UPDATE THE MAP
// ===============================
//
// NOTE TO SELF:
// initMap() takes latitude + longitude and: creates the map the first time,
// or recenters it if it already exists.
// It also creates or moves the marker.
// This is how the map jumps to the new IP location.

function initMap(lat, lng) {
  if (!map) {
    // First time: create the map
    map = L.map("map").setView([lat, lng], 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
  } else {
    // Map already exists: just move the view
    map.setView([lat, lng], 13);
  }

  // Handle the marker
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }
}

console.log("initMap function defined.");


// ===============================
// 5. UPDATE THE INFO PANEL
// ===============================
//
// NOTE TO SELF:
// This takes the API response and updates the four
// info fields in the DOM.
// - IP Address
// - Location (city, region, country)
// - Timezone
// - ISP (internet provider)
//
// This is how the screen updates AUTOMATICALLY.


function updateInfoPanel(data) {
  const ip = data.ip;
  const location =
    data.location.city +
    ", " +
    data.location.region +
    ", " +
    data.location.country;
  const timezone = "UTC " + data.location.timezone;
  const isp = data.isp;

  infoIp.textContent = ip;
  infoLocation.textContent = location;
  infoTimezone.textContent = timezone;
  infoIsp.textContent = isp;
}

console.log("updateInfoPanel function ready.");


// ===============================
// 6. MAIN FETCH FUNCTION
// ===============================
//
// NOTE TO SELF:
// fetchAndDisplay is the heart of the app.
// When called, this function does:
//  1. Builds the API URL (via buildApiUrl())
//  2. Calls fetch() to get data from IPify
//  3. Check for HTTP errors
//  4. Parse JSON
//  5. Converts the response to JSON
//  6. Update map
//  7. Catch and handle errors
// EVERYTHING that happens after searching comes from here.

async function fetchAndDisplay(ipOrDomain) {
  try {
    const url = buildApiUrl(ipOrDomain);
    console.log("Requesting:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("API error: " + response.status);
    }

    const data = await response.json();
    console.log("API response:", data);

// Update the text info
// Once fetch() returns data,
// I pass the data to:
//
// updateInfoPanel() → updates the text on the page
// initMap(lat, lng) → recenters map + updates marker
//
// These two functions work together to update the UI.

updateInfoPanel(data);


    // Get coordinates and update the map
    const lat = data.location.lat;
    const lng = data.location.lng;

    initMap(lat, lng);
  } catch (error) {
    console.error("Problem fetching IP data:", error);

    // Friendly error message
    infoIp.textContent = "Error";
    infoLocation.textContent = "Could not load data";
    infoTimezone.textContent = "-";
    infoIsp.textContent = "-";
  }
}

console.log("fetchAndDisplay function defined.");


// ===============================
// 7. INITIAL LOAD (USER'S OWN IP)
// ===============================
//
// NOTE TO SELF:
// When the page loads, call fetchAndDisplay()
// with no argument so IPify uses my own IP.
// NOTE TO SELF:
// When the page first loads, this event listener runs.
// It calls fetchAndDisplay() with NO argument.
// IPify will automatically use the user's current IP.
//
// This is why the info panel and map show MY location on page load.
//

window.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplay();
});

console.log("DOMContentLoaded listener added.");


// ===============================
// 8. FORM SUBMISSION HANDLER
// ===============================
//
// NOTE TO SELF:
// When the user types an IP or domain and hits Enter:
//
// 1. preventDefault() stops page from refreshing
// 2. I read the value from the input box
// 3. If empty → show alert
// 4. If valid → call fetchAndDisplay(value)
//
// This triggers a NEW API call and updates everything.
// On form submit:
//  - Prevent page refresh
//  - Read input value
//  - Validate it is not empty
//  - Call fetchAndDisplay(value)

ipForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const value = ipInput.value.trim();

  if (!value) {
    alert("Please enter an IP address or domain.");
    return;
  }

  fetchAndDisplay(value);
});

console.log("Form submit listener set up. Commit when search works.");
