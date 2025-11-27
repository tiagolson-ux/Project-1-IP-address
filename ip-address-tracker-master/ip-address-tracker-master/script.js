// ===============================
// 1. OK PART 1 CONNECT TO THE HTML ELEMENTS
// ===============================
//
// NOTE TO SELF:
// These lines "wire up" my JavaScript to the HTML.
// They let me read user input and update text on the page.

const ipForm = document.getElementById('ip-form');
const ipInput = document.getElementById('ip-input');

const infoIp = document.getElementById('info-ip');
const infoLocation = document.getElementById('info-location');
const infoTimezone = document.getElementById('info-timezone');
const infoIsp = document.getElementById('info-isp');

console.log('DOM elements selected.'); // Good checkpoint for debugging and committing.

// ===============================
// 2. MAP VARIABLES
// ===============================
//
// NOTE TO SELF:
// I declare variables for the Leaflet map and marker.
// The map is the interactive map itself.
// The marker is the pin that moves when the IP changes.

let map;      // Will hold the Leaflet map instance
let marker;   // Will hold the marker (pin) on the map

console.log('Map variables declared.');

// -------------------------------------------------------------
// Helper function: buildApiUrl
// -------------------------------------------------------------
//
// NOTE TO SELF:
// This function builds the final API URL I will call with fetch().
// If the user typed an IP address, I use the ipAddress parameter.
// If they typed something that looks like a domain, I use domain.
// If they typed nothing (first load), I just send the key, and
// IPify uses the client's IP by default.
//
function buildApiUrl(ipOrDomain) {
  const url = new URL(IPIFY_BASE_URL);
  url.searchParams.set('apiKey', IPIFY_API_KEY);

  if (ipOrDomain) {
    // Simple check: does this look like IPv4? (numbers separated by dots)
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ipOrDomain)) {
      url.searchParams.set('ipAddress', ipOrDomain);
    } else {
      // Otherwise, treat it as a domain name
      url.searchParams.set('domain', ipOrDomain);
    }
  }

  return url.toString();
}

console.log('buildApiUrl function defined.');

// ===============================
// 4. INITIALIZE OR UPDATE THE MAP
// ===============================
//
// NOTE TO SELF:
// initMap takes latitude and longitude.
// If the map does not exist yet, it creates it and adds the tile layer.
// If the map already exists, it just recenters it.
// It also creates or moves the marker.
//
function initMap(lat, lng) {
  if (!map) {
    // First time: create the map on the div with id="map"
    map = L.map('map').setView([lat, lng], 13);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  } else {
    // Map exists: just move the view
    map.setView([lat, lng], 13);
  }

  // Handle the marker
  if (marker) {
    // Move existing marker
    marker.setLatLng([lat, lng]);
  } else {
    // Create a new marker the first time
    marker = L.marker([lat, lng]).addTo(map);
  }
}

console.log('initMap function defined.');

