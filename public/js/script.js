const weather = document.getElementById("weather_page");
const search = document.getElementById("get_location");
var addr = "Portland, OR"; //Default for animation

// On load, it will ask for permission to access current location
function loadDefault() {
  // It using HTML5 function to get current location LatLong with persmission
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      // Get LatLong from position object
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      /* Below code will pass LatLong to getCurrent firebase callable function,
      getCurrent callbale function get weather data from external API,
      Pass this fetched data to showWeather to render html page
      */
      const getCurrent = firebase.functions().httpsCallable("getCurrent");
      getCurrent({ latitude: latitude, longitude: longitude }).then((result) =>
        showWeather(result.data)
      );
    });
  } else {
    // This code will execute if User doesnt allow permission to access current location or HTML5 not supported.
    alert(
      "Sorry, your browser does not support HTML5 geolocation. Enter city and search"
    );
  }
}

//On key press in search bar, check if 'Enter' pressed, to search instead of reloading.
function enter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addr = document.getElementById("address").value;
    const getCoords = firebase.functions().httpsCallable("getCoords");
    getCoords({ address: addr }).then((result) => {
      showWeather(result.data);
    });
    return false;
  }
  return true;
}

search.addEventListener("click", () => {
  addr = document.getElementById("address").value
    ? document.getElementById("address").value
    : "Portland, OR";
  const getCoords = firebase.functions().httpsCallable("getCoords");
  getCoords({ address: addr }).then((result) => {
    showWeather(result.data);
  });
});

function showWeather(data) {
  var bg = document.getElementById("page");
  bg.style.height = "1850px";
  makeVisible(weather);
  console.log(data);

  //Data shortcuts
  const aq = data.aq;
  const forecast = data.weather;
  const condition = forecast[0];

  currentWeather(condition);
  currentAirQuality(aq);
  getForecast(forecast);

  //Animate the current weather condition.
  //Wait a second to terminate previous animation first.
  over = true;
  setTimeout(function () {
    over = false;
    animate(condition);
  }, 1000);
}

function makeVisible(page) {
  page.classList.add("visible");
  page.classList.remove("invisible");
}

function currentWeather(current) {
  //DOM listeners
  const cur_card = document.getElementById("weather_card");
  const cur_body = document.getElementById("weather_data");

  //clear child elements if there is any
  while (cur_body.firstChild) cur_body.firstChild.remove();

  if (document.contains(document.getElementById("weather_title"))) {
    document.getElementById("weather_title").remove();
  }

  let title = document.createElement("div");
  title.classList.add("font-weight-bold");
  title.id = "weather_title";
  title.classList.add("card-header");
  title.textContent = `Weather at ${addr}`;
  cur_card.prepend(title);

  //Create the Current weather card
  //Weather icon
  let img = document.createElement("img");
  img.classList.add("img-fluid");
  img.classList.add("float-right");
  img.src = `${current.icon}`;
  img.alt = `${current.description} icon`;
  cur_body.appendChild(img);
  //Temperature and description
  let temp = document.createElement("h2");
  temp.textContent = `${current.tempFar}°`;
  let des = document.createElement("h3");
  des.textContent = `${current.description}`;
  let br = document.createElement("br");
  let feel = document.createElement("h4");
  feel.textContent = `Feels Like ${current.tempfeelF} °`;
  cur_body.appendChild(temp);
  cur_body.appendChild(des);
  cur_body.appendChild(br);
  cur_body.appendChild(feel);
  //Create a table to store the rest of the data
  let cur_table = document.createElement("table");
  cur_table.classList.add("w-100");
  cur_table.classList.add("table");
  cur_table.classList.add("table-bordered");
  cur_table.classList.add("text-center");

  //Create row 1
  let row1_head = document.createElement("thead");
  row1_head.classList.add("thead-dark");
  let row1_header = document.createElement("tr");
  let row1 = document.createElement("tr");
  //Row 1 - High/Low
  let HiLo_label = document.createElement("th");
  //HiLo_label.classList.add("font-weight-bold");
  HiLo_label.textContent = "High/Low";
  row1_header.appendChild(HiLo_label);
  let HiLo = document.createElement("td");
  HiLo.textContent = `${current.tempHi}° | ${current.tempLo}°`;
  row1.appendChild(HiLo);
  //Row 1 - Wind
  let wind_label = document.createElement("th");
  //wind_label.classList.add("font-weight-bold");
  wind_label.textContent = "Wind";
  row1_header.appendChild(wind_label);
  let wind = document.createElement("td");
  wind.textContent = `${current.wind} mph`;
  row1.appendChild(wind);

  //Create row 2
  let row2_head = document.createElement("thead");
  row2_head.classList.add("thead-dark");
  let row2_header = document.createElement("tr");
  let row2 = document.createElement("tr");
  //Row 2 - Humidity
  let hum_label = document.createElement("th");
  hum_label.classList.add("font-weight-bold");
  hum_label.textContent = "Humidity";
  row2_header.appendChild(hum_label);
  let hum = document.createElement("td");
  hum.textContent = `${current.humidity}%`;
  row2.appendChild(hum);
  //Row 2 - Dew Point
  let dew_label = document.createElement("th");
  dew_label.classList.add("font-weight-bold");
  dew_label.textContent = "Dew Point";
  row2_header.appendChild(dew_label);
  let dew = document.createElement("td");
  dew.textContent = `${current.dew_point}°`;
  row2.appendChild(dew);

  //Create row 3
  let row3_head = document.createElement("thead");
  row3_head.classList.add("thead-dark");
  let row3_header = document.createElement("tr");
  let row3 = document.createElement("tr");
  //Row 3 - Pressure
  let press_label = document.createElement("th");
  press_label.classList.add("font-weight-bold");
  press_label.textContent = "Pressure";
  row3_header.appendChild(press_label);
  let press = document.createElement("td");
  press.textContent = `${current.pressure} in`;
  row3.appendChild(press);
  //Row 3 - UV Index
  let uv_label = document.createElement("th");
  uv_label.classList.add("font-weight-bold");
  uv_label.textContent = "UV Index";
  row3_header.appendChild(uv_label);
  let uv = document.createElement("td");
  uv.textContent = `${current.uvi} of 10`;
  row3.appendChild(uv);

  //Create row 4
  let row4_head = document.createElement("thead");
  row4_head.classList.add("thead-dark");
  let row4_header = document.createElement("tr");
  let row4 = document.createElement("tr");
  //Row 4 - Sunrise/sunset
  let sun_label = document.createElement("th");
  sun_label.classList.add("font-weight-bold");
  sun_label.textContent = "Sunrise | Sunset";
  row4_header.appendChild(sun_label);
  let sun = document.createElement("td");
  sun.textContent = `${current.sunrisetime} | ${current.sunsettime}`;
  row4.appendChild(sun);
  //Row 4 - Rain
  let rain_label = document.createElement("th");
  rain_label.classList.add("font-weight-bold");
  rain_label.textContent = "Rain | Chance of Rain";
  row4_header.appendChild(rain_label);
  let rain = document.createElement("td");
  rain.textContent = `${current.rain} | ${current.pop}%`;
  console.log(current.pop);
  row4.appendChild(rain);

  //Append rows to table
  row1_head.appendChild(row1_header);
  row2_head.appendChild(row2_header);
  row3_head.appendChild(row3_header);
  row4_head.appendChild(row4_header);
  row1_head.appendChild(row1);
  row2_head.appendChild(row2);
  row3_head.appendChild(row3);
  row4_head.appendChild(row4);
  cur_table.appendChild(row1_head);
  cur_table.appendChild(row2_head);
  cur_table.appendChild(row3_head);
  cur_table.appendChild(row4_head);

  //Append the table to the bottom of the card
  cur_body.append(cur_table);
}

