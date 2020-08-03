const weather = document.getElementById("weather_page");
const search = document.getElementById("get_location");

search.addEventListener("click", () => {
  const addr = document.getElementById("address").value
    ? document.getElementById("address").value
    : "Portland, OR";
  const getCoords = firebase.functions().httpsCallable("getCoords");
  getCoords({ address: addr }).then((result) => showWeather(result.data));
});

function showWeather(data) {
  makeVisible(weather);
  //Data shortcuts
  const aq = data.aq;
  const forecast = data.weather;

  currentWeather(forecast[0]);
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

  //Create the Current weather card
  //Weather icon
  let img = document.createElement("img");
  img.classList.add("img-fluid");
  img.classList.add("float-right");
  img.src = `${current.icon}`;
  img.alt = "Weather icon";
  cur_body.appendChild(img);
  //temperature and description
  let temp = document.createElement("h2");
  temp.textContent = `${current.tempFar}°`;
  let des = document.createElement("h3");
  des.textContent = `${current.description}`;
  cur_body.appendChild(temp);
  cur_body.appendChild(des);
  //rest of data
  let cur_table = document.createElement("table");
  cur_table.classList.add("w-100");
  cur_table.classList.add("table-bordered");
  cur_table.classList.add("text-center");
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

  //create row 2
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

  //create row 3
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
  cur_body.append(cur_table);
}
