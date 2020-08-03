const weather = document.getElementById("weather_page");
const search = document.getElementById("get_location");
var addr = "Portland, OR"; //Default for animation


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
  if(data["weather"][0]["condition"] == "Clear"){
    var x = document.getElementById("sun");
    x.style.display = "initial";
  }
  var pos = 0;
  var id = setInterval(frame => {
    if (addr !== curAddr){
      console.log("Address changed from ", curAddr, " to ", addr)
      clearInterval(id);
      return;
    }
    if (pos >= window.screen.width){
      pos = 0;
    }else{
      pos += data["weather"][0]["wind"];
      elem.style.left = pos + "px";
      elem.style.top = pos + "px";
    }
  },20);
}


function makeVisible(page) {
  page.classList.add("visible");
  page.classList.remove("invisible");
}