function currentAirQuality(data) {
  const card = document.getElementById("advisory_card");
  const body = document.getElementById("advisory_text");
  const aqcard = document.getElementById("aq_card");
  const aqbody = document.getElementById("aq_text");
  console.log(data.level);
  console.log(data);

  //Air Quality card title
  if (document.contains(document.getElementById("aq_title"))) {
    document.getElementById("aq_title").remove();
  }
  //Create new air quality title
  let aq_title = document.createElement("div");
  aq_title.classList.add("font-weight-bold");
  aq_title.id = "aq_title";
  aq_title.classList.add("card-header");
  aq_title.textContent = `EPA Standard AQI in ${addr}`;
  aqcard.prepend(aq_title);

  //Advisory Text card Title
  if (document.contains(document.getElementById("adv_title"))) {
    document.getElementById("adv_title").remove();
  }
  //Create new advisory text title
  let adv_title = document.createElement("div");
  adv_title.classList.add("font-weight-bold");
  adv_title.id = "adv_title";
  adv_title.classList.add("card-header");
  adv_title.textContent = `EPA Health Statement for ${addr}`;
  card.prepend(adv_title);

  //Change background color and text color of card
  if (data.level === "Good") {
    card.style.backgroundColor = "#28E439";
    card.style.color = "black";
    aqcard.style.backgroundColor = "#28E439";
    aqcard.style.color = "black";
  } else if (data.level === "Moderate") {
    card.style.backgroundColor = "#FEFF48";
    card.style.color = "black";
    aqcard.style.backgroundColor = "#FEFF48";
    aqcard.style.color = "black";
  } else if (data.level === "Unhealthy for Sensitive Groups") {
    card.style.backgroundColor = "#FC7F29";
    card.style.color = "white";
    aqcard.style.backgroundColor = "#FC7F29";
    aqcard.style.color = "white";
  } else if (data.level === "Unhealthy") {
    card.style.backgroundColor = "#FB061B";
    card.style.color = "white";
    aqcard.style.backgroundColor = "#FB061B";
    aqcard.style.color = "white";
  } else if (data.level === "Very Unhealthy") {
    card.style.backgroundColor = "#8E3E94";
    card.style.color = "white";
    aqcard.style.backgroundColor = "#8E3E94";
    aqcard.style.color = "white";
  } else {
    card.style.backgroundColor = "#7C0124";
    card.style.color = "white";
    aqcard.style.backgroundColor = "#7C0124";
    aqcard.style.color = "white";
  }

  //Add BS4 class to the card body to center text
  body.classList.add("text-center");
  aqbody.classList.add("text-center");
  //Create new element to store caution statement
  let text = document.createElement("div");
  text.classList.add("font-weight-bold");
  text.textContent = `${data.caution}`;

  let aqtext = document.createElement("div");
  aqtext.classList.add("font-weight-bold");
  aqtext.textContent = `Air Index level ${data.aqi}`;

  //Clear body's children
  while (body.firstChild) body.firstChild.remove();
  //Append caution statement to the card body
  body.appendChild(text);

  while (aqbody.firstChild) aqbody.firstChild.remove();
  //Append caution statement to the card body
  aqbody.appendChild(aqtext);
}

function getForecast(Data) {
  //Create Forecast
  const card = document.getElementById("forecast_card");
  const forecast_card = document.getElementById("forecast_table");
  const forecast_body = document.getElementById("forecast_body");

  //Forecast title
  if (document.contains(document.getElementById("forecast_title"))) {
    document.getElementById("forecast_title").remove();
  }

  let title = document.createElement("div");
  title.classList.add("card-header");
  title.classList.add("font-weight-bold");
  title.id = "forecast_title";
  title.textContent = `7 Days forecast for ${addr}`;
  card.prepend(title);

  //clear current elements to populate new data
  while (forecast_body.firstChild) forecast_body.firstChild.remove();

  //Add forecast data
  forecast_card.classList.add("w-100");
  forecast_card.classList.add("table-bordered");
  forecast_card.classList.add("text-center");

  //let forrow1 = forecast_table.insertRow();

  //let forcell1 = forrow1.insertCell();
  //let date = document.createElement("div");

  var forecatData = new Array();
  forecatData.push(["Date", "Weather", "Temperature", "More Data"]);

  for (forecast of Data) {
    let forimage = `<figure><img class='img-fluid img-responsive'\
     src=${forecast.icon} alt="${forecast.description} icon"></img><figcaption>${forecast.description}\
     </figcaption></figure>`;

    forecatData.push([
      forecast.date,
      forimage,
      `${forecast.tempFar}°`,
      "More Data",
    ]);
  }

  //Get the count of columns.
  var columnCount = forecatData[0].length;

  //Add the header row.
  var row = forecast_card.insertRow(-1);
  for (var i = 0; i < columnCount; i++) {
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = forecatData[0][i];
    row.appendChild(headerCell);
  }

  //Add the data rows.
  for (var i = 2; i < forecatData.length; i++) {
    row = forecast_card.insertRow(-1);

    for (var j = 0; j < columnCount; j++) {
      if (j === 3) {
        var cell = row.insertCell(-1);
        if (i === 2) {
          cell.appendChild(createmodal1(Data, i));
        }
        if (i === 3) {
          cell.appendChild(createmodal2(Data, i));
        }
        if (i === 4) {
          cell.appendChild(createmodal3(Data, i));
        }
        if (i === 5) {
          cell.appendChild(createmodal4(Data, i));
        }
        if (i === 6) {
          cell.appendChild(createmodal5(Data, i));
        }
        if (i === 7) {
          cell.appendChild(createmodal6(Data, i));
        }
        if (i === 8) {
          cell.appendChild(createmodal7(Data, i));
        }
      } else {
        var cell = row.insertCell(-1);
        cell.innerHTML = forecatData[i][j];
      }
    }
  }
}

