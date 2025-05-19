 const apiKey="5b3ce3597851110001cf6248cb8e239fcc82479ba557f3c83e2e01d7"
   const parcelLocation = [40.730610, -73.935242]; // e.g., NYC
    const destination = [40.712776, -74.005974]; // e.g., Lower Manhattan

    // Initialize the map
    const map = L.map('map').setView(parcelLocation, 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add markers
    const parcelMarker = L.marker(parcelLocation).addTo(map).bindPopup("Parcel Location").openPopup();
    const destinationMarker = L.marker(destination).addTo(map).bindPopup("Destination");

    // Draw route using OpenRouteService API

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${parcelLocation[1]},${parcelLocation[0]}&end=${destination[1]},${destination[0]}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        const coords = data.features[0].geometry.coordinates;
        const latlngs = coords.map(coord => [coord[1], coord[0]]); // Flip [lon, lat] to [lat, lon]

        // Draw polyline for route
        L.polyline(latlngs, { color: 'blue' }).addTo(map);


        const coordDiv = document.createElement("div");
coordDiv.id = "hoverCoords";
coordDiv.style = "position:absolute; bottom:10px; left:10px; background:#fff; padding:6px 10px; font-family:sans-serif; font-size:14px; border:1px solid #ccc;";
coordDiv.innerText = "Hover over the map";
document.body.appendChild(coordDiv);

// Listen for mouse movement over the map
map.on('mousemove', function (e) {
  const lat = e.latlng.lat.toFixed(6);
  const lng = e.latlng.lng.toFixed(6);
  coordDiv.innerText = `Mouse at: ${lat}, ${lng}`;
});
        
      })
      .catch(error => {
        console.error('Error fetching route:', error);
      });