//Possible values of weather["condition"] returned by API
const conditions = [
  "Clear",
  "Clouds",
  "Drizzle",
  "Rain",
  "Thunderstorm",
  "Snow",
];

//Terminal velocities in meters per second. Source: Google.
const rainTV = 10;
const snowTV = 1;
//Delay used for setInterval, expressed in milliseconds.
//Frames per second used in speed calculation.
const interval = 20;
const fps = 1 / (interval * 0.001);

//Pixels per inch and inches per meter used to calculate pixels per meter.
const ppi = 96;
const ipm = 39.37;
const ppm = ppi * ipm;

//Pixels per meter per second per frame.
const ppmpspf = ppm / fps;

//Delta used for movement calculations.
//It may seem strange to do all this calculation just to throw an arbitrary factor on it,
//but everything using the same factor keeps relative differences comparable to real life.
const looks_good_factor = 1 / 100;
const delta = ppmpspf * looks_good_factor;

//Use to test specific conditions
let debugging = false;

//Function to animate the weather!
function animate(weather) {
  //Constants and variables used for all animations.
  const curAddr = addr;
  var condition = weather["condition"];
  const windspeed = weather["wind"];
  var elem = document.getElementById("inner");

  //Override condition for testing
  if (debugging) {
    condition = "Rain";
  }

  //Reset and hide all conditions
  for (each of conditions) {
    var reset = document.getElementsByClassName("condition");
    for (elements of reset) {
      elements.style.display = "none";
    }
  }
  //Find the current condition and display it
  var status = document.getElementsByClassName(condition);
  for (elements of status) {
    elements.style.display = "initial";
  }

  //TODO: set x to negative of image width, currently set to large negative value to prevent pop-in
  //Initial positioning variable values
  var x = -900;
  var y = 0;
  var d = 0;

  //Rain should appear slanted by wind, equal to direction of travel.
  if (
    condition.localeCompare("Rain") == 0 ||
    condition.localeCompare("Drizzle") == 0
  ) {
    //Set degree of slant by the arctangent of the windspeed over terminal velocity of rain (both in meters per second)
    //and convert from radians to degrees.
    d = (Math.atan(windspeed / rainTV) * 180) / Math.PI;
  }

  //Animate one frame, using set interval.
  var id = setInterval((frame) => {
    //Each frame, check if address has changed. If so, clear the interval and end this iteration of the function.
    if (addr !== curAddr) {
      console.log("Address changed from ", curAddr, " to ", addr);
      clearInterval(id);
      return;
    }

    //Calculate horizontal position.
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
      //All weather elements move horizontally based on windspeed.
    } else {
      x += windspeed * delta; //Meters per second to pixels per frame
      elem.style.left = x + "px";
    }

    //TODO: add rules for rain
    //Calculate vertical position.
    if (y >= window.screen.height) {
      y = 0;
    } else {
      //All types of rain should fall at terminal velocity and appear rotated in the direction of movement.
      if (
        condition.localeCompare("Rain") == 0 ||
        condition.localeCompare("Drizzle") == 0
      ) {
        y += rainTV * delta;
        elem.style.top = y + "px";
        elem.style.transform = "rotateZ(-" + d + "deg)";
      }

      //Snow falls at terminal velocity and rotates about y axis.
      if (condition.localeCompare("Snow") == 0) {
        y += snowTV * delta;
        d += d < 360 ? 1 : -360;
        elem.style.top = y + "px";
        for (elements of status) {
          elements.style.transform = "rotateY(" + d + "deg)";
        }
      }
    }
  }, interval);
}