function createmodal1(foredata, num) {
  let maindiv = document.createElement("div");

  let modal = document.createElement("button");
  modal.classList.add("btn", "btn-dark");
  modal.setAttribute("data-toggle", "modal");
  modal.setAttribute("data-target", "#sampleModal1");
  modal.innerHTML = "More Data";

  var div1 = document.createElement("div");
  div1.id = "sampleModal1";
  div1.className = "fade modal";
  div1.tabIndex = -1;
  div1.setAttribute("role", "dialog");

  var innerDiv1m = document.createElement("div");
  innerDiv1m.className = "modal-dialog";
  innerDiv1m.setAttribute("role", "document");
  div1.appendChild(innerDiv1m);

  var innerDiv2m = document.createElement("div");
  innerDiv2m.className = "modal-content";
  innerDiv1m.appendChild(innerDiv2m);

  var innerDiv3 = document.createElement("div");
  innerDiv3.className = "modal-header";
  innerDiv2m.appendChild(innerDiv3);

  var headerM = document.createElement("H4");
  headerM.className = "modal-title";
  headerM.textContent = `Weather on ${foredata[num - 1].date}`;
  innerDiv3.appendChild(headerM);

  var buttonM = document.createElement("button");
  buttonM.className = "close btn";
  buttonM.setAttribute("data-dismiss", "modal");
  buttonM.textContent = "X";
  innerDiv3.appendChild(buttonM);

  var innerDiv31 = document.createElement("div");
  innerDiv31.className = "modal-body";
  innerDiv2m.appendChild(innerDiv31);

  let modalh2 = document.createElement("H2");
  modalh2.textContent = `${foredata[num - 1].tempFar}°`;
  innerDiv31.appendChild(modalh2);

  let modalh3 = document.createElement("H3");
  modalh3.textContent = `${foredata[num - 1].description}`;
  innerDiv31.appendChild(modalh3);

  let forimg = document.createElement("img");
  forimg.classList.add("img-fluid");
  forimg.src = `${foredata[num - 1].icon}`;
  forimg.alt = `${foredata[num - 1].description} icon`;
  innerDiv31.appendChild(forimg);

  let innerTab41 = document.createElement("table");
  innerTab41.className = "table";
  let tab41Thead = document.createElement("THead");
  tab41Thead.className = "thead-dark";
  innerTab41.appendChild(tab41Thead);

  let tab51row = document.createElement("tr");

  let tab51th = document.createElement("th");
  tab51th.textContent = "Hi | Lo";
  let tab52th = document.createElement("th");
  tab52th.textContent = "Wind";
  tab51row.appendChild(tab51th);
  tab51row.appendChild(tab52th);
  tab41Thead.append(tab51row);

  let tab52row = document.createElement("tr");

  let tab51d = document.createElement("td");
  tab51d.textContent = `${foredata[num - 1].tempHi}° | ${
    foredata[num - 1].tempLo
  }°`;
  let tab52d = document.createElement("td");
  tab52d.textContent = `${foredata[num - 1].wind} mph`;
  tab52row.appendChild(tab51d);
  tab52row.appendChild(tab52d);
  tab41Thead.appendChild(tab52row);

  let tab51Thead = document.createElement("THead");
  tab51Thead.className = "thead-dark";
  innerTab41.appendChild(tab51Thead);

  let tab61row = document.createElement("tr");

  let tab61th = document.createElement("th");
  tab61th.textContent = "Humidity";
  let tab62th = document.createElement("th");
  tab62th.textContent = "Dew Point";
  tab61row.appendChild(tab61th);
  tab61row.appendChild(tab62th);
  tab51Thead.append(tab61row);

  let tab62row = document.createElement("tr");

  let tab61d = document.createElement("td");
  tab61d.textContent = `${foredata[num - 1].humidity}%`;
  let tab62d = document.createElement("td");
  tab62d.textContent = `${foredata[num - 1].dew_point} °`;
  tab62row.appendChild(tab61d);
  tab62row.appendChild(tab62d);
  tab51Thead.appendChild(tab62row);

  let tab61Thead = document.createElement("THead");
  tab61Thead.className = "thead-dark";
  innerTab41.appendChild(tab61Thead);

  let tab71row = document.createElement("tr");

  let tab71th = document.createElement("th");
  tab71th.textContent = "Pressure";
  let tab72th = document.createElement("th");
  tab72th.textContent = "UV Index";
  tab71row.appendChild(tab71th);
  tab71row.appendChild(tab72th);
  tab61Thead.append(tab71row);

  let tab72row = document.createElement("tr");

  let tab71d = document.createElement("td");
  tab71d.textContent = `${foredata[num - 1].pressure} in`;
  let tab72d = document.createElement("td");
  tab72d.textContent = `${foredata[num - 1].uvi} of 10`;
  tab72row.appendChild(tab71d);
  tab72row.appendChild(tab72d);
  tab61Thead.appendChild(tab72row);

  //
  let tab71Thead = document.createElement("THead");
  tab71Thead.className = "thead-dark";
  innerTab41.appendChild(tab71Thead);
  innerDiv31.appendChild(innerTab41);

  let tab81row = document.createElement("tr");

  let tab81th = document.createElement("th");
  tab81th.textContent = "Sunrise | Sunrise";
  let tab82th = document.createElement("th");
  tab82th.textContent = "Chance of Rain";
  tab81row.appendChild(tab81th);
  tab81row.appendChild(tab82th);
  tab71Thead.append(tab81row);

  let tab82row = document.createElement("tr");

  let tab81d = document.createElement("td");
  tab81d.textContent = `${foredata[num - 1].sunrisetime} | ${
    foredata[num - 1].sunsettime
  }`;
  let tab82d = document.createElement("td");
  tab82d.textContent = `${foredata[num - 1].pop}%`;
  tab82row.appendChild(tab81d);
  tab82row.appendChild(tab82d);
  tab71Thead.appendChild(tab82row);

  //

  let innerDiv32 = document.createElement("div");
  innerDiv32.className = "modal-footer";
  innerDiv2m.appendChild(innerDiv32);

  var closeButton = document.createElement("button");
  closeButton.className = "btn btn-dark";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.innerHTML = "Exit";
  innerDiv32.appendChild(closeButton);

  modal.appendChild(div1);

  maindiv.appendChild(modal);

  return maindiv;
}

