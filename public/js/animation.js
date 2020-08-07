const conditions = [
  "Clear",
  "Clouds",
  "Drizzle",
  "Rain",
  "Thunderstorm",
  "Snow",
];
let debugging = true;

function animate(weather) {
  const curAddr = addr;
  var condition = weather["condition"];
  const windspeed = weather["wind"];
  var elem = document.getElementById("inner");

  if (debugging) {
    condition = "Rain";
  }

  //Reset previous conditions and display current condition
  for (each of conditions) {
    var reset = document.getElementsByClassName("condition");
    for (elements of reset) {
      elements.style.display = "none";
    }
  }
  var status = document.getElementsByClassName(condition);
  for (elements of status) {
    elements.style.display = "initial";
  }

  //TODO: set x to negative of image width, rather than const
  var x = -900;
  var y = 0;
  var d = 0;
  if (
    condition.localeCompare("Rain") == 0 ||
    condition.localeCompare("Drizzle") == 0
  ) {
    d = (Math.atan(windspeed / 10) * 180) / Math.PI;
  }

  var id = setInterval((frame) => {
    if (addr !== curAddr) {
      console.log("Address changed from ", curAddr, " to ", addr);
      clearInterval(id);
      return;
    }
    if (x >= window.screen.width) {
      x = -800;
      //Clouds and swirls wrap back to random height.
      if (
        condition.localeCompare("Clear") == 0 ||
        condition.localeCompare("Clouds") == 0
      ) {
        y = Math.floor(Math.random() * window.screen.height);
        elem.style.top = y + "px";
      }
    } else {
      x += windspeed * 0.756; //Meters per second to pixels per frame
      elem.style.left = x + "px";
    }
    //TODO: add rules for rain
    if (y >= window.screen.height) {
      y = 0;
    } else {
      if (
        condition.localeCompare("Rain") == 0 ||
        condition.localeCompare("Drizzle") == 0
      ) {
        y += 7.56;

        elem.style.top = y + "px";
        elem.style.transform = "rotateZ(-" + d + "deg)";
      }
      //Snow falls and rotates.
      if (condition.localeCompare("Snow") == 0) {
        y += 0.756;
        d += d < 360 ? 1 : -359;
        elem.style.top = y + "px";
        for (elements of status) {
          elements.style.transform = "rotateY(" + d + "deg)";
        }
      }
    }
  }, 20);
}

// export function animate() {
//   animate;
// }
