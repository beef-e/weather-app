const url = 'https://api.open-meteo.com/v1/forecast';
let long = document.querySelector('#longitude');
let lat = document.querySelector('#latitude');
let form = document.querySelector('form');

var gmarker;
var map = L.map('map').setView([51.505, -0.09], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 13,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

map.on('click', function (e) {
	console.log(e);

	if (gmarker) {
		gmarker.remove();
	}

	var marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
	gmarker = marker;
	lat.value = e.latlng.lat;
	long.value = e.latlng.lng;
});

/*
 * Chiamata API
 */

form.addEventListener('submit', function (e) {
	e.preventDefault();

	const latitude = lat.value;
	const longitude = long.value;

	//TODO: Aggiorna Mappa
	map.setView([latitude, longitude], 10);

	fetch(
		url +
			`?latitude=${latitude}&longitude=${longitude}&forecast_days=2&hourly=temperature_2m,precipitation_probability,windspeed_10m,winddirection_10m,apparent_temperature,relativehumidity_2m`
	)
		.then(function (response) {
			return response.json();
		})
		/*.then(function (data) {
			const meteo = data.hourly;
			console.log(meteo.temperature_2m);
		})*/
		.then(function (data) {
			document.querySelector('#chartDiv').classList.remove('hidden');
			creaGrafico(data);
		})

		.catch(function (e) {
			console.log('An Error occurred: ' + e);
		});
});

function creaGrafico(data) {
	const ctx = document.getElementById('myChart');

	var dati = data.hourly.temperature_2m; //array di temperature
	var labels = data.hourly.time; //array di labels
	var apparent = data.hourly.apparent_temperature; // array di temperature percepite
	var humidity = data.hourly.relativehumidity_2m; // array di umidità

	const mappedData = dati.map(function (element, index) {
		return {
			time: labels[index],
			temp: element,
			apparent: apparent[index],
			hum: humidity[index],
		};
	});

	const filteredData = mappedData.filter(function (element, index) {
		return index % 2 === 0;
	});

	console.log(filteredData);

	let temperatures = [];
	let appTemp = [];
	let hum = [];
	let times = [];

	for (let i = 0; i < filteredData.length; i++) {
		temperatures.push(filteredData[i].temp);
		times.push(filteredData[i].time);
		appTemp.push(filteredData[i].apparent);
		hum.push(filteredData[i].hum);
	}

	for (let i = 0; i < times.length; i++) {
		times[i] = times[i].slice(11, 16);
	}

	console.log(temperatures);

	new Chart(ctx, {
		type: 'line',
		data: {
			labels: times,
			datasets: [
				{
					label: 'Temperature by hour',
					data: temperatures,
					fill: true,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.1,
				},
				{
					label: 'Apparent Temperature',
					data: appTemp,
					fill: true,
					borderColor: 'rgb(214, 140, 69)',
					tension: 0.1,
				},
				{
					label: 'Relative humidity',
					data: hum,
					fill: true,
					borderColor: 'rgb(124, 54, 38)',
					tension: 0.1,
					yAxisID: 'y1',
				},
			],
			options: {
				scales: {
					y: {
						type: 'linear',
						display: true,
						position: 'left',
					},

					y1: {
						type: 'linear',
						display: true,
						position: 'right',
					},

					y2: {
						type: 'linear',
						display: true,
						position: 'left',
					},
				},
			},
		},
	});
}