function createmodal2(foredata, num) {
  let maindiv = document.createElement("div");

  let modal = document.createElement("button");
  modal.classList.add("btn", "btn-dark");
  modal.setAttribute("data-toggle", "modal");
  modal.setAttribute("data-target", "#sampleModal2");
  modal.innerHTML = "More Data";

  var div1 = document.createElement("div");
  div1.id = "sampleModal2";
  div1.className = "fade modal";
  div1.tabIndex = -1;
  div1.setAttribute("role", "dialog");

  var innerDiv1m = document.createElement("div");
  innerDiv1m.className = "modal-dialog";
  innerDiv1m.setAttribute("role", "document");
  div1.appendChild(innerDiv1m);

  var innerDiv2m = document.createElement("div");
  innerDiv2m.className = "modal-content";
  innerDiv1m.appendChild(innerDiv2m);

  var innerDiv3 = document.createElement("div");
  innerDiv3.className = "modal-header";
  innerDiv2m.appendChild(innerDiv3);

  var headerM = document.createElement("H4");
  headerM.className = "modal-title";
  headerM.textContent = `Weather on ${foredata[num - 1].date}`;
  innerDiv3.appendChild(headerM);

  var buttonM = document.createElement("button");
  buttonM.className = "close btn";
  buttonM.setAttribute("data-dismiss", "modal");
  buttonM.textContent = "X";
  innerDiv3.appendChild(buttonM);

  var innerDiv31 = document.createElement("div");
  innerDiv31.className = "modal-body";
  innerDiv2m.appendChild(innerDiv31);

  let modalh2 = document.createElement("H2");
  modalh2.textContent = `${foredata[num - 1].tempFar}°`;
  innerDiv31.appendChild(modalh2);

  let modalh3 = document.createElement("H3");
  modalh3.textContent = `${foredata[num - 1].description}`;
  innerDiv31.appendChild(modalh3);

  let forimg = document.createElement("img");
  forimg.classList.add("img-fluid");
  forimg.src = `${foredata[num - 1].icon}`;
  forimg.alt = `${foredata[num - 1].description} icon`;
  innerDiv31.appendChild(forimg);

  let innerTab41 = document.createElement("table");
  innerTab41.className = "table";
  let tab41Thead = document.createElement("THead");
  tab41Thead.className = "thead-dark";
  innerTab41.appendChild(tab41Thead);

  let tab51row = document.createElement("tr");

  let tab51th = document.createElement("th");
  tab51th.textContent = "Hi | Lo";
  let tab52th = document.createElement("th");
  tab52th.textContent = "Wind";
  tab51row.appendChild(tab51th);
  tab51row.appendChild(tab52th);
  tab41Thead.append(tab51row);

  let tab52row = document.createElement("tr");

  let tab51d = document.createElement("td");
  tab51d.textContent = `${foredata[num - 1].tempHi}° | ${
    foredata[num - 1].tempLo
  }°`;
  let tab52d = document.createElement("td");
  tab52d.textContent = `${foredata[num - 1].wind} mph`;
  tab52row.appendChild(tab51d);
  tab52row.appendChild(tab52d);
  tab41Thead.appendChild(tab52row);

  let tab51Thead = document.createElement("THead");
  tab51Thead.className = "thead-dark";
  innerTab41.appendChild(tab51Thead);

  let tab61row = document.createElement("tr");

  let tab61th = document.createElement("th");
  tab61th.textContent = "Humidity";
  let tab62th = document.createElement("th");
  tab62th.textContent = "Dew Point";
  tab61row.appendChild(tab61th);
  tab61row.appendChild(tab62th);
  tab51Thead.append(tab61row);

  let tab62row = document.createElement("tr");

  let tab61d = document.createElement("td");
  tab61d.textContent = `${foredata[num - 1].humidity}%`;
  let tab62d = document.createElement("td");
  tab62d.textContent = `${foredata[num - 1].dew_point} °`;
  tab62row.appendChild(tab61d);
  tab62row.appendChild(tab62d);
  tab51Thead.appendChild(tab62row);

  let tab61Thead = document.createElement("THead");
  tab61Thead.className = "thead-dark";
  innerTab41.appendChild(tab61Thead);

  let tab71row = document.createElement("tr");

  let tab71th = document.createElement("th");
  tab71th.textContent = "Pressure";
  let tab72th = document.createElement("th");
  tab72th.textContent = "UV Index";
  tab71row.appendChild(tab71th);
  tab71row.appendChild(tab72th);
  tab61Thead.append(tab71row);

  let tab72row = document.createElement("tr");

  let tab71d = document.createElement("td");
  tab71d.textContent = `${foredata[num - 1].pressure} in`;
  let tab72d = document.createElement("td");
  tab72d.textContent = `${foredata[num - 1].uvi} of 10`;
  tab72row.appendChild(tab71d);
  tab72row.appendChild(tab72d);
  tab61Thead.appendChild(tab72row);

  //
  let tab71Thead = document.createElement("THead");
  tab71Thead.className = "thead-dark";
  innerTab41.appendChild(tab71Thead);
  innerDiv31.appendChild(innerTab41);

  let tab81row = document.createElement("tr");

  let tab81th = document.createElement("th");
  tab81th.textContent = "Sunrise | Sunrise";
  let tab82th = document.createElement("th");
  tab82th.textContent = "Chance of Rain";
  tab81row.appendChild(tab81th);
  tab81row.appendChild(tab82th);
  tab71Thead.append(tab81row);

  let tab82row = document.createElement("tr");

  let tab81d = document.createElement("td");
  tab81d.textContent = `${foredata[num - 1].sunrisetime} | ${
    foredata[num - 1].sunsettime
  }`;
  let tab82d = document.createElement("td");
  tab82d.textContent = `${foredata[num - 1].pop}%`;
  tab82row.appendChild(tab81d);
  tab82row.appendChild(tab82d);
  tab71Thead.appendChild(tab82row);

  //

  let innerDiv32 = document.createElement("div");
  innerDiv32.className = "modal-footer";
  innerDiv2m.appendChild(innerDiv32);

  var closeButton = document.createElement("button");
  closeButton.className = "btn btn-dark";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.innerHTML = "Exit";
  innerDiv32.appendChild(closeButton);

  modal.appendChild(div1);

  maindiv.appendChild(modal);

  return maindiv;
}

