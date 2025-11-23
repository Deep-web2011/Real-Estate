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
document.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-next")) {
    e.preventDefault()
    if (!validateStep(current)) return;
    markStepComplete(current);
    
    // Move to next form step
    steps[current]?.classList.remove("active");
    current++;
    steps[current]?.classList.add("active");

    // Show popup on step 3
    if (current === 2) {
      document.querySelector(".center-div").classList.add("active");
      document.querySelector(".main-container").classList.add("blur-bg");
    }
  }
});


// VALIDATION
function validateStep(stepIndex) {
  const inputs =
    steps[stepIndex]?.querySelectorAll("input[required], select") || [];
  let valid = true;

  inputs.forEach((input) => {
    const value = input.value.trim();

    if (input.id === "phone") {
      const phoneError = document.getElementById("phone-error");

      if (!/^\d{10}$/.test(value)) {
        input.style.border = "2px solid red";
        phoneError.style.display = "inline";
        valid = false;
      } else {
        input.style.border = "2px solid green";
        phoneError.style.display = "none";
      }
    }

    else if (input.id === "email") {
      const emailError = document.getElementById("email-error");

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        input.style.border = "2px solid red";
        emailError.style.display = "inline";
        valid = false;
      } else {
        input.style.border = "2px solid green";
        emailError.style.display = "none";
      }
    }

    else if (input.type === "checkbox") {
      if (!input.checked) {
        input.style.outline = "2px solid red";
        valid = false;
      } else {
        input.style.outline = "2px solid green";
      }
    }

    else {
      if (!value) {
        input.style.border = "2px solid red";
        valid = false;
      } else {
        input.style.border = "2px solid green";
      }
    }
  });

  return valid;
}


// MARK STEP COMPLETE
function markStepComplete(stepIndex) {
  const inputs =
    steps[stepIndex]?.querySelectorAll("input[required], select") || [];

  const allFilled = Array.from(inputs).every((input) => {
    if (input.id === "email")
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());

    if (input.id === "phone")
      return /^\d{10}$/.test(input.value.trim());

    if (input.type === "checkbox")
      return input.checked;

    return input.value.trim() !== "";
  });

  if (allFilled && stepIndicators[stepIndex]) {
    const circle = stepIndicators[stepIndex].querySelector(".circle");
    if (circle) {
      circle.innerHTML = '<i class="fas fa-check"></i>';
      circle.classList.add("completed");
    }
  }
}


// REAL-TIME VALIDATION
document.querySelectorAll("input[required], select").forEach((field) => {
  field.addEventListener("input", () => {
    validateStep(current);
    markStepComplete(current);
  });

  if (field.type === "checkbox") {
    field.addEventListener("change", () => {
      validateStep(current);
      markStepComplete(current);
    });
  }
});


// CLOSE POPUP WHEN CLICKING X
// document.addEventListener("click", (e) => {
//   if (e.target.classList.contains("fa-xmark")) {
//     document.querySelector(".center-div").classList.remove("active");
//     document.querySelector(".main-container").classList.remove("blur-bg");
//   }
// });

// CLOSE POPUP WHEN CLICKING OUTSIDE
// document.querySelector(".center-div").addEventListener("click", (e) => {
//   if (e.target.classList.contains("center-div")) {
//     document.querySelector(".center-div").classList.remove("active");
//     document.querySelector(".main-container").classList.remove("blur-bg");
//   }
// });
