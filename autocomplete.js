//
const API_KEY = "618b6ae42ae5401ea10ede800e7b82c4";
//selectors

const input = document.getElementById("addressInput");
const sug = document.getElementById("suggestions");

// ----------------------------
// AUTOCOMPLETE FUNCTION
// ----------------------------
async function getSuggestions(query) {
  if (!query) {
    sug.hidden = true;
    return;
  }

  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:ca&limit=5&apiKey=${API_KEY}`;


  const res = await fetch(url);
  const data = await res.json();
  const countryLists = data?.features;

  sug.innerHTML = "";
  if (!countryLists.length) {
    sug.hidden = true;
    return;
  }

  countryLists.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.properties.formatted;
    li.onclick = () => {
      input.value = item.properties.formatted;
      sug.hidden = true;
    };
    sug.appendChild(li);
    sug.hidden = false;
  });
}

// ----------------------------
// INPUT LISTENER (DEBOUNCE)
// ----------------------------
let timer;

input.oninput = (e) => {
  clearTimeout(timer);
  timer = setTimeout(() => getSuggestions(e.target.value), 300);
};

//search input suggestions
input.addEventListener("focus", () => {
  if (input.value.trim().length > 0) {
    getSuggestions(input.value.trim());
  }
} , false);

// click outside hide suggestions
document.addEventListener("click", (e) => {
  if (!document.querySelector(".search-box").contains(e.target)) {
    sug.hidden = true;
  }
} , false);

// ----------------------------
// BUTTON → REDIRECT
// ----------------------------

function goToMap() {
  const address = input.value.trim();
  if (!address) return alert("Please enter an address");

  window.location.href = "map.html?address=" + encodeURIComponent(address);
}
