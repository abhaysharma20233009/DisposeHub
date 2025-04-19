const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        socket.emit("location", { lat, lng });
    },
    (error) => {
        console.error("Error getting location: ", error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}