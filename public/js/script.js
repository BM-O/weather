const weather = document.getElementById("weather_page");
const search = document.getElementById("get_location");

search.addEventListener("click", () => {
  const addr = document.getElementById("address").value;
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
