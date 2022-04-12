mapboxgl.accessToken = TOKEN;

const coordinateArray = coordinates.split(',').map(item => Number(item));

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: coordinateArray, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(coordinateArray)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h5>${ title }</h5>`
            )
    )
    .addTo(map)