function createmodal3(foredata, num) {
  let maindiv = document.createElement("div");

  let modal = document.createElement("button");
  modal.classList.add("btn", "btn-dark");
  modal.setAttribute("data-toggle", "modal");
  modal.setAttribute("data-target", "#sampleModal3");
  modal.innerHTML = "More Data";

  var div1 = document.createElement("div");
  div1.id = "sampleModal3";
  div1.className = "fade modal";
  div1.tabIndex = -1;
  div1.setAttribute("role", "dialog");

  var innerDiv1m = document.createElement("div");
  innerDiv1m.className = "modal-dialog";
  innerDiv1m.setAttribute("role", "document");
  div1.appendChild(innerDiv1m);

  var innerDiv2m = document.createElement("div");
  innerDiv2m.className = "modal-content";
  innerDiv1m.appendChild(innerDiv2m);

  var innerDiv3 = document.createElement("div");
  innerDiv3.className = "modal-header";
  innerDiv2m.appendChild(innerDiv3);

  var headerM = document.createElement("H4");
  headerM.className = "modal-title";
  headerM.textContent = `Weather on ${foredata[num - 1].date}`;
  innerDiv3.appendChild(headerM);

  var buttonM = document.createElement("button");
  buttonM.className = "close btn";
  buttonM.setAttribute("data-dismiss", "modal");
  buttonM.textContent = "X";
  innerDiv3.appendChild(buttonM);

  var innerDiv31 = document.createElement("div");
  innerDiv31.className = "modal-body";
  innerDiv2m.appendChild(innerDiv31);

  let modalh2 = document.createElement("H2");
  modalh2.textContent = `${foredata[num - 1].tempFar}°`;
  innerDiv31.appendChild(modalh2);

  let modalh3 = document.createElement("H3");
  modalh3.textContent = `${foredata[num - 1].description}`;
  innerDiv31.appendChild(modalh3);

  let forimg = document.createElement("img");
  forimg.classList.add("img-fluid");
  forimg.src = `${foredata[num - 1].icon}`;
  forimg.alt = `${foredata[num - 1].description} icon`;
  innerDiv31.appendChild(forimg);

  let innerTab41 = document.createElement("table");
  innerTab41.className = "table";
  let tab41Thead = document.createElement("THead");
  tab41Thead.className = "thead-dark";
  innerTab41.appendChild(tab41Thead);

  let tab51row = document.createElement("tr");

  let tab51th = document.createElement("th");
  tab51th.textContent = "Hi | Lo";
  let tab52th = document.createElement("th");
  tab52th.textContent = "Wind";
  tab51row.appendChild(tab51th);
  tab51row.appendChild(tab52th);
  tab41Thead.append(tab51row);

  let tab52row = document.createElement("tr");

  let tab51d = document.createElement("td");
  tab51d.textContent = `${foredata[num - 1].tempHi}° | ${
    foredata[num - 1].tempLo
  }°`;
  let tab52d = document.createElement("td");
  tab52d.textContent = `${foredata[num - 1].wind} mph`;
  tab52row.appendChild(tab51d);
  tab52row.appendChild(tab52d);
  tab41Thead.appendChild(tab52row);

  let tab51Thead = document.createElement("THead");
  tab51Thead.className = "thead-dark";
  innerTab41.appendChild(tab51Thead);

  let tab61row = document.createElement("tr");

  let tab61th = document.createElement("th");
  tab61th.textContent = "Humidity";
  let tab62th = document.createElement("th");
  tab62th.textContent = "Dew Point";
  tab61row.appendChild(tab61th);
  tab61row.appendChild(tab62th);
  tab51Thead.append(tab61row);

  let tab62row = document.createElement("tr");

  let tab61d = document.createElement("td");
  tab61d.textContent = `${foredata[num - 1].humidity}%`;
  let tab62d = document.createElement("td");
  tab62d.textContent = `${foredata[num - 1].dew_point} °`;
  tab62row.appendChild(tab61d);
  tab62row.appendChild(tab62d);
  tab51Thead.appendChild(tab62row);

  let tab61Thead = document.createElement("THead");
  tab61Thead.className = "thead-dark";
  innerTab41.appendChild(tab61Thead);

  let tab71row = document.createElement("tr");

  let tab71th = document.createElement("th");
  tab71th.textContent = "Pressure";
  let tab72th = document.createElement("th");
  tab72th.textContent = "UV Index";
  tab71row.appendChild(tab71th);
  tab71row.appendChild(tab72th);
  tab61Thead.append(tab71row);

  let tab72row = document.createElement("tr");

  let tab71d = document.createElement("td");
  tab71d.textContent = `${foredata[num - 1].pressure} in`;
  let tab72d = document.createElement("td");
  tab72d.textContent = `${foredata[num - 1].uvi} of 10`;
  tab72row.appendChild(tab71d);
  tab72row.appendChild(tab72d);
  tab61Thead.appendChild(tab72row);

  //
  let tab71Thead = document.createElement("THead");
  tab71Thead.className = "thead-dark";
  innerTab41.appendChild(tab71Thead);
  innerDiv31.appendChild(innerTab41);

  let tab81row = document.createElement("tr");

  let tab81th = document.createElement("th");
  tab81th.textContent = "Sunrise | Sunrise";
  let tab82th = document.createElement("th");
  tab82th.textContent = "Chance of Rain";
  tab81row.appendChild(tab81th);
  tab81row.appendChild(tab82th);
  tab71Thead.append(tab81row);

  let tab82row = document.createElement("tr");

  let tab81d = document.createElement("td");
  tab81d.textContent = `${foredata[num - 1].sunrisetime} | ${
    foredata[num - 1].sunsettime
  }`;
  let tab82d = document.createElement("td");
  tab82d.textContent = `${foredata[num - 1].pop}%`;
  tab82row.appendChild(tab81d);
  tab82row.appendChild(tab82d);
  tab71Thead.appendChild(tab82row);

  //

  let innerDiv32 = document.createElement("div");
  innerDiv32.className = "modal-footer";
  innerDiv2m.appendChild(innerDiv32);

  var closeButton = document.createElement("button");
  closeButton.className = "btn btn-dark";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.innerHTML = "Exit";
  innerDiv32.appendChild(closeButton);

  modal.appendChild(div1);

  maindiv.appendChild(modal);

  return maindiv;
}

function createmodal4(foredata, num) {
  let maindiv = document.createElement("div");

  let modal = document.createElement("button");
  modal.classList.add("btn", "btn-dark");
  modal.setAttribute("data-toggle", "modal");
  modal.setAttribute("data-target", "#sampleModal4");
  modal.innerHTML = "More Data";

  var div1 = document.createElement("div");
  div1.id = "sampleModal4";
  div1.className = "fade modal";
  div1.tabIndex = -1;
  div1.setAttribute("role", "dialog");

  var innerDiv1m = document.createElement("div");
  innerDiv1m.className = "modal-dialog";
  innerDiv1m.setAttribute("role", "document");
  div1.appendChild(innerDiv1m);

  var innerDiv2m = document.createElement("div");
  innerDiv2m.className = "modal-content";
  innerDiv1m.appendChild(innerDiv2m);

  var innerDiv3 = document.createElement("div");
  innerDiv3.className = "modal-header";
  innerDiv2m.appendChild(innerDiv3);

  var headerM = document.createElement("H4");
  headerM.className = "modal-title";
  headerM.textContent = `Weather on ${foredata[num - 1].date}`;
  innerDiv3.appendChild(headerM);

  var buttonM = document.createElement("button");
  buttonM.className = "close btn";
  buttonM.setAttribute("data-dismiss", "modal");
  buttonM.textContent = "X";
  innerDiv3.appendChild(buttonM);

  var innerDiv31 = document.createElement("div");
  innerDiv31.className = "modal-body";
  innerDiv2m.appendChild(innerDiv31);

  let modalh2 = document.createElement("H2");
  modalh2.textContent = `${foredata[num - 1].tempFar}°`;
  innerDiv31.appendChild(modalh2);

  let modalh3 = document.createElement("H3");
  modalh3.textContent = `${foredata[num - 1].description}`;
  innerDiv31.appendChild(modalh3);

  let forimg = document.createElement("img");
  forimg.classList.add("img-fluid");
  forimg.src = `${foredata[num - 1].icon}`;
  forimg.alt = `${foredata[num - 1].description} icon`;
  innerDiv31.appendChild(forimg);

  let innerTab41 = document.createElement("table");
  innerTab41.className = "table";
  let tab41Thead = document.createElement("THead");
  tab41Thead.className = "thead-dark";
  innerTab41.appendChild(tab41Thead);

  let tab51row = document.createElement("tr");

  let tab51th = document.createElement("th");
  tab51th.textContent = "Hi | Lo";
  let tab52th = document.createElement("th");
  tab52th.textContent = "Wind";
  tab51row.appendChild(tab51th);
  tab51row.appendChild(tab52th);
  tab41Thead.append(tab51row);

  let tab52row = document.createElement("tr");

  let tab51d = document.createElement("td");
  tab51d.textContent = `${foredata[num - 1].tempHi}° | ${
    foredata[num - 1].tempLo
  }°`;
  let tab52d = document.createElement("td");
  tab52d.textContent = `${foredata[num - 1].wind} mph`;
  tab52row.appendChild(tab51d);
  tab52row.appendChild(tab52d);
  tab41Thead.appendChild(tab52row);

  let tab51Thead = document.createElement("THead");
  tab51Thead.className = "thead-dark";
  innerTab41.appendChild(tab51Thead);

  let tab61row = document.createElement("tr");

  let tab61th = document.createElement("th");
  tab61th.textContent = "Humidity";
  let tab62th = document.createElement("th");
  tab62th.textContent = "Dew Point";
  tab61row.appendChild(tab61th);
  tab61row.appendChild(tab62th);
  tab51Thead.append(tab61row);

  let tab62row = document.createElement("tr");

  let tab61d = document.createElement("td");
  tab61d.textContent = `${foredata[num - 1].humidity}%`;
  let tab62d = document.createElement("td");
  tab62d.textContent = `${foredata[num - 1].dew_point} °`;
  tab62row.appendChild(tab61d);
  tab62row.appendChild(tab62d);
  tab51Thead.appendChild(tab62row);

  let tab61Thead = document.createElement("THead");
  tab61Thead.className = "thead-dark";
  innerTab41.appendChild(tab61Thead);

  let tab71row = document.createElement("tr");

  let tab71th = document.createElement("th");
  tab71th.textContent = "Pressure";
  let tab72th = document.createElement("th");
  tab72th.textContent = "UV Index";
  tab71row.appendChild(tab71th);
  tab71row.appendChild(tab72th);
  tab61Thead.append(tab71row);

  let tab72row = document.createElement("tr");

  let tab71d = document.createElement("td");
  tab71d.textContent = `${foredata[num - 1].pressure} in`;
  let tab72d = document.createElement("td");
  tab72d.textContent = `${foredata[num - 1].uvi} of 10`;
  tab72row.appendChild(tab71d);
  tab72row.appendChild(tab72d);
  tab61Thead.appendChild(tab72row);

  //
  let tab71Thead = document.createElement("THead");
  tab71Thead.className = "thead-dark";
  innerTab41.appendChild(tab71Thead);
  innerDiv31.appendChild(innerTab41);

  let tab81row = document.createElement("tr");

  let tab81th = document.createElement("th");
  tab81th.textContent = "Sunrise | Sunrise";
  let tab82th = document.createElement("th");
  tab82th.textContent = "Chance of Rain";
  tab81row.appendChild(tab81th);
  tab81row.appendChild(tab82th);
  tab71Thead.append(tab81row);

  let tab82row = document.createElement("tr");

  let tab81d = document.createElement("td");
  tab81d.textContent = `${foredata[num - 1].sunrisetime} | ${
    foredata[num - 1].sunsettime
  }`;
  let tab82d = document.createElement("td");
  tab82d.textContent = `${foredata[num - 1].pop}%`;
  tab82row.appendChild(tab81d);
  tab82row.appendChild(tab82d);
  tab71Thead.appendChild(tab82row);

  //

  let innerDiv32 = document.createElement("div");
  innerDiv32.className = "modal-footer";
  innerDiv2m.appendChild(innerDiv32);

  var closeButton = document.createElement("button");
  closeButton.className = "btn btn-dark";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.innerHTML = "Exit";
  innerDiv32.appendChild(closeButton);

  modal.appendChild(div1);

  maindiv.appendChild(modal);

  return maindiv;
}

