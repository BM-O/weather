const weather = document.getElementById("weather_page");
const search = document.getElementById("get_location");
var addr = "Portland, OR"; //Default for animation
const conditions = ["Clear", "Clouds", "Drizzle", "Rain", "Thunderstorm"]
let debugging = true;


function loadDefault(){
  const getCoords = firebase.functions().httpsCallable("getCoords");
  getCoords({ address: addr }).then((result) => showWeather(result.data));
}

search.addEventListener("click", () => {
  addr = document.getElementById("address").value;
  const getCoords = firebase.functions().httpsCallable("getCoords");
  getCoords({ address: addr }).then((result) => showWeather(result.data));
});

function showWeather(data) {
  makeVisible(weather);
  console.log(data);
  
  //animation
  const curAddr = addr;
  var elem = document.getElementById("inner");
  //Reset previous conditions and display current condition
  for(condition of conditions){
    var reset = document.getElementsByClassName("condition");
    for (elements of reset){
      elements.style.display = "none";
    }
  }
  var status = document.getElementsByClassName(data["weather"][0]["condition"]);
  for (elements of status){
    elements.style.display = "initial";
  }
  
  var x = 0;
  var y = 0;
  var id = setInterval(frame => {
    if (addr !== curAddr){
      console.log("Address changed from ", curAddr, " to ", addr)
      clearInterval(id);
      return;
    }
    if (x >= window.screen.width){
      x = 0;
    }else{
      var windspeed = data["weather"][0]["wind"];
      x += windspeed * 0.756; //Meters per second to pixels per frame
      elem.style.left = x + "px";
    }
    if (y >= window.screen.height){
        y = 0;
    }else{
      if(data["weather"][0]["condition"].localeCompare("Snow") == 0){
        y += 0.378;
        elem.style.top = y + "px";
      }
    }
  },20);
}


function makeVisible(page) {
  page.classList.add("visible");
  page.classList.remove("invisible");
}
