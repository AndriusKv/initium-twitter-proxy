const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

router.get("/", (req, res) => {
  if (req.query.q || (req.query.lat && req.query.lon)) {
    fetchWeather(req.query).then(data => {
      res.send(data);
    }).catch(error => {
      res.json(error);
    });
  }
  else {
    res.sendStatus(400);
  }
});

async function fetchWeather(params) {
  let url = null;

  if (params.type === "hourly") {
    url = new URL("https://api.openweathermap.org/data/2.5/onecall");
    delete params.type;
    url.searchParams.set("exclude", "current,minutely,daily");
  }
  else {
    url = new URL("https://api.openweathermap.org/data/2.5/weather");
  }

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", process.env.OWM_API_KEY);
  return fetch(url).then(res => res.json());
}

module.exports = router;
