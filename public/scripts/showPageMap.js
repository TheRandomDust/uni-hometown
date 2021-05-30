
mapboxgl.accessToken = mapToken;
const hometownObj = JSON.parse(hometown);
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: hometownObj.geometry.coordinates,
	zoom: 9
});
 
new mapboxgl.Marker()
	.setLngLat(hometownObj.geometry.coordinates)
	.setPopup(
		new mapboxgl.Popup({ offset: 25 })
		.setHTML(
			`<h3>${hometownObj.town}</h3><p>${hometownObj.description}</p>`
		)
	)
	.addTo(map);