function createmodal5(foredata, num) {
  let maindiv = document.createElement("div");

  let modal = document.createElement("button");
  modal.classList.add("btn", "btn-dark");
  modal.setAttribute("data-toggle", "modal");
  modal.setAttribute("data-target", "#sampleModal5");
  modal.innerHTML = "More Data";

  var div1 = document.createElement("div");
  div1.id = "sampleModal5";
  div1.className = "fade modal";
  div1.tabIndex = -1;
  div1.setAttribute("role", "dialog");

  var innerDiv1m = document.createElement("div");
  innerDiv1m.className = "modal-dialog";
  innerDiv1m.setAttribute("role", "document");
  div1.appendChild(innerDiv1m);

  var innerDiv2m = document.createElement("div");
  innerDiv2m.className = "modal-content";
  innerDiv1m.appendChild(innerDiv2m);

  var innerDiv3 = document.createElement("div");
  innerDiv3.className = "modal-header";
  innerDiv2m.appendChild(innerDiv3);

  var headerM = document.createElement("H4");
  headerM.className = "modal-title";
  headerM.textContent = `Weather on ${foredata[num - 1].date}`;
  innerDiv3.appendChild(headerM);

  var buttonM = document.createElement("button");
  buttonM.className = "close btn";
  buttonM.setAttribute("data-dismiss", "modal");
  buttonM.textContent = "X";
  innerDiv3.appendChild(buttonM);

  var innerDiv31 = document.createElement("div");
  innerDiv31.className = "modal-body";
  innerDiv2m.appendChild(innerDiv31);

  let modalh2 = document.createElement("H2");
  modalh2.textContent = `${foredata[num - 1].tempFar}°`;
  innerDiv31.appendChild(modalh2);

  let modalh3 = document.createElement("H3");
  modalh3.textContent = `${foredata[num - 1].description}`;
  innerDiv31.appendChild(modalh3);

  let forimg = document.createElement("img");
  forimg.classList.add("img-fluid");
  forimg.src = `${foredata[num - 1].icon}`;
  forimg.alt = `${foredata[num - 1].description} icon`;
  innerDiv31.appendChild(forimg);

  let innerTab41 = document.createElement("table");
  innerTab41.className = "table";
  let tab41Thead = document.createElement("THead");
  tab41Thead.className = "thead-dark";
  innerTab41.appendChild(tab41Thead);

  let tab51row = document.createElement("tr");

  let tab51th = document.createElement("th");
  tab51th.textContent = "Hi | Lo";
  let tab52th = document.createElement("th");
  tab52th.textContent = "Wind";
  tab51row.appendChild(tab51th);
  tab51row.appendChild(tab52th);
  tab41Thead.append(tab51row);

  let tab52row = document.createElement("tr");

  let tab51d = document.createElement("td");
  tab51d.textContent = `${foredata[num - 1].tempHi}° | ${
    foredata[num - 1].tempLo
  }°`;
  let tab52d = document.createElement("td");
  tab52d.textContent = `${foredata[num - 1].wind} mph`;
  tab52row.appendChild(tab51d);
  tab52row.appendChild(tab52d);
  tab41Thead.appendChild(tab52row);

  let tab51Thead = document.createElement("THead");
  tab51Thead.className = "thead-dark";
  innerTab41.appendChild(tab51Thead);

  let tab61row = document.createElement("tr");

  let tab61th = document.createElement("th");
  tab61th.textContent = "Humidity";
  let tab62th = document.createElement("th");
  tab62th.textContent = "Dew Point";
  tab61row.appendChild(tab61th);
  tab61row.appendChild(tab62th);
  tab51Thead.append(tab61row);

  let tab62row = document.createElement("tr");

  let tab61d = document.createElement("td");
  tab61d.textContent = `${foredata[num - 1].humidity}%`;
  let tab62d = document.createElement("td");
  tab62d.textContent = `${foredata[num - 1].dew_point} °`;
  tab62row.appendChild(tab61d);
  tab62row.appendChild(tab62d);
  tab51Thead.appendChild(tab62row);

  let tab61Thead = document.createElement("THead");
  tab61Thead.className = "thead-dark";
  innerTab41.appendChild(tab61Thead);

  let tab71row = document.createElement("tr");

  let tab71th = document.createElement("th");
  tab71th.textContent = "Pressure";
  let tab72th = document.createElement("th");
  tab72th.textContent = "UV Index";
  tab71row.appendChild(tab71th);
  tab71row.appendChild(tab72th);
  tab61Thead.append(tab71row);

  let tab72row = document.createElement("tr");

  let tab71d = document.createElement("td");
  tab71d.textContent = `${foredata[num - 1].pressure} in`;
  let tab72d = document.createElement("td");
  tab72d.textContent = `${foredata[num - 1].uvi} of 10`;
  tab72row.appendChild(tab71d);
  tab72row.appendChild(tab72d);
  tab61Thead.appendChild(tab72row);

  //
  let tab71Thead = document.createElement("THead");
  tab71Thead.className = "thead-dark";
  innerTab41.appendChild(tab71Thead);
  innerDiv31.appendChild(innerTab41);

  let tab81row = document.createElement("tr");

  let tab81th = document.createElement("th");
  tab81th.textContent = "Sunrise | Sunrise";
  let tab82th = document.createElement("th");
  tab82th.textContent = "Chance of Rain";
  tab81row.appendChild(tab81th);
  tab81row.appendChild(tab82th);
  tab71Thead.append(tab81row);

  let tab82row = document.createElement("tr");

  let tab81d = document.createElement("td");
  tab81d.textContent = `${foredata[num - 1].sunrisetime} | ${
    foredata[num - 1].sunsettime
  }`;
  let tab82d = document.createElement("td");
  tab82d.textContent = `${foredata[num - 1].pop}%`;
  tab82row.appendChild(tab81d);
  tab82row.appendChild(tab82d);
  tab71Thead.appendChild(tab82row);

  //

  let innerDiv32 = document.createElement("div");
  innerDiv32.className = "modal-footer";
  innerDiv2m.appendChild(innerDiv32);

  var closeButton = document.createElement("button");
  closeButton.className = "btn btn-dark";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.innerHTML = "Exit";
  innerDiv32.appendChild(closeButton);

  modal.appendChild(div1);

  maindiv.appendChild(modal);

  return maindiv;
}

