const url = 'https://api.open-meteo.com/v1/forecast'
let long = document.querySelector("#longitude")
let lat = document.querySelector("#latitude")
let form = document.querySelector("form")

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

map.on('click', function (e) {
	console.log(e);

	var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
});

/*
 * Chiamata API
 */

form.addEventListener("submit", function(e){
	e.preventDefault()

	const latitude = lat.value;
	const longitude = long.value;

	//TODO: Aggiorna Mappa
	
	
	fetch(url + `?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,windspeed_10m,winddirection_10m,apparent_temperature,relativehumidity_2m`)
		.then(function(response){	
			return response.json();
		})
		.then(function(data){
			const meteo = data.hourly
			console.log(meteo.temperature_2m)
		})

		.catch(function(e){
			console.log("An Error occurred: " + e)
		})
})



