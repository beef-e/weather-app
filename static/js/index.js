var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.on("click", function(e){
	console.log(e)

	var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
})

/*
	* Inserire chiamata API e relativi
*/