function createmodal6(foredata, num) {
  let maindiv = document.createElement("div");

  let modal = document.createElement("button");
  modal.classList.add("btn", "btn-dark");
  modal.setAttribute("data-toggle", "modal");
  modal.setAttribute("data-target", "#sampleModal6");
  modal.innerHTML = "More Data";

  var div1 = document.createElement("div");
  div1.id = "sampleModal6";
  div1.className = "fade modal";
  div1.tabIndex = -1;
  div1.setAttribute("role", "dialog");

  var innerDiv1m = document.createElement("div");
  innerDiv1m.className = "modal-dialog";
  innerDiv1m.setAttribute("role", "document");
  div1.appendChild(innerDiv1m);

  var innerDiv2m = document.createElement("div");
  innerDiv2m.className = "modal-content";
  innerDiv1m.appendChild(innerDiv2m);

  var innerDiv3 = document.createElement("div");
  innerDiv3.className = "modal-header";
  innerDiv2m.appendChild(innerDiv3);

  var headerM = document.createElement("H4");
  headerM.className = "modal-title";
  headerM.textContent = `Weather on ${foredata[num - 1].date}`;
  innerDiv3.appendChild(headerM);

  var buttonM = document.createElement("button");
  buttonM.className = "close btn";
  buttonM.setAttribute("data-dismiss", "modal");
  buttonM.textContent = "X";
  innerDiv3.appendChild(buttonM);

  var innerDiv31 = document.createElement("div");
  innerDiv31.className = "modal-body";
  innerDiv2m.appendChild(innerDiv31);

  let modalh2 = document.createElement("H2");
  modalh2.textContent = `${foredata[num - 1].tempFar}°`;
  innerDiv31.appendChild(modalh2);

  let modalh3 = document.createElement("H3");
  modalh3.textContent = `${foredata[num - 1].description}`;
  innerDiv31.appendChild(modalh3);

  let forimg = document.createElement("img");
  forimg.classList.add("img-fluid");
  forimg.src = `${foredata[num - 1].icon}`;
  forimg.alt = `${foredata[num - 1].description} icon`;
  innerDiv31.appendChild(forimg);

  let innerTab41 = document.createElement("table");
  innerTab41.className = "table";
  let tab41Thead = document.createElement("THead");
  tab41Thead.className = "thead-dark";
  innerTab41.appendChild(tab41Thead);

  let tab51row = document.createElement("tr");

  let tab51th = document.createElement("th");
  tab51th.textContent = "Hi | Lo";
  let tab52th = document.createElement("th");
  tab52th.textContent = "Wind";
  tab51row.appendChild(tab51th);
  tab51row.appendChild(tab52th);
  tab41Thead.append(tab51row);

  let tab52row = document.createElement("tr");

  let tab51d = document.createElement("td");
  tab51d.textContent = `${foredata[num - 1].tempHi}° | ${
    foredata[num - 1].tempLo
  }°`;
  let tab52d = document.createElement("td");
  tab52d.textContent = `${foredata[num - 1].wind} mph`;
  tab52row.appendChild(tab51d);
  tab52row.appendChild(tab52d);
  tab41Thead.appendChild(tab52row);

  let tab51Thead = document.createElement("THead");
  tab51Thead.className = "thead-dark";
  innerTab41.appendChild(tab51Thead);

  let tab61row = document.createElement("tr");

  let tab61th = document.createElement("th");
  tab61th.textContent = "Humidity";
  let tab62th = document.createElement("th");
  tab62th.textContent = "Dew Point";
  tab61row.appendChild(tab61th);
  tab61row.appendChild(tab62th);
  tab51Thead.append(tab61row);

  let tab62row = document.createElement("tr");

  let tab61d = document.createElement("td");
  tab61d.textContent = `${foredata[num - 1].humidity}%`;
  let tab62d = document.createElement("td");
  tab62d.textContent = `${foredata[num - 1].dew_point} °`;
  tab62row.appendChild(tab61d);
  tab62row.appendChild(tab62d);
  tab51Thead.appendChild(tab62row);

  let tab61Thead = document.createElement("THead");
  tab61Thead.className = "thead-dark";
  innerTab41.appendChild(tab61Thead);

  let tab71row = document.createElement("tr");

  let tab71th = document.createElement("th");
  tab71th.textContent = "Pressure";
  let tab72th = document.createElement("th");
  tab72th.textContent = "UV Index";
  tab71row.appendChild(tab71th);
  tab71row.appendChild(tab72th);
  tab61Thead.append(tab71row);

  let tab72row = document.createElement("tr");

  let tab71d = document.createElement("td");
  tab71d.textContent = `${foredata[num - 1].pressure} in`;
  let tab72d = document.createElement("td");
  tab72d.textContent = `${foredata[num - 1].uvi} of 10`;
  tab72row.appendChild(tab71d);
  tab72row.appendChild(tab72d);
  tab61Thead.appendChild(tab72row);

  //
  let tab71Thead = document.createElement("THead");
  tab71Thead.className = "thead-dark";
  innerTab41.appendChild(tab71Thead);
  innerDiv31.appendChild(innerTab41);

  let tab81row = document.createElement("tr");

  let tab81th = document.createElement("th");
  tab81th.textContent = "Sunrise | Sunrise";
  let tab82th = document.createElement("th");
  tab82th.textContent = "Chance of Rain";
  tab81row.appendChild(tab81th);
  tab81row.appendChild(tab82th);
  tab71Thead.append(tab81row);

  let tab82row = document.createElement("tr");

  let tab81d = document.createElement("td");
  tab81d.textContent = `${foredata[num - 1].sunrisetime} | ${
    foredata[num - 1].sunsettime
  }`;
  let tab82d = document.createElement("td");
  tab82d.textContent = `${foredata[num - 1].pop}%`;
  tab82row.appendChild(tab81d);
  tab82row.appendChild(tab82d);
  tab71Thead.appendChild(tab82row);

  //

  let innerDiv32 = document.createElement("div");
  innerDiv32.className = "modal-footer";
  innerDiv2m.appendChild(innerDiv32);

  var closeButton = document.createElement("button");
  closeButton.className = "btn btn-dark";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.innerHTML = "Exit";
  innerDiv32.appendChild(closeButton);

  modal.appendChild(div1);

  maindiv.appendChild(modal);

  return maindiv;
}

