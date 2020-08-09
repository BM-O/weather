const functions = require("firebase-functions");
const config = functions.config();
const axios = require("axios");
const e = require("express");
const momenttz = require('moment-timezone');
const moment = require('moment');

/*
 *  Cloud Function that is called by the script.js file
 *  - Takes in the address passed in to the function and uses it to
 *    query the MapQuest API
 */
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
  //Create object to store OpenWeather, AirVisual and Weatherbit Alert API call data
  let obj = {};
  obj.weather = await getWeather(lat, lng);
  obj.aq = await getAQ(lat, lng);
  obj.alert = await getWeatherAlert(lat, lng);

  return obj;
});

exports.getCurrent = functions.https.onCall(async (dataObj, context) => {
  //Query MapQuest API to get a JSON object in order to get
  //Callable function to accept Lat Long from Frontend and getWeather

  //dataObjt holding the inpute parameters, which will be mapped to Lat Long
  let lat = dataObj.latitude;
  let lng = dataObj.longitude;
  //Create object to store OpenWeather and AirVisual API call data
  let obj = {};
  obj.weather = await getWeather(lat, lng);
  obj.aq = await getAQ(lat, lng);
  obj.alert = await getWeatherAlert(lat, lng);

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

async function getWeatherAlert(lat, lng) {
  //Query WeatherBit.io API to get a JSON object in order fetch active
  //Weather alerts around the location specified
  const url = "https://api.weatherbit.io/v2.0/alerts?";
  const key = config.service.weatherbit_key;
  const query = `${url}lat=${lat}&lon=${lng}&key=${key}`;

  const response = await axios.get(query);
  const data = await response.data;
  return getWeatherAlertContents(data);
}

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var am = true ;

  if (hour > 12) {
    am = false;
    hour -= 12;
  } else if (hour === 12) {
    am = false;
  } else if (hour === 0) {
    hour = 12;
  }  

  var time = hour + ":" + min + ":" + (am ? "a.m." : "p.m.");
  return time;
}

function partOfDay() {
  /* given a 24-hour time HH, HHMM or HH:MM, 
		return the part of day (morning, afternoon, evening, night)	   
	*/

  var myDate = new Date();
  var hours = myDate.getHours();

  var partOfDay = "";

  if (hours < 12) {
    partOfDay = "morn";
  } else if (hours < 17) {
    partOfDay = "day";
  } else if (hours < 21) {
    partOfDay = "eve";
  } else {
    partOfDay = "night";
  }
  return partOfDay;
}
//OpenWeather helper function
function getWeatherContents(response) {
  //create object that will be returned
  let array = [];
  const weatherData = response.daily;
  const timezone = response["timezone"];
  const currpart = partOfDay(moment.unix(weatherData[0]["dt"]).tz(timezone).format('HH:mm'));
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
    let sunrise = moment.unix(x["sunrise"]).tz(timezone).format('hh:mm A');
    let sunset = moment.unix(x["sunset"]).tz(timezone).format('hh:mm A');
    let feelslike = x["feels_like"][`${currpart}`];
    let pop = x["pop"];
    let rain = x["rain"] ? `${x["rain"]} mm`: "No Rain";

    //Convert to Month/Day from Unix format
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let d = new Date(dateunix * 1000);
    let weekDay = days[d.getDay()];
    let day = d.getDate();
    let date = `${weekDay} ${day}`;

    let sunrisetime = timeConverter(sunrise);
    let sunsettime = timeConverter(sunset);

    //Capitalize the first letters of the strings
    conditionValue =
      conditionValue.charAt(0).toUpperCase() + conditionValue.slice(1);
    descriptionValue =
      descriptionValue.charAt(0).toUpperCase() + descriptionValue.slice(1);

    //Convert from Kelvins to F and C
    let tempValue = (tempLo + tempHi) / 2; //average temp in Kelvins
    let tempF = Math.round(((tempValue - 273.15) * (9 / 5) + 32) * 10) / 10;
    let tempC = Math.round((tempValue - 273.15) * 10) / 10;
    let tempfeelF = Math.round(((feelslike - 273.15) * (9 / 5) + 32) * 10) / 10;
    let tempfeelC = Math.round((feelslike - 273.15) * 10) / 10;
    tempHi = Math.round(((tempHi - 273.15) * (9 / 5) + 32) * 10) / 10;
    tempLo = Math.round(((tempLo - 273.15) * (9 / 5) + 32) * 10) / 10;
    let dewpointF =
      Math.round(((dewpointValue - 273.15) * (9 / 5) + 32) * 10) / 10;

    //Convert pressure from hPa to inHg (standard)
    pressureValue = Math.round(pressureValue * 0.03 * 100) / 100;

    //Convert wind speeds to from meters per hour to miles per hour
    let windSpeed = Math.round(windValue * 2.237 * 10) / 10;

    let iconLink;
    if (i === 0) {
      iconLink = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    } else {
      iconLink = `https://openweathermap.org/img/wn/${icon}@2x.png`;
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
      pressure: pressureValue,
      dew_point: dewpointF,
      uvi: uvindexValue,
      icon: iconLink,
      tempHi: tempHi,
      tempLo: tempLo,
      sunrisetime: sunrise,
      sunsettime: sunset,
      tempfeelF: tempfeelF,
      tempfeelC: tempfeelF,
      pop: pop,
      rain: rain,
    };
    array.push(obj); //Add object to array
  }
  return array;
}

//AirVisual helper function
function getAirQualityContents(response) {
  // Get current air quality
  let pollution = response.data.current.pollution; //Shorthand
  let airQuality = pollution.aqius; //Get AQI-us
  let pollutionLevel = "";
  let cautionStatement = "";
  if (airQuality >= 0 && airQuality <= 50) {
    pollutionLevel = "Good";
    cautionStatement =
      "Air pollution poses little or no risk to active children and adults";
  } else if (airQuality >= 51 && airQuality <= 100) {
    pollutionLevel = "Moderate";
    cautionStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
  } else if (airQuality >= 101 && airQuality <= 150) {
    pollutionLevel = "Unhealthy for Sensitive Groups";
    cautionStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should limit prolonged outdoor exertion.";
  } else if (airQuality >= 151 && airQuality <= 200) {
    pollutionLevel = "Unhealthy";
    cautionStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should avoid prolonged outdoor exertion; everyone else, especially children, should limit prolonged outdoor exertion";
  } else if (airQuality >= 201 && airQuality <= 300) {
    pollutionLevel = "Very Unhealthy";
    cautionStatement =
      "Active children and adults, and people with respiratory disease, such as asthma, should avoid all outdoor exertion; everyone else, especially children, should limit outdoor exertion.";
  } else {
    pollutionLevel = "Hazardous";
    cautionStatement = "Everyone should avoid all outdoor exertion";
  }
  // Create object to return to client
  let obj = {
    aqi: airQuality,
    level: pollutionLevel,
    caution: cautionStatement,
  };
  return obj;
}

function getWeatherAlertContents(response){
  
  let array = [];
  const weatherAlerts = response.alerts;

  for (let i = 0; i < weatherAlerts.length; ++i) {
    let x = weatherAlerts[i];
    let issued = x["effective_local"];
    let expire = x["expires_local"];
    let url = x["uri"];
    let severity = x["severity"];
    let title = x["title"];
    let description = x["description"];      

    let obj = {
      issued: issued,
      expire: expire,
      url: url,
      severity: severity,
      title: title,
      description: description
    };
    array.push(obj); //Add object to array
  }
  return array;
}