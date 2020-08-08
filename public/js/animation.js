let update = document.getElementById("location_input");
var animationid;

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

//Miles per hour to meters per second.
const anti_imperial = 0.44704;

//Delta used for movement calculations.
//It may seem strange to do all this calculation just to throw an arbitrary factor on it,
//but everything using the same factor keeps relative differences comparable to real life.
const looks_good_factor = 1 / 100;
const delta = ppmpspf * looks_good_factor;

//Use to test specific conditions
let debugging = false;

//Listen for location update to end animation.
var over = false;
update.addEventListener("submit", (event) => {
  over = true;
});

//Function to animate the weather!
function animate(weather) {
  //Constants and variables used for all animations.
  const curAddr = addr;
  var condition = weather["condition"];
  const windspeed = weather["wind"];
  var elem = document.getElementById("inner");
  var containers = [elem];

  //Override condition for testing
  if (debugging) {
    condition = "Rain";
  }

  //Set item width and height based on image values for condition.
  var itemWidth = 0;
  var itemHeight = 0;
  if (
    condition.localeCompare("Clear") == 0 ||
    condition.localeCompare("Clouds") == 0
  ) {
    itemWidth = 800;
    itemHeight = 400;
  } else if (condition.localeCompare("Snow") == 0) {
    itemWidth = 200;
    itemHeight = 200;
  } else {
    itemHeight = 100;
    itemWidth = 100;
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

  //If weather condition should have multiple copies, generate clones.
  if (
    condition.localeCompare("Clouds") != 0 &&
    condition.localeCompare("Clear") != 0
  ) {
    var inner = document.querySelector("#inner");
    var clone1 = inner.cloneNode(true);
    clone1.id = "inner1";
    elem.after(clone1);
    containers.push(clone1);
  }

  //Initial positioning variable values. Initially moved offscreen to prevent pop-in
  //Randomly pick a unique offset to prevent overlap
  var y = 0;
  var d = 0;
  var pickX = [0, 1, 2, 3];
  var pickY = [0, 1, 2, 3];
  const choicesX = pickX.length;
  const choicesY = pickY.length;
  for (all of containers) {
    const choiceX = pickX.splice(Math.floor(Math.random() * pickX.length), 1);
    const choiceY = pickY.splice(Math.floor(Math.random() * pickY.length), 1);
    all.style.left = -(window.screen.width / choicesX) * choiceX + "px";
    all.style.top = (window.screen.height / choicesY) * choiceY + "px";
  }

  //Rain should appear slanted by wind, equal to direction of travel.
  if (
    condition.localeCompare("Rain") == 0 ||
    condition.localeCompare("Drizzle") == 0
  ) {
    //Set degree of slant by the arctangent of the windspeed over terminal velocity of rain (both in meters per second)
    //and convert from radians to degrees.
    d = (Math.atan((anti_imperial * windspeed) / rainTV) * 180) / Math.PI;
  }

  //Animate one frame, using set interval.
  animationid = setInterval((frame) => {
    //Each frame, check if time to terminate. If so, clear the interval and end this iteration of the function.
    if (over) {
      console.log("Address changed from ", curAddr, " to ", addr);
      var dead_clone1 = document.getElementById("inner1");
      if (dead_clone1) {
        dead_clone1.parentNode.removeChild(dead_clone1);
      }
      if (d !== 0) {
        for (all of containers) {
          all.style.transform = "none";
        }
        d = 0;
      }
      clearInterval(animationid);
      over = false;
      return;
    }

    //Calculate horizontal position.
    for (all of containers) {
      if (all.getBoundingClientRect().left >= window.screen.width) {
        all.style.left =
          all.getBoundingClientRect().left -
          (window.screen.width + itemWidth + 50) +
          "px";
        //Clouds and swirls wrap back to random height.
        if (
          condition.localeCompare("Clear") == 0 ||
          condition.localeCompare("Clouds") == 0
        ) {
          y = Math.floor(Math.random() * window.screen.height);
          all.style.top = y + "px";
        }
        //All weather elements move horizontally based on windspeed.
      } else {
        // console.log(all.style.left);
        all.style.left =
          parseInt(all.style.left.slice(0, -2)) + windspeed * delta + "px";
      }

      //TODO: add rules for rain
      //Calculate vertical position.
      if (y >= window.screen.height) {
        //Reset height to just above screen when item falls below screen height.
        y -= window.screen.height + itemHeight + 50;
        //Place the item randomly along the top of the screen.
        all.style.left =
          Math.floor(Math.random() * window.screen.width) + "px;";
      } else {
        //All types of rain should fall at terminal velocity and appear rotated in the direction of movement.
        if (
          condition.localeCompare("Rain") == 0 ||
          condition.localeCompare("Drizzle") == 0
        ) {
          y += rainTV * delta;
          all.style.top = y + "px";
          all.style.transform = "rotateZ(-" + d + "deg)";
        }

        //Snow falls at terminal velocity and rotates about y axis.
        if (condition.localeCompare("Snow") == 0) {
          y += snowTV * delta;
          d += d < 360 ? 1 : -360;
          all.style.top = y + "px";
          for (elements of status) {
            elements.style.transform = "rotateY(" + d + "deg)";
          }
        }
      }
    }
  }, interval);
}
