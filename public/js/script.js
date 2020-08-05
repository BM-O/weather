const weather = document.getElementById("weather_page");
const search = document.getElementById("get_location");

window.onload = function() {
  showPosition()
};

function showPosition() {  
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let obj = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        const crd = "Test";
        const getCurrent = firebase.functions().httpsCallable("getCurrent");
        getCurrent({ position: obj }).then((result) =>
          showWeather(result.data));
      });
  } else {
      alert("Sorry, your browser does not support HTML5 geolocation.");
  }
};


search.addEventListener("click", () => {
  const addr = document.getElementById("address").value
    ? document.getElementById("address").value
    : "Portland, OR";
  const getCoords = firebase.functions().httpsCallable("getCoords");
  getCoords({ address: addr }).then((result) => showWeather(result.data));
});

function showWeather(data) {
  makeVisible(weather);
  console.log(data);
}

function makeVisible(page) {
  page.classList.add("visible");
  page.classList.remove("invisible");
}
