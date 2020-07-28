const functions = require("firebase-functions");
const config = functions.config();
const axios = require("axios");

exports.getCoords = functions.https.onCall(async (dataObj, context) => {
  //Query MapQuest API to get a JSON object in order to get
  //the geocode for the location entered.
  const url = "http://www.mapquestapi.com/geocoding/v1/address?key=";
  const key = config.service.mq_key;
  const query = `${url}${key}&location=${dataObj.address}`;

  const response = await axios.get(query);
  const data = await response.data;
  const geocode = data.results[0].locations[0].displayLatLng;
  let lat = geocode.lat;
  let lng = geocode.lng;
  //Create object to store OpenWeather and AirVisual API call data
  let obj = {};
  obj.weather = await getWeather(lat, lng);
  obj.aq = await getAQ(lat, lng);

  return obj;
});

async function getWeather(lat, lng) {
  //Query OpenWeather API to get a JSON object in order to get the
  //future weather forcasts

  const url = "https://api.openweathermap.org/data/2.5/onecall?";
  const key = config.service.ow_key;
  const query = `${url}lat=${lat}&lon=${lng}&
  exclude=current,minutely,hourly&appid=${key}`;

  const response = await axios.get(query);
  const data = await response.data;
  return getWeatherContents(data);
}

async function getAQ(lat, lng) {
  //Query AirVisual API to get a JSON object in order to the current air
  //quality index of the location specified
  const url = "http://api.airvisual.com/v2/nearest_city?";
  const key = config.service.av_key;
  const query = `${url}lat=${lat}&lon=${lng}&key=${key}`;

  const response = await axios.get(query);
  const data = await response.data;
  return getAirQualityContents(data);
}

function getWeatherContents(response) {
  //create object that will be returned
  let array = [];
  const weatherData = response.daily;
  //Parse JSON for necessary data to display
  for (let i = 0; i < weatherData.length; ++i) {
    let x = weatherData[i];
    let dateunix = x["dt"]; //date in unix format
    let conditionValue = x["weather"][0]["main"]; //string format
    let descriptionValue = x["weather"][0]["description"]; //string format
    let icon = x["weather"][0]["icon"]; //grab icon name
    let tempLo = x["temp"]["min"]; //in Kelvins
    let tempHi = x["temp"]["max"]; //in Kelvins
    let windValue = x["wind_speed"]; //in meters per second
    let humidityValue = x["humidity"]; //percentage
    let pressureValue = x["pressure"]; //in hPa
    let dewpointValue = x["dew_point"]; //in Kelvins
    let uvindexValue = x["uvi"]; //out of 10

    //Convert to Month/Day from Unix format
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let d = new Date(dateunix * 1000);
    let weekDay = days[d.getDay()];
    let day = d.getDate();
    let date = `${weekDay} ${day}`;

    //Capitalize the first letters of the strings
    conditionValue =
      conditionValue.charAt(0).toUpperCase() + conditionValue.slice(1);
    descriptionValue =
      descriptionValue.charAt(0).toUpperCase() + descriptionValue.slice(1);

    //Convert from Kelvins to F and C
    let tempValue = (tempLo + tempHi) / 2; //average temp in Kelvins
    let tempF = Math.round(((tempValue - 273.15) * (9 / 5) + 32) * 10) / 10;
    let tempC = Math.round((tempValue - 273.15) * 10) / 10;
    let dewpointF =
      Math.round(((dewpointValue - 273.15) * (9 / 5) + 32) * 10) / 10;

    //Convert pressure from hPa to inHg (standard)
    pressureValue = Math.round(pressureValue * 0.03 * 100) / 100;

    //Convert wind speeds to from meters per hour to miles per hour
    let windSpeed = Math.round(windValue * 2.237 * 10) / 10;

    let icon_link;
    if (i === 0) {
      icon_link = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    } else {
      icon_link = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
    //Create JSON object to add to array
    let obj = {
      date: date,
      condition: conditionValue,
      description: descriptionValue,
      tempFar: tempF,
      tempCel: tempC,
      wind: windSpeed,
      humidity: humidityValue,
      pressire: pressureValue,
      dew_point: dewpointF,
      uvi: uvindexValue,
      icon: icon_link,
    };
    array.push(obj);
  }
  return array;
}

function getAirQualityContents(response) {
  // Get current air quality
  let pollution = response.data.current.pollution;
  let airQuality = pollution.aqius;
  let mainPollutant = pollution.mainus;

  // Create object to return to client
  let obj = {
    aqi: airQuality,
    pol: mainPollutant,
  };
  return obj;
}
