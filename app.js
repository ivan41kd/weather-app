let lastTemp;
let lastTimezone;
const change = document.querySelector(".section__change");
const sectionWrapper = document.querySelector(".section__wrapper");
navigator.geolocation.watchPosition(async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const API_URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=daa20148447c985b3ad4df821393b1bf`;

  async function getData(url) {
    const res = await fetch(url);
    return res.json();
  }

  const result = await getData(API_URL);
  const temp = Math.round(result.current.temp - 275.15);
  const weather = result.alerts[0].event;
  lastTemp = temp;
  lastTimezone = result.timezone;
  sectionWrapper.innerHTML = `<p class="section__temp">${lastTemp}°C</p>
    <p class="section__weather">${weather} in ${lastTimezone}</p>
    <p class="section__change">Change city</p>`;
});


