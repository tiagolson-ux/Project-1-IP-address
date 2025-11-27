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