function createmodal7(foredata, num) {
  let maindiv = document.createElement("div");

  let modal = document.createElement("button");
  modal.classList.add("btn", "btn-dark");
  modal.setAttribute("data-toggle", "modal");
  modal.setAttribute("data-target", "#sampleModal7");
  modal.innerHTML = "More Data";

  var div1 = document.createElement("div");
  div1.id = "sampleModal7";
  div1.className = "fade modal";
  div1.tabIndex = -1;
  div1.setAttribute("role", "dialog");

  var innerDiv1m = document.createElement("div");
  innerDiv1m.className = "modal-dialog";
  innerDiv1m.setAttribute("role", "document");
  div1.appendChild(innerDiv1m);

  var innerDiv2m = document.createElement("div");
  innerDiv2m.className = "modal-content";
  innerDiv1m.appendChild(innerDiv2m);

  var innerDiv3 = document.createElement("div");
  innerDiv3.className = "modal-header";
  innerDiv2m.appendChild(innerDiv3);

  var headerM = document.createElement("H4");
  headerM.className = "modal-title";
  headerM.textContent = `Weather on ${foredata[num - 1].date}`;
  innerDiv3.appendChild(headerM);

  var buttonM = document.createElement("button");
  buttonM.className = "close btn";
  buttonM.setAttribute("data-dismiss", "modal");
  buttonM.textContent = "X";
  innerDiv3.appendChild(buttonM);

  var innerDiv31 = document.createElement("div");
  innerDiv31.className = "modal-body";
  innerDiv2m.appendChild(innerDiv31);

  let modalh2 = document.createElement("H2");
  modalh2.textContent = `${foredata[num - 1].tempFar}°`;
  innerDiv31.appendChild(modalh2);

  let modalh3 = document.createElement("H3");
  modalh3.textContent = `${foredata[num - 1].description}`;
  innerDiv31.appendChild(modalh3);

  let forimg = document.createElement("img");
  forimg.classList.add("img-fluid");
  forimg.src = `${foredata[num - 1].icon}`;
  forimg.alt = `${foredata[num - 1].description} icon`;
  innerDiv31.appendChild(forimg);

  let innerTab41 = document.createElement("table");
  innerTab41.className = "table";
  let tab41Thead = document.createElement("THead");
  tab41Thead.className = "thead-dark";
  innerTab41.appendChild(tab41Thead);

  let tab51row = document.createElement("tr");

  let tab51th = document.createElement("th");
  tab51th.textContent = "Hi | Lo";
  let tab52th = document.createElement("th");
  tab52th.textContent = "Wind";
  tab51row.appendChild(tab51th);
  tab51row.appendChild(tab52th);
  tab41Thead.append(tab51row);

  let tab52row = document.createElement("tr");

  let tab51d = document.createElement("td");
  tab51d.textContent = `${foredata[num - 1].tempHi}° | ${
    foredata[num - 1].tempLo
  }°`;
  let tab52d = document.createElement("td");
  tab52d.textContent = `${foredata[num - 1].wind} mph`;
  tab52row.appendChild(tab51d);
  tab52row.appendChild(tab52d);
  tab41Thead.appendChild(tab52row);

  let tab51Thead = document.createElement("THead");
  tab51Thead.className = "thead-dark";
  innerTab41.appendChild(tab51Thead);

  let tab61row = document.createElement("tr");

  let tab61th = document.createElement("th");
  tab61th.textContent = "Humidity";
  let tab62th = document.createElement("th");
  tab62th.textContent = "Dew Point";
  tab61row.appendChild(tab61th);
  tab61row.appendChild(tab62th);
  tab51Thead.append(tab61row);

  let tab62row = document.createElement("tr");

  let tab61d = document.createElement("td");
  tab61d.textContent = `${foredata[num - 1].humidity}%`;
  let tab62d = document.createElement("td");
  tab62d.textContent = `${foredata[num - 1].dew_point} °`;
  tab62row.appendChild(tab61d);
  tab62row.appendChild(tab62d);
  tab51Thead.appendChild(tab62row);

  let tab61Thead = document.createElement("THead");
  tab61Thead.className = "thead-dark";
  innerTab41.appendChild(tab61Thead);

  let tab71row = document.createElement("tr");

  let tab71th = document.createElement("th");
  tab71th.textContent = "Pressure";
  let tab72th = document.createElement("th");
  tab72th.textContent = "UV Index";
  tab71row.appendChild(tab71th);
  tab71row.appendChild(tab72th);
  tab61Thead.append(tab71row);

  let tab72row = document.createElement("tr");

  let tab71d = document.createElement("td");
  tab71d.textContent = `${foredata[num - 1].pressure} in`;
  let tab72d = document.createElement("td");
  tab72d.textContent = `${foredata[num - 1].uvi} of 10`;
  tab72row.appendChild(tab71d);
  tab72row.appendChild(tab72d);
  tab61Thead.appendChild(tab72row);

  //
  let tab71Thead = document.createElement("THead");
  tab71Thead.className = "thead-dark";
  innerTab41.appendChild(tab71Thead);
  innerDiv31.appendChild(innerTab41);

  let tab81row = document.createElement("tr");

  let tab81th = document.createElement("th");
  tab81th.textContent = "Sunrise | Sunrise";
  let tab82th = document.createElement("th");
  tab82th.textContent = "Chance of Rain";
  tab81row.appendChild(tab81th);
  tab81row.appendChild(tab82th);
  tab71Thead.append(tab81row);

  let tab82row = document.createElement("tr");

  let tab81d = document.createElement("td");
  tab81d.textContent = `${foredata[num - 1].sunrisetime} | ${
    foredata[num - 1].sunsettime
  }`;
  let tab82d = document.createElement("td");
  tab82d.textContent = `${foredata[num - 1].pop}%`;
  tab82row.appendChild(tab81d);
  tab82row.appendChild(tab82d);
  tab71Thead.appendChild(tab82row);

  //

  let innerDiv32 = document.createElement("div");
  innerDiv32.className = "modal-footer";
  innerDiv2m.appendChild(innerDiv32);

  var closeButton = document.createElement("button");
  closeButton.className = "btn btn-dark";
  closeButton.setAttribute("data-dismiss", "modal");
  closeButton.innerHTML = "Exit";
  innerDiv32.appendChild(closeButton);

  modal.appendChild(div1);

  maindiv.appendChild(modal);

  return maindiv;
}
