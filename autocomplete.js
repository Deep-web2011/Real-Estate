// Replace with your active LocationIQ key
var locationiqKey = "pk.5e35cc8c57351374e6e45c78f90da3bf";

$("#search-box-input").autocomplete({
  minChars: 3,
  deferRequestBy: 250,
  serviceUrl: "https://api.locationiq.com/v1/autocomplete.php",
  paramName: "q",
  params: {
    key: locationiqKey,
    format: "json",
    limit: 10,
  },
  ajaxSettings: {
    dataType: "json",
  },
  transformResult: function (response) {
    // Map the API response to autocomplete format
    var suggestions = $.map(response, function (dataItem) {
      return {
        value: dataItem.display_name,
        data: dataItem,
      };
    });
    return { suggestions: suggestions };
  },
  onSelect: function (suggestion) {
    displayLatLon(
      suggestion.data.display_name,
      suggestion.data.lat,
      suggestion.data.lon
    );
  },
});

// Optional: Reset button
// $("#reset-autocomplete").click(function() {
//   $("#search-box-input").val("");
//   $("#result").html("");
// });

// Display coordinates
function displayLatLon(display_name, lat, lng) {
  $("#result").html(
    "<strong>Selected:</strong> " +
      display_name +
      "<br/><strong>Lat:</strong> " +
      lat +
      "<br/><strong>Lon:</strong> " +
      lng
  );
}


document.addEventListener("DOMContentLoaded", function() {
  const btn = document.getElementById("show-map-btn");

  btn.addEventListener("click", function(e) {
    e.preventDefault(); 
    const address = document.getElementById("search-box-input").value.trim();
    const unit = document.querySelector(".unit-input").value.trim();

    if (!address) {
      alert("Please enter an address");
      return;
    }

    // Redirect to sellmap.html with query parameters
    const url = `sellmap.html?address=${encodeURIComponent(address)}&unit=${encodeURIComponent(unit)}`;
    window.location.href = url;
  });
});
