let change = document.querySelector(".section__change");
const sectionWrapper = document.querySelector(".section__wrapper");
sectionWrapper.addEventListener("click", (e) => {
  if (e.target.className === "section__change") {
    FindFunc();
  }
});

let lastTemp;
let lastTimezone;
let lastWeather;
let city;
let temp;
let weather;

function checkErr(res) {
  if (res.status == 404) {
    sectionWrapper.innerHTML = `<p class="section__error">Ooops. Something went wrong.</p> <p class='section__info'>Error info </p> <button class='section__try'>Try again</button>`;
    const tryButt = sectionWrapper.querySelector(".section__try");
    tryButt.addEventListener("click", () => {
      FindFunc();
    });
  }
}

async function getData(url) {
  const res = await fetch(url);
  checkErr(res);
  return res.json();
}
async function getIP(url) {
  const res = await fetch(url);
  checkErr(res);
  return res.json();
}
function FindFunc() {
  sectionWrapper.innerHTML = `<input
            type="text"
            class="section__input"
            placeholder="Type your city here"
          />
          <button class="section__find">Find</button>`;
  const input = sectionWrapper.querySelector(`.section__input`);
  const find = document.querySelector(".section__find");
  find.addEventListener("click", async () => {
    sectionWrapper.innerHTML = "";
    const inputVal = input.value;
    const FIND_URL = `http://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=886705b4c1182eb1c69f28eb8c520e20`;
    const findRes = await getData(FIND_URL);
    city = findRes.name;
    temp = Math.round(findRes.main.temp - 275.15);
    weather = findRes.weather[0].main;
    sectionWrapper.innerHTML = `           <p class="section__temp">${temp}°C</p>
          <p class="section__weather">${weather} в ${city}</p>
          <p class="section__change">Change city</p> `;
  });
}

const successCallback = async (position) => {
  const latidude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latidude}&lon=${longitude}&appid=daa20148447c985b3ad4df821393b1bf`;
  const result = await getData(API_URL);
  const temp = Math.round(result.current.temp - 275.15);
  const weather = result.alerts[0].event;
  if (temp !== lastTemp || result.timezone !== lastTimezone) {
    lastTemp = temp;
    lastTimezone = result.timezone;
    lastWeather = weather;
    sectionWrapper.innerHTML = `           <p class="section__temp">${lastTemp}°C</p>
    <p class="section__weather">${lastWeather} в ${lastTimezone}</p>
    <p class="section__change">Change city</p> `;
    change = sectionWrapper.querySelector(".section__change");
    change.addEventListener("click", () => {
      FindFunc();
    });
  }
};

const errorCallback = async () => {
  const API_IP = `https://geo.ipify.org/api/v2/country,city?apiKey=at_pbYoTgjFs8PD4rEIzbn0ugpadgrod
`;
  const resultIP = await getIP(API_IP);
  const latidude = resultIP.location.lat;
  const longitude = resultIP.location.lng;
  let city = resultIP.location.region;
  const API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latidude}&lon=${longitude}&appid=daa20148447c985b3ad4df821393b1bf`;
  const result = await getData(API_URL);
  let temp = Math.round(result.current.temp - 275.15);
  let weather = result.alerts[0].event;
  lastTemp = temp;
  lastTimezone = result.timezone;
  lastWeather = weather;
  sectionWrapper.innerHTML = `           <p class="section__temp">${lastTemp}°C</p>
          <p class="section__weather">${lastWeather} в ${city}</p>
          <p class="section__change">Change city</p> `;
  change = sectionWrapper.querySelector(".section__change");
  change.addEventListener("click", () => {
    FindFunc();
  });
};

const watchId = navigator.geolocation.watchPosition(
  successCallback,
  errorCallback
);
