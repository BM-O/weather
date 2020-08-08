const weather = document.getElementById("weather_page");
const homepage = document.getElementById("home_page");
const aboutus = document.getElementById("About_page");
const search = document.getElementById("get_location");
const aboutbtn = document.getElementById("btn_about");
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

aboutbtn.addEventListener("click", () =>{
  aboutusvs(weather, homepage, aboutus);
}
)

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
  img.alt = "Weather icon";
  cur_body.appendChild(img);
  //Temperature and description
  let temp = document.createElement("h2");
  temp.textContent = `${current.tempFar}°`;
  let des = document.createElement("h3");
  des.textContent = `${current.description}`;
  cur_body.appendChild(temp);
  cur_body.appendChild(des);
  //Create a table to store the rest of the data
  let cur_table = document.createElement("table");
  cur_table.classList.add("w-100");
  cur_table.classList.add("table-bordered");
  cur_table.classList.add("text-center");

  //Create row 1
  let row1 = cur_table.insertRow();
  //Row 1 - High/Low
  let cell1 = row1.insertCell();
  let HiLo_label = document.createElement("div");
  HiLo_label.classList.add("table-label");
  HiLo_label.classList.add("font-weight-bold");
  HiLo_label.textContent = "High/Low";
  cell1.appendChild(HiLo_label);
  let HiLo = document.createElement("div");
  HiLo.textContent = `${current.tempHi}° | ${current.tempLo}°`;
  cell1.appendChild(HiLo);
  //Row 1 - Wind
  let cell2 = row1.insertCell();
  let wind_label = document.createElement("div");
  wind_label.classList.add("table-label");
  wind_label.classList.add("font-weight-bold");
  wind_label.textContent = "Wind";
  cell2.appendChild(wind_label);
  let wind = document.createElement("div");
  wind.textContent = `${current.wind} mph`;
  cell2.appendChild(wind);

  //Create row 2
  let row2 = cur_table.insertRow();
  //Row 2 - Humidity
  let cell3 = row2.insertCell();
  let hum_label = document.createElement("div");
  hum_label.classList.add("table-label");
  hum_label.classList.add("font-weight-bold");
  hum_label.textContent = "Humidity";
  cell3.appendChild(hum_label);
  let hum = document.createElement("div");
  hum.textContent = `${current.humidity}%`;
  cell3.appendChild(hum);
  //Row 2 - Dew Point
  let cell4 = row2.insertCell();
  let dew_label = document.createElement("div");
  dew_label.classList.add("table-label");
  dew_label.classList.add("font-weight-bold");
  dew_label.textContent = "Dew Point";
  cell4.appendChild(dew_label);
  let dew = document.createElement("div");
  dew.textContent = `${current.dew_point}°`;
  cell4.appendChild(dew);

  //Create row 3
  let row3 = cur_table.insertRow();
  //Row 3 - Pressure
  let cell5 = row3.insertCell();
  let press_label = document.createElement("div");
  press_label.classList.add("table-label");
  press_label.classList.add("font-weight-bold");
  press_label.textContent = "Pressure";
  cell5.appendChild(press_label);
  let press = document.createElement("div");
  press.textContent = `${current.pressure} in`;
  cell5.appendChild(press);
  //Row 3 - UV Index
  let cell6 = row3.insertCell();
  let uv_label = document.createElement("div");
  uv_label.classList.add("table-label");
  uv_label.classList.add("font-weight-bold");
  uv_label.textContent = "UV Index";
  cell6.appendChild(uv_label);
  let uv = document.createElement("div");
  uv.textContent = `${current.uvi} of 10`;
  cell6.appendChild(uv);

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
  title.textContent = `7 Day forecast for ${addr}`;
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
     src=${forecast.icon} alt="Weather icon"></img><figcaption>${forecast.description}\
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
        let maindiv = document.createElement("div");

        let modal = document.createElement("button");
        modal.classList.add("btn", "btn-dark");
        modal.setAttribute("data-toggle", "modal");
        modal.setAttribute("data-target", `#sampleModal${i}`);
        modal.innerHTML = "More Data";

        var div1 = document.createElement("div");
        div1.id = `sampleModal${i}`;
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
        headerM.textContent = `Weather on ${Data[i-1].date}`;
        innerDiv3.appendChild(headerM);

        var buttonM = document.createElement("button");
        buttonM.className = "close btn";
        buttonM.setAttribute("data-dismiss", "modal");
        buttonM.textContent = "X";
        innerDiv3.appendChild(buttonM);

        var innerDiv31 = document.createElement("div");
        innerDiv31.className = "modal-body";        
        innerDiv2m.appendChild(innerDiv31);

        //var innerDiv32 = document.createElement("div");
        //innerDiv32.className = "modal-footer";
        //innerDiv2m.appendChild(innerDiv32);
        

        //clear child elements if there is any
        let modalh2 = document.createElement("H2");
        modalh2.textContent = `${Data[i-1].tempFar}°`;
        innerDiv31.appendChild(modalh2);
        
        let modalh3 = document.createElement("H3");
        modalh3.textContent = `${Data[i-1].description}`;
        innerDiv31.appendChild(modalh3);

        let forimg = document.createElement("img");
        forimg.classList.add("img-fluid");
        //forimg.classList.add("");        
        forimg.src = `${Data[i-1].icon}`;
        forimg.alt = "Weather Icon";
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
        tab51d.textContent = `${Data[i-1].tempHi}° | ${Data[i-1].tempLo}°`;
        let tab52d = document.createElement("td");
        tab52d.textContent = `${Data[i-1].wind} mph`;
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
        tab61d.textContent = `${Data[i-1].humidity}%`;
        let tab62d = document.createElement("td");
        tab62d.textContent = `${Data[i-1].dew_point} °`;
        tab62row.appendChild(tab61d);
        tab62row.appendChild(tab62d);
        tab51Thead.appendChild(tab62row);

        //

        let tab61Thead = document.createElement("THead");
        tab61Thead.className = "thead-dark";
        innerTab41.appendChild(tab61Thead);
        innerDiv31.appendChild(innerTab41);

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
        tab71d.textContent = `${Data[i-1].pressure} in`;
        let tab72d = document.createElement("td");
        tab72d.textContent = `${Data[i-1].uvi} of 10`;
        tab72row.appendChild(tab71d);
        tab72row.appendChild(tab72d);
        tab61Thead.appendChild(tab72row);

        //innerDiv2m.appendChild();

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

        var cell = row.insertCell(-1);
        cell.appendChild(maindiv);
      } else {
        var cell = row.insertCell(-1);
        cell.innerHTML = forecatData[i][j];
      }
    }
  }
}
