const API_KEY = "618b6ae42ae5401ea10ede800e7b82c4";

///////////////Maps start ////////////////////

// 1. Get address from URL
const urlParams = new URLSearchParams(window.location.search);
//   console.log(window.location.search)
const address = urlParams.get("address");

if (!address) {
  alert("No address provided!");
}

// 2. Fetch coordinates
async function loadMap() {
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&apiKey=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.features.length) {
    alert("Address not found");
    return;
  }

  const lat = data.features[0].geometry.coordinates[1];
  const lon = data.features[0].geometry.coordinates[0];

  // 3. Show map
  const map = L.map("map").setView([lat, lon], 15);

  L.tileLayer(
    `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${API_KEY}`,
    { maxZoom: 20 }
  ).addTo(map);

  // 4. Marker
  L.marker([lat, lon]).addTo(map).bindPopup(address).openPopup();
}

loadMap();

//forms
const steps = document.querySelectorAll("[data-step]");
const stepIndicators = document.querySelectorAll(".step-item");
let current = 0;

// Show first step
steps[current]?.classList.add("active");

// NEXT buttons
document.addEventListener("click", function (e) {
  if (e.target.hasAttribute("data-next")) {
    e.preventDefault();

    const valid = markStepComplete(current);
    if (!valid) return;

    steps[current].classList.remove("active");
    current++;
    steps[current]?.classList.add("active");

    // update progress line
    if (current === 2) {
      document.querySelector(".center-div").classList.add("active");
      document.querySelector(".main-container").classList.add("blur-bg");
    }
  }
});

// VALIDATION

function validation(e) {
  if (!e.target.matches("input[required], select[required]")) return;

  const span = e.target.parentElement.querySelector(".error-msg");

  if (!e.target.checkValidity()) {
    e.target.style.border = "2px solid red";
    if (span) span.style.display = "block";
  } else {
    e.target.style.border = "2px solid green";
    if (span) span.style.display = "none";
  }
}

document.addEventListener("input", validation);

// MARK STEP COMPLETE
function markStepComplete(index) {
  const fields = steps[index].querySelectorAll(
    "input[required], select[required]"
  );
  let valid = true;

  fields.forEach((field) => {
    const span = field.parentElement.querySelector(".error-msg"); // span must be right after input

    if (!field.checkValidity()) {
      // <-- Browser built-in validation
      field.style.border = "2px solid red";
      valid = false;

      // show error message
      if (span) span.style.display = "block";
    } else {
      field.style.border = "2px solid green";

      // hide error message
      if (span) span.style.display = "none";
    }
  });

  if (valid && stepIndicators[index]) {
    const circle = stepIndicators[index].querySelector(".circle");
    if (circle) {
      circle.innerHTML = '<i class="fas fa-check"></i>';
      circle.classList.add("completed");
    }
  } else if (stepIndicators[index]) {
    // optional: remove check if step is invalid
    const circle = stepIndicators[index].querySelector(".circle");
    if (circle) {
      circle.innerHTML = index + 1; // restore step number
      circle.classList.remove("completed");
    }
  }

  return valid;
}

//Modal
const centerDiv = document.querySelector(".center-div");
const mainContainer = document.querySelector(".main-container");
const contentSection = document.querySelector(".content-section");
const closeIcon = document.querySelector(".fa-xmark");
const stepsValid = document.querySelectorAll("[data-step]");

function closePopup() {
  centerDiv.classList.remove("active");
  mainContainer.classList.remove("blur-bg");
  contentSection.classList.remove("hidden");

  // Restore first step (
  stepsValid.forEach((step) => step.classList.remove("active"));
  steps[0]?.classList.add("active");
  current = 0;
  markStepComplete(current);
}

/* Click outside popup */
centerDiv.addEventListener("click", (e) => {
  if (e.target === centerDiv) {
    closePopup();
  }
});

/* Click X icon */
closeIcon.addEventListener("click", closePopup);



